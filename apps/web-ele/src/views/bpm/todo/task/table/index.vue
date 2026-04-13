<!-- dashboard/todo/task/table/index.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage } from 'element-plus';
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
  console.log('🚀 获取任务数据，模块：', activeName.value, 'page:', page);
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
          taskName: item.name,
          taskType: item.processInstance?.processDefinition?.categoryName || '通用',
          priority: item.processInstance?.variables?.emergencyDegree || '中',
          assigner: item.processInstance?.startUser?.nickname || item.ownerUser?.nickname || '-',
          deadline: item.processInstance?.variables?.deadline || '-',
          taskStatus: item.status === 0 ? '待处理' : (item.status === 1 ? '处理中' : '已完成'),
          currentProgress: item.status === 2 ? '100%' : (item.status === 1 ? '50%' : '0%'),
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '处理中':
        res = await getTaskDonePage(params);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          taskName: item.name,
          taskType: item.processInstance?.processDefinition?.categoryName || '通用',
          priority: item.processInstance?.variables?.emergencyDegree || '中',
          assigner: item.processInstance?.startUser?.nickname || '-',
          deadline: item.processInstance?.variables?.deadline || '-',
          taskStatus: item.status === 2 ? '已完成' : (item.status === 1 ? '处理中' : '待处理'),
          currentProgress: item.status === 2 ? '100%' : (item.status === 1 ? '50%' : '0%'),
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '已完成':
        // 已完成任务可以通过已办接口过滤 status=2 来实现，但接口不支持单独筛选，暂用全部任务过滤
        res = await getTaskManagerPage(params);
        const completedList = (res.list || []).filter(item => item.status === 2);
        dataObj.total = completedList.length;
        dataObj.list = completedList.map(item => ({
          id: item.id,
          taskName: item.name,
          taskType: item.processInstance?.processDefinition?.categoryName || '通用',
          priority: item.processInstance?.variables?.emergencyDegree || '中',
          assigner: item.processInstance?.startUser?.nickname || '-',
          deadline: item.processInstance?.variables?.deadline || '-',
          taskStatus: '已完成',
          currentProgress: '100%',
          processInstanceId: item.processInstanceId,
        }));
        break;
      case '我发起的':
        res = await getProcessInstanceMyPage(params);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          taskName: item.name,
          taskType: item.categoryName || '通用',
          priority: item.variables?.emergencyDegree || '中',
          assigner: item.startUser?.nickname || '-',
          deadline: item.variables?.deadline || '-',
          taskStatus: item.status === 1 ? '处理中' : (item.status === 2 ? '已完成' : '已取消'),
          currentProgress: item.status === 2 ? '100%' : (item.status === 1 ? '50%' : '0%'),
          processInstanceId: item.id,
        }));
        break;
      case '全部任务':
        res = await getTaskManagerPage(params);
        dataObj.total = res.total;
        dataObj.list = (res.list || []).map(item => ({
          id: item.id,
          taskName: item.name,
          taskType: item.processInstance?.processDefinition?.categoryName || '通用',
          priority: item.processInstance?.variables?.emergencyDegree || '中',
          assigner: item.assigneeUser?.nickname || '-',
          deadline: item.processInstance?.variables?.deadline || '-',
          taskStatus: item.status === 0 ? '待处理' : (item.status === 1 ? '处理中' : '已完成'),
          currentProgress: item.status === 2 ? '100%' : (item.status === 1 ? '50%' : '0%'),
          processInstanceId: item.processInstanceId,
        }));
        break;
      default:
        dataObj.list = [];
        dataObj.total = 0;
    }
    return dataObj;
  } catch (error) {
    console.error('获取任务数据失败', error);
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

// ==================== 搜索表单（简化为任务名称搜索） ====================
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
      label: '任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入任务名称' },
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
  { label: '已完成' },
  { label: '我发起的' },
  { label: '全部任务' },
]);

// 动态计算标签页数量（可选，从接口获取总数会更准确，这里简化）
const createLabel = (item) => {
  // 可以调用接口获取各状态数量，但为了简单，先不显示数量
  return `${item.label}`;
};

onMounted(() => {
  console.log('任务模块已挂载，加载数据...');
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

      <!-- 任务名称列（点击跳转详情） -->
      <template #taskName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.taskName }}
        </el-text>
      </template>

      <!-- 优先级标签 -->
      <template #priority="{ row }">
        <el-tag
          :type="row.priority === '紧急' ? 'danger' :
                 row.priority === '高' ? 'warning' :
                 row.priority === '中' ? 'primary' : 'info'"
          size="small"
        >
          {{ row.priority }}
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

      <!-- 任务状态标签 -->
      <template #taskStatus="{ row }">
        <el-tag
          :type="row.taskStatus === '待处理' ? 'info' :
                 row.taskStatus === '处理中' ? 'primary' :
                 row.taskStatus === '已完成' ? 'success' : 'danger'"
          size="small"
        >
          {{ row.taskStatus }}
        </el-tag>
      </template>

      <!-- 操作列（仅保留详情） -->
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
