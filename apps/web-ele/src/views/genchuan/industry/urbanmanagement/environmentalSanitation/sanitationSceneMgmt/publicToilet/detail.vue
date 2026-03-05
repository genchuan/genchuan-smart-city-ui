<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const name = detailObj.value?.name || '公厕';
  return title.value || `${name}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

// 格式化保洁人员（可能是数组或字符串）
const formatCleaners = (cleaners) => {
  if (Array.isArray(cleaners)) return cleaners.join(', ');
  return cleaners || '-';
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">📋 公厕基础信息</div>
      <div class="detail-row"><span class="label">公厕名称：</span>{{ detailObj.name || '-' }}</div>
      <div class="detail-row"><span class="label">公厕位置：</span>{{ detailObj.location || '-' }}
      </div>
      <div class="detail-row"><span class="label">所属区域：</span>{{ detailObj.areaName || '-' }}
      </div>
      <div class="detail-row"><span class="label">开放时段：</span>{{ detailObj.openHours || '-' }}
      </div>
      <div class="detail-row"><span class="label">蹲位数量：</span>{{ detailObj.stallCount ?? '-' }}
      </div>
      <div class="detail-row"><span
        class="label">运营状态：</span>{{ detailObj.operationStatusName || '-' }}
      </div>
      <div class="detail-row"><span class="label">负责人：</span>{{ detailObj.managerName || '-' }}
      </div>
      <div class="detail-row"><span class="label">保洁达标率：</span>{{
          detailObj.cleaningRate ?? '-'
        }}%
      </div>
      <div class="detail-row"><span
        class="label">投诉办结率：</span>{{ detailObj.complaintRate ?? '-' }}%
      </div>
      <div class="detail-row"><span
        class="label">耗材库存预警数：</span>{{ detailObj.warningCount ?? '-' }}
      </div>
      <div class="detail-row"><span class="label">设施完好率：</span>{{
          detailObj.facilityRate ?? '-'
        }}%
      </div>

      <!-- 保洁计划信息（如果存在） -->
      <div class="detail-section"
           v-if="detailObj.cleaningFrequency || detailObj.cleaningTime || detailObj.cleaningContent || detailObj.cleaningStandard || detailObj.cleanersName">
        🧹 保洁计划信息
      </div>
      <div class="detail-row" v-if="detailObj.cleaningFrequency"><span
        class="label">保洁频次：</span>{{ detailObj.cleaningFrequency }}
      </div>
      <div class="detail-row" v-if="detailObj.cleaningTime"><span
        class="label">保洁时段：</span>{{ detailObj.cleaningTime }}
      </div>
      <div class="detail-row" v-if="detailObj.cleaningContent"><span class="label">保洁内容：</span>{{
          detailObj.cleaningContent
        }}
      </div>
      <div class="detail-row" v-if="detailObj.cleaningStandard"><span class="label">保洁标准：</span>{{
          detailObj.cleaningStandard
        }}
      </div>
      <div class="detail-row" v-if="detailObj.cleanersName"><span
        class="label">保洁人员：</span>{{ formatCleaners(detailObj.cleanersName) }}
      </div>

      <!-- 物资库存信息（如果存在） -->
      <div class="detail-section"
           v-if="detailObj.consumableStock || detailObj.consumableThreshold || detailObj.consumableGap || detailObj.lastSupplyTime || detailObj.supplyCycle">
        📦 物资库存信息
      </div>
      <div class="detail-row" v-if="detailObj.consumableStock"><span class="label">物资库存：</span>{{
          detailObj.consumableStock
        }}
      </div>
      <div class="detail-row" v-if="detailObj.consumableThreshold"><span
        class="label">预警阈值：</span>{{ detailObj.consumableThreshold }}
      </div>
      <div class="detail-row" v-if="detailObj.consumableGap"><span
        class="label">缺口数量：</span>{{ detailObj.consumableGap }}
      </div>
      <div class="detail-row" v-if="detailObj.lastSupplyTime"><span
        class="label">上次补充时间：</span>{{ detailObj.lastSupplyTime }}
      </div>
      <div class="detail-row" v-if="detailObj.supplyCycle"><span
        class="label">补充周期：</span>{{ detailObj.supplyCycle }}
      </div>

      <!-- 时间信息（通用） -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}
      </div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
    color: #606266;
  }

  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}
</style>
