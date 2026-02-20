import { json, type RequestHandler } from '@sveltejs/kit';
import { getEncoderPresignedUploadUrl } from '$lib/server/minio';
import { env } from '$env/dynamic/private';

const INPUT_BUCKET = env.ENCODER_INPUT_BUCKET || 'encoder-input';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { filename, contentType } = await request.json();
	if (!filename) return json({ error: 'Filename required' }, { status: 400 });

	try {
		const objectName = `${Date.now()}-${filename}`;
		const presignedUrl = await getEncoderPresignedUploadUrl(INPUT_BUCKET, objectName);
		
		return json({ 
			success: true, 
			presignedUrl, 
			objectName,
			publicUrl: `${env.PUBLIC_ENCODER_MINIO_URL}/${INPUT_BUCKET}/${objectName}`
		});
	} catch (error) {
		console.error('Presigned URL error:', error);
		return json({ error: 'Failed to generate presigned URL' }, { status: 500 });
	}
};
