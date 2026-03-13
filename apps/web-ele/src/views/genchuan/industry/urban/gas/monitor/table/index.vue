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

// 新增：批量切换状态弹窗相关
const switchDialogVisible = ref(false);
const switchStatus = ref('运行中'); // 默认切换为运行中
const statusLoading = ref(false); // 批量操作加载状态

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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  exportToExcel(dataObj.apilist, `燃气管网实时监测数据_${dateStr}_${timeStr}`, 'excel');
}

/** 创建 */
function handleCreate() {
  formApi.resetForm();
  formApi.setState((prev) => {
    return {
      schema: useFormSchema(),
    };
  });
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  formApi.resetForm();
  formApi.setState((prev) => {
    return {
      schema: useFormSchema().map((v) => {
        return {
          ...v,
        };
      }),
    };
  });
  formDrawerApi
    .setData({
      title: '编辑监测配置',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.pipeRoad]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.pipeRoad]));
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
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  serachObj: {},
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  
  // 模拟异步获取数据
  return new Promise((resolve) => {
    // 使用本地数据模拟，实际应用应该从 API 获取
    const filteredData = dataObj.apilist.filter((v) => {
      // 监测状态过滤（tabs 筛选）
      if (activeName.value !== '全部' && v.monitorStatus !== activeName.value) {
        return false;
      }
      
      // 搜索条件过滤
      if (dataObj.serachObj.pipeRoad && !v.pipeRoad.includes(dataObj.serachObj.pipeRoad)) {
        return false;
      }
      
      if (dataObj.serachObj.areaName && v.areaName !== dataObj.serachObj.areaName) {
        return false;
      }
      
      if (dataObj.serachObj.deviceStatus && v.deviceStatus !== dataObj.serachObj.deviceStatus) {
        return false;
      }
      
      if (dataObj.serachObj.monitorStatus && v.monitorStatus !== dataObj.serachObj.monitorStatus) {
        return false;
      }
      
      return true;
    });
    
    dataObj.total = filteredData.length;
    dataObj.list = filteredData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
    resolve(dataObj);
  });
};

const [QueryForm, QueryFormApi] = useVbenForm({
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
  // 垂直布局，label 和 input 在不同行，值为 vertical
  // 水平布局，label 和 input 在同一行
  layout: 'horizontal',
  schema: useFilterFormSchema()
    .filter((v) => v.isSearch !== false)
    .map((v) => {
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
  dataObj.serachObj = QueryFormApi.form.values;
  gridApi.reload();
  drawerApi.close();
}
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: false, // 去掉 keepSource，让表格直接使用 dataObj.list
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
    // 添加刷新按钮点击事件
    refresh: handleRefresh,
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

// 点击管网路段查看详细信息
const handlePipeRoadClick = (row) => {
  dataObj.detailObj = row;
  // 通过 ref 调用组件的 open 方法
  parkDetailDrawerRef.value.open();
  console.log('查看管网路段详情:', row.pipeRoad);
};

// 点击所属区域不执行任何操作
const handleAreaNameClick = (row) => {
  // 不执行任何操作
  console.log('点击所属区域:', row.areaName);
};

// 点击设备在线状态筛选同状态数据
const handleDeviceStatusClick = (row) => {
  // 筛选同在线状态的监测点位
  dataObj.serachObj.deviceStatus = row.deviceStatus;
  gridApi.reload();
  console.log('筛选同设备状态数据:', row.deviceStatus);
};

// 点击监测状态不执行任何操作，只用于状态切换
const handleMonitorStatusClick = (row) => {
  // 不执行任何操作，避免触发详细功能
  console.log('点击监测状态:', row.monitorStatus);
};

// 设备详情
const handleDeviceDetail = (row) => {
  ElMessage.success(`查看设备详情：${row.deviceCode}`);
  // 更新设备详情对象
  dataObj.deviceDetailObj = row;
  // 打开设备详情抽屉
  deviceDetailDrawerRef.value.open();
};

// 新增：单个状态切换
const handleMonitorStatusChange = (row) => {
  ElMessage.success(`切换监测状态：${row.monitorStatus}`);
  // 这里可以添加 API 调用更新状态
  // 数据已经通过 v-model 更新了
};



// 新增：批量切换状态弹窗打开方法
const switchOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要切换状态的管网路段！');
    return;
  }

  // 重置默认状态为运行中
  switchStatus.value = '运行中';
  // 打开弹窗
  switchDialogVisible.value = true;
};

// 新增：批量切换状态确认方法
const handleSwitchConfirm = async () => {
  statusLoading.value = true;
  try {
    // 模拟批量更新状态
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id)) {
        item.monitorStatus = switchStatus.value;
      }
    });
    
    ElMessage.success(`批量切换状态成功`);
    statusLoading.value = false;
    switchDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量切换状态失败，请重试');
    statusLoading.value = false;
    console.error('批量切换状态失败:', error);
  }
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
  gridApi.reload();
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

<template>
  <div class="park-lot-table-new">
    <!-- 批量切换监测状态弹窗 -->
    <el-dialog
      v-model="switchDialogVisible"
      title="批量切换监测状态"
      width="400px"
      :close-on-click-modal="false"
      :before-close="() => (statusLoading = false)"
    >
      <div class="switch-dialog-content" v-loading="statusLoading">
        <div class="selected-count">
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个管网路段
        </div>
        <div class="status-select">
          <span class="label">目标监测状态：</span>
          <el-radio-group v-model="switchStatus" class="ml-2">
            <el-radio label="运行中">运行中</el-radio>
            <el-radio label="已停止">已停止</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="switchDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSwitchConfirm"
            :loading="statusLoading"
          >
            确认切换
          </el-button>
        </span>
      </template>
    </el-dialog>

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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="搜索" icon-name="Search" @click="handleSerachShow" />
          <IconButton content="导出实时数据" icon-name="Download" @click="handleExport" />
          <IconButton
            content="启动/停止批量监测"
            icon-name="Switch" 
            :disabled="isEmpty(checkedIds)"
            @click="switchOpen"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #pipeRoad="{ row }">
        <el-text
          @click="handlePipeRoadClick(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.pipeRoad }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleAreaNameClick(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #deviceCode="{ row }">
        <el-text
          @click="handleDeviceDetail(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.deviceCode }}
        </el-text>
      </template>
      <template #deviceStatus="{ row }">
        <el-text 
          @click="handleDeviceStatusClick(row)"
          class="common-align cursor-pointer"
          :type="row.deviceStatus === '在线' ? 'success' : row.deviceStatus === '离线' ? 'danger' : 'warning'"
        >
          {{ row.deviceStatus }}
        </el-text>
      </template>
      <template #monitorStatus="{ row }">
        <div class="monitor-status-container">
          <el-switch
            v-model="row.monitorStatus"
            active-value="运行中"
            inactive-value="已停止"
            active-text="运行中"
            inactive-text="已停止"
            active-color="#10b981"
            inactive-color="#ef4444"
            @change="handleMonitorStatusChange(row)"
          />
        </div>
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
            content="删除"
            icon-name="Delete"
            color="#F56C6C"
            @click="handleDelete(row)"
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

<style scoped lang="scss">
.table-toolbar-tools {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-wrap: wrap;
  
  .icon-button {
    flex-shrink: 0;
    font-size: 12px;
    padding: 2px 8px;
  }
}

// 批量切换状态弹窗样式
.switch-dialog-content {
  padding: 20px 0;

  .selected-count {
    margin-bottom: 20px;
    font-size: 14px;
    color: #606266;

    .count-num {
      font-weight: 600;
      color: #1989fa;
    }
  }

  .status-select {
    font-size: 14px;

    .label {
      font-weight: 500;
      color: #303133;
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 按钮禁用样式优化
:deep(.common-toolbar-tools) {
  .el-button.is-disabled {
    opacity: 0.6;
  }
}

// 可点击元素样式
.cursor-pointer {
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
}

// 监测状态容器样式
.monitor-status-container {
  cursor: pointer;
  padding: 4px 0;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
}
</style>
