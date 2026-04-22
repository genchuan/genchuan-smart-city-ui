<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">推送ID：</div>
        <div class="detail-row-right">{{ data.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">用户：</div>
        <div class="detail-row-right">{{ data.userName || '-' }} (ID:{{ data.userId || '-' }})</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">场站：</div>
        <div class="detail-row-right">{{ data.stationName || '-' }} (ID:{{ data.stationId || '-' }})</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">空位信息：</div>
        <div class="detail-row-right">{{ data.spaceInfo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">推送时间：</div>
        <div class="detail-row-right">{{ data.pushTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">推送状态：</div>
        <div class="detail-row-right">
          <el-tag :type="data.status === '待推送' ? 'warning' : 'success'" size="small">
            {{ data.status || '-' }}
          </el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">推送结果：</div>
        <div class="detail-row-right">
          <el-tag v-if="data.pushResult" :type="data.pushResult === '成功' ? 'success' : 'danger'" size="small">
            {{ data.pushResult }}
          </el-tag>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">反馈时间：</div>
        <div class="detail-row-right">{{ data.feedbackTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ data.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ data.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
});

const data = ref({});

watch(
  () => props.detailData,
  (val) => {
    if (val && Object.keys(val).length) {
      data.value = val;
    }
  },
  { immediate: true, deep: true }
);

const drawerTitle = computed(() => {
  const id = data.value?.id || '空位推送';
  return `空位推送详情（ID: ${id}）`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel() {
    detailDrawerApi.close();
  },
});

const open = () => {
  detailDrawerApi.open();
};
const close = () => {
  detailDrawerApi.close();
};

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  width: 100px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
