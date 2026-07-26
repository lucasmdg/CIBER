// app/api/system/resources/route.ts
// GET → CPU, RAM, disco, temperatura en tiempo real

import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
  try {
    const [cpu, mem, disk, temp] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpuTemperature(),
    ]);

    return NextResponse.json({
      cpu: {
        load: parseFloat(cpu.currentLoad.toFixed(1)),
        cores: cpu.cpus.map(c => parseFloat(c.load.toFixed(1))),
      },
      ram: {
        totalGb: parseFloat((mem.total / 1e9).toFixed(1)),
        usedGb: parseFloat((mem.active / 1e9).toFixed(1)),
        freeGb: parseFloat(((mem.total - mem.active) / 1e9).toFixed(1)),
        percent: parseFloat(((mem.active / mem.total) * 100).toFixed(1)),
      },
      disk: disk
        .filter(d => d.size > 0)
        .map(d => ({
          mount: d.mount,
          totalGb: parseFloat((d.size / 1e9).toFixed(1)),
          usedGb: parseFloat((d.used / 1e9).toFixed(1)),
          percent: parseFloat(d.use.toFixed(1)),
          fs: d.type,
        })),
      temp: {
        main: temp.main ?? null,
        cores: temp.cores ?? [],
        max: temp.max ?? null,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
