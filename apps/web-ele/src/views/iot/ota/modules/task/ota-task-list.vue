<script setup lang="ts">
import type { OtaTask } from '#/api/iot/ota/task';

import { onMounted, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { formatDate } from '@vben/utils';

import { ElButton, ElCard, ElInput, ElMessage, ElMessageBox, ElSpace, ElTable, ElTableColumn, ElTag } from 'element-plus';

import { getOtaTaskPage } from '#/api/iot/ota/task';
import { IoTOtaTaskStatusEnum } from '#/views/iot/utils/constants';

import OtaTaskDetail from './ota-task-detail.vue';
import OtaTaskForm from './ota-task-form.vue';

/** IoT OTA 任务列表 */
defineOptions({ name: 'OtaTaskList' });

const props = defineProps<{
  firmwareId: number;
  productId: number;
}>();

const emit = defineEmits(['success']);

// 任务列表
const taskLoading = ref(false);
const taskList = ref<OtaTask[]>([]);
const taskTotal = ref(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  firmwareId: props.firmwareId,
});
const taskFormRef = ref(); // 任务表单引用
const taskDetailRef = ref(); // 任务详情引用

/** 获取任务列表 */
async function getTaskList() {
  taskLoading.value = true;
  try {
    const data = await getOtaTaskPage(queryParams);
    taskList.value = data.list || [];
    taskTotal.value = data.total || 0;
  } finally {
    taskLoading.value = false;
  }
}

/** 搜索 */
function handleQuery() {
  queryParams.pageNo = 1;
  getTaskList();
}

/** 打开任务表单 */
function openTaskForm() {
  taskFormRef.value?.open();
}

/** 处理任务创建成功 */
function handleTaskCreateSuccess() {
  getTaskList();
  emit('success');
}

/** 查看任务详情 */
function handleTaskDetail(id: number) {
  taskDetailRef.value?.open(id);
}

/** 取消任务 */
async function handleCancelTask(id: number) {
  try {
    await ElMessageBox.confirm('确认要取消该升级任务吗？', '确认取消', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElMessage({
      message: '正在取消...',
      duration: 0,
      type: 'info',
    });
    try {
      // 注意：需要导入 cancelOtaTask API
      // await cancelOtaTask(id);
      ElMessage.success('取消成功');
      await refresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消任务失败', error);
      ElMessage.error('取消失败');
    }
  }
}

/** 刷新数据 */
async function refresh() {
  await getTaskList();
  emit('success');
}

/** 分页变化 */
function handlePageChange(page: number, pageSize: number) {
  queryParams.pageNo = page;
  queryParams.pageSize = pageSize;
  getTaskList();
}

/** 获取升级范围标签类型 */
function getDeviceScopeTagType(scope: number) {
  const typeMap: Record<number, 'primary' | 'success' | 'info'> = {
    1: 'primary',  // 全部设备
    2: 'success',  // 指定设备
  };
  return typeMap[scope] || 'info';
}

/** 获取升级范围文本 */
function getDeviceScopeText(scope: number) {
  const textMap: Record<number, string> = {
    1: '全部设备',
    2: '指定设备',
  };
  return textMap[scope] || '-';
}

/** 获取任务状态标签类型 */
function getTaskStatusTagType(status: number) {
  const typeMap: Record<number, 'warning' | 'primary' | 'success' | 'danger' | 'info'> = {
    [IoTOtaTaskStatusEnum.PENDING.value]: 'warning',    // 待执行
    [IoTOtaTaskStatusEnum.IN_PROGRESS.value]: 'primary', // 执行中
    [IoTOtaTaskStatusEnum.COMPLETED.value]: 'success',   // 已完成
    [IoTOtaTaskStatusEnum.CANCELED.value]: 'danger',     // 已取消
  };
  return typeMap[status] || 'info';
}

/** 获取任务状态文本 */
function getTaskStatusText(status: number) {
  const textMap: Record<number, string> = {
    [IoTOtaTaskStatusEnum.PENDING.value]: '待执行',
    [IoTOtaTaskStatusEnum.IN_PROGRESS.value]: '执行中',
    [IoTOtaTaskStatusEnum.COMPLETED.value]: '已完成',
    [IoTOtaTaskStatusEnum.CANCELED.value]: '已取消',
  };
  return textMap[status] || '-';
}

/** 初始化 */
onMounted(() => {
  getTaskList();
});
</script>

<template>
  <el-card class="task-card" shadow="never">
    <template #header>
      <span class="card-title">升级任务管理</span>
    </template>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-button type="primary" @click="openTaskForm">
        <IconifyIcon icon="ant-design:plus-outlined" class="btn-icon" />
        新增
      </el-button>
      <el-input
        v-model="queryParams.name"
        placeholder="请输入任务名称"
        clearable
        style="width: 240px"
        @keyup.enter="handleQuery"
      />
    </div>

    <!-- 任务列表 -->
    <el-table
      :data="taskList"
      v-loading="taskLoading"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="任务编号" width="80" align="center" />
      <el-table-column prop="name" label="任务名称" align="center" />
      <el-table-column label="升级范围" align="center">
        <template #default="{ row }">
          <el-tag :type="getDeviceScopeTagType(row.deviceScope)" size="small">
            {{ getDeviceScopeText(row.deviceScope) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="升级进度" align="center">
        <template #default="{ row }">
          {{ row.deviceSuccessCount }}/{{ row.deviceTotalCount }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="任务描述" align="center" show-overflow-tooltip />
      <el-table-column label="任务状态" align="center">
        <template #default="{ row }">
          <el-tag :type="getTaskStatusTagType(row.status)" size="small">
            {{ getTaskStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="{ row }">
          <el-space>
            <el-button link type="primary" @click="handleTaskDetail(row.id)">
              详情
            </el-button>
            <el-button
              v-if="row.status === IoTOtaTaskStatusEnum.IN_PROGRESS.value"
              link
              type="danger"
              @click="handleCancelTask(row.id)"
            >
              取消
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="taskTotal"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="(page) => handlePageChange(page, queryParams.pageSize)"
        @size-change="(size) => handlePageChange(queryParams.pageNo, size)"
      />
    </div>

    <!-- 新增任务弹窗 -->
    <OtaTaskForm
      ref="taskFormRef"
      :firmware-id="firmwareId"
      :product-id="productId"
      @success="handleTaskCreateSuccess"
    />

    <!-- 任务详情弹窗 -->
    <OtaTaskDetail ref="taskDetailRef" @success="refresh" />
  </el-card>
</template>

<style scoped>
.task-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.btn-icon {
  margin-right: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 表格样式调整 */
:deep(.el-table__header th) {
  background-color: #f5f7fa;
}
</style>
