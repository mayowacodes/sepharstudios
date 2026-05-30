import { p as private_env } from './shared-server-DUDL94jl.js';
import { j as json } from './index-5kYmxIr9.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/encoder/process/+server.ts
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const { inputKey, title } = await request.json();
	if (!inputKey) return json({ error: "Input key required" }, { status: 400 });
	try {
		const response = await fetch(`${private_env.ENCODER_API_URL}/api/process-video`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				inputKey,
				title: title || "Untitled Content",
				options: {
					qualities: [
						"360p",
						"480p",
						"720p",
						"1080p"
					],
					generateDash: true,
					generateHls: true
				}
			})
		});
		const result = await response.json();
		return json({
			success: response.ok,
			...result
		});
	} catch (error) {
		console.error("Encoder trigger error:", error);
		return json({ error: "Failed to trigger encoder" }, { status: 500 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BDdxANIE.js.map
