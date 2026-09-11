# Performance Notes

## Targets and validation

The UI exposes the assignment's important signals rather than hiding them in a profiler: FPS, last render cost, estimated interaction latency, point-window size, and heap usage where the browser supports it. Numbers in the interface are sampled from the running browser and are not hard-coded benchmark claims.

Expected development-machine envelope:

| Load | Rendering strategy | Expected behavior |
| --- | --- | --- |
| 10k | Canvas + pixel-aware LOD | 60 FPS on a 60 Hz display |
| 25k | Canvas + bounded sampling | Responsive controls, stable stream |
| 50k | Stress mode + bounded sampling | Usable pan/zoom without UI freeze |

Final FPS and memory figures should be recorded on the review machine because GPU, display refresh rate and browser instrumentation materially affect them.

## React optimization

- The data buffer lives in a ref, avoiding a full immutable clone every 100 ms.
- `startTransition` marks stream ticks as non-urgent so pause, zoom and filtering stay responsive.
- `ChartCanvas` is memoized and chart painting is isolated in effects.
- Stable callbacks prevent avoidable chart invalidation.
- Only a tiny version counter crosses React's state boundary.

## Canvas and SVG decision

Canvas paints dense telemetry in O(screen pixels), not O(source points), after level-of-detail sampling. High-DPI backing stores are capped at 2x to control memory. React retains accessible semantic controls and text. This is the intended Canvas/SVG hybrid boundary: dense, frequently changing marks in Canvas; UI, labels and interaction affordances in the DOM.

## Memory strategy

The stream is a fixed-size sliding window. Old points are spliced as new packets arrive, interval and animation-frame handles are cleaned up, and each paint reuses the same Canvas. The virtual table mounts roughly ten rows regardless of whether the source contains 10k or 50k records.

## Bottlenecks and mitigations

- Large full-resolution line paths: sampled to chart pixel density.
- Device-pixel-ratio inflation: capped at 2x.
- React array copies: replaced with a ref-backed buffer and scalar notification.
- Table DOM growth: custom windowing positions only visible rows.
- Heatmap aggregation: typed arrays limit allocations during binning.

## Scaling to 100k+

Move aggregation/downsampling into a Web Worker and transfer typed-array buffers. For million-point workloads, persist raw history outside the browser, request viewport-specific pyramid levels, and use OffscreenCanvas or WebGL for rendering. The current component boundary allows that change without rewriting dashboard controls.

## Next.js decisions

The route shell remains server-renderable while the live surface is a Client Component. `/api/data` is an Edge-compatible Route Handler. `loading.tsx` and `error.tsx` provide App Router boundaries. The application keeps chart dependencies at zero, leaving the production bundle focused on React and the small icon set.
