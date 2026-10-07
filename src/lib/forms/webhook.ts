/**
 * Envio de formulários para um webhook configurável (POST com JSON).
 * Funciona com Google Apps Script (planilha), Formspree, Make, Zapier, n8n,
 * Discord ou Slack, sem SDK nem conta paga. Só roda no servidor.
 */
export async function enviarParaWebhook(url: string, payload: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
