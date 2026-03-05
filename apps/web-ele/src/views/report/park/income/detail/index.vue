<!-- index.vue 内部 - 收入明细报表版本 -->
<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 修改详情抽屉组件引用
import IncomeDetailDrawer from '#/views/report/park/income/detail/detail.vue';

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

/** 创建报表 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑报表 */
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
  await confirm($t('确定删除这些数据吗？'));
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
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const changeTotalShow = () => {
  reportObj.totalShow = !reportObj.totalShow;
};

// 表格数据获取 - 根据筛选条件过滤
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;
  if (activeName.value === '今日明细') {
    filteredList = reportObj.apilist.filter(v => v.payTime.includes('2026-02-05'));
  } else if (activeName.value === '本周明细') {
    filteredList = reportObj.apilist.filter(v => {
      const payDate = new Date(v.payTime);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return payDate >= weekStart && payDate <= weekEnd;
    });
  } else if (activeName.value === '微信支付') {
    filteredList = reportObj.apilist.filter(v => v.payWay === '微信支付');
  } else if (activeName.value === '支付宝') {
    filteredList = reportObj.apilist.filter(v => v.payWay === '支付宝');
  } else if (activeName.value === '高金额订单') {
    filteredList = reportObj.apilist.filter(v => v.payAmount >= 50);
  } else if (activeName.value === '有优惠订单') {
    filteredList = reportObj.apilist.filter(v => v.discountAmount > 0);
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
function onSubmit() {
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

const activeName = ref('今日明细');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  incomeDetailDrawerRef.value.open();
  console.log(row);
};

// 导出单条数据PDF
const handleExportPDF = (row) => {
  // 这里可以调用PDF导出函数
  ElMessage.success(`正在导出订单 ${row.orderNo} 的PDF文件`);
  // window.open(`/api/export/pdf/order?orderNo=${row.orderNo}`, '_blank');
};

const tabsData = ref([
  { label: '今日明细' },
  { label: '本周明细' },
  { label: '微信支付' },
  { label: '支付宝' },
  { label: '高金额订单' },
  { label: '有优惠订单' },
  { label: '全部明细' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '今日明细') {
    count = reportObj.apilist.filter(v => v.payTime.includes('2026-02-05')).length;
  } else if (item.label === '本周明细') {
    count = reportObj.apilist.filter(v => {
      const payDate = new Date(v.payTime);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return payDate >= weekStart && payDate <= weekEnd;
    }).length;
  } else if (item.label === '微信支付') {
    count = reportObj.apilist.filter((v) => v.payWay === '微信支付').length;
  } else if (item.label === '支付宝') {
    count = reportObj.apilist.filter((v) => v.payWay === '支付宝').length;
  } else if (item.label === '高金额订单') {
    count = reportObj.apilist.filter((v) => v.payAmount >= 50).length;
  } else if (item.label === '有优惠订单') {
    count = reportObj.apilist.filter((v) => v.discountAmount > 0).length;
  } else if (item.label === '全部明细') {
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
const incomeDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用收入明细详情抽屉组件 -->
    <IncomeDetailDrawer
      ref="incomeDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`订单详情 - ${reportObj.detailObj.orderNo}`"
    />
    <Drawer title="搜索">
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
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #lotName="{ row }">
        <el-tag type="success" size="small">
          {{ row.lotName }}
        </el-tag>
      </template>
      <template #parkingDuration="{ row }">
        <el-tag type="warning" size="small">
          {{ row.parkingDuration }}分钟
        </el-tag>
      </template>
      <template #originalAmount="{ row }">
        <el-tag size="small">
          ¥{{ row.originalAmount?.toFixed(2) }}
        </el-tag>
      </template>
      <template #discountAmount="{ row }">
        <el-tag type="success" size="small">
          ¥{{ row.discountAmount?.toFixed(2) }}
        </el-tag>
      </template>
      <template #payAmount="{ row }">
        <el-tag type="primary" size="small">
          ¥{{ row.payAmount?.toFixed(2) }}
        </el-tag>
      </template>
      <template #payWay="{ row }">
        <el-tag
          :type="row.payWay === '微信支付' ? 'success' :
                 row.payWay === '支付宝' ? 'primary' :
                 row.payWay === '银联支付' ? 'warning' : 'info'"
          size="small"
        >
          {{ row.payWay }}
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
            content="导出"
            icon-name="download"
            @click="handleExportPDF(row)"
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
          <span> 本页统计：明细数{{ reportObj.list.length }};
            实付金额: ¥{{ reportObj.list.reduce((sum, v) => sum + v.payAmount, 0).toFixed(2) }};
            优惠金额: ¥{{ reportObj.list.reduce((sum, v) => sum + v.discountAmount, 0).toFixed(2) }};
            平均金额: ¥{{ (reportObj.list.reduce((sum, v) => sum + v.payAmount, 0) / (reportObj.list.length || 1)).toFixed(2) }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
