<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDetailEnObj } from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { downloadLocalTemplate } from '#/utils/genchuan/down';

import { formatTimestamp } from '#/utils';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';
import { getViolationAnalyticsPage, exporViolationAnalyticsExcel, exporViolationAnalyticsPDF, getViolationAnalyticsDrill } from '#/api/genchuan/industry/marketsupervision/index.js';
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

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exporViolationAnalyticsExcel(dataObj.getParams);
  downloadFileFromBlobPart({
    fileName: '企业违规数据分析.xls',
    source: data,
  });
}

// ====================== 导出PDF ======================
async function handlePDF() {
  const data = await exporViolationAnalyticsPDF(dataObj.getParams);
  downloadFileFromBlobPart({
    fileName: '企业违规数据分析.pdf',
    source: data,
  });
}

/** 创建 */
function handleCreate() {
  formDrawerApi.setData({ title: '新增' }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: '编辑', ...row }).open();
}

/** 删除 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    // 调用删除接口
    // await deleteViolation(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
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

const checkedIds = ref([]);
const checkArray = ref([])
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  checkArray.value = records
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
  serachObj: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据
const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  dataObj.getParams = getParams;
  const data = await getViolationAnalyticsPage(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list;
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
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
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

const activeName = ref('');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};

const tabsData = ref([
  { label: '全部', value: '' },
  { label: '月租车', value: '1' },
  { label: '临时车', value: '0' },
]);

const createLabel = (item) => {
  return item.label;
};

const handleClick = () => {
  dataObj.serachObj.plateType = activeName.value;
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
const openEn = async (row) => {
  const res = await getDetailEnObj(row.entId);
  dataObj.enDetailObj = res;
  enDetailObjRef.value?.open();
};

// ====================== 告警明细弹窗 ======================
const alarmDialogVisible = ref(false);
const currentAlarmRow = ref({});
const alarmList = ref([]);

// 生成模拟告警明细
function generateAlarmData(row) {
  const count = row.totalAlarmCount || 0;
  const types = row.highFreqViolationType.split(',').map((item) => {
    const [name, num] = item.split(':');
    return { name, num: Number(num) };
  });

  const list = [];
  let id = 1;
  types.forEach((type) => {
    for (let i = 0; i < type.num; i++) {
      list.push({
        id: id++,
        canteenName: row.canteenName,
        alarmType: type.name,
        alarmTime: `${row.statisticsDate} ${String(Math.trunc(Math.random() * 24)).padStart(2, '0')}:${String(Math.trunc(Math.random() * 60)).padStart(2, '0')}`,
        alarmLevel: ['一般', '较重', '严重'][Math.trunc(Math.random() * 3)],
        status: ['未处理', '处理中', '已整改'][Math.trunc(Math.random() * 3)],
      });
    }
  });
  return list.slice(0, count);
}

// 打开告警弹窗
function handleTotal(row) {
  currentAlarmRow.value = row;
  alarmList.value = generateAlarmData(row);
  alarmDialogVisible.value = true;
}

// 告警弹窗列
const alarmColumns = [
  { label: '序号', prop: 'id', width: 70 },
  { label: '食堂名称', prop: 'canteenName' },
  { label: '告警类型', prop: 'alarmType' },
  { label: '告警时间', prop: 'alarmTime' },
  { label: '告警等级', prop: 'alarmLevel' },
  { label: '处理状态', prop: 'status' },
];
// 告警明细弹窗
const alarmDrillVisible = ref(false);
const alarmDrillList = ref([]);

// 整改复审台账弹窗
const rectifyReviewVisible = ref(false);
const rectifyReviewList = ref([]);

// 设备正常率弹窗
const deviceNormalVisible = ref(false);
const deviceNormalList = ref([]);

// 整改完成率弹窗
const rectifyFinishVisible = ref(false);
const rectifyFinishList = ref([]);

// 打开告警明细弹窗
const oepnalarmCount = async (row, type) => {
  const data = await getViolationAnalyticsDrill({ entId: row.entId ,...dataObj.getParams});

  if (type === 'noAi') {
    rectifyReviewList.value = data.rectifyReviewDOList.map((item) => ({
      ...item,
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
      draftTime: formatTimestamp(item.draftTime),
      rectifyDeadlineTime: formatTimestamp(item.rectifyDeadlineTime),
      reviewTime: formatTimestamp(item.reviewTime),
      cancelTime: formatTimestamp(item.cancelTime),
    }));
    rectifyReviewVisible.value = true;
  } else if(type === 'rectifyFinishRate') {
    rectifyFinishList.value = data.rectifyFinishList.map((item) => ({
      ...item,
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
      draftTime: formatTimestamp(item.draftTime),
      rectifyDeadlineTime: formatTimestamp(item.rectifyDeadlineTime),
      reviewTime: formatTimestamp(item.reviewTime),
      cancelTime: formatTimestamp(item.cancelTime),
    }));
    rectifyFinishVisible.value = true;
  } else if(type === 'deviceNormalRate') {
    deviceNormalList.value = data.deviceNormalList.map((item) => ({
      ...item,
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
    }));
    deviceNormalVisible.value = true;
  } else {
    alarmDrillList.value = data.alarmList || [];
    alarmDrillList.value = alarmDrillList.value.map((item) => ({
      ...item,
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
    }));

    alarmDrillVisible.value = true;
  }
};

// 告警钻取列
const alarmDrillColumns = [
  { label: 'ID', prop: 'id', width: 80 },
  { label: '创建时间', prop: 'createTime', width: 180 }, 
  { label: '告警类型', prop: 'alertTypeName', width: 120 },
  { label: '设备编码', prop: 'deviceCode', width: 180 },
  { label: '告警来源', prop: 'alertSourceName', width: 120 },
  { label: '设备手机号', prop: 'deviceAccount', width: 150 }, 
];

// 整改复审台账列
const rectifyReviewColumns = [ 
  { label: '整改通知书id', prop: 'rectifyNoticeId', width: 150 },
  { label: '台账编号', prop: 'ledgerCode', width: 200 },
  { label: '违规类型', prop: 'illegalTypeName', width: 120 },
  { label: '违规等级', prop: 'illegalLevelName', width: 150 }, 
  { label: '违规证据链接', prop: 'evidenceUrl', width: 400, slot: 'evidenceUrl' },
  { label: '草拟时间', prop: 'draftTime', width: 180 },
  { label: '整改截至时间', prop: 'rectifyDeadlineTime', width: 180 },
  { label: '复审状态', prop: 'reviewStatus', width: 120 },
  { label: '复审人', prop: 'reviewUserName', width: 120 },
  { label: '复审时间', prop: 'reviewTime', width: 180 },
  { label: '撤销时间', prop: 'cancelTime', width: 180 }, 
  { label: '执法复审台账编号', prop: 'lawLedgerCode', width: 200 },
  { label: '整改通知书编号', prop: 'rectifyNoticeCode', width: 200 }, 
];

// 设备正常率列
const deviceNormalColumns = [
  { label: 'ID', prop: 'id', width: 80 },
  { label: '设备编号', prop: 'deviceCode', width: 180 },
  { label: '设备名称', prop: 'deviceName', width: 200 },
  { label: '设备类型', prop: 'deviceType', width: 150 },
  { label: '所属企业ID', prop: 'entId', width: 120 },
  { label: '所属区域ID', prop: 'areaId', width: 120 },
  { label: '状态', prop: 'status', width: 120 },
];

// 整改完成率列
const rectifyFinishColumns = [
  { label: 'ID', prop: 'id', width: 80 },
  { label: '整改通知书id', prop: 'rectifyNoticeId', width: 150 },
  { label: '台账编号', prop: 'ledgerCode', width: 200 }, 
  { label: '违规证据链接', prop: 'evidenceUrl', width: 400, slot: 'evidenceUrl' },
  { label: '草拟时间', prop: 'draftTime', width: 180 },
  { label: '整改截至时间', prop: 'rectifyDeadlineTime', width: 180 },
  { label: '复审状态', prop: 'reviewStatus', width: 120 }, 
  { label: '复审时间', prop: 'reviewTime', width: 180 },
  { label: '撤销时间', prop: 'cancelTime', width: 180 }, 
  { label: '执法复审台账编号', prop: 'lawLedgerCode', width: 200 },
  { label: '整改通知书编号', prop: 'rectifyNoticeCode', width: 200 }, 
];
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <enDetailDrawer ref="enDetailObjRef" :detail-obj="dataObj.enDetailObj" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 告警明细弹窗 -->
    <ElDialog v-model="alarmDialogVisible" title="当日食品安全问题明细" width="900px" append-to-body>
      <el-table :data="alarmList" border height="450">
        <el-table-column v-for="col in alarmColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width" />
      </el-table>
    </ElDialog>

    <!-- 告警钻取明细弹窗 -->
    <ElDialog v-model="alarmDrillVisible" title="告警明细" width="1200px" append-to-body>
      <el-table :data="alarmDrillList" border height="450">
        <el-table-column label="图片地址" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <img :src="scope.row.srcUrl" alt="" style="width: 80px; height: 80px;">
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="col in alarmDrillColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width">

        </el-table-column>
      </el-table>
    </ElDialog>

    <!-- 整改复审台账弹窗 -->
    <ElDialog v-model="rectifyReviewVisible" title="违规详情" width="1200px" append-to-body>
      <el-table :data="rectifyReviewList" border height="450">
        <el-table-column v-for="col in rectifyReviewColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width">
          <template #default="{ row }" v-if="col.slot === 'evidenceUrl'">
            <div v-if="row.evidenceUrl">
              <img
                v-for="(item, index) in JSON.parse(row.evidenceUrl)"
                :key="index"
                :src="item.url"
                style="width: 80px; height: 80px; margin-right: 10px;"
                alt="违规证据"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </ElDialog>

    <!-- 设备正常率弹窗 -->
    <ElDialog v-model="deviceNormalVisible" title="正常设备列表" width="1200px" append-to-body>
      <el-table :data="deviceNormalList" border height="450">
        <el-table-column v-for="col in deviceNormalColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width">
        </el-table-column>
      </el-table>
    </ElDialog>

    <!-- 整改完成率弹窗 -->
    <ElDialog v-model="rectifyFinishVisible" title="已完成的整改" width="1200px" append-to-body>
      <el-table :data="rectifyFinishList" border height="450">
        <el-table-column v-for="col in rectifyFinishColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width">
          <template #default="{ row }" v-if="col.slot === 'evidenceUrl'">
            <div v-if="row.evidenceUrl">
              <img
                v-for="(item, index) in JSON.parse(row.evidenceUrl)"
                :key="index"
                :src="item.url"
                style="width: 80px; height: 80px; margin-right: 10px;"
                alt="违规证据"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="刷新" icon-name="refresh" @click="autoElmessage" />
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="导出PDF" icon-name="download" @click="handlePDF" />
          <!-- <IconButton content="批量删除" icon-name="delete" color="#F56C6C" :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch" /> -->
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #totalAlarmCount="{ row }">
        <el-text @click="handleTotal(row)" class="common-align" type="primary">
          {{ row.totalAlarmCount }}
        </el-text>
      </template>

      <template #entName="{ row }">
        <el-text @click="openEn(row)" class="common-align" type="primary">
          {{ row.entName }}
        </el-text>
      </template>
      <template #alarmCount="{ row }">
        <el-text @click="oepnalarmCount(row)" class="common-align" type="primary">
          {{ row.alarmCount }}
        </el-text>
      </template>
      <template #violationCount="{ row }">
        <el-text class="common-align" @click="oepnalarmCount(row, 'noAi')" type="primary">
          {{ row.violationCount }}
        </el-text>
      </template>
      <template #deviceNormalRate="{ row }">
        <el-text @click="oepnalarmCount(row, 'deviceNormalRate')" class="common-align" type="primary">
          {{ row.deviceNormalRate }}
        </el-text>
      </template> 
      <template #rectifyFinishRate="{ row }">
        <el-text @click="oepnalarmCount(row, 'rectifyFinishRate')" class="common-align" type="primary">
          {{ row.rectifyFinishRate }}
        </el-text>
      </template>


      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" /> 
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
