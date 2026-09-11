export const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));
export function downsample<T>(items:T[],target:number){if(items.length<=target)return items;const step=items.length/target;return Array.from({length:target},(_,i)=>items[Math.floor(i*step)])}
