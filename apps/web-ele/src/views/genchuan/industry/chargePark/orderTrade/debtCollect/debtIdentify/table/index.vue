<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  batchIdentifyDebtIdentify,
  exportDebtIdentifyExcel,
  getDebtIdentifyPage,
  identifyDebtIdentify,
  markDebtIdentify,
} from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import { getDetailEnObj } from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import PlateNoDetail from '#/views/genchuan/industry/chargePark/orderTrade/orderMgmt/components/plateNoDetail.vue';

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
      status: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

import { watch } from 'vue';

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

// 点击识别状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击所属场站筛选
function handleFilterStationName(stationName) {
  dataObj.searchObj = { ...dataObj.searchObj, stationName: stationName };
  queryFormApi.setValues({ stationName: stationName });
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

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportDebtIdentifyExcel();
  downloadFileFromBlobPart({ fileName: '逃费识别报表.xls', source: data });
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
    const res = await getDebtIdentifyPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        identifyTime: formatTimestamp(v.identifyTime),
        markTime: formatTimestamp(v.markTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
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
const handlePlateDetail = (row) => {
  currentPlateNo.value = row.plateNo;
  plateDetailVisible.value = true;
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
const plateDetailVisible = ref(false);
const currentPlateNo = ref('');
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

// 逃费识别状态映射
const statusMap = {
  pending: { label: '待识别', type: 'warning' },
  identified: { label: '已识别', type: 'success' },
  marked: { label: '已标记（非逃费）', type: 'info' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 标记弹窗
const markDialogVisible = ref(false);
const markForm = reactive({
  id: '',
  remark: '',
});

// 打开标记弹窗
const handleMark = (row) => {
  markForm.id = row.id;
  markForm.remark = '';
  markDialogVisible.value = true;
};

// 提交标记
const handleMarkSubmit = async () => {
  try {
    await markDebtIdentify(markForm);
    ElMessage.success('标记成功');
    markDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('标记失败');
  }
};

// 识别弹窗
const identifyDialogVisible = ref(false);
const identifyForm = reactive({
  id: '',
  remark: '',
});

// 打开识别弹窗
const handleIdentify = (row) => {
  identifyForm.id = row.id;
  identifyForm.remark = '';
  identifyDialogVisible.value = true;
};

// 提交识别
const handleIdentifySubmit = async () => {
  try {
    await identifyDebtIdentify(identifyForm);
    ElMessage.success('识别成功');
    identifyDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('识别失败');
  }
};

// 批量识别弹窗
const batchIdentifyDialogVisible = ref(false);
const batchIdentifyForm = reactive({
  ids: [],
  remark: '',
});

// 打开批量识别弹窗
const handleBatchIdentifySubmit = () => {
  batchIdentifyForm.ids = checkedIds.value;
  batchIdentifyForm.remark = '';
  batchIdentifyDialogVisible.value = true;
};

// 提交批量识别
const handleBatchIdentify = async () => {
  try {
    await batchIdentifyDebtIdentify(batchIdentifyForm);
    ElMessage.success('批量识别成功');
    batchIdentifyDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('批量识别失败');
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

    <!-- 车牌详情弹窗 -->
    <PlateNoDetail v-model:visible="plateDetailVisible" :plate-no="currentPlateNo" />
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

    <!-- 标记弹窗 -->
    <ElDialog
      v-model="markDialogVisible"
      title="标记逃费识别"
      width="500px"
      append-to-body
    >
      <el-form :model="markForm" label-width="80px">
        <el-form-item label="识别ID">
          <el-input v-model="markForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="markForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入标记备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="markDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleMarkSubmit">
            确认标记
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 识别弹窗 -->
    <ElDialog
      v-model="identifyDialogVisible"
      title="逃费识别"
      width="500px"
      append-to-body
    >
      <el-form :model="identifyForm" label-width="80px">
        <el-form-item label="识别ID">
          <el-input v-model="identifyForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="identifyForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入识别备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="identifyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIdentifySubmit">
            确认识别
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 批量识别弹窗 -->
    <ElDialog
      v-model="batchIdentifyDialogVisible"
      title="批量逃费识别"
      width="500px"
      append-to-body
    >
      <el-form :model="batchIdentifyForm" label-width="120px">
        <el-form-item label="识别ID列表">
          <el-input :value="batchIdentifyForm.ids.join(',')" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchIdentifyForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入识别备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchIdentifyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchIdentify">
            确认批量识别
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
            content="批量识别"
            icon-name="Search"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchIdentifySubmit"
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
      <template #identifyNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.identifyNo }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text
          @click="handlePlateDetail(row)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #stationName="{ row }">
        <el-text 
          @click="handleFilterStationName(row.stationName)" 
          class="common-align cursor-pointer" 
          type="primary"
        >
          {{ row.stationName }}
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
            v-if="row.status === 'pending'"
            content="识别"
            icon-name="Search"
            @click="handleIdentify(row)"
          />
          <IconButton
            v-if="row.status === 'identified' || row.status === 'marked'"
            content="标记"
            icon-name="edit"
            @click="handleMark(row)"
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
