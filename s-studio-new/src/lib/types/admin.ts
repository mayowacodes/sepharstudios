// Admin System Types

export enum ExecutiveRoles {
  CEO = 'ceo',
  CTO = 'cto',
  VP_CONTENT = 'vp_content',
  VP_OPERATIONS = 'vp_operations'
}

export enum ContentDirectorRoles {
  CONTENT_DIRECTOR = 'content_director',
  EDITORIAL_DIRECTOR = 'editorial_director',
  ACQUISITIONS_HEAD = 'acquisitions_head'
}

export enum ContentManagerRoles {
  SENIOR_CONTENT_MANAGER = 'senior_content_manager',
  CONTENT_MANAGER = 'content_manager',
  CONTENT_SPECIALIST = 'content_specialist'
}

export enum ReviewRoles {
  THEOLOGICAL_REVIEWER = 'theological_reviewer',
  CONTENT_MODERATOR = 'content_moderator',
  FAMILY_SAFETY_REVIEWER = 'family_safety_reviewer',
  TECHNICAL_REVIEWER = 'technical_reviewer'
}

export enum TechRoles {
  PLATFORM_ADMIN = 'platform_admin',
  DATA_ANALYST = 'data_analyst',
  QA_ENGINEER = 'qa_engineer',
  SUPPORT_MANAGER = 'support_manager'
}

export enum CommunityRoles {
  COMMUNITY_MANAGER = 'community_manager',
  SUPPORT_AGENT = 'support_agent',
  MARKETING_COORDINATOR = 'marketing_coord'
}

export type AdminRole = 
  | ExecutiveRoles 
  | ContentDirectorRoles 
  | ContentManagerRoles 
  | ReviewRoles 
  | TechRoles 
  | CommunityRoles;

export interface AdminUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve')[];
  conditions?: {
    ownContent?: boolean;
    contentType?: string[];
    status?: string[];
  };
}

export enum ReviewType {
  THEOLOGICAL = 'theological',
  CONTENT_MODERATION = 'content_moderation',
  FAMILY_SAFETY = 'family_safety',
  TECHNICAL_QA = 'technical_qa'
}

export enum ReviewResult {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision'
}

export interface ContentReview {
  id: string;
  contentId: string;
  reviewerId: string;
  reviewType: ReviewType;
  result: ReviewResult;
  feedback?: string;
  detailedNotes?: {
    timestamp: number;
    note: string;
    severity: 'info' | 'warning' | 'error';
  }[];
  reviewedAt: Date;
  createdAt: Date;
}

export interface ReviewQueueItem {
  id: string;
  contentId: string;
  title: string;
  creatorName: string;
  contentType: string;
  submittedAt: Date;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  reviewType: ReviewType;
  assignedTo?: string;
  estimatedReviewTime?: number; // in minutes
  dueDate?: Date;
}

export interface ContentAnalytics {
  contentId: string;
  title: string;
  viewership: {
    totalViews: number;
    uniqueViewers: number;
    watchTime: number; // in minutes
    completionRate: number; // percentage
    dropOffPoints: number[]; // timestamps where users stop watching
  };
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    watchlistAdditions: number;
    rating: number; // average rating
  };
  demographics: {
    ageGroups: Record<string, number>;
    geographicDistribution: Record<string, number>;
    deviceTypes: Record<string, number>;
    viewingTimes: Record<string, number>; // hour of day distribution
  };
  performance: {
    trending: boolean;
    discoverySource: Record<string, number>; // how users found the content
    searchRankings: Record<string, number>; // rankings for different keywords
    conversionRate: number; // clicks to actual views
  };
  revenue?: {
    adRevenue: number;
    subscriptionAttribution: number;
    donationsGenerated: number;
  };
}

export interface PlatformAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalContent: number;
    totalViews: number;
    totalWatchTime: number;
  };
  growth: {
    userGrowthRate: number;
    contentGrowthRate: number;
    engagementGrowthRate: number;
  };
  content: {
    topPerformingContent: ContentAnalytics[];
    contentByType: Record<string, number>;
    contentByStatus: Record<string, number>;
    averageReviewTime: number;
  };
  creators: {
    totalCreators: number;
    activeCreators: number;
    topCreators: {
      id: string;
      name: string;
      totalViews: number;
      totalContent: number;
    }[];
  };
  technical: {
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
    bandwidthUsage: number;
  };
}