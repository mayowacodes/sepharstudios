<script lang="ts">
	import { copilotContext, copilotOpen } from '$lib/stores/copilot';
	import { tick } from 'svelte';

	interface Props { isLoggedIn?: boolean; }
	let { isLoggedIn = false }: Props = $props();

	interface Message {
		role: 'user' | 'assistant';
		content: string;
		followUps?: string[];
		loginPrompt?: boolean;
	}

	let messages: Message[] = $state([]);
	let inputValue = $state('');
	let loading = $state(false);
	let error = $state('');
	let scrollEl: HTMLElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();

	let context = $derived($copilotContext);
	let isOpen = $derived($copilotOpen);

	$effect(() => {
		if ($copilotOpen && messages.length === 0) {
			if (!isLoggedIn) {
				messages = [
					{
						role: 'assistant',
						content: `Hi! I'm Sephar's AI Companion.\n\nI can help you discover faith-based content, explore biblical themes, and answer questions about the movies and shows on this platform.\n\nSign in to start chatting — it's free!`,
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
							? `Hi! I see you're watching **${context.contentTitle}**. What would you like to explore — themes, scenes, biblical context, or something else?`
							: `Hi! I'm your Sephar Studios companion. Ask me anything about our movies, Christian faith, biblical themes, or content on the platform. How can I help?`,
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

	$effect(() => {
		messages;
		tick().then(() => {
			scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
		});
	});

	$effect(() => {
		if (isOpen) {
			tick().then(() => inputEl?.focus());
		}
	});

	async function send(text?: string) {
		const userMessage = (text ?? inputValue).trim();
		if (!userMessage || loading) return;

		inputValue = '';
		error = '';

		messages = [...messages, { role: 'user', content: userMessage }];

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
		setTimeout(() => {
			messages = [];
			error = '';
		}, 300);
	}

	function toggleOpen() {
		copilotOpen.set(!$copilotOpen);
	}
</script>

<button
	onclick={toggleOpen}
	aria-label="Open AI Copilot"
	class="copilot-fab"
	class:open={isOpen}
>
	{#if isOpen}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
		</svg>
	{/if}
</button>

{#if isOpen}
<div class="copilot-panel" role="dialog" aria-label="AI Copilot">

	<div class="copilot-header">
		<div class="copilot-header-left">
			<div class="copilot-avatar" aria-hidden="true">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
				</svg>
			</div>
			<div>
				<p class="copilot-title">{context ? 'Watch Companion' : 'Copilot'}</p>
				{#if context}
					<p class="copilot-subtitle">{context.contentTitle}</p>
				{/if}
			</div>
		</div>
		<button onclick={clearAndClose} aria-label="Close copilot" class="copilot-close-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>

	<div class="copilot-messages" bind:this={scrollEl}>
		{#each messages as msg (msg)}
			<div class="msg-row" class:user={msg.role === 'user'} class:assistant={msg.role === 'assistant'}>
				{#if msg.role === 'assistant'}
					<div class="msg-icon" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
				{/if}
				<div class="msg-bubble">
					<p class="msg-text">
						{@html msg.content
							.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
							.replace(/\n/g, '<br>')}
					</p>

					{#if msg.loginPrompt}
						<div class="login-cta-wrap">
							<a href="/auth/login" class="login-cta-btn">Sign in — it's free</a>
							<a href="/auth/register" class="login-cta-link">Create account</a>
						</div>
					{/if}

					{#if msg.followUps && msg.followUps.length > 0 && !loading}
						<div class="follow-ups">
							{#each msg.followUps as fu}
								<button class="follow-up-chip" onclick={() => send(fu)}>{fu}</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}

		{#if loading}
			<div class="msg-row assistant">
				<div class="msg-icon" aria-hidden="true">
					<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
					</svg>
				</div>
				<div class="msg-bubble typing">
					<span></span><span></span><span></span>
				</div>
			</div>
		{/if}

		{#if error}
			<p class="copilot-error">{error}</p>
		{/if}
	</div>

	{#if isLoggedIn}
	<div class="copilot-input-area">
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			onkeydown={handleKeydown}
			placeholder={context ? `Ask about "${context.contentTitle}"\u2026` : 'Ask about faith, movies, or content\u2026'}
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
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
					<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<line x1="22" y1="2" x2="11" y2="13"></line>
					<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
				</svg>
			{/if}
		</button>
	</div>
	{:else}
	<div class="copilot-input-area">
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			onkeydown={handleKeydown}
			placeholder="Type a question to preview\u2026"
			class="copilot-input"
			maxlength={500}
		/>
		<button
			onclick={() => send()}
			disabled={!inputValue.trim()}
			aria-label="Send message"
			class="copilot-send-btn"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</div>
	<div class="guest-footer">
		<a href="/auth/login" class="guest-signin-btn">Sign in to chat</a>
		<a href="/auth/register" class="guest-register-link">Create account</a>
	</div>
	{/if}
</div>
{/if}

<style>
	.copilot-fab {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 9999;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsl(var(--primary));
		color: white;
		box-shadow: 0 4px 20px hsla(var(--primary) / 0.4);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.copilot-fab:hover {
		transform: scale(1.06);
		box-shadow: 0 6px 28px hsla(var(--primary) / 0.55);
	}

	.copilot-fab.open {
		background: hsl(var(--secondary));
		box-shadow: 0 4px 20px hsla(var(--secondary) / 0.4);
	}

	.copilot-panel {
		position: fixed;
		bottom: 5rem;
		right: 1.25rem;
		z-index: 9998;
		width: min(400px, calc(100vw - 2rem));
		height: min(540px, calc(100vh - 6.5rem));
		background: var(--glass-bg);
		backdrop-filter: blur(var(--blur-glass));
		-webkit-backdrop-filter: blur(var(--blur-glass));
		border: 1px solid var(--glass-border);
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: var(--shadow-glass);
		animation: slideUp 0.2s ease;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(0.75rem); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.copilot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0.875rem;
		border-bottom: 1px solid var(--glass-border);
		flex-shrink: 0;
	}

	.copilot-header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.copilot-avatar {
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background: hsl(var(--primary));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
	}

	.copilot-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: rgba(255,255,255,0.9);
		margin: 0;
		line-height: 1.2;
	}

	.copilot-subtitle {
		font-size: 0.65rem;
		color: rgba(255,255,255,0.35);
		margin: 0;
		line-height: 1.2;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.copilot-close-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(255,255,255,0.3);
		padding: 0.25rem;
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		transition: color 0.15s;
	}

	.copilot-close-btn:hover { color: white; }

	.copilot-messages {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		scroll-behavior: smooth;
	}

	.copilot-messages::-webkit-scrollbar { width: 3px; }
	.copilot-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

	.msg-row {
		display: flex;
		gap: 0.4rem;
		align-items: flex-end;
	}

	.msg-row.user { flex-direction: row-reverse; }

	.msg-icon {
		width: 1.35rem;
		height: 1.35rem;
		border-radius: 9999px;
		background: hsl(var(--primary) / 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
		margin-bottom: 0.125rem;
	}

	.msg-bubble {
		max-width: 80%;
		padding: 0.5rem 0.75rem;
		border-radius: 0.875rem;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.msg-row.assistant .msg-bubble {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.06);
		border-bottom-left-radius: 0.2rem;
		color: rgba(255,255,255,0.8);
	}

	.msg-row.user .msg-bubble {
		background: hsl(var(--primary) / 0.15);
		border: 1px solid hsl(var(--primary) / 0.2);
		border-bottom-right-radius: 0.2rem;
		color: rgba(255,255,255,0.9);
	}

	.msg-text { margin: 0; }

	.follow-ups {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.5rem;
	}

	.follow-up-chip {
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		color: rgba(255,255,255,0.55);
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.68rem;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
		text-align: left;
	}

	.follow-up-chip:hover {
		background: hsl(var(--primary) / 0.15);
		color: white;
	}

	.typing {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		padding: 0.625rem 0.875rem !important;
	}

	.typing span {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 9999px;
		background: hsl(var(--primary));
		animation: bounce 1.2s ease-in-out infinite;
	}

	.typing span:nth-child(2) { animation-delay: 0.2s; }
	.typing span:nth-child(3) { animation-delay: 0.4s; }

	@keyframes bounce {
		0%, 60%, 100% { transform: translateY(0); }
		30% { transform: translateY(-4px); }
	}

	.copilot-error {
		font-size: 0.72rem;
		color: #f87171;
		text-align: center;
		padding: 0.3rem 0.625rem;
		background: rgba(239,68,68,0.08);
		border-radius: 0.5rem;
		border: 1px solid rgba(239,68,68,0.15);
		margin: 0;
	}

	.copilot-input-area {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.625rem;
		border-top: 1px solid var(--glass-border);
		flex-shrink: 0;
	}

	.copilot-input {
		flex: 1;
		background: rgba(255,255,255,0.04);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 0.625rem;
		padding: 0.4rem 0.75rem;
		font-size: 0.8rem;
		color: white;
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
		min-height: 0;
	}
	.copilot-input:focus-visible {
		/* WCAG SC 2.4.7 — replace the suppressed outline with a visible ring.
		   Uses the primary brand color, matched to the rest of the focus styles. */
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.4);
	}

	.copilot-input::placeholder { color: rgba(255,255,255,0.25); }

	.copilot-input:focus {
		border-color: hsl(var(--primary) / 0.5);
	}

	.copilot-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.copilot-send-btn {
		width: 2rem;
		height: 2rem;
		border-radius: 0.625rem;
		border: none;
		background: hsl(var(--primary));
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.15s;
		flex-shrink: 0;
	}

	.copilot-send-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}

	.copilot-send-btn:not(:disabled):hover {
		transform: scale(1.06);
	}

	.spin { animation: spin 0.8s linear infinite; }

	@keyframes spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	.login-cta-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.625rem;
	}

	.login-cta-btn {
		display: block;
		text-align: center;
		padding: 0.4rem 0.875rem;
		border-radius: 0.625rem;
		background: hsl(var(--primary));
		color: white;
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.login-cta-btn:hover { opacity: 0.9; }

	.login-cta-link {
		display: block;
		text-align: center;
		font-size: 0.7rem;
		color: rgba(255,255,255,0.35);
		text-decoration: none;
		transition: color 0.15s;
	}

	.login-cta-link:hover { color: rgba(255,255,255,0.6); }

	.guest-footer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-top: 1px solid var(--glass-border);
		flex-shrink: 0;
	}

	.guest-signin-btn {
		flex: 1;
		text-align: center;
		padding: 0.4rem 0.75rem;
		border-radius: 0.625rem;
		background: hsl(var(--primary));
		color: white;
		font-size: 0.78rem;
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.15s;
		white-space: nowrap;
	}

	.guest-signin-btn:hover { opacity: 0.9; }

	.guest-register-link {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.3);
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.guest-register-link:hover { color: rgba(255,255,255,0.55); }

	@media (max-width: 480px) {
		.copilot-panel {
			bottom: 0;
			right: 0;
			width: 100vw;
			height: 75vh;
			border-radius: 1rem 1rem 0 0;
		}

		.copilot-fab {
			bottom: 0.75rem;
			right: 0.75rem;
		}
	}
</style>
