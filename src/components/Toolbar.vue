<template>
  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px">
    <input ref="file" type="file" accept=".json" style="display: none" @change="onFile" />
    <el-button icon="Folder" @click="file.click()" />
    <el-button @click="sync">동기화</el-button>
    <el-button @click="refresh">새로고침</el-button>
    <span style="margin-left: auto">{{ path }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMcpStore } from '../stores/mcp.js';
const store = useMcpStore();
const path = store.path;
const file = ref(null);

const onFile = () => {
  const f = file.value.files[0];
  if (f) {
    window.api.readConfig(f.path);
  }
};

const refresh = () => {
  window.api.readConfig();
};

const sync = () => {
  window.api.syncConfig(store.mcps);
};

window.api.onLoaded(({ path: p, data }) => {
  store.setPath(p);
  store.set(data);
});
window.api.onError((m) => {
  // use ElementPlus toast
  ElMessage.error(m);
});
window.api.onSynced((n) => {
  ElMessage.success(`✅ 동기화 완료 (${n} 개 항목)`);
});
</script>
<!-- --- End of Toolbar.vue -->
