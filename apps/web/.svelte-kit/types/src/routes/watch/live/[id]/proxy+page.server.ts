// @ts-nocheck
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { liveStreams } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, 'Please sign in to watch the live stream');

	const [stream] = await db.select({
		id: liveStreams.id,
		creatorId: liveStreams.creatorId,
		title: liveStreams.title,
		description: liveStreams.description,
		playbackUrl: liveStreams.playbackUrl,
		thumbnailUrl: liveStreams.thumbnailUrl,
		status: liveStreams.status,
		visibility: liveStreams.visibility,
		viewerCount: liveStreams.viewerCount,
		startedAt: liveStreams.startedAt,
		recordingMediaId: liveStreams.recordingMediaId,
		creatorName: user.name
	})
		.from(liveStreams)
		.leftJoin(user, eq(user.id, liveStreams.creatorId))
		.where(eq(liveStreams.id, params.id))
		.limit(1);

	if (!stream) error(404, 'Stream not found');

	const isOwner = stream.creatorId === session.user.id;
	if (stream.visibility === 'private' && !isOwner) error(404, 'Stream not found');

	const isAdmin = session.user.role === 'admin';
	const canModerateChat = isOwner || isAdmin;

	return { stream, isOwner, canModerateChat };
};
