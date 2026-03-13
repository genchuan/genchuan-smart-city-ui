<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import IconButton from '#/components/common/IconButton.vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

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
    labelWidth: 120,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label 和 input 在不同行，值为 vertical
  // 水平布局，label 和 input 在同一行
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
      keyField: 'archiveNo',
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

// 修改打开详情的方法，调用组件的 open 方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过 ref 调用组件的 open 方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};

// 查看全流程
const handleViewFullProcess = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open('4'); // 打开全流程追溯标签页
};

// 下载归档资料
const handleDownloadMaterial = (row) => {
  ElMessage.info('下载归档资料功能开发中');
};

// 查看检测报告
const handleViewReport = (row) => {
  ElMessage.info('查看检测报告功能开发中');
};

// 批量查看详情
const handleBatchViewDetail = () => {
  ElMessage.info('批量查看详情功能开发中');
};

// 导出归档台账
async function handleExport() {
  const fileName = `窨井盖设施处置归档台账_${new Date().toISOString().split('T')[0]}`;
  exportToExcel(dataObj.apilist, fileName, 'excel');
}

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 定义组件 ref，用于调用组件方法
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
    <Drawer title="搜索">
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
            content="刷新归档数据"
            icon-name="Refresh"
            @click="gridApi.query"
          />
          <IconButton
            content="导出归档台账"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量查看详情"
            icon-name="View"
            @click="handleBatchViewDetail"
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
      <template #archiveNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.archiveNo }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="查看全流程"
            icon-name="Time"
            @click="handleViewFullProcess(row)"
          />
          <IconButton
            content="下载归档资料"
            icon-name="Download"
            @click="handleDownloadMaterial(row)"
          />
          <IconButton
            content="查看检测报告"
            icon-name="Document"
            @click="handleViewReport(row)"
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
          <span> 全部统计：{{ dataObj.total }}条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
