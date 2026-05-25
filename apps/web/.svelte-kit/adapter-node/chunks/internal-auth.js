import { p as private_env } from "./shared-server.js";
function isValidInternalRequest(request) {
  const token = private_env.SEPHAR_BACKEND_TOKEN || private_env.ENCODER_AUTOMATION_TOKEN;
  const header = request.headers.get("authorization");
  if (!token || !header) return false;
  return header === `Bearer ${token}`;
}
export {
  isValidInternalRequest as i
};
