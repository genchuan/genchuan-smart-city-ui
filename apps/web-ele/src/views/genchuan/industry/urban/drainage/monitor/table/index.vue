<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

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
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    })
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
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

// 配置监测参数
const [settingDrawer, settingdrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    settingdrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 传递选中的行数据给设置组件
      const selectedRows =
        recordsList.value.length > 0 ? recordsList.value[0] : null;
      settingdrawerApi.setData(selectedRows);
    }
  },
});

const settingConfig = () => {
  // 检查是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要配置的路段！');
    return;
  }
  settingdrawerApi.open();
};

// 单个监测状态切换
const handleMonitorStatusChange = (row) => {
  ElMessage.success(`切换监测状态：${row.monitor_status}`);
  // 使用 map 方法确保响应式更新
  dataObj.apilist = dataObj.apilist.map((item) => {
    if (item.id === row.id) {
      return { ...item, monitor_status: row.monitor_status };
    }
    return item;
  });
  // 刷新表格
  gridApi.reload();
};

// 新增：批量切换状态弹窗打开方法
const switchOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要切换状态的路段！');
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
  // 这里可以添加API调用逻辑
  recordsList.value.forEach((v) => {
    const index = dataObj.apilist.findIndex((item) => item.id === v.id);
    if (index !== -1) {
      dataObj.apilist[index].monitor_status = switchStatus.value;
    }
  });
  statusLoading.value = false;
  switchDialogVisible.value = false;
  handleRefresh();
  ElMessage.success('批量监测状态已更新');
};

// 新增：切换采集频率弹窗打开方法
const frequencyOpen = () => {
  // 校验是否选择了数据
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择需要切换采集频率的路段！');
    return;
  }

  // 重置默认值
  selectedRoads.value = checkedIds.value;
  frequencyType.value = '常规';
  // 打开弹窗
  frequencyDialogVisible.value = true;
};

// 新增：切换采集频率确认方法
const handleFrequencyConfirm = async () => {
  statusLoading.value = true;
  // 这里可以添加API调用逻辑
  recordsList.value.forEach((v) => {
    const index = dataObj.apilist.findIndex((item) => item.id === v.id);
    if (index !== -1) {
      dataObj.apilist[index].collect_frequency_type = frequencyType.value;
    }
  });
  statusLoading.value = false;
  frequencyDialogVisible.value = false;
  handleRefresh();
  ElMessage.success('采集频率已更新');
};

// 设备详情
const handleDeviceDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
};

// 筛选同路段监测数据
const handleFilterByPipeRoad = (pipeRoad) => {
  ElMessage.success(`筛选路段：${pipeRoad}`);
  // 更新筛选条件
  dataObj.serachObj = {
    ...dataObj.serachObj,
    pipe_road: pipeRoad,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同在线状态监测点
const handleFilterByDeviceStatus = (status) => {
  ElMessage.success(`筛选设备状态：${status}`);
  // 更新筛选条件
  dataObj.serachObj = {
    ...dataObj.serachObj,
    status,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同频率类型路段
const handleFilterByCollectFrequency = (collectFrequency) => {
  ElMessage.success(`筛选采集频率类型：${collectFrequency}`);
  // 更新筛选条件
  dataObj.serachObj = {
    ...dataObj.serachObj,
    collect_frequency_type: collectFrequency,
  };
  // 刷新表格
  gridApi.query();
};

// 筛选同监测状态路段
const handleFilterByMonitorStatus = (monitorStatus) => {
  ElMessage.success(`筛选监测状态：${monitorStatus}`);
  // 更新筛选条件
  dataObj.serachObj = {
    ...dataObj.serachObj,
    monitor_status: monitorStatus,
  };
  // 刷新表格
  gridApi.query();
};

// 处理设置保存事件
const handleSettingSave = (values) => {
  // 更新选中行的预警方式相关数据
  recordsList.value.forEach((row) => {
    const index = dataObj.apilist.findIndex((item) => item.id === row.id);
    if (index !== -1) {
      // 更新阈值和预警开关
      dataObj.apilist[index].pipe_level_threshold = values.pipe_level_threshold;
      dataObj.apilist[index].pipe_flow_speed_threshold =
        values.pipe_flow_speed_threshold;
      dataObj.apilist[index].rainfall_threshold = values.rainfall_threshold;
      dataObj.apilist[index].rain_warn_switch = values.rain_warn_switch;
      dataObj.apilist[index].user_name = values.user_name;
    }
  });
  // 刷新表格
  gridApi.reload();
  // 关闭设置抽屉
  settingdrawerApi.close();
};

onMounted(() => {
  const schema = useFormSchema();
  schemaData.value = schema;
});
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
    <settingDrawer title="配置监测参数" class="genchuan-detail-drawer">
      <settingTable :selected-rows="recordsList" @save="handleSettingSave" />
    </settingDrawer>
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
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
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
      <template #roadSectionName="{ row }">
        <el-text
          @click="handleFilterByPipeRoad(row.pipe_road)"
          class="common-align"
          type="primary"
        >
          {{ row.pipe_road }}
        </el-text>
      </template>
      <template #code="{ row }">
        <el-text
          @click="handleDeviceDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.code }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text
          @click="handleFilterByDeviceStatus(row.status)"
          class="common-align"
          :type="
            row.status === '在线'
              ? 'success'
              : row.status === '离线'
                ? 'danger'
                : 'warning'
          "
        >
          {{ row.status }}
        </el-text>
      </template>
      <template #collect_frequency_type="{ row }">
        <el-text
          @click="handleFilterByCollectFrequency(row.collect_frequency_type)"
          class="common-align"
          :type="
            row.collect_frequency_type === '降雨期' ? 'warning' : 'primary'
          "
        >
          {{ row.collect_frequency_type }}
        </el-text>
      </template>
      <template #monitor_status="{ row }">
        <div>
          <el-switch
            v-if="
              row.monitor_status === '运行中' || row.monitor_status === '已停止'
            "
            v-model="row.monitor_status"
            active-value="运行中"
            inactive-value="已停止"
            active-text="运行中"
            inactive-text="已停止"
            active-color="#10b981"
            inactive-color="#ef4444"
            @change="handleMonitorStatusChange(row)"
          />
          <el-text v-else class="common-align" type="warning">
            {{ row.monitor_status }}
          </el-text>
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
