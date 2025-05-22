<template>
  <div class="toolbar">
    <el-button type="primary" @click="handleSync" :disabled="isLoading" :loading="isSyncing">동기화</el-button>
    <el-button @click="handleOpenFile" :disabled="isLoading">파일 열기</el-button>
    <span class="file-path-label" :title="filePathLabel">현재 파일: {{ filePathLabel }}</span>
    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon @close="clearError" class="toolbar-error-alert" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMcpStore } from '../stores/mcp';
import { ElNotification, ElMessageBox } from 'element-plus'; // Import ElMessageBox

const mcpStore = useMcpStore();
const api = window.api; // Access preload-exposed API

const filePathLabel = computed(() => mcpStore.currentConfigPath || '로드된 파일 없음');
const isLoading = computed(() => mcpStore.isLoading); // General loading state for file operations
const errorMessage = computed(() => mcpStore.error);

const isSyncing = ref(false); // Specific loading state for sync operation

const clearError = () => {
  mcpStore.setError(null);
};

const handleOpenFile = async () => {
  if (isLoading.value || isSyncing.value) return; // Check isSyncing as well
  mcpStore.setError(null);
  mcpStore.setLoading(true);
  try {
    const selectedFilePath = await api.dialogOpenFile();
    if (selectedFilePath) {
      await api.configRead(selectedFilePath);
      // setLoading(false) is handled by App.vue's onConfigLoaded/onConfigError
    } else {
      mcpStore.setLoading(false); // Reset loading if dialog is cancelled
    }
  } catch (error) {
    console.error('Error during open file process:', error);
    const message = `파일 열기 중 오류 발생: ${error.message || '알 수 없는 오류'}`;
    mcpStore.setError(message); // Set error in store
    mcpStore.setLoading(false); // Ensure loading is reset on error
  }
};

const handleSync = async () => {
  if (isLoading.value || isSyncing.value) return;

  if (!mcpStore.currentConfigPath) {
    ElNotification({ title: '오류', message: '동기화할 설정 파일이 로드되지 않았습니다. 먼저 파일을 열어주세요.', type: 'error' });
    return;
  }

  const activeMcps = mcpStore.enabledMcps; // Use getter from store

  if (activeMcps.length === 0) {
    try {
      await ElMessageBox.confirm(
        '활성화된 MCP가 없습니다. 현재 설정은 활성화된 MCP만 파일에 저장합니다. 이렇게 하면 파일의 모든 MCP가 효과적으로 비활성화(제거)됩니다. 계속하시겠습니까?',
        '경고: 빈 활성 목록 동기화',
        {
          confirmButtonText: '동기화 진행 (빈 목록)',
          cancelButtonText: '취소',
          type: 'warning',
        }
      );
    } catch (e) { // User clicked "취소" or closed the dialog
      ElNotification({ title: '취소됨', message: '동기화 작업이 취소되었습니다.', type: 'info', duration: 2000 });
      return;
    }
  }
  
  isSyncing.value = true;
  mcpStore.setError(null); // Clear previous errors before attempting sync
  // mcpStore.setLoading(true); // isLoading is for file read, isSyncing is for sync operation

  try {
    const syncedCount = await api.configSync(activeMcps); // Pass only enabled MCPs
    ElNotification({
      title: '성공',
      message: `✅ 동기화 완료 (${syncedCount} 개 항목) → ${mcpStore.currentConfigPath}`,
      type: 'success',
      duration: 3000,
    });
  } catch (error) {
    console.error('Sync failed in renderer:', error);
    const message = `동기화 실패: ${error.message || '알 수 없는 오류. 자세한 내용은 로그를 확인하세요.'}`;
    mcpStore.setError(message); // Set error in store, App.vue / Toolbar can display it
    // ElNotification is good for immediate feedback, but store error is for persistence
    ElNotification({ title: '오류', message, type: 'error', duration: 5000 });
  } finally {
    isSyncing.value = false;
    // mcpStore.setLoading(false);
  }
};

</script>

<style scoped>
.toolbar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px; /* Space between elements */
  padding: 5px;
  background-color: #f4f4f5;
  border-radius: 4px;
}
.file-path-label {
  font-size: 0.9em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px; /* Adjust as needed */
  cursor: default; /* Indicate it's not editable text but can be hovered for full path */
  border: 1px solid #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #fff;
}
.toolbar-error-alert {
  margin-left: auto; /* Pushes error to the right */
  padding: 5px 10px; /* Smaller padding for toolbar alert */
}
</style>
// --- End of src/components/Toolbar.vue
