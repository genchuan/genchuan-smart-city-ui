<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { formatDate } from '#/utils/formatTime';

import { dataList, useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import tableDetail from './detail.vue';
import settingTable from './setting/index.vue';

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
const schemaData = ref(null);
const recordsList = ref([]);
const checkedIds = ref([]);

// 新增：批量切换状态弹窗相关
const switchDialogVisible = ref(false);
const switchStatus = ref('运行中'); // 默认切换为运行中
const statusLoading = ref(false); // 批量操作加载状态

// 新增：切换采集频率弹窗相关
const frequencyDialogVisible = ref(false);
const selectedRoads = ref([]);
const frequencyType = ref('常规');

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
  const fileName = `排水管网实时监测_${new Date().toISOString().slice(0, 10)}_${new Date().toTimeString().slice(0, 8)}`;
  const data = dataObj.apilist.map(item => ({
    '管网路段': item.pipe_road,
    '管网液位(米)': item.pipe_level,
    '管网流速(米/秒)': item.pipe_flow_speed,
    '降雨量(毫米)': item.rainfall,
    '监测设备编号': item.code,
    '设备在线状态': item.status,
    '负责运维员': item.user_name,
    '采集频率类型': item.collect_frequency_type,
    '数据同步时长(秒)': item.sync_duration,
    '监测状态': item.monitor_status,
    '液位阈值': item.pipe_level_threshold,
    '流速阈值': item.pipe_flow_speed_threshold,
    '降雨量阈值': item.rainfall_threshold,
    '最近更新时间': item.update_time,
    '降雨联动预警开关': item.rain_warn_switch,
  }));
  
  // 简单的Excel导出实现
  const csvContent = "data:text/csv;charset=utf-8," 
    + Object.keys(data[0]).join(",") + "\n" 
    + data.map(row => Object.values(row).join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  ElMessage.success('数据导出成功');
}

/** 创建 */
function handleCreate() {
  formApi.resetForm();
  formApi.setState(() => {
    const schema = schemaData.value.filter((v) => v.addShow);
    return {
      schema,
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
  formApi.setState(() => {
    return {
      schema: schemaData.value.filter((v) => v.editShow),
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
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
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

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  serachObj: {},
  editObj: {},
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
      // 应用搜索条件
      for (const key in dataObj.serachObj) {
        if (dataObj.serachObj[key]) {
          if (v[key] !== dataObj.serachObj[key]) {
            return false;
          }
        }
      }
      return true;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      // 应用搜索条件
      for (const key in dataObj.serachObj) {
        if (dataObj.serachObj[key]) {
          if (v[key] !== dataObj.serachObj[key]) {
            return false;
          }
        }
      }
      return true;
    })
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
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
  schema: useFormSchema()
    .filter((v) => v.isSearch)
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
async function onSubmit() {
  dataObj.serachObj = await QueryFormApi.getValues();
  gridApi.reload();
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

// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  // 通过ref调用组件的open方法
  parkDetailDrawerRef.value.open();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const arrowChange = () => {
  emit('arrow-change');
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
  async onOpenChange() {},
});

const settingConfig = () => {
  settingdrawerApi.open();
};

// 单个监测状态切换
const handleMonitorStatusChange = (row) => {
  ElMessage.success(`切换监测状态：${row.monitor_status}`);
  // 使用 map 方法确保响应式更新
  dataObj.apilist = dataObj.apilist.map(item => {
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
    const index = dataObj.apilist.findIndex(item => item.id === v.id);
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
    const index = dataObj.apilist.findIndex(item => item.id === v.id);
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



onMounted(() => {
  const schema = useFormSchema();
  schemaData.value = schema;
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 批量切换监测状态弹窗 -->
    <el-dialog
      v-model="switchDialogVisible"
      title="批量切换监测状态"
      width="400px"
      :close-on-click-modal="false"
      :before-close="() => (switchDialogVisible = false)"
    >
      <div class="switch-dialog-content" v-loading="statusLoading">
        <div class="selected-count">
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个路段
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

    <!-- 切换采集频率弹窗 -->
    <el-dialog
      v-model="frequencyDialogVisible"
      title="切换采集频率"
      width="400px"
      :close-on-click-modal="false"
      :before-close="() => (frequencyDialogVisible = false)"
    >
      <div class="switch-dialog-content" v-loading="statusLoading">
        <div class="selected-count">
          已选择 <span class="count-num">{{ checkedIds.length }}</span> 个路段
        </div>
        <div class="status-select">
          <span class="label">目标频率类型：</span>
          <el-radio-group v-model="frequencyType" class="ml-2">
            <el-radio label="常规">常规</el-radio>
            <el-radio label="降雨期">降雨期</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="frequencyDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleFrequencyConfirm"
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
    <tableDetail
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />
    <settingDrawer title="配置监测参数" class="genchuan-detail-drawer">
      <settingTable />
    </settingDrawer>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="筛选" icon-name="Filter" @click="handleSerachShow" />
          <IconButton content="配置监测参数" icon-name="Setting" @click="settingConfig" />
          <IconButton content="导出实时数据" icon-name="Download" @click="handleExport" />
          <IconButton
            content="启动/停止批量监测"
            icon-name="Switch" 
            :disabled="isEmpty(checkedIds)"
            @click="switchOpen"
          />
          <IconButton
            content="切换采集频率"
            icon-name="Refresh"
            @click="frequencyOpen"
          />
          <IconButton
            content="批量删除"
            icon-name="Delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #pipe_road="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
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
          class="common-align"
          :type="row.status === '在线' ? 'success' : row.status === '离线' ? 'danger' : 'warning'"
        >
          {{ row.status }}
        </el-text>
      </template>
      <template #collect_frequency_type="{ row }">
        <el-text
          class="common-align"
          :type="row.collect_frequency_type === '降雨期' ? 'warning' : 'primary'"
        >
          {{ row.collect_frequency_type }}
        </el-text>
      </template>
      <template #monitor_status="{ row }">
        <el-switch
          v-model="row.monitor_status"
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
          <span> 全部统计：{{ dataObj.total }} 条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
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
