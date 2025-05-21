<template>
  <div class="app">
    <aside class="sidebar">
      <ul>
        <li>Profiles</li>
        <li>MCP 서버</li>
        <li>Settings</li>
        <li>About</li>
      </ul>
    </aside>
    <main class="panel">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout only; logic in views
</script>

<style scoped>
.app {
  display: flex;
}
.sidebar {
  width: 200px;
  background: #f0f0f0;
}
.panel {
  flex: 1;
  padding: 16px;
}
</style>
