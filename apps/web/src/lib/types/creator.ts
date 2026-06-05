// Creator Platform Types
export interface Creator {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string;
  ministryName?: string;
  ministryWebsite?: string;
  socialLinks?: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContentType {
  MOVIE = 'movie',
  SERIES = 'series',
  EPISODE = 'episode',
  DOCUMENTARY = 'documentary',
  SHORT_FILM = 'short',
  SERMON = 'sermon',
  WORSHIP = 'worship',
  KIDS_CONTENT = 'kids'
}

export enum ContentStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  THEOLOGICAL_REVIEW = 'theological_review',
  CONTENT_REVIEW = 'content_review',
  TECHNICAL_QA = 'technical_qa',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export enum AgeRating {
  ALL_AGES = 'all_ages',
  SEVEN_PLUS = '7+',
  TEN_PLUS = '10+',
  TWELVE_PLUS = '12+',
  SIXTEEN_PLUS = '16+',
  EIGHTEEN_PLUS = '18+'
}

export interface ContentAssets {
  // Card Images (Different aspect ratios for different contexts)
  posterPortrait?: string;     // 2:3 ratio - Main movie cards
  posterSquare?: string;       // 1:1 ratio - Mobile/compact views
  posterLandscape?: string;    // 16:9 ratio - Horizontal cards
  
  // Background Images
  backdropHero?: string;       // 16:9 HD - Hero carousel background
  backdropModal?: string;      // 16:9 HD - Movie modal background
  backdropMobile?: string;     // Mobile-optimized backdrop
  
  // Promotional Assets
  logoTitle?: string;          // Transparent PNG - Movie title logo
  thumbnail?: string;          // Video preview thumbnail
  bannerPromo?: string;        // Promotional banner (campaigns)
  
  // Social/Meta Images
  ogImage?: string;            // Open Graph sharing image
  iconSmall?: string;          // Small icon for lists
}

export interface ContentSubmission {
  id?: string;
  creatorId: string;
  title: string;
  description: string;
  contentType: ContentType;
  ageRating: AgeRating;
  
  // Video Files
  videoUrl?: string;
  trailerUrl?: string;
  
  // Assets
  assets: ContentAssets;
  
  // Faith-based metadata
  bibleReferences?: string[];
  themes?: string[];
  ministryAffiliation?: string;
  
  // Technical metadata
  duration?: number; // in minutes
  language: string;
  hasSubtitles: boolean;
  hasClosedCaptions: boolean;
  
  // Status and workflow
  status: ContentStatus;
  submittedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  
  // SEO and discoverability
  tags?: string[];
  keywords?: string[];
  genre?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadProgress {
  stepNumber: number;
  totalSteps: number;
  stepName: string;
  isCompleted: boolean;
  hasError: boolean;
  errorMessage?: string;
  data?: any;
}

export interface VideoUploadProgress {
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  progressPercentage: number;
  isUploading: boolean;
  isCompleted: boolean;
  hasError: boolean;
  errorMessage?: string;
  uploadUrl?: string;
  objectName?: string;
}

export interface AssetUploadProgress {
  assetType: keyof ContentAssets;
  fileName: string;
  fileSize: number;
  progressPercentage: number;
  isCompleted: boolean;
  hasError: boolean;
  errorMessage?: string;
  url?: string;
}

// Upload wizard steps
export enum UploadStep {
  BASIC_INFO = 1,
  VIDEO_UPLOAD = 2,
  ASSET_MANAGEMENT = 3,
  METADATA = 4,
  REVIEW_SUBMIT = 5
}

export interface UploadWizardState {
  currentStep: UploadStep;
  stepData: {
    // Every field is required and DEFINED — Svelte 5 `$bindable()` props
    // crash with `props_invalid_value` if the parent's `bind:` target
    // resolves to `undefined`. The contentType/ageRating widen to include
    // `''` so the "not-yet-selected" state is a valid value (not undefined).
    [UploadStep.BASIC_INFO]: {
      title: string;
      description: string;
      contentType: ContentType | '';
      ageRating: AgeRating | '';
    };
    [UploadStep.VIDEO_UPLOAD]: {
      videoFile: File | null;
      trailerFile: File | null;
      videoProgress: VideoUploadProgress | null;
      trailerProgress: VideoUploadProgress | null;
    };
    [UploadStep.ASSET_MANAGEMENT]: {
      uploadedAssets: Partial<ContentAssets>;
      assetProgress: AssetUploadProgress[];
    };
    // `duration` widens to `number | ''` because a number-input field that
    // hasn't been touched holds `''`, and the bindable child also accepts
    // that — keeps the two halves in agreement.
    [UploadStep.METADATA]: {
      bibleReferences: string[];
      themes: string[];
      ministryAffiliation: string;
      duration: number | '';
      language: string;
      hasSubtitles: boolean;
      hasClosedCaptions: boolean;
      tags: string[];
      keywords: string[];
      genre: string[];
    };
    [UploadStep.REVIEW_SUBMIT]: {
      termsAccepted: boolean;
      guidelinesAccepted: boolean;
    };
  };
  isValid: {
    [key in UploadStep]: boolean;
  };
}