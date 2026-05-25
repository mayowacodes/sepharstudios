import { j as json } from './index-BcOZ6EV9.js';
import { d as db, i as creators, c as user } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const defaultPreferences = {
  publicProfile: true,
  emailNotifications: true,
  reviewNotifications: true,
  marketingEmails: false,
  showContactInfo: false
};
const defaultSocial = {
  youtube: "",
  facebook: "",
  instagram: "",
  twitter: "",
  website: "",
  podcast: ""
};
const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [profile] = await db.select().from(creators).where(eq(creators.userId, session.user.id));
  const [account] = await db.select({ name: user.name, email: user.email, image: user.image }).from(user).where(eq(user.id, session.user.id));
  const fullName = profile?.legalName || account?.name || "";
  const [firstName = "", ...restName] = fullName.split(" ");
  const lastName = restName.join(" ");
  const data = {
    creatorType: profile?.creatorType ?? "individual",
    personalInfo: {
      firstName,
      lastName,
      email: profile?.contactEmail ?? account?.email ?? "",
      phone: profile?.contactPhone ?? "",
      bio: profile?.bio ?? "",
      profileImage: profile?.avatarUrl ?? account?.image ?? ""
    },
    ministryInfo: {
      ministryName: profile?.organizationName ?? profile?.displayName ?? "",
      ministryWebsite: profile?.organizationWebsite ?? "",
      denomination: profile?.denomination ?? "",
      yearsInMinistry: profile?.yearsInMinistry ? String(profile.yearsInMinistry) : "",
      ministryDescription: profile?.ministryDescription ?? "",
      ministryAddress: profile?.ministryAddress ?? "",
      isVerified: profile?.isVerified ?? false,
      verificationDocuments: profile?.verificationDocuments ?? []
    },
    socialLinks: {
      ...defaultSocial,
      ...profile?.socialLinks ?? {}
    },
    preferences: {
      ...defaultPreferences,
      ...profile?.preferences ?? {}
    }
  };
  return json({ profile: data });
};
const PUT = async ({ locals, request }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json();
  const [existing] = await db.select().from(creators).where(eq(creators.userId, session.user.id));
  const firstName = payload.personalInfo?.firstName?.trim() ?? "";
  const lastName = payload.personalInfo?.lastName?.trim() ?? "";
  const legalName = [firstName, lastName].filter(Boolean).join(" ").trim() || null;
  const creatorType = payload.creatorType ?? existing?.creatorType ?? "individual";
  const displayName = creatorType === "organization" ? payload.ministryInfo?.ministryName?.trim() : legalName;
  const now = /* @__PURE__ */ new Date();
  const updatePayload = {
    creatorType,
    legalName,
    displayName: displayName || existing?.displayName || session.user.name || "Creator",
    organizationName: payload.ministryInfo?.ministryName ?? existing?.organizationName ?? null,
    organizationWebsite: payload.ministryInfo?.ministryWebsite ?? existing?.organizationWebsite ?? null,
    denomination: payload.ministryInfo?.denomination ?? existing?.denomination ?? null,
    yearsInMinistry: payload.ministryInfo?.yearsInMinistry ? Number(payload.ministryInfo.yearsInMinistry) : existing?.yearsInMinistry ?? null,
    ministryDescription: payload.ministryInfo?.ministryDescription ?? existing?.ministryDescription ?? null,
    ministryAddress: payload.ministryInfo?.ministryAddress ?? existing?.ministryAddress ?? null,
    verificationDocuments: payload.ministryInfo?.verificationDocuments ?? existing?.verificationDocuments ?? null,
    contactEmail: payload.personalInfo?.email ?? existing?.contactEmail ?? session.user.email ?? null,
    contactPhone: payload.personalInfo?.phone ?? existing?.contactPhone ?? null,
    bio: payload.personalInfo?.bio ?? existing?.bio ?? null,
    avatarUrl: payload.personalInfo?.profileImage ?? existing?.avatarUrl ?? null,
    socialLinks: payload.socialLinks ?? existing?.socialLinks ?? null,
    preferences: payload.preferences ?? existing?.preferences ?? null,
    updatedAt: now
  };
  if (existing) {
    const [updated] = await db.update(creators).set(updatePayload).where(eq(creators.id, existing.id)).returning();
    return json({ success: true, profile: updated });
  }
  const [created] = await db.insert(creators).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    isVerified: false,
    createdAt: now,
    ...updatePayload
  }).returning();
  return json({ success: true, profile: created }, { status: 201 });
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-Bve62Cbh.js.map
