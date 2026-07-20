import { Ct as attr_style, Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Tt as bind_props, Wt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Upload } from "../../../../../chunks/upload.js";
import { t as User } from "../../../../../chunks/user.js";
import { t as X } from "../../../../../chunks/x.js";
import { n as toast } from "../../../../../chunks/toast-state.svelte.js";
import { t as page } from "../../../../../chunks/state.js";
import { t as PortalHero } from "../../../../../chunks/PortalHero.js";
import { i as UploadStep, r as ContentType, t as AgeRating } from "../../../../../chunks/creator.js";
//#region src/lib/components/creator/upload/StepIndicator.svelte
function StepIndicator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { steps, currentStep, onStepClick } = $$props;
		$$renderer.push(`<div class="flex items-center justify-between w-full"><!--[-->`);
		const each_array = ensure_array_like(steps);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let step = each_array[index];
			$$renderer.push(`<div class="flex items-center w-full"><button type="button"${attr_class(`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${index < currentStep ? "bg-primary text-white" : index === currentStep ? "bg-white text-black" : "bg-gray-700 text-gray-400"}`)}${attr("aria-label", `Step ${index + 1}: ${step.label}`)}>${escape_html(index + 1)}</button> <div${attr_class(`ml-2 text-sm ${index === currentStep ? "text-white" : "text-gray-400"}`)}>${escape_html(step.label)}</div> `);
			if (index < steps.length - 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(`flex-1 h-0.5 mx-4 ${index < currentStep ? "bg-primary" : "bg-gray-700"}`)}></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/BasicInfoStep.svelte
function BasicInfoStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title = "", description = "", contentType = "", ageRating = "", audience = "general", episodeTitle = "", seasonNumber = 1, episodeNumber = 1, comingSoon = false, comingSoonReleaseDate = "" } = $$props;
		const minComingSoonDate = (() => {
			const d = /* @__PURE__ */ new Date();
			const p = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
		})();
		const isSeries = derived(() => contentType === ContentType.SERIES);
		const episodeLabel = derived(() => `S${seasonNumber || 1} E${episodeNumber || 1}`);
		const contentTypes = [
			{
				value: ContentType.MOVIE,
				label: "🎬 Movie",
				description: "Full-length feature film"
			},
			{
				value: ContentType.SERIES,
				label: "📺 Series",
				description: "TV series or web series"
			},
			{
				value: ContentType.SHORT_FILM,
				label: "🎞️ Short Film",
				description: "Short narrative content"
			},
			{
				value: ContentType.DOCUMENTARY,
				label: "📚 Documentary",
				description: "Educational or informational content"
			}
		];
		const audiences = [
			{
				value: "general",
				label: "General",
				description: "Appears on /movies, /shows, or /documentaries"
			},
			{
				value: "kids",
				label: "Kiddies",
				description: "Appears on the Kiddies portal"
			},
			{
				value: "teens",
				label: "Teens",
				description: "Appears on the Teens portal"
			}
		];
		const ageRatings = [
			{
				value: AgeRating.ALL_AGES,
				label: "All Ages",
				description: "Suitable for everyone"
			},
			{
				value: AgeRating.SEVEN_PLUS,
				label: "7+",
				description: "Ages 7 and above"
			},
			{
				value: AgeRating.TEN_PLUS,
				label: "10+",
				description: "Ages 10 and above"
			},
			{
				value: AgeRating.TWELVE_PLUS,
				label: "12+",
				description: "Ages 12 and above"
			},
			{
				value: AgeRating.SIXTEEN_PLUS,
				label: "16+",
				description: "Ages 16 and above"
			},
			{
				value: AgeRating.EIGHTEEN_PLUS,
				label: "18+",
				description: "Adults only"
			}
		];
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Basic Information</h2> <p class="text-gray-300">Tell us about your content</p></div> <div><label for="title" class="block text-sm font-medium text-white mb-2">Content Title *</label> <input type="text" id="title"${attr("value", title)} placeholder="Enter your content title" class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> `);
		if (title.length > 0 && title.length < 5) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-red-400 text-sm mt-1">Title must be at least 5 characters long</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-white mb-2">Description *</label> <textarea id="description" placeholder="Provide a compelling description of your content..." rows="4" maxlength="1000" class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <div class="flex justify-between text-sm mt-2"><span class="text-gray-400">`);
		if (description.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-gray-400">Description is required</span>`);
		} else if (description.length < 50) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span class="text-red-400">${escape_html(50 - description.length)} more character${escape_html(50 - description.length === 1 ? "" : "s")} needed</span>`);
		} else if (description.length > 1e3) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<span class="text-red-400">Over limit by ${escape_html(description.length - 1e3)} character${escape_html(description.length - 1e3 === 1 ? "" : "s")}</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-emerald-400">✓ Good description length</span>`);
		}
		$$renderer.push(`<!--]--></span> <span${attr_class(`font-medium ${description.length > 1e3 ? "text-red-400" : description.length >= 50 ? "text-emerald-400" : "text-gray-400"}`)}>${escape_html(description.length)}/1000</span></div></div> <div role="radiogroup" aria-labelledby="contentType-label"><div id="contentType-label" class="block text-sm font-medium text-white mb-3">Content Type *</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like(contentTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio" name="contentType"${attr("value", type.value)}${attr("checked", contentType === type.value, true)} class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${contentType === type.value ? "border-primary bg-primary/10 shadow-[0_0_15px_hsla(var(--primary)/0.25)] scale-[1.02]" : "border-border bg-white/2 hover:border-muted-foreground/30"}`)}><div class="font-medium text-white">${escape_html(type.label)}</div> <div class="text-sm text-gray-400 mt-0.5">${escape_html(type.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (isSeries()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-cyan-500/8 border border-cyan-500/30 rounded-xl p-5 space-y-4"><div class="flex items-start gap-3"><span class="text-2xl">📺</span> <div><div class="font-semibold text-white">${escape_html(episodeLabel())} details</div> <div class="text-xs text-cyan-100/70 mt-0.5">The video you upload next becomes <span class="text-cyan-100 font-medium">${escape_html(episodeLabel())}</span> of your series.
            You can add more episodes after submit from the episodes manager —
            this wizard creates the series + this single episode in one go.</div></div></div> <div><label for="episodeTitle" class="block text-sm font-medium text-white mb-2">${escape_html(episodeLabel())} Title *</label> <input type="text" id="episodeTitle"${attr("value", episodeTitle)} placeholder="e.g. Pilot, Genesis, The Throne, The Reckoning" class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> `);
			if (episodeTitle.length > 0 && episodeTitle.length < 2) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-red-400 text-sm mt-1">Episode title must be at least 2 characters</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="grid grid-cols-2 gap-3"><div><label for="seasonNumber" class="block text-sm font-medium text-white mb-2">Season number</label> <input type="number" id="seasonNumber" min="1"${attr("value", seasonNumber)} class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/></div> <div><label for="episodeNumber" class="block text-sm font-medium text-white mb-2">Episode number</label> <input type="number" id="episodeNumber" min="1"${attr("value", episodeNumber)} class="w-full px-4 py-3 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div role="radiogroup" aria-labelledby="audience-label"><div id="audience-label" class="block text-sm font-medium text-white mb-3">Audience *</div> <div class="grid grid-cols-1 md:grid-cols-3 gap-3"><!--[-->`);
		const each_array_1 = ensure_array_like(audiences);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let a = each_array_1[$$index_1];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio" name="audience"${attr("value", a.value)}${attr("checked", audience === a.value, true)} class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${audience === a.value ? "border-primary bg-primary/10 shadow-[0_0_15px_hsla(var(--primary)/0.25)] scale-[1.02]" : "border-border bg-white/2 hover:border-muted-foreground/30"}`)}><div class="font-medium text-white">${escape_html(a.label)}</div> <div class="text-sm text-gray-400 mt-0.5">${escape_html(a.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="bg-violet-500/8 border border-violet-500/30 rounded-xl p-5 space-y-4"><label class="flex items-start cursor-pointer"><input type="checkbox"${attr("checked", comingSoon, true)} class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"/> <div class="text-sm select-none"><div class="text-white font-medium mb-1 flex items-center gap-2"><span class="text-lg">🗓️</span> This is a Coming Soon release</div> <div class="text-violet-100/80">Skip the main video and submit the announcement now — or upload everything (trailer + final video) and let the cron auto-publish on your release date.
          Either way, the row goes through admin review during the wait and surfaces on the Coming Soon carousels with a "Notify me" bell.</div></div></label> `);
		if (comingSoon) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="pl-9 space-y-2"><label for="comingSoonReleaseDate" class="block text-sm font-medium text-white">Release date *</label> <input id="comingSoonReleaseDate" type="date"${attr("value", comingSoonReleaseDate)}${attr("min", minComingSoonDate)} class="w-full md:w-64 px-3 py-2 bg-gray-900 border border-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/> <p class="text-xs text-violet-100/70">On this date, the cron auto-flips the row to live (provided the encoder has a playable video). Otherwise the row stays in Coming Soon until you add the main video from your content library.</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div role="radiogroup" aria-labelledby="ageRating-label"><div id="ageRating-label" class="block text-sm font-medium text-white mb-3">Age Rating *</div> <div class="grid grid-cols-2 md:grid-cols-3 gap-3"><!--[-->`);
		const each_array_2 = ensure_array_like(ageRatings);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let rating = each_array_2[$$index_2];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio" name="ageRating"${attr("value", rating.value)}${attr("checked", ageRating === rating.value, true)} class="sr-only"/> <div${attr_class(`p-3 border-2 rounded-xl text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${ageRating === rating.value ? "border-secondary bg-secondary/10 shadow-[0_0_15px_hsla(var(--secondary)/0.25)] scale-[1.02]" : "border-border bg-white/2 hover:border-muted-foreground/30"}`)}><div class="font-bold text-white">${escape_html(rating.label)}</div> <div class="text-xs text-gray-400 mt-0.5">${escape_html(rating.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">ℹ️</div> <div><div class="font-medium text-white mb-1">Faith-Based Content Guidelines</div> <div class="text-sm text-yellow-100">All content will be reviewed to ensure it aligns with our Christian values and community guidelines.
          Content should be appropriate for a faith-based audience and promote positive Christian messages.</div></div></div></div></div>`);
		bind_props($$props, {
			title,
			description,
			contentType,
			ageRating,
			audience,
			episodeTitle,
			seasonNumber,
			episodeNumber,
			comingSoon,
			comingSoonReleaseDate
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/VideoUploadStep.svelte
function VideoUploadStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { videoFile = null, trailerFile = null, videoProgress = null, trailerProgress = null } = $$props;
		let minVideoHeight = 1080;
		function minResolutionWidth(h) {
			return Math.round(h * 16 / 9);
		}
		const minResolutionLabel = derived(() => `${minVideoHeight}p (${minResolutionWidth(minVideoHeight)}x${minVideoHeight})`);
		derived(() => page.data?.user?.role === "admin");
		new Set([
			"video/mp4",
			"video/quicktime",
			"video/x-msvideo",
			"video/avi",
			"video/x-m4v",
			"video/webm",
			"video/mpeg",
			"video/x-matroska"
		]);
		function formatFileSize(bytes) {
			if (bytes === 0) return "0 Bytes";
			const k = 1024;
			const sizes = [
				"Bytes",
				"KB",
				"MB",
				"GB"
			];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
		}
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Upload Video Content</h2> <p class="text-gray-300">Upload your main content and optional trailer</p></div> <div><div class="block text-sm font-medium text-white mb-3">Main Video Content *</div> `);
		if (!videoFile && !videoProgress) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-muted-foreground/30 bg-white/2`)} role="button" tabindex="0" aria-label="Drop video file here or click to browse"><div class="text-4xl mb-4 floating-icon">🎬</div> <div class="text-white font-medium mb-2">Drop your video file here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Supported formats: MP4, MOV, AVI, MKV, WebM. Any size — 4K originals welcome.</div> <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv" class="hidden" id="video-upload"/> <label for="video-upload" class="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg cursor-pointer inline-block font-semibold transition-opacity">Choose Video File</label></div>`);
		} else if (videoProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-6"><div class="flex justify-between items-start mb-4"><div class="min-w-0 flex-1 pr-4"><div class="text-white font-medium truncate">${escape_html(videoProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(videoProgress.fileSize))}</div></div> `);
			if (videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 shrink-0"><div class="text-emerald-400 flex items-center font-medium"><span class="mr-2">✓</span> Staged</div> <button type="button" aria-label="Remove staged video" class="text-red-400 hover:text-red-300 text-lg">✗</button></div>`);
			} else if (videoProgress.hasError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="text-red-400 flex items-center font-medium shrink-0"><span class="mr-2">✗</span> Error</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button" aria-label="Cancel" class="text-red-400 hover:text-red-300 text-lg shrink-0">✗</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (videoProgress.isUploading || !videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-2"><div class="flex justify-between text-sm text-gray-400 mb-1"><span>${escape_html(videoProgress.isCompleted ? "Ready to encode" : "Preparing...")}</span> <span>${escape_html(Math.round(videoProgress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(videoProgress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (videoProgress.isCompleted && !videoProgress.hasError) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-foreground/90"><span class="text-primary text-lg leading-none">ℹ</span> <div><div class="font-medium text-white">Staged for encoding</div> <div class="text-gray-300">Your video is queued locally. The actual transfer runs when you click <span class="font-medium text-white">Submit for review</span> on the last step.
                Don't close this tab before then.</div></div></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="text-sm text-gray-400">${escape_html(formatFileSize(videoProgress.uploadedBytes))} / ${escape_html(formatFileSize(videoProgress.fileSize))}</div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><div class="block text-sm font-medium text-white mb-3">Trailer (Optional) <span class="text-gray-400 text-sm ml-2">Helps with discoverability</span></div> `);
		if (!trailerFile && !trailerProgress) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-border rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-muted-foreground/30 bg-white/2`)} role="button" tabindex="0" aria-label="Drop trailer file here or click to browse"><div class="text-3xl mb-3 floating-icon-delayed">🎞️</div> <div class="text-white font-medium mb-2">Drop trailer here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Short preview of your content. No size cap.</div> <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv" class="hidden" id="trailer-upload"/> <label for="trailer-upload" class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg cursor-pointer inline-block font-semibold transition-opacity">Choose Trailer</label></div>`);
		} else if (trailerProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-4"><div class="flex justify-between items-start mb-3"><div><div class="text-white font-medium">${escape_html(trailerProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(trailerProgress.fileSize))}</div></div> `);
			if (trailerProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 shrink-0"><div class="text-emerald-400 flex items-center font-medium"><span class="mr-2">✓</span> Staged</div> <button type="button" aria-label="Remove staged trailer" class="text-red-400 hover:text-red-300 text-lg">✗</button></div>`);
			} else if (trailerProgress.hasError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="text-red-400 flex items-center font-medium"><span class="mr-2">✗</span> Error</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button" class="text-red-400 hover:text-red-300 text-lg">✗</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (trailerProgress.isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-2"><div class="flex justify-between text-sm text-gray-400 mb-1"><span>Uploading...</span> <span>${escape_html(Math.round(trailerProgress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-secondary h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(trailerProgress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">⚠️</div> <div><div class="font-medium text-white mb-1">Video Upload Guidelines</div> <div class="text-sm text-yellow-100 space-y-1"><div>• Videos should be in MP4 format for best compatibility</div> <div>• Minimum resolution: ${escape_html(minResolutionLabel())}</div> <div>• Audio should be clear and free from background noise</div> <div>• Content will be processed and optimized after upload</div> <div>• Upload may take several minutes depending on file size</div></div></div></div></div></div>`);
		bind_props($$props, {
			videoFile,
			trailerFile,
			videoProgress,
			trailerProgress
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/AssetManagementStep.svelte
function AssetManagementStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { uploadedAssets = {}, assetProgress = [] } = $$props;
		const MB = 1024 * 1024;
		const STD_IMAGE_MIME = [
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/avif"
		];
		const STD_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif";
		const STD_IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
		const assetTypes = [
			{
				key: "posterPortrait",
				title: "Portrait Poster",
				description: "Required. 2:3 vertical card used for movie tiles and browsing.",
				accept: STD_IMAGE_ACCEPT,
				mime: STD_IMAGE_MIME,
				extRegex: STD_IMAGE_EXT,
				formatLabel: "PNG, JPG, WebP, or AVIF",
				required: true,
				maxBytes: 2 * MB
			},
			{
				key: "posterLandscape",
				title: "Landscape Poster",
				description: "Optional. 16:9 horizontal card used in featured rows.",
				accept: STD_IMAGE_ACCEPT,
				mime: STD_IMAGE_MIME,
				extRegex: STD_IMAGE_EXT,
				formatLabel: "PNG, JPG, WebP, or AVIF",
				required: false,
				maxBytes: 3 * MB
			},
			{
				key: "posterSquare",
				title: "Square Poster",
				description: "Optional. 1:1 card used on mobile and compact layouts.",
				accept: STD_IMAGE_ACCEPT,
				mime: STD_IMAGE_MIME,
				extRegex: STD_IMAGE_EXT,
				formatLabel: "PNG, JPG, WebP, or AVIF",
				required: false,
				maxBytes: 2 * MB
			},
			{
				key: "backdropHero",
				title: "Hero Background",
				description: "Required. 16:9 HD image behind detail pages and featured rows.",
				accept: STD_IMAGE_ACCEPT,
				mime: STD_IMAGE_MIME,
				extRegex: STD_IMAGE_EXT,
				formatLabel: "PNG, JPG, WebP, or AVIF",
				required: true,
				maxBytes: 5 * MB
			},
			{
				key: "logoTitle",
				title: "Title Logo",
				description: "Optional. Transparent PNG title treatment shown over the hero backdrop.",
				accept: "image/png,.png",
				mime: ["image/png"],
				extRegex: /\.png$/i,
				formatLabel: "transparent PNG",
				required: false,
				maxBytes: 1 * MB
			},
			{
				key: "thumbnail",
				title: "Video Thumbnail",
				description: "Optional. Compact preview image used in cards and notifications.",
				accept: STD_IMAGE_ACCEPT,
				mime: STD_IMAGE_MIME,
				extRegex: STD_IMAGE_EXT,
				formatLabel: "PNG, JPG, WebP, or AVIF",
				required: false,
				maxBytes: 1 * MB
			}
		];
		function formatSize(bytes) {
			if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
			return `${Math.max(1, Math.round(bytes / 1024))} KB`;
		}
		function progressFor(assetType) {
			return assetProgress.find((item) => item.assetType === assetType);
		}
		$$renderer.push(`<div class="space-y-6"><div class="text-center"><h2 class="text-2xl font-bold text-white">Image Assets</h2> <p class="text-gray-400">Upload the artwork used across the platform</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
		const each_array = ensure_array_like(assetTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let asset = each_array[$$index];
			const progress = progressFor(asset.key);
			const assetUrl = uploadedAssets[asset.key];
			$$renderer.push(`<section class="bg-white/5 border border-border/80 rounded-xl p-4 space-y-3"><div><div class="flex items-center gap-2"><h3 class="font-semibold text-white">${escape_html(asset.title)}</h3> `);
			if (asset.required) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-[10px] uppercase tracking-wide bg-primary text-primary-foreground rounded px-2 py-0.5">Required</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <p class="text-sm text-gray-400">${escape_html(asset.description)}</p> <p class="text-xs text-gray-500">Max ${escape_html(formatSize(asset.maxBytes))}</p></div> `);
			if (assetUrl && progress?.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-3"><img${attr("src", assetUrl)}${attr("alt", asset.title)} class="w-full h-32 object-cover rounded-lg border border-border/60"/> <div class="flex items-center justify-between gap-3 text-sm"><span class="text-emerald-400 truncate">${escape_html(progress.fileName)}</span> <button type="button" class="text-red-400 hover:text-red-300">Remove</button></div></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="space-y-2"><label${attr("for", `asset-${asset.key}`)} class="block text-sm font-medium text-white">Choose ${escape_html(asset.title)}</label> <input${attr("id", `asset-${asset.key}`)}${attr("data-testid", `asset-input-${asset.key}`)} type="file"${attr("accept", asset.accept)} class="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90"/></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (progress && !progress.isCompleted && !progress.hasError) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-1"><div class="flex justify-between text-xs text-gray-400"><span class="truncate">${escape_html(progress.fileName)}</span> <span>${escape_html(Math.round(progress.progressPercentage))}%</span></div> <div class="h-2 rounded-full bg-gray-800 overflow-hidden"><div class="h-full bg-primary transition-all"${attr_style(`width: ${stringify(progress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (progress?.hasError) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-sm text-red-300">${escape_html(progress.errorMessage)}</p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></section>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4 text-sm text-yellow-100">Required before continuing: Portrait Poster and Hero Background.</div></div>`);
		bind_props($$props, {
			uploadedAssets,
			assetProgress
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/PersonRow.svelte
function PersonRow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { kind, value, roleOptions, onChange, onRemove } = $$props;
		function update(patch) {
			onChange({
				...value,
				...patch
			});
		}
		let photoUploading = false;
		const initial = derived(() => (value.name ?? "?").charAt(0).toUpperCase() || "?");
		$$renderer.push(`<div class="flex items-center gap-3 p-3 bg-white/4 border border-border/80 rounded-lg"><div class="relative shrink-0">`);
		if (value.photoUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<img${attr("src", value.photoUrl)} alt="" class="w-10 h-10 rounded-full object-cover bg-zinc-700"/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="w-10 h-10 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">${escape_html(initial())}</div>`);
		}
		$$renderer.push(`<!--]--> <label class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:opacity-90 shadow"${attr("title", value.photoUrl ? "Replace photo" : "Upload photo")}>`);
		$$renderer.push("<!--[-1-->");
		Upload($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!--]--> <input type="file" accept="image/*" class="sr-only"${attr("disabled", photoUploading, true)}/></label></div> <div${attr_class(`flex-1 grid grid-cols-1 ${kind === "cast" ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-2 min-w-0`)}><div class="relative"><input type="text" placeholder="Name"${attr("value", value.name)} class="w-full px-3 py-2 bg-white/4 border border-border/80 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.select({
			value: value.role,
			onchange: (e) => update({ role: e.currentTarget.value }),
			class: "px-3 py-2 bg-white/4 border border-border/80 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(roleOptions);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let option = each_array[$$index];
				$$renderer.option({
					value: option,
					class: "bg-card text-foreground"
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(option)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` `);
		if (kind === "cast") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input type="text" placeholder="Character (optional)"${attr("value", value.characterName ?? "")} class="px-3 py-2 bg-white/4 border border-border/80 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex items-center gap-1 shrink-0">`);
		if (value.photoUrl) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="text-[10px] text-gray-400 hover:text-white px-1" title="Remove photo">`);
			User($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="button" class="w-7 h-7 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-300 flex items-center justify-center" title="Remove this entry">`);
		X($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></button></div></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/MetadataStep.svelte
function MetadataStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { bibleReferences = [], themes = [], ministryAffiliation = "", duration = "", language = "English", hasSubtitles = false, hasClosedCaptions = false, tags = [], keywords = [], genre = [], cast = [], crew = [] } = $$props;
		const castRoles = [
			"Actor",
			"Voice",
			"Narrator",
			"Host"
		];
		const crewRoles = [
			"Director",
			"Producer",
			"Writer",
			"Cinematographer",
			"Editor",
			"Composer",
			"Sound Designer"
		];
		function updateCastAt(i, next) {
			cast = cast.map((row, idx) => idx === i ? next : row);
		}
		function updateCrewAt(i, next) {
			crew = crew.map((row, idx) => idx === i ? next : row);
		}
		function removeCastAt(i) {
			cast = cast.filter((_, idx) => idx !== i);
		}
		function removeCrewAt(i) {
			crew = crew.filter((_, idx) => idx !== i);
		}
		let newBibleRef = "";
		let newTag = "";
		let newKeyword = "";
		const commonThemes = [
			"Faith",
			"Hope",
			"Love",
			"Forgiveness",
			"Redemption",
			"Grace",
			"Prayer",
			"Worship",
			"Community",
			"Service",
			"Family",
			"Marriage",
			"Parenting",
			"Youth",
			"Evangelism",
			"Discipleship",
			"Leadership",
			"Testimony"
		];
		const commonGenres = [
			"Drama",
			"Documentary",
			"Biography",
			"Musical",
			"Comedy",
			"Family",
			"Historical",
			"Inspirational",
			"Educational",
			"Children's",
			"Youth"
		];
		const languages = [
			"English",
			"Spanish",
			"French",
			"Portuguese",
			"German",
			"Italian",
			"Korean",
			"Mandarin",
			"Arabic",
			"Hindi",
			"Other"
		];
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Content Metadata</h2> <p class="text-gray-300">Add details to help users discover and understand your content</p></div> <div><label for="bible-references" class="block text-sm font-medium text-white mb-3">Bible References</label> <div class="flex gap-2 mb-3"><input type="text" id="bible-references"${attr("value", newBibleRef)} placeholder="e.g., John 3:16, Romans 8:28" class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
		if (bibleReferences.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like(bibleReferences);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ref = each_array[$$index];
				$$renderer.push(`<span class="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center font-medium shadow-sm">${escape_html(ref)} <button type="button" class="ml-2 hover:text-red-200 font-bold">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">Add relevant Bible verses that relate to your content's message</div></div> <div role="group" aria-labelledby="themes-label"><div id="themes-label" class="block text-sm font-medium text-white mb-3">Themes</div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"><!--[-->`);
		const each_array_1 = ensure_array_like(commonThemes);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let theme = each_array_1[$$index_1];
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("value", theme)}${attr("checked", themes.includes(theme), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${themes.includes(theme) ? "border-primary bg-primary/10 shadow-[0_0_12px_hsla(var(--primary)/0.2)] text-white scale-[1.03]" : "border-border bg-white/2 text-gray-300 hover:border-muted-foreground/30"}`)}>${escape_html(theme)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div role="group" aria-labelledby="cast-label"><div id="cast-label" class="flex items-center justify-between mb-3"><span class="block text-sm font-medium text-white">Cast</span> <span class="text-xs text-gray-400">Optional — adds an avatar list on the watch page</span></div> `);
		if (cast.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2 mb-3"><!--[-->`);
			const each_array_2 = ensure_array_like(cast);
			for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
				let member = each_array_2[i];
				PersonRow($$renderer, {
					kind: "cast",
					value: member,
					roleOptions: castRoles,
					onChange: (next) => updateCastAt(i, next),
					onRemove: () => removeCastAt(i)
				});
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="button" class="px-4 py-2 border border-dashed border-border/80 hover:border-primary/50 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors w-full">+ Add cast member</button> <div class="text-xs text-gray-400 mt-1">Type a name we've seen before and the photo auto-fills. Override anytime by uploading a new image.</div></div> <div role="group" aria-labelledby="crew-label"><div id="crew-label" class="flex items-center justify-between mb-3"><span class="block text-sm font-medium text-white">Crew</span> <span class="text-xs text-gray-400">Optional — director, producer, etc.</span></div> `);
		if (crew.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2 mb-3"><!--[-->`);
			const each_array_3 = ensure_array_like(crew);
			for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
				let member = each_array_3[i];
				PersonRow($$renderer, {
					kind: "crew",
					value: member,
					roleOptions: crewRoles,
					onChange: (next) => updateCrewAt(i, next),
					onRemove: () => removeCrewAt(i)
				});
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="button" class="px-4 py-2 border border-dashed border-border/80 hover:border-secondary/50 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors w-full">+ Add crew member</button></div> <div><label for="ministry" class="block text-sm font-medium text-white mb-2">Ministry/Organization Affiliation</label> <input type="text" id="ministry"${attr("value", ministryAffiliation)} placeholder="e.g., Grace Community Church, Victory Ministries" class="w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <div class="text-xs text-gray-400 mt-1">Optional: Name of the church, ministry, or organization associated with this content</div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="duration" class="block text-sm font-medium text-white mb-2">Duration (minutes)</label> <input type="number" id="duration"${attr("value", duration)} placeholder="90" min="1" class="w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/></div> <div><label for="language" class="block text-sm font-medium text-white mb-2">Primary Language</label> `);
		$$renderer.select({
			id: "language",
			value: language,
			class: "w-full px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_4 = ensure_array_like(languages);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let lang = each_array_4[$$index_4];
				$$renderer.option({
					value: lang,
					class: "bg-card text-foreground"
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(lang)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></div> <div role="group" aria-labelledby="accessibility-label"><div id="accessibility-label" class="block text-sm font-medium text-white mb-3">Accessibility Features</div> <div class="space-y-2"><label class="flex items-center cursor-pointer"><input type="checkbox"${attr("checked", hasSubtitles, true)} class="mr-3 w-4 h-4 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none"/> <span class="text-white text-sm">Has Subtitles</span></label> <label class="flex items-center cursor-pointer"><input type="checkbox"${attr("checked", hasClosedCaptions, true)} class="mr-3 w-4 h-4 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none"/> <span class="text-white text-sm">Has Closed Captions</span></label></div></div> <div role="group" aria-labelledby="genres-label"><div id="genres-label" class="block text-sm font-medium text-white mb-3">Genres</div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"><!--[-->`);
		const each_array_5 = ensure_array_like(commonGenres);
		for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
			let genreOption = each_array_5[$$index_5];
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("value", genreOption)}${attr("checked", genre.includes(genreOption), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${genre.includes(genreOption) ? "border-secondary bg-secondary/10 shadow-[0_0_12px_hsla(var(--secondary)/0.2)] text-white scale-[1.03]" : "border-border bg-white/2 text-gray-300 hover:border-muted-foreground/30"}`)}>${escape_html(genreOption)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="tags-input" class="block text-sm font-medium text-white mb-3">Tags</label> <div class="flex gap-2 mb-3"><input type="text" id="tags-input"${attr("value", newTag)} placeholder="Add custom tags..." class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
		if (tags.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_6 = ensure_array_like(tags);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let tag = each_array_6[$$index_6];
				$$renderer.push(`<span class="bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center font-medium shadow-sm">${escape_html(tag)} <button type="button" class="ml-2 hover:text-red-200 font-bold">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="keywords-input" class="block text-sm font-medium text-white mb-3">SEO Keywords</label> <div class="flex gap-2 mb-3"><input type="text" id="keywords-input"${attr("value", newKeyword)} placeholder="Add search keywords..." class="flex-1 px-4 py-2 bg-white/4 border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
		if (keywords.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_7 = ensure_array_like(keywords);
			for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
				let keyword = each_array_7[$$index_7];
				$$renderer.push(`<span class="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center font-semibold shadow-sm">${escape_html(keyword)} <button type="button" class="ml-2 hover:text-red-200 font-bold">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">Keywords help users find your content through search</div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">📝</div> <div><div class="font-medium text-white mb-1">Metadata Best Practices</div> <div class="text-sm text-yellow-100 space-y-1"><div>• Add relevant Bible references that connect to your content's message</div> <div>• Choose themes that accurately represent your content</div> <div>• Use specific, searchable keywords that your audience might use</div> <div>• Be honest about content duration and accessibility features</div> <div>• Well-structured metadata improves discoverability</div></div></div></div></div></div>`);
		bind_props($$props, {
			bibleReferences,
			themes,
			ministryAffiliation,
			duration,
			language,
			hasSubtitles,
			hasClosedCaptions,
			tags,
			keywords,
			genre,
			cast,
			crew
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/ReviewSubmitStep.svelte
function ReviewSubmitStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { termsAccepted = false, guidelinesAccepted = false, allStepData, submitting = false } = $$props;
		const basicInfo = derived(() => allStepData.stepData[UploadStep.BASIC_INFO]);
		const videoData = derived(() => allStepData.stepData[UploadStep.VIDEO_UPLOAD]);
		const assetData = derived(() => allStepData.stepData[UploadStep.ASSET_MANAGEMENT]);
		const metadataInfo = derived(() => allStepData.stepData[UploadStep.METADATA]);
		const isComingSoon = derived(() => !!basicInfo().comingSoon);
		const hasVideo = derived(() => !!videoData().videoProgress?.isCompleted);
		const isAnnouncementOnly = derived(() => isComingSoon() && !hasVideo());
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Review &amp; Submit</h2> <p class="text-gray-300">Review your content details before submitting for approval</p></div> <div class="bg-white/5 border border-border/80 rounded-xl p-6"><h3 class="text-xl font-bold text-white mb-4">Content Summary</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">ℹ️</span> Basic Information</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">${escape_html(basicInfo().contentType === "series" ? "Series title" : "Title")}:</span> <span class="text-white font-medium">${escape_html(basicInfo().title || "Not provided")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Type:</span> <span class="text-white capitalize">${escape_html(basicInfo().contentType || "Not selected")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Age Rating:</span> <span class="text-white font-medium">${escape_html(basicInfo().ageRating || "Not selected")}</span></div> `);
		if (basicInfo().contentType === "series") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex justify-between border-t border-border/40 pt-2 mt-2"><span class="text-gray-400">S${escape_html(basicInfo().seasonNumber ?? 1)} E${escape_html(basicInfo().episodeNumber ?? 1)}:</span> <span class="text-white font-medium">${escape_html(basicInfo().episodeTitle || "Not provided")}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">🎬</span> Video Content</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Main Video:</span> <span class="text-white font-medium">`);
		if (videoData().videoProgress?.isCompleted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-emerald-400">✓ Uploaded</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-red-400">Not uploaded</span>`);
		}
		$$renderer.push(`<!--]--></span></div> <div class="flex justify-between"><span class="text-gray-400">Trailer:</span> <span class="text-white font-medium">`);
		if (videoData().trailerProgress?.isCompleted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-emerald-400">✓ Uploaded</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-gray-400">Optional</span>`);
		}
		$$renderer.push(`<!--]--></span></div></div></div> <div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">🖼️</span> Image Assets</h4> <div class="text-sm flex justify-between"><span class="text-gray-400">Uploaded Assets:</span> <span class="text-white font-medium">${escape_html(Object.keys(assetData().uploadedAssets || {}).length)} file(s)</span></div></div> <div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">📝</span> Additional Details</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Duration:</span> <span class="text-white font-medium">${escape_html(metadataInfo().duration ? `${metadataInfo().duration} min` : "Not specified")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Language:</span> <span class="text-white font-medium">${escape_html(metadataInfo().language || "English")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Bible References:</span> <span class="text-white font-medium">${escape_html(metadataInfo().bibleReferences?.length || 0)} reference(s)</span></div></div></div></div> `);
		if (basicInfo().description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-6 border-t border-border/40 pt-4"><h4 class="font-semibold text-white mb-2">Description</h4> <div class="text-sm text-gray-300 bg-white/2 border border-border/45 p-3 rounded-lg whitespace-pre-line">${escape_html(basicInfo().description)}</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-primary/5 border border-primary/20 rounded-xl p-6"><h3 class="text-xl font-bold text-white mb-4">Review Process</h3> <div class="space-y-3 text-sm text-gray-300"><div class="flex items-start"><span class="text-lg mr-3">1️⃣</span> <div><div class="font-semibold text-white">Theological Review</div> <div class="text-gray-400">Content will be reviewed for doctrinal accuracy and biblical alignment</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">2️⃣</span> <div><div class="font-semibold text-white">Content Moderation</div> <div class="text-gray-400">General content review for appropriateness and quality</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">3️⃣</span> <div><div class="font-semibold text-white">Technical Quality Assurance</div> <div class="text-gray-400">Video and audio quality, technical specifications check</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">✅</span> <div><div class="font-semibold text-white">Final Approval &amp; Publishing</div> <div class="text-gray-400">Content goes live on the platform for all users</div></div></div></div> <div class="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg"><div class="text-sm text-white/90"><strong>Expected Review Time:</strong> 3-5 business days<br/> <strong>Status Updates:</strong> You'll receive dashboard and email notifications at each stage</div></div></div> `);
		if (isComingSoon()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-violet-500/10 border border-violet-500/30 rounded-xl p-6 space-y-2"><div class="text-white font-medium flex items-center gap-2"><span class="text-lg">🗓️</span> Coming Soon · releases ${escape_html(basicInfo().comingSoonReleaseDate || "—")}</div> <div class="text-sm text-violet-100/80">`);
			if (isAnnouncementOnly()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`Announcement-only submission — the main video isn't attached.
          Admin will review the row during the wait; you can add the
          final video from your content library any time before the
          release date. If the video isn't ready when the date passes,
          the row stays in Coming Soon until you upload it.`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Your video will be encoded as part of this submission. After
          admin approval the row sits in Coming Soon; the cron flips it
          to live automatically on the release date.`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="space-y-4"><h3 class="text-xl font-bold text-white">Terms and Guidelines</h3> <div class="bg-white/5 border border-border/80 rounded-xl p-6 space-y-4"><label class="flex items-start cursor-pointer"><input type="checkbox"${attr("checked", guidelinesAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"/> <div class="text-sm select-none"><div class="text-white font-medium mb-1">Content Guidelines Acceptance</div> <div class="text-gray-300">I confirm that my content aligns with Sephar Studios' faith-based content guidelines,
            promotes positive Christian values, and is appropriate for the intended audience.
            I understand that content not meeting these standards may be rejected.</div></div></label> <label class="flex items-start cursor-pointer"><input type="checkbox"${attr("checked", termsAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"/> <div class="text-sm select-none"><div class="text-white font-medium mb-1">Terms of Service Agreement</div> <div class="text-gray-300">I agree to the Sephar Studios Terms of Service, Creator Agreement, and Privacy Policy.
            I confirm that I have the rights to submit this content and that it does not infringe
            on any third-party copyrights or intellectual property.</div></div></label></div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">${escape_html(isComingSoon() ? "🗓️" : "⚠️")}</div> <div><div class="font-medium text-white mb-1">Before You Submit</div> <div class="text-sm text-yellow-100 space-y-1"><div>• Ensure all required fields are completed accurately</div> <div>• Double-check your video quality and audio clarity</div> <div>• Verify that all uploaded images represent your content appropriately</div> <div>• Make sure your content aligns with our faith-based community standards</div> `);
		if (isAnnouncementOnly()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div>• You can add the main video any time from your content library; the cron auto-publishes on the release date once a playable video is attached</div>`);
		} else if (isComingSoon()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div>• Your video will encode now, then sit in Coming Soon. The cron auto-publishes on the release date</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div>• Most fields stay editable from your content library after submit — only the main video file requires the upload wizard to swap</div>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div> <div class="text-center pt-6 text-sm text-gray-400">`);
		if (!termsAccepted || !guidelinesAccepted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`Tick both boxes above, then use the <span class="text-white font-medium">Submit for review</span> button below to send this for approval.`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`Ready. Use the Submit for review button below to send this for approval.`);
		}
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, {
			termsAccepted,
			guidelinesAccepted
		});
	});
}
//#endregion
//#region src/routes/(creator)/creator/upload/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let isSubmitting = false;
		let wizardState = {
			currentStep: UploadStep.BASIC_INFO,
			stepData: {
				[UploadStep.BASIC_INFO]: {
					title: "",
					description: "",
					contentType: "",
					ageRating: "",
					audience: "general",
					episodeTitle: "",
					seasonNumber: 1,
					episodeNumber: 1,
					comingSoon: false,
					comingSoonReleaseDate: ""
				},
				[UploadStep.VIDEO_UPLOAD]: {
					videoFile: null,
					trailerFile: null,
					videoProgress: null,
					trailerProgress: null
				},
				[UploadStep.ASSET_MANAGEMENT]: {
					uploadedAssets: {},
					assetProgress: []
				},
				[UploadStep.METADATA]: {
					bibleReferences: [],
					themes: [],
					ministryAffiliation: "",
					duration: "",
					language: "English",
					hasSubtitles: false,
					hasClosedCaptions: false,
					tags: [],
					keywords: [],
					genre: [],
					cast: [],
					crew: []
				},
				[UploadStep.REVIEW_SUBMIT]: {
					termsAccepted: false,
					guidelinesAccepted: false
				}
			},
			isValid: {
				[UploadStep.BASIC_INFO]: false,
				[UploadStep.VIDEO_UPLOAD]: false,
				[UploadStep.ASSET_MANAGEMENT]: false,
				[UploadStep.METADATA]: false,
				[UploadStep.REVIEW_SUBMIT]: false
			}
		};
		JSON.stringify(JSON.parse(JSON.stringify(wizardState)));
		const steps = [
			{
				id: String(UploadStep.BASIC_INFO),
				label: "Basic Info"
			},
			{
				id: String(UploadStep.VIDEO_UPLOAD),
				label: "Video Upload"
			},
			{
				id: String(UploadStep.ASSET_MANAGEMENT),
				label: "Images & Assets"
			},
			{
				id: String(UploadStep.METADATA),
				label: "Metadata"
			},
			{
				id: String(UploadStep.REVIEW_SUBMIT),
				label: "Review & Submit"
			}
		];
		let isTransitioningStep = false;
		function localTodayYYYYMMDD() {
			const d = /* @__PURE__ */ new Date();
			const p = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
		}
		function goToStep(step) {
			if (isTransitioningStep || isSubmitting) return;
			if (step > wizardState.currentStep) {
				const ordered = [
					UploadStep.BASIC_INFO,
					UploadStep.VIDEO_UPLOAD,
					UploadStep.ASSET_MANAGEMENT,
					UploadStep.METADATA,
					UploadStep.REVIEW_SUBMIT
				];
				for (const s of ordered) {
					if (s >= step) break;
					const missing = missingFieldsForStep(s);
					if (missing.length > 0) {
						toast.info("Finish the earlier steps first", { description: `Still needed: ${missing.join(", ")}` });
						return;
					}
				}
			}
			isTransitioningStep = true;
			setTimeout(() => {
				wizardState.currentStep = step;
				isTransitioningStep = false;
			}, 300);
		}
		function missingFieldsInState(state, step) {
			const missing = [];
			switch (step) {
				case UploadStep.BASIC_INFO: {
					const d = state.stepData[step];
					if (!d.title || d.title.trim().length < 5) missing.push("Title (at least 5 characters)");
					if (!d.description || d.description.trim().length < 50) missing.push("Description (at least 50 characters)");
					if (!d.contentType) missing.push("Content type");
					if (!d.ageRating) missing.push("Age rating");
					if (d.contentType === ContentType.SERIES) {
						if (!d.episodeTitle || d.episodeTitle.trim().length < 2) missing.push(`S${d.seasonNumber || 1} E${d.episodeNumber || 1} title (at least 2 characters)`);
						if (!Number.isInteger(d.seasonNumber) || d.seasonNumber < 1) missing.push("Season number (whole number, 1 or higher)");
						if (!Number.isInteger(d.episodeNumber) || d.episodeNumber < 1) missing.push("Episode number (whole number, 1 or higher)");
					}
					if (d.comingSoon) {
						if (!d.comingSoonReleaseDate || d.comingSoonReleaseDate < localTodayYYYYMMDD()) missing.push("Coming Soon release date (today or later)");
					}
					break;
				}
				case UploadStep.VIDEO_UPLOAD: {
					if (state.stepData[UploadStep.BASIC_INFO].comingSoon) break;
					const d = state.stepData[step];
					if (!(d.videoFile instanceof File)) missing.push("Video file");
					else if (d.videoProgress?.uploadUrl !== "staged-for-encoding") missing.push("Video upload");
					break;
				}
				case UploadStep.ASSET_MANAGEMENT: {
					const d = state.stepData[step];
					if (!d.uploadedAssets?.posterPortrait) missing.push("Portrait poster");
					if (!d.uploadedAssets?.backdropHero) missing.push("Hero background");
					break;
				}
				case UploadStep.METADATA: break;
				case UploadStep.REVIEW_SUBMIT: {
					const d = state.stepData[step];
					if (!d.termsAccepted) missing.push("Terms acceptance");
					if (!d.guidelinesAccepted) missing.push("Guidelines acceptance");
					break;
				}
			}
			return missing;
		}
		function missingFieldsForStep(step) {
			return missingFieldsInState(wizardState, step);
		}
		const stepValidity = derived(() => ({
			[UploadStep.BASIC_INFO]: missingFieldsForStep(UploadStep.BASIC_INFO).length === 0,
			[UploadStep.VIDEO_UPLOAD]: missingFieldsForStep(UploadStep.VIDEO_UPLOAD).length === 0,
			[UploadStep.ASSET_MANAGEMENT]: missingFieldsForStep(UploadStep.ASSET_MANAGEMENT).length === 0,
			[UploadStep.METADATA]: missingFieldsForStep(UploadStep.METADATA).length === 0,
			[UploadStep.REVIEW_SUBMIT]: missingFieldsForStep(UploadStep.REVIEW_SUBMIT).length === 0
		}));
		const currentStepBlockers = derived(() => missingFieldsForStep(wizardState.currentStep));
		const isCurrentStepValid = derived(() => stepValidity()[wizardState.currentStep]);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="mx-auto px-4 py-6 space-y-6 max-w-5xl">`);
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "Create",
				title: "New upload",
				subtitle: "Submit a new video for review and encoding.",
				icon: Upload
			});
			$$renderer.push(`<!----> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			StepIndicator($$renderer, {
				steps,
				currentStep: wizardState.currentStep - 1,
				onStepClick: (index) => goToStep(index + 1)
			});
			$$renderer.push(`<!----> <div class="surface-glass border border-border/80 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">`);
			if (wizardState.currentStep === UploadStep.BASIC_INFO) {
				$$renderer.push("<!--[0-->");
				BasicInfoStep($$renderer, {
					get title() {
						return wizardState.stepData[UploadStep.BASIC_INFO].title;
					},
					set title($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].title = $$value;
						$$settled = false;
					},
					get description() {
						return wizardState.stepData[UploadStep.BASIC_INFO].description;
					},
					set description($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].description = $$value;
						$$settled = false;
					},
					get contentType() {
						return wizardState.stepData[UploadStep.BASIC_INFO].contentType;
					},
					set contentType($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].contentType = $$value;
						$$settled = false;
					},
					get ageRating() {
						return wizardState.stepData[UploadStep.BASIC_INFO].ageRating;
					},
					set ageRating($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].ageRating = $$value;
						$$settled = false;
					},
					get audience() {
						return wizardState.stepData[UploadStep.BASIC_INFO].audience;
					},
					set audience($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].audience = $$value;
						$$settled = false;
					},
					get episodeTitle() {
						return wizardState.stepData[UploadStep.BASIC_INFO].episodeTitle;
					},
					set episodeTitle($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].episodeTitle = $$value;
						$$settled = false;
					},
					get seasonNumber() {
						return wizardState.stepData[UploadStep.BASIC_INFO].seasonNumber;
					},
					set seasonNumber($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].seasonNumber = $$value;
						$$settled = false;
					},
					get episodeNumber() {
						return wizardState.stepData[UploadStep.BASIC_INFO].episodeNumber;
					},
					set episodeNumber($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].episodeNumber = $$value;
						$$settled = false;
					},
					get comingSoon() {
						return wizardState.stepData[UploadStep.BASIC_INFO].comingSoon;
					},
					set comingSoon($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].comingSoon = $$value;
						$$settled = false;
					},
					get comingSoonReleaseDate() {
						return wizardState.stepData[UploadStep.BASIC_INFO].comingSoonReleaseDate;
					},
					set comingSoonReleaseDate($$value) {
						wizardState.stepData[UploadStep.BASIC_INFO].comingSoonReleaseDate = $$value;
						$$settled = false;
					}
				});
			} else if (wizardState.currentStep === UploadStep.VIDEO_UPLOAD) {
				$$renderer.push("<!--[1-->");
				VideoUploadStep($$renderer, {
					get videoFile() {
						return wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoFile;
					},
					set videoFile($$value) {
						wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoFile = $$value;
						$$settled = false;
					},
					get trailerFile() {
						return wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerFile;
					},
					set trailerFile($$value) {
						wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerFile = $$value;
						$$settled = false;
					},
					get videoProgress() {
						return wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoProgress;
					},
					set videoProgress($$value) {
						wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoProgress = $$value;
						$$settled = false;
					},
					get trailerProgress() {
						return wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerProgress;
					},
					set trailerProgress($$value) {
						wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerProgress = $$value;
						$$settled = false;
					}
				});
			} else if (wizardState.currentStep === UploadStep.ASSET_MANAGEMENT) {
				$$renderer.push("<!--[2-->");
				AssetManagementStep($$renderer, {
					get uploadedAssets() {
						return wizardState.stepData[UploadStep.ASSET_MANAGEMENT].uploadedAssets;
					},
					set uploadedAssets($$value) {
						wizardState.stepData[UploadStep.ASSET_MANAGEMENT].uploadedAssets = $$value;
						$$settled = false;
					},
					get assetProgress() {
						return wizardState.stepData[UploadStep.ASSET_MANAGEMENT].assetProgress;
					},
					set assetProgress($$value) {
						wizardState.stepData[UploadStep.ASSET_MANAGEMENT].assetProgress = $$value;
						$$settled = false;
					}
				});
			} else if (wizardState.currentStep === UploadStep.METADATA) {
				$$renderer.push("<!--[3-->");
				MetadataStep($$renderer, {
					get bibleReferences() {
						return wizardState.stepData[UploadStep.METADATA].bibleReferences;
					},
					set bibleReferences($$value) {
						wizardState.stepData[UploadStep.METADATA].bibleReferences = $$value;
						$$settled = false;
					},
					get themes() {
						return wizardState.stepData[UploadStep.METADATA].themes;
					},
					set themes($$value) {
						wizardState.stepData[UploadStep.METADATA].themes = $$value;
						$$settled = false;
					},
					get ministryAffiliation() {
						return wizardState.stepData[UploadStep.METADATA].ministryAffiliation;
					},
					set ministryAffiliation($$value) {
						wizardState.stepData[UploadStep.METADATA].ministryAffiliation = $$value;
						$$settled = false;
					},
					get duration() {
						return wizardState.stepData[UploadStep.METADATA].duration;
					},
					set duration($$value) {
						wizardState.stepData[UploadStep.METADATA].duration = $$value;
						$$settled = false;
					},
					get language() {
						return wizardState.stepData[UploadStep.METADATA].language;
					},
					set language($$value) {
						wizardState.stepData[UploadStep.METADATA].language = $$value;
						$$settled = false;
					},
					get hasSubtitles() {
						return wizardState.stepData[UploadStep.METADATA].hasSubtitles;
					},
					set hasSubtitles($$value) {
						wizardState.stepData[UploadStep.METADATA].hasSubtitles = $$value;
						$$settled = false;
					},
					get hasClosedCaptions() {
						return wizardState.stepData[UploadStep.METADATA].hasClosedCaptions;
					},
					set hasClosedCaptions($$value) {
						wizardState.stepData[UploadStep.METADATA].hasClosedCaptions = $$value;
						$$settled = false;
					},
					get tags() {
						return wizardState.stepData[UploadStep.METADATA].tags;
					},
					set tags($$value) {
						wizardState.stepData[UploadStep.METADATA].tags = $$value;
						$$settled = false;
					},
					get keywords() {
						return wizardState.stepData[UploadStep.METADATA].keywords;
					},
					set keywords($$value) {
						wizardState.stepData[UploadStep.METADATA].keywords = $$value;
						$$settled = false;
					},
					get genre() {
						return wizardState.stepData[UploadStep.METADATA].genre;
					},
					set genre($$value) {
						wizardState.stepData[UploadStep.METADATA].genre = $$value;
						$$settled = false;
					},
					get cast() {
						return wizardState.stepData[UploadStep.METADATA].cast;
					},
					set cast($$value) {
						wizardState.stepData[UploadStep.METADATA].cast = $$value;
						$$settled = false;
					},
					get crew() {
						return wizardState.stepData[UploadStep.METADATA].crew;
					},
					set crew($$value) {
						wizardState.stepData[UploadStep.METADATA].crew = $$value;
						$$settled = false;
					}
				});
			} else if (wizardState.currentStep === UploadStep.REVIEW_SUBMIT) {
				$$renderer.push("<!--[4-->");
				ReviewSubmitStep($$renderer, {
					allStepData: wizardState,
					submitting: isSubmitting,
					get termsAccepted() {
						return wizardState.stepData[UploadStep.REVIEW_SUBMIT].termsAccepted;
					},
					set termsAccepted($$value) {
						wizardState.stepData[UploadStep.REVIEW_SUBMIT].termsAccepted = $$value;
						$$settled = false;
					},
					get guidelinesAccepted() {
						return wizardState.stepData[UploadStep.REVIEW_SUBMIT].guidelinesAccepted;
					},
					set guidelinesAccepted($$value) {
						wizardState.stepData[UploadStep.REVIEW_SUBMIT].guidelinesAccepted = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="fixed bottom-0 inset-x-0 z-30 backdrop-blur-md border-t pointer-events-none" style="background: hsl(var(--portal-bg-elevated)/0.92); border-color: hsl(var(--portal-border));"><div class="mx-auto px-4 py-3 max-w-5xl flex justify-between items-center gap-3 pointer-events-auto"><button${attr("disabled", wizardState.currentStep === UploadStep.BASIC_INFO || isTransitioningStep, true)} class="bg-muted hover:bg-muted/80 disabled:opacity-50 text-foreground px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">`);
			if (isTransitioningStep) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Loading...`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`← Previous`);
			}
			$$renderer.push(`<!--]--></button> <div class="text-center text-muted-foreground font-medium">Step ${escape_html(wizardState.currentStep)} of ${escape_html(UploadStep.REVIEW_SUBMIT)}</div> `);
			if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-col items-end gap-1"><button${attr("disabled", !isCurrentStepValid() || isTransitioningStep, true)}${attr("title", currentStepBlockers().length > 0 ? `Still needed: ${currentStepBlockers().join(", ")}` : void 0)} class="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground disabled:text-muted-foreground px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">`);
				if (isTransitioningStep) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Loading...`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`Next →`);
				}
				$$renderer.push(`<!--]--></button> `);
				if (currentStepBlockers().length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground max-w-xs text-right">Still needed: <span class="text-foreground">${escape_html(currentStepBlockers().join(", "))}</span></p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex flex-col items-end gap-1"><button${attr("disabled", !isCurrentStepValid() || isTransitioningStep, true)}${attr("title", currentStepBlockers().length > 0 ? `Still needed: ${currentStepBlockers().join(", ")}` : void 0)} class="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground disabled:text-muted-foreground px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">`);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`Submit for review`);
				$$renderer.push(`<!--]--></button> `);
				if (currentStepBlockers().length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground max-w-xs text-right">Still needed: <span class="text-foreground">${escape_html(currentStepBlockers().join(", "))}</span></p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div> <div aria-hidden="true" class="h-24"></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
