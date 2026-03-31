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
// 引入预警方式配置组件
import WarnConfig from './warnConfig.vue';
// 引入监测参数配置组件
import settingTable from './settingTable.vue';


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

// 新增：批量切换状态弹窗相关
const switchDialogVisible = ref(false);
const switchStatus = ref('运行中'); // 默认切换为运行中
const statusLoading = ref(false); // 批量操作加载状态

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
    labelWidth: 120,
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
    
    // 1. 设备编号唯一性校验
    if (formDrawerApi.sharedData.payload.title === '新增') {
      const existingDeviceCode = dataObj.apilist.find(item => item.deviceCode === obj.deviceCode);
      if (existingDeviceCode) {
        ElMessage.error('设备编号已存在，请使用其他编号');
        return;
      }
    } else {
      const existingDeviceCode = dataObj.apilist.find(item => item.deviceCode === obj.deviceCode && item.id !== formData.value?.id);
      if (existingDeviceCode) {
        ElMessage.error('设备编号已存在，请使用其他编号');
        return;
      }
    }
    
    // 2. 阈值合理性校验
    // 温度阈值校验
    const tempMatch = obj.tempThreshold.match(/^(\d+)-(\d+)℃$/);
    if (!tempMatch) {
      ElMessage.error('温度阈值格式不正确，请使用如：20-30℃ 的格式');
      return;
    }
    const tempMin = parseFloat(tempMatch[1]);
    const tempMax = parseFloat(tempMatch[2]);
    if (tempMin >= tempMax) {
      ElMessage.error('温度阈值最小值必须小于最大值');
      return;
    }
    
    // 湿度阈值校验
    const humidityMatch = obj.humidityThreshold.match(/^(\d+)-(\d+)%$/);
    if (!humidityMatch) {
      ElMessage.error('湿度阈值格式不正确，请使用如：40-70% 的格式');
      return;
    }
    const humidityMin = parseFloat(humidityMatch[1]);
    const humidityMax = parseFloat(humidityMatch[2]);
    if (humidityMin >= humidityMax) {
      ElMessage.error('湿度阈值最小值必须小于最大值');
      return;
    }
    if (humidityMin < 0 || humidityMax > 100) {
      ElMessage.error('湿度阈值范围必须在0-100%之间');
      return;
    }
    
    // 燃气浓度阈值校验
    const gasMatch = obj.gasThreshold.match(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)$/);
    if (!gasMatch) {
      ElMessage.error('燃气浓度阈值格式不正确，请使用如：0-0.5 的格式');
      return;
    }
    const gasMin = parseFloat(gasMatch[1]);
    const gasMax = parseFloat(gasMatch[3]);
    if (gasMin >= gasMax) {
      ElMessage.error('燃气浓度阈值最小值必须小于最大值');
      return;
    }
    if (gasMin < 0) {
      ElMessage.error('燃气浓度阈值最小值不能小于0');
      return;
    }
    
    if (formDrawerApi.sharedData.payload.title === '新增') {
      // 为新增数据生成唯一ID
      obj.id = String(dataObj.apilist.length + 1);
      // 设置默认值
      obj.galleryTemp = 25.0;
      obj.galleryHumidity = 60;
      obj.gasConcentration = 0.1;
      obj.smokeStatus = '正常';
      obj.monitorStatus = '已停止';
      obj.syncDuration = 3;
      obj.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = { ...v, ...obj };
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
  exportToExcel(dataObj.apilist, `综合管廊实时监测_${dateStr}_${timeStr}`, 'excel');
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

const recordsList = ref([]);
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
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
// 计算数据同步时长
const calculateSyncDuration = (updateTime) => {
  if (!updateTime) return 0;
  const now = new Date();
  const updateDate = new Date(updateTime);
  const diffSeconds = Math.floor((now - updateDate) / 1000);
  return diffSeconds;
};

// 触发预警
const triggerWarning = (data, riskType, shouldTrigger = true) => {
  if (!shouldTrigger) {
    return;
  }
  
  // 生成预警ID
  const warningId = Date.now().toString();
  
  // 构建预警信息
  const warningInfo = {
    id: warningId,
    gallerySection: data.gallerySection,
    deviceCode: data.deviceCode,
    riskType: riskType,
    riskLevel: '高风险',
    warnWay: data.warnWay || '平台弹窗',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: '未处理'
  };
  
  // 模拟预警触发
  console.log('触发预警:', warningInfo);
  
  // 显示预警通知
  ElMessage({
    message: `【预警】${data.gallerySection} - ${riskType}`,
    type: 'error',
    duration: 5000,
    showClose: true
  });
  
  // 这里可以添加实际的预警处理逻辑，如发送短信、声光报警等
  if (data.warnWay === '短信') {
    console.log('发送短信预警:', warningInfo);
  } else if (data.warnWay === '声光') {
    console.log('触发声光预警:', warningInfo);
  }
  
  return warningInfo;
};

// 计算安全风险等级
const calculateRiskLevel = (data, shouldTriggerWarning = true) => {
  let riskLevel = '低风险';
  
  // 燃气浓度风险判断
  if (data.gasConcentration > 0.5) {
    // 触发燃气浓度超标预警
    triggerWarning(data, '燃气浓度超标', shouldTriggerWarning);
    return '高风险';
  } else if (data.gasConcentration > 0.3) {
    riskLevel = '中风险';
  }
  
  // 烟感状态风险判断
  if (data.smokeStatus === '报警') {
    // 触发烟感报警预警
    triggerWarning(data, '烟感报警', shouldTriggerWarning);
    return '高风险';
  }
  
  // 温度风险判断
  if (data.galleryTemp > 35 || data.galleryTemp < 0) {
    // 触发温度异常预警
    triggerWarning(data, '温度异常', shouldTriggerWarning);
    return '高风险';
  } else if (data.galleryTemp > 30 || data.galleryTemp < 5) {
    riskLevel = '中风险';
  }
  
  // 湿度风险判断
  if (data.galleryHumidity > 80 || data.galleryHumidity < 20) {
    // 触发湿度异常预警
    triggerWarning(data, '湿度异常', shouldTriggerWarning);
    return '高风险';
  } else if (data.galleryHumidity > 70 || data.galleryHumidity < 30) {
    riskLevel = '中风险';
  }
  
  // 设备状态风险判断
  if (data.deviceStatus === '离线') {
    riskLevel = '中风险';
  }
  
  // 数据同步时长风险判断
  const syncDuration = calculateSyncDuration(data.updateTime);
  if (syncDuration > 3600) { // 超过1小时未更新
    // 触发数据同步异常预警
    triggerWarning(data, '数据同步异常', shouldTriggerWarning);
    return '高风险';
  } else if (syncDuration > 1800) { // 超过30分钟未更新
    riskLevel = '中风险';
  }
  
  return riskLevel;
};

// 初始加载标识
const isInitialLoad = ref(true);

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  
  // 过滤数据并计算同步时长和风险等级
  const filteredData = dataObj.apilist
    .map((v) => {
      // 自动计算同步时长
      const syncDuration = calculateSyncDuration(v.updateTime);
      // 自动计算安全风险等级，初始加载时触发预警，筛选时不触发
      const riskLevel = calculateRiskLevel({ ...v, syncDuration }, isInitialLoad.value);
      return {
        ...v,
        syncDuration,
        riskLevel
      };
    })
    .filter((v) => {
      // 监测状态过滤
      if (activeName.value !== '全部' && v.monitorStatus !== activeName.value) {
        return false;
      }
      
      // 管廊区段过滤
      if (filterFormData.value.gallerySection && !v.gallerySection.includes(filterFormData.value.gallerySection)) {
        return false;
      }
      
      // 监测设备编号过滤
      if (filterFormData.value.deviceCode && !v.deviceCode.includes(filterFormData.value.deviceCode)) {
        return false;
      }
      
      // 烟感状态过滤
      if (filterFormData.value.smokeStatus && v.smokeStatus !== filterFormData.value.smokeStatus) {
        return false;
      }
      
      // 设备在线状态过滤
      if (filterFormData.value.deviceStatus && v.deviceStatus !== filterFormData.value.deviceStatus) {
        return false;
      }
      
      // 监测状态过滤
      if (filterFormData.value.monitorStatus && v.monitorStatus !== filterFormData.value.monitorStatus) {
        return false;
      }
      
      // 预警方式过滤
      if (filterFormData.value.warnWay && v.warnWay !== filterFormData.value.warnWay) {
        return false;
      }
      
      // 安全风险等级过滤
      if (filterFormData.value.riskLevel && v.riskLevel !== filterFormData.value.riskLevel) {
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
  
  // 初始加载完成后，设置为false，后续筛选操作不触发预警
  if (isInitialLoad.value) {
    isInitialLoad.value = false;
  }
  
  return dataObj;
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
  schema: useFilterFormSchema().map((v) => {
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
  filterFormData.value = QueryFormApi.form.values;
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
      // 行样式，根据安全风险等级高亮显示
      rowClass: ({ row }) => {
        if (row.riskLevel === '高风险') {
          return 'high-risk-row';
        } else if (row.riskLevel === '中风险') {
          return 'medium-risk-row';
        }
        return '';
      },
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

// 筛选同管廊区段监测数据
const handleFilterByGallerySection = (gallerySection) => {
  ElMessage.success(`筛选管廊区段：${gallerySection}`);
  // 更新筛选条件
  filterFormData.value.gallerySection = gallerySection;
  // 刷新表格
  gridApi.query();
};

// 筛选同烟感状态管廊
const handleFilterBySmokeStatus = (smokeStatus) => {
  ElMessage.success(`筛选烟感状态：${smokeStatus}`);
  // 更新筛选条件
  filterFormData.value.smokeStatus = smokeStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选同在线状态管廊
const handleFilterByDeviceStatus = (deviceStatus) => {
  ElMessage.success(`筛选设备状态：${deviceStatus}`);
  // 更新筛选条件
  filterFormData.value.deviceStatus = deviceStatus;
  // 刷新表格
  gridApi.query();
};

// 筛选同监测状态管廊
const handleFilterByMonitorStatus = (monitorStatus) => {
  ElMessage.success(`筛选监测状态：${monitorStatus}`);
  // 更新筛选条件
  activeName.value = monitorStatus;
  // 刷新表格
  gridApi.query();
};

// 单个状态切换
const handleMonitorStatusChange = (row) => {
  ElMessage.success(`切换监测状态：${row.monitorStatus}`);
  // 这里可以添加 API 调用更新状态
  // 数据已经通过 v-model 更新了
};

// 筛选同预警方式管廊
const handleFilterByWarnWay = (warnWay) => {
  ElMessage.success(`筛选预警方式：${warnWay}`);
  // 更新筛选条件
  filterFormData.value.warnWay = warnWay;
  // 刷新表格
  gridApi.query();
};

// 筛选同风险等级管廊
const handleFilterByRiskLevel = (riskLevel) => {
  ElMessage.success(`筛选风险等级：${riskLevel}`);
  // 更新筛选条件
  filterFormData.value.riskLevel = riskLevel;
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
const warnConfigRef = ref(null);

// 新增：批量切换状态弹窗打开方法
const switchOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要切换状态的管廊区段！');
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
    // 模拟批量更新状态并同步设备状态
    dataObj.apilist.forEach(item => {
      if (recordsList.value.map(r => r.id).includes(item.id)) {
        item.monitorStatus = switchStatus.value;
        // 同步设备状态：运行中时设备在线，已停止时设备离线
        if (switchStatus.value === '运行中') {
          item.deviceStatus = '在线';
        } else if (switchStatus.value === '已停止') {
          item.deviceStatus = '离线';
        }
        // 更新最近更新时间
        item.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
    });
    
    ElMessage.success(`批量切换状态成功，已同步设备状态`);
    statusLoading.value = false;
    switchDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量切换状态失败，请重试');
    statusLoading.value = false;
    console.error('批量切换状态失败:', error);
  }
};

// 配置预警方式
function handleWarnConfig() {
  // 打开预警方式配置抽屉
  warnConfigRef.value.open();
}

// 处理预警方式配置保存
function handleWarnConfigSave(values) {
  // 实现预警方式与监测数据的实际关联
  const { gallerySection, warnWay } = values;
  
  // 更新对应管廊区段的预警方式
  let updated = false;
  dataObj.apilist.forEach((item) => {
    if (item.gallerySection === gallerySection) {
      item.warnWay = warnWay;
      updated = true;
    }
  });
  
  if (updated) {
    ElMessage.success('预警方式配置成功，已更新对应管廊区段的预警方式');
  } else {
    ElMessage.warning('未找到对应管廊区段的数据');
  }
  
  // 刷新表格
  handleRefresh();
}

// 配置监测参数
const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    configDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

function handleConfigMonitor() {
  configDrawerApi.open();
}

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

.config-monitor-content {
  padding: 20px;
  
  p {
    margin: 0;
    color: #666;
    text-align: center;
    line-height: 1.5;
  }
}

// 高风险行高亮样式
:deep(.high-risk-row) {
  background-color: #fef2f2 !important;
  border-left: 4px solid #ef4444 !important;
}

// 中风险行高亮样式
:deep(.medium-risk-row) {
  background-color: #fffbeb !important;
  border-left: 4px solid #f59e0b !important;
}
</style>

<template>
  <div class="park-lot-table-new">
    <!-- 新增：批量切换监测状态弹窗 -->
    <el-dialog
      v-model="switchDialogVisible"
      title="批量切换监测状态"
      width="400px"
      :close-on-click-modal="false"
      :before-close="() => (statusLoading = false)"
    >
      <div class="switch-dialog-content" v-loading="statusLoading">
        <div class="selected-count">
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个管廊区段
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
    <!-- 预警方式配置抽屉组件 -->
    <WarnConfig
      ref="warnConfigRef"
      @save="handleWarnConfigSave"
      @close="() => {}"
    />
    <!-- 配置监测参数抽屉组件 -->
    <ConfigDrawer title="配置监测参数" class="genchuan-detail-drawer">
      <settingTable @close="configDrawerApi.close()" />
    </ConfigDrawer>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #monitorStatus="{ row }">
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
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="筛选" icon-name="Filter" @click="handleSerachShow" />
          <IconButton content="配置监测参数" icon-name="Setting" @click="handleConfigMonitor" />
          <IconButton content="导出实时数据" icon-name="Download" @click="handleExport" />
          <IconButton
            content="启动/停止批量监测"
            icon-name="Switch" 
            :disabled="isEmpty(checkedIds)"
            @click="switchOpen"
          />
          <IconButton content="配置预警方式" icon-name="Warning" @click="handleWarnConfig" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #gallerySection="{ row }">
        <el-text
          @click="handleFilterByGallerySection(row.gallerySection)"
          class="common-align"
          type="primary"
        >
          {{ row.gallerySection }}
        </el-text>
      </template>
      <template #smokeStatus="{ row }">
        <el-text 
          @click="handleFilterBySmokeStatus(row.smokeStatus)"
          class="common-align"
          :type="row.smokeStatus === '正常' ? 'success' : 'danger'"
        >
          {{ row.smokeStatus }}
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
      <template #warnWay="{ row }">
        <el-text 
          @click="handleFilterByWarnWay(row.warnWay)"
          class="common-align"
          :type="row.warnWay === '平台弹窗' ? 'primary' : row.warnWay === '短信' ? 'warning' : 'danger'"
        >
          {{ row.warnWay }}
        </el-text>
      </template>
      <template #riskLevel="{ row }">
        <el-text 
          @click="handleFilterByRiskLevel(row.riskLevel)"
          class="common-align"
          :type="row.riskLevel === '低风险' ? 'success' : row.riskLevel === '中风险' ? 'warning' : 'danger'"
        >
          {{ row.riskLevel }}
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
            icon-name="delete"
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