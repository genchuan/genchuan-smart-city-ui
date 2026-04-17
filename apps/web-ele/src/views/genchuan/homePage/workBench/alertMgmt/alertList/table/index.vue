<template>
  <div class="park-lot-table-new">
    <!-- 详情抽屉 -->
    <AlarmDetailDrawer ref="detailDrawerRef" :detail-obj="currentDetail" />

    <!-- 处置确认抽屉 -->
    <DisposeConfirmDrawer title="确认处置">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">预警编号</div>
          <div class="detail-row-right">{{ currentDisposeRow?.alertNo }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警等级</div>
          <div class="detail-row-right">{{ currentDisposeRow?.level }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警类型</div>
          <div class="detail-row-right">{{ currentDisposeRow?.type }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">发生地点</div>
          <div class="detail-row-right">{{ currentDisposeRow?.address }}</div>
        </div>
        <div class="detail-card-row warning-row">
          <div class="detail-row-left">提示</div>
          <div class="detail-row-right" style="color: #e6a23c;">处置后状态将变为“处理中”，处置人设为当前用户。</div>
        </div>
      </div>
    </DisposeConfirmDrawer>

    <!-- 批量处置确认抽屉 -->
    <BatchDisposeConfirmDrawer title="批量处置确认">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">批量处置</div>
          <div class="detail-row-right">确认批量处置以下 {{ batchDisposeRows.length }} 条预警吗？</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警列表</div>
          <div class="detail-row-right">
            <el-table :data="batchDisposeRows" size="small" max-height="300" border>
              <el-table-column prop="alertNo" label="预警编号" width="180" />
              <el-table-column prop="level" label="等级" width="80" />
              <el-table-column prop="type" label="类型" />
            </el-table>
          </div>
        </div>
        <div class="detail-card-row warning-row">
          <div class="detail-row-left">提示</div>
          <div class="detail-row-right" style="color: #e6a23c;">批量处置后，所选预警状态将变为“处理中”，处置人设为当前用户。</div>
        </div>
      </div>
    </BatchDisposeConfirmDrawer>

    <!-- 忽略确认抽屉 -->
    <IgnoreConfirmDrawer title="忽略预警">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">预警编号</div>
          <div class="detail-row-right">{{ currentIgnoreRow?.alertNo }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警等级</div>
          <div class="detail-row-right">{{ currentIgnoreRow?.level }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警类型</div>
          <div class="detail-row-right">{{ currentIgnoreRow?.type }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">忽略理由</div>
          <div class="detail-row-right">
            <el-input v-model="ignoreReason" type="textarea" rows="3" placeholder="请输入忽略理由" maxlength="255" show-word-limit />
          </div>
        </div>
        <div class="detail-card-row warning-row">
          <div class="detail-row-left">提示</div>
          <div class="detail-row-right" style="color: #e6a23c;">忽略后预警将直接关闭，请谨慎操作。</div>
        </div>
      </div>
    </IgnoreConfirmDrawer>

    <!-- 更新进度抽屉 -->
    <UpdateProgressDrawer title="更新处置进度">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">预警编号</div>
          <div class="detail-row-right">{{ currentProgressRow?.alertNo }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置进度</div>
          <div class="detail-row-right">
            <el-input-number v-model="progressValue" :min="0" :max="100" />
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置凭证</div>
          <div class="detail-row-right">
            <el-upload :auto-upload="false" :on-change="handleUploadChange" :limit="1" :file-list="progressFileList">
              <el-button type="primary">上传文件</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </UpdateProgressDrawer>

    <!-- 表格 -->
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabChange">
              <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)" :name="item.label" />
            </el-tabs>
          </div>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            v-if="activeName === '待处置'"
            content="批量处置"
            icon-name="check"
            color="#67C23A"
            :disabled="!checkedIds.length"
            @click="handleBatchDispose"
          />
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 列插槽 -->
      <template #alertNo="{ row }">
        <el-text type="primary" @click="handleOpenDetail(row)" class="common-align">{{ row.alertNo }}</el-text>
      </template>
      <template #level="{ row }">
        <el-tag :type="levelTagType(row.level)" size="small">{{ row.level }}</el-tag>
      </template>
      <template #type="{ row }">
        <el-tag size="small">{{ row.type }}</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="statusTagType(row.status)" size="small">{{ row.status }}</el-tag>
      </template>
      <template #progress="{ row }">
        <el-progress :percentage="row.progress" :status="row.progress === 100 ? 'success' : ''" style="width: 80px;" />
      </template>

      <!-- 操作按钮 -->
      <template #pendingActions="{ row }">
        <IconButton content="处置" icon-name="edit" color="#67C23A" @click="handleDispose(row)" />
        <IconButton content="忽略" icon-name="close" color="#E6A23C" @click="handleIgnore(row)" />
        <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
      </template>
      <template #dealingActions="{ row }">
        <IconButton content="更新进度" icon-name="edit" @click="handleUpdateProgress(row)" />
        <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
      </template>
      <template #archivedActions="{ row }">
        <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
      </template>

      <!-- 搜索抽屉 -->
      <Drawer title="搜索">
        <QueryForm class="query-form" @submit="onSearch" />
      </Drawer>
    </Grid>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form.js';
import { useVbenVxeGrid } from '#/adapter/vxe-table.js';
import screenfull from 'screenfull';
import * as alertApi from '#/api/genchuan/homePage/workBench/alertMgmt/alertList';
import AlarmDetailDrawer from './detail.vue';
import { useFormSchema, useGridColumns, mockAlertList } from './data.js';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false }
});
const emit = defineEmits(['arrow-change']);

// 是否使用模拟数据
const USE_MOCK = true;

// 模拟数据响应式副本（仅在模拟模式下使用）
const mockDataList = ref([...mockAlertList]);

// 状态映射
const statusMap = { 待处置: '未处理', 处置中: '处理中', 已归档: '已关闭' };
const activeName = ref('待处置');
const currentStatus = computed(() => statusMap[activeName.value]);

// 当前模块类型（用于搜索表单动态切换）
const currentModuleType = computed(() => {
  if (activeName.value === '待处置') return 'pending';
  if (activeName.value === '处置中') return 'dealing';
  return 'archived';
});

// 表格数据
const tableData = ref([]);
const total = ref(0);
const checkedIds = ref([]);

// 搜索表单 - 动态 schema
const searchForm = ref({});
let queryFormApi = null;
const [QueryForm, queryFormMethods] = useVbenForm({
  schema: useFormSchema(currentModuleType.value),
  handleSubmit: (values) => {
    searchForm.value = values;
    gridApi.value?.query();
  }
});
// 监听模块变化，动态更新搜索表单的 schema
watch(currentModuleType, (newType) => {
  if (queryFormMethods?.setSchema) {
    queryFormMethods.setSchema(useFormSchema(newType));
  }
});

// 获取表格数据（统一入口，自动选择真实接口或模拟数据）
const getTableData = async ({ page }) => {
  if (!USE_MOCK) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        status: currentStatus.value || undefined,
        ...searchForm.value
      };
      // 处理时间范围
      if (params.occurTime && Array.isArray(params.occurTime)) {
        params.beginTime = params.occurTime[0];
        params.endTime = params.occurTime[1];
        delete params.occurTime;
      }
      const res = await alertApi.getAlertListPage(params);
      if (res.code === 200) {
        const list = res.list || [];
        const totalNum = res.total || 0;
        tableData.value = list;
        total.value = totalNum;
        // 返回 { list, total } 并通过 response 映射为 result
        return { list, total: totalNum };
      } else {
        ElMessage.error(res.msg || '查询失败');
        return { list: [], total: 0 };
      }
    } catch (error) {
      console.error('API请求失败，降级使用模拟数据', error);
      return getMockTableData(page);
    }
  } else {
    return getMockTableData(page);
  }
};

// 修改 getMockTableData：参数直接为分页对象
const getMockTableData = (page) => {
  let filtered = mockDataList.value.filter(item => {
    if (currentStatus.value && item.status !== currentStatus.value) return false;
    if (searchForm.value.alertNo && !item.alertNo.includes(searchForm.value.alertNo)) return false;
    if (searchForm.value.level && item.level !== searchForm.value.level) return false;
    if (searchForm.value.type && item.type !== searchForm.value.type) return false;
    if (searchForm.value.address && !item.address.includes(searchForm.value.address)) return false;
    if (searchForm.value.handleUserId && item.handleUserId !== parseInt(searchForm.value.handleUserId)) return false;
    return true;
  });
  const totalNum = filtered.length;
  const start = (page.currentPage - 1) * page.pageSize;
  const end = start + page.pageSize;
  const list = filtered.slice(start, end);
  console.log('【模拟数据】返回列表：', list);
  return { list, total: totalNum };
};

// 关键修改：显式配置 response 映射，将返回对象中的 list 字段映射为 result
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(currentModuleType.value),
    proxyConfig: {
      ajax: {
        query: getTableData,
        // 告诉组件：数据列表在返回对象的 list 字段，总条数在 total 字段
        response: {
          result: 'list',   // 将返回的 list 字段作为表格数据
          total: 'total'    // 将返回的 total 字段作为总条数
        }
      }
    },
    pagerConfig: { currentPage: 1, pageSize: 100 },
    toolbarConfig: { refresh: true, search: true }
  },
  gridEvents: {
    checkboxChange: ({ records }) => { checkedIds.value = records.map(r => r.id); },
    checkboxAll: ({ records }) => { checkedIds.value = records.map(r => r.id); }
  }
});

// 详情抽屉
const detailDrawerRef = ref(null);
const currentDetail = ref({});
const handleOpenDetail = async (row) => {
  if (!USE_MOCK) {
    try {
      const res = await alertApi.getAlertDetail(row.id);
      if (res.code === 200) {
        currentDetail.value = res.data;
        detailDrawerRef.value.open();
      } else {
        ElMessage.error(res.msg || '获取详情失败');
      }
    } catch (error) {
      ElMessage.error('获取详情失败');
    }
  } else {
    currentDetail.value = mockDataList.value.find(item => item.id === row.id);
    detailDrawerRef.value.open();
  }
};

// ==================== 处置（右侧抽屉） ====================
const [DisposeConfirmDrawer, disposeConfirmDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel: () => disposeConfirmDrawerApi.close(),
  onConfirm: () => submitDispose()
});
const currentDisposeRow = ref(null);
const handleDispose = (row) => {
  currentDisposeRow.value = row;
  disposeConfirmDrawerApi.open();
};
const submitDispose = async () => {
  const loading = ElLoading.service({ text: '处置中...' });
  try {
    if (!USE_MOCK) {
      const res = await alertApi.handleAlert(currentDisposeRow.value.id);
      if (res.code === 200) {
        ElMessage.success('处置成功');
      } else {
        ElMessage.error(res.msg || '处置失败');
        return;
      }
    } else {
      const index = mockDataList.value.findIndex(item => item.id === currentDisposeRow.value.id);
      if (index !== -1) {
        mockDataList.value[index].status = '处理中';
        mockDataList.value[index].handleUserId = 1;
        mockDataList.value[index].progress = 10;
      }
      ElMessage.success('处置成功（模拟）');
    }
    disposeConfirmDrawerApi.close();
    gridApi.value.query();
  } finally {
    loading.close();
  }
};

// ==================== 批量处置（右侧抽屉） ====================
const [BatchDisposeConfirmDrawer, batchDisposeConfirmDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel: () => batchDisposeConfirmDrawerApi.close(),
  onConfirm: () => submitBatchDispose()
});
const batchDisposeRows = ref([]);
const handleBatchDispose = () => {
  if (!checkedIds.value.length) {
    ElMessage.warning('请选择预警');
    return;
  }
  batchDisposeRows.value = tableData.value.filter(row => checkedIds.value.includes(row.id));
  batchDisposeConfirmDrawerApi.open();
};
const submitBatchDispose = async () => {
  const loading = ElLoading.service({ text: '批量处置中...' });
  try {
    if (!USE_MOCK) {
      const res = await alertApi.batchHandleAlert(checkedIds.value);
      if (res.code === 200) {
        ElMessage.success('批量处置成功');
      } else {
        ElMessage.error(res.msg || '批量处置失败');
        return;
      }
    } else {
      checkedIds.value.forEach(id => {
        const index = mockDataList.value.findIndex(item => item.id === id);
        if (index !== -1 && mockDataList.value[index].status === '未处理') {
          mockDataList.value[index].status = '处理中';
          mockDataList.value[index].handleUserId = 1;
          mockDataList.value[index].progress = 10;
        }
      });
      ElMessage.success('批量处置成功（模拟）');
    }
    batchDisposeConfirmDrawerApi.close();
    checkedIds.value = [];
    gridApi.value.query();
  } finally {
    loading.close();
  }
};

// ==================== 忽略（右侧抽屉） ====================
const [IgnoreConfirmDrawer, ignoreConfirmDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel: () => {
    ignoreReason.value = '';
    ignoreConfirmDrawerApi.close();
  },
  onConfirm: () => submitIgnore()
});
const currentIgnoreRow = ref(null);
const ignoreReason = ref('');
const handleIgnore = (row) => {
  currentIgnoreRow.value = row;
  ignoreReason.value = '';
  ignoreConfirmDrawerApi.open();
};
const submitIgnore = async () => {
  if (!ignoreReason.value.trim()) {
    ElMessage.error('请填写忽略理由');
    return;
  }
  const loading = ElLoading.service({ text: '提交忽略...' });
  try {
    if (!USE_MOCK) {
      const res = await alertApi.ignoreAlert(currentIgnoreRow.value.id, ignoreReason.value);
      if (res.code === 200) {
        ElMessage.success('已忽略');
      } else {
        ElMessage.error(res.msg || '忽略失败');
        return;
      }
    } else {
      const index = mockDataList.value.findIndex(item => item.id === currentIgnoreRow.value.id);
      if (index !== -1) {
        mockDataList.value[index].status = '已关闭';
        mockDataList.value[index].ignoreReason = ignoreReason.value;
        mockDataList.value[index].closeTime = String(Math.floor(Date.now() / 1000));
      }
      ElMessage.success('已忽略（模拟）');
    }
    ignoreReason.value = '';
    ignoreConfirmDrawerApi.close();
    gridApi.value.query();
  } finally {
    loading.close();
  }
};

// ==================== 更新进度（右侧抽屉） ====================
const [UpdateProgressDrawer, updateProgressDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel: () => {
    progressValue.value = 0;
    progressFileList.value = [];
    progressVoucherUrl.value = '';
    updateProgressDrawerApi.close();
  },
  onConfirm: () => submitProgress()
});
const currentProgressRow = ref(null);
const progressValue = ref(0);
const progressFileList = ref([]);
const progressVoucherUrl = ref('');
const handleUpdateProgress = (row) => {
  currentProgressRow.value = row;
  progressValue.value = row.progress || 0;
  progressFileList.value = [];
  progressVoucherUrl.value = '';
  updateProgressDrawerApi.open();
};
const handleUploadChange = async (file) => {
  if (!USE_MOCK) {
    const loading = ElLoading.service({ text: '上传中...' });
    try {
      const res = await alertApi.uploadFile(file.raw);
      if (res.code === 200) {
        progressVoucherUrl.value = res.data.url;
        ElMessage.success('上传成功');
      } else {
        ElMessage.error(res.msg || '上传失败');
      }
    } finally {
      loading.close();
    }
  } else {
    progressVoucherUrl.value = `/uploads/${file.raw.name}`;
    ElMessage.success('上传成功（模拟）');
  }
};
const submitProgress = async () => {
  if (progressValue.value < 0 || progressValue.value > 100) {
    ElMessage.error('进度必须在0-100之间');
    return;
  }
  const loading = ElLoading.service({ text: '更新进度...' });
  try {
    if (!USE_MOCK) {
      const res = await alertApi.updateProgress({
        id: currentProgressRow.value.id,
        progress: progressValue.value,
        voucherUrl: progressVoucherUrl.value
      });
      if (res.code === 200) {
        ElMessage.success('进度更新成功');
      } else {
        ElMessage.error(res.msg || '更新失败');
        return;
      }
    } else {
      const index = mockDataList.value.findIndex(item => item.id === currentProgressRow.value.id);
      if (index !== -1) {
        mockDataList.value[index].progress = progressValue.value;
        if (progressVoucherUrl.value) {
          mockDataList.value[index].voucherUrl = progressVoucherUrl.value;
        }
        if (progressValue.value === 100) {
          mockDataList.value[index].status = '已关闭';
          mockDataList.value[index].closeTime = String(Math.floor(Date.now() / 1000));
        }
      }
      ElMessage.success('进度更新成功（模拟）');
    }
    updateProgressDrawerApi.close();
    gridApi.value.query();
  } finally {
    loading.close();
  }
};

// ==================== 导出 ====================
const handleExport = async () => {
  if (!USE_MOCK) {
    const loading = ElLoading.service({ text: '导出中...' });
    try {
      const params = { status: currentStatus.value, ...searchForm.value };
      if (params.occurTime && Array.isArray(params.occurTime)) {
        params.beginTime = params.occurTime[0];
        params.endTime = params.occurTime[1];
        delete params.occurTime;
      }
      const blob = await alertApi.exportAlertList(params);
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `预警列表_${new Date().toISOString().slice(0, 19)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } else {
    ElMessage.info('导出功能演示（模拟）');
  }
};

// ==================== 辅助函数 ====================
const handleRefresh = () => gridApi.value?.query();
const handleSearchShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

const handleTabChange = () => {
  // 更新表格列配置
  gridApi.value?.updateOptions({ columns: useGridColumns(currentModuleType.value) });
  gridApi.value?.query();
};

const tabsData = ref([{ label: '待处置' }, { label: '处置中' }, { label: '已归档' }]);

// 标签页计数（响应式）
const tabCounts = computed(() => {
  if (!USE_MOCK) return { 待处置: 0, 处置中: 0, 已归档: 0 };
  const list = mockDataList.value;
  return {
    待处置: list.filter(v => v.status === '未处理').length,
    处置中: list.filter(v => v.status === '处理中').length,
    已归档: list.filter(v => v.status === '已关闭').length,
  };
});
const createLabel = (item) => {
  if (!USE_MOCK) return item.label;
  return `${item.label}(${tabCounts.value[item.label]})`;
};

const levelTagType = (level) => {
  if (level === '高危') return 'danger';
  if (level === '高') return 'warning';
  if (level === '中') return 'primary';
  return 'info';
};
const statusTagType = (status) => {
  if (status === '未处理') return 'info';
  if (status === '处理中') return 'primary';
  if (status === '已关闭') return 'success';
  return 'info';
};

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false
});
const onSearch = (values) => {
  searchForm.value = values;
  drawerApi.close();
  gridApi.value?.query();
};

onMounted(() => {
  gridApi.value?.query();
});
</script>

<style scoped lang="scss">
.park-lot-table-new {
  .common-toolbar-tools {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .tabel-tabs {
    margin-bottom: 10px;
  }
}

// 复用详情抽屉的卡片样式（供处置、忽略等抽屉使用）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
}
</style>
