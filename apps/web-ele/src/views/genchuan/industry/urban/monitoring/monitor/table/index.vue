<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import IconButton from '#/components/common/IconButton.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  useFilterFormSchema,
  useFormSchema,
  useGridColumns,
} from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';
// 引入设备详情抽屉组件
import DeviceDetailDrawer from './deviceDetail.vue';
// 引入配置监测参数组件
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

// 触发预警
const triggerWarning = (data, riskType) => {
  // 生成预警ID
  const warningId = Date.now().toString();

  // 构建预警信息
  const warningInfo = {
    id: warningId,
    coverNo: data.coverNo,
    roadName: data.roadName,
    riskType,
    riskLevel: '高风险',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: '未处理',
  };

  // 模拟预警触发
  console.log('触发预警:', warningInfo);

  // 显示预警通知
  ElMessage({
    message: `【预警】${data.roadName} - ${riskType}`,
    type: 'error',
    duration: 5000,
    showClose: true,
  });

  return warningInfo;
};

// 检测指标是否超标并触发预警
const checkAndTriggerWarning = (data, shouldTrigger = true) => {
  if (!shouldTrigger) {
    return;
  }

  // 开合状态异常检测
  if (data.openStatus === '开启') {
    triggerWarning(data, '井盖异常开启');
  }

  // 倾斜角度超标检测
  const tiltMatch = data.tiltAngleThreshold.match(/^(\d+)-(\d+)度$/);
  if (tiltMatch) {
    const tiltMax = Number.parseFloat(tiltMatch[2]);
    if (data.tiltAngle > tiltMax) {
      triggerWarning(data, '倾斜角度超标');
    }
  }

  // 异常振动检测
  if (data.abnormalVibrationFlag === '是') {
    triggerWarning(data, '异常振动');
  }

  // 设备离线检测
  if (data.deviceStatus === '离线' || data.deviceStatus === '异常') {
    triggerWarning(data, '设备状态异常');
  }
};

// 初始加载标识
const isInitialLoad = ref(true);

// 触发预警
const triggerWarning = (data, riskType) => {
  // 生成预警ID
  const warningId = Date.now().toString();

  // 构建预警信息
  const warningInfo = {
    id: warningId,
    coverNo: data.coverNo,
    roadName: data.roadName,
    riskType,
    riskLevel: '高风险',
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    status: '未处理',
  };

  // 模拟预警触发
  console.log('触发预警:', warningInfo);

  // 显示预警通知
  ElMessage({
    message: `【预警】${data.roadName} - ${riskType}`,
    type: 'error',
    duration: 5000,
    showClose: true,
  });

  return warningInfo;
};

// 检测指标是否超标并触发预警
const checkAndTriggerWarning = (data, shouldTrigger = true) => {
  if (!shouldTrigger) {
    return;
  }

  // 开合状态异常检测
  if (data.openStatus === '开启') {
    triggerWarning(data, '井盖异常开启');
  }

  // 倾斜角度超标检测
  const tiltMatch = data.tiltAngleThreshold.match(/^(\d+)-(\d+)度$/);
  if (tiltMatch) {
    const tiltMax = Number.parseFloat(tiltMatch[2]);
    if (data.tiltAngle > tiltMax) {
      triggerWarning(data, '倾斜角度超标');
    }
  }

  // 异常振动检测
  if (data.abnormalVibrationFlag === '是') {
    triggerWarning(data, '异常振动');
  }

  // 设备离线检测
  if (data.deviceStatus === '离线' || data.deviceStatus === '异常') {
    triggerWarning(data, '设备状态异常');
  }
};

// 初始加载标识
const isInitialLoad = ref(true);

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
      // 为新增数据生成唯一 ID
      const newId = String(Date.now());
      obj.id = newId;
      // 设置所有必要的默认值
      obj.openStatus = '关闭'; // 开合状态默认值
      obj.tiltAngle = 0; // 倾斜角度默认值
      obj.vibrationData = 0; // 振动数据默认值
      obj.deviceStatus = '在线'; // 设备在线状态默认值
      obj.monitorStatus = '已停止'; // 监测状态默认值
      obj.riskLevel = '低风险'; // 风险等级默认值
      obj.abnormalVibrationFlag = '否'; // 异常振动标识默认值
      obj.syncDuration = 3; // 同步时长默认值
      obj.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // 更新时间
      // 添加到数据源 - 使用扩展运算符创建新数组，确保响应式更新
      dataObj.apilist = [obj, ...dataObj.apilist];
    } else {
      dataObj.apilist = dataObj.apilist.map((item) => {
        if (item.id === formData.value?.id) {
          return { ...item, ...obj };
        }
        return item;
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
  // 刷新表格，保留本地修改的数据
  gridApi.query();
}

// 处理配置监测参数组件的数据更新
function handleUpdateData(updatedList) {
  if (updatedList && updatedList.length > 0) {
    dataObj.apilist = updatedList;
    handleRefresh();
  }
}

/** 导出表格 */
async function handleExport() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replaceAll(':', '-');
  exportToExcel(
    dataObj.apilist,
    `窨井盖设施实时监测_${dateStr}_${timeStr}`,
    'excel',
  );
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
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 直接使用 dataObj.apilist 的当前值（包含所有新增/编辑/删除后的数据）
  const filteredData = dataObj.apilist
    .map((v) => {
      // 检测指标是否超标并触发预警，初始加载时触发，筛选时不触发
      checkAndTriggerWarning(v, isInitialLoad.value);
      return v;
    })
    .filter((v) => {
      // 监测状态过滤
      if (activeName.value !== '全部' && v.monitorStatus !== activeName.value) {
        return false;
      }

      // 井盖编号过滤
      if (
        filterFormData.value.coverNo &&
        !v.coverNo.includes(filterFormData.value.coverNo)
      ) {
        return false;
      }

      // 路段名称过滤
      if (
        filterFormData.value.roadName &&
        !v.roadName.includes(filterFormData.value.roadName)
      ) {
        return false;
      }

      // 开合状态过滤
      if (
        filterFormData.value.openStatus &&
        v.openStatus !== filterFormData.value.openStatus
      ) {
        return false;
      }

      // 设备在线状态过滤
      if (
        filterFormData.value.deviceStatus &&
        v.deviceStatus !== filterFormData.value.deviceStatus
      ) {
        return false;
      }

      // 风险等级过滤
      if (
        filterFormData.value.riskLevel &&
        v.riskLevel !== filterFormData.value.riskLevel
      ) {
        return false;
      }

      // 异常振动标识过滤
      if (
        filterFormData.value.abnormalVibrationFlag &&
        v.abnormalVibrationFlag !== filterFormData.value.abnormalVibrationFlag
      ) {
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
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
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
  gridApi.query();
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

// 筛选同路段窨井盖监测数据
const handleFilterByRoadName = (roadName) => {
  ElMessage.success(`筛选路段：${roadName}`);
  // 更新筛选条件
  filterFormData.value = {
    ...filterFormData.value,
    roadName,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同开合状态窨井盖
const handleFilterByOpenStatus = (openStatus) => {
  ElMessage.success(`筛选开合状态：${openStatus}`);
  // 更新筛选条件
  filterFormData.value = {
    ...filterFormData.value,
    openStatus,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同在线状态窨井盖
const handleFilterByDeviceStatus = (deviceStatus) => {
  ElMessage.success(`筛选设备状态：${deviceStatus}`);
  // 更新筛选条件
  filterFormData.value = {
    ...filterFormData.value,
    deviceStatus,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同监测状态窨井盖
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
  // 使用 map 方法确保响应式更新
  dataObj.apilist = dataObj.apilist.map((item) => {
    if (item.id === row.id) {
      return { ...item, monitorStatus: row.monitorStatus };
    }
    return item;
  });
  // 刷新表格
  gridApi.reload();
};

// 筛选同风险等级窨井盖
const handleFilterByRiskLevel = (riskLevel) => {
  ElMessage.success(`筛选风险等级：${riskLevel}`);
  // 更新筛选条件
  filterFormData.value = {
    ...filterFormData.value,
    riskLevel,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选异常振动窨井盖
const handleFilterByAbnormalVibration = (flag) => {
  ElMessage.success(`筛选异常振动：${flag}`);
  // 更新筛选条件
  filterFormData.value = {
    ...filterFormData.value,
    abnormalVibrationFlag: flag,
  };
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

// 新增：批量切换状态弹窗打开方法
const switchOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要切换状态的窨井盖！');
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
    dataObj.apilist.forEach((item) => {
      if (recordsList.value.map((r) => r.id).includes(item.id)) {
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
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个窨井盖
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
    <!-- 配置监测参数抽屉组件 -->
    <ConfigDrawer title="配置监测参数" class="genchuan-detail-drawer">
      <settingTable
        :data-list="dataObj.apilist"
        @close="configDrawerApi.close()"
        @update-data="handleUpdateData"
      />
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
          <IconButton
            content="筛选"
            icon-name="Filter"
            @click="handleSerachShow"
          />
          <IconButton
            content="配置监测参数"
            icon-name="Setting"
            @click="handleConfigMonitor"
          />
          <IconButton
            content="导出实时数据"
            icon-name="Download"
            @click="handleExport"
          />
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
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #coverNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.coverNo }}
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
      <template #openStatus="{ row }">
        <el-text
          @click="handleFilterByOpenStatus(row.openStatus)"
          class="common-align"
          :type="row.openStatus === '关闭' ? 'success' : 'danger'"
        >
          {{ row.openStatus }}
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
          :type="
            row.deviceStatus === '在线'
              ? 'success'
              : row.deviceStatus === '离线'
                ? 'danger'
                : 'warning'
          "
        >
          {{ row.deviceStatus }}
        </el-text>
      </template>
      <template #riskLevel="{ row }">
        <el-text
          @click="handleFilterByRiskLevel(row.riskLevel)"
          class="common-align"
          :type="
            row.riskLevel === '低风险'
              ? 'success'
              : row.riskLevel === '中风险'
                ? 'warning'
                : 'danger'
          "
        >
          {{ row.riskLevel }}
        </el-text>
      </template>
      <template #abnormalVibrationFlag="{ row }">
        <el-text
          @click="handleFilterByAbnormalVibration(row.abnormalVibrationFlag)"
          class="common-align"
          :type="row.abnormalVibrationFlag === '否' ? 'success' : 'danger'"
        >
          {{ row.abnormalVibrationFlag }}
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
          <span> 全部统计：10 条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

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
