<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchExportCycleReport,
  createCycleReport,
  exportCycleReport,
  getCycleReportDetail,
  getCycleReportPage,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import DrillDownDetailDialog from '../components/DrillDownDetailDialog.vue';
import FilterRuleDialog from '../components/FilterRuleDialog.vue';
import {
  dataList,
  detailFields,
  getGenerateStatusTagType,
  getReportCycleTagType,
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
  activeReportCycle: {
    type: String,
    default: '',
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
const formData = ref();

// 钻取弹窗引用
const drillDownDialogRef = ref(null);
const filterRuleDialogRef = ref(null);

// 处理字段钻取 - 支持卡片钻取和表格字段钻取
const handleFieldDrill = (type, row) => {
  if (!drillDownDialogRef.value) return;

  // 表格字段钻取类型映射
  const tableDrillTypeMap = {
    activity: 'tableActivityCount',
    joinUser: 'tableJoinUserCount',
    lottery: 'tableLotteryCount',
    winning: 'tableWinningRate',
    couponSend: 'tableCouponSendCount',
    couponVerify: 'tableVerifyRate',
    cardOrder: 'tableCardOrderCount',
    revenue: 'tableRevenue',
    exchangeCount: 'tableExchangeCount',
    totalStock: 'tableTotalStock',
    warnStockCount: 'tableWarnStockCount',
  };

  // 判断是否为表格字段钻取类型
  const drillType = tableDrillTypeMap[type];
  if (drillType) {
    // 表格字段钻取 - 传递 reportId
    drillDownDialogRef.value.open({
      drillType,
      drillValue: String(row.id), // reportId
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
      reportId: row.id,
    });
  } else {
    // 其他类型钻取（保持原有逻辑）
    drillDownDialogRef.value.open({
      drillType: type,
      drillValue: '',
      drillName: row.reportCycle,
      reportCycle: row.reportCycle,
    });
  }
};

// 处理筛选规则查看
const handleFilterRuleView = (row) => {
  if (!filterRuleDialogRef.value) return;
  filterRuleDialogRef.value.open(row.filterRule);
};

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
    const obj = formApi.form.values;
    const loadingInstance = ElLoading.service({
      text: '正在生成报表...',
    });
    try {
      // 调用生成报表API
      const params = {
        reportCycle: obj.reportCycle,
        statStartTime: obj.statTimeRange?.[0],
        statEndTime: obj.statTimeRange?.[1],
        filterRule: obj.filterRule,
        tenantId: 1,
      };
      const response = await createCycleReport(params);
      if (response) {
        ElMessage.success('报表生成成功');
        handleRefresh();
        formDrawerApi.close();
      } else {
        ElMessage.error(response?.msg || '报表生成失败');
      }
    } catch (error) {
      console.error('生成报表失败:', error);
      ElMessage.error('报表生成失败');
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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    // 调用导出API
    const data = await exportCycleReport();
    downloadFileFromBlobPart({
      fileName: textObj.excelAllName,
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    // 如果API调用失败，使用本地导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 生成报表 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑报表 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.reportCycle]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.reportCycle]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 批量删除功能已屏蔽
// async function handleDeleteBatch() {
//   await confirm($t('确定删除这些数据吗？'));
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deletingBatch'),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter(
//       (v) => !checkedIds.value.includes(v.id),
//     );
//     checkedIds.value = [];
//     ElMessage.success($t('删除成功'));
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

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

// 当前激活的筛选标签
const activeFilterTags = reactive({
  generateStatus: '',
});

// 移除筛选标签
const removeFilterTag = (type) => {
  if (type === 'generateStatus') {
    activeFilterTags.generateStatus = '';
    delete dataObj.searchParams.generateStatus;
    handleRefresh();
  }
};

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取 - 调用API
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    // 遍历所有搜索表单字段，确保有值的字段都传入请求参数
    const searchFields = [
      'reportCycle',
      'generateStatus',
      'operator',
      'filterRule',
      // 整数字段 - 直接传递
      'activityCount',
      'joinUserCount',
      'lotteryCount',
      'couponSendCount',
      'cardOrderCount',
      'exchangeCount',
      'totalStock',
      'warnStockCount',
    ];

    // 需要保留小数精度的字段（设置了 precision: 2）
    const decimalFields = ['revenue'];

    // 处理普通字段和整数字段
    searchFields.forEach((field) => {
      const value = dataObj.searchParams[field];
      if (value !== undefined && value !== null && value !== '') {
        params[field] = value;
      }
    });

    // 处理需要保留小数精度的字段（如 revenue）
    decimalFields.forEach((field) => {
      const value = dataObj.searchParams[field];
      if (value !== undefined && value !== null && value !== '') {
        // 使用 parseFloat 和 toFixed 确保保留两位小数精度
        // 例如：8 → 8.00, 7.5 → 7.50, 8.00 → 8.00
        params[field] = Number.parseFloat(Number(value).toFixed(2));
      }
    });

    // 处理统计开始时间 - RangePicker 返回数组格式 [start, end]，直接传递给后端（参照积分活动开始时间的处理方式）
    if (
      dataObj.searchParams.statStartTime &&
      Array.isArray(dataObj.searchParams.statStartTime) &&
      dataObj.searchParams.statStartTime.length === 2
    ) {
      params.statStartTime = dataObj.searchParams.statStartTime;
    }

    // 处理统计结束时间 - RangePicker 返回数组格式 [start, end]，直接传递给后端（参照积分活动结束时间的处理方式）
    if (
      dataObj.searchParams.statEndTime &&
      Array.isArray(dataObj.searchParams.statEndTime) &&
      dataObj.searchParams.statEndTime.length === 2
    ) {
      params.statEndTime = dataObj.searchParams.statEndTime;
    }

    // 处理生成时间 - RangePicker 返回数组格式 [start, end]，直接传递给后端
    if (
      dataObj.searchParams.generateTime &&
      Array.isArray(dataObj.searchParams.generateTime) &&
      dataObj.searchParams.generateTime.length === 2
    ) {
      params.generateTime = dataObj.searchParams.generateTime;
    }

    // 调用API
    const response = await getCycleReportPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      dataObj.apilist = list || [];
    } else {
      // API调用失败，使用本地数据
      useLocalData(page);
    }
  } catch (error) {
    console.error('获取表格数据失败:', error);
    // API调用失败，使用本地数据
    useLocalData(page);
  }

  return dataObj;
};

// 使用本地数据
const useLocalData = (page) => {
  // 根据searchParams筛选数据
  const filteredList = dataList().filter((v) => {
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value !== undefined && value !== null && value !== '') {
        if (
          key === 'statStartTime' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // 统计开始时间范围筛选（RangePicker 返回数组）
          searchMatch =
            searchMatch && v.statTime >= value[0] && v.statTime <= value[1];
        } else if (
          key === 'statEndTime' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // 统计结束时间范围筛选（RangePicker 返回数组）
          searchMatch =
            searchMatch && v.statTime >= value[0] && v.statTime <= value[1];
        } else if (
          key === 'generateTime' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          // 生成时间范围筛选（RangePicker 返回数组）
          searchMatch =
            searchMatch &&
            v.generateTime >= value[0] &&
            v.generateTime <= value[1];
        } else if (key.endsWith('Min')) {
          const field = key.replace('Min', '');
          searchMatch = searchMatch && v[field] >= value;
        } else if (key.endsWith('Max')) {
          const field = key.replace('Max', '');
          searchMatch = searchMatch && v[field] <= value;
        } else {
          searchMatch =
            typeof value === 'string'
              ? searchMatch && v[key]?.toString().includes(value)
              : searchMatch && v[key] === value;
        }
      }
    });
    return searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  dataObj.apilist = filteredList;
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

const handleOpenDetail = async (row) => {
  const loadingInstance = ElLoading.service({
    text: '正在加载详情...',
  });
  try {
    // 调用详情API
    const response = await getCycleReportDetail({ id: row.id });
    if (response && response.code === 200 && response.data) {
      dataObj.detailObj = response.data;
    } else {
      // API调用失败，使用本地数据
      dataObj.detailObj = row;
    }
    detailDrawerRef.value.open();
  } catch (error) {
    console.error('获取详情失败:', error);
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  } finally {
    loadingInstance.close();
  }
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 钻取筛选处理 ====================

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  // 清空之前的筛选
  dataObj.searchParams = {};
  // 清空筛选标签
  activeFilterTags.generateStatus = '';

  switch (type) {
    case 'bar': {
      // 柱状图钻取 - 根据活动类型筛选
      if (value) {
        console.log('钻取：活动类型', value);
      }
      break;
    }
    case 'card': {
      // 卡片钻取 - 根据卡片类型筛选
      switch (value) {
        case 'activityCount': {
          console.log('钻取：活动数卡片');
          break;
        }
        case 'cardOrderCount': {
          console.log('钻取：卡种订单量卡片');
          break;
        }
        case 'couponSendCount': {
          console.log('钻取：优惠券发放量卡片');
          break;
        }
        case 'couponVerifyRate': {
          console.log('钻取：核销率卡片');
          break;
        }
        case 'exchangeCount': {
          console.log('钻取：兑换量卡片');
          break;
        }
        case 'joinUserCount': {
          console.log('钻取：参与用户数卡片');
          break;
        }
        case 'lotteryCount': {
          console.log('钻取：抽奖量卡片');
          break;
        }
        case 'revenue': {
          console.log('钻取：营收卡片');
          break;
        }
        case 'totalStock': {
          console.log('钻取：总库存卡片');
          break;
        }
        case 'warnStockCount': {
          console.log('钻取：预警库存数卡片');
          break;
        }
        case 'winningRate': {
          console.log('钻取：中奖率卡片');
          break;
        }
        // No default
      }
      break;
    }
    case 'line': {
      // 折线图钻取 - 根据日期筛选
      if (value) {
        // 使用数组格式传递统计时间，与搜索表单保持一致（参照积分活动 RangePicker 的处理方式）
        dataObj.searchParams.statStartTime = [
          `${value} 00:00:00`,
          `${value} 23:59:59`,
        ];
        dataObj.searchParams.statEndTime = [
          `${value} 00:00:00`,
          `${value} 23:59:59`,
        ];
        console.log('钻取：日期', value);
      }
      break;
    }
    case 'pie': {
      // 饼图钻取 - 根据规则类型筛选
      if (value) {
        console.log('钻取：规则类型', value);
      }
      break;
    }
    case 'reportCycle': {
      // 报表周期标签点击 - 根据报表周期筛选
      if (value) {
        dataObj.searchParams.reportCycle = value;
        console.log('钻取：报表周期', value);
      } else {
        // 取消筛选
        delete dataObj.searchParams.reportCycle;
        console.log('取消报表周期筛选');
      }
      break;
    }
  }

  // 刷新表格
  gridApi.query();
};

// 导出单条报表
const handleExportRow = async (row) => {
  try {
    // 调用批量导出API，传入当前行ID（参照兑换订单批量导出逻辑）
    const data = await batchExportCycleReport({ ids: [row.id] });
    downloadFileFromBlobPart({
      fileName: `${row.reportCycle}_营销运营报表.xlsx`,
      source: data,
    });
    ElMessage.success(`导出成功：${row.reportCycle}`);
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请稍后重试');
  }
};

// 监听 activeReportCycle prop 变化
watch(
  () => props.activeReportCycle,
  (newVal, oldVal) => {
    // 只有在值真正改变时才更新，避免F5刷新时触发
    if (newVal !== oldVal) {
      if (newVal) {
        dataObj.searchParams.reportCycle = newVal;
      } else {
        delete dataObj.searchParams.reportCycle;
      }
      // 刷新表格
      gridApi.query();
    }
  },
  { immediate: false },
);

defineExpose({
  handleStatsFilter,
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.reportCycle || '营销运营报表'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
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
          <!-- 生成状态筛选标签 -->
          <ElTag
            v-if="activeFilterTags.generateStatus"
            type="primary"
            closable
            @close="removeFilterTag('generateStatus')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            生成状态：{{ activeFilterTags.generateStatus }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="生成报表"
            icon-name="Plus"
            @click="handleCreate"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <!-- 批量删除按钮已屏蔽 -->
          <!--
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          -->
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <!-- 报表周期 - 点击筛选 -->
      <template #reportCycle="{ row }">
        <ElTag
          :type="getReportCycleTagType(row.reportCycle)"
          style="cursor: pointer"
          @click="
            dataObj.searchParams.reportCycle = row.reportCycle;
            handleRefresh();
          "
        >
          {{ row.reportCycle }}
        </ElTag>
      </template>

      <!-- 活动数 - 点击钻取活动明细 -->
      <template #activityCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('activity', row)"
        >
          {{ row.activityCount }}
        </span>
      </template>

      <!-- 参与用户数 - 点击钻取用户明细 -->
      <template #joinUserCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('joinUser', row)"
        >
          {{ row.joinUserCount }}
        </span>
      </template>

      <!-- 抽奖量 - 点击钻取抽奖明细 -->
      <template #lotteryCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('lottery', row)"
        >
          {{ row.lotteryCount }}
        </span>
      </template>

      <!-- 中奖率 - 点击钻取中奖明细 -->
      <template #winningRate="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('winning', row)"
        >
          {{ row.winningRate }}
        </span>
      </template>

      <!-- 优惠券发放量 - 点击钻取优惠券发放明细 -->
      <template #couponSendCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('couponSend', row)"
        >
          {{ row.couponSendCount }}
        </span>
      </template>

      <!-- 核销率 - 点击钻取优惠券核销明细 -->
      <template #couponVerifyRate="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('couponVerify', row)"
        >
          {{ row.couponVerifyRate }}
        </span>
      </template>

      <!-- 卡种订单量 - 点击钻取卡种订单明细 -->
      <template #cardOrderCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('cardOrder', row)"
        >
          {{ row.cardOrderCount }}
        </span>
      </template>

      <!-- 营收 - 点击钻取营收明细 -->
      <template #revenue="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('revenue', row)"
        >
          ¥{{ row.revenue?.toFixed(2) }}
        </span>
      </template>

      <!-- 兑换量 - 点击钻取积分兑换明细 -->
      <template #exchangeCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('exchangeCount', row)"
        >
          {{ row.exchangeCount }}
        </span>
      </template>

      <!-- 总库存 - 点击钻取卡种库存总览 -->
      <template #totalStock="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('totalStock', row)"
        >
          {{ row.totalStock }}
        </span>
      </template>

      <!-- 预警库存数 - 点击钻取预警卡种库存明细 -->
      <template #warnStockCount="{ row }">
        <span
          style="color: #f56c6c; cursor: pointer"
          @click="handleFieldDrill('warnStockCount', row)"
        >
          {{ row.warnStockCount }}
        </span>
      </template>

      <!-- 生成状态 - 点击筛选同生成状态 -->
      <template #generateStatus="{ row }">
        <ElTag
          :type="getGenerateStatusTagType(row.generateStatus)"
          style="cursor: pointer"
          @click="
            dataObj.searchParams.generateStatus = row.generateStatus;
            activeFilterTags.generateStatus = row.generateStatus;
            handleRefresh();
          "
        >
          {{ row.generateStatus }}
        </ElTag>
      </template>

      <!-- 生成时间 - 格式化时间戳 -->
      <template #generateTime="{ row }">
        {{
          row.generateTime
            ? formatDate(
                new Date(Number(row.generateTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}
      </template>

      <!-- 操作人 - 点击跳转操作人员详情 -->
      <template #operator="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleFieldDrill('operator', row)"
        >
          {{ row.operator }}
        </span>
      </template>

      <!-- 筛选规则 - 点击查看详情弹窗 -->
      <template #filterRule="{ row }">
        <span
          class="filter-rule-text"
          style="color: #409eff; cursor: pointer"
          @click="handleFilterRuleView(row)"
        >
          {{ row.filterRule }}
        </span>
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
          <span> 本页统计：活动数: 25; 参与用户: 1200; 已生成: 6 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <!-- 钻取明细弹窗 -->
    <DrillDownDetailDialog ref="drillDownDialogRef" />
    <!-- 筛选规则详情弹窗 -->
    <FilterRuleDialog ref="filterRuleDialogRef" />
  </div>
</template>

<style scoped>
.filter-rule-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
