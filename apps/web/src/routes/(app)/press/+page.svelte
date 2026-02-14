<script lang="ts">
  // Define the Press Item data structure
  interface PressItem {
    title: string;
    date: string;
    description: string;
    link: string;
    type: "press-release" | "media-coverage" | "award" | "upcoming-project" | "sponsorship" | "testimonial" | "behind-the-scenes" | "kids-teens" | "event";
  }

  // Sample Press Data
  const pressItems: PressItem[] = [
    {
      title: "Sephar Studios Wins Best Family Film Award",
      date: "2023-10-10",
      description: "Our film 'The Light Within' won Best Family Film at the International Christian Film Festival.",
      link: "/press/sephar-studios-wins-best-family-film-award",
      type: "award"
    },
    {
      title: "New Animated Series for Kids: 'Bible Heroes Adventures'",
      date: "2023-09-20",
      description: "Sephar Studios is excited to announce a new animated series for kids, set to premiere in 2024.",
      link: "/press/bible-heroes-adventures-animated-series",
      type: "kids-teens"
    },
    {
      title: "Behind the Scenes of 'The Journey of Faith'",
      date: "2023-09-15",
      description: "Take a sneak peek into the making of our upcoming original series.",
      link: "/press/journey-of-faith-behind-the-scenes",
      type: "behind-the-scenes"
    },
    {
      title: "Sephar Studios Sponsors New Animated Film",
      date: "2023-08-30",
      description: "We are proud to sponsor 'The Adventures of Noah,' a new animated film for kids.",
      link: "/press/adventures-of-noah-sponsorship",
      type: "sponsorship"
    },
    {
      title: "Join Us for the Premiere of 'The Light Within'",
      date: "2023-11-05",
      description: "Don't miss the premiere of our latest film in Los Angeles.",
      link: "/press/light-within-premiere-event",
      type: "event"
    }
  ];

  // Function to format the date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">
    Press
  </h1>

  <!-- Press Items Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each pressItems as item}
      <article class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div class="p-6">
          <!-- Badge for Press Type -->
          {#if item.type}
            <span
              class="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
              class:bg-[#FFBF00]={item.type === "press-release"}
              class:bg-[#AF6E4D]={item.type === "media-coverage"}
              class:bg-[#FF5E0E]={item.type === "award"}
              class:bg-purple-500={item.type === "upcoming-project"}
              class:bg-green-500={item.type === "sponsorship"}
              class:bg-blue-500={item.type === "testimonial"}
              class:bg-pink-500={item.type === "behind-the-scenes"}
              class:bg-teal-500={item.type === "kids-teens"}
              class:bg-indigo-500={item.type === "event"}
            >
              {item.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          {/if}

          <!-- Title -->
          <header>
            <h2 class="text-xl font-bold text-[#AF6E4D] mt-2">
              {item.title}
            </h2>
          </header>

          <!-- Date -->
          <p class="text-sm text-gray-500 mt-1">
            {formatDate(item.date)}
          </p>

          <!-- Description -->
          <p class="text-gray-700 mt-3">
            {item.description}
          </p>

          <!-- Read More Link -->
          {#if item.link}
            <a
              href={item.link}
              class="inline-block text-[#FF5E0E] font-semibold hover:underline mt-4"
              aria-label="Read more about {item.title}"
            >
              Read More →
            </a>
          {/if}
        </div>
      </article>
    {/each}
  </div>

  <!-- Press Kit Section -->
  <div class="mt-16 text-center">
    <h2 class="text-3xl font-bold text-[#FF5E0E] mb-4">
      Press Kit
    </h2>
    <p class="text-gray-700 mb-6">
      Download our press kit for logos, brand guidelines, and other resources.
    </p>
    <a
      href="/press/press-kit-download"
      class="inline-block bg-[#FF5E0E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF5E0E]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5E0E]/50"
      aria-label="Download Press Kit"
    >
      Download Press Kit
    </a>
  </div>
</div>
