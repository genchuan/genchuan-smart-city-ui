<!-- problemDetail.vue - 问题详情弹窗（需在内部index.vue同目录创建） -->
<script setup>
import { toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  problemObj: { type: Object, default: () => ({ problem: '' }) },
});
const { problemObj } = toRefs(props);

const [ProblemDrawer, problemDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  title: '问题定位详情',
  onCancel: () => problemDrawerApi.close(),
});
defineExpose({ open: () => problemDrawerApi.open() });
</script>

<template>
  <ProblemDrawer>
    <div class="problem-content">
      <el-alert type="warning" :closable="false" show-icon>
        <template #title>异常原因分析</template>
        {{ problemObj.problem || '暂无详细定位信息' }}
      </el-alert>
    </div>
  </ProblemDrawer>
</template>

<style scoped>
.problem-content { padding: 20px; }
</style>
