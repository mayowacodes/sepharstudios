import { type BaseClientOptions, buildClient, type SchemaInference, type XataRecord } from "@xata.io/client"

const tables = [
  {
    name: "users",
    columns: [
      { name: "email", type: "email", unique: true },
      { name: "name", type: "string" },
      { name: "password", type: "string" },
      { name: "role", type: "string", defaultValue: "USER" },
      { name: "avatar", type: "string", optional: true },
      { name: "bio", type: "text", optional: true },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "sessions",
    columns: [
      { name: "userId", type: "string" },
      { name: "expiresAt", type: "datetime" },
    ],
  },
  {
    name: "apiKeys",
    columns: [
      { name: "name", type: "string" },
      { name: "key", type: "string", unique: true },
      { name: "userId", type: "string" },
      { name: "lastUsed", type: "datetime", optional: true },
      { name: "expiresAt", type: "datetime", optional: true },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "software",
    columns: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "description", type: "text" },
      { name: "fileUrl", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "downloads",
    columns: [
      { name: "userId", type: "string" },
      { name: "softwareId", type: "string" },
      { name: "ipAddress", type: "string", optional: true },
      { name: "userAgent", type: "text", optional: true },
      { name: "timestamp", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "notifications",
    columns: [
      { name: "userId", type: "string" },
      { name: "title", type: "string" },
      { name: "message", type: "text" },
      { name: "read", type: "bool", defaultValue: false },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "userPreferences",
    columns: [
      { name: "userId", type: "string", unique: true },
      { name: "language", type: "string", defaultValue: "en" },
      { name: "theme", type: "string", defaultValue: "light" },
      { name: "newsletter", type: "bool", defaultValue: true },
    ],
  },
  {
    name: "auditLogs",
    columns: [
      { name: "userId", type: "string" },
      { name: "action", type: "string" },
      { name: "details", type: "json", optional: true },
      { name: "ipAddress", type: "string", optional: true },
      { name: "userAgent", type: "text", optional: true },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "webhooks",
    columns: [
      { name: "userId", type: "string" },
      { name: "url", type: "string" },
      { name: "events", type: "multiple" },
      { name: "secret", type: "string" },
      { name: "active", type: "bool", defaultValue: true },
      { name: "lastCalled", type: "datetime", optional: true },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "posts",
    columns: [
      { name: "title", type: "string" },
      { name: "slug", type: "string", unique: true },
      { name: "content", type: "text" },
      { name: "excerpt", type: "text" },
      { name: "published", type: "bool", defaultValue: false },
      { name: "authorId", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "tags",
    columns: [
      { name: "name", type: "string", unique: true },
      { name: "slug", type: "string", unique: true },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "postTags",
    columns: [
      { name: "postId", type: "string" },
      { name: "tagId", type: "string" },
    ],
  },
  {
    name: "comments",
    columns: [
      { name: "content", type: "text" },
      { name: "postId", type: "string" },
      { name: "authorId", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "featureRequests",
    columns: [
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "status", type: "string", defaultValue: "UNDER_REVIEW" },
      { name: "authorId", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "votes",
    columns: [
      { name: "requestId", type: "string" },
      { name: "userId", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "requestComments",
    columns: [
      { name: "content", type: "text" },
      { name: "requestId", type: "string" },
      { name: "authorId", type: "string" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "faqs",
    columns: [
      { name: "question", type: "string" },
      { name: "answer", type: "text" },
      { name: "category", type: "string" },
      { name: "order", type: "int" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
      { name: "updatedAt", type: "datetime", defaultValue: "now" },
    ],
  },
  {
    name: "changelogs",
    columns: [
      { name: "version", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "changes", type: "json" },
      { name: "releaseDate", type: "datetime" },
      { name: "createdAt", type: "datetime", defaultValue: "now" },
    ],
  },
] as const

export type SchemaTables = typeof tables
export type DatabaseSchema = SchemaInference<SchemaTables>
export type User = DatabaseSchema["users"]
export type Session = DatabaseSchema["sessions"]
export type ApiKey = DatabaseSchema["apiKeys"]
export type Software = DatabaseSchema["software"]
export type Download = DatabaseSchema["downloads"]
export type Notification = DatabaseSchema["notifications"]
export type UserPreference = DatabaseSchema["userPreferences"]
export type AuditLog = DatabaseSchema["auditLogs"]
export type Webhook = DatabaseSchema["webhooks"]
export type Post = DatabaseSchema["posts"]
export type Tag = DatabaseSchema["tags"]
export type PostTag = DatabaseSchema["postTags"]
export type Comment = DatabaseSchema["comments"]
export type FeatureRequest = DatabaseSchema["featureRequests"]
export type Vote = DatabaseSchema["votes"]
export type RequestComment = DatabaseSchema["requestComments"]
export type FAQ = DatabaseSchema["faqs"]
export type Changelog = DatabaseSchema["changelogs"]

export type DatabaseRecord = XataRecord & {
  id: string
}

const DatabaseClient = buildClient()

const defaultOptions = {
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH || "main",
}

export class XataClient extends DatabaseClient<SchemaTables> {
  constructor(options?: Partial<BaseClientOptions>) {
    super({ ...defaultOptions, ...options }, tables)
  }
}

let instance: XataClient | undefined = undefined

export const getXataClient = () => {
  if (instance) return instance

  instance = new XataClient()
  return instance
}

