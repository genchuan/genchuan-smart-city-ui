<!-- detail.vue -->
<!-- 欠费详情抽屉，展示欠费完整信息、补缴记录、催收记录 -->
<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `欠费记录${detailObj.value?.id || ''}详情`);

// 模拟补缴记录和催收记录 (实际开发中应从API获取)
const repaymentRecords = computed(() => {
  if (detailObj.value.repayTime && detailObj.value.repayAmount) {
    return [{ repayTime: detailObj.value.repayTime, repayAmount: detailObj.value.repayAmount, remark: '线上补缴' }];
  }
  return [];
});
const urgeRecords = computed(() => {
  return detailObj.value.urgeRecords || [];
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: (data) => { detailObj.value = data; detailDrawerApi.open(); }, close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">
        <h4>基本信息</h4>
        <div class="detail-card-row"><div class="detail-row-left">欠费企业：</div><div class="detail-row-right">{{ detailObj.arrearsCompany || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">欠费项目：</div><div class="detail-row-right">{{ detailObj.arrearsItem || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">欠费金额：</div><div class="detail-row-right">{{ detailObj.arrearsAmount || '-' }} 元</div></div>
        <div class="detail-card-row"><div class="detail-row-left">欠费时长：</div><div class="detail-row-right">{{ detailObj.arrearsDuration || '-' }} 天</div></div>
        <div class="detail-card-row"><div class="detail-row-left">欠费状态：</div><div class="detail-row-right">{{ detailObj.arrearsStatus || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">补缴时间：</div><div class="detail-row-right">{{ detailObj.repayTime || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">补缴金额：</div><div class="detail-row-right">{{ detailObj.repayAmount || '-' }} 元</div></div>
        <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime ? formatTimestamp(detailObj.updateTime) : '-' }}</div></div>
      </div>
      <div class="detail-section" v-if="repaymentRecords.length">
        <h4>补缴记录</h4>
        <el-table :data="repaymentRecords" border size="small">
          <el-table-column prop="repayTime" label="补缴时间" />
          <el-table-column prop="repayAmount" label="补缴金额(元)" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>
      <div class="detail-section" v-if="urgeRecords.length">
        <h4>催收记录</h4>
        <el-table :data="urgeRecords" border size="small">
          <el-table-column prop="urgeTime" label="催收时间" />
          <el-table-column prop="operator" label="操作人" />
          <el-table-column prop="content" label="催收内容" />
        </el-table>
      </div>
      <div class="detail-section" v-else>
        <h4>催收记录</h4>
        <el-empty description="暂无催收记录" :image-size="60" />
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #303133; border-left: 4px solid #4A90E2; padding-left: 10px; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
