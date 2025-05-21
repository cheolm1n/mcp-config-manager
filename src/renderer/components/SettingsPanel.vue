<template>
  <div>
    <h2>Settings</h2>
    <label>
      Mic Volume
      <input type="range" v-model="settings.micVolume" min="0" max="100" />
    </label>
    <label>
      Noise Suppression
      <select v-model="settings.noiseSuppressionLevel">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </label>
    <button @click="apply">Apply</button>
    <button @click="save">Save</button>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '../store/config';
const store = useConfigStore();
const settings = store.config;

function apply() { store.apply(); }
function save() { store.save(); }
</script>
