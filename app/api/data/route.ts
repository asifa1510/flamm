import { generateData } from '@/lib/dataGenerator';
export const runtime='edge';
export async function GET(request:Request){const url=new URL(request.url);const count=Math.min(50000,Math.max(100,Number(url.searchParams.get('count'))||10000));return Response.json({generatedAt:Date.now(),count,data:generateData(count)},{headers:{'Cache-Control':'public, max-age=5'}})}
