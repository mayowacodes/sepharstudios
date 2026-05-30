import { aa as attr, an as escape_html, al as ensure_array_like, ab as attr_class, ag as clsx$1, ac as attr_style, aK as stringify, ae as bind_props } from './ui-libs-TtGtWAGI.js';
import './client-CZa6R-ON.js';
import { U as UploadStep, a as ContentType, A as AgeRating } from './creator-B732_51J.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
import './index-DBqjc0Yf.js';

//#region src/lib/components/creator/upload/StepIndicator.svelte
function StepIndicator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let steps = $$props["steps"];
		let currentStep = $$props["currentStep"];
		let isStepValid = $$props["isStepValid"];
		let onStepClick = $$props["onStepClick"];
		function getStepStatus(stepNumber) {
			if (stepNumber < currentStep && isStepValid[stepNumber]) return "completed";
			else if (stepNumber === currentStep) return "current";
			else if (stepNumber < currentStep) return "error";
			else return "pending";
		}
		function getStepClasses(stepNumber) {
			const status = getStepStatus(stepNumber);
			const baseClasses = "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all cursor-pointer";
			switch (status) {
				case "completed": return `${baseClasses} bg-green-600 border-green-600 text-white`;
				case "current": return `${baseClasses} bg-purple-600 border-purple-600 text-white`;
				case "error": return `${baseClasses} bg-red-600 border-red-600 text-white`;
				default: return `${baseClasses} border-gray-500 text-gray-400`;
			}
		}
		function getConnectorClasses(stepNumber) {
			return `flex-1 h-1 mx-4 ${stepNumber < currentStep && isStepValid[stepNumber] ? "bg-green-600" : "bg-gray-600"}`;
		}
		$$renderer.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6"><div class="flex items-center justify-between"><!--[-->`);
		const each_array = ensure_array_like(steps);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let step = each_array[index];
			$$renderer.push(`<div${attr_class(`flex items-center ${index === steps.length - 1 ? "" : "flex-1"}`)}><div class="flex flex-col items-center"><button${attr_class(clsx$1(getStepClasses(step.step)))}${attr("disabled", step.step > currentStep && !isStepValid[step.step - 1], true)}${attr("aria-label", `Step ${step.step}: ${step.title} - ${getStepStatus(step.step)}`)}${attr("aria-current", step.step === currentStep ? "step" : void 0)}>`);
			if (getStepStatus(step.step) === "completed") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`✓`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(step.step)}`);
			}
			$$renderer.push(`<!--]--></button> <div class="mt-2 text-center"><div class="text-sm font-medium text-white">${escape_html(step.title)}</div> <div class="text-xs text-gray-400 max-w-20">${escape_html(step.description)}</div></div></div> `);
			if (index < steps.length - 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx$1(getConnectorClasses(step.step)))}></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-6"><div class="flex justify-between text-sm text-gray-400 mb-2"><span>Progress</span> <span>${escape_html(Math.round(currentStep / steps.length * 100))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-purple-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(currentStep / steps.length * 100)}%`)}></div></div></div></div>`);
		bind_props($$props, {
			steps,
			currentStep,
			isStepValid,
			onStepClick
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/BasicInfoStep.svelte
function BasicInfoStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let onUpdate = $$props["onUpdate"];
		let title = data.title || "";
		let description = data.description || "";
		let contentType = data.contentType || "";
		let ageRating = data.ageRating || "";
		let isPpv = data.isPpv || false;
		let ppvPriceDollars = data.ppvPriceDollars || "";
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
		onUpdate({
			title,
			description,
			contentType,
			ageRating,
			isPpv,
			ppvPriceDollars: isPpv ? ppvPriceDollars : ""
		});
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Basic Information</h2> <p class="text-gray-300">Tell us about your content</p></div> <div><label for="title" class="block text-sm font-medium text-white mb-2">Content Title *</label> <input type="text" id="title"${attr("value", title)} placeholder="Enter your content title" class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/> `);
		if (title.length > 0 && title.length < 5) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-red-400 text-sm mt-1">Title must be at least 5 characters long</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-white mb-2">Description *</label> <textarea id="description" placeholder="Provide a compelling description of your content..." rows="4" class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none">`);
		const $$body = escape_html(description);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <div class="flex justify-between text-sm mt-1"><span class="text-gray-400">`);
		if (description.length < 50) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-red-400">Description should be at least 50 characters</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-green-400">Good description length</span>`);
		}
		$$renderer.push(`<!--]--></span> <span class="text-gray-400">${escape_html(description.length)}/1000</span></div></div> <div><label for="contentType" class="block text-sm font-medium text-white mb-3">Content Type *</label> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like(contentTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio"${attr("checked", contentType === type.value, true)}${attr("value", type.value)} class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg transition-all ${contentType === type.value ? "border-purple-600 bg-purple-600/20" : "border-gray-600 bg-white/5 hover:border-gray-500"}`)}><div class="font-medium text-white">${escape_html(type.label)}</div> <div class="text-sm text-gray-400">${escape_html(type.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="ageRating" class="block text-sm font-medium text-white mb-3">Age Rating *</label> <div class="grid grid-cols-2 md:grid-cols-3 gap-3"><!--[-->`);
		const each_array_1 = ensure_array_like(ageRatings);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let rating = each_array_1[$$index_1];
			$$renderer.push(`<label class="cursor-pointer"><input type="radio"${attr("checked", ageRating === rating.value, true)}${attr("value", rating.value)} class="sr-only"/> <div${attr_class(`p-3 border-2 rounded-lg text-center transition-all ${ageRating === rating.value ? "border-green-600 bg-green-600/20" : "border-gray-600 bg-white/5 hover:border-gray-500"}`)}><div class="font-bold text-white">${escape_html(rating.label)}</div> <div class="text-xs text-gray-400">${escape_html(rating.description)}</div></div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label class="flex items-center gap-3 cursor-pointer"><input type="checkbox"${attr("checked", isPpv, true)} class="w-4 h-4 accent-purple-600"/> <span class="text-sm font-medium text-white">Suggest Pay-Per-View (PPV) pricing</span></label> <p class="text-xs text-gray-400 mt-1 ml-7">Admin will review and set the final price. PPV content earns you a higher per-view revenue share.</p> `);
		if (isPpv) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-3 ml-7"><label for="ppvPrice" class="block text-xs text-gray-300 mb-1">Suggested price (USD)</label> <div class="flex items-center gap-2 w-40"><span class="text-gray-400">$</span> <input type="number" id="ppvPrice"${attr("value", ppvPriceDollars)} min="0.99" max="49.99" step="0.01" placeholder="4.99" class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"/></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><div class="flex items-start"><div class="text-2xl mr-3">ℹ️</div> <div><div class="font-medium text-white mb-1">Faith-Based Content Guidelines</div> <div class="text-sm text-blue-200">All content will be reviewed to ensure it aligns with our Christian values and community guidelines. 
          Content should be appropriate for a faith-based audience and promote positive Christian messages.</div></div></div></div></div>`);
		bind_props($$props, {
			data,
			onUpdate
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/VideoUploadStep.svelte
function VideoUploadStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let onUpdate = $$props["onUpdate"];
		let videoFile = data.videoFile || null;
		let trailerFile = data.trailerFile || null;
		let videoProgress = data.videoProgress || null;
		let trailerProgress = data.trailerProgress || null;
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
		onUpdate({
			videoFile,
			trailerFile,
			videoProgress,
			trailerProgress
		});
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Upload Video Content</h2> <p class="text-gray-300">Upload your main content and optional trailer</p></div> <div><div class="block text-sm font-medium text-white mb-3">Main Video Content *</div> `);
		if (!videoFile && !videoProgress) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-all hover:border-gray-500`)} role="button" tabindex="0" aria-label="Drop video file here or click to browse"><div class="text-4xl mb-4">🎬</div> <div class="text-white font-medium mb-2">Drop your video file here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Supported formats: MP4, MOV, AVI (Max: 5GB)</div> <input type="file" accept="video/*" class="hidden" id="video-upload"/> <label for="video-upload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors">Choose Video File</label></div>`);
		} else if (videoProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/10 rounded-lg p-6"><div class="flex justify-between items-start mb-4"><div><div class="text-white font-medium">${escape_html(videoProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(videoProgress.fileSize))}</div></div> `);
			if (videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-green-400 flex items-center"><span class="mr-2">✓</span> Ready</div>`);
			} else if (videoProgress.hasError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="text-red-400 flex items-center"><span class="mr-2">✗</span> Error</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button class="text-red-400 hover:text-red-300">✗</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (videoProgress.isUploading || !videoProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-2"><div class="flex justify-between text-sm text-gray-400 mb-1"><span>${escape_html(videoProgress.isCompleted ? "Ready to encode" : "Preparing...")}</span> <span>${escape_html(Math.round(videoProgress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-purple-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(videoProgress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="text-sm text-gray-400">${escape_html(formatFileSize(videoProgress.uploadedBytes))} / ${escape_html(formatFileSize(videoProgress.fileSize))}</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><div class="block text-sm font-medium text-white mb-3">Trailer (Optional) <span class="text-gray-400 text-sm ml-2">Helps with discoverability</span></div> `);
		if (!trailerFile && !trailerProgress) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-all hover:border-gray-500`)} role="button" tabindex="0" aria-label="Drop trailer file here or click to browse"><div class="text-3xl mb-3">🎞️</div> <div class="text-white font-medium mb-2">Drop trailer here or click to browse</div> <div class="text-gray-400 text-sm mb-4">Short preview of your content (Max: 500MB)</div> <input type="file" accept="video/*" class="hidden" id="trailer-upload"/> <label for="trailer-upload" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors">Choose Trailer</label></div>`);
		} else if (trailerProgress) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="bg-white/10 rounded-lg p-4"><div class="flex justify-between items-start mb-3"><div><div class="text-white font-medium">${escape_html(trailerProgress.fileName)}</div> <div class="text-gray-400 text-sm">${escape_html(formatFileSize(trailerProgress.fileSize))}</div></div> `);
			if (trailerProgress.isCompleted) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="text-green-400 flex items-center"><span class="mr-2">✓</span> Ready</div>`);
			} else if (trailerProgress.hasError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="text-red-400 flex items-center"><span class="mr-2">✗</span> Error</div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button class="text-red-400 hover:text-red-300">✗</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (trailerProgress.isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mb-2"><div class="flex justify-between text-sm text-gray-400 mb-1"><span>Uploading...</span> <span>${escape_html(Math.round(trailerProgress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(trailerProgress.progressPercentage)}%`)}></div></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><div class="flex items-start"><div class="text-2xl mr-3">⚠️</div> <div><div class="font-medium text-white mb-1">Video Upload Guidelines</div> <div class="text-sm text-yellow-200 space-y-1"><div>• Videos should be in MP4 format for best compatibility</div> <div>• Minimum resolution: 720p (1280x720)</div> <div>• Audio should be clear and free from background noise</div> <div>• Content will be processed and optimized after upload</div> <div>• Upload may take several minutes depending on file size</div></div></div></div></div></div>`);
		bind_props($$props, {
			data,
			onUpdate
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/AssetManagementStep.svelte
function AssetManagementStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let onUpdate = $$props["onUpdate"];
		let uploadedAssets = data.uploadedAssets || {};
		let assetProgress = data.assetProgress || [];
		const assetTypes = [
			{
				key: "posterPortrait",
				title: "Portrait Poster",
				description: "2:3 ratio - Main movie cards",
				icon: "📱",
				aspectRatio: "2:3",
				required: true,
				recommendations: "Minimum 400x600px, Max 2MB"
			},
			{
				key: "backdropHero",
				title: "Hero Background",
				description: "16:9 ratio - Hero carousel",
				icon: "🖼️",
				aspectRatio: "16:9",
				required: true,
				recommendations: "Minimum 1920x1080px, Max 5MB"
			},
			{
				key: "posterLandscape",
				title: "Landscape Poster",
				description: "16:9 ratio - Horizontal cards",
				icon: "🖥️",
				aspectRatio: "16:9",
				required: false,
				recommendations: "Minimum 800x450px, Max 3MB"
			},
			{
				key: "posterSquare",
				title: "Square Poster",
				description: "1:1 ratio - Mobile/compact views",
				icon: "📐",
				aspectRatio: "1:1",
				required: false,
				recommendations: "Minimum 400x400px, Max 2MB"
			},
			{
				key: "logoTitle",
				title: "Title Logo",
				description: "Transparent PNG - Movie title",
				icon: "🏷️",
				aspectRatio: "flexible",
				required: false,
				recommendations: "PNG with transparency, Max 1MB"
			},
			{
				key: "thumbnail",
				title: "Video Thumbnail",
				description: "16:9 ratio - Video preview",
				icon: "🎬",
				aspectRatio: "16:9",
				required: false,
				recommendations: "Minimum 640x360px, Max 1MB"
			}
		];
		function getAssetProgress(assetType) {
			return assetProgress.find((p) => p.assetType === assetType);
		}
		onUpdate({
			uploadedAssets,
			assetProgress
		});
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Image Assets &amp; Media</h2> <p class="text-gray-300">Upload images that will represent your content across the platform</p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><!--[-->`);
		const each_array = ensure_array_like(assetTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let assetType = each_array[$$index];
			const progress = getAssetProgress(assetType.key);
			const isUploaded = uploadedAssets[assetType.key];
			const isUploading = progress && !progress.isCompleted;
			$$renderer.push(`<div class="bg-white/10 rounded-lg p-6"><div class="flex justify-between items-start mb-4"><div><div class="flex items-center"><span class="text-2xl mr-2">${escape_html(assetType.icon)}</span> <div><div class="font-medium text-white">${escape_html(assetType.title)}</div> `);
			if (assetType.required) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-xs bg-red-600 text-white px-2 py-1 rounded">Required</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="text-sm text-gray-400 mt-1">${escape_html(assetType.description)}</div> <div class="text-xs text-gray-500 mt-1">${escape_html(assetType.recommendations)}</div></div> `);
			if (isUploaded && !isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="text-red-400 hover:text-red-300 text-xl">✗</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (isUploaded && !isUploading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="relative"><img${attr("src", uploadedAssets[assetType.key])}${attr("alt", assetType.title)} class="w-full h-32 object-cover rounded-lg"/> <div class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">✓ Uploaded</div></div>`);
			} else if (isUploading && progress) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="space-y-3"><div class="text-sm text-white">${escape_html(progress.fileName)}</div> <div class="flex justify-between text-xs text-gray-400"><span>Uploading...</span> <span>${escape_html(Math.round(progress.progressPercentage))}%</span></div> <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(progress.progressPercentage)}%`)}></div></div></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-all" role="button" tabindex="0"${attr("aria-label", `Drop ${assetType.title} image here or click to browse`)}><div class="text-gray-400 text-sm mb-3">Drop image here or click to browse</div> <input type="file" accept="image/*" class="hidden"${attr("id", `upload-${stringify(assetType.key)}`)}/> <label${attr("for", `upload-${stringify(assetType.key)}`)} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block transition-colors">Choose Image</label> <div class="text-xs text-gray-500 mt-2">Aspect Ratio: ${escape_html(assetType.aspectRatio)}</div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4"><div class="flex items-start"><div class="text-2xl mr-3">💡</div> <div><div class="font-medium text-white mb-1">Image Asset Tips</div> <div class="text-sm text-blue-200 space-y-1"><div>• High-quality images perform better and look more professional</div> <div>• Use images that accurately represent your content</div> <div>• Avoid text-heavy images as they may not scale well</div> <div>• Ensure images are appropriate for all age groups viewing your content</div> <div>• Images will be automatically optimized for different screen sizes</div></div></div></div></div> `);
		if (assetProgress.length > 0 || Object.keys(uploadedAssets).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white/10 rounded-lg p-4"><div class="text-white font-medium mb-3">Upload Summary</div> <div class="text-sm text-gray-300">${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.filter((a) => a.required).length)} required assets uploaded</div> <div class="text-sm text-gray-300">${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.length)} total assets uploaded</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			data,
			onUpdate
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/MetadataStep.svelte
function MetadataStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let onUpdate = $$props["onUpdate"];
		let bibleReferences = data.bibleReferences || [];
		let themes = data.themes || [];
		let ministryAffiliation = data.ministryAffiliation || "";
		let duration = data.duration || "";
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
		onUpdate({
			bibleReferences,
			themes,
			ministryAffiliation,
			duration,
			language,
			hasSubtitles,
			hasClosedCaptions,
			tags,
			keywords,
			genre
		});
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Content Metadata</h2> <p class="text-gray-300">Add details to help users discover and understand your content</p></div> <div><label for="bible-references" class="block text-sm font-medium text-white mb-3">Bible References</label> <div class="flex gap-2 mb-3"><input type="text" id="bible-references"${attr("value", newBibleRef)} placeholder="e.g., John 3:16, Romans 8:28" class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/> <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">Add</button></div> `);
		if (bibleReferences.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like(bibleReferences);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ref = each_array[$$index];
				$$renderer.push(`<span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center">${escape_html(ref)} <button class="ml-2 hover:text-red-300">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">Add relevant Bible verses that relate to your content's message</div></div> <div><label for="themes" class="block text-sm font-medium text-white mb-3">Themes</label> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"><!--[-->`);
		const each_array_1 = ensure_array_like(commonThemes);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let theme = each_array_1[$$index_1];
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("checked", themes.includes(theme), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-lg text-center text-sm transition-all ${themes.includes(theme) ? "border-green-600 bg-green-600/20 text-white" : "border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500"}`)}>${escape_html(theme)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="ministry" class="block text-sm font-medium text-white mb-2">Ministry/Organization Affiliation</label> <input type="text" id="ministry"${attr("value", ministryAffiliation)} placeholder="e.g., Grace Community Church, Victory Ministries" class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/> <div class="text-xs text-gray-400 mt-1">Optional: Name of the church, ministry, or organization associated with this content</div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="duration" class="block text-sm font-medium text-white mb-2">Duration (minutes)</label> <input type="number" id="duration"${attr("value", duration)} placeholder="90" min="1" class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/></div> <div><label for="language" class="block text-sm font-medium text-white mb-2">Primary Language</label> `);
		$$renderer.select({
			id: "language",
			value: language,
			class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(languages);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let lang = each_array_2[$$index_2];
				$$renderer.option({ value: lang }, ($$renderer) => {
					$$renderer.push(`${escape_html(lang)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div></div> <div><label for="accessibilityFeatures" class="block text-sm font-medium text-white mb-3">Accessibility Features</label> <div class="space-y-2"><label class="flex items-center"><input type="checkbox"${attr("checked", hasSubtitles, true)} class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/> <span class="text-white">Has Subtitles</span></label> <label class="flex items-center"><input type="checkbox"${attr("checked", hasClosedCaptions, true)} class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/> <span class="text-white">Has Closed Captions</span></label></div></div> <div><label for="genres" class="block text-sm font-medium text-white mb-3">Genres</label> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"><!--[-->`);
		const each_array_3 = ensure_array_like(commonGenres);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let genreOption = each_array_3[$$index_3];
			$$renderer.push(`<label class="cursor-pointer"><input type="checkbox"${attr("checked", genre.includes(genreOption), true)} class="sr-only"/> <div${attr_class(`p-2 border rounded-lg text-center text-sm transition-all ${genre.includes(genreOption) ? "border-blue-600 bg-blue-600/20 text-white" : "border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500"}`)}>${escape_html(genreOption)}</div></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><label for="tags-input" class="block text-sm font-medium text-white mb-3">Tags</label> <div class="flex gap-2 mb-3"><input type="text" id="tags-input"${attr("value", newTag)} placeholder="Add custom tags..." class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Add</button></div> `);
		if (tags.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_4 = ensure_array_like(tags);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let tag = each_array_4[$$index_4];
				$$renderer.push(`<span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">${escape_html(tag)} <button class="ml-2 hover:text-red-300">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div><label for="keywords-input" class="block text-sm font-medium text-white mb-3">SEO Keywords</label> <div class="flex gap-2 mb-3"><input type="text" id="keywords-input"${attr("value", newKeyword)} placeholder="Add search keywords..." class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/> <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">Add</button></div> `);
		if (keywords.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array_5 = ensure_array_like(keywords);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let keyword = each_array_5[$$index_5];
				$$renderer.push(`<span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">${escape_html(keyword)} <button class="ml-2 hover:text-red-300">×</button></span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">Keywords help users find your content through search</div></div> <div class="bg-green-600/20 border border-green-600 rounded-lg p-4"><div class="flex items-start"><div class="text-2xl mr-3">📝</div> <div><div class="font-medium text-white mb-1">Metadata Best Practices</div> <div class="text-sm text-green-200 space-y-1"><div>• Add relevant Bible references that connect to your content's message</div> <div>• Choose themes that accurately represent your content</div> <div>• Use specific, searchable keywords that your audience might use</div> <div>• Be honest about content duration and accessibility features</div> <div>• Well-structured metadata improves discoverability</div></div></div></div></div></div>`);
		bind_props($$props, {
			data,
			onUpdate
		});
	});
}
//#endregion
//#region src/lib/components/creator/upload/ReviewSubmitStep.svelte
function ReviewSubmitStep($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let basicInfo, videoData, assetData, metadataInfo;
		let data = $$props["data"];
		let allStepData = $$props["allStepData"];
		let onUpdate = $$props["onUpdate"];
		let onSubmit = $$props["onSubmit"];
		let termsAccepted = data.termsAccepted || false;
		let guidelinesAccepted = data.guidelinesAccepted || false;
		onUpdate({
			termsAccepted,
			guidelinesAccepted
		});
		basicInfo = allStepData.stepData[1];
		videoData = allStepData.stepData[2];
		assetData = allStepData.stepData[3];
		metadataInfo = allStepData.stepData[4];
		$$renderer.push(`<div class="space-y-6"><div class="text-center mb-8"><h2 class="text-2xl font-bold text-white mb-2">Review &amp; Submit</h2> <p class="text-gray-300">Review your content details before submitting for approval</p></div> <div class="bg-white/10 rounded-lg p-6"><h3 class="text-xl font-bold text-white mb-4">Content Summary</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="font-medium text-white mb-2">Basic Information</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Title:</span> <span class="text-white">${escape_html(basicInfo.title || "Not provided")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Type:</span> <span class="text-white">${escape_html(basicInfo.contentType || "Not selected")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Age Rating:</span> <span class="text-white">${escape_html(basicInfo.ageRating || "Not selected")}</span></div></div></div> <div><h4 class="font-medium text-white mb-2">Video Content</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Main Video:</span> <span class="text-white">`);
		if (videoData.videoProgress?.isCompleted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-green-400">✓ Uploaded</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-red-400">Not uploaded</span>`);
		}
		$$renderer.push(`<!--]--></span></div> <div class="flex justify-between"><span class="text-gray-400">Trailer:</span> <span class="text-white">`);
		if (videoData.trailerProgress?.isCompleted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-green-400">✓ Uploaded</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-gray-400">Optional</span>`);
		}
		$$renderer.push(`<!--]--></span></div></div></div> <div><h4 class="font-medium text-white mb-2">Image Assets</h4> <div class="text-sm"><span class="text-gray-400">Uploaded:</span> <span class="text-white ml-2">${escape_html(Object.keys(assetData.uploadedAssets || {}).length)} assets</span></div></div> <div><h4 class="font-medium text-white mb-2">Additional Details</h4> <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Duration:</span> <span class="text-white">${escape_html(metadataInfo.duration ? `${metadataInfo.duration} min` : "Not specified")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Language:</span> <span class="text-white">${escape_html(metadataInfo.language || "English")}</span></div> <div class="flex justify-between"><span class="text-gray-400">Bible References:</span> <span class="text-white">${escape_html(metadataInfo.bibleReferences?.length || 0)}</span></div></div></div></div> `);
		if (basicInfo.description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mt-6"><h4 class="font-medium text-white mb-2">Description</h4> <div class="text-sm text-gray-300 bg-white/5 p-3 rounded">${escape_html(basicInfo.description)}</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-6"><h3 class="text-xl font-bold text-white mb-4">Review Process</h3> <div class="space-y-3 text-sm text-blue-200"><div class="flex items-start"><span class="text-lg mr-3">1️⃣</span> <div><div class="font-medium">Theological Review</div> <div>Content will be reviewed for doctrinal accuracy and biblical alignment</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">2️⃣</span> <div><div class="font-medium">Content Moderation</div> <div>General content review for appropriateness and quality</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">3️⃣</span> <div><div class="font-medium">Technical Quality Assurance</div> <div>Video and audio quality, technical specifications check</div></div></div> <div class="flex items-start"><span class="text-lg mr-3">✅</span> <div><div class="font-medium">Final Approval &amp; Publishing</div> <div>Content goes live on the platform for all users</div></div></div></div> <div class="mt-4 p-3 bg-blue-700/30 rounded"><div class="text-sm text-blue-100"><strong>Expected Review Time:</strong> 3-5 business days<br/> <strong>Status Updates:</strong> You'll receive email notifications at each stage</div></div></div> <div class="space-y-4"><h3 class="text-xl font-bold text-white">Terms and Guidelines</h3> <div class="bg-white/10 rounded-lg p-6 space-y-4"><label class="flex items-start"><input type="checkbox"${attr("checked", guidelinesAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/> <div class="text-sm"><div class="text-white font-medium mb-1">Content Guidelines Acceptance</div> <div class="text-gray-300">I confirm that my content aligns with Sephar Studios' faith-based content guidelines, 
            promotes positive Christian values, and is appropriate for the intended audience. 
            I understand that content not meeting these standards may be rejected.</div></div></label> <label class="flex items-start"><input type="checkbox"${attr("checked", termsAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/> <div class="text-sm"><div class="text-white font-medium mb-1">Terms of Service Agreement</div> <div class="text-gray-300">I agree to the Sephar Studios Terms of Service, Creator Agreement, and Privacy Policy. 
            I confirm that I have the rights to submit this content and that it does not infringe 
            on any third-party copyrights or intellectual property.</div></div></label></div></div> <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4"><div class="flex items-start"><div class="text-2xl mr-3">⚠️</div> <div><div class="font-medium text-white mb-1">Before You Submit</div> <div class="text-sm text-yellow-200 space-y-1"><div>• Ensure all required fields are completed accurately</div> <div>• Double-check your video quality and audio clarity</div> <div>• Verify that all uploaded images represent your content appropriately</div> <div>• Make sure your content aligns with our faith-based community standards</div> <div>• Content cannot be edited once submitted - you'll need to resubmit if changes are needed</div></div></div></div></div> <div class="text-center pt-6"><button${attr("disabled", !termsAccepted || !guidelinesAccepted, true)} class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-green-300 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed">`);
		if (!termsAccepted || !guidelinesAccepted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`Please Accept Terms to Continue`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`🚀 Submit Content for Review`);
		}
		$$renderer.push(`<!--]--></button> `);
		if (termsAccepted && guidelinesAccepted) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-sm text-gray-400 mt-2">Your content will be submitted to our review team</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, {
			data,
			allStepData,
			onUpdate,
			onSubmit
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
			validateStep(step);
		}
		function validateStep(step) {
			switch (step) {
				case UploadStep.BASIC_INFO:
					const basicData = wizardState.stepData[step];
					wizardState.isValid[step] = !!(basicData.title && basicData.description && basicData.contentType && basicData.ageRating);
					break;
				case UploadStep.VIDEO_UPLOAD:
					const videoData = wizardState.stepData[step];
					wizardState.isValid[step] = !!videoData.videoProgress?.isCompleted;
					break;
				case UploadStep.ASSET_MANAGEMENT:
					const assetData = wizardState.stepData[step];
					wizardState.isValid[step] = Object.keys(assetData.uploadedAssets).length > 0;
					break;
				case UploadStep.METADATA:
					wizardState.isValid[step] = true;
					break;
				case UploadStep.REVIEW_SUBMIT:
					const reviewData = wizardState.stepData[step];
					wizardState.isValid[step] = reviewData.termsAccepted && reviewData.guidelinesAccepted;
					break;
			}
		}
		async function submitContent() {
			isSubmitting = true;
			try {
				const videoFile = wizardState.stepData[UploadStep.VIDEO_UPLOAD].videoFile;
				if (!videoFile) throw new Error("Video file is required");
				const submissionData = {
					...wizardState.stepData[UploadStep.BASIC_INFO],
					...wizardState.stepData[UploadStep.METADATA],
					assets: wizardState.stepData[UploadStep.ASSET_MANAGEMENT].uploadedAssets,
					trailerUrl: wizardState.stepData[UploadStep.VIDEO_UPLOAD].trailerProgress?.uploadUrl
				};
				const res = await fetch("/api/creator/content", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(submissionData)
				});
				if (!res.ok) throw new Error("Failed to save metadata");
				const { contentId } = await res.json();
				fetch("/api/ai/tag", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ contentId })
				}).catch((err) => console.warn("AI tagging skipped:", err));
				const jobRes = await fetch("/api/encoder/jobs", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contentId,
						filename: videoFile.name,
						profile: "vod-multi",
						durationHint: submissionData.duration ? Number(submissionData.duration) * 60 : void 0
					})
				});
				if (!jobRes.ok) throw new Error("Failed to create encoder job");
				const { jobId, upload } = await jobRes.json();
				const uploadRes = await fetch(upload.url, {
					method: upload.method || "PUT",
					headers: { "Content-Type": videoFile.type || "application/octet-stream" },
					body: videoFile
				});
				if (!uploadRes.ok) throw new Error(`Failed to upload video to encoder storage (${uploadRes.status})`);
				if (!(await fetch(`/api/encoder/jobs/${jobId}/commit`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})).ok) throw new Error("Failed to queue encoder job");
				alert("Content submitted successfully!");
				localStorage.removeItem("upload_draft");
				window.location.href = "/creator";
			} catch (error) {
				console.error("Submission error:", error);
				alert("Failed to submit content. Please try again.");
			} finally {
				isSubmitting = false;
			}
		}
		$$renderer.push(`<div class="container py-10 space-y-8 min-h-screen"><div class="space-y-2 text-center"><h1 class="text-4xl font-bold tracking-tight">Post New Content</h1> <p class="text-xl text-muted-foreground">Share your faith-based content with believers worldwide</p></div> `);
		StepIndicator($$renderer, {
			steps,
			currentStep: wizardState.currentStep,
			isStepValid: wizardState.isValid,
			onStepClick: goToStep
		});
		$$renderer.push(`<!----> <div class="bg-card border rounded-xl p-8 max-w-4xl mx-auto shadow-sm">`);
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
				onSubmit: submitContent
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex justify-between items-center max-w-4xl mx-auto pt-4"><button${attr("disabled", wizardState.currentStep === UploadStep.BASIC_INFO || isSubmitting, true)} class="bg-muted hover:bg-muted/80 disabled:opacity-50 text-foreground px-6 py-3 rounded-lg font-medium transition-colors">← Previous</button> <div class="text-center text-muted-foreground font-medium">Step ${escape_html(wizardState.currentStep)} of ${escape_html(UploadStep.REVIEW_SUBMIT)}</div> `);
		if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("disabled", !wizardState.isValid[wizardState.currentStep] || isSubmitting, true)} class="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">Next →</button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attr("disabled", !wizardState.isValid[wizardState.currentStep] || isSubmitting, true)} class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">${escape_html(isSubmitting ? "Processing..." : "🚀 Submit for Review")}</button>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CpZxNrRF.js.map
