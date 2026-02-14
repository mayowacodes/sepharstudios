import { F as FILENAME } from './index-client-DVey9PBT.js';
import { u as attr, E as escape_html, m as ensure_array_like, C as attr_class, x as stringify, l as clsx, D as attr_style, H as bind_props } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { U as UploadStep, a as ContentType, A as AgeRating } from './creator-DR-vwnH8.js';

StepIndicator[FILENAME] = "src/lib/components/creator/upload/StepIndicator.svelte";
function StepIndicator($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let steps = $$props["steps"];
      let currentStep = $$props["currentStep"];
      let isStepValid = $$props["isStepValid"];
      let onStepClick = $$props["onStepClick"];
      function getStepStatus(stepNumber) {
        if (stepNumber < currentStep && isStepValid[stepNumber]) {
          return "completed";
        } else if (stepNumber === currentStep) {
          return "current";
        } else if (stepNumber < currentStep) {
          return "error";
        } else {
          return "pending";
        }
      }
      function getStepClasses(stepNumber) {
        const status = getStepStatus(stepNumber);
        const baseClasses = "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all cursor-pointer";
        switch (status) {
          case "completed":
            return `${baseClasses} bg-green-600 border-green-600 text-white`;
          case "current":
            return `${baseClasses} bg-purple-600 border-purple-600 text-white`;
          case "error":
            return `${baseClasses} bg-red-600 border-red-600 text-white`;
          default:
            return `${baseClasses} border-gray-500 text-gray-400`;
        }
      }
      function getConnectorClasses(stepNumber) {
        const isCompleted = stepNumber < currentStep && isStepValid[stepNumber];
        return `flex-1 h-1 mx-4 ${isCompleted ? "bg-green-600" : "bg-gray-600"}`;
      }
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 52, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 53, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(steps);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let step = each_array[index];
        $$renderer2.push(`<div${attr_class(`flex items-center ${stringify(index === steps.length - 1 ? "" : "flex-1")}`)}>`);
        push_element($$renderer2, "div", 55, 6);
        $$renderer2.push(`<div class="flex flex-col items-center">`);
        push_element($$renderer2, "div", 57, 8);
        $$renderer2.push(`<button${attr_class(clsx(getStepClasses(step.step)))}${attr("disabled", step.step > currentStep && !isStepValid[step.step - 1], true)}${attr("aria-label", `Step ${step.step}: ${step.title} - ${getStepStatus(step.step)}`)}${attr("aria-current", step.step === currentStep ? "step" : void 0)}>`);
        push_element($$renderer2, "button", 58, 10);
        if (getStepStatus(step.step) === "completed") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`✓`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(step.step)}`);
        }
        $$renderer2.push(`<!--]--></button>`);
        pop_element();
        $$renderer2.push(` <div class="mt-2 text-center">`);
        push_element($$renderer2, "div", 72, 10);
        $$renderer2.push(`<div class="text-sm font-medium text-white">`);
        push_element($$renderer2, "div", 73, 12);
        $$renderer2.push(`${escape_html(step.title)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xs text-gray-400 max-w-20">`);
        push_element($$renderer2, "div", 74, 12);
        $$renderer2.push(`${escape_html(step.description)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (index < steps.length - 1) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div${attr_class(clsx(getConnectorClasses(step.step)))}>`);
          push_element($$renderer2, "div", 80, 10);
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-6">`);
      push_element($$renderer2, "div", 87, 2);
      $$renderer2.push(`<div class="flex justify-between text-sm text-gray-400 mb-2">`);
      push_element($$renderer2, "div", 88, 4);
      $$renderer2.push(`<span>`);
      push_element($$renderer2, "span", 89, 6);
      $$renderer2.push(`Progress</span>`);
      pop_element();
      $$renderer2.push(` <span>`);
      push_element($$renderer2, "span", 90, 6);
      $$renderer2.push(`${escape_html(Math.round(currentStep / steps.length * 100))}%</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="w-full bg-gray-700 rounded-full h-2">`);
      push_element($$renderer2, "div", 92, 4);
      $$renderer2.push(`<div class="bg-purple-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(currentStep / steps.length * 100)}%`)}>`);
      push_element($$renderer2, "div", 93, 6);
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { steps, currentStep, isStepValid, onStepClick });
    },
    StepIndicator
  );
}
StepIndicator.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
BasicInfoStep[FILENAME] = "src/lib/components/creator/upload/BasicInfoStep.svelte";
function BasicInfoStep($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let data = $$props["data"];
      let onUpdate = $$props["onUpdate"];
      let title = data.title || "";
      let description = data.description || "";
      let contentType = data.contentType || "";
      let ageRating = data.ageRating || "";
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
      onUpdate({ title, description, contentType, ageRating });
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 36, 0);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 37, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 38, 4);
      $$renderer2.push(`Basic Information</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 39, 4);
      $$renderer2.push(`Tell us about your content</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 43, 2);
      $$renderer2.push(`<label for="title" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 44, 4);
      $$renderer2.push(`Content Title *</label>`);
      pop_element();
      $$renderer2.push(` <input type="text" id="title"${attr("value", title)} placeholder="Enter your content title" class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 45, 4);
      pop_element();
      $$renderer2.push(` `);
      if (title.length > 0 && title.length < 5) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-red-400 text-sm mt-1">`);
        push_element($$renderer2, "p", 53, 6);
        $$renderer2.push(`Title must be at least 5 characters long</p>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 58, 2);
      $$renderer2.push(`<label for="description" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 59, 4);
      $$renderer2.push(`Description *</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="description" placeholder="Provide a compelling description of your content..." rows="4" class="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none">`);
      push_element($$renderer2, "textarea", 60, 4);
      const $$body = escape_html(description);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between text-sm mt-1">`);
      push_element($$renderer2, "div", 67, 4);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 68, 6);
      if (description.length < 50) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-red-400">`);
        push_element($$renderer2, "span", 70, 10);
        $$renderer2.push(`Description should be at least 50 characters</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="text-green-400">`);
        push_element($$renderer2, "span", 72, 10);
        $$renderer2.push(`Good description length</span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(` <span class="text-gray-400">`);
      push_element($$renderer2, "span", 75, 6);
      $$renderer2.push(`${escape_html(description.length)}/1000</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 80, 2);
      $$renderer2.push(`<label for="contentType" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 81, 4);
      $$renderer2.push(`Content Type *</label>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
      push_element($$renderer2, "div", 82, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(contentTypes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let type = each_array[$$index];
        $$renderer2.push(`<label class="cursor-pointer">`);
        push_element($$renderer2, "label", 84, 8);
        $$renderer2.push(`<input type="radio"${attr("checked", contentType === type.value, true)}${attr("value", type.value)} class="sr-only"/>`);
        push_element($$renderer2, "input", 85, 10);
        pop_element();
        $$renderer2.push(` <div${attr_class(`p-4 border-2 rounded-lg transition-all ${stringify(contentType === type.value ? "border-purple-600 bg-purple-600/20" : "border-gray-600 bg-white/5 hover:border-gray-500")}`)}>`);
        push_element($$renderer2, "div", 91, 10);
        $$renderer2.push(`<div class="font-medium text-white">`);
        push_element($$renderer2, "div", 92, 12);
        $$renderer2.push(`${escape_html(type.label)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-400">`);
        push_element($$renderer2, "div", 93, 12);
        $$renderer2.push(`${escape_html(type.description)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 101, 2);
      $$renderer2.push(`<label for="ageRating" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 102, 4);
      $$renderer2.push(`Age Rating *</label>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 md:grid-cols-3 gap-3">`);
      push_element($$renderer2, "div", 103, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(ageRatings);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let rating = each_array_1[$$index_1];
        $$renderer2.push(`<label class="cursor-pointer">`);
        push_element($$renderer2, "label", 105, 8);
        $$renderer2.push(`<input type="radio"${attr("checked", ageRating === rating.value, true)}${attr("value", rating.value)} class="sr-only"/>`);
        push_element($$renderer2, "input", 106, 10);
        pop_element();
        $$renderer2.push(` <div${attr_class(`p-3 border-2 rounded-lg text-center transition-all ${stringify(ageRating === rating.value ? "border-green-600 bg-green-600/20" : "border-gray-600 bg-white/5 hover:border-gray-500")}`)}>`);
        push_element($$renderer2, "div", 112, 10);
        $$renderer2.push(`<div class="font-bold text-white">`);
        push_element($$renderer2, "div", 113, 12);
        $$renderer2.push(`${escape_html(rating.label)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xs text-gray-400">`);
        push_element($$renderer2, "div", 114, 12);
        $$renderer2.push(`${escape_html(rating.description)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">`);
      push_element($$renderer2, "div", 122, 2);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 123, 4);
      $$renderer2.push(`<div class="text-2xl mr-3">`);
      push_element($$renderer2, "div", 124, 6);
      $$renderer2.push(`ℹ️</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 125, 6);
      $$renderer2.push(`<div class="font-medium text-white mb-1">`);
      push_element($$renderer2, "div", 126, 8);
      $$renderer2.push(`Faith-Based Content Guidelines</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-blue-200">`);
      push_element($$renderer2, "div", 127, 8);
      $$renderer2.push(`All content will be reviewed to ensure it aligns with our Christian values and community guidelines. 
          Content should be appropriate for a faith-based audience and promote positive Christian messages.</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { data, onUpdate });
    },
    BasicInfoStep
  );
}
BasicInfoStep.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
VideoUploadStep[FILENAME] = "src/lib/components/creator/upload/VideoUploadStep.svelte";
function VideoUploadStep($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let data = $$props["data"];
      let onUpdate = $$props["onUpdate"];
      let videoFile = data.videoFile || null;
      let trailerFile = data.trailerFile || null;
      let videoProgress = data.videoProgress || null;
      let trailerProgress = data.trailerProgress || null;
      function formatFileSize(bytes) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
      }
      onUpdate({ videoFile, trailerFile, videoProgress, trailerProgress });
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 135, 0);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 136, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 137, 4);
      $$renderer2.push(`Upload Video Content</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 138, 4);
      $$renderer2.push(`Upload your main content and optional trailer</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 142, 2);
      $$renderer2.push(`<div class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "div", 143, 4);
      $$renderer2.push(`Main Video Content *</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!videoFile && !videoProgress) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(`border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-all ${stringify("hover:border-gray-500")}`)} role="button" tabindex="0" aria-label="Drop video file here or click to browse">`);
        push_element($$renderer2, "div", 146, 6);
        $$renderer2.push(`<div class="text-4xl mb-4">`);
        push_element($$renderer2, "div", 156, 8);
        $$renderer2.push(`🎬</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-white font-medium mb-2">`);
        push_element($$renderer2, "div", 157, 8);
        $$renderer2.push(`Drop your video file here or click to browse</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm mb-4">`);
        push_element($$renderer2, "div", 158, 8);
        $$renderer2.push(`Supported formats: MP4, MOV, AVI (Max: 5GB)</div>`);
        pop_element();
        $$renderer2.push(` <input type="file" accept="video/*" class="hidden" id="video-upload"/>`);
        push_element($$renderer2, "input", 159, 8);
        pop_element();
        $$renderer2.push(` <label for="video-upload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors">`);
        push_element($$renderer2, "label", 166, 8);
        $$renderer2.push(`Choose Video File</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (videoProgress) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="bg-white/10 rounded-lg p-6">`);
          push_element($$renderer2, "div", 174, 6);
          $$renderer2.push(`<div class="flex justify-between items-start mb-4">`);
          push_element($$renderer2, "div", 175, 8);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 176, 10);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 177, 12);
          $$renderer2.push(`${escape_html(videoProgress.fileName)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 178, 12);
          $$renderer2.push(`${escape_html(formatFileSize(videoProgress.fileSize))}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (videoProgress.isCompleted) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="text-green-400 flex items-center">`);
            push_element($$renderer2, "div", 181, 12);
            $$renderer2.push(`<span class="mr-2">`);
            push_element($$renderer2, "span", 182, 14);
            $$renderer2.push(`✓</span>`);
            pop_element();
            $$renderer2.push(` Uploaded</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            if (videoProgress.hasError) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="text-red-400 flex items-center">`);
              push_element($$renderer2, "div", 185, 12);
              $$renderer2.push(`<span class="mr-2">`);
              push_element($$renderer2, "span", 186, 14);
              $$renderer2.push(`✗</span>`);
              pop_element();
              $$renderer2.push(` Error</div>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<button class="text-red-400 hover:text-red-300">`);
              push_element($$renderer2, "button", 189, 12);
              $$renderer2.push(`✗</button>`);
              pop_element();
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(` `);
          if (videoProgress.isUploading || !videoProgress.isCompleted) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="mb-2">`);
            push_element($$renderer2, "div", 194, 10);
            $$renderer2.push(`<div class="flex justify-between text-sm text-gray-400 mb-1">`);
            push_element($$renderer2, "div", 195, 12);
            $$renderer2.push(`<span>`);
            push_element($$renderer2, "span", 196, 14);
            $$renderer2.push(`Uploading...</span>`);
            pop_element();
            $$renderer2.push(` <span>`);
            push_element($$renderer2, "span", 197, 14);
            $$renderer2.push(`${escape_html(Math.round(videoProgress.progressPercentage))}%</span>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(` <div class="w-full bg-gray-700 rounded-full h-2">`);
            push_element($$renderer2, "div", 199, 12);
            $$renderer2.push(`<div class="bg-purple-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(videoProgress.progressPercentage)}%`)}>`);
            push_element($$renderer2, "div", 200, 14);
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="text-sm text-gray-400">`);
          push_element($$renderer2, "div", 208, 8);
          $$renderer2.push(`${escape_html(formatFileSize(videoProgress.uploadedBytes))} / ${escape_html(formatFileSize(videoProgress.fileSize))}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 216, 2);
      $$renderer2.push(`<div class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "div", 217, 4);
      $$renderer2.push(`Trailer (Optional) <span class="text-gray-400 text-sm ml-2">`);
      push_element($$renderer2, "span", 219, 6);
      $$renderer2.push(`Helps with discoverability</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!trailerFile && !trailerProgress) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(`border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-all ${stringify("hover:border-gray-500")}`)} role="button" tabindex="0" aria-label="Drop trailer file here or click to browse">`);
        push_element($$renderer2, "div", 223, 6);
        $$renderer2.push(`<div class="text-3xl mb-3">`);
        push_element($$renderer2, "div", 233, 8);
        $$renderer2.push(`🎞️</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-white font-medium mb-2">`);
        push_element($$renderer2, "div", 234, 8);
        $$renderer2.push(`Drop trailer here or click to browse</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-gray-400 text-sm mb-4">`);
        push_element($$renderer2, "div", 235, 8);
        $$renderer2.push(`Short preview of your content (Max: 500MB)</div>`);
        pop_element();
        $$renderer2.push(` <input type="file" accept="video/*" class="hidden" id="trailer-upload"/>`);
        push_element($$renderer2, "input", 236, 8);
        pop_element();
        $$renderer2.push(` <label for="trailer-upload" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors">`);
        push_element($$renderer2, "label", 243, 8);
        $$renderer2.push(`Choose Trailer</label>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (trailerProgress) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="bg-white/10 rounded-lg p-4">`);
          push_element($$renderer2, "div", 251, 6);
          $$renderer2.push(`<div class="flex justify-between items-start mb-3">`);
          push_element($$renderer2, "div", 252, 8);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 253, 10);
          $$renderer2.push(`<div class="text-white font-medium">`);
          push_element($$renderer2, "div", 254, 12);
          $$renderer2.push(`${escape_html(trailerProgress.fileName)}</div>`);
          pop_element();
          $$renderer2.push(` <div class="text-gray-400 text-sm">`);
          push_element($$renderer2, "div", 255, 12);
          $$renderer2.push(`${escape_html(formatFileSize(trailerProgress.fileSize))}</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (trailerProgress.isCompleted) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="text-green-400 flex items-center">`);
            push_element($$renderer2, "div", 258, 12);
            $$renderer2.push(`<span class="mr-2">`);
            push_element($$renderer2, "span", 259, 14);
            $$renderer2.push(`✓</span>`);
            pop_element();
            $$renderer2.push(` Uploaded</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            if (trailerProgress.hasError) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="text-red-400 flex items-center">`);
              push_element($$renderer2, "div", 262, 12);
              $$renderer2.push(`<span class="mr-2">`);
              push_element($$renderer2, "span", 263, 14);
              $$renderer2.push(`✗</span>`);
              pop_element();
              $$renderer2.push(` Error</div>`);
              pop_element();
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<button class="text-red-400 hover:text-red-300">`);
              push_element($$renderer2, "button", 266, 12);
              $$renderer2.push(`✗</button>`);
              pop_element();
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(` `);
          if (trailerProgress.isUploading) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="mb-2">`);
            push_element($$renderer2, "div", 271, 10);
            $$renderer2.push(`<div class="flex justify-between text-sm text-gray-400 mb-1">`);
            push_element($$renderer2, "div", 272, 12);
            $$renderer2.push(`<span>`);
            push_element($$renderer2, "span", 273, 14);
            $$renderer2.push(`Uploading...</span>`);
            pop_element();
            $$renderer2.push(` <span>`);
            push_element($$renderer2, "span", 274, 14);
            $$renderer2.push(`${escape_html(Math.round(trailerProgress.progressPercentage))}%</span>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(` <div class="w-full bg-gray-700 rounded-full h-2">`);
            push_element($$renderer2, "div", 276, 12);
            $$renderer2.push(`<div class="bg-blue-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(trailerProgress.progressPercentage)}%`)}>`);
            push_element($$renderer2, "div", 277, 14);
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">`);
      push_element($$renderer2, "div", 289, 2);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 290, 4);
      $$renderer2.push(`<div class="text-2xl mr-3">`);
      push_element($$renderer2, "div", 291, 6);
      $$renderer2.push(`⚠️</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 292, 6);
      $$renderer2.push(`<div class="font-medium text-white mb-1">`);
      push_element($$renderer2, "div", 293, 8);
      $$renderer2.push(`Video Upload Guidelines</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-yellow-200 space-y-1">`);
      push_element($$renderer2, "div", 294, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 295, 10);
      $$renderer2.push(`• Videos should be in MP4 format for best compatibility</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 296, 10);
      $$renderer2.push(`• Minimum resolution: 720p (1280x720)</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 297, 10);
      $$renderer2.push(`• Audio should be clear and free from background noise</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 298, 10);
      $$renderer2.push(`• Content will be processed and optimized after upload</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 299, 10);
      $$renderer2.push(`• Upload may take several minutes depending on file size</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { data, onUpdate });
    },
    VideoUploadStep
  );
}
VideoUploadStep.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
AssetManagementStep[FILENAME] = "src/lib/components/creator/upload/AssetManagementStep.svelte";
function AssetManagementStep($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
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
      onUpdate({ uploadedAssets, assetProgress });
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 143, 0);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 144, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 145, 4);
      $$renderer2.push(`Image Assets &amp; Media</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 146, 4);
      $$renderer2.push(`Upload images that will represent your content across the platform</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 150, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(assetTypes);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let assetType = each_array[$$index];
        const progress = getAssetProgress(assetType.key);
        const isUploaded = uploadedAssets[assetType.key];
        const isUploading = progress && !progress.isCompleted;
        $$renderer2.push(`<div class="bg-white/10 rounded-lg p-6">`);
        push_element($$renderer2, "div", 156, 6);
        $$renderer2.push(`<div class="flex justify-between items-start mb-4">`);
        push_element($$renderer2, "div", 157, 8);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 158, 10);
        $$renderer2.push(`<div class="flex items-center">`);
        push_element($$renderer2, "div", 159, 12);
        $$renderer2.push(`<span class="text-2xl mr-2">`);
        push_element($$renderer2, "span", 160, 14);
        $$renderer2.push(`${escape_html(assetType.icon)}</span>`);
        pop_element();
        $$renderer2.push(` <div>`);
        push_element($$renderer2, "div", 161, 14);
        $$renderer2.push(`<div class="font-medium text-white">`);
        push_element($$renderer2, "div", 162, 16);
        $$renderer2.push(`${escape_html(assetType.title)}</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (assetType.required) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs bg-red-600 text-white px-2 py-1 rounded">`);
          push_element($$renderer2, "span", 164, 18);
          $$renderer2.push(`Required</span>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-400 mt-1">`);
        push_element($$renderer2, "div", 168, 12);
        $$renderer2.push(`${escape_html(assetType.description)}</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xs text-gray-500 mt-1">`);
        push_element($$renderer2, "div", 169, 12);
        $$renderer2.push(`${escape_html(assetType.recommendations)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        if (isUploaded && !isUploading) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="text-red-400 hover:text-red-300 text-xl">`);
          push_element($$renderer2, "button", 173, 12);
          $$renderer2.push(`✗</button>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` `);
        if (isUploaded && !isUploading) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="relative">`);
          push_element($$renderer2, "div", 184, 10);
          $$renderer2.push(`<img${attr("src", uploadedAssets[assetType.key])}${attr("alt", assetType.title)} class="w-full h-32 object-cover rounded-lg"/>`);
          push_element($$renderer2, "img", 185, 12);
          pop_element();
          $$renderer2.push(` <div class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">`);
          push_element($$renderer2, "div", 190, 12);
          $$renderer2.push(`✓ Uploaded</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          if (isUploading && progress) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="space-y-3">`);
            push_element($$renderer2, "div", 196, 10);
            $$renderer2.push(`<div class="text-sm text-white">`);
            push_element($$renderer2, "div", 197, 12);
            $$renderer2.push(`${escape_html(progress.fileName)}</div>`);
            pop_element();
            $$renderer2.push(` <div class="flex justify-between text-xs text-gray-400">`);
            push_element($$renderer2, "div", 198, 12);
            $$renderer2.push(`<span>`);
            push_element($$renderer2, "span", 199, 14);
            $$renderer2.push(`Uploading...</span>`);
            pop_element();
            $$renderer2.push(` <span>`);
            push_element($$renderer2, "span", 200, 14);
            $$renderer2.push(`${escape_html(Math.round(progress.progressPercentage))}%</span>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(` <div class="w-full bg-gray-700 rounded-full h-2">`);
            push_element($$renderer2, "div", 202, 12);
            $$renderer2.push(`<div class="bg-blue-600 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(progress.progressPercentage)}%`)}>`);
            push_element($$renderer2, "div", 203, 14);
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-all" role="button" tabindex="0"${attr("aria-label", `Drop ${assetType.title} image here or click to browse`)}>`);
            push_element($$renderer2, "div", 211, 10);
            $$renderer2.push(`<div class="text-gray-400 text-sm mb-3">`);
            push_element($$renderer2, "div", 220, 12);
            $$renderer2.push(`Drop image here or click to browse</div>`);
            pop_element();
            $$renderer2.push(` <input type="file" accept="image/*" class="hidden"${attr("id", `upload-${stringify(assetType.key)}`)}/>`);
            push_element($$renderer2, "input", 223, 12);
            pop_element();
            $$renderer2.push(` <label${attr("for", `upload-${stringify(assetType.key)}`)} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block transition-colors">`);
            push_element($$renderer2, "label", 230, 12);
            $$renderer2.push(`Choose Image</label>`);
            pop_element();
            $$renderer2.push(` <div class="text-xs text-gray-500 mt-2">`);
            push_element($$renderer2, "div", 236, 12);
            $$renderer2.push(`Aspect Ratio: ${escape_html(assetType.aspectRatio)}</div>`);
            pop_element();
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4">`);
      push_element($$renderer2, "div", 246, 2);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 247, 4);
      $$renderer2.push(`<div class="text-2xl mr-3">`);
      push_element($$renderer2, "div", 248, 6);
      $$renderer2.push(`💡</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 249, 6);
      $$renderer2.push(`<div class="font-medium text-white mb-1">`);
      push_element($$renderer2, "div", 250, 8);
      $$renderer2.push(`Image Asset Tips</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-blue-200 space-y-1">`);
      push_element($$renderer2, "div", 251, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 252, 10);
      $$renderer2.push(`• High-quality images perform better and look more professional</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 253, 10);
      $$renderer2.push(`• Use images that accurately represent your content</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 254, 10);
      $$renderer2.push(`• Avoid text-heavy images as they may not scale well</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 255, 10);
      $$renderer2.push(`• Ensure images are appropriate for all age groups viewing your content</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 256, 10);
      $$renderer2.push(`• Images will be automatically optimized for different screen sizes</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (assetProgress.length > 0 || Object.keys(uploadedAssets).length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="bg-white/10 rounded-lg p-4">`);
        push_element($$renderer2, "div", 264, 4);
        $$renderer2.push(`<div class="text-white font-medium mb-3">`);
        push_element($$renderer2, "div", 265, 6);
        $$renderer2.push(`Upload Summary</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-300">`);
        push_element($$renderer2, "div", 266, 6);
        $$renderer2.push(`${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.filter((a) => a.required).length)} required assets uploaded</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-300">`);
        push_element($$renderer2, "div", 269, 6);
        $$renderer2.push(`${escape_html(Object.keys(uploadedAssets).length)} of ${escape_html(assetTypes.length)} total assets uploaded</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      bind_props($$props, { data, onUpdate });
    },
    AssetManagementStep
  );
}
AssetManagementStep.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
MetadataStep[FILENAME] = "src/lib/components/creator/upload/MetadataStep.svelte";
function MetadataStep($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
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
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 93, 0);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 94, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 95, 4);
      $$renderer2.push(`Content Metadata</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 96, 4);
      $$renderer2.push(`Add details to help users discover and understand your content</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 100, 2);
      $$renderer2.push(`<label for="bible-references" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 101, 4);
      $$renderer2.push(`Bible References</label>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-2 mb-3">`);
      push_element($$renderer2, "div", 102, 4);
      $$renderer2.push(`<input type="text" id="bible-references"${attr("value", newBibleRef)} placeholder="e.g., John 3:16, Romans 8:28" class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 103, 6);
      pop_element();
      $$renderer2.push(` <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 111, 6);
      $$renderer2.push(`Add</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (bibleReferences.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2">`);
        push_element($$renderer2, "div", 120, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(bibleReferences);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let ref = each_array[$$index];
          $$renderer2.push(`<span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center">`);
          push_element($$renderer2, "span", 122, 10);
          $$renderer2.push(`${escape_html(ref)} <button class="ml-2 hover:text-red-300">`);
          push_element($$renderer2, "button", 124, 12);
          $$renderer2.push(`×</button>`);
          pop_element();
          $$renderer2.push(`</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "div", 129, 4);
      $$renderer2.push(`Add relevant Bible verses that relate to your content's message</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 135, 2);
      $$renderer2.push(`<label for="themes" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 136, 4);
      $$renderer2.push(`Themes</label>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">`);
      push_element($$renderer2, "div", 137, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(commonThemes);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let theme = each_array_1[$$index_1];
        $$renderer2.push(`<label class="cursor-pointer">`);
        push_element($$renderer2, "label", 139, 8);
        $$renderer2.push(`<input type="checkbox"${attr("checked", themes.includes(theme), true)} class="sr-only"/>`);
        push_element($$renderer2, "input", 140, 10);
        pop_element();
        $$renderer2.push(` <div${attr_class(`p-2 border rounded-lg text-center text-sm transition-all ${stringify(themes.includes(theme) ? "border-green-600 bg-green-600/20 text-white" : "border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500")}`)}>`);
        push_element($$renderer2, "div", 146, 10);
        $$renderer2.push(`${escape_html(theme)}</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 155, 2);
      $$renderer2.push(`<label for="ministry" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 156, 4);
      $$renderer2.push(`Ministry/Organization Affiliation</label>`);
      pop_element();
      $$renderer2.push(` <input type="text" id="ministry"${attr("value", ministryAffiliation)} placeholder="e.g., Grace Community Church, Victory Ministries" class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 157, 4);
      pop_element();
      $$renderer2.push(` <div class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "div", 164, 4);
      $$renderer2.push(`Optional: Name of the church, ministry, or organization associated with this content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      push_element($$renderer2, "div", 170, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 171, 4);
      $$renderer2.push(`<label for="duration" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 172, 6);
      $$renderer2.push(`Duration (minutes)</label>`);
      pop_element();
      $$renderer2.push(` <input type="number" id="duration"${attr("value", duration)} placeholder="90" min="1" class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 173, 6);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 183, 4);
      $$renderer2.push(`<label for="language" class="block text-sm font-medium text-white mb-2">`);
      push_element($$renderer2, "label", 184, 6);
      $$renderer2.push(`Primary Language</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "language",
          value: language,
          class: "w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          const each_array_2 = ensure_array_like(languages);
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let lang = each_array_2[$$index_2];
            $$renderer3.option({ value: lang }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(lang)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 198, 2);
      $$renderer2.push(`<label for="accessibilityFeatures" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 199, 4);
      $$renderer2.push(`Accessibility Features</label>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2">`);
      push_element($$renderer2, "div", 200, 4);
      $$renderer2.push(`<label class="flex items-center">`);
      push_element($$renderer2, "label", 201, 6);
      $$renderer2.push(`<input type="checkbox"${attr("checked", hasSubtitles, true)} class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>`);
      push_element($$renderer2, "input", 202, 8);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 207, 8);
      $$renderer2.push(`Has Subtitles</span>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(` <label class="flex items-center">`);
      push_element($$renderer2, "label", 210, 6);
      $$renderer2.push(`<input type="checkbox"${attr("checked", hasClosedCaptions, true)} class="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>`);
      push_element($$renderer2, "input", 211, 8);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 216, 8);
      $$renderer2.push(`Has Closed Captions</span>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 222, 2);
      $$renderer2.push(`<label for="genres" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 223, 4);
      $$renderer2.push(`Genres</label>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">`);
      push_element($$renderer2, "div", 224, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array_3 = ensure_array_like(commonGenres);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let genreOption = each_array_3[$$index_3];
        $$renderer2.push(`<label class="cursor-pointer">`);
        push_element($$renderer2, "label", 226, 8);
        $$renderer2.push(`<input type="checkbox"${attr("checked", genre.includes(genreOption), true)} class="sr-only"/>`);
        push_element($$renderer2, "input", 227, 10);
        pop_element();
        $$renderer2.push(` <div${attr_class(`p-2 border rounded-lg text-center text-sm transition-all ${stringify(genre.includes(genreOption) ? "border-blue-600 bg-blue-600/20 text-white" : "border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500")}`)}>`);
        push_element($$renderer2, "div", 233, 10);
        $$renderer2.push(`${escape_html(genreOption)}</div>`);
        pop_element();
        $$renderer2.push(`</label>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 242, 2);
      $$renderer2.push(`<label for="tags-input" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 243, 4);
      $$renderer2.push(`Tags</label>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-2 mb-3">`);
      push_element($$renderer2, "div", 244, 4);
      $$renderer2.push(`<input type="text" id="tags-input"${attr("value", newTag)} placeholder="Add custom tags..." class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 245, 6);
      pop_element();
      $$renderer2.push(` <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 253, 6);
      $$renderer2.push(`Add</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (tags.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2">`);
        push_element($$renderer2, "div", 262, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_4 = ensure_array_like(tags);
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let tag = each_array_4[$$index_4];
          $$renderer2.push(`<span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">`);
          push_element($$renderer2, "span", 264, 10);
          $$renderer2.push(`${escape_html(tag)} <button class="ml-2 hover:text-red-300">`);
          push_element($$renderer2, "button", 266, 12);
          $$renderer2.push(`×</button>`);
          pop_element();
          $$renderer2.push(`</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 274, 2);
      $$renderer2.push(`<label for="keywords-input" class="block text-sm font-medium text-white mb-3">`);
      push_element($$renderer2, "label", 275, 4);
      $$renderer2.push(`SEO Keywords</label>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-2 mb-3">`);
      push_element($$renderer2, "div", 276, 4);
      $$renderer2.push(`<input type="text" id="keywords-input"${attr("value", newKeyword)} placeholder="Add search keywords..." class="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"/>`);
      push_element($$renderer2, "input", 277, 6);
      pop_element();
      $$renderer2.push(` <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">`);
      push_element($$renderer2, "button", 285, 6);
      $$renderer2.push(`Add</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (keywords.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex flex-wrap gap-2">`);
        push_element($$renderer2, "div", 294, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_5 = ensure_array_like(keywords);
        for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
          let keyword = each_array_5[$$index_5];
          $$renderer2.push(`<span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">`);
          push_element($$renderer2, "span", 296, 10);
          $$renderer2.push(`${escape_html(keyword)} <button class="ml-2 hover:text-red-300">`);
          push_element($$renderer2, "button", 298, 12);
          $$renderer2.push(`×</button>`);
          pop_element();
          $$renderer2.push(`</span>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="text-xs text-gray-400 mt-1">`);
      push_element($$renderer2, "div", 303, 4);
      $$renderer2.push(`Keywords help users find your content through search</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-green-600/20 border border-green-600 rounded-lg p-4">`);
      push_element($$renderer2, "div", 309, 2);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 310, 4);
      $$renderer2.push(`<div class="text-2xl mr-3">`);
      push_element($$renderer2, "div", 311, 6);
      $$renderer2.push(`📝</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 312, 6);
      $$renderer2.push(`<div class="font-medium text-white mb-1">`);
      push_element($$renderer2, "div", 313, 8);
      $$renderer2.push(`Metadata Best Practices</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-green-200 space-y-1">`);
      push_element($$renderer2, "div", 314, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 315, 10);
      $$renderer2.push(`• Add relevant Bible references that connect to your content's message</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 316, 10);
      $$renderer2.push(`• Choose themes that accurately represent your content</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 317, 10);
      $$renderer2.push(`• Use specific, searchable keywords that your audience might use</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 318, 10);
      $$renderer2.push(`• Be honest about content duration and accessibility features</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 319, 10);
      $$renderer2.push(`• Well-structured metadata improves discoverability</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { data, onUpdate });
    },
    MetadataStep
  );
}
MetadataStep.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
ReviewSubmitStep[FILENAME] = "src/lib/components/creator/upload/ReviewSubmitStep.svelte";
function ReviewSubmitStep($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let basicInfo, videoData, assetData, metadataInfo;
      let data = $$props["data"];
      let allStepData = $$props["allStepData"];
      let onUpdate = $$props["onUpdate"];
      let onSubmit = $$props["onSubmit"];
      let termsAccepted = data.termsAccepted || false;
      let guidelinesAccepted = data.guidelinesAccepted || false;
      onUpdate({ termsAccepted, guidelinesAccepted });
      basicInfo = allStepData.stepData[1];
      videoData = allStepData.stepData[2];
      assetData = allStepData.stepData[3];
      metadataInfo = allStepData.stepData[4];
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 23, 0);
      $$renderer2.push(`<div class="text-center mb-8">`);
      push_element($$renderer2, "div", 24, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h2", 25, 4);
      $$renderer2.push(`Review &amp; Submit</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 26, 4);
      $$renderer2.push(`Review your content details before submitting for approval</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 rounded-lg p-6">`);
      push_element($$renderer2, "div", 30, 2);
      $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 31, 4);
      $$renderer2.push(`Content Summary</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 33, 4);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 35, 6);
      $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
      push_element($$renderer2, "h4", 36, 8);
      $$renderer2.push(`Basic Information</h4>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2 text-sm">`);
      push_element($$renderer2, "div", 37, 8);
      $$renderer2.push(`<div class="flex justify-between">`);
      push_element($$renderer2, "div", 38, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 39, 12);
      $$renderer2.push(`Title:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 40, 12);
      $$renderer2.push(`${escape_html(basicInfo.title || "Not provided")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between">`);
      push_element($$renderer2, "div", 42, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 43, 12);
      $$renderer2.push(`Type:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 44, 12);
      $$renderer2.push(`${escape_html(basicInfo.contentType || "Not selected")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between">`);
      push_element($$renderer2, "div", 46, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 47, 12);
      $$renderer2.push(`Age Rating:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 48, 12);
      $$renderer2.push(`${escape_html(basicInfo.ageRating || "Not selected")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 54, 6);
      $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
      push_element($$renderer2, "h4", 55, 8);
      $$renderer2.push(`Video Content</h4>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2 text-sm">`);
      push_element($$renderer2, "div", 56, 8);
      $$renderer2.push(`<div class="flex justify-between">`);
      push_element($$renderer2, "div", 57, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 58, 12);
      $$renderer2.push(`Main Video:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 59, 12);
      if (videoData.videoProgress?.isCompleted) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-green-400">`);
        push_element($$renderer2, "span", 61, 16);
        $$renderer2.push(`✓ Uploaded</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="text-red-400">`);
        push_element($$renderer2, "span", 63, 16);
        $$renderer2.push(`Not uploaded</span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between">`);
      push_element($$renderer2, "div", 67, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 68, 12);
      $$renderer2.push(`Trailer:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 69, 12);
      if (videoData.trailerProgress?.isCompleted) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-green-400">`);
        push_element($$renderer2, "span", 71, 16);
        $$renderer2.push(`✓ Uploaded</span>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="text-gray-400">`);
        push_element($$renderer2, "span", 73, 16);
        $$renderer2.push(`Optional</span>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 81, 6);
      $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
      push_element($$renderer2, "h4", 82, 8);
      $$renderer2.push(`Image Assets</h4>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm">`);
      push_element($$renderer2, "div", 83, 8);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 84, 10);
      $$renderer2.push(`Uploaded:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white ml-2">`);
      push_element($$renderer2, "span", 85, 10);
      $$renderer2.push(`${escape_html(Object.keys(assetData.uploadedAssets || {}).length)} assets</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 92, 6);
      $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
      push_element($$renderer2, "h4", 93, 8);
      $$renderer2.push(`Additional Details</h4>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2 text-sm">`);
      push_element($$renderer2, "div", 94, 8);
      $$renderer2.push(`<div class="flex justify-between">`);
      push_element($$renderer2, "div", 95, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 96, 12);
      $$renderer2.push(`Duration:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 97, 12);
      $$renderer2.push(`${escape_html(metadataInfo.duration ? `${metadataInfo.duration} min` : "Not specified")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between">`);
      push_element($$renderer2, "div", 99, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 100, 12);
      $$renderer2.push(`Language:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 101, 12);
      $$renderer2.push(`${escape_html(metadataInfo.language || "English")}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between">`);
      push_element($$renderer2, "div", 103, 10);
      $$renderer2.push(`<span class="text-gray-400">`);
      push_element($$renderer2, "span", 104, 12);
      $$renderer2.push(`Bible References:</span>`);
      pop_element();
      $$renderer2.push(` <span class="text-white">`);
      push_element($$renderer2, "span", 105, 12);
      $$renderer2.push(`${escape_html(metadataInfo.bibleReferences?.length || 0)}</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (basicInfo.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-6">`);
        push_element($$renderer2, "div", 113, 6);
        $$renderer2.push(`<h4 class="font-medium text-white mb-2">`);
        push_element($$renderer2, "h4", 114, 8);
        $$renderer2.push(`Description</h4>`);
        pop_element();
        $$renderer2.push(` <div class="text-sm text-gray-300 bg-white/5 p-3 rounded">`);
        push_element($$renderer2, "div", 115, 8);
        $$renderer2.push(`${escape_html(basicInfo.description)}</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-6">`);
      push_element($$renderer2, "div", 123, 2);
      $$renderer2.push(`<h3 class="text-xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h3", 124, 4);
      $$renderer2.push(`Review Process</h3>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-3 text-sm text-blue-200">`);
      push_element($$renderer2, "div", 125, 4);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 126, 6);
      $$renderer2.push(`<span class="text-lg mr-3">`);
      push_element($$renderer2, "span", 127, 8);
      $$renderer2.push(`1️⃣</span>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 128, 8);
      $$renderer2.push(`<div class="font-medium">`);
      push_element($$renderer2, "div", 129, 10);
      $$renderer2.push(`Theological Review</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 130, 10);
      $$renderer2.push(`Content will be reviewed for doctrinal accuracy and biblical alignment</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start">`);
      push_element($$renderer2, "div", 133, 6);
      $$renderer2.push(`<span class="text-lg mr-3">`);
      push_element($$renderer2, "span", 134, 8);
      $$renderer2.push(`2️⃣</span>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 135, 8);
      $$renderer2.push(`<div class="font-medium">`);
      push_element($$renderer2, "div", 136, 10);
      $$renderer2.push(`Content Moderation</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 137, 10);
      $$renderer2.push(`General content review for appropriateness and quality</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start">`);
      push_element($$renderer2, "div", 140, 6);
      $$renderer2.push(`<span class="text-lg mr-3">`);
      push_element($$renderer2, "span", 141, 8);
      $$renderer2.push(`3️⃣</span>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 142, 8);
      $$renderer2.push(`<div class="font-medium">`);
      push_element($$renderer2, "div", 143, 10);
      $$renderer2.push(`Technical Quality Assurance</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 144, 10);
      $$renderer2.push(`Video and audio quality, technical specifications check</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-start">`);
      push_element($$renderer2, "div", 147, 6);
      $$renderer2.push(`<span class="text-lg mr-3">`);
      push_element($$renderer2, "span", 148, 8);
      $$renderer2.push(`✅</span>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 149, 8);
      $$renderer2.push(`<div class="font-medium">`);
      push_element($$renderer2, "div", 150, 10);
      $$renderer2.push(`Final Approval &amp; Publishing</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 151, 10);
      $$renderer2.push(`Content goes live on the platform for all users</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 p-3 bg-blue-700/30 rounded">`);
      push_element($$renderer2, "div", 156, 4);
      $$renderer2.push(`<div class="text-sm text-blue-100">`);
      push_element($$renderer2, "div", 157, 6);
      $$renderer2.push(`<strong>`);
      push_element($$renderer2, "strong", 158, 8);
      $$renderer2.push(`Expected Review Time:</strong>`);
      pop_element();
      $$renderer2.push(` 3-5 business days<br/>`);
      push_element($$renderer2, "br", 158, 64);
      pop_element();
      $$renderer2.push(` <strong>`);
      push_element($$renderer2, "strong", 159, 8);
      $$renderer2.push(`Status Updates:</strong>`);
      pop_element();
      $$renderer2.push(` You'll receive email notifications at each stage</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 165, 2);
      $$renderer2.push(`<h3 class="text-xl font-bold text-white">`);
      push_element($$renderer2, "h3", 166, 4);
      $$renderer2.push(`Terms and Guidelines</h3>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 rounded-lg p-6 space-y-4">`);
      push_element($$renderer2, "div", 168, 4);
      $$renderer2.push(`<label class="flex items-start">`);
      push_element($$renderer2, "label", 169, 6);
      $$renderer2.push(`<input type="checkbox"${attr("checked", guidelinesAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>`);
      push_element($$renderer2, "input", 170, 8);
      pop_element();
      $$renderer2.push(` <div class="text-sm">`);
      push_element($$renderer2, "div", 175, 8);
      $$renderer2.push(`<div class="text-white font-medium mb-1">`);
      push_element($$renderer2, "div", 176, 10);
      $$renderer2.push(`Content Guidelines Acceptance</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300">`);
      push_element($$renderer2, "div", 177, 10);
      $$renderer2.push(`I confirm that my content aligns with Sephar Studios' faith-based content guidelines, 
            promotes positive Christian values, and is appropriate for the intended audience. 
            I understand that content not meeting these standards may be rejected.</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(` <label class="flex items-start">`);
      push_element($$renderer2, "label", 185, 6);
      $$renderer2.push(`<input type="checkbox"${attr("checked", termsAccepted, true)} class="mt-1 mr-4 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>`);
      push_element($$renderer2, "input", 186, 8);
      pop_element();
      $$renderer2.push(` <div class="text-sm">`);
      push_element($$renderer2, "div", 191, 8);
      $$renderer2.push(`<div class="text-white font-medium mb-1">`);
      push_element($$renderer2, "div", 192, 10);
      $$renderer2.push(`Terms of Service Agreement</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300">`);
      push_element($$renderer2, "div", 193, 10);
      $$renderer2.push(`I agree to the Sephar Studios Terms of Service, Creator Agreement, and Privacy Policy. 
            I confirm that I have the rights to submit this content and that it does not infringe 
            on any third-party copyrights or intellectual property.</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</label>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4">`);
      push_element($$renderer2, "div", 204, 2);
      $$renderer2.push(`<div class="flex items-start">`);
      push_element($$renderer2, "div", 205, 4);
      $$renderer2.push(`<div class="text-2xl mr-3">`);
      push_element($$renderer2, "div", 206, 6);
      $$renderer2.push(`⚠️</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 207, 6);
      $$renderer2.push(`<div class="font-medium text-white mb-1">`);
      push_element($$renderer2, "div", 208, 8);
      $$renderer2.push(`Before You Submit</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-sm text-yellow-200 space-y-1">`);
      push_element($$renderer2, "div", 209, 8);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 210, 10);
      $$renderer2.push(`• Ensure all required fields are completed accurately</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 211, 10);
      $$renderer2.push(`• Double-check your video quality and audio clarity</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 212, 10);
      $$renderer2.push(`• Verify that all uploaded images represent your content appropriately</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 213, 10);
      $$renderer2.push(`• Make sure your content aligns with our faith-based community standards</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 214, 10);
      $$renderer2.push(`• Content cannot be edited once submitted - you'll need to resubmit if changes are needed</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center pt-6">`);
      push_element($$renderer2, "div", 221, 2);
      $$renderer2.push(`<button${attr("disabled", !termsAccepted || !guidelinesAccepted, true)} class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-green-300 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed">`);
      push_element($$renderer2, "button", 222, 4);
      if (!termsAccepted || !guidelinesAccepted) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`Please Accept Terms to Continue`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`🚀 Submit Content for Review`);
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(` `);
      if (termsAccepted && guidelinesAccepted) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-sm text-gray-400 mt-2">`);
        push_element($$renderer2, "div", 235, 6);
        $$renderer2.push(`Your content will be submitted to our review team</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      bind_props($$props, { data, allStepData, onUpdate, onSubmit });
    },
    ReviewSubmitStep
  );
}
ReviewSubmitStep.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(creator)/creator/upload/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let wizardState = {
        currentStep: UploadStep.BASIC_INFO,
        stepData: {
          [UploadStep.BASIC_INFO]: {},
          [UploadStep.VIDEO_UPLOAD]: {},
          [UploadStep.ASSET_MANAGEMENT]: { uploadedAssets: {}, assetProgress: [] },
          [UploadStep.METADATA]: {},
          [UploadStep.REVIEW_SUBMIT]: { termsAccepted: false, guidelinesAccepted: false }
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
        wizardState.stepData[step] = { ...wizardState.stepData[step], ...data };
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
            wizardState.isValid[step] = !!(videoData.videoFile || videoData.videoProgress?.isCompleted);
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
        console.log("Submitting content:", wizardState);
        alert("Content submitted for review! You will be notified once the review is complete.");
        window.location.href = "/creator/content";
      }
      {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("upload_draft", JSON.stringify(wizardState));
        }
      }
      $$renderer2.push(`<div class="min-h-screen space-y-8">`);
      push_element($$renderer2, "div", 118, 0);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 120, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 121, 4);
      $$renderer2.push(`Upload New Content</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 122, 4);
      $$renderer2.push(`Share your faith-based content with believers worldwide</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      StepIndicator($$renderer2, {
        steps,
        currentStep: wizardState.currentStep,
        isStepValid: wizardState.isValid,
        onStepClick: goToStep
      });
      $$renderer2.push(`<!----> <div class="bg-white/5 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">`);
      push_element($$renderer2, "div", 134, 2);
      if (wizardState.currentStep === UploadStep.BASIC_INFO) {
        $$renderer2.push("<!--[-->");
        BasicInfoStep($$renderer2, {
          data: wizardState.stepData[UploadStep.BASIC_INFO],
          onUpdate: (data) => updateStepData(UploadStep.BASIC_INFO, data)
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (wizardState.currentStep === UploadStep.VIDEO_UPLOAD) {
          $$renderer2.push("<!--[-->");
          VideoUploadStep($$renderer2, {
            data: wizardState.stepData[UploadStep.VIDEO_UPLOAD],
            onUpdate: (data) => updateStepData(UploadStep.VIDEO_UPLOAD, data)
          });
        } else {
          $$renderer2.push("<!--[!-->");
          if (wizardState.currentStep === UploadStep.ASSET_MANAGEMENT) {
            $$renderer2.push("<!--[-->");
            AssetManagementStep($$renderer2, {
              data: wizardState.stepData[UploadStep.ASSET_MANAGEMENT],
              onUpdate: (data) => updateStepData(UploadStep.ASSET_MANAGEMENT, data)
            });
          } else {
            $$renderer2.push("<!--[!-->");
            if (wizardState.currentStep === UploadStep.METADATA) {
              $$renderer2.push("<!--[-->");
              MetadataStep($$renderer2, {
                data: wizardState.stepData[UploadStep.METADATA],
                onUpdate: (data) => updateStepData(UploadStep.METADATA, data)
              });
            } else {
              $$renderer2.push("<!--[!-->");
              if (wizardState.currentStep === UploadStep.REVIEW_SUBMIT) {
                $$renderer2.push("<!--[-->");
                ReviewSubmitStep($$renderer2, {
                  data: wizardState.stepData[UploadStep.REVIEW_SUBMIT],
                  allStepData: wizardState,
                  onUpdate: (data) => updateStepData(UploadStep.REVIEW_SUBMIT, data),
                  onSubmit: submitContent
                });
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="flex justify-between items-center max-w-4xl mx-auto">`);
      push_element($$renderer2, "div", 166, 2);
      $$renderer2.push(`<button${attr("disabled", wizardState.currentStep === UploadStep.BASIC_INFO, true)} class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">`);
      push_element($$renderer2, "button", 167, 4);
      $$renderer2.push(`← Previous</button>`);
      pop_element();
      $$renderer2.push(` <div class="text-center text-gray-300">`);
      push_element($$renderer2, "div", 175, 4);
      $$renderer2.push(`Step ${escape_html(wizardState.currentStep)} of ${escape_html(UploadStep.REVIEW_SUBMIT)}</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (wizardState.currentStep < UploadStep.REVIEW_SUBMIT) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button${attr("disabled", !wizardState.isValid[wizardState.currentStep], true)} class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:text-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors">`);
        push_element($$renderer2, "button", 180, 6);
        $$renderer2.push(`Next →</button>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attr("disabled", !wizardState.isValid[wizardState.currentStep], true)} class="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-green-300 text-white px-8 py-3 rounded-lg font-medium transition-colors">`);
        push_element($$renderer2, "button", 188, 6);
        $$renderer2.push(`Submit for Review</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-D6Ax0axh.js.map
