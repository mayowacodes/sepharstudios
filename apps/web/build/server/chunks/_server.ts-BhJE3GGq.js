import { p as private_env } from './shared-server-DUDL94jl.js';
import { j as json } from './index-5kYmxIr9.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/watch/[videoId]/+server.ts
/**
* GET /api/watch/[videoId]
* 
* Securely retrieves a signed playback URL for the given video ID.
* This route acts as a proxy to the internal Encoder API to avoid
* exposing secrets or direct storage endpoints to the frontend.
*/
var GET = async ({ params }) => {
	const videoId = params.videoId;
	if (!videoId) return json({ error: "Video ID is required" }, { status: 400 });
	try {
		const response = await fetch(`${private_env.ENCODER_API_URL}/api/get-playback-url/${videoId}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});
		if (!response.ok) return json({ error: (await response.json()).error || "Failed to retrieve playback URL from encoder" }, { status: response.status });
		const data = await response.json();
		return json({
			success: true,
			playbackUrl: data.playback_url,
			expiresAt: data.expires_at,
			jobId: data.jobId
		});
	} catch (error) {
		console.error(`Error fetching playback URL for video ${videoId}:`, error);
		return json({ error: "Internal server error while fetching playback URL" }, { status: 500 });
	}
};

export { GET };
//# sourceMappingURL=_server.ts-BhJE3GGq.js.map
