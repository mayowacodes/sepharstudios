import { t as private_env } from "../../../../../chunks/shared-server.js";
import { r as getEncoderPresignedUploadUrl } from "../../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { POST };
