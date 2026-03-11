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

import { dataList, useFormSchema, useFilterFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';
// 引入设备详情抽屉组件
import DeviceDetailDrawer from './deviceDetail.vue';

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

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
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
// 移除原 DetailDrawer 初始化逻辑
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
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
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === '新增') {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
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
  // 重置筛选条件，返回到第一层
  filterFormData.value = {};
  activeName.value = '全部';
  // 重新获取数据列表
  dataObj.apilist = dataList();
  // 刷新表格
  gridApi.query();
  // 显示刷新成功提示
  ElMessage.success('数据刷新成功');
}

/** 导出表格 */
async function handleExport() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  exportToExcel(dataObj.apilist, `路灯设施实时监测_${dateStr}_${timeStr}`, 'excel');
}

/** 启动监测 */
async function handleStartMonitor(row) {
  await confirm('确定启动监测吗？');
  const loadingInstance = ElLoading.service({
    text: '启动监测中...',
  });
  try {
    // 模拟启动监测
    row.monitorStatus = '运行中';
    ElMessage.success('启动监测成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 停止监测 */
async function handleStopMonitor(row) {
  await confirm('确定停止监测吗？');
  const loadingInstance = ElLoading.service({
    text: '停止监测中...',
  });
  try {
    // 模拟停止监测
    row.monitorStatus = '已停止';
    ElMessage.success('停止监测成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量启动/停止监测 */
async function handleBatchMonitor() {
  // 检查是否有选中的项
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要操作的路灯');
    return;
  }
  
  // 获取选中项的当前状态
  const selectedItems = dataObj.apilist.filter(item => checkedIds.value.includes(item.id));
  const hasRunning = selectedItems.some(item => item.monitorStatus === '运行中');
  const hasStopped = selectedItems.some(item => item.monitorStatus === '已停止');
  
  // 确定操作类型
  let operationText = '';
  if (hasRunning && hasStopped) {
    operationText = '启动/停止';
  } else if (hasRunning) {
    operationText = '停止';
  } else {
    operationText = '启动';
  }
  
  // 显示确认对话框
  const confirmed = await confirm(`确定${operationText}选中的 ${checkedIds.value.length} 个路灯的监测吗？`);
  if (!confirmed) return;
  
  const loadingInstance = ElLoading.service({
    text: `${operationText}监测中...`,
  });
  
  try {
    // 模拟批量操作
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id)) {
        item.monitorStatus = item.monitorStatus === '运行中' ? '已停止' : '运行中';
      }
    });
    ElMessage.success(`批量${operationText}监测成功`);
    // 清空选中状态
    checkedIds.value = [];
    // 刷新表格
    gridApi.query();
  } catch (error) {
    ElMessage.error('批量操作失败，请重试');
    console.error('批量操作失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 批量开关路灯 */
const batchSwitchDialogVisible = ref(false);
const batchSwitchForm = reactive({
  roadName: '',
  switchStatus: '开'
});

async function handleBatchSwitch() {
  // 检查是否有选中的项
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要操作的路灯');
    return;
  }
  
  // 打开批量开关路灯弹窗
  batchSwitchDialogVisible.value = true;
}

async function confirmBatchSwitch() {
  const loadingInstance = ElLoading.service({
    text: '批量控制中...',
  });
  
  try {
    // 模拟批量操作
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id) && 
          (batchSwitchForm.roadName === '' || item.roadName === batchSwitchForm.roadName)) {
        item.switchStatus = batchSwitchForm.switchStatus;
        item.controlStatus = '已控制';
        // 当关闭路灯时，同步更新亮度和电流为0
        if (batchSwitchForm.switchStatus === '关') {
          item.lightBrightness = 0;
          item.workingCurrent = 0;
        }
      }
    });
    
    // 触发响应式更新
    dataObj.apilist = [...dataObj.apilist];
    
    ElMessage.success('批量控制成功');
    // 清空选中状态
    checkedIds.value = [];
    // 关闭弹窗
    batchSwitchDialogVisible.value = false;
    // 刷新表格
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量操作失败，请重试');
    console.error('批量操作失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 单独开关路灯 */
async function handleSingleSwitch(row) {
  const loadingInstance = ElLoading.service({
    text: '控制中...',
  });
  try {
    // 模拟开关操作
    const newStatus = row.switchStatus === '开' ? '关' : '开';
    row.switchStatus = newStatus;
    row.controlStatus = '已控制';
    // 当关闭路灯时，同步更新亮度和电流为0
    if (newStatus === '关') {
      row.lightBrightness = 0;
      row.workingCurrent = 0;
    }
    ElMessage.success('控制成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  deviceDetailObj: {}, // 保留设备详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

// 筛选条件
const filterFormData = ref({});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  
  // 过滤数据
  const filteredData = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      // 监测状态过滤
      if (activeName.value !== '全部' && v.monitorStatus !== activeName.value) {
        return false;
      }
      
      // 路灯编号过滤
      if (filterFormData.value.lightNo && !v.lightNo.includes(filterFormData.value.lightNo)) {
        return false;
      }
      
      // 路段名称过滤
      if (filterFormData.value.roadName && !v.roadName.includes(filterFormData.value.roadName)) {
        return false;
      }
      
      // 开关状态过滤
      if (filterFormData.value.switchStatus && v.switchStatus !== filterFormData.value.switchStatus) {
        return false;
      }
      
      // 设备在线状态过滤
      if (filterFormData.value.deviceStatus && v.deviceStatus !== filterFormData.value.deviceStatus) {
        return false;
      }
      
      // 控制状态过滤
      if (filterFormData.value.controlStatus && v.controlStatus !== filterFormData.value.controlStatus) {
        return false;
      }
      
      // 预警触发标识过滤
      if (filterFormData.value.warnStatusId && v.warnStatusId !== filterFormData.value.warnStatusId) {
        return false;
      }
      
      return true;
    });
  
  dataObj.total = filteredData.length;
  dataObj.list = filteredData
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
};

const [QueryForm, queryFormApi] = useVbenForm({
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
  schema: useFilterFormSchema(),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
function onSubmit() {
  // 获取表单值
  filterFormData.value = queryFormApi.form.values;
  // 刷新表格
  handleRefresh();
  // 关闭抽屉
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
      refresh: false,
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

const activeName = ref('全部');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};

// 筛选同路段路灯监测数据
const handleFilterByRoadName = (roadName) => {
  ElMessage.success(`筛选路段：${roadName}`);
  // 更新筛选条件
  filterFormData.value.roadName = roadName;
  // 刷新表格
  gridApi.query();
};

// 筛选同开关状态路灯
const handleFilterBySwitchStatus = (switchStatus) => {
  ElMessage.success(`筛选开关状态：${switchStatus}`);
  // 更新筛选条件
  filterFormData.value.switchStatus = switchStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选同在线状态路灯
const handleFilterByDeviceStatus = (deviceStatus) => {
  ElMessage.success(`筛选设备状态：${deviceStatus}`);
  // 更新筛选条件
  filterFormData.value.deviceStatus = deviceStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选同监测状态路灯
const handleFilterByMonitorStatus = (monitorStatus) => {
  ElMessage.success(`筛选监测状态：${monitorStatus}`);
  // 更新筛选条件
  activeName.value = monitorStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选可远程控制路灯
const handleFilterByControlStatus = (controlStatus) => {
  ElMessage.success(`筛选控制状态：${controlStatus}`);
  // 更新筛选条件
  filterFormData.value.controlStatus = controlStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选待预警路灯
const handleFilterByWarnStatus = (warnStatusId) => {
  ElMessage.success(`筛选预警状态：${warnStatusId}`);
  // 更新筛选条件
  filterFormData.value.warnStatusId = warnStatusId;
  // 刷新表格
  gridApi.query();
};

// 设备详情
const handleDeviceDetail = (row) => {
  ElMessage.success(`查看设备详情：${row.deviceCode}`);
  // 更新设备详情对象
  dataObj.deviceDetailObj = row;
  // 打开设备详情抽屉
  deviceDetailDrawerRef.value.open();
};

const tabsData = ref([
  { label: '全部' },
  { label: '运行中' },
  { label: '已停止' },
  { label: '异常' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.monitorStatus === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
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
const deviceDetailDrawerRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
</script>

<style scoped lang="scss">
.common-toolbar-tools {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  
  .icon-button {
    flex-shrink: 0;
  }
}
</style>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <!-- 使用设备详情抽屉组件 -->
    <DeviceDetailDrawer
      ref="deviceDetailDrawerRef"
      :detail-obj="dataObj.deviceDetailObj"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="Filter" @click="handleSerachShow" />
          <IconButton content="刷新数据" icon-name="Refresh" @click="handleRefresh" />
          <IconButton content="配置监测参数" icon-name="SetUp" @click="handleCreate" />
          <IconButton content="导出实时数据" icon-name="Download" @click="handleExport" />
          <IconButton
            content="批量开关路灯"
            icon-name="Switch"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchSwitch"
          />
          <IconButton
            content="启动/停止批量监测"
            icon-name="VideoPlay"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchMonitor"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #lightNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.lightNo }}
        </el-text>
      </template>
      <template #roadName="{ row }">
        <el-text
          @click="handleFilterByRoadName(row.roadName)"
          class="common-align"
          type="primary"
        >
          {{ row.roadName }}
        </el-text>
      </template>
      <template #switchStatus="{ row }">
        <el-text
          @click="handleFilterBySwitchStatus(row.switchStatus)"
          class="common-align"
          type="primary"
        >
          {{ row.switchStatus }}
        </el-text>
      </template>
      <template #deviceCode="{ row }">
        <el-text
          @click="handleDeviceDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceCode }}
        </el-text>
      </template>
      <template #deviceStatus="{ row }">
        <el-text
          @click="handleFilterByDeviceStatus(row.deviceStatus)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceStatus }}
        </el-text>
      </template>
      <template #monitorStatus="{ row }">
        <el-text
          @click="handleFilterByMonitorStatus(row.monitorStatus)"
          class="common-align"
          type="primary"
        >
          {{ row.monitorStatus }}
        </el-text>
      </template>
      <template #controlStatus="{ row }">
        <el-text
          @click="handleFilterByControlStatus(row.controlStatus)"
          class="common-align"
          type="primary"
        >
          {{ row.controlStatus }}
        </el-text>
      </template>
      <template #warnStatusId="{ row }">
        <el-text
          @click="handleFilterByWarnStatus(row.warnStatusId)"
          class="common-align"
          type="primary"
        >
          {{ row.warnStatusId }}
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
            content="编辑监测配置"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="启动监测"
            icon-name="VideoPlay"
            @click="handleStartMonitor(row)"
          />
          <IconButton
            content="停止监测"
            icon-name="VideoPause"
            @click="handleStopMonitor(row)"
          />
          <IconButton
            content="单独开关路灯"
            icon-name="Switch"
            @click="handleSingleSwitch(row)"
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

    <!-- 批量开关路灯弹窗 -->
    <el-dialog
      v-model="batchSwitchDialogVisible"
      title="批量开关路灯"
      width="400px"
    >
      <el-form :model="batchSwitchForm" label-width="100px">
        <el-form-item label="目标路段">
          <el-select v-model="batchSwitchForm.roadName" placeholder="请选择路段" clearable>
            <el-option
              v-for="road in [...new Set(dataObj.apilist.map(item => item.roadName))]"
              :key="road"
              :label="road"
              :value="road"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开关状态">
          <el-select v-model="batchSwitchForm.switchStatus" placeholder="请选择开关状态">
            <el-option label="开" value="开" />
            <el-option label="关" value="关" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchSwitchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmBatchSwitch">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
