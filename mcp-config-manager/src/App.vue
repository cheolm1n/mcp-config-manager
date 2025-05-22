<template>
  <div id="app-container">
    <Toolbar />
    <MCPList />
  </div>
</template>

<script setup>
import Toolbar from './components/Toolbar.vue';
import MCPList from './components/MCPList.vue';
import { useMcpStore } from './stores/mcp';
import { onMounted } from 'vue';
import { ElNotification } from 'element-plus'; // Import for notifications

// Access the exposed API from preload.js
// Assuming 'api' is exposed as per preload.js
const api = window.api;
const mcpStore = useMcpStore();

onMounted(() => {
  mcpStore.setLoading(true); // Set loading true when initial read starts
  api.configRead(null);

  api.onConfigLoaded((config, filePath) => {
    console.log('Config loaded:', config, 'from path:', filePath);
    mcpStore.setMcpConfig(config);
    mcpStore.setCurrentConfigPath(filePath);
    mcpStore.setError(null); // Clear any previous error
    ElNotification({ title: '성공', message: `"${filePath}" 에서 설정을 로드했습니다.`, type: 'success', duration: 2000 });
    mcpStore.setLoading(false);
  });

  api.onConfigError((errorMessage) => {
    console.error('Config error:', errorMessage);
    mcpStore.setError(errorMessage);
    mcpStore.setCurrentConfigPath(''); // Clear path on error
    ElNotification({ title: '오류', message: errorMessage, type: 'error', duration: 5000 });
    mcpStore.setLoading(false);
  });
});
</script>

<style>
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}
/* Add global styles if needed */
</style>
// --- End of src/App.vue
