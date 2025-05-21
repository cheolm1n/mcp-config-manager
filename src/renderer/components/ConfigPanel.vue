<template>
  <div>
    <h2>MCP 서버</h2>
    <div v-for="(server, key) in servers" :key="key" class="server-row">
      <label>
        <input type="checkbox" v-model="server.enabled" />
        {{ key }} - {{ server.command }}
      </label>
    </div>
    <button @click="apply">Apply</button>
    <button @click="save">Save</button>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '../store/config';

const store = useConfigStore();
const servers = store.servers;

function apply() {
  store.apply();
}
function save() {
  store.save();
}
</script>

<style>
.server-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
</style>
