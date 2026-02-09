<!-- index.vue 内部 - 收费异常报表版本 -->
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
import ChargeAbnormalDetailDrawer from '#/views/report/park/abnormal/charge/detail.vue';

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

/** 创建异常记录 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑异常记录 */
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
    text: $t('ui.actionMessage.deleting', [row.orderNo + ' - ' + row.carNumber]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.orderNo + ' - ' + row.carNumber]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些异常记录吗？'));
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

  if (formValues.orderNo) {
    filteredList = filteredList.filter(v =>
      v.orderNo.includes(formValues.orderNo)
    );
  }

  if (formValues.carNumber) {
    filteredList = filteredList.filter(v =>
      v.carNumber.includes(formValues.carNumber)
    );
  }

  if (formValues.areaName) {
    filteredList = filteredList.filter(v => v.areaName === formValues.areaName);
  }

  if (formValues.abnormalType) {
    filteredList = filteredList.filter(v => v.abnormalType === formValues.abnormalType);
  }

  if (formValues.disposalStatus) {
    filteredList = filteredList.filter(v => v.disposalStatus === formValues.disposalStatus);
  }

  if (formValues.timeRange && formValues.timeRange.length === 2) {
    const [startDate, endDate] = formValues.timeRange;
    filteredList = filteredList.filter(v => {
      const abnormalDate = v.abnormalTime.split(' ')[0];
      return abnormalDate >= startDate && abnormalDate <= endDate;
    });
  }

  // 标签页筛选
  if (activeName.value === '今日异常') {
    filteredList = filteredList.filter(v => v.abnormalTime.startsWith('2026-02-05'));
  } else if (activeName.value === '本周异常') {
    filteredList = filteredList.filter(v => {
      const date = new Date(v.abnormalTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    });
  } else if (activeName.value === '待处理') {
    filteredList = filteredList.filter(v => v.disposalStatus === '待处理');
  } else if (activeName.value === '处理中') {
    filteredList = filteredList.filter(v => v.disposalStatus === '处理中');
  } else if (activeName.value === '重复收费') {
    filteredList = filteredList.filter(v => v.abnormalType === '重复收费');
  } else if (activeName.value === '多收费') {
    filteredList = filteredList.filter(v => v.abnormalType === '多收费');
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

const activeName = ref('今日异常');
// 打开详情
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  chargeAbnormalDetailDrawerRef.value.open();
  console.log(row);
};

// 查看关联订单
const handleViewOrder = (row) => {
  ElMessage.info(`查看订单 ${row.orderNo} 的详情（功能待开发）`);
  // 这里可以跳转到订单详情页面
  // window.open(`/order/detail?orderNo=${row.orderNo}`, '_blank');
};

const tabsData = ref([
  { label: '今日异常' },
  { label: '本周异常' },
  { label: '待处理' },
  { label: '处理中' },
  { label: '重复收费' },
  { label: '多收费' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '今日异常') {
    count = reportObj.apilist.filter((v) => v.abnormalTime.startsWith('2026-02-05')).length;
  } else if (item.label === '本周异常') {
    count = reportObj.apilist.filter(v => {
      const date = new Date(v.abnormalTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    }).length;
  } else if (item.label === '待处理') {
    count = reportObj.apilist.filter((v) => v.disposalStatus === '待处理').length;
  } else if (item.label === '处理中') {
    count = reportObj.apilist.filter((v) => v.disposalStatus === '处理中').length;
  } else if (item.label === '重复收费') {
    count = reportObj.apilist.filter((v) => v.abnormalType === '重复收费').length;
  } else if (item.label === '多收费') {
    count = reportObj.apilist.filter((v) => v.abnormalType === '多收费').length;
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
const chargeAbnormalDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <ChargeAbnormalDetailDrawer
      ref="chargeAbnormalDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`收费异常详情 - ${reportObj.detailObj.orderNo}`"
    />
    <Drawer title="收费异常筛选">
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
      <template #abnormalId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.abnormalId }}
        </el-text>
      </template>
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #carNumber="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.carNumber }}
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
      <template #abnormalType="{ row }">
        <el-tag
          :type="row.abnormalType === '重复收费' ? 'danger' :
                 row.abnormalType === '少收费' ? 'warning' :
                 row.abnormalType === '多收费' ? 'primary' :
                 row.abnormalType === '未收费' ? 'info' : 'success'"
          size="small"
        >
          {{ row.abnormalType }}
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
            @click="handleViewOrder(row)"
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
