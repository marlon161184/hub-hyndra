import type { DocSection } from "@/data/documents";
import type { SubmissionDocType } from "@/data/submissions";
import { convertDocument as convertDocumentServer } from "@/lib/convert.functions";

export type ConversionResult = {
  title: string;
  summary: string;
  sections: DocSection[];
};

export async function convertDocument(
  fileText: string,
  fileName: string,
  docType: SubmissionDocType,
  area: string,
): Promise<ConversionResult> {
  const result = await convertDocumentServer({ data: { fileText, fileName, docType, area } });
  return result as ConversionResult;
}

export async function extractText(file: File): Promise<string> {
  const ab = await file.arrayBuffer();

  if (file.type === "application/pdf") {
    const lib = (window as any).pdfjsLib;
    if (!lib) throw new Error("PDF.js não carregado.");
    const pdf = await lib.getDocument({ data: ab }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((it: { str: string }) => it.str).join(" "));
    }
    return pages.join("\n\n");
  }

  const mammoth = (window as any).mammoth;
  if (!mammoth) throw new Error("Mammoth.js não carregado.");
  return (await mammoth.extractRawText({ arrayBuffer: ab })).value;
}
