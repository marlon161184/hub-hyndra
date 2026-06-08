import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const blockSchema = z.union([
  z.object({ kind: z.literal("p"), text: z.string() }),
  z.object({ kind: z.literal("subheading"), text: z.string() }),
  z.object({ kind: z.literal("list"), items: z.array(z.string()), ordered: z.boolean().optional() }),
  z.object({
    kind: z.literal("table"),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    caption: z.string().optional(),
  }),
  z.object({ kind: z.literal("info"), text: z.string() }),
  z.object({ kind: z.literal("warning"), text: z.string() }),
]);

const resultSchema = z.object({
  title: z.string(),
  summary: z.string(),
  sections: z.array(
    z.object({ id: z.string(), title: z.string(), blocks: z.array(blockSchema) }),
  ),
});

const inputSchema = z.object({
  fileText: z.string().min(20).max(120000),
  fileName: z.string().min(1).max(300),
  docType: z.enum(["Política", "Procedimento", "Fluxograma"]),
  area: z.string().min(1).max(120),
});

const SYSTEM = `Você é especialista em governança corporativa da Hyndra Participações.
Converta o conteúdo recebido para um documento estruturado no padrão Hyndra.

BLOCOS DISPONÍVEIS:
- p: parágrafo de texto
- subheading: subtítulo dentro de uma seção
- list: lista (ordered=true para numerada)
- table: tabela com headers e rows
- info: nota de contexto
- warning: regra crítica ou alerta legal

PADRÃO POLÍTICA — seções: 1.Objetivo 2.Abrangência 3.Princípios 4.Responsabilidades(tabela: Instância|Responsabilidade) 5.Diretrizes 6.Vigência e Revisão
PADRÃO PROCEDIMENTO — seções: 1.Objetivo 2.Escopo 3.Responsabilidades(tabela) 4+.Fases(tabela: Etapa|Descrição|Responsável|Prazo) N.Regras
PADRÃO FLUXOGRAMA — seções: 1.Objetivo 2.Participantes 3.Etapas(lista ordenada) 4.Decisões e Exceções 5.Documentos Relacionados
Use "warning" para regras críticas e alertas legais. Use "info" para notas de contexto.
Os ids das seções devem ser slugs curtos (ex.: "objetivo"). Os títulos devem ser numerados (ex.: "1. Objetivo").`;

export const convertDocument = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const typeCtx = {
      "Política": "POLÍTICA institucional",
      "Procedimento": "PROCEDIMENTO OPERACIONAL (SOP)",
      "Fluxograma": "FLUXOGRAMA de processo",
    }[data.docType];

    const gateway = createLovableAiGatewayProvider(key);
    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      output: Output.object({ schema: resultSchema }),
      prompt: `Tipo: ${typeCtx}\nÁrea: ${data.area}\nArquivo: ${data.fileName}\n\nCONTEÚDO:\n---\n${data.fileText}\n---`,
    });

    return output;
  });
