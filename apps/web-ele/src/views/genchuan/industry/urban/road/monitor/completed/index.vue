<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import {
  ElButton,
  ElLoading,
  ElMessage,
  ElRadio,
  ElRadioGroup,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addRoad,
  addWarn,
  deleteArchive,
  downLoadComplete,
  exportRoadCompletedExcel,
  getRoadArchive,
  getRoadFacilityList,
  getRoadWorkOrderAllProcess,
  getSysDevicePage,
  updateRoad,
  updateRoadStatusList,
} from '#/api/genchuan/industry/urban/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
// 引入封装后的详情抽屉组件
import tableDetail from './detail.vue';

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
const roadDetailRef = ref(null);
const schemaData = ref(null);
const roadObj = ref({ detailObj: {}, list: [] });
const deviceObj = ref({ detailObj: {}, list: [] });
// 新增：批量切换状态弹窗相关
const switchDialogVisible = ref(false);
const switchStatus = ref('运行中'); // 默认切换为运行中
const statusLoading = ref(false); // 批量操作加载状态

// ========== 全流程记录抽屉相关 ==========
const flowRecordList = ref([]); // 流程记录数据
const currentRow = ref({}); // 当前行数据
// 初始化全流程记录抽屉
const [AllDetailDrawer, allDetailDrawerApi] = useVbenDrawer({
  title: '全流程记录',
  placement: 'right', // 右侧弹出
  width: 800, // 宽度与原弹窗一致
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    allDetailDrawerApi.close();
  },
});

// 实现handleAllDetail方法
const handleAllDetail = async (row) => {
  currentRow.value = row;
  const res = await getRoadWorkOrderAllProcess({ id: row.id });
  flowRecordList.value = res.map((v) => {
    return { ...v, nodeTime: formatTimestamp(v.nodeTime) };
  });
  allDetailDrawerApi.open(); // 打开抽屉
};
// ========== 全流程记录抽屉结束 ==========

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

onMounted(async () => {
  const roadList = await getRoadFacilityList({
    pageNo: 1,
    pageSize: 99,
  });
  const deviceList = await getSysDevicePage({
    pageNo: 1,
    pageSize: 99,
  });
  roadObj.value.list = roadList.list;
  deviceObj.value.list = deviceList.list;
  let roadIndex = 0;
  let deviceIndex = 0;
  const schema = useFormSchema();
  schema.forEach((v, i) => {
    if (v.fieldName === 'roadId') {
      roadIndex = i;
    }
    if (v.fieldName === 'deviceId') {
      deviceIndex = i;
    }
  });
  schema[roadIndex] = {
    fieldName: 'roadId',
    label: '道路名称',
    component: 'Select',
    labelWidth: '120',
    componentProps: {
      allowClear: true,
      filterOption: true,
      options: roadObj.value.list.map((v) => {
        return {
          label: `${v.id}----${v.roadName}`,
          value: v.id,
        };
      }),
      placeholder: '请选择道路名称',
      showSearch: true,
    },
    rules: 'required',
    isSearch: true,
    addShow: true,
    editShow: true,
  };
  schema[deviceIndex] = {
    fieldName: 'deviceId',
    label: '设备ID',
    component: 'Select',
    labelWidth: '120',
    componentProps: {
      allowClear: true,
      filterOption: true,
      options: deviceObj.value.list.map((v) => {
        return {
          label: `${v.id}----${v.name}`,
          value: v.id,
        };
      }),
      placeholder: '请选择道路设备ID',
      showSearch: true,
    },
    rules: 'required',
    isSearch: true,
    addShow: true,
    editShow: true,
  };
  schemaData.value = schema;
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
  async onConfirm() {
    const obj = formApi.form.values;
    await (formDrawerApi.sharedData.payload.title === '增加'
      ? addRoad(obj)
      : updateRoad({ ...dataObj.editObj, ...obj }));
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
  const data = await exportRoadCompletedExcel();
  downloadFileFromBlobPart({
    fileName: '路设施处置归档台账.xls',
    source: data,
  });
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
      title: '增加',
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  dataObj.editObj = row;
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
    await deleteArchive(row.id);
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

const recordsList = ref([]);
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  try {
    const getParams = {
      pageNo: pageObj.page.currentPage,
      pageSize: pageObj.page.pageSize,
      ...dataObj.serachObj,
    };
    const data = await getRoadArchive(getParams);
    dataObj.total = data.total;
    dataObj.list = data.list.map((v) => {
      return {
        ...v,
        updateTime: formatTimestamp(v.updateTime),
        completeTime: formatTimestamp(v.completeTime),
        createTime: formatTimestamp(v.createTime),
      };
    });
  } catch (error) {
    console.log(error);
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

// 单个状态切换
const handleMonitorStatusChange = async (row) => {
  await updateRoad({ ...row, monitorStatus: row.monitorStatus });
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
  await updateRoadStatusList({
    roadIdList: recordsList.value.map((v) => v.roadId),
    monitorStatus: switchStatus.value,
  });
  statusLoading.value = false;
  switchDialogVisible.value = false;
  handleRefresh();
};

// 根据数值返回对应的预警状态文本
const getWarningText = (value) => {
  switch (value) {
    case 0: {
      return '不可触发预警';
    }
    case 1: {
      return '';
    }
    case 2: {
      return '已预警';
    }
    default: {
      return '未知状态';
    }
  }
};

const warnObj = ref({});
const [warnDrawer, warnDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: true,
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const formObj = await WarnFormApi.getValues();
    const res = await addWarn({
      monitorId: warnObj.value.monitorId,
      ...formObj,
    });
    ElMessage.success('创建成功');
    warnDrawerApi.close();
  },
  async onOpenChange() {},
});

const [WarnForm, WarnFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'wayType',
      label: '预警方式',
      component: 'Select',
      componentProps: {
        options: [
          { label: '自动监测', value: '自动监测' },
          { label: '人工上报离线', value: '人工上报' },
        ],
        placeholder: '请选择预警方式',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'level',
      label: '预警等级',
      component: 'Select',
      componentProps: {
        options: [
          { label: '一般', value: 1 },
          { label: '较重', value: 2 },
          { label: '严重', value: 3 },
          { label: '紧急', value: 4 },
        ],
        placeholder: '请选择预警方式',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'dealLimit',
      label: '预警处置时限(时)',
      component: 'Input',
      componentProps: {
        placeholder: '预警处置时限',
        maxLength: 50,
      },
      labelWidth: '120',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});
const handleDownLoadWord = async (row) => {
  const res = await downLoadComplete({
    archiveId: row.id,
  });
  downloadFileFromBlobPart({
    fileName: '归档资料.zip',
    source: res,
  });
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 预警出发 -->
    <warnDrawer title="创建待处置预警">
      <WarnForm />
    </warnDrawer>

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
          <ElRadioGroup v-model="switchStatus" class="ml-2">
            <ElRadio label="运行中">运行中</ElRadio>
            <ElRadio label="已停止">已停止</ElRadio>
          </ElRadioGroup>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="switchDialogVisible = false">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSwitchConfirm"
            :loading="statusLoading"
          >
            确认切换
          </ElButton>
        </span>
      </template>
    </el-dialog>

    <!-- 全流程记录抽屉（替换原el-dialog） -->
    <AllDetailDrawer class="genchuan-detail-drawer">
      <div class="flow-record-card p-4">
        <ElTable
          :data="flowRecordList"
          border
          stripe
          :hover-row="true"
          style="width: 100%"
        >
          <ElTableColumn
            prop="stepNo"
            label="流程步骤序号"
            width="120"
            align="center"
          />
          <ElTableColumn
            prop="nodeName"
            label="节点名称"
            width="150"
            align="center"
          />
          <ElTableColumn
            prop="nodeTime"
            label="节点时间"
            width="200"
            align="center"
          />
          <ElTableColumn
            prop="operatorName"
            label="操作人"
            width="150"
            align="center"
          />
          <ElTableColumn prop="nodeDesc" label="节点描述" min-width="200" />
          <ElTableColumn
            prop="refNo"
            label="关联编号"
            width="200"
            align="center"
          />
        </ElTable>
      </div>
    </AllDetailDrawer>

    <settingDrawer title="配置监测参数" class="genchuan-detail-drawer">
      <settingTable />
    </settingDrawer>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <tableDetail
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />

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
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="配置监测参数"
            icon-name="setting"
            @click="settingConfig"
          />
          <IconButton
            content="启动/停止批量监测"
            icon-name="switch"
            @click="switchOpen"
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

      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="下载归档资料"
            icon-name="download"
            @click="handleDownLoadWord(row)"
          />
          <IconButton
            content="查看全流程记录"
            icon-name="Operation"
            @click="handleAllDetail(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
        <div class="common-total" @click="changeTotalShow"></div>
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

// 全流程记录抽屉样式
.flow-record-card {
  height: 100%;
  box-sizing: border-box;
  min-height: 500px;

  :deep(.el-table) {
    --el-table-header-text-color: #606266;
    --el-table-row-hover-bg-color: #f5f7fa;
    --el-table-stripe-row-bg-color: #fafafa;
    width: 100%;

    .el-table__header-wrapper {
      th {
        background-color: #f9fafb;
        font-weight: 500;
      }
    }

    .el-table__body-wrapper {
      td {
        color: #303133;
        line-height: 1.5;
      }
    }
  }
}
</style>
