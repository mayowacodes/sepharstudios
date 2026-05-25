<script lang="ts">
	import { copilotContext, copilotOpen } from '$lib/stores/copilot';
	import { tick } from 'svelte';

	// ── Props ────────────────────────────────────────────────────────────────────
	interface Props { isLoggedIn?: boolean; }
	let { isLoggedIn = false }: Props = $props();

	// ── Types ───────────────────────────────────────────────────────────────────
	interface Message {
		role: 'user' | 'assistant';
		content: string;
		followUps?: string[];
		loginPrompt?: boolean;  // true = show the sign-in CTA instead of text
	}

	// ── State ───────────────────────────────────────────────────────────────────
	let messages: Message[] = $state([]);
	let inputValue = $state('');
	let loading = $state(false);
	let error = $state('');
	let scrollEl: HTMLElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();

	// ── Reactive context ─────────────────────────────────────────────────────────
	let context = $derived($copilotContext);
	let isOpen = $derived($copilotOpen);

	// ── Intro message — changes based on auth + context ───────────────────────
	$effect(() => {
		if ($copilotOpen && messages.length === 0) {
			if (!isLoggedIn) {
				// Teaser for logged-out visitors
				messages = [
					{
						role: 'assistant',
						content: `Hi! I'm Sephar's AI Companion powered by **Gemma 4**.\n\nI can help you discover faith-based content, explore biblical themes, and answer questions about the movies and shows on this platform.\n\nSign in to start chatting — it's free! 👇`,
						followUps: [
							'Recommend an uplifting movie',
							'What\'s on for the whole family?',
							'Explore redemption stories'
						],
						loginPrompt: false
					}
				];
			} else {
				messages = [
					{
						role: 'assistant',
						content: context
							? `Hi! I'm your Sephar Studios companion. I see you're watching **${context.contentTitle}**. What would you like to explore — themes, scenes, biblical context, or something else?`
							: `Hi! I'm your Sephar Studios companion, powered by Gemma 4. Ask me anything about our movies, Christian faith, biblical themes, or content on the platform. How can I help?`,
						followUps: context
							? [
									`What is the main message of "${context.contentTitle}"?`,
									'What Bible verses relate to this story?',
									'Who should watch this?'
								]
							: [
									'Recommend something emotional but uplifting',
									'What movies explore redemption?',
									'Find something faith-based for the whole family'
								]
					}
				];
			}
		}
	});

	// ── Auto-scroll to latest message ─────────────────────────────────────────
	$effect(() => {
		messages; // track reactively
		tick().then(() => {
			scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
		});
	});

	// ── Focus input when opened ───────────────────────────────────────────────
	$effect(() => {
		if (isOpen) {
			tick().then(() => inputEl?.focus());
		}
	});

	// ── Send message ─────────────────────────────────────────────────────────
	async function send(text?: string) {
		const userMessage = (text ?? inputValue).trim();
		if (!userMessage || loading) return;

		inputValue = '';
		error = '';

		// Append the user's message to the thread
		messages = [...messages, { role: 'user', content: userMessage }];

		// ── Not logged in → show login prompt inline instead of calling AI ──
		if (!isLoggedIn) {
			messages = [
				...messages,
				{
					role: 'assistant',
					content: `Great question! To get a full answer from our AI Companion, you'll need to sign in first. It only takes a moment — and it's free!`,
					followUps: [],
					loginPrompt: true
				}
			];
			return;
		}

		loading = true;

		try {
			// Build history (last 6 turns, skip intro + the message we just added)
			const history = messages
				.slice(1, -1)
				.map((m) => ({ role: m.role, content: m.content }));

			const body = context
				? {
						mode: 'chat',
						message: userMessage,
						history,
						contentTitle: context.contentTitle,
						contentDescription: context.contentDescription,
						contentType: context.contentType,
						bibleReference: context.bibleReference ?? '',
						genres: context.genres ?? [],
						topics: context.topics ?? []
					}
				: {
						mode: 'general',
						message: userMessage,
						history
					};

			const res = await fetch('/api/ai/companion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message ?? 'AI service unavailable');
			}

			const data = await res.json();
			messages = [
				...messages,
				{
					role: 'assistant',
					content: data.answer,
					followUps: data.suggestedFollowUps ?? []
				}
			];
		} catch (e: unknown) {
			error = e instanceof Error ? e.message : 'Something went wrong. Try again.';
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	function clearAndClose() {
		copilotOpen.set(false);
		// Reset messages when closed (fresh chat next time)
		setTimeout(() => {
			messages = [];
			error = '';
		}, 300);
	}

	function toggleOpen() {
		copilotOpen.set(!$copilotOpen);
	}
</script>

<!-- ── Floating Button ────────────────────────────────────────────────────── -->
<button
	onclick={toggleOpen}
	aria-label="Open AI Copilot"
	class="copilot-fab"
	class:open={isOpen}
>
	{#if isOpen}
		<!-- X icon -->
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{:else}
		<!-- Sparkle / chat icon -->
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z"/>
			<path d="M5 18L5.75 20.5L8 21.25L5.75 22L5 24.5L4.25 22L2 21.25L4.25 20.5Z" opacity="0.6"/>
		</svg>
	{/if}
</button>

<!-- ── Chat Panel ─────────────────────────────────────────────────────────── -->
{#if isOpen}
<div class="copilot-panel" role="dialog" aria-label="AI Copilot">

	<!-- Header -->
	<div class="copilot-header">
		<div class="copilot-header-left">
			<div class="copilot-avatar" aria-hidden="true">✦</div>
			<div>
				<p class="copilot-title">
					{context ? 'Watch Companion' : 'Sephar Copilot'}
				</p>
				{#if context}
					<p class="copilot-subtitle">{context.contentTitle}</p>
				{:else}
					<p class="copilot-subtitle">Powered by Gemma 4</p>
				{/if}
			</div>
		</div>
		<button onclick={clearAndClose} aria-label="Close copilot" class="copilot-close-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>

	<!-- Messages -->
	<div class="copilot-messages" bind:this={scrollEl}>
		{#each messages as msg (msg)}
			<div class="msg-row" class:user={msg.role === 'user'} class:assistant={msg.role === 'assistant'}>
				{#if msg.role === 'assistant'}
					<div class="msg-icon" aria-hidden="true">✦</div>
				{/if}
				<div class="msg-bubble">
					<!-- Render basic markdown: **bold** and newlines -->
					<p class="msg-text">
						{@html msg.content
							.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
							.replace(/\n/g, '<br>')}
					</p>

					<!-- Login CTA button (shown inside message when loginPrompt=true) -->
					{#if msg.loginPrompt}
						<div class="login-cta-wrap">
							<a href="/auth/login" class="login-cta-btn">
								Sign in — it's free ✦
							</a>
							<a href="/auth/register" class="login-cta-link">Create account</a>
						</div>
					{/if}

					<!-- Follow-up suggestions -->
					{#if msg.followUps && msg.followUps.length > 0 && !loading}
						<div class="follow-ups">
							{#each msg.followUps as fu}
								<button class="follow-up-chip" onclick={() => send(fu)}>
									{fu}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}

		<!-- Typing indicator -->
		{#if loading}
			<div class="msg-row assistant">
				<div class="msg-icon" aria-hidden="true">✦</div>
				<div class="msg-bubble typing">
					<span></span><span></span><span></span>
				</div>
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<p class="copilot-error">{error}</p>
		{/if}
	</div>

	{#if isLoggedIn}
	<!-- Authenticated: full chat input -->
	<div class="copilot-input-area">
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			onkeydown={handleKeydown}
			placeholder={context ? `Ask about "${context.contentTitle}"…` : 'Ask about faith, movies, or content…'}
			disabled={loading}
			class="copilot-input"
			maxlength={500}
		/>
		<button
			onclick={() => send()}
			disabled={loading || !inputValue.trim()}
			aria-label="Send message"
			class="copilot-send-btn"
		>
			{#if loading}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
					<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<line x1="22" y1="2" x2="11" y2="13"></line>
					<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
				</svg>
			{/if}
		</button>
	</div>
	{:else}
	<!-- Guest: type-to-preview input (triggers login wall on send) + sign-in footer -->
	<div class="copilot-input-area">
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			onkeydown={handleKeydown}
			placeholder="Type a question to preview…"
			class="copilot-input"
			maxlength={500}
		/>
		<button
			onclick={() => send()}
			disabled={!inputValue.trim()}
			aria-label="Send message"
			class="copilot-send-btn"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</div>
	<div class="guest-footer">
		<a href="/auth/login" class="guest-signin-btn">Sign in to chat ✦</a>
		<a href="/auth/register" class="guest-register-link">New? Create account →</a>
	</div>
	{/if}
</div>
{/if}

<style>
	/* ── FAB Button ─────────────────────────────────────────────────────────── */
	.copilot-fab {
		position: fixed;
		bottom: 1.75rem;
		right: 1.5rem;
		z-index: 9999;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		color: white;
		box-shadow:
			0 4px 24px rgba(124, 58, 237, 0.45),
			0 0 0 2px rgba(124, 58, 237, 0.15);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.copilot-fab:hover {
		transform: scale(1.07);
		box-shadow: 0 6px 30px rgba(124, 58, 237, 0.6);
	}

	.copilot-fab.open {
		background: linear-gradient(135deg, #4f46e5, #7c3aed);
	}

	/* ── Panel ──────────────────────────────────────────────────────────────── */
	.copilot-panel {
		position: fixed;
		bottom: 5.5rem;
		right: 1.5rem;
		z-index: 9998;
		width: min(420px, calc(100vw - 2rem));
		height: min(580px, calc(100vh - 7rem));
		background: #0f0f14;
		border: 1px solid rgba(124, 58, 237, 0.25);
		border-radius: 1.25rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.6),
			0 0 0 1px rgba(124, 58, 237, 0.1);
		animation: slideUp 0.2s ease;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(1rem) scale(0.97); }
		to   { opacity: 1; transform: translateY(0) scale(1); }
	}

	/* ── Header ─────────────────────────────────────────────────────────────── */
	.copilot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(124, 58, 237, 0.08);
		flex-shrink: 0;
	}

	.copilot-header-left {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.copilot-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		color: white;
		flex-shrink: 0;
	}

	.copilot-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		margin: 0;
		line-height: 1.2;
	}

	.copilot-subtitle {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.4);
		margin: 0;
		line-height: 1.2;
		max-width: 220px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.copilot-close-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(255,255,255,0.4);
		padding: 0.25rem;
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		transition: color 0.15s;
	}

	.copilot-close-btn:hover { color: white; }

	/* ── Messages ───────────────────────────────────────────────────────────── */
	.copilot-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		scroll-behavior: smooth;
	}

	.copilot-messages::-webkit-scrollbar { width: 4px; }
	.copilot-messages::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }

	.msg-row {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.msg-row.user {
		flex-direction: row-reverse;
	}

	.msg-icon {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		color: white;
		flex-shrink: 0;
		margin-bottom: 0.125rem;
	}

	.msg-bubble {
		max-width: 78%;
		padding: 0.625rem 0.875rem;
		border-radius: 1rem;
		font-size: 0.8125rem;
		line-height: 1.55;
	}

	.msg-row.assistant .msg-bubble {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255,255,255,0.07);
		border-bottom-left-radius: 0.25rem;
		color: rgba(255,255,255,0.85);
	}

	.msg-row.user .msg-bubble {
		background: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(79,70,229,0.6));
		border: 1px solid rgba(124,58,237,0.3);
		border-bottom-right-radius: 0.25rem;
		color: white;
	}

	.msg-text {
		margin: 0;
	}

	/* ── Follow-up chips ─────────────────────────────────────────────────────── */
	.follow-ups {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-top: 0.625rem;
	}

	.follow-up-chip {
		background: rgba(124,58,237,0.15);
		border: 1px solid rgba(124,58,237,0.3);
		color: rgba(255,255,255,0.7);
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		text-align: left;
	}

	.follow-up-chip:hover {
		background: rgba(124,58,237,0.3);
		color: white;
	}

	/* ── Typing indicator ────────────────────────────────────────────────────── */
	.typing {
		display: flex;
		gap: 0.3rem;
		align-items: center;
		padding: 0.75rem 1rem !important;
	}

	.typing span {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 9999px;
		background: rgba(124,58,237,0.7);
		animation: bounce 1.2s ease-in-out infinite;
	}

	.typing span:nth-child(2) { animation-delay: 0.2s; }
	.typing span:nth-child(3) { animation-delay: 0.4s; }

	@keyframes bounce {
		0%, 60%, 100% { transform: translateY(0); }
		30% { transform: translateY(-5px); }
	}

	/* ── Error ───────────────────────────────────────────────────────────────── */
	.copilot-error {
		font-size: 0.75rem;
		color: #f87171;
		text-align: center;
		padding: 0.375rem 0.75rem;
		background: rgba(239, 68, 68, 0.1);
		border-radius: 0.5rem;
		border: 1px solid rgba(239,68,68,0.2);
		margin: 0;
	}

	/* ── Input area ─────────────────────────────────────────────────────────── */
	.copilot-input-area {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-top: 1px solid rgba(255,255,255,0.07);
		flex-shrink: 0;
	}

	.copilot-input {
		flex: 1;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.75rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		color: white;
		outline: none;
		transition: border-color 0.15s;
	}

	.copilot-input::placeholder { color: rgba(255,255,255,0.3); }

	.copilot-input:focus {
		border-color: rgba(124,58,237,0.5);
	}

	.copilot-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.copilot-send-btn {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.75rem;
		border: none;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.15s;
		flex-shrink: 0;
	}

	.copilot-send-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		transform: none;
	}

	.copilot-send-btn:not(:disabled):hover {
		transform: scale(1.07);
	}

	.spin {
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	/* ── Login CTA (inline inside assistant bubble) ─────────────────────────── */
	.login-cta-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.login-cta-btn {
		display: block;
		text-align: center;
		padding: 0.5rem 1rem;
		border-radius: 0.75rem;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		color: white;
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s, transform 0.15s;
	}

	.login-cta-btn:hover {
		opacity: 0.9;
		transform: scale(1.02);
	}

	.login-cta-link {
		display: block;
		text-align: center;
		font-size: 0.72rem;
		color: rgba(255,255,255,0.45);
		text-decoration: none;
		transition: color 0.15s;
	}

	.login-cta-link:hover { color: rgba(255,255,255,0.75); }

	/* ── Guest footer (bottom bar replacement) ───────────────────────────────── */
	.guest-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 0.875rem;
		border-top: 1px solid rgba(255,255,255,0.07);
		background: rgba(124,58,237,0.06);
		flex-shrink: 0;
		gap: 0.75rem;
	}

	.guest-signin-btn {
		flex: 1;
		text-align: center;
		padding: 0.45rem 0.875rem;
		border-radius: 0.75rem;
		background: linear-gradient(135deg, #7c3aed, #4f46e5);
		color: white;
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
		white-space: nowrap;
	}

	.guest-signin-btn:hover { opacity: 0.9; }

	.guest-register-link {
		font-size: 0.72rem;
		color: rgba(255,255,255,0.4);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.guest-register-link:hover { color: rgba(255,255,255,0.75); }

	/* ── Mobile ──────────────────────────────────────────────────────────────── */
	@media (max-width: 480px) {
		.copilot-panel {
			bottom: 0;
			right: 0;
			width: 100vw;
			height: 75vh;
			border-radius: 1.25rem 1.25rem 0 0;
		}

		.copilot-fab {
			bottom: 1rem;
			right: 1rem;
		}
	}
</style>
