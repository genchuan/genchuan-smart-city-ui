<!-- platform-report/detail.vue (详情抽屉) -->
<script setup>
import { computed, defineProps, toRefs, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { reportStatusList } from './data';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' }
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  return title.value || (detailObj.value?.batch_no ? `${detailObj.value.batch_no}详情` : '上报详情');
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); }
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close()
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-scroll-container">
      <div class="detail-card">
        <h3 class="detail-card-title">上报基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">上报批次号：</div>
          <div class="detail-row-right">{{ detailObj.batch_no || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联评价任务：</div>
          <div class="detail-row-right">{{ detailObj.task_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报人：</div>
          <div class="detail-row-right">{{ detailObj.report_by_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报时间：</div>
          <div class="detail-row-right">{{ detailObj.report_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上报文件名称：</div>
          <div class="detail-row-right">{{ detailObj.file_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据条数：</div>
          <div class="detail-row-right">{{ detailObj.data_count || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">成功条数：</div>
          <div class="detail-row-right">{{ detailObj.success_count || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">失败条数：</div>
          <div class="detail-row-right">{{ detailObj.fail_count || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据状态：</div>
          <div class="detail-row-right">{{ reportStatusList.find(s => s.id === detailObj.status)?.name || detailObj.status }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">校验时间：</div>
          <div class="detail-row-right">{{ detailObj.check_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">校验操作人：</div>
          <div class="detail-row-right">{{ detailObj.check_by_name || '-' }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.fail_reason">
          <div class="detail-row-left">失败原因：</div>
          <div class="detail-row-right">{{ detailObj.fail_reason }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">重新上传次数：</div>
          <div class="detail-row-right">{{ detailObj.reupload_count || 0 }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.last_reupload_time">
          <div class="detail-row-left">最近重新上传时间：</div>
          <div class="detail-row-right">{{ detailObj.last_reupload_time }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.error_file_url">
          <div class="detail-row-left">错误文件下载：</div>
          <div class="detail-row-right">
            <a :href="detailObj.error_file_url" download>点击下载</a>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px;
}
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}
.detail-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2f3d;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.detail-row-left {
  width: 140px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
</style>
