import type { FileType } from "$lib/constants";

export interface iEmailMeta {
  to: string;
  subject: string;
  meta: { description: string; link: string; };
}

export interface iUpload {
  url: string;
  fileType: FileType;
  fileId: string;
}

export interface EmailConfig {
  brandName: string;
  brandColor: string;
  brandLogo?: string;
  supportEmail: string;
  websiteUrl: string;
}
