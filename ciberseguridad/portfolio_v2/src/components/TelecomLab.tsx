"use client";

import GlowCard from "./GlowCard";
import { FiberManualRecord, Router, Dns, Cable } from "@/lib/icons";

export default function TelecomLab() {
  return (
    <section id="telecom" className="section-spacing relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-dim border border-accent/20 rounded-full text-xs font-mono text-accent tracking-wider mb-4">
            INFRAESTRUCTURA
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Laboratorio de{" "}
            <span className="gradient-text">Telecomunicaciones</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Infraestructura física y redes desplegadas con estándares profesionales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <GlowCard className="lg:col-span-2 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Cable style={{ width: 20, height: 20 }} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Fibra Óptica · FTTH/GPON</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Fusion splicing, certificación de enlaces, medición de pérdidas ópticas y
                  despliegue de infraestructura GPON. Diagnóstico de red óptica con OTDR y
                  verificación de presupuesto óptico en topologías punto-multipunto.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Fusion Splicing", "OTDR", "GPON", "FTTH", "Splitter Óptico", "Presupuesto Óptico"].map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-accent-dim rounded-md text-[11px] font-mono text-accent/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-6 md:p-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-dim border border-cyan/20 flex items-center justify-center mb-4">
              <Router style={{ width: 20, height: 20 }} className="text-cyan" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Telefonía · ICT</h3>
            <p className="text-sm text-muted leading-relaxed">
              Instalaciones de Telecomunicaciones (ICT), cableado estructurado, centralitas
              VoIP, sistemas analógicos y despliegue conforme a normativa.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["VoIP", "Cableado Estructurado", "Centralitas", "ICT"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-cyan-dim rounded-md text-[11px] font-mono text-cyan/80">
                  {t}
                </span>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-6 md:p-8">
            <div className="w-10 h-10 rounded-xl bg-teal-dim border border-teal/20 flex items-center justify-center mb-4">
              <Dns style={{ width: 20, height: 20 }} className="text-teal" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Hardware · Raspberry Pi</h3>
            <p className="text-sm text-muted leading-relaxed">
              Clúster de Raspberry Pi para servicios de red: servidor DNS/DHCP local,
              pivoting hardware, orquestación IoT y entornos de laboratorio aislados.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Raspberry Pi", "DNS/DHCP", "Pivoting", "IoT", "Linux Server"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-teal-dim rounded-md text-[11px] font-mono text-teal/80">
                  {t}
                </span>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-6 md:p-8">
            <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center mb-4">
              <FiberManualRecord style={{ width: 20, height: 20 }} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Redes y Sistemas</h3>
            <p className="text-sm text-muted leading-relaxed">
              Configuración de switches gestionados, VLANs, routing estático/dinámico,
              firewalls iptables/nftables, y monitorización con SNMP.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["VLANs", "Routing", "Firewall", "SNMP", "nftables"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-accent-dim rounded-md text-[11px] font-mono text-accent/80">
                  {t}
                </span>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
