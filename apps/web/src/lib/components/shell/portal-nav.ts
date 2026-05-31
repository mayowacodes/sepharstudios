import {
	Home, Sparkles, Activity, BarChart3,
	ShieldCheck, Video, FileText,
	Users, User, ShieldAlert,
	Banknote, Scale, Wallet, FileCheck,
	Settings, Landmark, Upload, MessageSquare,
	type Icon as IconType
} from '@lucide/svelte';

/**
 * Portal navigation config. One entry per group; each group has an
 * uppercase label and a list of nav items. Icons are Lucide components,
 * not emoji — emoji don't scale with text and look dated in the new
 * sidebar.
 *
 * Used by `PortalShell.svelte` to render the grouped sidebar menu.
 * The order here is the visual order in the sidebar.
 */

export interface NavItem {
	href: string;
	label: string;
	icon: typeof IconType;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

export const ADMIN_NAV: NavGroup[] = [
	{
		label: 'Overview',
		items: [
			{ href: '/admin', label: 'Dashboard', icon: Home },
			{ href: '/admin/ai-runs', label: 'AI Runs', icon: Sparkles },
			{ href: '/admin/system-health', label: 'System health', icon: Activity },
			{ href: '/admin/analytics', label: 'Analytics', icon: BarChart3 }
		]
	},
	{
		label: 'Catalog',
		items: [
			{ href: '/admin/review', label: 'Review queue', icon: ShieldCheck },
			{ href: '/admin/content', label: 'Content', icon: Video },
			{ href: '/admin/creator-applications', label: 'Applications', icon: FileText }
		]
	},
	{
		label: 'Community',
		items: [
			{ href: '/admin/creators', label: 'Creators', icon: Users },
			{ href: '/admin/users', label: 'Audience', icon: User },
			{ href: '/admin/abuse', label: 'Abuse', icon: ShieldAlert }
		]
	},
	{
		label: 'Finance',
		items: [
			{ href: '/admin/refunds', label: 'Refunds', icon: Banknote },
			{ href: '/admin/disputes', label: 'Disputes', icon: Scale },
			{ href: '/admin/payouts', label: 'Payouts', icon: Wallet },
			{ href: '/admin/tax-forms', label: 'Tax forms', icon: FileCheck }
		]
	},
	{
		label: 'Settings',
		items: [
			{ href: '/admin/governance', label: 'Governance', icon: Landmark },
			{ href: '/admin/settings', label: 'Settings', icon: Settings }
		]
	}
];

export const CREATOR_NAV: NavGroup[] = [
	{
		label: 'Make',
		items: [
			{ href: '/creator', label: 'Dashboard', icon: Home },
			{ href: '/creator/upload', label: 'Upload', icon: Upload }
		]
	},
	{
		label: 'Manage',
		items: [
			{ href: '/creator/content', label: 'Content', icon: Video },
			{ href: '/creator/analytics', label: 'Analytics', icon: BarChart3 },
			{ href: '/creator/moderation', label: 'Moderation', icon: ShieldCheck },
			{ href: '/creator/inbox', label: 'Inbox', icon: MessageSquare },
			{ href: '/creator/profile', label: 'Profile', icon: User },
			{ href: '/creator/guidelines', label: 'Guidelines', icon: FileText }
		]
	}
];

/** Flat lookup of every route → label, for the breadcrumb. */
export function buildLabelMap(groups: NavGroup[]): Record<string, string> {
	const out: Record<string, string> = {};
	for (const g of groups) {
		for (const item of g.items) out[item.href] = item.label;
	}
	return out;
}

export const ADMIN_LABELS = buildLabelMap(ADMIN_NAV);
export const CREATOR_LABELS = buildLabelMap(CREATOR_NAV);
