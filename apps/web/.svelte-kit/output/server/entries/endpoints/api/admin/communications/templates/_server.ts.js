import { s as adminMessageTemplates, t as db } from "../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/communications/templates/+server.ts
var defaults = [
	{
		name: "Content Approved",
		subject: "Content Approved - {{contentTitle}}",
		content: "Congratulations! Your content \"{{contentTitle}}\" has been approved for publication.\n\n{{customMessage}}\n\nYour content will be live on the platform within 24 hours.\n\nThank you for contributing to our faith-based community!",
		type: "approval"
	},
	{
		name: "Theological Review Feedback",
		subject: "Theological Review Feedback - {{contentTitle}}",
		content: "Thank you for your submission. During our theological review of \"{{contentTitle}}\", we identified the following areas that need attention:\n\n{{feedbackItems}}\n\nPlease address these items and resubmit for final approval.",
		type: "feedback"
	},
	{
		name: "Content Rejection",
		subject: "Content Rejected - {{contentTitle}}",
		content: "After careful review, we cannot approve \"{{contentTitle}}\" in its current form due to the following concerns:\n\n{{rejectionReasons}}\n\nWe encourage you to revise and resubmit according to our content guidelines.",
		type: "rejection"
	},
	{
		name: "Request for Clarification",
		subject: "Clarification Needed - {{contentTitle}}",
		content: "We need additional information regarding your submission \"{{contentTitle}}\":\n\n{{clarificationItems}}\n\nPlease provide this information so we can continue with the review process.",
		type: "clarification"
	}
];
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const existing = await db.select().from(adminMessageTemplates);
	if (existing.length === 0) {
		await db.insert(adminMessageTemplates).values(defaults);
		return json(defaults);
	}
	return json(existing);
};
//#endregion
export { GET };
