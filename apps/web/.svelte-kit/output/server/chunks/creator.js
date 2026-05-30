//#region src/lib/types/creator.ts
var ContentType = /* @__PURE__ */ function(ContentType) {
	ContentType["MOVIE"] = "movie";
	ContentType["SERIES"] = "series";
	ContentType["EPISODE"] = "episode";
	ContentType["DOCUMENTARY"] = "documentary";
	ContentType["SHORT_FILM"] = "short";
	ContentType["SERMON"] = "sermon";
	ContentType["WORSHIP"] = "worship";
	ContentType["KIDS_CONTENT"] = "kids";
	return ContentType;
}({});
var ContentStatus = /* @__PURE__ */ function(ContentStatus) {
	ContentStatus["DRAFT"] = "draft";
	ContentStatus["SUBMITTED"] = "submitted";
	ContentStatus["THEOLOGICAL_REVIEW"] = "theological_review";
	ContentStatus["CONTENT_REVIEW"] = "content_review";
	ContentStatus["TECHNICAL_QA"] = "technical_qa";
	ContentStatus["APPROVED"] = "approved";
	ContentStatus["PUBLISHED"] = "published";
	ContentStatus["REJECTED"] = "rejected";
	ContentStatus["ARCHIVED"] = "archived";
	return ContentStatus;
}({});
var AgeRating = /* @__PURE__ */ function(AgeRating) {
	AgeRating["ALL_AGES"] = "all_ages";
	AgeRating["SEVEN_PLUS"] = "7+";
	AgeRating["TEN_PLUS"] = "10+";
	AgeRating["TWELVE_PLUS"] = "12+";
	AgeRating["SIXTEEN_PLUS"] = "16+";
	AgeRating["EIGHTEEN_PLUS"] = "18+";
	return AgeRating;
}({});
var UploadStep = /* @__PURE__ */ function(UploadStep) {
	UploadStep[UploadStep["BASIC_INFO"] = 1] = "BASIC_INFO";
	UploadStep[UploadStep["VIDEO_UPLOAD"] = 2] = "VIDEO_UPLOAD";
	UploadStep[UploadStep["ASSET_MANAGEMENT"] = 3] = "ASSET_MANAGEMENT";
	UploadStep[UploadStep["METADATA"] = 4] = "METADATA";
	UploadStep[UploadStep["REVIEW_SUBMIT"] = 5] = "REVIEW_SUBMIT";
	return UploadStep;
}({});
//#endregion
export { UploadStep as i, ContentStatus as n, ContentType as r, AgeRating as t };
