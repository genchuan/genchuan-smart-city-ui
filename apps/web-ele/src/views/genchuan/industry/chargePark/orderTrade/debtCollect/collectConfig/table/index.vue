<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  getDebtRecordCollectConfigPage,
  createDebtRecordCollectConfig,
  saveDebtRecordCollectConfig,
  updateDebtRecordCollectConfig,
  enableDebtRecordCollectConfig,
  disableDebtRecordCollectConfig,
} from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import { getDetailEnObj } from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import { useFormSchema, useGridColumns } from './data';
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
  filterParams: {
    type: Object,
    default: () => ({
      createTimeStart: null,
      createTimeEnd: null,
      collectMethod: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);

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

// 点击追缴方式筛选
function handleFilterCollectMethod(collectMethod) {
  dataObj.searchObj = { ...dataObj.searchObj, collectMethod: collectMethod };
  queryFormApi.setValues({ collectMethod: collectMethod });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击推送模板ID筛选
function handleFilterTemplateId(templateId) {
  dataObj.searchObj = { ...dataObj.searchObj, templateId: templateId };
  queryFormApi.setValues({ templateId: templateId });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击配置状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击创建者筛选
function handleFilterCreator(creator) {
  dataObj.searchObj = { ...dataObj.searchObj, creator: creator };
  queryFormApi.setValues({ creator: creator });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击操作人筛选
function handleFilterOperatorId(operatorId) {
  dataObj.searchObj = { ...dataObj.searchObj, operatorId: operatorId };
  queryFormApi.setValues({ operatorId: operatorId });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击更新者筛选
function handleFilterUpdater(updater) {
  dataObj.searchObj = { ...dataObj.searchObj, updater: updater };
  queryFormApi.setValues({ updater: updater });
  dataObj.currentPage = 1;
  gridApi.query();
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  ElMessage.info('导出功能开发中');
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  downloadLocalTemplate('/static/test.pdf', '报表.pdf');
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
  detailObj: {},
  enDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  loading: false,
  searchObj: {},
  filterParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchObj,
    ...dataObj.filterParams,
  };

  try {
    dataObj.loading = true;
    const res = await getDebtRecordCollectConfigPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取追缴配置数据失败:', error);
    ElMessage.error('获取追缴配置数据失败');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const values = await queryFormApi.getValues();
    dataObj.searchObj = values;
    dataObj.currentPage = 1;
    dataObj.filterParams = {};
    emit('clear-filters');
    gridApi.query();
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema()
    .map((v) => {
      delete v.rules;
      return { ...v };
    })
    .filter((v) => v.isSearch),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

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
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
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
const handleSearchShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

const parkDetailDrawerRef = ref(null);
const enDetailObjRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};
const autoElmessage = () => {
  ElMessage.success($t('月报自动刷新成功'));
};
const openEn = async () => {
  const res = await getDetailEnObj(1);
  dataObj.enDetailObj = res;
  enDetailObjRef.value?.open();
};

// 追缴配置状态映射
const statusMap = {
  inactive: { label: '未生效', type: 'info' },
  active: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
  enabled: { label: '已启用', type: 'success' },
  pending: { label: '待推送', type: 'warning' },
  collecting: { label: '追缴中', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
};

// 追缴方式映射
const collectMethodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

// 获取追缴方式标签
const getCollectMethodLabel = (method) => {
  return collectMethodMap[method]?.label || method;
};

// 获取追缴方式类型
const getCollectMethodType = (method) => {
  return collectMethodMap[method]?.type || 'default';
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 创建弹窗
const createDialogVisible = ref(false);
const createFormRef = ref(null);
const createForm = reactive({
  id: 0,
  configNo: '',
  collectMethod: '',
  templateId: 0,
  pushFrequency: 0,
  status: '',
  remark: '',
  operatorId: 0,
});

const createRules = {
  configNo: [
    { required: true, message: '请输入配置编号', trigger: 'blur' },
  ],
  collectMethod: [
    { required: true, message: '请选择追缴方式', trigger: 'change' },
  ],
  pushFrequency: [
    { required: true, message: '请输入推送频率', trigger: 'blur' },
    { type: 'number', min: 1, message: '推送频率必须大于0', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
};

// 打开创建弹窗
const handleCreateConfig = () => {
  Object.assign(createForm, {
    id: 0,
    configNo: '',
    collectMethod: '',
    templateId: 0,
    pushFrequency: 0,
    status: '',
    remark: '',
    operatorId: 0,
  });
  createDialogVisible.value = true;
};

// 提交创建
const handleCreateConfigSubmit = async () => {
  if (!createFormRef.value) return;
  createFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await createDebtRecordCollectConfig(createForm);
      ElMessage.success('创建成功');
      createDialogVisible.value = false;
      handleRefresh();
    } catch {
      ElMessage.error('创建失败');
    }
  });
};

// 更新弹窗
const updateDialogVisible = ref(false);
const updateForm = reactive({
  id: 0,
  configNo: '',
  collectMethod: '',
  templateId: 0,
  pushFrequency: 0,
  status: '',
  remark: '',
  operatorId: 0,
});

// 打开更新弹窗
const handleUpdateConfig = (row) => {
  Object.assign(updateForm, {
    id: row.id,
    configNo: row.configNo || '',
    collectMethod: row.collectMethod || '',
    templateId: row.templateId || 0,
    pushFrequency: row.pushFrequency || 0,
    status: row.status || '',
    remark: '',
    operatorId: 0,
  });
  updateDialogVisible.value = true;
};

// 提交更新
const handleUpdateConfigSubmit = async () => {
  try {
    await updateDebtRecordCollectConfig(updateForm);
    ElMessage.success('更新成功');
    updateDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('更新失败');
  }
};

// 启用弹窗
const enableDialogVisible = ref(false);
const enableForm = reactive({
  id: '',
  remark: '',
});

// 打开启用弹窗
const handleEnable = (row) => {
  enableForm.id = row.id;
  enableForm.remark = '';
  enableDialogVisible.value = true;
};

// 提交启用
const handleEnableSubmit = async () => {
  try {
    await enableDebtRecordCollectConfig(enableForm);
    ElMessage.success('启用成功');
    enableDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('启用失败');
  }
};

// 禁用弹窗
const disableDialogVisible = ref(false);
const disableForm = reactive({
  id: '',
  remark: '',
});

// 打开禁用弹窗
const handleDisable = (row) => {
  disableForm.id = row.id;
  disableForm.remark = '';
  disableDialogVisible.value = true;
};

// 提交禁用
const handleDisableSubmit = async () => {
  try {
    await disableDebtRecordCollectConfig(disableForm);
    ElMessage.success('禁用成功');
    disableDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('禁用失败');
  }
};

// ====================== 告警明细弹窗 ======================
const alarmDialogVisible = ref(false);
const currentAlarmRow = ref({});
const alarmList = ref([]);

function generateAlarmData(row) {
  const count = row.halfyearWarnCount || 0;
  const typeItems = row.highIllegalType.split(',').map((item) => item.trim());
  const avgCount = Math.ceil(count / typeItems.length);
  const types = typeItems.map((name) => {
    return { name, num: avgCount };
  });

  const list = [];
  let id = 1;
  types.forEach((type) => {
    for (let i = 0; i < Math.min(type.num, 5); i++) {
      list.push({
        id: id++,
        canteenName: row.canteenName,
        alarmType: type.name,
        alarmTime: `${row.statCycle.split('-')[0].trim()} ${String(Math.trunc(Math.random() * 24)).padStart(2, '0')}:${String(Math.trunc(Math.random() * 60)).padStart(2, '0')}`,
        alarmLevel: ['一般', '较重', '严重'][Math.trunc(Math.random() * 3)],
        status: ['未处理', '处理中', '已整改'][Math.trunc(Math.random() * 3)],
      });
    }
  });
  return list.slice(0, count);
}

function handleTotal(row) {
  currentAlarmRow.value = row;
  alarmList.value = generateAlarmData(row);
  alarmDialogVisible.value = true;
}

const alarmColumns = [
  { label: '序号', prop: 'id', width: 70 },
  { label: '食堂名称', prop: 'canteenName' },
  { label: '告警类型', prop: 'alarmType' },
  { label: '告警时间', prop: 'alarmTime' },
  { label: '告警等级', prop: 'alarmLevel' },
  { label: '处理状态', prop: 'status' },
];

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    dataObj.searchObj = {};
    dataObj.filterParams = props.filterParams;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <enDetailDrawer ref="enDetailObjRef" :detail-obj="dataObj.enDetailObj" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 告警明细弹窗 -->
    <ElDialog
      v-model="alarmDialogVisible"
      title="本半年食品安全问题明细"
      width="900px"
      append-to-body
    >
      <el-table :data="alarmList" border height="450">
        <el-table-column
          v-for="col in alarmColumns"
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :width="col.width"
        />
      </el-table>
    </ElDialog>

    <!-- 创建弹窗 -->
    <ElDialog
      v-model="createDialogVisible"
      title="创建追缴配置"
      width="500px"
      append-to-body
    >
      <el-form :model="createForm" label-width="80px" :rules="createRules" ref="createFormRef">
        <el-form-item label="配置编号" prop="configNo">
          <el-input v-model="createForm.configNo" />
        </el-form-item>
        <el-form-item label="追缴方式" prop="collectMethod">
          <el-select v-model="createForm.collectMethod" placeholder="请选择追缴方式">
            <el-option label="短信" value="sms" />
            <el-option label="站内信" value="notify" />
            <el-option label="电话" value="phone" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送频率" prop="pushFrequency">
          <el-input v-model.number="createForm.pushFrequency" type="number" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="createForm.status" placeholder="请选择状态">
            <el-option label="未生效" value="inactive" />
            <el-option label="已生效" value="active" />
            <el-option label="已禁用" value="disabled" />
            <el-option label="已启用" value="enabled" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="createForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateConfigSubmit">
            确认创建
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 更新弹窗 -->
    <ElDialog
      v-model="updateDialogVisible"
      title="更新追缴配置"
      width="500px"
      append-to-body
    >
      <el-form :model="updateForm" label-width="80px">
        <el-form-item label="配置编号">
          <el-input v-model="updateForm.configNo" />
        </el-form-item>
        <el-form-item label="追缴方式">
          <el-select v-model="updateForm.collectMethod" placeholder="请选择追缴方式">
            <el-option label="短信" value="sms" />
            <el-option label="站内信" value="notify" />
            <el-option label="电话" value="phone" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送频率">
          <el-input v-model.number="updateForm.pushFrequency" type="number" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="updateForm.status" placeholder="请选择状态">
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
            <el-option label="已生效" value="active" />
            <el-option label="未生效" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="updateForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateConfigSubmit">
            确认更新
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 启用弹窗 -->
    <ElDialog
      v-model="enableDialogVisible"
      title="启用追缴配置"
      width="500px"
      append-to-body
    >
      <el-form :model="enableForm" label-width="80px">
        <el-form-item label="配置ID">
          <el-input v-model="enableForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="enableForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入启用备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="enableDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEnableSubmit">
            确认启用
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 禁用弹窗 -->
    <ElDialog
      v-model="disableDialogVisible"
      title="禁用追缴配置"
      width="500px"
      append-to-body
    >
      <el-form :model="disableForm" label-width="80px">
        <el-form-item label="配置ID">
          <el-input v-model="disableForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="disableForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入禁用备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="disableDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDisableSubmit">
            确认禁用
          </el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="新增配置"
            icon-name="Plus"
            @click="handleCreateConfig"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
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

      <template #status="{ row }">
        <el-tag 
          :type="getStatusType(row.status)" 
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #configNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.configNo }}
        </el-text>
      </template>
      <template #collectMethod="{ row }">
        <el-tag 
          :type="getCollectMethodType(row.collectMethod)" 
          class="cursor-pointer"
          @click="handleFilterCollectMethod(row.collectMethod)"
        >
          {{ getCollectMethodLabel(row.collectMethod) }}
        </el-tag>
      </template>
      <template #templateId="{ row }">
        <el-text 
          @click="handleFilterTemplateId(row.templateId)" 
          class="common-align cursor-pointer" 
          type="primary"
        >
          {{ row.templateId }}
        </el-text>
      </template>
      <template #operatorId="{ row }">
        <el-text 
          @click="handleFilterOperatorId(row.operatorId)" 
          class="common-align cursor-pointer" 
          type="primary"
        >
          {{ row.operatorId }}
        </el-text>
      </template>
      <template #creator="{ row }">
        <el-text 
          @click="handleFilterCreator(row.creator)" 
          class="common-align cursor-pointer" 
          type="primary"
        >
          {{ row.creator }}
        </el-text>
      </template>
      <template #updater="{ row }">
        <el-text 
          @click="handleFilterUpdater(row.updater)" 
          class="common-align cursor-pointer" 
          type="primary"
        >
          {{ row.updater }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="Edit"
            @click="handleUpdateConfig(row)"
          />
          <IconButton
            content="启用"
            v-if="row.status === 'inactive'"
            icon-name="Check"
            @click="handleEnable(row)"
          />
          <IconButton
            content="禁用"
            v-if="row.status === 'active'"
            icon-name="Close"
            color="#F56C6C"
            @click="handleDisable(row)"
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
