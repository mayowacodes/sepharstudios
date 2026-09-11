import { j as json, p as private_env } from './index.js-BP8aAXBX.js';
import { a as getEncoderPresignedUploadUrl } from './minio-B7gIRc1u.js';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import 'minio';

//#region src/routes/api/encoder/presigned/+server.ts
var INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || "encoder-input";
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const { filename, contentType } = await request.json();
	if (!filename) return json({ error: "Filename required" }, { status: 400 });
	try {
		const objectName = `${Date.now()}-${filename}`;
		return json({
			success: true,
			presignedUrl: await getEncoderPresignedUploadUrl(INPUT_BUCKET, objectName),
			objectName,
			publicUrl: `${private_env.PUBLIC_ENCODER_MINIO_URL}/${INPUT_BUCKET}/${objectName}`
		});
	} catch (error) {
		console.error("Presigned URL error:", error);
		return json({ error: "Failed to generate presigned URL" }, { status: 500 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-ChsrqG5T.js.map
