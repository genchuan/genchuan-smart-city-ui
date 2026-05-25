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
  getRefundApplyPage,
  exportRefundApplyExcel,
  approveRefundApply,
  rejectRefundApply,
  reApplyRefundApply,
  executeRefundApply,
  batchAuditRefundApply,
} from '#/api/genchuan/industry/chargePark/orderTrade/refundMgmt/index.js';
import { getOrderPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import { getDetailEnObj } from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import OrderDetailDrawer from '#/views/genchuan/industry/chargePark/orderTrade/orderMgmt/allOrder/table/detail.vue';

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
      applyTimeStart: null,
      applyTimeEnd: null,
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
  onConfirm() { },
  async onOpenChange() { },
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

// 点击状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击申请人ID筛选
function handleFilterApplicantId(applicantId) {
  dataObj.searchObj = { ...dataObj.searchObj, applicantId: applicantId };
  queryFormApi.setValues({ applicantId: applicantId });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击审核人ID筛选
function handleFilterAuditUserId(auditUserId) {
  dataObj.searchObj = { ...dataObj.searchObj, auditUserId: auditUserId };
  queryFormApi.setValues({ auditUserId: auditUserId });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击操作人ID筛选
function handleFilterOperatorId(operatorId) {
  dataObj.searchObj = { ...dataObj.searchObj, operatorId: operatorId };
  queryFormApi.setValues({ operatorId: operatorId });
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

// 点击更新者筛选
function handleFilterUpdater(updater) {
  dataObj.searchObj = { ...dataObj.searchObj, updater: updater };
  queryFormApi.setValues({ updater: updater });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击关联订单ID跳转原订单详情弹窗
async function handleOpenOrderDetail(row) {
  try {
    const res = await getOrderPage({ orderNo: row.orderId });
    if (res.list && res.list.length > 0) {
      const firstOrder = res.list[0];
      dataObj.orderDetailObj = {
        ...firstOrder,
        payTime: formatTimestamp(firstOrder.payTime),
        updateTime: formatTimestamp(firstOrder.updateTime),
        createTime: formatTimestamp(firstOrder.createTime),
      };
      orderDetailDrawerRef.value?.open();
    } else {
      ElMessage.info('未找到相关订单信息');
    }
  } catch (error) {
    console.error('获取订单详情失败:', error);
    ElMessage.error('获取订单详情失败');
  }
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportRefundApplyExcel();
  downloadFileFromBlobPart({ fileName: '退款申请报表.xls', source: data });
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
    const res = await getRefundApplyPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        auditTime: formatTimestamp(v.auditTime),
        applyTime: formatTimestamp(v.applyTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取退款申请数据失败:', error);
    ElMessage.error('获取退款申请数据失败');
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
const orderDetailDrawerRef = ref(null);
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

// 退款申请状态映射
const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_exec: { label: '待执行', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
  rejected: { label: '已拒绝', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  const label = statusMap[status]?.label;
  return label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  const type = statusMap[status]?.type;
  return type || 'default';
};

// 审核弹窗
const auditDialogVisible = ref(false);
const auditForm = reactive({
  id: '',
  remark: '',
});

// 打开审核弹窗
const handleAudit = (row) => {
  auditForm.id = row.id;
  auditForm.remark = '';
  auditDialogVisible.value = true;
};

// 提交审核
const handleAuditSubmit = async () => {
  try {
    await approveRefundApply(auditForm);
    ElMessage.success('审核成功');
    auditDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('审核失败');
  }
};

// 拒绝弹窗
const rejectDialogVisible = ref(false);
const rejectForm = reactive({
  id: '',
  remark: '',
});

// 打开拒绝弹窗
const handleReject = (row) => {
  rejectForm.id = row.id;
  rejectForm.remark = '';
  rejectDialogVisible.value = true;
};

// 提交拒绝
const handleRejectSubmit = async () => {
  try {
    await rejectRefundApply(rejectForm);
    ElMessage.success('拒绝成功');
    rejectDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('拒绝失败');
  }
};

// 重新申请弹窗
const reapplyDialogVisible = ref(false);
const reapplyForm = reactive({
  id: '',
  remark: '',
});

// 打开重新申请弹窗
const handleReapply = (row) => {
  reapplyForm.id = row.id;
  reapplyForm.remark = '';
  reapplyDialogVisible.value = true;
};

// 提交重新申请
const handleReapplySubmit = async () => {
  try {
    await reApplyRefundApply(reapplyForm);
    ElMessage.success('重新申请成功');
    reapplyDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('重新申请失败');
  }
};

// 执行弹窗
const executeDialogVisible = ref(false);
const executeForm = reactive({
  id: '',
  remark: '',
});

// 打开执行弹窗
const handleExecute = (row) => {
  executeForm.id = row.id;
  executeForm.remark = '';
  executeDialogVisible.value = true;
};

// 提交执行
const handleExecuteSubmit = async () => {
  try {
    await executeRefundApply(executeForm);
    ElMessage.success('执行成功');
    executeDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('执行失败');
  }
};

// 批量审核
const handleBatchAudit = async () => {
  try {
    const data = {
      ids: checkedIds.value,
      remark: '',
    };
    await batchAuditRefundApply(data);
    ElMessage.success('批量审核成功');
    checkedIds.value = [];
    handleRefresh();
  } catch {
    ElMessage.error('批量审核失败');
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
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <enDetailDrawer ref="enDetailObjRef" :detail-obj="dataObj.enDetailObj" />
    <OrderDetailDrawer ref="orderDetailDrawerRef" :detail-obj="dataObj.orderDetailObj" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 告警明细弹窗 -->
    <ElDialog v-model="alarmDialogVisible" title="本半年食品安全问题明细" width="900px" append-to-body>
      <el-table :data="alarmList" border height="450">
        <el-table-column v-for="col in alarmColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width" />
      </el-table>
    </ElDialog>

    <!-- 审核弹窗 -->
    <ElDialog v-model="auditDialogVisible" title="退款审核" width="500px" append-to-body>
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="申请ID">
          <el-input v-model="auditForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark" type="textarea" rows="3" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAuditSubmit">
            确认审核
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 拒绝弹窗 -->
    <ElDialog v-model="rejectDialogVisible" title="拒绝退款" width="500px" append-to-body>
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="申请ID">
          <el-input v-model="rejectForm.id" disabled />
        </el-form-item>
        <el-form-item label="拒绝原因">
          <el-input v-model="rejectForm.remark" type="textarea" rows="3" placeholder="请输入拒绝原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRejectSubmit">
            确认拒绝
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 重新申请弹窗 -->
    <ElDialog v-model="reapplyDialogVisible" title="重新申请退款" width="500px" append-to-body>
      <el-form :model="reapplyForm" label-width="80px">
        <el-form-item label="申请ID">
          <el-input v-model="reapplyForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="reapplyForm.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reapplyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleReapplySubmit">
            确认重新申请
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 执行弹窗 -->
    <ElDialog v-model="executeDialogVisible" title="执行退款" width="500px" append-to-body>
      <el-form :model="executeForm" label-width="80px">
        <el-form-item label="申请ID">
          <el-input v-model="executeForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="executeForm.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="executeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleExecuteSubmit">
            确认执行
          </el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="批量审核" icon-name="Check" :disabled="isEmpty(checkedIds)" @click="handleBatchAudit" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" class="cursor-pointer" @click="handleFilterStatus(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #recordNo="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align cursor-pointer" type="primary">
          {{ row.recordNo }}
        </el-text>
      </template>
      <template #halfyearWarnCount="{ row }">
        <el-text @click="handleTotal(row)" class="common-align cursor-pointer" type="primary">
          {{ row.halfyearWarnCount }}
        </el-text>
      </template>

      <template #applyNo="{ row }">
        <span @click="handleOpenDetail(row)" class="common-align cursor-pointer text-primary">
          {{ row.applyNo }}
        </span>
      </template>

      <template #orderId="{ row }">
        <el-text @click="handleOpenOrderDetail(row)" class="common-align cursor-pointer" type="primary"> {{ row.orderId
          }} </el-text>

      </template>

      <template #applicantId="{ row }">
        <el-text @click="handleFilterApplicantId(row.applicantId)" class="common-align cursor-pointer" type="primary">
          {{ row.applicantId }}
        </el-text>
      </template>

      <template #auditUserId="{ row }">
        <el-text @click="handleFilterAuditUserId(row.auditUserId)" class="common-align cursor-pointer" type="primary">
          {{ row.auditUserId }}
        </el-text>
      </template>

      <template #operatorId="{ row }">
        <el-text @click="handleFilterOperatorId(row.operatorId)" class="common-align cursor-pointer" type="primary">
          {{ row.operatorId }}
        </el-text>
      </template>

      <template #creator="{ row }">
        <el-text @click="handleFilterCreator(row.creator)" class="common-align cursor-pointer" type="primary">
          {{ row.creator }}
        </el-text>
      </template>

      <template #updater="{ row }">
        <el-text @click="handleFilterUpdater(row.updater)" class="common-align cursor-pointer" type="primary">
          {{ row.updater }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="审核" v-if="row.status === 'pending_audit'" icon-name="Check" @click="handleAudit(row)" />
          <IconButton content="拒绝" v-if="row.status === 'pending_audit'" icon-name="Close" color="#F56C6C"
            @click="handleReject(row)" />
          <IconButton content="重新申请" v-if="row.status === 'rejected'" icon-name="Refresh" @click="handleReapply(row)" />
          <IconButton content="执行" v-if="row.status === 'pending_exec'" icon-name="right" @click="handleExecute(row)" />
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
