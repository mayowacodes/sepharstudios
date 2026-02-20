import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const data = await request.json();
	const { inputKey, title } = data;

	if (!inputKey) return json({ error: 'Input key required' }, { status: 400 });

	try {
		const response = await fetch(`${env.ENCODER_API_URL}/api/process-video`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Add internal API key if needed
			},
			body: JSON.stringify({
				inputKey,
				title: title || 'Untitled Content',
				// The encoder settings are usually preset in the backend or passed here
				options: {
					qualities: ['360p', '480p', '720p', '1080p'],
					generateDash: true,
					generateHls: true
				}
			})
		});

		const result = await response.json();
		return json({ success: response.ok, ...result });
	} catch (error) {
		console.error('Encoder trigger error:', error);
		return json({ error: 'Failed to trigger encoder' }, { status: 500 });
	}
};
