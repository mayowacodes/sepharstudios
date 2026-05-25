import { env } from '$env/dynamic/private';

export function isValidInternalRequest(request: Request): boolean {
	const token = env.SEPHAR_BACKEND_TOKEN || env.ENCODER_AUTOMATION_TOKEN;
	const header = request.headers.get('authorization');

	if (!token || !header) return false;
	return header === `Bearer ${token}`;
}

