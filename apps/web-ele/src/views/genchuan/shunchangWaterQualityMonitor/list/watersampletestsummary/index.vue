<script setup lang="ts">
import type { WaterSampleTestSummaryVO } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
// eslint-disable-next-line import/no-duplicates
import type { JmReportParams } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';

import { onMounted, reactive, ref, watch } from 'vue';

import { confirm } from '@vben/common-ui';

import { Icon } from '@iconify/vue';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
  ElSpace,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { WaterSampleTestSummaryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';
import download from '#/utils/genchuan/download';
import { dateFormatter } from '#/utils/genchuan/formatTime';

import WaterSampleTestDetailDrawer from './WaterSampleTestDetailDrawer.vue';
import WaterSampleTestSummaryForm from './WaterSampleTestSummaryForm.vue';
import WaterSampleTestSummaryImport from './WaterSampleTestSummaryImport.vue';

/** 外检统计水质检测结果汇总 列表 */
defineOptions({ name: 'WaterSampleTestSummary' });

const loading = ref(true); // 列表的加载中
const list = ref<WaterSampleTestSummaryVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  clientName: undefined,
  receiveDate: undefined,
  sampleNo: undefined,
  sampleName: undefined,
  samplingLocation: undefined,
  createTime: [],
  sortField: undefined as string | undefined,
  sortOrder: undefined as 'ASC' | 'DESC' | undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const reportLoading = ref<Record<number, boolean>>({}); // 生成报告加载状态

// 指标配置
const indicatorOptions = ref<{ label: string; prop: string }[]>([]);
const selectedIndicators = ref<string[]>([]);
const checkAll = ref(false);
const indeterminate = ref(false);

// 数值型指标
const numericIndicators = [
  'phValue',
  'ammoniaN',
  'escherichiaColi',
  'dichlorobromomethane',
  'dichloroaceticAcid',
  'chlorineDioxide',
  'fluoride',
  'permanganateIndex',
  'cadmium',
  'chromium',
  'mercury',
  'turbidity',
  'totalBacteriaCount',
  'sulfate',
  'aluminum',
  'chloride',
  'chlorate',
  'manganese',
  'lead',
  'cyanide',
  'dissolvedSolids',
  'chloroform',
  'trichloroaceticAcid',
  'bromoform',
  'colorDegree',
  'arsenic',
  'iron',
  'copper',
  'nitrateN',
  'zinc',
  'chlorite',
  'dibromochloromethane',
  'totalColiform',
  'totalHardness',
];

// 指标标签映射
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

/** 数值转换 */
const convertToNumber = (value: any): number | string => {
  if (!value) return value;
  const numericValue = String(value).replaceAll(/[<>±]/g, '').trim();
  const num = Number.parseFloat(numericValue);
  return isNaN(num) ? value : num;
};

/** 格式化列表数据 */
const formatListData = (
  rawList: WaterSampleTestSummaryVO[],
): WaterSampleTestSummaryVO[] => {
  return rawList.map((item) => {
    const formattedItem = { ...item } as Record<string, any>;
    numericIndicators.forEach((prop) => {
      const originalValue = formattedItem[prop];
      formattedItem[prop] = convertToNumber(originalValue);
    });
    return formattedItem as WaterSampleTestSummaryVO;
  });
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await WaterSampleTestSummaryApi.getWaterSampleTestSummaryPage(
        queryParams,
      );
    list.value = formatListData(data.list);
    total.value = data.total;
    // 提取指标配置
    if (indicatorOptions.value.length === 0 && list.value.length > 0) {
      const firstRow = list.value[0];
      const indicatorFields = Object.keys(firstRow).filter(
        (field) =>
          ![
            'clientName',
            'createTime',
            'id',
            'latitude',
            'longitude',
            'receiveDate',
            'sampleName',
            'sampleNo',
            'samplingLocation',
          ].includes(field),
      );
      indicatorOptions.value = indicatorFields.map((prop) => ({
        prop,
        label: indicatorLabelMap[prop] || prop,
      }));
      // 默认选中pH值
      if (
        selectedIndicators.value.length === 0 &&
        indicatorOptions.value.length > 0
      ) {
        const pHIndicator = indicatorOptions.value.find(
          (item) => item.prop === 'phValue',
        );
        selectedIndicators.value = pHIndicator
          ? [pHIndicator.prop]
          : [indicatorOptions.value[0].prop];
      }
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取数据失败，请重试');
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  if (indicatorOptions.value.length > 0) {
    const pHIndicator = indicatorOptions.value.find(
      (item) => item.prop === 'phValue',
    );
    selectedIndicators.value = pHIndicator
      ? [pHIndicator.prop]
      : [indicatorOptions.value[0].prop];
  }
  queryParams.sortField = undefined;
  queryParams.sortOrder = undefined;
  handleQuery();
};

/** 指标切换 */
const handleIndicatorChange = () => {
  queryParams.sortField = undefined;
  queryParams.sortOrder = undefined;
};

/** 排序变化 */
const handleSortChange = (sort: {
  order: 'ascending' | 'descending' | null;
  prop: string;
}) => {
  if (selectedIndicators.value.includes(sort.prop)) {
    queryParams.sortField = sort.prop;
    queryParams.sortOrder =
      sort.order === 'ascending'
        ? 'ASC'
        : (sort.order === 'descending'
          ? 'DESC'
          : undefined);
  } else {
    queryParams.sortField = undefined;
    queryParams.sortOrder = undefined;
  }
  getList();
};

/** 全选 */
const handleCheckAll = (val: boolean) => {
  indeterminate.value = false;
  selectedIndicators.value = val
    ? indicatorOptions.value.map((_) => _.prop)
    : [];
};

/** 获取指标标签 */
const getIndicatorLabel = (indicatorProp: string) => {
  const found = indicatorOptions.value.find(
    (item) => item.prop === indicatorProp,
  );
  return found?.label || indicatorProp;
};

/** 获取指标值 */
const getIndicatorValue = (
  row: WaterSampleTestSummaryVO,
  indicatorProp: string,
) => {
  const value = row[indicatorProp as keyof WaterSampleTestSummaryVO];
  return value !== undefined && value !== null ? value : '-';
};

/** 序号计算 */
const indexMethod = (index: number) =>
  (queryParams.pageNo - 1) * queryParams.pageSize + index + 1;

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value?.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await confirm('是否确认删除该外检统计水质检测结果汇总数据？', '系统提示');
    await WaterSampleTestSummaryApi.deleteWaterSampleTestSummary(id);
    ElMessage.success('删除成功');
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await confirm('是否确认导出所有外检统计水质检测结果汇总数据？', '系统提示');
    exportLoading.value = true;
    const data =
      await WaterSampleTestSummaryApi.exportWaterSampleTestSummary(queryParams);
    download.excel(data, '外检统计水质检测结果汇总.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 生成报告 */
const handleGenerateReport = async (row: WaterSampleTestSummaryVO) => {
  try {
    reportLoading.value[row.id] = true;
    const reportParams: JmReportParams = {
      excelConfigId: '1121224284821139456',
      queryParam: {
        SAMPLE_NO: row.sampleNo,
      },
      base64Arry: [],
      fileName: `${row.sampleNo}_${row.sampleName}_检测报告`,
    };
    const blob =
      await WaterSampleTestSummaryApi.generateReportExcel(reportParams);
    const downloadFileName = `${row.sampleNo}_${row.sampleName}_检测报告.xlsx`;
    download.excel(blob, downloadFileName);
    ElMessage.success('报告生成成功，正在下载...');
  } catch (error) {
    console.error('生成报告失败:', error);
    ElMessage.error('报告生成失败，请重试');
  } finally {
    reportLoading.value[row.id] = false;
  }
};

/** 详情抽屉 */
const detailDrawerVisible = ref(false);
const selectedRowId = ref<null | number>(null);
const openDetailDrawer = (id: number) => {
  selectedRowId.value = id;
  detailDrawerVisible.value = true;
};

/** 导入 */
const importRef = ref();
const handleImport = () => {
  importRef.value?.open();
};

/** 监听选中指标变化 */
watch(
  selectedIndicators,
  (newVal) => {
    const totalOptions = indicatorOptions.value.length;
    const selectedCount = newVal.length;
    if (totalOptions === 0) {
      checkAll.value = false;
      indeterminate.value = false;
      return;
    }
    checkAll.value = selectedCount === totalOptions;
    indeterminate.value = selectedCount > 0 && selectedCount < totalOptions;
  },
  { immediate: true },
);

/** 初始化 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="p-4">
    <!-- 搜索工作栏 -->
    <ElCard class="mb-4" shadow="never">
      <ElForm
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <ElFormItem label="委托单位" prop="clientName">
          <ElInput
            v-model="queryParams.clientName"
            placeholder="请输入委托单位"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="收样日期" prop="receiveDate">
          <ElDatePicker
            v-model="queryParams.receiveDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择收样日期"
            style="width: 220px"
          />
        </ElFormItem>
        <ElFormItem label="样品编号" prop="sampleNo">
          <ElInput
            v-model="queryParams.sampleNo"
            placeholder="请输入样品编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="样品名称" prop="sampleName">
          <ElInput
            v-model="queryParams.sampleName"
            placeholder="请输入样品名称"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="采样地点" prop="samplingLocation">
          <ElInput
            v-model="queryParams.samplingLocation"
            placeholder="请输入采样地点"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="指标筛选">
          <ElSelect
            v-model="selectedIndicators"
            placeholder="选择指标"
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            @change="handleIndicatorChange"
            style="width: 240px"
            :disabled="indicatorOptions.length === 0"
          >
            <template #header>
              <ElCheckbox
                v-model="checkAll"
                :indeterminate="indeterminate"
                @change="handleCheckAll"
              >
                全选
              </ElCheckbox>
            </template>
            <ElOption
              v-for="item in indicatorOptions"
              :key="item.prop"
              :label="item.label"
              :value="item.prop"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" @click="handleQuery">
              <Icon icon="ep:search" style="margin-right: 4px" /> 搜索
            </ElButton>
            <ElButton @click="resetQuery">
              <Icon icon="ep:refresh" style="margin-right: 4px" /> 重置
            </ElButton>
            <ElButton type="success" @click="openForm('create')">
              <Icon icon="ep:plus" style="margin-right: 4px" /> 新增
            </ElButton>
            <ElButton type="info" @click="handleImport">
              <Icon icon="ep:upload" style="margin-right: 4px" /> 导入
            </ElButton>
            <ElButton
              type="warning"
              @click="handleExport"
              :loading="exportLoading"
            >
              <Icon icon="ep:download" style="margin-right: 4px" /> 导出
            </ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 列表 -->
    <ElCard shadow="never">
      <ElTable
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <ElTableColumn
          label="序号"
          align="center"
          type="index"
          :index="indexMethod"
          min-width="80"
        />
        <ElTableColumn
          label="委托单位"
          align="center"
          prop="clientName"
          min-width="120"
        />
        <ElTableColumn
          label="收样日期"
          align="center"
          prop="receiveDate"
          min-width="120"
        />
        <ElTableColumn
          label="样品编号"
          align="center"
          prop="sampleNo"
          min-width="120"
        />
        <ElTableColumn
          label="样品名称"
          align="center"
          prop="sampleName"
          min-width="120"
        />
        <ElTableColumn
          label="采样地点"
          align="center"
          prop="samplingLocation"
          min-width="120"
        />
        <!-- 动态指标列 -->
        <template v-for="indicator in selectedIndicators" :key="indicator">
          <ElTableColumn
            :label="getIndicatorLabel(indicator)"
            align="center"
            :sortable="!['visibleObject', 'odourTaste'].includes(indicator)"
            :sort-orders="['ascending', 'descending', null]"
            :prop="indicator"
            min-width="120"
          >
            <template #default="scope">
              {{ getIndicatorValue(scope.row, indicator) }}
            </template>
          </ElTableColumn>
        </template>
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="150"
        />
        <ElTableColumn
          label="操作"
          align="center"
          fixed="right"
          min-width="280"
        >
          <template #default="scope">
            <ElSpace>
              <ElButton
                link
                type="primary"
                @click="openDetailDrawer(scope.row.id)"
              >
                详情
              </ElButton>
              <ElButton
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
              >
                编辑
              </ElButton>
              <ElButton link type="danger" @click="handleDelete(scope.row.id)">
                删除
              </ElButton>
              <ElButton
                link
                type="success"
                @click="handleGenerateReport(scope.row)"
                :loading="reportLoading[scope.row.id]"
              >
                生成报告
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <ElPagination
          :total="total"
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </ElCard>

    <!-- 表单弹窗：添加/修改 -->
    <WaterSampleTestSummaryForm ref="formRef" @success="getList" />
    <!-- 导入弹窗 -->
    <WaterSampleTestSummaryImport ref="importRef" @success="getList" />
    <!-- 详情抽屉 -->
    <WaterSampleTestDetailDrawer
      :visible="detailDrawerVisible"
      :row-id="selectedRowId"
      @close="detailDrawerVisible = false"
    />
  </div>
</template>
