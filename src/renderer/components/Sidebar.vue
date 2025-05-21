<template>
  <nav class="sidebar">
    <ul>
      <li :class="{ active: current==='mcp' }" @click="select('mcp')">MCP 서버</li>
      <li :class="{ active: current==='profiles' }" @click="select('profiles')">Profiles</li>
      <li :class="{ active: current==='settings' }" @click="select('settings')">Settings</li>
      <li :class="{ active: current==='about' }" @click="select('about')">About</li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits(['select']);
const current = ref('mcp');

function select(view: string) {
  current.value = view;
  emit('select', view);
}
</script>

<style>
.sidebar {
  width: 200px;
  background: #eee;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.sidebar li.active {
  background: #ccc;
}
</style>
