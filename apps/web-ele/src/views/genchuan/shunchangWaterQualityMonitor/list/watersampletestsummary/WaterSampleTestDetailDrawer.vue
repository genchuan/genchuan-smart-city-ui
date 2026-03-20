<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDrawer,
} from 'element-plus';

import { WaterSampleTestSummaryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
import { dateFormatter } from '#/utils/genchuan/formatTime';

/** 外检统计水质检测结果汇总 详情抽屉 */
defineOptions({ name: 'WaterSampleTestDetailDrawer' });

const drawerVisible = ref(false); // 抽屉是否展示
const drawerTitle = ref(''); // 抽屉标题
const detailLoading = ref(false); // 详情加载中
const detailData = ref<any>({}); // 详情数据

/** 打开抽屉 */
const open = async (id: number) => {
  drawerVisible.value = true;
  drawerTitle.value = '外检统计水质检测结果详情';
  detailLoading.value = true;
  try {
    detailData.value = await WaterSampleTestSummaryApi.getWaterSampleTestSummary(id);
  } finally {
    detailLoading.value = false;
  }
};
defineExpose({ open });

/** 关闭抽屉 */
const handleClose = () => {
  drawerVisible.value = false;
  detailData.value = {};
};

/** 打印报告 */
const handlePrint = () => {
  // 打印逻辑
  window.print();
};

/** 导出报告 */
const handleExportReport = async () => {
  if (!detailData.value.sampleNo) {
    return;
  }
  try {
    const params = {
      excelConfigId: '1072840627048804353', // 报表配置ID
      queryParam: {
        SAMPLE_NO: detailData.value.sampleNo,
      },
      base64Arry: [],
      fileName: `${detailData.value.sampleNo}_检测报告.xlsx`,
    };
    const res = await WaterSampleTestSummaryApi.generateReportExcel(params);
    // 处理文件下载
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${detailData.value.sampleNo}_检测报告.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('导出报告失败:', error);
  }
};
</script>
<template>
  <ElDrawer
    :title="drawerTitle"
    v-model="drawerVisible"
    size="800px"
    :before-close="handleClose"
  >
    <ElDescriptions
      :column="2"
      border
      v-loading="detailLoading"
    >
      <ElDescriptionsItem label="委托单位" :span="2">
        {{ detailData.clientName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="收样日期">
        {{ detailData.receiveDate ? dateFormatter(null, null, detailData.receiveDate) : '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="检测日期">
        {{ detailData.createTime ? dateFormatter(null, null, detailData.createTime) : '-' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="样品编号">
        {{ detailData.sampleNo }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="样品名称">
        {{ detailData.sampleName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="采样地点" :span="2">
        {{ detailData.samplingLocation }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="pH值">
        {{ detailData.phValue }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="色度(度)">
        {{ detailData.colorDegree }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="浑浊度(NTU)">
        {{ detailData.turbidity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="臭和味">
        {{ detailData.odourTaste }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="肉眼可见物">
        {{ detailData.visibleObject }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="氨(以N计)(mg/L)">
        {{ detailData.ammoniaN }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="高锰酸盐指数(以O2计)(mg/L)">
        {{ detailData.permanganateIndex }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="菌落总数(CFU/mL)">
        {{ detailData.totalBacteriaCount }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="总大肠菌群(CFU/100mL)">
        {{ detailData.totalColiform }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="大肠埃希氏菌(CFU/100mL)">
        {{ detailData.escherichiaColi }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="溶解性总固体(mg/L)">
        {{ detailData.dissolvedSolids }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="总硬度(以CaCO3计)(mg/L)">
        {{ detailData.totalHardness }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="氟化物(mg/L)">
        {{ detailData.fluoride }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="硝酸盐(以N计)(mg/L)">
        {{ detailData.nitrateN }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="氯化物(mg/L)">
        {{ detailData.chloride }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="硫酸盐(mg/L)">
        {{ detailData.sulfate }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="铁(mg/L)">
        {{ detailData.iron }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="锰(mg/L)">
        {{ detailData.manganese }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="铜(mg/L)">
        {{ detailData.copper }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="锌(mg/L)">
        {{ detailData.zinc }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="铝(mg/L)">
        {{ detailData.aluminum }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="镉(mg/L)">
        {{ detailData.cadmium }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="铬(六价)(mg/L)">
        {{ detailData.chromium }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="铅(mg/L)">
        {{ detailData.lead }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="汞(mg/L)">
        {{ detailData.mercury }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="砷(mg/L)">
        {{ detailData.arsenic }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="氰化物(mg/L)">
        {{ detailData.cyanide }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="二氧化氯(mg/L)">
        {{ detailData.chlorineDioxide }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="氯酸盐(mg/L)">
        {{ detailData.chlorate }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="亚氯酸盐(mg/L)">
        {{ detailData.chlorite }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="三卤甲烷">
        {{ detailData.trihalomethanes }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="三氯甲烷(mg/L)">
        {{ detailData.chloroform }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="二氯一溴甲烷(mg/L)">
        {{ detailData.dichlorobromomethane }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="一氯二溴甲烷(mg/L)">
        {{ detailData.dibromochloromethane }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="三溴甲烷(mg/L)">
        {{ detailData.bromoform }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="二氯乙酸(mg/L)">
        {{ detailData.dichloroaceticAcid }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="三氯乙酸(mg/L)">
        {{ detailData.trichloroaceticAcid }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="总α放射性(Bq/L)">
        {{ detailData.totalAlphaRadioactivity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="总β放射性(Bq/L)">
        {{ detailData.totalBetaRadioactivity }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <template #footer>
      <ElButton @click="handleClose">关 闭</ElButton>
      <ElButton type="primary" @click="handlePrint">打 印</ElButton>
      <ElButton type="success" @click="handleExportReport">导出报告</ElButton>
    </template>
  </ElDrawer>
</template>
