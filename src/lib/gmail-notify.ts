export type EmailPayload = { to: string; subject: string; body: string };

export async function sendGmailNotification(p: EmailPayload): Promise<boolean> {
  try {
    const res = await fetch("https://gmailmcp.googleapis.com/mcp/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: p.to, subject: p.subject, body: p.body, mimeType: "text/html" }),
    });
    if (!res.ok) throw new Error();
    return true;
  } catch {
    // Fallback: mailto
    const text = p.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    window.open(
      `mailto:${p.to}?subject=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(text)}`,
      "_blank",
    );
    return false;
  }
}

export function buildNotificationEmail(params: {
  approverName: string;
  submitterName: string;
  docTitle: string;
  docCode: string;
  docType: string;
  area: string;
  hubUrl: string;
  to: string;
}): EmailPayload {
  const body = `
  <div style="font-family:'Outfit',Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
    <div style="background:#0f1f3d;padding:24px 28px;color:#fff">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9DCA79">Hub Hyndra · Workflow de Aprovação</div>
      <h2 style="margin:8px 0 0;font-size:20px;font-weight:600">Novo documento aguarda sua aprovação</h2>
    </div>
    <div style="padding:24px 28px;color:#1a1a1a">
      <p style="margin:0 0 16px">Olá, ${params.approverName}.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#777">Documento</td><td style="padding:6px 0;text-align:right;font-weight:600">${params.docTitle}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Código</td><td style="padding:6px 0;text-align:right">${params.docCode}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Tipo</td><td style="padding:6px 0;text-align:right">${params.docType}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Área</td><td style="padding:6px 0;text-align:right">${params.area}</td></tr>
        <tr><td style="padding:6px 0;color:#777">Submetido por</td><td style="padding:6px 0;text-align:right">${params.submitterName}</td></tr>
      </table>
      <a href="${params.hubUrl}" style="display:inline-block;margin-top:20px;background:#9DCA79;color:#0f1f3d;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px">Ver no Hub Hyndra →</a>
      <p style="margin:20px 0 0;font-size:11px;color:#999">Hyndra Participações · Hub Hyndra · E-mail automático.</p>
    </div>
  </div>`;
  return {
    to: params.to,
    subject: `[Hub Hyndra] Novo documento para aprovação — ${params.docCode}`,
    body,
  };
}
