<template>
  <div>
    <div v-for="srv in servers" :key="srv.name" class="server-row">
      <label>
        <input type="checkbox" v-model="srv.enabled" />
        {{ srv.name }}
      </label>
      <span>{{ srv.command }} {{ srv.args?.join(' ') }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ servers: Array });
</script>

<style>
.server-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
