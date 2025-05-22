<template>
  <div class="mcp-list-container">
    <el-table :data="mcps" style="width: 100%" border height="calc(100vh - 100px)"> {/* Adjust height based on Toolbar and padding */}
      <el-table-column prop="name" label="이름" width="180" />
      <el-table-column prop="description" label="설명" />
      <el-table-column prop="version" label="버전" width="100" />
      <el-table-column label="활성" width="80" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMcpStore } from '../stores/mcp';

const mcpStore = useMcpStore();
const mcps = computed(() => mcpStore.mcpConfig);

// Switch change will directly modify mcpStore.mcpConfig objects' 'enabled' property
// due to v-model and Pinia's reactivity.
</script>

<style scoped>
.mcp-list-container {
  flex-grow: 1;
  overflow: auto; /* Ensures table itself can scroll if content exceeds container */
}
</style>
// --- End of src/components/MCPList.vue
