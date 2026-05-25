import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { generateNFTMetadata, narrateNFTPortfolio } from '$lib/server/ai-nft';

/**
 * POST /api/ai/nft
 * AI-generated NFT metadata and portfolio narration.
 *
 * Body types:
 *   { type: 'metadata', contentTitle, contentDescription, bibleReference, genres, topics, contentType, creatorName, editionNumber, totalEditions }
 *   { type: 'portfolio', userDisplayName, nfts[], totalStcBalance }
 */
export const POST = async ({ request, locals }: RequestEvent) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json();
	const { type } = body;

	if (!type) throw error(400, 'type is required');

	switch (type) {
		case 'metadata': {
			const {
				contentTitle,
				contentDescription,
				bibleReference = '',
				genres = [],
				topics = [],
				contentType = 'movie',
				creatorName = 'Sephar Creator',
				editionNumber = 1,
				totalEditions = 1000
			} = body;

			if (!contentTitle || !contentDescription) {
				throw error(400, 'contentTitle and contentDescription required');
			}

			const metadata = await generateNFTMetadata({
				contentTitle,
				contentDescription,
				bibleReference,
				genres,
				topics,
				contentType,
				creatorName,
				editionNumber,
				totalEditions
			});

			if (!metadata) throw error(503, 'NFT metadata generation unavailable');
			return json(metadata);
		}

		case 'portfolio': {
			const { userDisplayName, nfts = [], totalStcBalance = 0 } = body;

			if (!nfts.length) return json({ message: 'No NFTs in portfolio', narration: null });

			const narration = await narrateNFTPortfolio({
				userDisplayName: userDisplayName ?? locals.user.name ?? 'Believer',
				nfts,
				totalStcBalance
			});

			if (!narration) throw error(503, 'Portfolio narration unavailable');
			return json(narration);
		}

		default:
			throw error(400, `Unknown type: ${type}`);
	}
};
