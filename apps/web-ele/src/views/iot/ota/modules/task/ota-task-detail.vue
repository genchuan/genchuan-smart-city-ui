<script setup lang="ts">
import type { OtaTask } from '#/api/iot/ota/task';
import type { OtaTaskRecord } from '#/api/iot/ota/task/record';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { formatDate } from '@vben/utils';

import {
  ElCard,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElMessage,
  ElMessageBox,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTabs,
  ElTabPane,
} from 'element-plus';

import { getOtaTask } from '#/api/iot/ota/task';
import {
  cancelOtaTaskRecord,
  getOtaTaskRecordPage,
  getOtaTaskRecordStatusStatistics,
} from '#/api/iot/ota/task/record';
import { IoTOtaTaskRecordStatusEnum } from '#/views/iot/utils/constants';

/** OTA 任务详情组件 */
defineOptions({ name: 'OtaTaskDetail' });

const emit = defineEmits(['success']);

const taskId = ref<number>();
const taskLoading = ref(false);
const task = ref<OtaTask>({} as OtaTask);

const taskStatisticsLoading = ref(false);
const taskStatistics = ref<Record<string, number>>({});

const recordLoading = ref(false);
const recordList = ref<OtaTaskRecord[]>([]);
const recordTotal = ref(0);
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskId: undefined as number | undefined,
  status: undefined as number | undefined,
});
const activeTab = ref('');

/** 状态标签配置 */
const statusTabs = computed(() => {
  const tabs = [{ key: '', label: '全部设备' }];
  Object.values(IoTOtaTaskRecordStatusEnum).forEach((status) => {
    tabs.push({
      key: status.value.toString(),
      label: status.label,
    });
  });
  return tabs;
});

/** 表格列配置 */
const columns = [
  {
    prop: 'deviceName',
    label: '设备名称',
    align: 'center' as const,
  },
  {
    prop: 'fromFirmwareVersion',
    label: '当前版本',
    align: 'center' as const,
  },
  {
    prop: 'status',
    label: '升级状态',
    align: 'center' as const,
    width: 120,
  },
  {
    prop: 'progress',
    label: '升级进度',
    align: 'center' as const,
    width: 120,
  },
  {
    prop: 'description',
    label: '状态描述',
    align: 'center' as const,
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    align: 'center' as const,
    width: 180,
  },
  {
    prop: 'action',
    label: '操作',
    align: 'center' as const,
    width: 80,
  },
];

const [ModalComponent, modalApi] = useVbenModal();

/** 获取任务详情 */
async function getTaskInfo() {
  if (!taskId.value) {
    return;
  }
  taskLoading.value = true;
  try {
    task.value = await getOtaTask(taskId.value);
  } finally {
    taskLoading.value = false;
  }
}

/** 获取统计数据 */
async function getStatistics() {
  if (!taskId.value) {
    return;
  }
  taskStatisticsLoading.value = true;
  try {
    taskStatistics.value = await getOtaTaskRecordStatusStatistics(
      undefined,
      taskId.value,
    );
  } finally {
    taskStatisticsLoading.value = false;
  }
}

/** 获取升级记录列表 */
async function getRecordList() {
  if (!taskId.value) {
    return;
  }
  recordLoading.value = true;
  try {
    queryParams.taskId = taskId.value;
    const data = await getOtaTaskRecordPage(queryParams);
    recordList.value = data.list || [];
    recordTotal.value = data.total || 0;
  } finally {
    recordLoading.value = false;
  }
}

/** 切换标签 */
function handleTabChange(tabKey: number | string) {
  activeTab.value = String(tabKey);
  queryParams.pageNo = 1;
  queryParams.status =
    activeTab.value === '' ? undefined : Number.parseInt(String(tabKey));
  getRecordList();
}

/** 分页变化 */
function handlePageChange(page: number, pageSize: number) {
  queryParams.pageNo = page;
  queryParams.pageSize = pageSize;
  getRecordList();
}

/** 取消升级 */
async function handleCancelUpgrade(record: OtaTaskRecord) {
  try {
    await ElMessageBox.confirm('确认要取消该设备的升级任务吗？', '确认取消', {
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
      await cancelOtaTaskRecord(record.id!);
      ElMessage.success('取消成功');
      await getRecordList();
      await getStatistics();
      await getTaskInfo();
      emit('success');
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消升级失败', error);
      ElMessage.error('取消失败');
    }
  }
}

/** 获取状态标签类型 */
function getStatusTagType(status: number) {
  const typeMap: Record<number, 'info' | 'primary' | 'warning' | 'success' | 'danger'> = {
    [IoTOtaTaskRecordStatusEnum.PENDING.value]: 'info',
    [IoTOtaTaskRecordStatusEnum.PUSHED.value]: 'primary',
    [IoTOtaTaskRecordStatusEnum.UPGRADING.value]: 'warning',
    [IoTOtaTaskRecordStatusEnum.SUCCESS.value]: 'success',
    [IoTOtaTaskRecordStatusEnum.FAILURE.value]: 'danger',
    [IoTOtaTaskRecordStatusEnum.CANCELED.value]: 'info',
  };
  return typeMap[status] || 'info';
}

/** 获取状态文本 */
function getStatusText(status: number) {
  const textMap: Record<number, string> = {
    [IoTOtaTaskRecordStatusEnum.PENDING.value]: '待推送',
    [IoTOtaTaskRecordStatusEnum.PUSHED.value]: '已推送',
    [IoTOtaTaskRecordStatusEnum.UPGRADING.value]: '升级中',
    [IoTOtaTaskRecordStatusEnum.SUCCESS.value]: '成功',
    [IoTOtaTaskRecordStatusEnum.FAILURE.value]: '失败',
    [IoTOtaTaskRecordStatusEnum.CANCELED.value]: '已取消',
  };
  return textMap[status] || '-';
}

/** 获取任务状态标签类型 */
function getTaskStatusTagType(status: number) {
  const typeMap: Record<number, 'warning' | 'primary' | 'success' | 'danger' | 'info'> = {
    0: 'warning',  // 待执行
    1: 'primary',  // 执行中
    2: 'success',  // 已完成
    3: 'danger',   // 已取消
  };
  return typeMap[status] || 'info';
}

/** 获取任务状态文本 */
function getTaskStatusText(status: number) {
  const textMap: Record<number, string> = {
    0: '待执行',
    1: '执行中',
    2: '已完成',
    3: '已取消',
  };
  return textMap[status] || '-';
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

/** 打开弹窗 */
function open(id: number) {
  modalApi.open();
  taskId.value = id;
  activeTab.value = '';
  queryParams.pageNo = 1;
  queryParams.status = undefined;

  // 加载数据
  getTaskInfo();
  getStatistics();
  getRecordList();
}

/** 暴露方法 */
defineExpose({ open });
</script>

<template>
  <ModalComponent title="升级任务详情" class="w-5/6">
    <div class="task-detail-container">
      <!-- 任务信息 -->
      <el-card class="info-card" shadow="never" :loading="taskLoading">
        <template #header>
          <span class="card-title">任务信息</span>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="任务编号">
            {{ task.id }}
          </el-descriptions-item>
          <el-descriptions-item label="任务名称">
            {{ task.name }}
          </el-descriptions-item>
          <el-descriptions-item label="升级范围">
            <el-tag :type="getDeviceScopeTagType(task.deviceScope)" size="small">
              {{ getDeviceScopeText(task.deviceScope) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="getTaskStatusTagType(task.status)" size="small">
              {{ getTaskStatusText(task.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{
              task.createTime
                ? formatDate(task.createTime, 'YYYY-MM-DD HH:mm:ss')
                : '-'
            }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="3">
            {{ task.description || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 任务升级设备统计 -->
      <el-card class="stats-card" shadow="never" :loading="taskStatisticsLoading">
        <template #header>
          <span class="card-title">升级设备统计</span>
        </template>
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <div class="stat-item stat-total">
              <div class="stat-value text-blue-500">
                {{
                  Object.values(taskStatistics).reduce(
                    (sum, count) => sum + (count || 0),
                    0,
                  ) || 0
                }}
              </div>
              <div class="stat-label">升级设备总数</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-pending">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.PENDING.value] || 0 }}
              </div>
              <div class="stat-label">待推送</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-pushed">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.PUSHED.value] || 0 }}
              </div>
              <div class="stat-label">已推送</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-upgrading">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.UPGRADING.value] || 0 }}
              </div>
              <div class="stat-label">正在升级</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-success">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.SUCCESS.value] || 0 }}
              </div>
              <div class="stat-label">升级成功</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-failure">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.FAILURE.value] || 0 }}
              </div>
              <div class="stat-label">升级失败</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="stat-item stat-canceled">
              <div class="stat-value">
                {{ taskStatistics[IoTOtaTaskRecordStatusEnum.CANCELED.value] || 0 }}
              </div>
              <div class="stat-label">升级取消</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 设备管理 -->
      <el-card class="records-card" shadow="never">
        <template #header>
          <span class="card-title">升级设备记录</span>
        </template>

        <el-tabs v-model="activeTab" class="records-tabs" @tab-change="handleTabChange">
          <el-tab-pane
            v-for="tab in statusTabs"
            :key="tab.key"
            :label="tab.label"
            :name="tab.key"
          />
        </el-tabs>

        <el-table
          :data="recordList"
          v-loading="recordLoading"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="deviceName" label="设备名称" align="center" />
          <el-table-column prop="fromFirmwareVersion" label="当前版本" align="center" />
          <el-table-column label="升级状态" align="center" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="升级进度" align="center" width="120">
            <template #default="{ row }">
              {{ row.progress }}%
            </template>
          </el-table-column>
          <el-table-column prop="description" label="状态描述" align="center" />
          <el-table-column label="更新时间" align="center" width="180">
            <template #default="{ row }">
              {{ formatDate(row.updateTime, 'YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template #default="{ row }">
              <el-button
                v-if="
                  [
                    IoTOtaTaskRecordStatusEnum.PENDING.value,
                    IoTOtaTaskRecordStatusEnum.PUSHED.value,
                    IoTOtaTaskRecordStatusEnum.UPGRADING.value,
                  ].includes(row.status)
                "
                link
                type="danger"
                @click="handleCancelUpgrade(row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="queryParams.pageNo"
            v-model:page-size="queryParams.pageSize"
            :total="recordTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="(page) => handlePageChange(page, queryParams.pageSize)"
            @size-change="(size) => handlePageChange(queryParams.pageNo, size)"
          />
        </div>
      </el-card>
    </div>
  </ModalComponent>
</template>

<style scoped>
/* 样式保持不变，已完全适配 Element Plus */
.task-detail-container {
  padding: 16px;
}

.info-card,
.stats-card,
.records-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
}

.stats-row {
  padding: 20px 0;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.stat-value {
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-total .stat-value {
  color: #409eff;
}

.stat-pending .stat-value {
  color: #909399;
}

.stat-pushed .stat-value {
  color: #409eff;
}

.stat-upgrading .stat-value {
  color: #e6a23c;
}

.stat-success .stat-value {
  color: #67c23a;
}

.stat-failure .stat-value {
  color: #f56c6c;
}

.stat-canceled .stat-value {
  color: #909399;
}

.text-blue-500 {
  color: #409eff;
}

.records-tabs {
  margin-bottom: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 描述列表样式调整 */
:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}

:deep(.el-descriptions__cell) {
  padding: 12px 16px;
}
</style>
