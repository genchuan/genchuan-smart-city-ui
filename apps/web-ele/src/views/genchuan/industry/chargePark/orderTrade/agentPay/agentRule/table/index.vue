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
  getAgentPayRulePage,
  exportAgentPayRule,
  importAgentPayRuleTemplate,
  importAgentPayRule,
  createAgentPayRule,
  updateAgentPayRule,
  deleteAgentPayRule,
  enableAgentPayRule,
  disableAgentPayRule,
  getMerchantInfoPage,
} from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
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
      agentType: null,
      status: null,
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
const merchantOptions = ref([]);

// 加载商户列表
const loadMerchantOptions = async () => {
  try {
    const res = await getMerchantInfoPage({ pageNo: 1, pageSize: 100 });
    merchantOptions.value = res.list.map(item => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error('加载商户列表失败:', error);
  }
};

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
  width: 800,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    const loadingInstance = ElLoading.service({
      text: formDrawerApi.sharedData.payload.title === '新增' ? '正在创建...' : '正在更新...',
    });
    try {
      if (formDrawerApi.sharedData.payload.title === '新增') {
        await createAgentPayRule(obj);
        ElMessage.success('创建成功');
      } else {
        await updateAgentPayRule(obj);
        ElMessage.success('更新成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('操作失败:', error);
      ElMessage.error(formDrawerApi.sharedData.payload.title === '新增' ? '创建失败' : '更新失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await loadMerchantOptions();
      formData.value = formDrawerApi.getData();
      formApi.updateSchema([{
        fieldName: 'merchantId',
        componentProps: {
          options: merchantOptions.value,
        },
      }]);
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

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportAgentPayRule(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '代理商支付规则报表.xls', source: data });
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  downloadLocalTemplate('/static/test.pdf', '报表.pdf');
}

// ====================== 下载导入模板 ======================
async function handleDownloadTemplate() {
  const data = await importAgentPayRuleTemplate();
  downloadFileFromBlobPart({ fileName: '代付规则导入模板.xls', source: data });
}

// ====================== 导入弹窗相关 ======================
const importDialogVisible = ref(false);
const importForm = reactive({
  file: null,
  updateSupport: false,
});

// 打开导入弹窗
function handleOpenImportDialog() {
  importForm.file = null;
  importForm.updateSupport = false;
  importDialogVisible.value = true;
}

// 文件选择处理
function handleFileChange(event) { 
  const file = event.raw;
  if (file) {
    importForm.file = file;
  }
}

// 提交导入
async function handleImportSubmit() {
  if (!importForm.file) {
    ElMessage.error('请选择要导入的Excel文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '正在导入...',
  });

  try {
    const res = await importAgentPayRule(importForm.file, importForm.updateSupport);
    ElMessage.success(`导入成功`);
    importDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('导入失败:', error);
    ElMessage.error('导入失败');
  } finally {
    loadingInstance.close();
  }
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
  await confirm($t('确定删除该代理商支付规则吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    await deleteAgentPayRule({ id: row.id });
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些代理商支付规则吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    await deleteAgentPayRule({ ids: checkedIds.value });
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

/** 启用代理商支付规则 */
async function handleEnable(row) {
  await confirm($t('确定启用该代理商支付规则吗？'));
  const loadingInstance = ElLoading.service({
    text: '正在启用...',
  });
  try {
    await enableAgentPayRule({ id: row.id });
    ElMessage.success('启用成功');
    handleRefresh();
  } catch (error) {
    console.error('启用失败:', error);
    ElMessage.error('启用失败');
  } finally {
    loadingInstance.close();
  }
}

/** 禁用代理商支付规则 */
async function handleDisable(row) {
  await confirm($t('确定禁用该代理商支付规则吗？'));
  const loadingInstance = ElLoading.service({
    text: '正在禁用...',
  });
  try {
    await disableAgentPayRule({ id: row.id });
    ElMessage.success('禁用成功');
    handleRefresh();
  } catch (error) {
    console.error('禁用失败:', error);
    ElMessage.error('禁用失败');
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
    const res = await getAgentPayRulePage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        lastUpdateTime: formatTimestamp(v.lastUpdateTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取代理商支付规则数据失败:', error);
    ElMessage.error('获取代理商支付规则数据失败');
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

// 状态映射
const statusMap = {
  'disabled': { label: '已禁用', type: 'danger' },
  'enabled': { label: '已生效', type: 'success' },
  'pending': { label: '待生效', type: 'warning' }, 
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[String(status)]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[String(status)]?.type || 'default';
};

// 代理商类型映射
const agentTypeMap = {
  merchant: { label: '商户代付', type: 'info' },
  enterprise: { label: '企业代付', type: 'success' },
  public: { label: '公益代付', type: 'primary' },
};

// 获取代理商类型标签
const getAgentTypeLabel = (agentType) => {
  return agentTypeMap[agentType]?.label || agentType;
};

// 获取代理商类型
const getAgentTypeType = (agentType) => {
  return agentTypeMap[agentType]?.type || 'default';
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

    <!-- 导入弹窗 -->
    <ElDialog
      v-model="importDialogVisible"
      title="导入代付规则"
      width="500px"
      append-to-body
    >
      <el-form :model="importForm" label-width="100px">
        <el-form-item label="Excel文件">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :show-file-list="false"
            :before-upload="() => false"
            @change="handleFileChange"
          >
            <el-button size="small" type="primary">点击选择文件</el-button>
          </el-upload>
          <div v-if="importForm.file" class="mt-2 text-sm text-gray-500">
            {{ importForm.file.name }}
          </div>
        </el-form-item>
        <el-form-item label="是否支持更新">
          <el-switch
            v-model="importForm.updateSupport"
            active-text="是"
            inactive-text="否"
          />
          <span class="ml-2 text-sm text-gray-400">开启后，已存在的数据将被更新</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleImportSubmit">
            导入
          </el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="新增"
            icon-name="Plus"
            @click="handleCreate"
          />
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="下载导入模板"
            icon-name="download"
            @click="handleDownloadTemplate"
          />
          <IconButton
            content="导入"
            icon-name="upload"
            @click="handleOpenImportDialog"
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
      <template #agentType="{ row }">
        <el-tag :type="getAgentTypeType(row.agentType)">
          {{ getAgentTypeLabel(row.agentType) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #checkNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.checkNo }}
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
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="启用"
            v-if="String(row.status) === 'disabled' || String(row.status) === 'pending'"
            icon-name="Check"
            @click="handleEnable(row)"
          />
          <IconButton
            content="禁用"
            v-if="String(row.status) === 'enabled'"
            icon-name="Close"
            @click="handleDisable(row)"
          />
          <IconButton
            content="删除"
            icon-name="Delete"
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
