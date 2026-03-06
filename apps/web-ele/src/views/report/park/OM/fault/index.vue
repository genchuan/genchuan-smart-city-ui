<!-- index.vue 内部 - 故障统计报表版本 -->
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
// 引入封装后的详情抽屉组件
import FaultDetailDrawer from '#/views/report/park/OM/fault/detail.vue';

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
    text: $t('ui.actionMessage.deleting', [row.areaName + ' - ' + row.deviceType + ' - ' + row.faultType]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.areaName + ' - ' + row.deviceType + ' - ' + row.faultType]));
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

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;
  if (activeName.value === '本周故障') {
    filteredList = reportObj.apilist.filter(v => {
      const startDate = new Date(v.startDate);
      const endDate = new Date(v.endDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return (startDate <= weekEnd && endDate >= weekStart);
    });
  } else if (activeName.value === '本月故障') {
    filteredList = reportObj.apilist.filter(v => {
      const startDate = new Date(v.startDate);
      const endDate = new Date(v.endDate);
      const monthStart = new Date('2026-02-01');
      const monthEnd = new Date('2026-02-28');
      return (startDate <= monthEnd && endDate >= monthStart);
    });
  } else if (activeName.value === '摄像头') {
    filteredList = reportObj.apilist.filter(v => v.deviceType === '摄像头');
  } else if (activeName.value === '道闸') {
    filteredList = reportObj.apilist.filter(v => v.deviceType === '道闸');
  } else if (activeName.value === '网络故障') {
    filteredList = reportObj.apilist.filter(v => v.faultType === '网络故障');
  } else if (activeName.value === '机械故障') {
    filteredList = reportObj.apilist.filter(v => v.faultType === '机械故障');
  } else if (activeName.value === '一级故障') {
    filteredList = reportObj.apilist.filter(v => v.faultLevel === '一级');
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

const activeName = ref('本周故障');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  faultDetailDrawerRef.value.open();
  console.log(row);
};

// 查看关联工单
const handleViewWorkOrder = (row) => {
  // 这里可以跳转到工单详情页面
  window.open(`/workorder/list?area=${row.areaName}&device=${row.deviceType}&fault=${row.faultType}`, '_blank');
};

// 计算时间范围显示
const getDateRangeDisplay = (row) => {
  if (row.startDate && row.endDate) {
    if (row.startDate === row.endDate) {
      return row.startDate;
    }
    return `${row.startDate} 至 ${row.endDate}`;
  }
  return '-';
};

const tabsData = ref([
  { label: '本周故障' },
  { label: '本月故障' },
  { label: '摄像头' },
  { label: '道闸' },
  { label: '网络故障' },
  { label: '机械故障' },
  { label: '一级故障' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '本周故障') {
    count = reportObj.apilist.filter(v => {
      const startDate = new Date(v.startDate);
      const endDate = new Date(v.endDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return (startDate <= weekEnd && endDate >= weekStart);
    }).length;
  } else if (item.label === '本月故障') {
    count = reportObj.apilist.filter(v => {
      const startDate = new Date(v.startDate);
      const endDate = new Date(v.endDate);
      const monthStart = new Date('2026-02-01');
      const monthEnd = new Date('2026-02-28');
      return (startDate <= monthEnd && endDate >= monthStart);
    }).length;
  } else if (item.label === '摄像头') {
    count = reportObj.apilist.filter((v) => v.deviceType === '摄像头').length;
  } else if (item.label === '道闸') {
    count = reportObj.apilist.filter((v) => v.deviceType === '道闸').length;
  } else if (item.label === '网络故障') {
    count = reportObj.apilist.filter((v) => v.faultType === '网络故障').length;
  } else if (item.label === '机械故障') {
    count = reportObj.apilist.filter((v) => v.faultType === '机械故障').length;
  } else if (item.label === '一级故障') {
    count = reportObj.apilist.filter((v) => v.faultLevel === '一级').length;
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
      :title="`故障统计详情 - ${reportObj.detailObj.areaName} ${reportObj.detailObj.deviceType}`"
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
      <template #dateRange="{ row }">
        <span>{{ getDateRangeDisplay(row) }}</span>
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
      <template #deviceType="{ row }">
        <el-tag
          :type="row.deviceType === '摄像头' ? 'success' :
                 row.deviceType === '道闸' ? 'primary' :
                 row.deviceType === '地磁' ? 'warning' :
                 row.deviceType === '充电桩' ? 'info' : ''"
          size="small"
        >
          {{ row.deviceType }}
        </el-tag>
      </template>
      <template #faultType="{ row }">
        <el-tag
          :type="row.faultType === '网络故障' ? 'danger' :
                 row.faultType === '机械故障' ? 'warning' :
                 row.faultType === '通信故障' ? 'primary' :
                 row.faultType === '电源故障' ? 'info' : ''"
          size="small"
        >
          {{ row.faultType }}
        </el-tag>
      </template>
      <template #faultLevel="{ row }">
        <el-tag
          :type="row.faultLevel === '一级' ? 'danger' :
                 row.faultLevel === '二级' ? 'warning' :
                 row.faultLevel === '三级' ? 'primary' : 'info'"
          size="small"
        >
          {{ row.faultLevel }}
        </el-tag>
      </template>
      <template #faultCount="{ row }">
        <el-tag type="danger" size="small">
          {{ row.faultCount }}
        </el-tag>
      </template>
      <template #repeatFaultCount="{ row }">
        <el-tag type="warning" size="small">
          {{ row.repeatFaultCount }}
        </el-tag>
      </template>
      <template #avgDisposalDuration="{ row }">
        <el-tag
          :type="parseFloat(row.avgDisposalDuration) > 8 ? 'danger' :
                 parseFloat(row.avgDisposalDuration) > 5 ? 'warning' : 'success'"
          size="small"
        >
          {{ row.avgDisposalDuration }}
        </el-tag>
      </template>
      <template #disposalRate="{ row }">
        <el-tag
          :type="parseFloat(row.disposalRate) > 95 ? 'success' :
                 parseFloat(row.disposalRate) > 90 ? 'primary' :
                 parseFloat(row.disposalRate) > 85 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.disposalRate }}
        </el-tag>
      </template>
      <template #faultRate="{ row }">
        <el-tag
          :type="parseFloat(row.faultRate) > 10 ? 'danger' :
                 parseFloat(row.faultRate) > 5 ? 'warning' : 'primary'"
          size="small"
        >
          {{ row.faultRate }}
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
            content="查看工单"
            icon-name="Document"
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
            总故障次数: {{ reportObj.list.reduce((sum, v) => sum + v.faultCount, 0) }};
            重复故障: {{ reportObj.list.reduce((sum, v) => sum + v.repeatFaultCount, 0) }};
            平均处置率: {{ (reportObj.list.reduce((sum, v) => sum + parseFloat(v.disposalRate), 0) / reportObj.list.length).toFixed(2) }}%;
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
