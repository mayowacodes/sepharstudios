import { json } from "@sveltejs/kit";
import { g as getEncoderPresignedUploadUrl } from "../../../../../chunks/minio.js";
import { p as private_env } from "../../../../../chunks/shared-server.js";
const INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || "encoder-input";
const POST = async ({ request, locals }) => {
  const session = await locals.auth.validate();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { filename, contentType } = await request.json();
  if (!filename) return json({ error: "Filename required" }, { status: 400 });
  try {
    const objectName = `${Date.now()}-${filename}`;
    const presignedUrl = await getEncoderPresignedUploadUrl(INPUT_BUCKET, objectName);
    return json({
      success: true,
      presignedUrl,
      objectName,
      publicUrl: `${private_env.PUBLIC_ENCODER_MINIO_URL}/${INPUT_BUCKET}/${objectName}`
    });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
};
export {
  POST
};
