<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {  
  getAgentPayCodePage,
  exportAgentPayCode,
  deleteAgentPayCode,
  createAgentPayCode,
  updateAgentPayCode,
  refreshAgentPayCode,
  regenerateAgentPayCode,
  getAgentPayRulePage,
  getMerchantInfoPage,
} from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import { useFormSchema, useGridColumns, useGenerateFormSchema } from './data';
import ParkDetailDrawer from './detail.vue';

const merchantOptions = ref([]);
const ruleOptions = ref([]);

async function loadMerchantOptions() {
  try {
    const res = await getAgentPayRulePage({ pageNo: 1, pageSize: 100 });
    const merchants = [...new Map(res.list.map(item => [item.merchantId, item])).values()];
    merchantOptions.value = merchants.map(item => ({
      label: item.merchantName,
      value: item.merchantId,
    }));
  } catch (error) {
    console.error('加载商户列表失败:', error);
  }
}

async function loadRuleOptions(merchantId) {
  try {
    const res = await getAgentPayRulePage({ pageNo: 1, pageSize: 100, merchantId });
    ruleOptions.value = res.list.map(item => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error('加载代付规则列表失败:', error);
  }
}

const generateFormSchema = computed(() => {
  const schema = useGenerateFormSchema();
  return schema.map(item => {
    if (item.fieldName === 'merchantId') {
      return {
        ...item,
        componentProps: {
          ...item.componentProps,
          options: merchantOptions.value,
          onChange: (val) => {
            loadRuleOptions(val);
          },
        },
      };
    }
    if (item.fieldName === 'ruleId') {
      return {
        ...item,
        componentProps: {
          ...item.componentProps,
          options: ruleOptions.value,
        },
      };
    }
    return item;
  });
});

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

// 点击码状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击商户名称跳转商户详情弹窗
async function handleOpenMerchantDetail(row) {
  try {
    const res = await getMerchantInfoPage({ merchantName: row.merchantName });
    if (res.list && res.list.length > 0) {
      const firstMerchant = res.list[0];
      dataObj.merchantDetailObj = {
        ...firstMerchant,
        registerTime: formatTimestamp(firstMerchant.registerTime),
      };
      merchantDialogVisible.value = true;
    } else {
      ElMessage.info('未找到相关商户信息');
    }
  } catch (error) {
    console.error('获取商户详情失败:', error);
    ElMessage.error('获取商户详情失败');
  }
}

// 点击规则名称跳转代付规则详情弹窗
async function handleOpenRuleDetail(row) {
  try {
    const res = await getAgentPayRulePage({ name: row.ruleName });
    if (res.list && res.list.length > 0) {
      const firstRule = res.list[0];
      dataObj.ruleDetailObj = firstRule;
      ruleDialogVisible.value = true;
    } else {
      ElMessage.info('未找到相关规则信息');
    }
  } catch (error) {
    console.error('获取规则详情失败:', error);
    ElMessage.error('获取规则详情失败');
  }
}

// 点击用户名称跳转用户详情弹窗
function handleOpenUserDetail(row) {
  dataObj.userDetailObj = row;
  userDialogVisible.value = true;
}

// 点击关联订单跳转代付订单详情弹窗
function handleOpenOrderDetail(row) {
  dataObj.orderDetailObj = row;
  orderDialogVisible.value = true;
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportAgentPayCode();
  downloadFileFromBlobPart({ fileName: '代付码报表.xls', source: data });
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

const [GenerateForm, generateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: generateFormSchema,
  showDefaultActions: false,
});

const generateDialogVisible = ref(false);

async function handleGenerateConfirm() {
  const loadingInstance = ElLoading.service({
    text: '正在生成...',
  });
  try {
    const values = generateFormApi.form.values;
    const data = { 
      id: 0,
      merchantId: values.merchantId || 0,
      ruleId: values.ruleId || 0,
      expireTime: values.expireTime ? new Date(values.expireTime).getTime() : '',
      status: values.status || '',
      remark: values.remark || '',
      reserve1: values.reserve1 || '',
      reserve2: values.reserve2 || '',
    };
    await createAgentPayCode(data);
    ElMessage.success('生成成功');
    handleRefresh();
    generateDialogVisible.value = false;
  } catch (error) {
    console.error('生成失败:', error);
    ElMessage.error('生成失败');
  } finally {
    loadingInstance.close();
  }
}

function handleGenerateCancel() {
  generateDialogVisible.value = false;
}

async function handleGenerateOpen() {
  generateFormApi.resetForm();
  ruleOptions.value = [];
  await loadMerchantOptions();
  generateDialogVisible.value = true;
}

/** 生成代付码 */
function handleGenerate() {
  handleGenerateOpen();
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
    text: $t('ui.actionMessage.deleting', [row.code]),
  });
  try {
    await deleteAgentPayCode({ id: row.id });
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.code]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败');
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
    for (const id of checkedIds.value) {
      await deleteAgentPayCode({ id });
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.error('批量删除失败:', error);
    ElMessage.error('批量删除失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleRefreshCode(row) {
  const loadingInstance = ElLoading.service({
    text: '正在刷新...',
  });
  try {
    await refreshAgentPayCode({ id: row.id });
    ElMessage.success('刷新成功');
    handleRefresh();
  } catch (error) {
    console.error('刷新失败:', error);
    ElMessage.error('刷新失败');
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
  merchantDetailObj: {},
  ruleDetailObj: {},
  userDetailObj: {},
  orderDetailObj: {},
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
    const res = await getAgentPayCodePage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        useTime: formatTimestamp(v.useTime),
        expireTime: formatTimestamp(v.expireTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取代付码数据失败:', error);
    ElMessage.error('获取代付码数据失败');
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
const handleSerachShow = () => {
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

const regenerateDialogVisible = ref(false);
const currentRegenerateRow = ref(null);

function handleRegenerate(row) {
  currentRegenerateRow.value = row;
  regenerateDialogVisible.value = true;
}

async function handleRegenerateConfirm() {
  if (!currentRegenerateRow.value) return;
  
  const loadingInstance = ElLoading.service({
    text: '正在重新生成...',
  });
  try {
    await regenerateAgentPayCode({ id: currentRegenerateRow.value.id });
    ElMessage.success('重新生成成功');
    handleRefresh();
    regenerateDialogVisible.value = false;
  } catch (error) {
    console.error('重新生成失败:', error);
    ElMessage.error('重新生成失败');
  } finally {
    loadingInstance.close();
  }
}

function handleRegenerateCancel() {
  regenerateDialogVisible.value = false;
  currentRegenerateRow.value = null;
}

// 代付码状态映射
const statusMap = {
  unused: { label: '未使用', type: 'primary' },
  used: { label: '已使用', type: 'success' },
  expired: { label: '已过期', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 确认弹窗
const confirmDialogVisible = ref(false);
const confirmForm = reactive({
  id: '',
  remark: '',
});

// 打开确认弹窗
const handleConfirm = (row) => {
  confirmForm.id = row.id;
  confirmForm.remark = '';
  confirmDialogVisible.value = true;
};

// 提交确认
const handleConfirmSubmit = async () => {
  try {
    await confirmAmountCheck(confirmForm);
    ElMessage.success('确认成功');
    confirmDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('确认失败');
  }
};

// 批量计算弹窗
const batchCalculateDialogVisible = ref(false);
const batchCalculateForm = reactive({
  ids: [],
  remark: '',
});

// 打开批量计算弹窗
const handleBatchCalculate = () => {
  batchCalculateForm.ids = checkedIds.value;
  batchCalculateForm.remark = '';
  batchCalculateDialogVisible.value = true;
};

// 提交批量计算
const handleBatchCalculateSubmit = async () => {
  try {
    const data = {
      ids: batchCalculateForm.ids,
      remark: batchCalculateForm.remark,
    };
    await calculateAmountCheck(data);
    ElMessage.success('批量计算成功');
    batchCalculateDialogVisible.value = false;
    checkedIds.value = [];
    handleRefresh();
  } catch {
    ElMessage.error('批量计算失败');
  }
};

// 计算弹窗
const calculateDialogVisible = ref(false);
const calculateForm = reactive({
  id: '',
  remark: '',
});

// 打开计算弹窗
const handleCalculate = (row) => {
  calculateForm.id = row.id;
  calculateForm.remark = '';
  calculateDialogVisible.value = true;
};

// 提交计算
const handleCalculateSubmit = async () => {
  try {
    await calculateAmountCheck(calculateForm);
    ElMessage.success('计算成功');
    calculateDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('计算失败');
  }
};

// ====================== 商户详情弹窗 ======================
const merchantDialogVisible = ref(false);

// ====================== 规则详情弹窗 ======================
const ruleDialogVisible = ref(false);

// ====================== 用户详情弹窗 ======================
const userDialogVisible = ref(false);

// ====================== 订单详情弹窗 ======================
const orderDialogVisible = ref(false);

// 手机号脱敏函数
function maskPhone(phone) {
  if (!phone) return '-';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

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

    <!-- 商户详情弹窗 -->
    <ElDialog v-model="merchantDialogVisible" title="商户详情" width="520px">
      <ElDescriptions v-if="dataObj.merchantDetailObj" :column="1" border>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.merchantDetailObj.name || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户类型">
          {{ dataObj.merchantDetailObj.merchantType || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ dataObj.merchantDetailObj.contact || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ maskPhone(dataObj.merchantDetailObj.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户地址">
          {{ dataObj.merchantDetailObj.address || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户状态">
          {{ dataObj.merchantDetailObj.status || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="注册时间">
          {{ dataObj.merchantDetailObj.registerTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ dataObj.merchantDetailObj.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 规则详情弹窗 -->
    <ElDialog v-model="ruleDialogVisible" title="代付规则详情" width="520px">
      <ElDescriptions v-if="dataObj.ruleDetailObj" :column="1" border>
        <ElDescriptionsItem label="规则名称">
          {{ dataObj.ruleDetailObj.name || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.ruleDetailObj.merchantName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="代付类型">
          {{ dataObj.ruleDetailObj.agentType === 'merchant' ? '商户代付' : dataObj.ruleDetailObj.agentType === 'enterprise' ? '企业代付' : dataObj.ruleDetailObj.agentType === 'public' ? '公益代付' : dataObj.ruleDetailObj.agentType || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="单次限额">
          ¥{{ (dataObj.ruleDetailObj.singleLimit || 0).toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="日累计限额">
          ¥{{ (dataObj.ruleDetailObj.dayLimit || 0).toFixed(2) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="适用场景">
          {{ dataObj.ruleDetailObj.scene || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="规则状态">
          {{ dataObj.ruleDetailObj.status === 'disabled' ? '已禁用' : dataObj.ruleDetailObj.status === 'enabled' ? '已生效' : dataObj.ruleDetailObj.status === 'pending' ? '待生效' : dataObj.ruleDetailObj.status || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="使用次数">
          {{ dataObj.ruleDetailObj.useCount || 0 }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 用户详情弹窗 -->
    <ElDialog v-model="userDialogVisible" title="用户详情" width="520px">
      <ElDescriptions v-if="dataObj.userDetailObj" :column="1" border>
        <ElDescriptionsItem label="用户名称">
          {{ dataObj.userDetailObj.userName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户手机号">
          {{ maskPhone(dataObj.userDetailObj.userTel) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="使用时间">
          {{ dataObj.userDetailObj.useTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="关联订单">
          {{ dataObj.userDetailObj.orderNo || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 订单详情弹窗 -->
    <ElDialog v-model="orderDialogVisible" title="代付订单详情" width="520px">
      <ElDescriptions v-if="dataObj.orderDetailObj" :column="1" border>
        <ElDescriptionsItem label="订单编号">
          {{ dataObj.orderDetailObj.orderNo || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="代付码">
          {{ dataObj.orderDetailObj.code || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="商户名称">
          {{ dataObj.orderDetailObj.merchantName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="规则名称">
          {{ dataObj.orderDetailObj.ruleName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="使用时间">
          {{ dataObj.orderDetailObj.useTime || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户名称">
          {{ dataObj.orderDetailObj.userName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户手机号">
          {{ maskPhone(dataObj.orderDetailObj.userTel) }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <!-- 确认弹窗 -->
    <ElDialog
      v-model="confirmDialogVisible"
      title="金额确认"
      width="500px"
      append-to-body
    >
      <el-form :model="confirmForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="confirmForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="confirmForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入确认备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmSubmit">
            确认核算
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 计算弹窗 -->
    <ElDialog
      v-model="calculateDialogVisible"
      title="金额计算"
      width="500px"
      append-to-body
    >
      <el-form :model="calculateForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="calculateForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="calculateForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入计算备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="calculateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCalculateSubmit">
            执行计算
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 批量计算弹窗 -->
    <ElDialog
      v-model="batchCalculateDialogVisible"
      title="批量金额计算"
      width="500px"
      append-to-body
    >
      <el-form :model="batchCalculateForm" label-width="80px">
        <el-form-item label="选中数量">
          <el-input :value="batchCalculateForm.ids.length" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchCalculateForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入计算备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchCalculateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchCalculateSubmit">
            执行批量计算
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 重新生成确认弹窗 -->
    <ElDialog
      v-model="regenerateDialogVisible"
      title="确认重新生成"
      width="400px"
      append-to-body
    >
      <p>确定要基于原规则重新生成新的代付码吗？</p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">重新生成后将更新过期时间</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleRegenerateCancel">取消</el-button>
          <el-button type="primary" @click="handleRegenerateConfirm">
            确认重新生成
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 生成代付码弹窗 -->
    <ElDialog
      v-model="generateDialogVisible"
      title="生成代付码"
      width="600px"
      append-to-body
    >
      <GenerateForm />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleGenerateCancel">取消</el-button>
          <el-button type="primary" @click="handleGenerateConfirm">
            生成
          </el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="生成"
            icon-name="Plus"
            @click="handleGenerate"
          />
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
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
      <template #status="{ row }">
        <el-tag 
          :type="getStatusType(row.status)"
          class="cursor-pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #code="{ row }">
        <span
          @click="handleOpenDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.code }}
        </span>
      </template>
      <template #merchantName="{ row }">
        <span
          @click="handleOpenMerchantDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.merchantName }}
        </span>
      </template>
      <template #ruleName="{ row }">
        <span
          @click="handleOpenRuleDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.ruleName }}
        </span>
      </template>
      <template #userName="{ row }">
        <span
          @click="handleOpenUserDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.userName }}
        </span>
      </template>
      <template #orderNo="{ row }">
        <span
          @click="handleOpenOrderDetail(row)"
          class="common-align cursor-pointer text-primary"
        >
          {{ row.orderNo }}
        </span>
      </template>
      <template #halfyearWarnCount="{ row }">
        <el-text @click="handleTotal(row)" class="common-align cursor-pointer text-primary">
          {{ row.halfyearWarnCount }}
        </el-text>
      </template>

      <template #orderId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderId }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="刷新"
            v-if="row.status === 'unused'"
            icon-name="Refresh"
            @click="handleRefreshCode(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="重新生成"
            v-if="row.status === 'expired'"
            icon-name="Refresh"
            @click="handleRegenerate(row)"
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
