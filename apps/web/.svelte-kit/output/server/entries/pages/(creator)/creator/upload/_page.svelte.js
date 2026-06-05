import { At as stringify, Lt as attr, Rt as clsx, St as derived, vt as attr_class, wt as ensure_array_like, yt as attr_style, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Upload } from "../../../../../chunks/upload.js";
import "../../../../../chunks/toast-state.svelte.js";
import "../../../../../chunks/state.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
import { i as UploadStep, r as ContentType, t as AgeRating } from "../../../../../chunks/creator.js";
//#region src/lib/components/creator/upload/StepIndicator.svelte
function StepIndicator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { steps, currentStep, isStepValid, onStepClick } = $$props;
		function statusFor(stepNumber) {
			if (stepNumber < currentStep && isStepValid[stepNumber]) return "completed";
			if (stepNumber === currentStep) return "current";
			if (stepNumber < currentStep) return "error";
			return "pending";
		}
		function classesFor(stepNumber) {
			const base = "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95";
			switch (statusFor(stepNumber)) {
				case "completed": return `${base} bg-emerald-600 border-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.25)]`;
				case "current": return `${base} bg-primary border-primary text-white shadow-[0_0_15px_hsla(var(--primary)/0.45)] scale-110`;
				case "error": return `${base} bg-red-600 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.25)]`;
				default: return `${base} border-border text-gray-500 hover:border-muted-foreground/50 hover:text-gray-300`;
			}
		}
		function connectorClasses(stepNumber) {
			return `flex-1 h-1 mx-4 transition-all duration-300 rounded ${stepNumber < currentStep && isStepValid[stepNumber] ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.2)]" : "bg-border"}`;
		}
		const progressPct = derived(() => steps.length <= 1 ? 0 : Math.round((currentStep - 1) / (steps.length - 1) * 100));
		$$renderer.push(`<div class="surface-glass border border-border/80 rounded-xl p-6"><div class="flex items-center justify-between"><!--[-->`);
		const each_array = ensure_array_like(steps);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let step = each_array[index];
			$$renderer.push(`<div${attr_class(`flex items-center ${index === steps.length - 1 ? "" : "flex-1"}`)}><div class="flex flex-col items-center"><button type="button"${attr_class(clsx(classesFor(step.step)))}${attr("disabled", step.step > currentStep && !isStepValid[step.step - 1], true)}${attr("aria-label", `Step ${step.step}: ${step.title} - ${statusFor(step.step)}`)}${attr("aria-current", step.step === currentStep ? "step" : void 0)}>`);
			if (statusFor(step.step) === "completed") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`✓`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(step.step)}`);
			}
			$$renderer.push(`<!--]--></button> <div class="mt-2 text-center"><div${attr_class(`text-sm font-medium text-white transition-colors duration-200 ${step.step === currentStep ? "text-primary" : ""}`)}>${escape_html(step.title)}</div> <div class="text-[10px] text-gray-400 max-w-20 mx-auto mt-0.5 leading-tight">${escape_html(step.description)}</div></div></div> `);
			if (index < steps.length - 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx(connectorClasses(step.step)))}></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-6"><div class="flex justify-between text-xs text-gray-400 mb-2"><span>Progress</span> <span class="font-semibold text-white">${escape_html(progressPct())}%</span></div> <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-border/40"><div class="bg-primary h-full rounded-full transition-all duration-300 shadow-[0_0_10px_hsla(var(--primary)/0.3)]"${attr_style(`width: ${stringify(progressPct())}%`)}></div></div></div></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/BasicInfoStep.svelte
function BasicInfoStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, onUpdate } = $$props;
		let title = data.title ?? "";
		let description = data.description ?? "";
		let contentType = data.contentType ?? "";
		let ageRating = data.ageRating ?? "";
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
				value: ContentType.DOCUMENTARY,
				label: "📚 Documentary",
				description: "Educational or informational content"
			},
			{
				value: ContentType.SHORT_FILM,
				label: "🎞️ Short Film",
				description: "Short narrative content"
			},
			{
				value: ContentType.SERMON,
				label: "⛪ Sermon",
				description: "Religious teaching or preaching"
			},
			{
				value: ContentType.WORSHIP,
				label: "🎵 Worship",
				description: "Worship music or service"
			},
			{
				value: ContentType.KIDS_CONTENT,
				label: "🧸 Kids Content",
				description: "Child-appropriate content"
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
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Basic Information</h2> <p class="text-gray-300">Tell us about your content</p></div> <div><label for="title" class="block text-sm font-medium text-white mb-2">Content Title *</label> <input type="text" id="title"${attr("value", title)} placeholder="Enter your content title" class="w-full px-4 py-3 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> `);
		if (title.length > 0 && title.length < 5) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-red-400 text-sm mt-1">Title must be at least 5 characters long</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-white mb-2">Description *</label> <textarea id="description" placeholder="Provide a compelling description of your content..." rows="4" class="w-full px-4 py-3 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <div class="flex justify-between text-sm mt-1"><span class="text-gray-400">`);
		if (description.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-gray-400">Description is required</span>`);
		} else if (description.length < 50) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span class="text-red-400">${escape_html(50 - description.length)} more character${escape_html(50 - description.length === 1 ? "" : "s")} to reach the 50-character minimum</span>`);
		} else if (description.length > 1e3) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<span class="text-red-400">Description is over the 1000 character limit</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-emerald-400">Good description length</span>`);
		}
		$$renderer.push(`<!--]--></span> <span class="text-gray-400">${escape_html(description.length)}/1000</span></div></div> <div role="radiogroup" aria-labelledby="contentType-label"><div id="contentType-label" class="block text-sm font-medium text-white mb-3">Content Type *</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like(contentTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio" name="contentType"${attr("value", type.value)}${attr("checked", contentType === type.value, true)} class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${contentType === type.value ? "border-primary bg-primary/10 shadow-[0_0_15px_hsla(var(--primary)/0.25)] scale-[1.02]" : "border-border bg-white/[0.02] hover:border-muted-foreground/30"}`)}><div class="font-medium text-white">${escape_html(type.label)}</div> <div class="text-sm text-gray-400 mt-0.5">${escape_html(type.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div role="radiogroup" aria-labelledby="ageRating-label"><div id="ageRating-label" class="block text-sm font-medium text-white mb-3">Age Rating *</div> <div class="grid grid-cols-2 md:grid-cols-3 gap-3"><!--[-->`);
		const each_array_1 = ensure_array_like(ageRatings);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let rating = each_array_1[$$index_1];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio" name="ageRating"${attr("value", rating.value)}${attr("checked", ageRating === rating.value, true)} class="sr-only"/> <div${attr_class(`p-3 border-2 rounded-xl text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${ageRating === rating.value ? "border-secondary bg-secondary/10 shadow-[0_0_15px_hsla(var(--secondary)/0.25)] scale-[1.02]" : "border-border bg-white/[0.02] hover:border-muted-foreground/30"}`)}><div class="font-bold text-white">${escape_html(rating.label)}</div> <div class="text-xs text-gray-400 mt-0.5">${escape_html(rating.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">ℹ️</div> <div><div class="font-medium text-white mb-1">Faith-Based Content Guidelines</div> <div class="text-sm text-yellow-100">All content will be reviewed to ensure it aligns with our Christian values and community guidelines.
          Content should be appropriate for a faith-based audience and promote positive Christian messages.</div></div></div></div></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/VideoUploadStep.svelte
function VideoUploadStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, onUpdate } = $$props;
		let videoFile = data.videoFile || null;
		let trailerFile = data.trailerFile || null;
		let videoProgress = data.videoProgress || null;
		let trailerProgress = data.trailerProgress || null;
		let minVideoHeight = 1080;
		function minResolutionWidth(h) {
			return Math.round(h * 16 / 9);
		}
		const minResolutionLabel = derived(() => `${minVideoHeight}p (${minResolutionWidth(minVideoHeight)}x${minVideoHeight})`);
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
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-muted-foreground/30 bg-white/[0.02]`)} role="button" tabindex="0" aria-label="Drop video file here or click to browse"><div class="text-4xl mb-4 floating-icon">🎬</div> <div class="text-white font-medium mb-2">Drop your video file here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Supported formats: MP4, MOV, AVI (Max: 5GB)</div> <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv" class="hidden" id="video-upload"/> <label for="video-upload" class="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg cursor-pointer inline-block font-semibold transition-opacity">Choose Video File</label></div>`);
		} else if (videoProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-6"><div class="flex justify-between items-start mb-4"><div><div class="text-white font-medium">${escape_html(videoProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(videoProgress.fileSize))}</div></div> `);
			if (videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-emerald-400 flex items-center font-medium"><span class="mr-2">✓</span> Ready</div>`);
			} else if (videoProgress.hasError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="text-red-400 flex items-center font-medium"><span class="mr-2">✗</span> Error</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button" class="text-red-400 hover:text-red-300 text-lg">✗</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (videoProgress.isUploading || !videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-2"><div class="flex justify-between text-sm text-gray-400 mb-1"><span>${escape_html(videoProgress.isCompleted ? "Ready to encode" : "Preparing...")}</span> <span>${escape_html(Math.round(videoProgress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(videoProgress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="text-sm text-gray-400">${escape_html(formatFileSize(videoProgress.uploadedBytes))} / ${escape_html(formatFileSize(videoProgress.fileSize))}</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><div class="block text-sm font-medium text-white mb-3">Trailer (Optional) <span class="text-gray-400 text-sm ml-2">Helps with discoverability</span></div> `);
		if (!trailerFile && !trailerProgress) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-border rounded-xl p-6 text-center transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:border-muted-foreground/30 bg-white/[0.02]`)} role="button" tabindex="0" aria-label="Drop trailer file here or click to browse"><div class="text-3xl mb-3 floating-icon-delayed">🎞️</div> <div class="text-white font-medium mb-2">Drop trailer here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Short preview of your content (Max: 500MB)</div> <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-m4v,video/webm,video/mpeg,video/x-matroska,.mp4,.mov,.m4v,.avi,.webm,.mpeg,.mpg,.mkv" class="hidden" id="trailer-upload"/> <label for="trailer-upload" class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg cursor-pointer inline-block font-semibold transition-opacity">Choose Trailer</label></div>`);
		} else if (trailerProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-4"><div class="flex justify-between items-start mb-3"><div><div class="text-white font-medium">${escape_html(trailerProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(trailerProgress.fileSize))}</div></div> `);
			if (trailerProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-emerald-400 flex items-center font-medium"><span class="mr-2">✓</span> Ready</div>`);
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
	});
}
//#endregion
//#region src/lib/components/creator/upload/AssetManagementStep.svelte
function AssetManagementStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, onUpdate } = $$props;
		let uploadedAssets = data.uploadedAssets || {};
		let assetProgress = data.assetProgress || [];
		const MB = 1024 * 1024;
		const assetTypes = [
			{
				key: "posterPortrait",
				title: "Portrait Poster",
				description: "2:3 ratio - Main movie cards",
				icon: "📱",
				aspectRatio: "2:3",
				required: true,
				recommendations: "Minimum 400x600px, Max 2MB",
				maxBytes: 2 * MB
			},
			{
				key: "backdropHero",
				title: "Hero Background",
				description: "16:9 ratio - Hero carousel",
				icon: "🖼️",
				aspectRatio: "16:9",
				required: true,
				recommendations: "Minimum 1920x1080px, Max 5MB",
				maxBytes: 5 * MB
			},
			{
				key: "posterLandscape",
				title: "Landscape Poster",
				description: "16:9 ratio - Horizontal cards",
				icon: "🖥️",
				aspectRatio: "16:9",
				required: false,
				recommendations: "Minimum 800x450px, Max 3MB",
				maxBytes: 3 * MB
			},
			{
				key: "posterSquare",
				title: "Square Poster",
				description: "1:1 ratio - Mobile/compact views",
				icon: "📐",
				aspectRatio: "1:1",
				required: false,
				recommendations: "Minimum 400x400px, Max 2MB",
				maxBytes: 2 * MB
			},
			{
				key: "logoTitle",
				title: "Title Logo",
				description: "Transparent PNG - Movie title",
				icon: "🏷️",
				aspectRatio: "flexible",
				required: false,
				recommendations: "PNG with transparency, Max 1MB",
				maxBytes: 1 * MB
			},
			{
				key: "thumbnail",
				title: "Video Thumbnail",
				description: "16:9 ratio - Video preview",
				icon: "🎬",
				aspectRatio: "16:9",
				required: false,
				recommendations: "Minimum 640x360px, Max 1MB",
				maxBytes: 1 * MB
			}
		];
		new Set([
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/avif"
		]);
		function getAssetProgress(assetType) {
			return assetProgress.find((p) => p.assetType === assetType);
		}
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Image Assets &amp; Media</h2> <p class="text-gray-300">Upload images that will represent your content across the platform</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
		const each_array = ensure_array_like(assetTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let assetType = each_array[$$index];
			const progress = getAssetProgress(assetType.key);
			const isUploaded = uploadedAssets[assetType.key];
			const isUploading = progress && !progress.isCompleted;
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-6"><div class="flex justify-between items-start mb-4"><div><div class="flex items-center"><span class="text-2xl mr-2">${escape_html(assetType.icon)}</span> <div><div class="font-medium text-white">${escape_html(assetType.title)}</div> `);
			if (assetType.required) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-[10px] bg-primary/95 text-white px-2 py-0.5 rounded shadow-[0_0_10px_hsla(var(--primary)/0.2)] font-semibold uppercase tracking-wider">Required</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="text-sm text-gray-400 mt-1">${escape_html(assetType.description)}</div> <div class="text-xs text-gray-500 mt-1">${escape_html(assetType.recommendations)}</div></div> `);
			if (isUploaded && !isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="text-red-400 hover:text-red-300 text-xl font-bold p-1">✗</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (isUploaded && !isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="relative group overflow-hidden rounded-lg border border-border/60"><img${attr("src", uploadedAssets[assetType.key])}${attr("alt", assetType.title)} class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"/> <div class="absolute top-2 right-2 bg-emerald-600/90 text-white text-xs px-2 py-1 rounded font-medium shadow-md">✓ Uploaded</div></div>`);
			} else if (isUploading && progress) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="space-y-3"><div class="text-sm text-white truncate">${escape_html(progress.fileName)}</div> <div class="flex justify-between text-xs text-gray-400"><span>Uploading...</span> <span>${escape_html(Math.round(progress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(progress.progressPercentage)}%`)}></div></div></div>`);
			} else if (progress && progress.hasError) {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<div class="bg-red-950/25 border border-red-900/50 rounded-xl p-4 space-y-2"><div class="text-sm font-semibold text-red-200">Upload failed</div> <div class="text-xs text-red-300">${escape_html(progress.errorMessage ?? "Unknown error")}</div> <button type="button" class="text-xs text-white bg-red-600 hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity font-semibold">Try another file</button></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="border-2 border-dashed border-border rounded-xl p-6 text-center bg-white/[0.01] hover:border-primary/50 hover:bg-primary/[0.02] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200" role="button" tabindex="0"${attr("aria-label", `Drop ${assetType.title} image here or click to browse`)}><div class="text-gray-400 text-sm mb-3">Drop image here or click to browse</div> <input type="file" accept="image/png,image/jpeg,image/webp,image/avif,.png,.jpg,.jpeg,.webp,.avif" class="hidden"${attr("id", `upload-${stringify(assetType.key)}`)}/> <label${attr("for", `upload-${stringify(assetType.key)}`)} class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block font-semibold transition-opacity">Choose Image</label> <div class="text-xs text-gray-500 mt-2">Aspect Ratio: ${escape_html(assetType.aspectRatio)}</div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">💡</div> <div><div class="font-medium text-white mb-1">Image Asset Tips</div> <div class="text-sm text-yellow-100 space-y-1"><div>• High-quality images perform better and look more professional</div> <div>• Use images that accurately represent your content</div> <div>• Avoid text-heavy images as they may not scale well</div> <div>• Ensure images are appropriate for all age groups viewing your content</div> <div>• Images will be automatically optimized for different screen sizes</div></div></div></div></div> `);
		if (assetProgress.length > 0 || Object.keys(uploadedAssets).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white/5 border border-border/80 rounded-xl p-4"><div class="text-white font-medium mb-3">Upload Summary</div> <div class="text-sm text-gray-300">${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.filter((a) => a.required).length)} required assets uploaded</div> <div class="text-sm text-gray-300">${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.length)} total assets uploaded</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/MetadataStep.svelte
function MetadataStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, onUpdate } = $$props;
		let bibleReferences = data.bibleReferences || [];
		let themes = data.themes || [];
		let ministryAffiliation = data.ministryAffiliation || "";
		let duration = typeof data.duration === "number" ? data.duration : data.duration ? Number(data.duration) || "" : "";
		let language = data.language || "English";
		let hasSubtitles = data.hasSubtitles || false;
		let hasClosedCaptions = data.hasClosedCaptions || false;
		let tags = data.tags || [];
		let keywords = data.keywords || [];
		let genre = data.genre || [];
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
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Content Metadata</h2> <p class="text-gray-300">Add details to help users discover and understand your content</p></div> <div><label for="bible-references" class="block text-sm font-medium text-white mb-3">Bible References</label> <div class="flex gap-2 mb-3"><input type="text" id="bible-references"${attr("value", newBibleRef)} placeholder="e.g., John 3:16, Romans 8:28" class="flex-1 px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
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
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("value", theme)}${attr("checked", themes.includes(theme), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${themes.includes(theme) ? "border-primary bg-primary/10 shadow-[0_0_12px_hsla(var(--primary)/0.2)] text-white scale-[1.03]" : "border-border bg-white/[0.02] text-gray-300 hover:border-muted-foreground/30"}`)}>${escape_html(theme)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="ministry" class="block text-sm font-medium text-white mb-2">Ministry/Organization Affiliation</label> <input type="text" id="ministry"${attr("value", ministryAffiliation)} placeholder="e.g., Grace Community Church, Victory Ministries" class="w-full px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <div class="text-xs text-gray-400 mt-1">Optional: Name of the church, ministry, or organization associated with this content</div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="duration" class="block text-sm font-medium text-white mb-2">Duration (minutes)</label> <input type="number" id="duration"${attr("value", duration)} placeholder="90" min="1" class="w-full px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/></div> <div><label for="language" class="block text-sm font-medium text-white mb-2">Primary Language</label> `);
		$$renderer.select({
			id: "language",
			value: language,
			class: "w-full px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(languages);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let lang = each_array_2[$$index_2];
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
		const each_array_3 = ensure_array_like(commonGenres);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let genreOption = each_array_3[$$index_3];
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("value", genreOption)}${attr("checked", genre.includes(genreOption), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-xl text-center text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${genre.includes(genreOption) ? "border-secondary bg-secondary/10 shadow-[0_0_12px_hsla(var(--secondary)/0.2)] text-white scale-[1.03]" : "border-border bg-white/[0.02] text-gray-300 hover:border-muted-foreground/30"}`)}>${escape_html(genreOption)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="tags-input" class="block text-sm font-medium text-white mb-3">Tags</label> <div class="flex gap-2 mb-3"><input type="text" id="tags-input"${attr("value", newTag)} placeholder="Add custom tags..." class="flex-1 px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
		if (tags.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_4 = ensure_array_like(tags);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let tag = each_array_4[$$index_4];
				$$renderer.push(`<span class="bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center font-medium shadow-sm">${escape_html(tag)} <button type="button" class="ml-2 hover:text-red-200 font-bold">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="keywords-input" class="block text-sm font-medium text-white mb-3">SEO Keywords</label> <div class="flex gap-2 mb-3"><input type="text" id="keywords-input"${attr("value", newKeyword)} placeholder="Add search keywords..." class="flex-1 px-4 py-2 bg-white/[0.04] border border-border/80 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/> <button type="button" class="bg-secondary hover:opacity-90 text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition-opacity">Add</button></div> `);
		if (keywords.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_5 = ensure_array_like(keywords);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let keyword = each_array_5[$$index_5];
				$$renderer.push(`<span class="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center font-semibold shadow-sm">${escape_html(keyword)} <button type="button" class="ml-2 hover:text-red-200 font-bold">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">Keywords help users find your content through search</div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">📝</div> <div><div class="font-medium text-white mb-1">Metadata Best Practices</div> <div class="text-sm text-yellow-100 space-y-1"><div>• Add relevant Bible references that connect to your content's message</div> <div>• Choose themes that accurately represent your content</div> <div>• Use specific, searchable keywords that your audience might use</div> <div>• Be honest about content duration and accessibility features</div> <div>• Well-structured metadata improves discoverability</div></div></div></div></div></div>`);
	});
}
//#endregion
//#region src/lib/components/creator/upload/ReviewSubmitStep.svelte
function ReviewSubmitStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, allStepData, onUpdate, submitting = false } = $$props;
		let termsAccepted = data.termsAccepted || false;
		let guidelinesAccepted = data.guidelinesAccepted || false;
		const basicInfo = derived(() => allStepData.stepData[UploadStep.BASIC_INFO]);
		const videoData = derived(() => allStepData.stepData[UploadStep.VIDEO_UPLOAD]);
		const assetData = derived(() => allStepData.stepData[UploadStep.ASSET_MANAGEMENT]);
		const metadataInfo = derived(() => allStepData.stepData[UploadStep.METADATA]);
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Review &amp; Submit</h2> <p class="text-gray-300">Review your content details before submitting for approval</p></div> <div class="bg-white/5 border border-border/80 rounded-xl p-6"><h3 class="text-xl font-bold text-white mb-4">Content Summary</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">ℹ️</span> Basic Information</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Title:</span> <span class="text-white font-medium">${escape_html(basicInfo().title || "Not provided")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Type:</span> <span class="text-white capitalize">${escape_html(basicInfo().contentType || "Not selected")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Age Rating:</span> <span class="text-white font-medium">${escape_html(basicInfo().ageRating || "Not selected")}</span></div></div></div> <div><h4 class="font-semibold text-white mb-2 flex items-center gap-1.5"><span class="text-primary">🎬</span> Video Content</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Main Video:</span> <span class="text-white font-medium">`);
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
			$$renderer.push(`<div class="mt-6 border-t border-border/40 pt-4"><h4 class="font-semibold text-white mb-2">Description</h4> <div class="text-sm text-gray-300 bg-white/[0.02] border border-border/45 p-3 rounded-lg whitespace-pre-line">${escape_html(basicInfo().description)}</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-primary/5 border border-primary/20 rounded-xl p-6"><h3 class="text-xl font-bold text-white mb-4">Review Process</h3> <div class="space-y-3 text-sm text-gray-300"><div class="flex items-start"><span class="text-lg mr-3">1️⃣</span> <div><div class="font-semibold text-white">Theological Review</div> <div class="text-gray-400">Content will be reviewed for doctrinal accuracy and biblical alignment</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">2️⃣</span> <div><div class="font-semibold text-white">Content Moderation</div> <div class="text-gray-400">General content review for appropriateness and quality</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">3️⃣</span> <div><div class="font-semibold text-white">Technical Quality Assurance</div> <div class="text-gray-400">Video and audio quality, technical specifications check</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">✅</span> <div><div class="font-semibold text-white">Final Approval &amp; Publishing</div> <div class="text-gray-400">Content goes live on the platform for all users</div></div></div></div> <div class="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg"><div class="text-sm text-white/90"><strong>Expected Review Time:</strong> 3-5 business days<br/> <strong>Status Updates:</strong> You'll receive dashboard and email notifications at each stage</div></div></div> <div class="space-y-4"><h3 class="text-xl font-bold text-white">Terms and Guidelines</h3> <div class="bg-white/5 border border-border/80 rounded-xl p-6 space-y-4"><label class="flex items-start cursor-pointer"><input type="checkbox"${attr("checked", guidelinesAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"/> <div class="text-sm select-none"><div class="text-white font-medium mb-1">Content Guidelines Acceptance</div> <div class="text-gray-300">I confirm that my content aligns with Sephar Studios' faith-based content guidelines,
            promotes positive Christian values, and is appropriate for the intended audience.
            I understand that content not meeting these standards may be rejected.</div></div></label> <label class="flex items-start cursor-pointer"><input type="checkbox"${attr("checked", termsAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-primary bg-gray-900 border-border rounded focus:ring-primary focus:outline-none cursor-pointer"/> <div class="text-sm select-none"><div class="text-white font-medium mb-1">Terms of Service Agreement</div> <div class="text-gray-300">I agree to the Sephar Studios Terms of Service, Creator Agreement, and Privacy Policy.
            I confirm that I have the rights to submit this content and that it does not infringe
            on any third-party copyrights or intellectual property.</div></div></label></div></div> <div class="bg-secondary/10 border border-secondary/30 rounded-xl p-4"><div class="flex items-start"><div class="text-2xl mr-3">⚠️</div> <div><div class="font-medium text-white mb-1">Before You Submit</div> <div class="text-sm text-yellow-100 space-y-1"><div>• Ensure all required fields are completed accurately</div> <div>• Double-check your video quality and audio clarity</div> <div>• Verify that all uploaded images represent your content appropriately</div> <div>• Make sure your content aligns with our faith-based community standards</div> <div>• Content cannot be edited once submitted - you'll need to resubmit if changes are needed</div></div></div></div></div> <div class="text-center pt-6 text-sm text-gray-400">`);
		if (!termsAccepted || !guidelinesAccepted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`Tick both boxes above, then use the <span class="text-white font-medium">Submit for review</span> button below to send this for approval.`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`Ready. Use the Submit for review button below to send this for approval.`);
		}
		$$renderer.push(`<!--]--></div></div>`);
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
				[UploadStep.BASIC_INFO]: {},
				[UploadStep.VIDEO_UPLOAD]: {},
				[UploadStep.ASSET_MANAGEMENT]: {
					uploadedAssets: {},
					assetProgress: []
				},
				[UploadStep.METADATA]: {},
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
		const steps = [
			{
				step: UploadStep.BASIC_INFO,
				title: "Basic Info",
				description: "Content details and type"
			},
			{
				step: UploadStep.VIDEO_UPLOAD,
				title: "Video Upload",
				description: "Upload your content files"
			},
			{
				step: UploadStep.ASSET_MANAGEMENT,
				title: "Images & Assets",
				description: "Upload promotional images"
			},
			{
				step: UploadStep.METADATA,
				title: "Metadata",
				description: "Additional details and tags"
			},
			{
				step: UploadStep.REVIEW_SUBMIT,
				title: "Review & Submit",
				description: "Final review and submission"
			}
		];
		function goToStep(step) {
			wizardState.currentStep = step;
		}
		function updateStepData(step, data) {
			wizardState.stepData[step] = {
				...wizardState.stepData[step],
				...data
			};
		}
		function missingFieldsForStep(step) {
			const missing = [];
			switch (step) {
				case UploadStep.BASIC_INFO: {
					const d = wizardState.stepData[step];
					if (!d.title || d.title.trim().length < 5) missing.push("Title (at least 5 characters)");
					if (!d.description || d.description.trim().length < 50) missing.push("Description (at least 50 characters)");
					if (!d.contentType) missing.push("Content type");
					if (!d.ageRating) missing.push("Age rating");
					break;
				}
				case UploadStep.VIDEO_UPLOAD:
					if (!wizardState.stepData[step].videoProgress?.isCompleted) missing.push("Video upload");
					break;
				case UploadStep.ASSET_MANAGEMENT: {
					const d = wizardState.stepData[step];
					if (!d.uploadedAssets?.posterPortrait) missing.push("Portrait poster");
					if (!d.uploadedAssets?.backdropHero) missing.push("Hero background");
					break;
				}
				case UploadStep.METADATA: break;
				case UploadStep.REVIEW_SUBMIT: {
					const d = wizardState.stepData[step];
					if (!d.termsAccepted) missing.push("Terms acceptance");
					if (!d.guidelinesAccepted) missing.push("Guidelines acceptance");
					break;
				}
			}
			return missing;
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
		$$renderer.push(`<div class="container mx-auto px-4 py-6 space-y-6">`);
		PageHeader($$renderer, {
			icon: Upload,
			title: "Upload",
			subtitle: "Submit a new video for review and encoding."
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		StepIndicator($$renderer, {
			steps,
			currentStep: wizardState.currentStep,
			isStepValid: stepValidity(),
			onStepClick: goToStep
		});
		$$renderer.push(`<!----> <div class="surface-glass border border-border/80 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">`);
		if (wizardState.currentStep === UploadStep.BASIC_INFO) {
			$$renderer.push("<!--[0-->");
			BasicInfoStep($$renderer, {
				data: wizardState.stepData[UploadStep.BASIC_INFO],
				onUpdate: (data) => updateStepData(UploadStep.BASIC_INFO, data)
			});
		} else if (wizardState.currentStep === UploadStep.VIDEO_UPLOAD) {
			$$renderer.push("<!--[1-->");
			VideoUploadStep($$renderer, {
				data: wizardState.stepData[UploadStep.VIDEO_UPLOAD],
				onUpdate: (data) => updateStepData(UploadStep.VIDEO_UPLOAD, data)
			});
		} else if (wizardState.currentStep === UploadStep.ASSET_MANAGEMENT) {
			$$renderer.push("<!--[2-->");
			AssetManagementStep($$renderer, {
				data: wizardState.stepData[UploadStep.ASSET_MANAGEMENT],
				onUpdate: (data) => updateStepData(UploadStep.ASSET_MANAGEMENT, data)
			});
		} else if (wizardState.currentStep === UploadStep.METADATA) {
			$$renderer.push("<!--[3-->");
			MetadataStep($$renderer, {
				data: wizardState.stepData[UploadStep.METADATA],
				onUpdate: (data) => updateStepData(UploadStep.METADATA, data)
			});
		} else if (wizardState.currentStep === UploadStep.REVIEW_SUBMIT) {
			$$renderer.push("<!--[4-->");
			ReviewSubmitStep($$renderer, {
				data: wizardState.stepData[UploadStep.REVIEW_SUBMIT],
				allStepData: wizardState,
				onUpdate: (data) => updateStepData(UploadStep.REVIEW_SUBMIT, data),
				submitting: isSubmitting
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex justify-between items-center max-w-4xl mx-auto pt-4"><button${attr("disabled", wizardState.currentStep === UploadStep.BASIC_INFO || isSubmitting, true)} class="bg-muted hover:bg-muted/80 disabled:opacity-50 text-foreground px-6 py-3 rounded-lg font-medium transition-colors">← Previous</button> <div class="text-center text-muted-foreground font-medium">Step ${escape_html(wizardState.currentStep)} of ${escape_html(UploadStep.REVIEW_SUBMIT)}</div> `);
		if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col items-end gap-1"><button${attr("disabled", !isCurrentStepValid() || isSubmitting, true)}${attr("title", currentStepBlockers().length > 0 ? `Still needed: ${currentStepBlockers().join(", ")}` : void 0)} class="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">Next →</button> `);
			if (currentStepBlockers().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground max-w-xs text-right">Still needed: <span class="text-foreground">${escape_html(currentStepBlockers().join(", "))}</span></p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex flex-col items-end gap-1"><button${attr("disabled", !isCurrentStepValid() || isSubmitting, true)}${attr("title", currentStepBlockers().length > 0 ? `Still needed: ${currentStepBlockers().join(", ")}` : void 0)} class="bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-opacity">${escape_html("Submit for review")}</button> `);
			if (currentStepBlockers().length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground max-w-xs text-right">Still needed: <span class="text-foreground">${escape_html(currentStepBlockers().join(", "))}</span></p>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
