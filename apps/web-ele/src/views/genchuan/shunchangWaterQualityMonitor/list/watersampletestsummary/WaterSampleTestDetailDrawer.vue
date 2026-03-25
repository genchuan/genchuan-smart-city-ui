<script setup lang="ts">
import { ref, watch } from 'vue';

import {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElMessage,
  ElTabs,
  ElTabPane,
} from 'element-plus';
import type { PropType } from 'vue';

import {
  WaterSampleTestSummaryApi
} from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
import type { WaterSampleTestSummaryVO } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary'
/** 外检统计水质检测结果汇总 详情抽屉 */
defineOptions({ name: 'WaterSampleTestDetailDrawer' });

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  rowId: {
    type: [Number, null] as PropType<number | null>,
    required: true,
  },
});

const emit = defineEmits(['close']);

const loading = ref(false);
const detailData = ref<WaterSampleTestSummaryVO | null>(null);
const indicatorOptions = ref<{ label: string; prop: string }[]>([]);
const activeTab = ref('basic');

/** 请求详情数据 */
const fetchDetailData = async (id: number) => {
  if (id === null) {
    ElMessage.warning('未获取到有效的行 ID');
    return;
  }
  loading.value = true;
  try {
    const data = await WaterSampleTestSummaryApi.getWaterSampleTestSummary(id);
    detailData.value = data;

    if (detailData.value) {
      const fields = Object.keys(detailData.value).filter(
        (field) =>
          ![
            'id',
            'clientName',
            'receiveDate',
            'sampleNo',
            'sampleName',
            'samplingLocation',
            'createTime',
            'longitude',
            'latitude',
          ].includes(field),
      );

      const indicatorLabelMap: Record<string, string> = {
        phValue: 'pH值',
        ammoniaN: '氨(以N计)(mg/L)',
        odourTaste: '臭和味',
        escherichiaColi: '大肠埃希氏菌(CFU/100mL)',
        dichlorobromomethane: '二氯一溴甲烷(mg/L)',
        dichloroaceticAcid: '二氯乙酸(mg/L)',
        chlorineDioxide: '二氧化氯(mg/L)',
        fluoride: '氟化物(mg/L)',
        permanganateIndex: '高锰酸盐指数(以O2计)(mg/L)',
        cadmium: '镉(mg/L)',
        chromium: '铬(六价)(mg/L)',
        mercury: '汞(mg/L)',
        turbidity: '浑浊度(NTU)',
        totalBacteriaCount: '菌落总数(CFU/mL)',
        sulfate: '硫酸盐(mg/L)',
        aluminum: '铝(mg/L)',
        chloride: '氯化物(mg/L)',
        chlorate: '氯酸盐(mg/L)',
        manganese: '锰(mg/L)',
        lead: '铅(mg/L)',
        cyanide: '氰化物(mg/L)',
        dissolvedSolids: '溶解性总固体(mg/L)',
        visibleObject: '肉眼可见物',
        trihalomethanes: '三卤甲烷',
        chloroform: '三氯甲烷(mg/L)',
        trichloroaceticAcid: '三氯乙酸(mg/L)',
        bromoform: '三溴甲烷(mg/L)',
        colorDegree: '色度(度)',
        arsenic: '砷(mg/L)',
        iron: '铁(mg/L)',
        copper: '铜(mg/L)',
        nitrateN: '硝酸盐(以N计)(mg/L)',
        zinc: '锌(mg/L)',
        chlorite: '亚氯酸盐(mg/L)',
        dibromochloromethane: '一氯二溴甲烷(mg/L)',
        totalAlphaRadioactivity: '总α放射性(Bq/L)',
        totalBetaRadioactivity: '总β放射性(Bq/L)',
        totalColiform: '总大肠菌群(CFU/100mL)',
        totalHardness: '总硬度(以CaCO3计)(mg/L)',
      };

      indicatorOptions.value = fields.map((prop) => ({
        prop,
        label: indicatorLabelMap[prop] || prop,
      }));
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情数据失败，请重试');
  } finally {
    loading.value = false;
  }
};

/** 监听 visible 变化，触发数据加载 */
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.rowId !== null) {
      fetchDetailData(props.rowId);
    }
  },
  { immediate: true },
);

/** 关闭抽屉 */
const handleClose = () => {
  emit('close');
};
</script>
<template>
  <ElDrawer
    title="外检水质检测结果详情"
    :model-value="visible"
    :width="900"
    @close="handleClose"
    :close-on-click-modal="false"
    size="66%"
  >
    <div v-loading="loading" class="detail-container">
      <template v-if="detailData">
        <ElTabs v-model="activeTab" class="detail-tabs">
          <ElTabPane label="基础信息" name="basic">
            <ElForm label-width="120px" class="detail-form basic-form">
              <ElFormItem label="委托单位">
                <span class="form-value">{{ detailData.clientName }}</span>
              </ElFormItem>
              <ElFormItem label="收样日期">
                <span class="form-value">{{ detailData.receiveDate }}</span>
              </ElFormItem>
              <ElFormItem label="样品编号">
                <span class="form-value">{{ detailData.sampleNo }}</span>
              </ElFormItem>
              <ElFormItem label="样品名称">
                <span class="form-value">{{ detailData.sampleName }}</span>
              </ElFormItem>
              <ElFormItem label="采样地点">
                <span class="form-value">{{ detailData.samplingLocation }}</span>
              </ElFormItem>
            </ElForm>
          </ElTabPane>

          <ElTabPane label="指标数据" name="indicators">
            <div class="indicator-grid">
              <div
                v-for="(item, idx) in indicatorOptions"
                :key="idx"
                class="indicator-item"
              >
                <span class="indicator-label">{{ item.label }}</span>
                <span class="indicator-value">
                  {{ detailData[item.prop as keyof WaterSampleTestSummaryVO] || '-' }}
                </span>
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
      </template>
    </div>
  </ElDrawer>
</template>
<style scoped>
.detail-container {
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 24px;
  background: #fff;
}

.detail-tabs {
  --el-tabs-nav-height: 42px;
  --el-tabs-tab-font-size: 15px;
  --el-tabs-tab-active-color: #409eff;
}

.basic-form {
  --el-form-item-margin-bottom: 12px;
  padding: 10px 0;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 12px;
  padding: 10px 0;
}

.indicator-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.indicator-label {
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-value {
  display: block;
  padding: 6px 10px;
  border-radius: 4px;
  background: #f8f9fa;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  min-height: 32px;
  box-sizing: border-box;
}

.form-value {
  display: inline-block;
  width: 100%;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f8f9fa;
  color: #666;
  line-height: 1.6;
  word-break: break-word;
}
</style>
