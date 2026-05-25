import { j as json } from './index-BcOZ6EV9.js';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';

const GET = async ({ params }) => {
  const videoId = params.videoId;
  if (!videoId) {
    return json({ error: "Video ID is required" }, { status: 400 });
  }
  try {
    const response = await fetch(`${private_env.ENCODER_API_URL}/api/get-playback-url/${videoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
        // 'Authorization': `Bearer ${env.ENCODER_API_INTERNAL_SECRET}` // If needed
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      return json({
        error: errorData.error || "Failed to retrieve playback URL from encoder"
      }, { status: response.status });
    }
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
//# sourceMappingURL=_server.ts-BAsmD8-T.js.map
