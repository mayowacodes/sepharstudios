//#region src/lib/types/admin.ts
var ReviewType = /* @__PURE__ */ function(ReviewType) {
	ReviewType["THEOLOGICAL"] = "theological";
	ReviewType["CONTENT_MODERATION"] = "content_moderation";
	ReviewType["FAMILY_SAFETY"] = "family_safety";
	ReviewType["TECHNICAL_QA"] = "technical_qa";
	return ReviewType;
}({});
var ReviewResult = /* @__PURE__ */ function(ReviewResult) {
	ReviewResult["APPROVED"] = "approved";
	ReviewResult["REJECTED"] = "rejected";
	ReviewResult["NEEDS_REVISION"] = "needs_revision";
	return ReviewResult;
}({});

export { ReviewResult as R, ReviewType as a };
//# sourceMappingURL=admin-CV_SQoTq.js.map
