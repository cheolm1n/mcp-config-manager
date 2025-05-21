<template>
  <div class="container">
    <aside class="sidebar">
      <ul>
        <li>Profiles</li>
        <li>MCP 서버</li>
        <li>Settings</li>
        <li>About</li>
      </ul>
    </aside>
    <main class="main">
      <ServerList :servers="servers" />
      <div class="actions">
        <button @click="apply">Apply</button>
        <button @click="save">Save</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useConfigStore } from './store/config';
import ServerList from './components/ServerList.vue';

const store = useConfigStore();
const servers = ref([]);

onMounted(async () => {
  await store.load();
  servers.value = store.servers;
});

const apply = async () => {
  await store.apply();
};

const save = async () => {
  await store.save();
};
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background: #eee;
}
.main {
  flex: 1;
  padding: 20px;
}
.actions {
  margin-top: 20px;
}
</style>
