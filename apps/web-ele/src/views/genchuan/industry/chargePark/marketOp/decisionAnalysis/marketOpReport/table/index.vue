<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import {
  exportMarketOpReport,
  getMarketOpReportDetail,
  getMarketOpReportPage,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';
import ExportReportDialog from '../components/ExportReportDialog.vue';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import {
  dataList,
  detailFields,
  getMarketOpReportTypeLabel,
  getMarketOpReportTypeTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);
const exportDialogRef = ref(null);
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    const loadingInstance = ElLoading.service({
      text: formData.value?.id ? '保存中...' : '新增中...',
    });

    try {
      // 实际项目中应该调用API
      // if (formData.value?.id) {
      //   await updateMarketOpReport({ ...values, id: formData.value.id });
      //   ElMessage.success('编辑成功');
      // } else {
      //   await createMarketOpReport(values);
      //   ElMessage.success('新增成功');
      // }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  // 清除快捷筛选
  filterType.value = '';
  filterTimeScale.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportMarketOpReport();
    exportToExcel(data, textObj.excelName, textObj.excelAllName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
    // 使用静态数据导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 创建 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除这条数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    // 实际项目中应该调用删除API
    // await deleteMarketOpReport({ id: row.id });
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterType = ref('');
const filterTimeScale = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      timeScale: filterTimeScale.value || dataObj.searchParams.timeScale,
      period: dataObj.searchParams.period,
      filterConditions: dataObj.searchParams.filterConditions,
      statisticianName: dataObj.searchParams.statisticianName,
    };

    const response = await getMarketOpReportPage(params);
    if (response && response.code === 200 && response.data) {
      const { list, total } = response.data;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      return dataObj;
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据:', error);

    // 根据searchParams和快捷筛选变量筛选静态数据
    const filteredList = dataObj.apilist.filter((v) => {
      let searchMatch = true;
      Object.keys(dataObj.searchParams).forEach((key) => {
        const value = dataObj.searchParams[key];
        if (value && key !== 'createTime') {
          searchMatch =
            typeof value === 'string'
              ? searchMatch && v[key]?.toString().includes(value)
              : searchMatch && v[key] === value;
        }
      });
      // 应用快捷筛选变量
      if (filterType.value && v.type !== filterType.value) {
        searchMatch = false;
      }
      if (filterTimeScale.value && v.timeScale !== filterTimeScale.value) {
        searchMatch = false;
      }
      return searchMatch;
    });

    dataObj.total = filteredList.length;
    dataObj.list = filteredList.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  }
  return dataObj;
};

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// ==================== 钻取筛选处理 ====================

// 处理报表类型点击
const handleFilterByType = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理时间尺度点击
const handleFilterByTimeScale = (timeScale) => {
  filterTimeScale.value = filterTimeScale.value === timeScale ? '' : timeScale;
  gridApi.query();
};

// 取消报表类型筛选
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

// 取消时间尺度筛选
const handleCancelTimeScaleFilter = () => {
  filterTimeScale.value = '';
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  // 清空之前的筛选
  dataObj.searchParams = {};
  filterType.value = '';
  filterTimeScale.value = '';

  switch (type) {
    case 'indicator':
      // 营销核心指标卡片点击 - 根据指标类型筛选
      if (value === 'joinRate') {
        // 活动参与率 - 筛选包含活动数据的报表
        console.log('钻取：筛选活动参与率相关报表');
        ElMessage.info('已筛选活动参与率相关报表');
      } else if (value === 'couponRate') {
        // 优惠券核销率 - 筛选包含优惠券数据的报表
        console.log('钻取：筛选优惠券核销率相关报表');
        ElMessage.info('已筛选优惠券核销率相关报表');
      } else if (value === 'cardSales') {
        // 卡种销量 - 筛选包含卡种销售数据的报表
        console.log('钻取：筛选卡种销量相关报表');
        ElMessage.info('已筛选卡种销量相关报表');
      }
      break;
    case 'activity':
      // 活动效果分布柱状图点击 - 筛选对应活动的报表
      if (value) {
        console.log('钻取：筛选活动', value);
        ElMessage.info(`已筛选活动：${value}`);
        // 可以根据活动ID筛选相关报表
        dataObj.searchParams.filterConditions = value;
      }
      break;
    case 'trendDate':
      // 营销运营趋势折线图点击 - 筛选对应日期的报表
      if (value) {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [date.getTime(), date.getTime() + 86400000];
        console.log('钻取：筛选日期', value);
        ElMessage.info(`已筛选日期：${value}`);
      }
      break;
    // 保留原有的筛选类型以兼容其他调用
    case 'card':
      if (value === 'todayReport') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [today.getTime(), today.getTime() + 86400000];
        console.log('钻取：筛选今日生成的报表');
      } else if (value === 'monthReport') {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        dataObj.searchParams.createTime = [startOfMonth.getTime(), endOfMonth.getTime()];
        console.log('钻取：筛选本月生成的报表');
      }
      break;
    case 'type':
      if (value !== undefined && value !== null) {
        filterType.value = value;
        console.log('钻取：筛选报表类型', value);
      }
      break;
    case 'date':
      if (value) {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        dataObj.searchParams.createTime = [date.getTime(), date.getTime() + 86400000];
        console.log('钻取：筛选日期', value);
      }
      break;
  }

  // 刷新表格
  gridApi.query();
};

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开报表详情弹窗 */
const handleOpenReportDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开筛选条件明细弹窗 */
const handleOpenFilterConditionsDetail = (row) => {
  ElMessage.info(`查看筛选条件明细: ${row.filterConditions}`);
  // TODO: 实现筛选条件明细弹窗
};

/** 打开操作人员详情弹窗 */
const handleOpenStatisticianDetail = (row) => {
  if (row.statisticianId) {
    ElMessage.info(`查看操作人员详情: ${row.statisticianName}`);
    // TODO: 实现操作人员详情弹窗
  }
};

/** 打开导出报表对话框 */
const handleExportRow = (row) => {
  exportDialogRef.value?.open(row);
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.name || '营销运营报表'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!-- 导出报表对话框 -->
    <ExportReportDialog ref="exportDialogRef" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 快捷筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 报表类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            报表类型：{{ getMarketOpReportTypeLabel(filterType) }}
          </ElTag>

        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
<!--          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />-->
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
<!--          <IconButton-->
<!--            content="批量删除"-->
<!--            icon-name="delete"-->
<!--            color="#F56C6C"-->
<!--            :disabled="isEmpty(checkedIds)"-->
<!--            @click="handleDeleteBatch"-->
<!--          />-->
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
              :content="props.showStats ? '隐藏统计' : '显示统计'"
              :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
              @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <!-- 报表名称 - 点击跳转详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenReportDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 报表类型 - 点击筛选同类型 -->
      <template #typeName="{ row }">
        <ElTag
          :type="getMarketOpReportTypeTagType(row.type)"
          style="cursor: pointer"
          @click="handleFilterByType(row.type)"
        >
          {{ row.typeName }}
        </ElTag>
      </template>

      <!-- 生成时间 - 格式化显示 -->
      <template #createTime="{ row }">
        <span>{{ row.createTime ? formatDate(new Date(Number(row.createTime)), 'YYYY-MM-DD HH:mm:ss') : '' }}</span>
      </template>
      <!-- 筛选条件 - 点击查看明细 -->
      <template #filterConditions="{ row }">
        <el-text
          v-if="row.filterConditions"
          @click="handleOpenFilterConditionsDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.filterConditions }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 统计人 - 点击跳转操作人员详情 -->
      <template #statisticianName="{ row }">
        <el-text
          v-if="row.statisticianName"
          @click="handleOpenStatisticianDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.statisticianName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：报表数量: {{ dataObj.list.length }}; 日报:
            {{ dataObj.list.filter((v) => v.type === '0').length }}; 周报:
            {{ dataObj.list.filter((v) => v.type === '1').length }}; 月报:
            {{ dataObj.list.filter((v) => v.type === '2').length }}; 季报:
            {{ dataObj.list.filter((v) => v.type === '3').length }}; 半年报:
            {{ dataObj.list.filter((v) => v.type === '4').length }}; 年报:
            {{ dataObj.list.filter((v) => v.type === '5').length }}; 自定义报表:
            {{ dataObj.list.filter((v) => v.type === '6').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
