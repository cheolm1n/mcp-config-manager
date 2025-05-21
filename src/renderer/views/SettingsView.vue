<template>
  <div>
    <h2>MCP Settings</h2>
    <div v-if="config">
      <div v-for="(srv, key) in servers" :key="key" class="server-row">
        <label>{{ key }}</label>
        <input type="checkbox" v-model="srv.enabled" />
      </div>
      <button @click="apply">Apply</button>
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useMcpStore } from '../store/mcpStore';

const store = useMcpStore();
const config = reactive<{ [key: string]: any }>({});
const servers = reactive<{ [key: string]: any }>({});

onMounted(async () => {
  const res = await window.mcpAPI.getConfig();
  if (res.success) {
    Object.assign(config, res.config);
    Object.assign(servers, res.config.mcpServers || {});
    // restore enabled flag
    Object.entries(servers).forEach(([k, v]: [string, any]) => {
      if (v) v.enabled = true;
    });
  }
});

function apply() {
  store.apply(servers);
}

function save() {
  store.save(config, servers);
}
</script>

<style scoped>
.server-row { margin: 4px 0; }
</style>
