<!-- Test page to verify layout isolation -->
<div class="p-8 text-center">
  <h1 class="text-4xl font-bold text-white mb-4">Admin Layout Test</h1>
  <p class="text-red-300 text-xl">If you can see the main site header/footer, the layout reset is NOT working.</p>
  <p class="text-green-300 text-xl">If you only see this content with admin styling, the layout reset IS working!</p>
  
  <div class="mt-8 p-4 bg-red-600/20 border border-red-500 rounded">
    <p class="text-white">This should have red/orange admin styling background</p>
    <p class="text-gray-300">Current URL: /admin/test</p>
  </div>
</div>