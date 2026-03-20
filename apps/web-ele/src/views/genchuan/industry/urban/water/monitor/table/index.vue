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

import { dataList, useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import ParkDetailDrawer from './detail.vue';
// 引入标注泄漏范围组件
import LeakageRangeDrawer from './leakageRange.vue';

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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, '导出', 'excel');
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
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 检查数据是否超标并触发预警
const checkAndTriggerWarning = (data) => {
  // 定义阈值范围
  const thresholds = {
    pipePressure: { min: 0.3, max: 0.6 },
    pipeFlow: { min: 80, max: 150 },
  };

  // 检查每个数据项
  data.forEach((item) => {
    // 检查压力是否超标
    if (
      item.pipePressure < thresholds.pipePressure.min ||
      item.pipePressure > thresholds.pipePressure.max
    ) {
      // 触发压力异常预警
      ElMessage.warning(
        `【预警】${item.pipeArea} - 管网压力异常: ${item.pipePressure} MPa`,
      );
    }

    // 检查流量是否超标
    if (
      item.pipeFlow < thresholds.pipeFlow.min ||
      item.pipeFlow > thresholds.pipeFlow.max
    ) {
      // 触发流量异常预警
      ElMessage.warning(
        `【预警】${item.pipeArea} - 管网流量异常: ${item.pipeFlow} m³/h`,
      );
    }

    // 检查泄漏状态
    if (item.leakStatus !== '正常') {
      // 触发泄漏预警（优先级高于压力/流量异常）
      ElMessage.error(`【预警】${item.pipeArea} - ${item.leakStatus}`);
    }
  });
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
      if (
        dataObj.serachObj.pipeArea &&
        !v.pipeArea.includes(dataObj.serachObj.pipeArea)
      ) {
        return false;
      }

      if (
        dataObj.serachObj.leakStatus &&
        v.leakStatus !== dataObj.serachObj.leakStatus
      ) {
        return false;
      }

      if (
        dataObj.serachObj.deviceStatus &&
        v.deviceStatus !== dataObj.serachObj.deviceStatus
      ) {
        return false;
      }

      if (
        dataObj.serachObj.monitorStatus &&
        v.monitorStatus !== dataObj.serachObj.monitorStatus
      ) {
        return false;
      }

      return true;
    });

    // 检查数据并触发预警
    checkAndTriggerWarning(filteredData);

    dataObj.total = filteredData.length;
    dataObj.list = filteredData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
    return dataObj;
  });
};

const [QueryForm] = useVbenForm({
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
  schema: useFormSchema().map((v) => {
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

// 点击管网分区筛选同分区监测数据
const handlePipeAreaClick = (row) => {
  // 筛选同分区的数据
  dataObj.serachObj.pipeArea = row.pipeArea;
  // 刷新表格
  gridApi.reload();
  console.log('筛选同分区数据:', row.pipeArea);
};

// 点击泄漏状态筛选同状态监测数据
const handleLeakStatusClick = (row) => {
  // 筛选同状态的数据
  dataObj.serachObj.leakStatus = row.leakStatus;
  // 刷新表格
  gridApi.reload();
  console.log('筛选同泄漏状态数据:', row.leakStatus);
};

// 点击设备在线状态筛选同在线状态监测点
const handleDeviceStatusClick = (row) => {
  // 筛选同在线状态的数据
  dataObj.serachObj.deviceStatus = row.deviceStatus;
  // 刷新表格
  gridApi.reload();
  console.log('筛选同设备在线状态数据:', row.deviceStatus);
};

// 点击监测状态筛选同监测状态分区
const handleMonitorStatusClick = (row) => {
  // 筛选同监测状态的数据
  dataObj.serachObj.monitorStatus = row.monitorStatus;
  // 刷新表格
  gridApi.reload();
  console.log('筛选同监测状态数据:', row.monitorStatus);
};

// 打开标注泄漏范围抽屉
const handleLeakageRange = () => {
  leakageRangeDrawerRef.value.open();
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
    ElMessage.warning('请先选择需要切换状态的管网分区！');
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
  { label: '启用' },
  { label: '禁用' },
  { label: '暂停运营' },
  { label: '维修中' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.label).length})`;
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
const leakageRangeDrawerRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
</script>

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
    <!-- 使用标注泄漏范围抽屉组件 -->
    <LeakageRangeDrawer ref="leakageRangeDrawerRef" :visible="false" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="switchOpen"
          />
          <IconButton
            content="标注泄漏范围"
            icon-name="Location"
            @click="handleLeakageRange"
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
      <!-- 管网分区 -->
      <template #pipeArea="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.pipeArea }}
        </el-text>
      </template>
      <!-- 管网压力 -->
      <template #pipePressure="{ row }">
        <el-text
          class="common-align"
          :type="
            row.pipePressure < 0.3 || row.pipePressure > 0.6
              ? 'danger'
              : 'default'
          "
        >
          {{ row.pipePressure }}
        </el-text>
      </template>
      <!-- 管网流量 -->
      <template #pipeFlow="{ row }">
        <el-text
          class="common-align"
          :type="row.pipeFlow < 80 || row.pipeFlow > 150 ? 'danger' : 'default'"
        >
          {{ row.pipeFlow }}
        </el-text>
      </template>
      <!-- 泄漏状态 -->
      <template #leakStatus="{ row }">
        <el-text
          class="common-align"
          :type="
            row.leakStatus === '正常'
              ? 'success'
              : row.leakStatus === '疑似泄漏'
                ? 'warning'
                : 'danger'
          "
          @click="handleLeakStatusClick(row)"
        >
          {{ row.leakStatus }}
        </el-text>
      </template>
      <!-- 监测设备编号 -->
      <template #deviceCode="{ row }">
        <el-text
          @click="handleDeviceDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceCode }}
        </el-text>
      </template>
      <!-- 设备在线状态 -->
      <template #deviceStatus="{ row }">
        <el-text
          class="common-align"
          :type="
            row.deviceStatus === '在线'
              ? 'success'
              : row.deviceStatus === '离线'
                ? 'danger'
                : 'warning'
          "
          @click="handleDeviceStatusClick(row)"
        >
          {{ row.deviceStatus }}
        </el-text>
      </template>
      <!-- 监测状态 -->
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
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="edit"
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
