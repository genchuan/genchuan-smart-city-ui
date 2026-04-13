<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui'; 
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件
import * as XLSX from 'xlsx';
 
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDetailEnObj, getRiskReportPage, exporRiskReportExcel, exporRiskReportPDF, exporRiskReportPDFSinglePDF } from '#/api/genchuan/industry/marketsupervision/index.js';
import { $t } from '#/locales';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import {   useFormSchema, useGridColumns } from './data';
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
   const data = await exporRiskReportExcel(dataObj.getParams);
  downloadFileFromBlobPart({
    fileName: '企业风险评估报表.xls',
    source: data,
  });
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  const data = await exporRiskReportPDF(dataObj.getParams);
  downloadFileFromBlobPart({
    fileName: '企业风险评估报表.pdf',
    source: data,
  });
}

// 导出单条PDF
async function handleExportSinglePDF(row) {
  // 删除row.riskLevelDrill 对象
  const { riskLevelDrill, beginTime, endTime, ...exportRow } = row;
  
  // 拼接beginTime数组为字符串
  if (Array.isArray(beginTime)) {
    exportRow.beginTime = `${beginTime[0]}-${String(beginTime[1] + 1).padStart(2, '0')}-${String(beginTime[2]).padStart(2, '0')}`;
  }
  
  // 拼接endTime数组为字符串
  if (Array.isArray(endTime)) {
    exportRow.endTime = `${endTime[0]}-${String(endTime[1] + 1).padStart(2, '0')}-${String(endTime[2]).padStart(2, '0')}`;
  }
  
  const data = await exporRiskReportPDFSinglePDF(exportRow);
  downloadFileFromBlobPart({
    fileName: `企业风险评估报表_${row.entName}.pdf`,
    source: data,
  });
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
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    // 调用删除接口
    // await deleteRiskReport(row.id);
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

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const state = reactive({});
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
// 表格数据获取
const getTableData = async (pageObj) => {
  // 处理时间格式转换
  const searchParams = { ...dataObj.serachObj };
  if (searchParams.beginTime) {
    // 开始月份的第一天00:00:00
    const beginDate = new Date(searchParams.beginTime);
    beginDate.setDate(1);
    beginDate.setHours(0, 0, 0, 0);
    const year = beginDate.getFullYear();
    const month = String(beginDate.getMonth() + 1).padStart(2, '0');
    const day = String(beginDate.getDate()).padStart(2, '0');
    const hours = String(beginDate.getHours()).padStart(2, '0');
    const minutes = String(beginDate.getMinutes()).padStart(2, '0');
    const seconds = String(beginDate.getSeconds()).padStart(2, '0');
    searchParams.beginTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  if (searchParams.endTime) {
    // 结束月份的最后一天23:59:59
    const endDate = new Date(searchParams.endTime);
    const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    const year = lastDay.getFullYear();
    const month = String(lastDay.getMonth() + 1).padStart(2, '0');
    const day = String(lastDay.getDate()).padStart(2, '0');
    const hours = String(lastDay.getHours()).padStart(2, '0');
    const minutes = String(lastDay.getMinutes()).padStart(2, '0');
    const seconds = String(lastDay.getSeconds()).padStart(2, '0');
    searchParams.endTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...searchParams,
  };
  dataObj.getParams = getParams;
  const data = await getRiskReportPage(getParams);
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
  state.loading = true;
  setTimeout(() => {
    state.loading = false;
  }, 2000);
  ElMessage.success($t('月报自动刷新成功'));
};
const openEn = async (row) => {
  const res = await getDetailEnObj(row.entId);
  dataObj.enDetailObj = res;
  enDetailObjRef.value?.open();
};
</script>

<template>
  <div class="park-lot-table-new" v-loading="state.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <enDetailDrawer ref="enDetailObjRef" :detail-obj="dataObj.enDetailObj" />
    <Drawer title="配置">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="手动刷新月报"
            icon-name="refresh"
            @click="autoElmessage"
          />
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="导出PDF"
            icon-name="download"
            @click="handlePDF"
          /> 
        <IconButton
            content="配置"
            icon-name="setting"
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
      <template #riskLevel="{ row }">
        <el-text
          class="common-align"
          :type="
            row.riskLevel === '高风险'
              ? 'danger'
              : row.riskLevel === '中风险'
                ? 'warning'
                : row.riskLevel === '低风险'
                  ? 'success'
                  : 'primary'
          "
        >
          {{ row.riskLevel }}
        </el-text>
      </template>
      <template #reportNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.reportNo }}
        </el-text>
      </template>
      <template #entName="{ row }">
        <el-text
          @click="openEn(row)"
          class="common-align"
          :type="row.riskLevel === '高风险' ? 'danger' : 'primary'"
        >
          {{ row.entName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          /> 
          <IconButton
            content="导出PDF"
            icon-name="download"
            @click="handleExportSinglePDF(row)"
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
