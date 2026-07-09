/**
 * Skeleton components — placeholders de carga para componentes asíncronos.
 *
 * Decisión de diseño: usamos divs con animación `animate-pulse` de Tailwind en lugar
 * de librerías externas. Esto mantiene el bundle pequeño y la consistencia visual
 * con el sistema de diseño ya existente (fondo oscuro, bordes sutiles).
 */

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-3 rounded bg-white/5 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white/[0.03] animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton para una Card de KPI (valor + label) */
export function KpiSkeleton() {
  return (
    <div className="glass p-4 space-y-3" aria-hidden="true">
      <div className="flex items-center justify-between">
        <SkeletonLine className="w-24" />
        <SkeletonBlock className="h-5 w-5 rounded" />
      </div>
      <SkeletonLine className="w-16 h-8 rounded" />
      <SkeletonLine className="w-32" />
    </div>
  );
}

/** Skeleton para una fila de tabla (asset, vulnerability, incident) */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <SkeletonLine className={i === 0 ? "w-32" : i === cols - 1 ? "w-16" : "w-24"} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton para tarjeta de threat actor o incidente */
export function CardItemSkeleton() {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 space-y-3" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonLine className="w-40" />
          <SkeletonLine className="w-24" />
        </div>
        <SkeletonBlock className="h-5 w-16 rounded-full ml-4" />
      </div>
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-3/4" />
    </div>
  );
}

/** Skeleton para el gráfico de tendencias */
export function ChartSkeleton({ height = 160 }: { height?: number }) {
  return (
    <div
      className="rounded-lg bg-white/[0.02] animate-pulse w-full"
      style={{ height }}
      aria-hidden="true"
    />
  );
}
