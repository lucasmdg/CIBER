import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit/logger";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Debe proporcionar el ID del análisis a eliminar." }, { status: 400 });
    }

    // Verificar si la entrada de análisis existe
    const exists = await prisma.fileAnalysis.findUnique({
      where: { id }
    });

    if (!exists) {
      await audit({
        actor: session?.user?.email ?? "anonymous",
        action: "file_analysis.delete.fail",
        target: id,
        meta: { reason: "not_found" }
      });
      return NextResponse.json({ error: "No se encontró el análisis especificado." }, { status: 404 });
    }

    // Proceder a eliminar de la base de datos
    await prisma.fileAnalysis.delete({
      where: { id }
    });

    await audit({
      actor: session?.user?.email ?? "anonymous",
      action: "file_analysis.delete.success",
      target: id,
      meta: { filename: exists.filename }
    });

    return NextResponse.json({ message: "Análisis eliminado con éxito." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
