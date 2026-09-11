export type ChartKind = 'line' | 'bar' | 'scatter' | 'heatmap';
export type DataPoint = { id: number; timestamp: number; value: number; category: number; signal: number };
export type Metrics = { fps: number; renderMs: number; heapMb: number | null; latencyMs: number };
