<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
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
  // 强制重新加载数据
  gridApi.reload();
}

/** 导出表格 */
async function handleExport() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  exportToExcel(dataObj.apilist, `供热管网实时监测_${dateStr}_${timeStr}`, 'excel');
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
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
}
const checkedIds = ref([]);
const recordsList = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}

// 触发预警
const triggerWarning = (data, riskType) => {
  // 生成预警ID
  const warningId = Date.now().toString();
  
  // 构建预警信息
  const warningInfo = {
    id: warningId,
    heatArea: data.heatArea,
    deviceCode: data.deviceCode,
    riskType: riskType,
    riskLevel: '高风险',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: '未处理'
  };
  
  // 模拟预警触发
  console.log('触发预警:', warningInfo);
  
  // 显示预警通知
  ElMessage({
    message: `【预警】${data.heatArea} - ${riskType}`,
    type: 'error',
    duration: 5000,
    showClose: true
  });
  
  return warningInfo;
};

// 检测指标是否超标并触发预警
const checkAndTriggerWarning = (data, shouldTrigger = true) => {
  if (!shouldTrigger) {
    return;
  }
  
  // 温差超标检测
  const tempDiffThreshold = data.seasonType === '冬季' ? data.winterTempDiffThreshold : data.nonWinterTempDiffThreshold;
  const tempDiffMatch = tempDiffThreshold.match(/^(\d+)-(\d+)℃$/);
  if (tempDiffMatch) {
    const tempMin = parseFloat(tempDiffMatch[1]);
    const tempMax = parseFloat(tempDiffMatch[2]);
    if (data.tempDifference < tempMin || data.tempDifference > tempMax) {
      triggerWarning(data, '供回水温差超标');
      data.warnStatus = '异常';
    }
  }
  
  // 压力超标检测
  const pressureMatch = data.pipePressureThreshold.match(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)/);
  if (pressureMatch) {
    const pressureMin = parseFloat(pressureMatch[1]);
    const pressureMax = parseFloat(pressureMatch[3]);
    if (data.pipePressure < pressureMin || data.pipePressure > pressureMax) {
      triggerWarning(data, '管网压力超标');
      data.warnStatus = '异常';
    }
  }
  
  // 流量超标检测
  const flowMatch = data.pipeFlowThreshold.match(/^(\d+)-(\d+)/);
  if (flowMatch) {
    const flowMin = parseFloat(flowMatch[1]);
    const flowMax = parseFloat(flowMatch[2]);
    if (data.pipeFlow < flowMin || data.pipeFlow > flowMax) {
      triggerWarning(data, '管网流量超标');
      data.warnStatus = '异常';
    }
  }
  
  // 设备离线检测
  if (data.deviceStatus === '离线') {
    triggerWarning(data, '设备离线');
    data.warnStatus = '异常';
  }
};

// 初始加载标识
const isInitialLoad = ref(true);

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
const getTableData = (pageObj) => {
  const page = pageObj.page;
  
  // 使用本地数据模拟，实际应用应该从 API 获取
  const filteredData = dataObj.apilist
    .map((v) => {
      // 检测指标是否超标并触发预警，初始加载时触发，筛选时不触发
      checkAndTriggerWarning(v, isInitialLoad.value);
      return v;
    })
    .filter((v) => {
      // 监测状态过滤（tabs 筛选）
      if (activeName.value !== '全部' && v.monitorStatus !== activeName.value) {
        return false;
      }
      
      // 搜索条件过滤
      if (dataObj.serachObj.heatArea && !v.heatArea.includes(dataObj.serachObj.heatArea)) {
        return false;
      }
      
      if (dataObj.serachObj.seasonType && v.seasonType !== dataObj.serachObj.seasonType) {
        return false;
      }
      
      if (dataObj.serachObj.deviceStatus && v.deviceStatus !== dataObj.serachObj.deviceStatus) {
        return false;
      }
      
      // 预警状态过滤
      if (dataObj.serachObj.warnStatus && v.warnStatus !== dataObj.serachObj.warnStatus) {
        return false;
      }
      
      return true;
    });
  
  dataObj.total = filteredData.length;
  dataObj.list = filteredData.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  
  // 初始加载完成后，设置为false，后续筛选操作不触发预警
  if (isInitialLoad.value) {
    isInitialLoad.value = false;
  }
  
  return dataObj;
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
    ElMessage.warning('请先选择需要切换状态的供热区域！');
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
      if (recordsList.value.map(r => r.id).includes(item.id)) {
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

// 新增：切换季节阈值
async function handleSeasonThreshold() {
  // 打开季节阈值切换对话框
  const { value } = await ElMessageBox.prompt(
    '请选择目标季节类型',
    '切换季节阈值',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入季节类型（冬季/夏季/春季/秋季）',
      inputValidator: (value) => {
        if (!value) {
          return '请输入季节类型';
        }
        if (!['冬季', '夏季', '春季', '秋季'].includes(value)) {
          return '季节类型必须是：冬季/夏季/春季/秋季';
        }
        return true;
      }
    }
  );
  
  if (value) {
    // 显示确认对话框
    const confirmed = await confirm(`确定将所有供热区域的季节阈值切换为 ${value} 吗？`);
    if (confirmed) {
      const loadingInstance = ElLoading.service({
        text: '切换季节阈值中...',
      });
      
      try {
        // 模拟切换季节阈值 - 参考 street 批量开关路灯的实现
        dataObj.apilist = dataObj.apilist.map(item => ({
          ...item,
          seasonType: value,
          seasonSwitch: value === '冬季' ? '开启' : '关闭'
        }));
        
        ElMessage.success(`季节阈值已切换为 ${value}`);
        // 刷新表格 - 完全重新加载
        setTimeout(() => {
          gridApi.reload();
        }, 100);
      } catch (error) {
        ElMessage.error('切换季节阈值失败，请重试');
        console.error('切换季节阈值失败:', error);
      } finally {
        loadingInstance.close();
      }
    }
  }
}

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

// 点击供热区域查看详细信息
const handleHeatAreaClick = (row) => {
  dataObj.detailObj = row;
  // 通过 ref 调用组件的 open 方法
  parkDetailDrawerRef.value.open();
  console.log(row);
};

// 设备详情
const handleDeviceDetail = (row) => {
  ElMessage.success(`查看设备详情：${row.deviceCode}`);
  // 更新设备详情对象
  dataObj.deviceDetailObj = row;
  // 打开设备详情抽屉
  deviceDetailDrawerRef.value.open();
};

// 筛选同季节监测配置
const handleFilterBySeasonType = (seasonType) => {
  ElMessage.success(`筛选季节类型：${seasonType}`);
  // 更新筛选条件
  dataObj.serachObj.seasonType = seasonType;
  // 刷新表格
  gridApi.query();
};

// 筛选同在线状态监测点
const handleFilterByDeviceStatus = (deviceStatus) => {
  ElMessage.success(`筛选设备状态：${deviceStatus}`);
  // 更新筛选条件
  dataObj.serachObj.deviceStatus = deviceStatus;
  // 刷新表格
  gridApi.query();
};



// 筛选待预警区域
const handleFilterByWarnStatus = (warnStatus) => {
  ElMessage.success(`筛选预警状态：${warnStatus}`);
  // 更新筛选条件
  dataObj.serachObj.warnStatus = warnStatus;
  // 刷新表格
  gridApi.query();
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
</style>

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
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个供热区域
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
          <IconButton content="切换季节阈值" icon-name="Calendar" @click="handleSeasonThreshold" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #heatArea="{ row }">
        <el-text
          @click="handleHeatAreaClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.heatArea }}
        </el-text>
      </template>
      <template #seasonType="{ row }">
        <el-text 
          @click="handleFilterBySeasonType(row.seasonType)"
          class="common-align"
          type="primary"
        >
          {{ row.seasonType }}
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
          :type="row.deviceStatus === '在线' ? 'success' : row.deviceStatus === '离线' ? 'danger' : 'warning'"
        >
          {{ row.deviceStatus }}
        </el-text>
      </template>
      <template #monitorStatus="{ row }">
        <div>
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
      <template #warnStatus="{ row }">
        <el-text 
          @click="handleFilterByWarnStatus(row.warnStatus)"
          class="common-align"
          :type="row.warnStatus === '正常' ? 'success' : 'danger'"
        >
          {{ row.warnStatus }}
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
