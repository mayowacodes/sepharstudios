<script lang="ts">
  import { Constants } from "$lib/constants";
</script>

<footer class="border-t bg-muted">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="pt-8 border-t border-border text-center">
      <p class="text-muted-foreground">
        © {new Date().getFullYear()} {Constants.BRANDNAME}. All rights reserved.<br />
        <a href="mailto:{Constants.SUPPORTEMAIL}" class="hover:underline">✉️ {Constants.SUPPORTEMAIL}</a>
      </p>
    </div>
  </div>
</footer>
