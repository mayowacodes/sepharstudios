import { callAgent, callChat, extractJsonObject, SEPHAR_SYSTEM_PROMPT } from './ai-provider';

/**
 * NFT CONTENT LAYER — AI LORE & METADATA GENERATOR
 *   generateNFTMetadata()  → callAgent({ provider: 'openrouter' })  — structured JSON at mint time
 *   narrateNFTPortfolio()  → callChat()                             — warm narrative, local Gemma 4
 */

export interface NFTMetadata {
	name: string;
	description: string;
	narrativeMeaning: string;
	biblicalContext: string;
	rarityContext: string;
	collectionTheme: string;
	attributes: NFTAttribute[];
	aiProvider: string;
}

export interface NFTAttribute {
	trait_type: string;
	value: string | number;
}

export interface NFTPortfolioNarration {
	summary: string;
	totalValue: string;
	spiritualJourney: string;
	topHolding: string;
	aiProvider: string;
}

export async function generateNFTMetadata(opts: {
	contentTitle: string;
	contentDescription: string;
	bibleReference: string;
	genres: string[];
	topics: string[];
	contentType: string;
	creatorName: string;
	editionNumber: number;
	totalEditions: number;
}): Promise<NFTMetadata | null> {
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Generate rich NFT metadata for a faith-based content NFT on the Sephar Studios platform.

Content: "${opts.contentTitle}"
Type: ${opts.contentType}
Creator: ${opts.creatorName}
Description: "${opts.contentDescription}"
Bible Reference: "${opts.bibleReference}"
Genres: ${opts.genres.join(', ')}
Themes: ${opts.topics.join(', ')}
Edition: #${opts.editionNumber} of ${opts.totalEditions}

Return ONLY this JSON:
{
  "name": "Sephar NFT: ${opts.contentTitle} #${opts.editionNumber}",
  "description": "A story-backed digital collectible...",
  "narrativeMeaning": "This story captures...",
  "biblicalContext": "Based on ${opts.bibleReference}, this piece demonstrates...",
  "rarityContext": "As edition #${opts.editionNumber} of only ${opts.totalEditions}...",
  "collectionTheme": "Faith Journey Collection",
  "attributes": [
    {"trait_type": "Content Type", "value": "${opts.contentType}"},
    {"trait_type": "Bible Reference", "value": "${opts.bibleReference}"},
    {"trait_type": "Edition", "value": "${opts.editionNumber}/${opts.totalEditions}"},
    {"trait_type": "Theme", "value": "Redemption"},
    {"trait_type": "Creator", "value": "${opts.creatorName}"}
  ]
}

Guidelines:
- description: 2–3 sentences, compelling on-chain description
- narrativeMeaning: why this story matters spiritually (2–3 sentences)
- biblicalContext: explain the Bible reference in context (1–2 sentences)
- rarityContext: explain edition rarity and collectible value
- collectionTheme: one of [Faith Journey, Redemption Stories, Kids & Family, Worship Experience, Biblical Epic, Testimony Collection]
- attributes: keep the given ones, add 1–2 more based on content themes`
			}
		],
		{ provider: 'openrouter', temperature: 0.4, maxTokens: 768, timeoutMs: 20000 }
	);

	if (!result) return null;
	const parsed = extractJsonObject<Omit<NFTMetadata, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}

export async function narrateNFTPortfolio(opts: {
	userDisplayName: string;
	nfts: Array<{ title: string; contentType: string; bibleReference?: string; editionNumber?: number; totalEditions?: number }>;
	totalStcBalance: number;
}): Promise<NFTPortfolioNarration | null> {
	if (opts.nfts.length === 0) return null;

	const nftSummary = opts.nfts
		.slice(0, 10)
		.map((n) => `- "${n.title}" (${n.contentType}${n.bibleReference ? `, ${n.bibleReference}` : ''})`)
		.join('\n');

	const result = await callChat(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Write a warm, personalized narrative for a faith-based NFT portfolio.

User: ${opts.userDisplayName}
STC Balance: ${opts.totalStcBalance} STC
NFT Collection (${opts.nfts.length} items):
${nftSummary}

Return ONLY this JSON:
{
  "summary": "Your collection tells a story of...",
  "totalValue": "With ${opts.nfts.length} story-backed NFTs and ${opts.totalStcBalance} STC...",
  "spiritualJourney": "Looking at your collection, the thread of faith that runs through...",
  "topHolding": "Your most notable piece is..."
}

Keep each field to 1–2 sentences. Warm, encouraging, faith-affirming tone.`
			}
		],
		{ temperature: 0.5, maxTokens: 512 }
	);

	if (!result) return null;
	const parsed = extractJsonObject<Omit<NFTPortfolioNarration, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
