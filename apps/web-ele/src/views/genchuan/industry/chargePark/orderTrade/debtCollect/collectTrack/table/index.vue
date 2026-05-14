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
  getDebtRecordCollectTrackPage,
  pushDebtRecordCollectTrack,
  transferDebtRecordCollectTrack,
  updateProgressDebtRecordCollectTrack,
  exportDebtRecordCollectTrackExcel,
  batchPushDebtRecordCollectTrack,
  archiveDebtRecordCollectTrack,
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
      status: null,
    }),
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

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportDebtRecordCollectTrackExcel();
  downloadFileFromBlobPart({ fileName: '追缴跟踪报表.xls', source: data });
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
    ...props.filterParams,
  };

  try {
    dataObj.loading = true;
    const res = await getDebtRecordCollectTrackPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        collectTime: formatTimestamp(v.collectTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
        pushTime: formatTimestamp(v.pushTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取追缴跟踪数据失败:', error);
    ElMessage.error('获取追缴跟踪数据失败');
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

// 订单状态映射
// 追缴跟踪状态映射
const statusMap = {
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

// 推送弹窗
const pushDialogVisible = ref(false);
const pushForm = reactive({
  id: '',
  remark: '',
});

// 打开推送弹窗
const handlePush = (row) => {
  pushForm.id = row.id;
  pushForm.remark = '';
  pushDialogVisible.value = true;
};

// 提交推送
const handlePushSubmit = async () => {
  try {
    await pushDebtRecordCollectTrack(pushForm);
    ElMessage.success('推送成功');
    pushDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('推送失败');
  }
};

// 转移弹窗
const transferDialogVisible = ref(false);
const transferForm = reactive({
  id: '',
  remark: '',
});

// 打开转移弹窗
const handleTransfer = (row) => {
  transferForm.id = row.id;
  transferForm.remark = '';
  transferDialogVisible.value = true;
};

// 提交转移
const handleTransferSubmit = async () => {
  try {
    await transferDebtRecordCollectTrack(transferForm);
    ElMessage.success('转移成功');
    transferDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('转移失败');
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
    await updateProgressDebtRecordCollectTrack(updateProgressForm);
    ElMessage.success('进度更新成功');
    updateProgressDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('进度更新失败');
  }
};

// 归档弹窗
const archiveDialogVisible = ref(false);
const archiveForm = reactive({
  id: '',
  remark: '',
});

// 打开归档弹窗
const handleArchive = (row) => {
  archiveForm.id = row.id;
  archiveForm.remark = '';
  archiveDialogVisible.value = true;
};

// 提交归档
const handleArchiveSubmit = async () => {
  try {
    await archiveDebtRecordCollectTrack(archiveForm);
    ElMessage.success('归档成功');
    archiveDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('归档失败');
  }
};

// 批量推送弹窗
const batchPushDialogVisible = ref(false);
const batchPushForm = reactive({
  remark: '',
});

// 打开批量推送弹窗
const handleBatchPush = () => {
  batchPushForm.remark = '';
  batchPushDialogVisible.value = true;
};

// 提交批量推送
const handleBatchPushSubmit = async () => {
  try {
    await batchPushDebtRecordCollectTrack({ ids: checkedIds.value, remark: batchPushForm.remark });
    ElMessage.success('批量推送成功');
    batchPushDialogVisible.value = false;
    checkedIds.value = [];
    handleRefresh();
  } catch {
    ElMessage.error('批量推送失败');
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

    <!-- 推送弹窗 -->
    <ElDialog
      v-model="pushDialogVisible"
      title="推送"
      width="500px"
      append-to-body
    >
      <el-form :model="pushForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="pushForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="pushForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入推送备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="pushDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePushSubmit">
            确认推送
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 转移弹窗 -->
    <ElDialog
      v-model="transferDialogVisible"
      title="转移"
      width="500px"
      append-to-body
    >
      <el-form :model="transferForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="transferForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入转移备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="transferDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTransferSubmit">
            确认转移
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
        <el-form-item label="记录ID">
          <el-input v-model="updateProgressForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="updateProgressForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入进度备注"
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

    <!-- 归档弹窗 -->
    <ElDialog
      v-model="archiveDialogVisible"
      title="归档"
      width="500px"
      append-to-body
    >
      <el-form :model="archiveForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="archiveForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="archiveForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入归档备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="archiveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleArchiveSubmit">
            确认归档
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 批量推送弹窗 -->
    <ElDialog
      v-model="batchPushDialogVisible"
      title="批量推送"
      width="500px"
      append-to-body
    >
      <el-form :model="batchPushForm" label-width="80px">
        <el-form-item label="选中数量">
          <el-input :value="checkedIds.length" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchPushForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入推送备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchPushDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchPushSubmit">
            确认推送
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
            content="批量推送"
            icon-name="top"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchPush"
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
      <template #collectMethod="{ row }">
        <el-tag :type="getCollectMethodType(row.collectMethod)">
          {{ getCollectMethodLabel(row.collectMethod) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template> 
      <template #trackNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.trackNo }}
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
            content="推送"
            icon-name="top"
            @click="handlePush(row)"
          />
          <IconButton
            content="转移"
            icon-name="right"
            @click="handleTransfer(row)"
          />
          <IconButton
            content="更新进度"
            icon-name="sort"
            @click="handleUpdateProgress(row)"
          />
          <IconButton
            content="归档"
            icon-name="check"
            @click="handleArchive(row)"
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
