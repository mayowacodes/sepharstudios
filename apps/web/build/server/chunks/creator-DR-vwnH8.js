var ContentType = /* @__PURE__ */ ((ContentType2) => {
  ContentType2["MOVIE"] = "movie";
  ContentType2["SERIES"] = "series";
  ContentType2["EPISODE"] = "episode";
  ContentType2["DOCUMENTARY"] = "documentary";
  ContentType2["SHORT_FILM"] = "short";
  ContentType2["SERMON"] = "sermon";
  ContentType2["WORSHIP"] = "worship";
  ContentType2["KIDS_CONTENT"] = "kids";
  return ContentType2;
})(ContentType || {});
var ContentStatus = /* @__PURE__ */ ((ContentStatus2) => {
  ContentStatus2["DRAFT"] = "draft";
  ContentStatus2["SUBMITTED"] = "submitted";
  ContentStatus2["THEOLOGICAL_REVIEW"] = "theological_review";
  ContentStatus2["CONTENT_REVIEW"] = "content_review";
  ContentStatus2["TECHNICAL_QA"] = "technical_qa";
  ContentStatus2["APPROVED"] = "approved";
  ContentStatus2["PUBLISHED"] = "published";
  ContentStatus2["REJECTED"] = "rejected";
  ContentStatus2["ARCHIVED"] = "archived";
  return ContentStatus2;
})(ContentStatus || {});
var AgeRating = /* @__PURE__ */ ((AgeRating2) => {
  AgeRating2["ALL_AGES"] = "all_ages";
  AgeRating2["SEVEN_PLUS"] = "7+";
  AgeRating2["TEN_PLUS"] = "10+";
  AgeRating2["TWELVE_PLUS"] = "12+";
  AgeRating2["SIXTEEN_PLUS"] = "16+";
  AgeRating2["EIGHTEEN_PLUS"] = "18+";
  return AgeRating2;
})(AgeRating || {});
var UploadStep = /* @__PURE__ */ ((UploadStep2) => {
  UploadStep2[UploadStep2["BASIC_INFO"] = 1] = "BASIC_INFO";
  UploadStep2[UploadStep2["VIDEO_UPLOAD"] = 2] = "VIDEO_UPLOAD";
  UploadStep2[UploadStep2["ASSET_MANAGEMENT"] = 3] = "ASSET_MANAGEMENT";
  UploadStep2[UploadStep2["METADATA"] = 4] = "METADATA";
  UploadStep2[UploadStep2["REVIEW_SUBMIT"] = 5] = "REVIEW_SUBMIT";
  return UploadStep2;
})(UploadStep || {});

export { AgeRating as A, ContentStatus as C, UploadStep as U, ContentType as a };
//# sourceMappingURL=creator-DR-vwnH8.js.map
