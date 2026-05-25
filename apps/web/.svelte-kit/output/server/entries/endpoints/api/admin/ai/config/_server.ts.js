import { json } from "@sveltejs/kit";
import { d as db, b as user } from "../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
import { g as getAIConfig, D as DEFAULT_AI_CONFIG, s as saveAIConfig } from "../../../../../../chunks/ai-settings.js";
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const config = await getAIConfig();
  return json({ config, defaults: DEFAULT_AI_CONFIG });
};
const PUT = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const body = await request.json();
  if (body.providerPreference && !["auto", "ollama", "openrouter"].includes(body.providerPreference)) {
    return json({ error: "Invalid providerPreference value" }, { status: 400 });
  }
  await saveAIConfig({
    chatModel: body.chatModel,
    agentModel: body.agentModel,
    ollamaChatModel: body.ollamaChatModel,
    ollamaAgentModel: body.ollamaAgentModel,
    providerPreference: body.providerPreference
  });
  const updated = await getAIConfig();
  return json({ success: true, config: updated });
};
export {
  GET,
  PUT
};
