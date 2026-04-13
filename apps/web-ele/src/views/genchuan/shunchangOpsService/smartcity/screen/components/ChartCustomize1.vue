<template>
  <div class="chart-customize1-css">
    {{ paramsData.name
    }}<span v-for="(item, key) in paramsData.runningDays" :key="key">{{
      item
    }}</span
    >{{ paramsData.tail }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  paramsData: {
    type: Object,
    default: () => {
      return {
        name: '',
        runningDays: '',
        tail: '',
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.chart-customize1-css {
  top: 0;

  /* position: absolute; */
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 28px;
  font-weight: bold;
  line-height: 40px;
  color: #fff;
  text-align: center;

  span {
    padding: 3px 5px !important;
    margin-right: 8px !important;
    font-size: 38px;
    background: #0069df;
  }
}
</style>
