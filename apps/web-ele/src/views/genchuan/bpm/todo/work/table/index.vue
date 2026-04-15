<!-- dashboard/todo/work/table/index.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';

// BPM 任务接口
import {
  getTaskTodoPage,
  getTaskDonePage,
  getTaskManagerPage,
} from '#/api/bpm/task';
import { getProcessInstanceMyPage } from '#/api/bpm/processInstance';

import { textObj, useGridColumns } from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const router = useRouter();

// 状态
const activeName = ref('待处理');
const searchParams = ref({});
const checkedIds = ref([]);

// 分页及数据容器（仿充电桩模块写法）
const dataObj = reactive({
  list: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// ==================== 表格数据获取 ====================
const getTableData = async ({ page }) => {
  console.log('🚀 获取工单数据，模块：', activeName.value, 'page:', page);
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  try {
    let res;
    switch (activeName.value) {
      case '待处理':
        res = await getTaskTodoPage(params);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          workorderNo: item.name || `TASK-${item.id}`,
          workorderType: item.processInstance?.processDefinition?.categoryName || '通用',
          source: '系统',
          emergencyDegree: item.processInstance?.variables?.emergencyDegree || '中',
          location: item.processInstance?.variables?.location || '-',
          submitTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          submitBy: item.processInstance?.startUser?.nickname || item.ownerUser?.nickname || '-',
          status: '待处理',
          currentProgress: '0%',
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '处理中':
        // 已办任务中包含处理中和已完成，需要过滤 status === 1 的
        res = await getTaskDonePage(params);
        const processingList = (res.list || []).filter(item => item.status === 1);
        dataObj.total = processingList.length;
        dataObj.list = processingList.map(item => ({
          id: item.id,
          workorderNo: item.name || `TASK-${item.id}`,
          workorderType: item.processInstance?.processDefinition?.categoryName || '通用',
          source: '系统',
          emergencyDegree: item.processInstance?.variables?.emergencyDegree || '中',
          location: item.processInstance?.variables?.location || '-',
          submitTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          submitBy: item.processInstance?.startUser?.nickname || '-',
          status: '处理中',
          currentProgress: '50%',
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '待评价':
        // 已完成任务（status === 2），待评价可以理解为已完成的流程实例
        res = await getTaskManagerPage(params);
        const completedList = (res.list || []).filter(item => item.status === 2);
        dataObj.total = completedList.length;
        dataObj.list = completedList.map(item => ({
          id: item.id,
          workorderNo: item.name || `TASK-${item.id}`,
          workorderType: item.processInstance?.processDefinition?.categoryName || '通用',
          source: '系统',
          emergencyDegree: item.processInstance?.variables?.emergencyDegree || '中',
          location: item.processInstance?.variables?.location || '-',
          submitTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          submitBy: item.processInstance?.startUser?.nickname || '-',
          status: '待评价',
          currentProgress: '100%',
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '已完成':
        // 已完成的任务（包括已办中的已完成和管理员任务中的已完成）
        res = await getTaskManagerPage(params);
        const finishedList = (res.list || []).filter(item => item.status === 2);
        dataObj.total = finishedList.length;
        dataObj.list = finishedList.map(item => ({
          id: item.id,
          workorderNo: item.name || `TASK-${item.id}`,
          workorderType: item.processInstance?.processDefinition?.categoryName || '通用',
          source: '系统',
          emergencyDegree: item.processInstance?.variables?.emergencyDegree || '中',
          location: item.processInstance?.variables?.location || '-',
          submitTime: item.createTime,
          deadline: item.processInstance?.variables?.deadline || '-',
          submitBy: item.processInstance?.startUser?.nickname || '-',
          status: '已完成',
          currentProgress: '100%',
          processInstanceId: item.processInstanceId,
        }));
        break;
      default:
        dataObj.list = [];
        dataObj.total = 0;
    }
    return dataObj;
  } catch (error) {
    console.error('获取工单数据失败', error);
    ElMessage.error('获取数据失败：' + (error.message || '未知错误'));
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

// ==================== 表格配置 ====================
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, zoom: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxChange: ({ records }) => { checkedIds.value = records.map(r => r.id); },
    checkboxAll: ({ records }) => { checkedIds.value = records.map(r => r.id); },
  },
});

// ==================== 搜索表单（简化为工单编号/名称搜索） ====================
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = values;
    dataObj.currentPage = 1;
    drawerApi.close();
    gridApi.query();
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'name',
      label: '工单名称',
      component: 'Input',
      componentProps: { placeholder: '请输入工单名称' },
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      searchParams.value = {};
      dataObj.currentPage = 1;
      gridApi.query();
    },
  },
});

// ==================== 抽屉（搜索抽屉） ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => drawerApi.close(),
});

// ==================== 操作函数 ====================
// 刷新表格
function handleRefresh() {
  gridApi.query();
}

// 导出当前列表数据
function handleExport() {
  exportToExcel(dataObj.list, textObj.excelName, textObj.excelAllName);
}

// 查看详情：跳转到流程实例详情页
function handleOpenDetail(row) {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: { id: row.processInstanceId },
  });
}

// 筛选工具栏
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

// 标签页切换
const handleTabChange = () => {
  queryFormApi.resetForm();
  searchParams.value = {};
  dataObj.currentPage = 1;
  gridApi.query();
};

const tabsData = ref([
  { label: '待处理' },
  { label: '处理中' },
  { label: '待评价' },
  { label: '已完成' },
]);

// 动态计算标签页数量（可选，从接口获取总数会更准确，这里简化）
const createLabel = (item) => {
  // 可以调用接口获取各状态数量，但为了简单，先不显示数量
  return `${item.label}`;
};

// 移除原有的增删改操作，仅保留查看
const handleDeleteBatch = () => {
  ElMessage.warning('BPM 工单不支持批量删除');
};
const handleClaim = () => {
  ElMessage.warning('BPM 工单认领请通过流程审批操作');
};
const handleProcess = () => {
  ElMessage.warning('BPM 工单处理请通过流程审批操作');
};
const handleComplete = () => {
  ElMessage.warning('BPM 工单完成请通过流程审批操作');
};
const handleEvaluate = () => {
  ElMessage.warning('BPM 工单评价请通过流程审批操作');
};

onMounted(() => {
  console.log('工单模块已挂载，加载数据...');
  gridApi.query();
});
</script>

<template>
  <div class="park-lot-table-new">
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleTabChange"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 工单编号列（点击跳转详情） -->
      <template #workorderNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.workorderNo }}
        </el-text>
      </template>

      <!-- 紧急程度标签 -->
      <template #emergencyDegree="{ row }">
        <el-tag
          :type="row.emergencyDegree === '紧急' ? 'danger' :
                 row.emergencyDegree === '高' ? 'warning' :
                 row.emergencyDegree === '中' ? 'primary' : 'info'"
          size="small"
        >
          {{ row.emergencyDegree }}
        </el-tag>
      </template>

      <!-- 进度条 -->
      <template #progress="{ row }">
        <div v-if="row.currentProgress && row.currentProgress !== '0%'">
          <el-progress
            :percentage="parseInt(row.currentProgress)"
            :show-text="false"
            :stroke-width="6"
          />
          <span style="font-size: 12px;">{{ row.currentProgress }}</span>
        </div>
        <span v-else>{{ row.currentProgress || '-' }}</span>
      </template>

      <!-- 工单状态标签 -->
      <template #status="{ row }">
        <el-tag
          :type="row.status === '待处理' ? 'info' :
                 row.status === '处理中' ? 'primary' :
                 row.status === '待评价' ? 'warning' :
                 row.status === '已完成' ? 'success' : 'danger'"
          size="small"
        >
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 操作列（仅保留查看详情） -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.park-lot-table-new {
  width: 100%;
}
.tabel-tabs {
  margin-bottom: 16px;
}
.common-toolbar-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.table-toolbar-tools {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>
