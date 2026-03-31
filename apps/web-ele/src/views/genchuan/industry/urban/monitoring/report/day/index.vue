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
  const today = new Date().toISOString().split('T')[0];
  exportToExcel(dataObj.apilist, `窨井盖设施日报_${today}`, 'excel');
}

/** 图表切换 */
function handleChartSwitch() {
  // 图表切换逻辑
  ElMessage.info('图表切换功能待实现');
}

/** 查看隐患明细 */
function handleOpenHiddenTroubleDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
  console.log('查看隐患明细:', row);
}

/** 查看隐患发生率详情 */
function handleOpenHiddenTroubleRateDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
  console.log('查看隐患发生率详情:', row);
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
      keyField: 'roadName',
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
            content="导出日报"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="图表切换"
            icon-name="Grid"
            @click="handleChartSwitch"
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
      <template #roadName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.roadName }}
        </el-text>
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
      <template #hiddenTroubleManholeCount="{ row }">
        <el-text
          @click="handleOpenHiddenTroubleDetail(row)"
          class="common-align"
          type="warning"
        >
          {{ row.hiddenTroubleManholeCount }}
        </el-text>
      </template>
      <template #hiddenTroubleRate="{ row }">
        <el-text
          @click="handleOpenHiddenTroubleRateDetail(row)"
          class="common-align"
          :type="row.hiddenTroubleRate > 5 ? 'danger' : row.hiddenTroubleRate > 2 ? 'warning' : 'success'"
        >
          {{ row.hiddenTroubleRate }}%
        </el-text>
      </template>
      <template #highRiskAreaFlag="{ row }">
        <el-tag
          :type="row.highRiskAreaFlag === '高' ? 'danger' : row.highRiskAreaFlag === '中' ? 'warning' : 'success'"
        >
          {{ row.highRiskAreaFlag }}
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
            content="查看隐患明细"
            icon-name="List"
            @click="handleOpenHiddenTroubleDetail(row)"
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
