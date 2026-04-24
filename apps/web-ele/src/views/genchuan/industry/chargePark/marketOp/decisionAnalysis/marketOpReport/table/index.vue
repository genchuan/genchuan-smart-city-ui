<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCycleReport,
  exportCycleReport,
  getCycleReportDetail,
  getCycleReportPage,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

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
      };
      const response = await createCycleReport(params);
      if (response && response.code === 200) {
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
  const loadingInstance = ElLoading.service({
    text: '正在导出数据...',
  });
  try {
    // 调用导出API
    await exportCycleReport();
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    // 如果API调用失败，使用本地导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  } finally {
    loadingInstance.close();
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
      reportCycle: dataObj.searchParams.reportCycle,
      generateStatus: dataObj.searchParams.generateStatus,
      operator: dataObj.searchParams.operator,
      filterRule: dataObj.searchParams.filterRule,
    };

    // 处理统计时段
    if (
      dataObj.searchParams.statTimeRange &&
      dataObj.searchParams.statTimeRange.length === 2
    ) {
      params.statStartTime = dataObj.searchParams.statTimeRange[0];
      params.statEndTime = dataObj.searchParams.statTimeRange[1];
    }

    // 处理生成时间
    if (
      dataObj.searchParams.generateTimeRange &&
      dataObj.searchParams.generateTimeRange.length === 2
    ) {
      params.generateStartTime = dataObj.searchParams.generateTimeRange[0];
      params.generateEndTime = dataObj.searchParams.generateTimeRange[1];
    }

    // 处理数值范围筛选
    const rangeFields = [
      'activityCount',
      'joinUserCount',
      'lotteryCount',
      'couponSendCount',
      'cardOrderCount',
      'revenue',
      'exchangeCount',
      'totalStock',
      'warnStockCount',
    ];
    rangeFields.forEach((field) => {
      const minKey = `${field}Min`;
      const maxKey = `${field}Max`;
      if (
        dataObj.searchParams[minKey] !== undefined &&
        dataObj.searchParams[minKey] !== null
      ) {
        params[minKey] = dataObj.searchParams[minKey];
      }
      if (
        dataObj.searchParams[maxKey] !== undefined &&
        dataObj.searchParams[maxKey] !== null
      ) {
        params[maxKey] = dataObj.searchParams[maxKey];
      }
    });

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
          key === 'statTimeRange' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          searchMatch =
            searchMatch && v.statTime.includes(value[0].split(' ')[0]);
        } else if (
          key === 'generateTimeRange' &&
          Array.isArray(value) &&
          value.length === 2
        ) {
          searchMatch =
            searchMatch && v.generateTime.includes(value[0].split(' ')[0]);
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

  switch (type) {
    case 'bar': {
      // 柱状图钻取 - 根据活动类型筛选
      if (value) {
        console.log('钻取：活动类型', value);
        ElMessage.info(`已筛选活动类型：${value}`);
      }
      break;
    }
    case 'card': {
      // 卡片钻取 - 根据卡片类型筛选
      switch (value) {
        case 'activityCount': {
          console.log('钻取：活动数卡片');
          ElMessage.info('已筛选活动数相关报表');

          break;
        }
        case 'cardOrderCount': {
          console.log('钻取：卡种订单量卡片');
          ElMessage.info('已筛选卡种订单量相关报表');

          break;
        }
        case 'couponSendCount': {
          console.log('钻取：优惠券发放量卡片');
          ElMessage.info('已筛选优惠券发放量相关报表');

          break;
        }
        case 'couponVerifyRate': {
          console.log('钻取：核销率卡片');
          ElMessage.info('已筛选核销率相关报表');

          break;
        }
        case 'exchangeCount': {
          console.log('钻取：兑换量卡片');
          ElMessage.info('已筛选兑换量相关报表');

          break;
        }
        case 'joinUserCount': {
          console.log('钻取：参与用户数卡片');
          ElMessage.info('已筛选参与用户数相关报表');

          break;
        }
        case 'lotteryCount': {
          console.log('钻取：抽奖量卡片');
          ElMessage.info('已筛选抽奖量相关报表');

          break;
        }
        case 'revenue': {
          console.log('钻取：营收卡片');
          ElMessage.info('已筛选营收相关报表');

          break;
        }
        case 'totalStock': {
          console.log('钻取：总库存卡片');
          ElMessage.info('已筛选总库存相关报表');

          break;
        }
        case 'warnStockCount': {
          console.log('钻取：预警库存数卡片');
          ElMessage.info('已筛选预警库存数相关报表');

          break;
        }
        case 'winningRate': {
          console.log('钻取：中奖率卡片');
          ElMessage.info('已筛选中奖率相关报表');

          break;
        }
        // No default
      }
      break;
    }
    case 'line': {
      // 折线图钻取 - 根据日期筛选
      if (value) {
        dataObj.searchParams.statTimeRange = [
          `${value} 00:00:00`,
          `${value} 23:59:59`,
        ];
        console.log('钻取：日期', value);
        ElMessage.info(`已筛选日期：${value}`);
      }
      break;
    }
    case 'pie': {
      // 饼图钻取 - 根据规则类型筛选
      if (value) {
        console.log('钻取：规则类型', value);
        ElMessage.info(`已筛选规则类型：${value}`);
      }
      break;
    }
  }

  // 刷新表格
  gridApi.query();
};

// 导出单条报表
const handleExportRow = async (row) => {
  const loadingInstance = ElLoading.service({
    text: `正在导出报表：${row.reportCycle}...`,
  });
  try {
    // 调用导出API
    await exportCycleReport();
    ElMessage.success(`导出成功：${row.reportCycle}`);
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
};

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

      <!-- 活动数 - 点击钻取 -->
      <template #activityCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'activityCount')"
        >
          {{ row.activityCount }}
        </span>
      </template>

      <!-- 参与用户数 - 点击钻取 -->
      <template #joinUserCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'joinUserCount')"
        >
          {{ row.joinUserCount }}
        </span>
      </template>

      <!-- 抽奖量 - 点击钻取 -->
      <template #lotteryCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'lotteryCount')"
        >
          {{ row.lotteryCount }}
        </span>
      </template>

      <!-- 中奖率 - 点击钻取 -->
      <template #winningRate="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'winningRate')"
        >
          {{ row.winningRate }}
        </span>
      </template>

      <!-- 优惠券发放量 - 点击钻取 -->
      <template #couponSendCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'couponSendCount')"
        >
          {{ row.couponSendCount }}
        </span>
      </template>

      <!-- 核销率 - 点击钻取 -->
      <template #couponVerifyRate="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'couponVerifyRate')"
        >
          {{ row.couponVerifyRate }}
        </span>
      </template>

      <!-- 卡种订单量 - 点击钻取 -->
      <template #cardOrderCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'cardOrderCount')"
        >
          {{ row.cardOrderCount }}
        </span>
      </template>

      <!-- 营收 - 点击钻取 -->
      <template #revenue="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'revenue')"
        >
          ¥{{ row.revenue?.toFixed(2) }}
        </span>
      </template>

      <!-- 兑换量 - 点击钻取 -->
      <template #exchangeCount="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'exchangeCount')"
        >
          {{ row.exchangeCount }}
        </span>
      </template>

      <!-- 总库存 - 点击钻取 -->
      <template #totalStock="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="handleStatsFilter('card', 'totalStock')"
        >
          {{ row.totalStock }}
        </span>
      </template>

      <!-- 预警库存数 - 点击钻取 -->
      <template #warnStockCount="{ row }">
        <span
          style="color: #f56c6c; cursor: pointer"
          @click="handleStatsFilter('card', 'warnStockCount')"
        >
          {{ row.warnStockCount }}
        </span>
      </template>

      <!-- 生成状态 -->
      <template #generateStatus="{ row }">
        <ElTag :type="getGenerateStatusTagType(row.generateStatus)">
          {{ row.generateStatus }}
        </ElTag>
      </template>

      <!-- 操作人 - 点击筛选 -->
      <template #operator="{ row }">
        <span
          style="color: #409eff; cursor: pointer"
          @click="
            dataObj.searchParams.operator = row.operator;
            handleRefresh();
          "
        >
          {{ row.operator }}
        </span>
      </template>

      <!-- 筛选规则 - 点击查看详情 -->
      <template #filterRule="{ row }">
        <el-tooltip :content="row.filterRule" placement="top">
          <span class="filter-rule-text">{{ row.filterRule }}</span>
        </el-tooltip>
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
