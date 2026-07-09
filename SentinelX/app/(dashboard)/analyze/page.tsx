"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { ShieldCheck, ShieldAlert, ShieldX, UploadCloud, Trash2, FileText, CheckCircle, Database, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type FileAnalysisRecord = {
  id: string;
  filename: string;
  sha256: string;
  md5: string;
  fileType: string;
  sizeBytes: number;
  entropy: number;
  verdict: "clean" | "suspicious" | "likely_malicious";
  score: number;
  suspiciousStrings: string[];
  createdAt: string;
};

export default function AnalyzePage() {
  const [history, setHistory] = React.useState<FileAnalysisRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(true);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [currentAnalysis, setCurrentAnalysis] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const toast = useToast();

  async function loadHistory() {
    try {
      const res = await fetch("/api/analyze/file");
      if (!res.ok) throw new Error("Fallo al cargar el historial de análisis.");
      const json = await res.json();
      setHistory(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  }

  React.useEffect(() => {
    loadHistory();
  }, []);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setError(null);
    setAnalyzing(true);
    setCurrentAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze/file", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fallo en el análisis del archivo.");
      
      setCurrentAnalysis(data);
      loadHistory();
      toast.push({
        title: "Análisis completado",
        description: `Muestra "${file.name}" analizada con veredicto: ${data.verdict.toUpperCase()}`,
        tone: data.verdict === "clean" ? "success" : data.verdict === "suspicious" ? "warn" : "danger"
      });
    } catch (err) {
      setError((err as Error).message);
      toast.push({
        title: "Error de análisis",
        description: (err as Error).message,
        tone: "danger"
      });
    } finally {
      setAnalyzing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  async function deleteRecord(id: string) {
    const backupHistory = [...history];
    
    // Optimistic Update: remove from UI instantly
    setHistory(prev => prev.filter(x => x.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }

    try {
      const res = await fetch(`/api/analyze/file/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo eliminar el registro en el servidor.");
      }

      toast.push({
        title: "Registro eliminado",
        description: "El análisis ha sido borrado del historial.",
        tone: "success"
      });
    } catch (err) {
      // Rollback on fail
      setHistory(backupHistory);
      toast.push({
        title: "Error al eliminar",
        description: (err as Error).message,
        tone: "danger"
      });
    }
  }

  return (
    <>
      <PageHeader
        title="Static File Analyzer"
        description="Analiza archivos de forma 100% defensiva mediante hashes, firmas hex, entropía y strings sospechosos. Límite de 10 MB."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel izquierdo: Cargador de Archivos y Veredicto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Cargar Muestra</CardTitle>
                <CardSubtitle>Arrastra un archivo o haz clic para seleccionarlo (Máx 10 MB)</CardSubtitle>
              </div>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition cursor-pointer ${
                  isDragActive
                    ? "border-cyber-500 bg-cyber-500/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/5"
                }`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-10 w-10 text-cyber-400 mb-3 animate-pulse" />
                <p className="text-sm font-medium text-slate-200">
                  {isDragActive ? "Suelta el archivo aquí..." : "Arrastra y suelta un archivo aquí"}
                </p>
                <p className="text-xs text-slate-500 mt-1">O haz clic para buscar en el equipo</p>
              </div>

              {analyzing && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-cyber-300">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyber-500 border-t-transparent" />
                  <span>EJECUTANDO ANÁLISIS ESTÁTICO...</span>
                </div>
              )}

              {error && (
                <p className="mt-4 text-xs font-mono text-danger bg-danger/5 border border-danger/20 rounded p-2">
                  Error: {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Veredicto actual */}
          {currentAnalysis && (
            <Card className={
              currentAnalysis.verdict === "likely_malicious"
                ? "border-danger/30 bg-danger/5"
                : currentAnalysis.verdict === "suspicious"
                ? "border-warning/30 bg-warning/5"
                : "border-success/30 bg-success/5"
            }>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resultado del Análisis</CardTitle>
                    <CardSubtitle className="font-mono">{currentAnalysis.filename}</CardSubtitle>
                  </div>
                  <span>
                    {currentAnalysis.verdict === "likely_malicious" ? (
                      <ShieldX className="h-6 w-6 text-danger" />
                    ) : currentAnalysis.verdict === "suspicious" ? (
                      <ShieldAlert className="h-6 w-6 text-warning" />
                    ) : (
                      <ShieldCheck className="h-6 w-6 text-success" />
                    )}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Veredicto:</span>
                  <span className={`font-bold uppercase tracking-wider ${
                    currentAnalysis.verdict === "likely_malicious"
                      ? "text-danger"
                      : currentAnalysis.verdict === "suspicious"
                      ? "text-warning"
                      : "text-success"
                  }`}>
                    {currentAnalysis.verdict === "likely_malicious"
                      ? "ALTAMENTE SOSPECHOSO"
                      : currentAnalysis.verdict === "suspicious"
                      ? "SOSPECHOSO"
                      : "LIMPIO"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Sospecha Score:</span>
                  <span className="font-bold">{currentAnalysis.score} / 100</span>
                </div>

                <div className="grid gap-1 border-b border-white/5 pb-2">
                  <span className="text-slate-400">Tipo de archivo (Magic Bytes):</span>
                  <span className="text-slate-200">{currentAnalysis.fileType}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Entropía de Shannon:</span>
                  <span className={`font-bold ${currentAnalysis.entropy > 7.0 ? "text-warning" : "text-slate-200"}`}>
                    {currentAnalysis.entropy.toFixed(4)} {currentAnalysis.entropy > 7.0 ? "(SOSPECHOSA / CIFRADA)" : ""}
                  </span>
                </div>

                <div className="grid gap-1 border-b border-white/5 pb-2">
                  <span className="text-slate-400">SHA-256:</span>
                  <span className="text-[10px] text-slate-200">{currentAnalysis.sha256}</span>
                </div>

                <div className="grid gap-1 border-b border-white/5 pb-2">
                  <span className="text-slate-400">MD5:</span>
                  <span className="text-[10px] text-slate-200">{currentAnalysis.md5}</span>
                </div>

                {currentAnalysis.peInfo && currentAnalysis.peInfo.hasPESignature && (
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-slate-400 block mb-1">Secciones PE Windows detectadas:</span>
                    <ul className="space-y-1 bg-black/40 p-2 rounded text-[10px]">
                      {currentAnalysis.peInfo.sections.map((sec: any, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span className="text-cyber-300 font-semibold">{sec.name}</span>
                          <span>VS: {sec.virtualSize} B | RS: {sec.rawSize} B</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block mb-1">Strings Sospechosos detectados ({currentAnalysis.suspiciousStrings.length}):</span>
                  {currentAnalysis.suspiciousStrings.length > 0 ? (
                    <ul className="space-y-1 max-h-32 overflow-y-auto bg-black/40 p-2 rounded text-[11px] scrollbar-thin">
                      {currentAnalysis.suspiciousStrings.map((str: string, index: number) => (
                        <li key={index} className="text-warning-300">• {str}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-success text-[10px]">Ninguno</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel derecho: Historial de análisis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial de Muestras</CardTitle>
                <CardSubtitle>Últimos 20 análisis registrados en la base de datos</CardSubtitle>
              </div>
              <Database className="h-4 w-4 text-cyber-300" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyber-500 border-t-transparent" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-xs text-slate-500">
                <FileText className="h-6 w-6" />
                <span>No hay análisis registrados todavía.</span>
              </div>
            ) : (
              <div className="scrollbar-thin max-h-[500px] overflow-y-auto pr-1">
                <ul className="divide-y divide-white/5">
                  {history.map(item => (
                    <li key={item.id} className="py-3 flex items-start justify-between gap-3">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => setCurrentAnalysis(item)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200 hover:text-cyber-400 transition">
                            {item.filename}
                          </span>
                          <Badge tone={
                            item.verdict === "likely_malicious"
                              ? "fail"
                              : item.verdict === "suspicious"
                              ? "warn"
                              : "ok"
                          }>
                            {item.verdict}
                          </Badge>
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-slate-400">
                          <div>Type: {item.fileType}</div>
                          <div>SHA-256: {item.sha256.substring(0, 16)}...</div>
                          <div className="text-slate-500">
                            {new Date(item.createdAt).toLocaleString()} · {(item.sizeBytes / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-danger hover:bg-danger/10 px-2 py-1 transition-colors duration-200"
                        onClick={() => setDeleteTargetId(item.id)}
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">Confirmar Eliminación</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              ¿Estás seguro de que deseas eliminar permanentemente este registro del historial? Esta acción actualizará la telemetría local de forma optimista y se propagará a la base de datos de manera definitiva.
            </p>
            <div className="flex justify-end gap-3 font-mono text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTargetId(null)}
                className="border-white/10 text-slate-300 hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (deleteTargetId) {
                    deleteRecord(deleteTargetId);
                    setDeleteTargetId(null);
                  }
                }}
              >
                Confirmar Borrado
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
