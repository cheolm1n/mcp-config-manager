<template>
  <div class="app-container">
    <Sidebar @select="currentView = $event" />
    <main class="main-panel">
      <ConfigPanel v-if="currentView === 'mcp'" />
      <SettingsPanel v-else-if="currentView === 'settings'" />
      <AboutPanel v-else-if="currentView === 'about'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import ConfigPanel from './components/ConfigPanel.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import AboutPanel from './components/AboutPanel.vue';

const currentView = ref('mcp');
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}
.main-panel {
  flex-grow: 1;
  padding: 1rem;
}
</style>
