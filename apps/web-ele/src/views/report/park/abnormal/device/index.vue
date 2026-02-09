<!-- index.vue 内部 - 设备异常报表版本 -->
<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入封装后的详情抽屉组件
import FaultDetailDrawer from '#/views/report/park/abnormal/device/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

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
  return formData.value?.id ? textObj.editText : textObj.addText;
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
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      reportObj.apilist.push(obj);
    } else {
      reportObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          reportObj.apilist[i] = obj;
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

/** 导出表格 */
async function handleExport() {
  exportToExcel(reportObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建故障记录 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑故障记录 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.deviceCode + ' - ' + row.deviceType]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.deviceCode + ' - ' + row.deviceType]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些故障记录吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter(
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

const reportObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  reportObj.totalShow = !reportObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;

  // 应用筛选条件
  const formValues = formApi?.form?.values || {};

  if (formValues.deviceCode) {
    filteredList = filteredList.filter(v =>
      v.deviceCode.includes(formValues.deviceCode)
    );
  }

  if (formValues.areaName) {
    filteredList = filteredList.filter(v => v.areaName === formValues.areaName);
  }

  if (formValues.deviceType) {
    filteredList = filteredList.filter(v => v.deviceType === formValues.deviceType);
  }

  if (formValues.faultType) {
    filteredList = filteredList.filter(v => v.faultType === formValues.faultType);
  }

  if (formValues.disposalStatus) {
    filteredList = filteredList.filter(v => v.disposalStatus === formValues.disposalStatus);
  }

  if (formValues.timeRange && formValues.timeRange.length === 2) {
    const [startDate, endDate] = formValues.timeRange;
    filteredList = filteredList.filter(v => {
      const faultDate = v.faultTime.split(' ')[0];
      return faultDate >= startDate && faultDate <= endDate;
    });
  }

  // 标签页筛选
  if (activeName.value === '今日故障') {
    filteredList = filteredList.filter(v => v.faultTime.startsWith('2026-02-05'));
  } else if (activeName.value === '本周故障') {
    filteredList = filteredList.filter(v => {
      const date = new Date(v.faultTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    });
  } else if (activeName.value === '待处理') {
    filteredList = filteredList.filter(v => v.disposalStatus === '待处理');
  } else if (activeName.value === '处理中') {
    filteredList = filteredList.filter(v => v.disposalStatus === '处理中');
  } else if (activeName.value === '硬件故障') {
    filteredList = filteredList.filter(v => v.faultType === '硬件故障');
  } else if (activeName.value === '软件故障') {
    filteredList = filteredList.filter(v => v.faultType === '软件故障');
  }

  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return reportObj;
};

const [QueryForm] = useVbenForm({
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
  schema: useFormSchema().map((v) => {
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
function onSubmit(values) {
  console.log('查询条件:', values);
  drawerApi.close();
  handleRefresh();
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
    pagerConfig: reportObj,
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

const activeName = ref('今日故障');
// 打开详情
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  faultDetailDrawerRef.value.open();
  console.log(row);
};

// 查看关联工单
const handleViewWorkOrder = (row) => {
  ElMessage.info(`查看设备 ${row.deviceCode} 的关联工单（功能待开发）`);
  // 这里可以跳转到工单详情页面
  // window.open(`/workorder/detail?deviceCode=${row.deviceCode}&faultId=${row.faultId}`, '_blank');
};

const tabsData = ref([
  { label: '今日故障' },
  { label: '本周故障' },
  { label: '待处理' },
  { label: '处理中' },
  { label: '硬件故障' },
  { label: '软件故障' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '今日故障') {
    count = reportObj.apilist.filter((v) => v.faultTime.startsWith('2026-02-05')).length;
  } else if (item.label === '本周故障') {
    count = reportObj.apilist.filter(v => {
      const date = new Date(v.faultTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    }).length;
  } else if (item.label === '待处理') {
    count = reportObj.apilist.filter((v) => v.disposalStatus === '待处理').length;
  } else if (item.label === '处理中') {
    count = reportObj.apilist.filter((v) => v.disposalStatus === '处理中').length;
  } else if (item.label === '硬件故障') {
    count = reportObj.apilist.filter((v) => v.faultType === '硬件故障').length;
  } else if (item.label === '软件故障') {
    count = reportObj.apilist.filter((v) => v.faultType === '软件故障').length;
  } else if (item.label === '全部数据') {
    count = reportObj.apilist.length;
  }
  return `${item.label}(${count})`;
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

const arrowChange = () => {
  emit('arrow-change');
};

// 定义组件ref，用于调用组件方法
const faultDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <FaultDetailDrawer
      ref="faultDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`设备异常详情 - ${reportObj.detailObj.deviceCode}`"
    />
    <Drawer title="设备异常筛选">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="筛选"
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
      <template #faultId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.faultId }}
        </el-text>
      </template>
      <template #deviceCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceCode }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #faultType="{ row }">
        <el-tag
          :type="row.faultType === '硬件故障' ? 'danger' :
                 row.faultType === '软件故障' ? 'warning' :
                 row.faultType === '网络故障' ? 'primary' :
                 row.faultType === '电源故障' ? 'info' : 'success'"
          size="small"
        >
          {{ row.faultType }}
        </el-tag>
      </template>
      <template #disposalStatus="{ row }">
        <el-tag
          :type="row.disposalStatus === '待处理' ? 'info' :
                 row.disposalStatus === '处理中' ? 'warning' : 'success'"
          size="small"
        >
          {{ row.disposalStatus }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="查看"
            icon-name="Document"
            color="#409EFF"
            @click="handleViewWorkOrder(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!reportObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="reportObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：数据量{{ reportObj.list.length }};
            待处理: {{ reportObj.list.filter(v => v.disposalStatus === '待处理').length }};
            处理中: {{ reportObj.list.filter(v => v.disposalStatus === '处理中').length }};
            已处理: {{ reportObj.list.filter(v => v.disposalStatus === '已处理').length }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
