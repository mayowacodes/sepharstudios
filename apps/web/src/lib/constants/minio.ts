export const BUCKETS = {
	COMPLIANCE: 'compliance', // NFT/Royalty/Audit
	MASTERS: 'masters',       // Versioning: ON, Locking: ON
	STREAMS: 'streams',       // Versioning: ON
	SEGMENTS: 'segments',     // Locking: ON
	METADATA: 'metadata',     // Versioning: ON, Locking: ON
	UPLOADS: 'uploads',       // No special config
	THUMBNAILS: 'thumbnails', // No special config
	DRM: 'drm',               // No special config
	VIDEOS: 'videos',         // Versioning: ON, Locking: ON
	CREATOR_DOCS: 'creator-documents' // Creator application docs
} as const;

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS];
