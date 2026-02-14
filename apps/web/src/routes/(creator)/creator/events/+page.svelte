<!-- Creator Events -->
<script lang="ts">
  let activeTab = 'upcoming';

  const upcomingEvents = [
    {
      id: 1,
      title: "Creator Workshop: Advanced Video Editing",
      date: "February 15, 2024",
      time: "7:00 PM EST",
      type: "workshop",
      location: "Online",
      attendees: 124,
      maxAttendees: 200,
      description: "Learn professional video editing techniques specifically for ministry content.",
      speaker: "Sarah Johnson",
      isRegistered: false
    },
    {
      id: 2,
      title: "Monthly Creator Fellowship & Prayer",
      date: "February 22, 2024",
      time: "8:00 PM EST",
      type: "fellowship",
      location: "Online",
      attendees: 89,
      maxAttendees: null,
      description: "Join fellow creators for encouragement, prayer, and community building.",
      speaker: "Community Team",
      isRegistered: true
    },
    {
      id: 3,
      title: "Faith & Film Conference 2024",
      date: "March 8-10, 2024",
      time: "All Day",
      type: "conference",
      location: "Nashville, TN + Online",
      attendees: 456,
      maxAttendees: 1000,
      description: "Three-day conference featuring industry leaders, workshops, and networking.",
      speaker: "Multiple Speakers",
      isRegistered: false
    },
    {
      id: 4,
      title: "Live Q&A: Monetizing Your Ministry Content",
      date: "February 29, 2024",
      time: "2:00 PM EST",
      type: "qa",
      location: "Online",
      attendees: 67,
      maxAttendees: 150,
      description: "Get your questions answered about ethical monetization strategies.",
      speaker: "Pastor Mike Davis",
      isRegistered: false
    }
  ];

  const pastEvents = [
    {
      id: 5,
      title: "New Creator Orientation",
      date: "January 18, 2024",
      type: "orientation",
      attendees: 156,
      recording: "/recordings/orientation-jan-2024"
    },
    {
      id: 6,
      title: "Content Strategy Masterclass",
      date: "January 11, 2024",
      type: "masterclass",
      attendees: 203,
      recording: "/recordings/strategy-masterclass-jan"
    },
    {
      id: 7,
      title: "Technical Support Workshop",
      date: "December 14, 2023",
      type: "workshop",
      attendees: 89,
      recording: "/recordings/tech-workshop-dec"
    }
  ];

  function getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
      workshop: 'blue',
      fellowship: 'purple',
      conference: 'green',
      qa: 'orange',
      orientation: 'yellow',
      masterclass: 'red'
    };
    return colors[type] || 'gray';
  }

  function getEventTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      workshop: '🔧',
      fellowship: '🤝',
      conference: '🎪',
      qa: '❓',
      orientation: '🚀',
      masterclass: '🎓'
    };
    return icons[type] || '📅';
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-3xl font-bold text-white mb-2">Creator Events</h1>
    <p class="text-gray-300">Learn, grow, and connect with fellow faith-based creators</p>
  </div>

  <!-- Event Highlights -->
  <div class="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">🎪 Faith & Film Conference 2024</h2>
        <p class="text-purple-200 mb-4">
          Join us for our biggest event of the year! Three days of workshops, networking, and inspiration.
        </p>
        <div class="flex items-center space-x-4 text-sm text-purple-300">
          <span>📅 March 8-10, 2024</span>
          <span>📍 Nashville, TN + Online</span>
          <span>🎟️ Early Bird: $199</span>
        </div>
      </div>
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
        Register Now
      </button>
    </div>
  </div>

  <!-- Tab Navigation -->
  <div class="border-b border-white/20">
    <nav class="flex space-x-8">
      <button
        onclick={() => activeTab = 'upcoming'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'upcoming' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}"
      >
        Upcoming Events
      </button>
      <button
        onclick={() => activeTab = 'past'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'past' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}"
      >
        Past Events & Recordings
      </button>
      <button
        onclick={() => activeTab = 'calendar'}
        class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'calendar' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300'}"
      >
        Event Calendar
      </button>
    </nav>
  </div>

  <!-- Content Sections -->
  {#if activeTab === 'upcoming'}
    <div class="space-y-6">
      <!-- Filter Options -->
      <div class="flex flex-wrap gap-2">
        <button class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">All Events</button>
        <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">Workshops</button>
        <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">Fellowship</button>
        <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">Q&A Sessions</button>
        <button class="px-3 py-1 bg-white/10 text-gray-300 hover:bg-white/20 rounded-full text-sm">Conferences</button>
      </div>

      <!-- Upcoming Events List -->
      <div class="space-y-4">
        {#each upcomingEvents as event}
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-2xl">{getEventTypeIcon(event.type)}</span>
                  <h3 class="text-xl font-bold text-white">{event.title}</h3>
                  <span class="bg-{getEventTypeColor(event.type)}-600 text-{getEventTypeColor(event.type)}-100 text-xs px-2 py-1 rounded capitalize">
                    {event.type}
                  </span>
                  {#if event.isRegistered}
                    <span class="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">
                      ✅ Registered
                    </span>
                  {/if}
                </div>

                <p class="text-gray-300 mb-4">{event.description}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-400">
                      <span class="mr-2">📅</span>
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-400">
                      <span class="mr-2">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-400">
                      <span class="mr-2">🎤</span>
                      <span>Speaker: {event.speaker}</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center text-sm text-gray-400">
                      <span class="mr-2">👥</span>
                      <span>
                        {event.attendees} attending
                        {#if event.maxAttendees}
                          / {event.maxAttendees} max
                        {/if}
                      </span>
                    </div>
                    {#if event.maxAttendees}
                      <div class="w-full bg-gray-700 rounded-full h-2">
                        <div
                          class="bg-purple-600 h-2 rounded-full"
                          style="width: {(event.attendees / event.maxAttendees) * 100}%"
                        ></div>
                      </div>
                    {/if}
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  {#if !event.isRegistered}
                    <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                      Register
                    </button>
                  {:else}
                    <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                      View Details
                    </button>
                  {/if}
                  <button class="text-gray-400 hover:text-white">
                    📅 Add to Calendar
                  </button>
                  <button class="text-gray-400 hover:text-white">
                    🔔 Set Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if activeTab === 'past'}
    <div class="space-y-6">
      <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-4">
        <h3 class="text-lg font-bold text-white mb-2">📺 Access Event Recordings</h3>
        <p class="text-blue-200">
          Couldn't attend an event? No problem! Access recordings of past workshops, sessions, and conferences.
        </p>
      </div>

      <div class="space-y-4">
        {#each pastEvents as event}
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-2xl">{getEventTypeIcon(event.type)}</span>
                  <h3 class="text-lg font-bold text-white">{event.title}</h3>
                  <span class="bg-{getEventTypeColor(event.type)}-600 text-{getEventTypeColor(event.type)}-100 text-xs px-2 py-1 rounded capitalize">
                    {event.type}
                  </span>
                </div>

                <div class="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <span>📅 {event.date}</span>
                  <span>👥 {event.attendees} attended</span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  📺 Watch Recording
                </button>
                <button class="text-gray-400 hover:text-white">
                  📚 Get Resources
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Event Archive -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">📚 Event Archive</h3>
        <p class="text-gray-300 mb-4">
          Browse our complete library of past events, workshops, and educational content.
        </p>
        <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
          Browse All Recordings
        </button>
      </div>
    </div>

  {:else if activeTab === 'calendar'}
    <div class="space-y-6">
      <!-- Calendar Widget Placeholder -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">📅 Event Calendar</h3>
        <div class="bg-white/5 rounded-lg p-8 text-center">
          <div class="text-6xl mb-4">📅</div>
          <p class="text-gray-300 mb-4">Interactive calendar view coming soon!</p>
          <p class="text-gray-400 text-sm">
            For now, you can view upcoming events in the "Upcoming Events" tab or subscribe to our calendar feed.
          </p>
        </div>
      </div>

      <!-- Calendar Subscription -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-blue-600/20 border border-blue-600 rounded-xl p-4">
          <h4 class="font-medium text-white mb-2">📅 Subscribe to Calendar</h4>
          <p class="text-blue-200 text-sm mb-3">
            Add our events to your personal calendar application.
          </p>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
            Get Calendar Link
          </button>
        </div>

        <div class="bg-green-600/20 border border-green-600 rounded-xl p-4">
          <h4 class="font-medium text-white mb-2">🔔 Event Notifications</h4>
          <p class="text-green-200 text-sm mb-3">
            Get notified about new events and registration openings.
          </p>
          <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
            Enable Notifications
          </button>
        </div>
      </div>

      <!-- Regular Schedule -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">📋 Regular Schedule</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-white mb-3">Weekly Events</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Tuesday Live Q&A</span>
                <span class="text-gray-400">7:00 PM EST</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Thursday Creator Workshop</span>
                <span class="text-gray-400">8:00 PM EST</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Sunday Fellowship Time</span>
                <span class="text-gray-400">6:00 PM EST</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-white mb-3">Monthly Events</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Creator Spotlight</span>
                <span class="text-gray-400">First Friday</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Ministry Masterclass</span>
                <span class="text-gray-400">Third Saturday</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Community Prayer</span>
                <span class="text-gray-400">Last Thursday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Event Suggestions -->
  <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-6">
    <h3 class="text-lg font-bold text-white mb-4">💡 Suggest an Event</h3>
    <p class="text-purple-200 mb-4">
      Have an idea for a workshop, topic, or speaker you'd like to see? We'd love to hear from you!
    </p>
    <div class="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="What event would you like to see?"
        class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
      />
      <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
        Submit Suggestion
      </button>
    </div>
  </div>
</div>