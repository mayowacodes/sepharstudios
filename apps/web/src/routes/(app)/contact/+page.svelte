<script lang="ts">
  interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  let formData: FormData = {
    name: "",
    email: "",
    subject: "",
    message: ""
  };

  // Reactive variables for UI updates
  let isSubmitting = false;
  let isSubmitted = false;
  let errorMessage: string | null = null;

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;
    errorMessage = null;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to submit the form. Please try again.");

      // Reset form safely
      formData = { name: "", email: "", subject: "", message: "" };
      isSubmitted = true;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">Contact Us</h1>

  <!-- Success Message -->
  {#if isSubmitted}
    <div role="alert" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
      <p>Thank you for contacting us! We'll get back to you soon.</p>
    </div>
  {/if}

  <!-- Error Message -->
  {#if errorMessage}
    <div role="alert" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <p>{errorMessage}</p>
    </div>
  {/if}

  <!-- Contact Form -->
  <form on:submit={handleSubmit} class="space-y-6">
    {#each Object.entries(formData) as [key, value]}
    <div>
      <label for={key} class="block text-sm font-medium text-[#AF6E4D]">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </label>
      {#if key === "message"}
        <textarea
          id={key}
          bind:value={formData[key as keyof FormData]} 
          required
          rows="5"
          class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2"
        ></textarea>
      {:else}
        <input
          type={key === "email" ? "email" : "text"}
          id={key}
          bind:value={formData[key as keyof FormData]} 
          required
          class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2"
        />
      {/if}
    </div>
  {/each}

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full bg-[#FF5E0E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF5E0E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Send Message"}
      </button>
    </div>
  </form>

  <!-- Additional Contact Information -->
  <div class="mt-12 text-center">
    <h2 class="text-2xl font-bold text-[#FF5E0E] mb-4">Other Ways to Reach Us</h2>
    <div class="space-y-2 text-[#AF6E4D]">
      <p>Email: <a href="mailto:info@sepharstudios.com" class="underline">info@sepharstudios.com</a></p>
      <p>Phone: <a href="tel:+1234567890" class="underline">+1 (234) 567-890</a></p>
      <p>Address: Lagos, Nigeria</p>
    </div>
  </div>
</div>
