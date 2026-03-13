<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import IconButton from '#/components/common/IconButton.vue';

import { dataList, useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);

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
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const weekPeriod = dataObj.apilist[0]?.weekStatisticsPeriod || '2024年第25周';
  exportToExcel(dataObj.apilist, `窨井盖设施周报_${weekPeriod}`, 'excel');
}

/** 图表切换 */
function handleChartSwitch() {
  // 图表切换逻辑
  ElMessage.info('图表切换功能待实现');
}

/** 查看周度评估 */
function handleViewWeeklyEvaluation() {
  // 查看周度评估逻辑
  ElMessage.info('周度评估功能待实现');
}

/** 查看周度隐患 */
function handleOpenWeeklyHiddenTrouble(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
  console.log('查看周度隐患:', row);
}

/** 查看处置明细 */
function handleOpenDisposalDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
  console.log('查看处置明细:', row);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist.length;
  dataObj.list = dataObj.apilist
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
};

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
function onSubmit() {
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
      keyField: 'areaName',
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
  showSearchForm: false,
});

// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};
const handleClick = () => {
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件ref，用于调用组件方法
const parkDetailDrawerRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="筛选"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="刷新数据"
            icon-name="Refresh"
            @click="handleRefresh"
          />
          <IconButton
            content="导出周报"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="图表切换"
            icon-name="Grid"
            @click="handleChartSwitch"
          />
          <IconButton
            content="查看周度评估"
            icon-name="Document"
            @click="handleViewWeeklyEvaluation"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #weekTotalHiddenTroubleCount="{ row }">
        <el-text
          @click="handleOpenWeeklyHiddenTrouble(row)"
          class="common-align"
          type="warning"
        >
          {{ row.weekTotalHiddenTroubleCount }}
        </el-text>
      </template>
      <template #weekHiddenTroubleDisposalRate="{ row }">
        <el-text
          @click="handleOpenDisposalDetail(row)"
          class="common-align"
          :type="row.weekHiddenTroubleDisposalRate >= 90 ? 'success' : row.weekHiddenTroubleDisposalRate >= 70 ? 'warning' : 'danger'"
        >
          {{ row.weekHiddenTroubleDisposalRate }}%
        </el-text>
      </template>
      <template #momHiddenTroubleChangeRate="{ row }">
        <el-text
          class="common-align"
          :type="row.momHiddenTroubleChangeRate >= 0 ? 'danger' : 'success'"
        >
          {{ row.momHiddenTroubleChangeRate >= 0 ? '+' : '' }}{{ row.momHiddenTroubleChangeRate }}%
        </el-text>
      </template>
      <template #areaHiddenTroubleControlRank="{ row }">
        <el-tag
          :type="row.areaHiddenTroubleControlRank <= 3 ? 'success' : row.areaHiddenTroubleControlRank <= 6 ? 'warning' : 'danger'"
        >
          {{ row.areaHiddenTroubleControlRank }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="查看周度隐患"
            icon-name="List"
            @click="handleOpenWeeklyHiddenTrouble(row)"
          />
          <IconButton
            content="查看处置明细"
            icon-name="Document"
            @click="handleOpenDisposalDetail(row)"
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
          <span> 全部统计：10条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
