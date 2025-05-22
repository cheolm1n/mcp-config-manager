<template>
  <el-table :data="mcps" style="width: 100%">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="description" label="Description" />
    <el-table-column prop="version" label="Version" />
    <el-table-column label="Enabled">
      <template #default="{ row }">
        <el-switch v-model="row.enabled" @change="toggle(row.id)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMcpStore } from '../stores/mcp.js';

const store = useMcpStore();
const { mcps } = storeToRefs(store);
const toggle = (id) => store.toggle(id);
</script>
<!-- --- End of MCPList.vue -->
