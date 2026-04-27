<script setup>
import Map from '#/genchuan-components/Map/index.vue';

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['marker-click']);
</script>

<template>
  <div class="station-map-panel">
    <Map :data="data" @marker-click="emit('marker-click', $event)" />
  </div>
</template>

<style scoped lang="scss">
.station-map-panel {
  min-height: 340px;
  overflow: hidden;
  background-color: hsl(var(--card));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}
</style>
