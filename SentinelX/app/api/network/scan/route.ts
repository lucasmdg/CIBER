import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import si from "systeminformation";

type NetworkInterfaceInfo = {
  iface: string;
  ip: string;
  mac: string;
  speed: number | string;
  status: string;
};

type NetworkConnectionInfo = {
  protocol: string;
  localAddress: string;
  localPort: string;
  peerAddress: string;
  peerPort: string;
  state: string;
  isSuspicious: boolean;
};

type NetworkStatsInfo = {
  iface: string;
  rx_sec: number;
  tx_sec: number;
};

function isPrivateOrLoopbackIP(ip: string): boolean {
  if (!ip || ip === "0.0.0.0" || ip === "::" || ip === "::1" || ip === "127.0.0.1") {
    return true;
  }
  // RFC1918 Private Ranges
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("172.")) {
    const parts = ip.split(".");
    if (parts.length >= 2) {
      const secondPart = parseInt(parts[1], 10);
      if (secondPart >= 16 && secondPart <= 31) return true;
    }
  }
  return false;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  try {
    // 1. Listar interfaces de red
    const interfaces = await si.networkInterfaces();
    const activeInterfaces: NetworkInterfaceInfo[] = (Array.isArray(interfaces) ? interfaces : [interfaces])
      .filter(i => i.ip4 || i.ip6)
      .map(i => ({
        iface: i.iface,
        ip: i.ip4 || i.ip6 || "N/A",
        mac: i.mac || "N/A",
        speed: i.speed ? `${i.speed} Mbps` : "Desconocido",
        status: i.operstate || "unknown"
      }));

    // 2. Conexiones activas TCP/UDP
    const connections = await si.networkConnections();
    const standardPorts = ["80", "443", "22", "3000", "5432", "8080", "5555"];
    
    const activeConnections: NetworkConnectionInfo[] = connections.map(c => {
      const isEstablished = c.state === "ESTABLISHED";
      const isPeerExternal = !isPrivateOrLoopbackIP(c.peerAddress);
      const isStandardLocal = standardPorts.includes(String(c.localPort));
      const isStandardPeer = standardPorts.includes(String(c.peerPort));
      
      // Marcar como sospechoso si está ESTABLISHED a una IP externa y no usa puerto común
      const isSuspicious = isEstablished && isPeerExternal && !isStandardLocal && !isStandardPeer;

      return {
        protocol: c.protocol || "TCP",
        localAddress: c.localAddress || "0.0.0.0",
        localPort: String(c.localPort || "N/A"),
        peerAddress: c.peerAddress || "0.0.0.0",
        peerPort: String(c.peerPort || "N/A"),
        state: c.state || "N/A",
        isSuspicious
      };
    });

    // 3. Estadísticas de tráfico por interfaz (rx_sec y tx_sec)
    const stats = await si.networkStats();
    const networkStats: NetworkStatsInfo[] = stats.map(s => ({
      iface: s.iface,
      rx_sec: s.rx_sec || 0,
      tx_sec: s.tx_sec || 0
    }));

    return NextResponse.json({
      interfaces: activeInterfaces,
      connections: activeConnections,
      stats: networkStats
    });
  } catch (err) {
    console.error("Network scan error:", err);
    return NextResponse.json(
      { error: "No se pudieron obtener los datos de telemetría de red local." },
      { status: 500 }
    );
  }
}
