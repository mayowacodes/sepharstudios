import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * GET /api/watch/[videoId]
 * 
 * Securely retrieves a signed playback URL for the given video ID.
 * This route acts as a proxy to the internal Encoder API to avoid
 * exposing secrets or direct storage endpoints to the frontend.
 */
export const GET: RequestHandler = async ({ params }) => {
  const videoId = (params as Record<string, string>).videoId;

  if (!videoId) {
    return json({ error: 'Video ID is required' }, { status: 400 });
  }

  // Optional: Check user authorization/subscription status here
  // const session = await locals.auth.validate();
  // if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Call Encoder API to get the playback information
    // The Encoder API is responsible for knowing the jobId/path and signing it
    // if it has the BUNNY_SECRET_KEY. 
    // Alternatively, if we sign it here, we'd need the jobId.
    
    const response = await fetch(`${env.ENCODER_API_URL}/api/get-playback-url/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${env.ENCODER_API_INTERNAL_SECRET}` // If needed
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json({ 
        error: errorData.error || 'Failed to retrieve playback URL from encoder' 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // The encoder API returns: { jobId, playback_url, expires_at }
    return json({
      success: true,
      playbackUrl: data.playback_url,
      expiresAt: data.expires_at,
      jobId: data.jobId
    });

  } catch (error) {
    console.error(`Error fetching playback URL for video ${videoId}:`, error);
    return json({ error: 'Internal server error while fetching playback URL' }, { status: 500 });
  }
};
