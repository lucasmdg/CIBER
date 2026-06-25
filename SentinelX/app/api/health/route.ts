import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const [load, mem] = await Promise.all([
      si.currentLoad(),
      si.mem()
    ]);
    
    const cpu = parseFloat(load.currentLoad.toFixed(1));
    const freeMemPercent = (mem.free / mem.total) * 100;
    const memUsage = parseFloat((100 - freeMemPercent).toFixed(1));
    
    return NextResponse.json({
      status: "ok",
      ts: new Date().toISOString(),
      cpu,
      mem: memUsage
    });
  } catch (err) {
    return NextResponse.json({
      status: "degraded",
      ts: new Date().toISOString(),
      error: (err as Error).message
    });
  }
}
