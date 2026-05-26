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
  checkAbnormalOrder,
  exportAbnormalOrderExcel,
  getAbnormalOrderPage,
  ignoreAbnormalOrder,
  updateAbnormalOrderProgress,
  batchHandleAbnormalOrder,
  getAllOrderPage
} from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
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
      identifyTimeStart: null,
      identifyTimeEnd: null,
      abnormalType: null,
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

// 监听筛选参数变化
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

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportAbnormalOrderExcel();
  downloadFileFromBlobPart({ fileName: '异常订单报表.xls', source: data });
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
    const res = await getAbnormalOrderPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        identifyTime:  formatTimestamp(v.identifyTime),
        returnTime: formatTimestamp(v.returnTime),
        archiveTime: formatTimestamp(v.archiveTime),
        createOrderTime: formatTimestamp(v.createOrderTime),
        updateTime: formatTimestamp(v.updateTime),
        createTime: formatTimestamp(v.createTime),
        payTime: formatTimestamp(v.payTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取订单数据失败:', error);
    ElMessage.error('获取订单数据失败');
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
const orderDetailObj = ref({});
const arrowChange = () => {
  emit('arrow-change');
};

const handleOpenOrderDetail = async (row) => {
  try {
    const res = await getAllOrderPage({ id: row.orderId });
    const formattedData = res ? {
      ...res,
      payTime: formatTimestamp(res.payTime),
      createTime: formatTimestamp(res.createTime),
      updateTime: formatTimestamp(res.updateTime),
    } : row;
    orderDetailObj.value = formattedData;
    orderDetailDrawerRef.value?.open();
  } catch (error) {
    console.error('获取订单详情失败:', error);
    orderDetailObj.value = row;
    orderDetailDrawerRef.value?.open();
  }
};
const autoElmessage = () => {
  ElMessage.success($t('月报自动刷新成功'));
};
const openEn = async () => {
  const res = await getDetailEnObj(1);
  dataObj.enDetailObj = res;
  enDetailObjRef.value?.open();
};

// 处置状态映射
const statusMap = {
  unhandled: { label: '未处理', type: 'danger' },
  handling: { label: '处理中', type: 'warning' },
  closed: { label: '已关闭', type: 'info' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 订单类型映射
const orderTypeMap = {
  temp_park: { label: '临时停车' },
  offtime_park: { label: '错时停车' },
  car_charge: { label: '汽车充电' },
  bike_charge: { label: '两轮充电' },
  share_charge: { label: '共享充电' },
};

// 获取订单类型标签
const getOrderTypeLabel = (orderType) => {
  return orderTypeMap[orderType]?.label || orderType;
};

// 异常类型映射
const abnormalTypeMap = {
  payment_error: { label: '支付异常' },
  billing_error: { label: '计费异常' },
  status_error: { label: '状态异常' },
};

// 获取异常类型标签
const getAbnormalTypeLabel = (abnormalType) => {
  return abnormalTypeMap[abnormalType]?.label || abnormalType;
};

// 筛选订单类型
const handleFilterOrderType = (orderType) => {
  dataObj.searchObj.orderType = orderType;
  dataObj.currentPage = 1;
  gridApi.query();
};

// 筛选异常类型
const handleFilterAbnormalType = (abnormalType) => {
  dataObj.searchObj.abnormalType = abnormalType;
  dataObj.currentPage = 1;
  gridApi.query();
};

// 筛选处置状态
const handleFilterStatus = (status) => {
  dataObj.searchObj.status = status;
  dataObj.currentPage = 1;
  gridApi.query();
};

// 筛选所属场站
const handleFilterStationName = (stationName) => {
  dataObj.searchObj.stationName = stationName;
  dataObj.currentPage = 1;
  gridApi.query();
};

// 检查弹窗
const checkDialogVisible = ref(false);
const checkForm = reactive({
  id: '',
  remark: '',
});

// 打开检查弹窗
const handleCheck = (row) => {
  checkForm.id = row.id;
  checkForm.remark = '';
  checkDialogVisible.value = true;
};

// 提交检查
const handleCheckSubmit = async () => {
  try {
    await checkAbnormalOrder(checkForm);
    ElMessage.success('检查成功');
    checkDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('检查失败');
  }
};

// 忽略弹窗
const ignoreDialogVisible = ref(false);
const ignoreForm = reactive({
  id: '',
  remark: '',
});

// 打开忽略弹窗
const handleIgnore = (row) => {
  ignoreForm.id = row.id;
  ignoreForm.remark = '';
  ignoreDialogVisible.value = true;
};

// 提交忽略
const handleIgnoreSubmit = async () => {
  try {
    await ignoreAbnormalOrder(ignoreForm);
    ElMessage.success('忽略成功');
    ignoreDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('忽略失败');
  }
};

// 更新进度弹窗
const updateProgressDialogVisible = ref(false);
const updateProgressForm = reactive({
  id: '',
  remark: '',
});

// 打开更新进度弹窗
const handleUpdateProgress = (row) => {
  updateProgressForm.id = row.id;
  updateProgressForm.remark = '';
  updateProgressDialogVisible.value = true;
};

// 提交更新进度
const handleUpdateProgressSubmit = async () => {
  try {
    await updateAbnormalOrderProgress(updateProgressForm);
    ElMessage.success('进度更新成功');
    updateProgressDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('进度更新失败');
  }
};

// 批量处置弹窗
const batchHandleDialogVisible = ref(false);
const batchHandleForm = reactive({
  ids: [],
  remark: '',
});

// 打开批量处置弹窗
const handleHandleBatchSubmit = () => {
  batchHandleForm.ids = checkedIds.value;
  batchHandleForm.remark = '';
  batchHandleDialogVisible.value = true;
};

// 提交批量处置
const handleBatchHandleSubmit = async () => {
  try {
    await batchHandleAbnormalOrder(batchHandleForm);
    ElMessage.success('批量处置成功');
    batchHandleDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('批量处置失败');
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
    <OrderDetailDrawer ref="orderDetailDrawerRef" :detail-obj="orderDetailObj" />
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

    <!-- 检查弹窗 -->
    <ElDialog
      v-model="checkDialogVisible"
      title="异常订单检查"
      width="500px"
      append-to-body
    >
      <el-form :model="checkForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="checkForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="checkForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入检查备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="checkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCheckSubmit">
            确认检查
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 忽略弹窗 -->
    <ElDialog
      v-model="ignoreDialogVisible"
      title="忽略异常订单"
      width="500px"
      append-to-body
    >
      <el-form :model="ignoreForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="ignoreForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="ignoreForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入忽略备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ignoreDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIgnoreSubmit">
            确认忽略
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 更新进度弹窗 -->
    <ElDialog
      v-model="updateProgressDialogVisible"
      title="更新进度"
      width="500px"
      append-to-body
    >
      <el-form :model="updateProgressForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="updateProgressForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="updateProgressForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入进度更新备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateProgressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateProgressSubmit">
            确认更新
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 批量处置弹窗 -->
    <ElDialog
      v-model="batchHandleDialogVisible"
      title="批量处置异常订单"
      width="500px"
      append-to-body
    >
      <el-form :model="batchHandleForm" label-width="80px">
        <el-form-item label="订单ID列表">
          <el-input :value="batchHandleForm.ids.join(',')" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchHandleForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入处置备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchHandleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchHandleSubmit">
            确认处置
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
            content="批量处置异常订单"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleHandleBatchSubmit"
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
      <template #orderType="{ row }">
        <el-text
          @click="handleFilterOrderType(row.orderType)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ getOrderTypeLabel(row.orderType) }}
        </el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-text
          @click="handleFilterAbnormalType(row.abnormalType)"
          class="common-align cursor-pointer"
          type="danger"
        >
          {{ getAbnormalTypeLabel(row.abnormalType) }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text
          @click="handleFilterStatus(row.status)"
          class="common-align cursor-pointer"
          :style="{ color: row.status === 'unhandled' ? '#F56C6C' : row.status === 'handling' ? '#E6A23C' : '#909399' }"
        >
          {{ getStatusLabel(row.status) }}
        </el-text>
      </template>
      <template #stationName="{ row }">
        <el-text
          @click="handleFilterStationName(row.stationName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.stationName || '-' }}
        </el-text>
      </template>
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #payMethod="{ row }">
        <span v-if="row.payMethod === 'wechat'">微信</span>
        <span v-else-if="row.payMethod === 'alipay'">支付宝</span>
        <span v-else-if="row.payMethod === 'bank'">银行卡</span>
        <span v-else-if="row.payMethod === 'cash'">现金</span>
        <span v-else>{{ row.payMethod }}</span>
      </template>
      <template #halfyearWarnCount="{ row }">
        <el-text @click="handleTotal(row)" class="common-align" type="primary">
          {{ row.halfyearWarnCount }}
        </el-text>
      </template>

      <template #orderId="{ row }">
        <el-text
          @click="handleOpenOrderDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderId }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton v-if="row.status === 'unhandled'" content="核查" icon-name="Search" @click="handleCheck(row)" />
          <IconButton v-if="row.status === 'unhandled'" content="忽略" icon-name="delete" color="#F56C6C" @click="handleIgnore(row)" />
          <IconButton v-if="row.status === 'handling'" content="更新进度" icon-name="Refresh" @click="handleUpdateProgress(row)" />
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
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
