<!-- index.vue - 商户月度报表版本 -->
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
import ReportDetailDrawer from '#/views/report/park/merchant/monthly/detail.vue';

import { dataList, textObj, useFormSchema, useExtendedFormSchema, useGridColumns, getMaxId } from './data';

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
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useExtendedFormSchema(),
  showDefaultActions: false,
});

// 生成当前时间
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    const currentTime = getCurrentTime();

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增数据
      const newId = getMaxId() + 1;
      const newData = {
        ...obj,
        id: newId,
        totalIncome: Number(obj.totalIncome) || 0,
        totalOrder: Number(obj.totalOrder) || 0,
        avgUtilization: obj.avgUtilization || '0%',
        peakHourDistribution: obj.peakHourDistribution || '',
        growthRate: obj.growthRate || '0%',
        updateTime: currentTime,
        operator: '系统自动生成'
      };
      reportObj.apilist.unshift(newData);
      ElMessage.success('新增成功');
    } else {
      // 编辑数据
      const index = reportObj.apilist.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) {
        const updatedData = {
          ...reportObj.apilist[index],
          ...obj,
          totalIncome: Number(obj.totalIncome) || 0,
          totalOrder: Number(obj.totalOrder) || 0,
          updateTime: currentTime,
          operator: '系统自动生成'
        };
        reportObj.apilist[index] = updatedData;
        ElMessage.success('编辑成功');
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        // 编辑模式：设置表单值
        await formApi.setValues(formData.value);
      } else {
        // 新增模式：重置表单并设置默认值
        formApi.resetForm();
        // 设置默认月份为当前月
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        formApi.setValues({
          statMonth: `${year}-${month}`
        });
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

/** 导出单行数据 */
function handleExportRow(row) {
  exportToExcel([row], `${row.merchantName}-${row.statMonth}`, `${row.merchantName}-${row.statMonth}.xlsx`);
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
    text: $t('ui.actionMessage.deleting', [row.merchantName + ' - ' + row.statMonth]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.merchantName + ' - ' + row.statMonth]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }

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

// 搜索条件
const searchParams = ref({});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;

  // 1. 先根据标签页过滤
  if (activeName.value === '本月数据') {
    filteredList = filteredList.filter(v => v.statMonth === '2026-02');
  } else if (activeName.value === '近6月数据') {
    // 计算近6个月（包含当前月）
    const currentMonth = '2026-02';
    const currentDate = new Date(currentMonth + '-01');
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 包含当前月，所以是5个月
    const startMonth = sixMonthsAgo.toISOString().slice(0, 7);

    filteredList = filteredList.filter(v => v.statMonth >= startMonth && v.statMonth <= currentMonth);
  } else if (activeName.value === '天河商贸中心') {
    filteredList = filteredList.filter(v => v.merchantName === '天河商贸中心');
  } else if (activeName.value === '海珠商业集团') {
    filteredList = filteredList.filter(v => v.merchantName === '海珠商业集团');
  }

  // 2. 再根据搜索条件过滤
  if (searchParams.value.statMonth) {
    filteredList = filteredList.filter(v => v.statMonth === searchParams.value.statMonth);
  }
  if (searchParams.value.merchantName) {
    filteredList = filteredList.filter(v => v.merchantName === searchParams.value.merchantName);
  }
  if (searchParams.value.areaName) {
    filteredList = filteredList.filter(v => v.areaName === searchParams.value.areaName);
  }
  if (searchParams.value.lotName) {
    filteredList = filteredList.filter(v => v.lotName === searchParams.value.lotName);
  }

  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return reportObj;
};

// 添加查询表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  handleReset: onReset,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => ({
    ...v,
    rules: undefined,
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
    type: 'primary',
  },
  resetButtonOptions: {
    content: '重置',
  },
});

// 搜索表单查询
function onSubmit(values) {
  searchParams.value = { ...values };
  drawerApi.close();
  gridApi.query();
}

// 重置搜索表单
function onReset() {
  searchParams.value = {};
  queryFormApi.resetForm();
  gridApi.query();
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

const activeName = ref('本月数据');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  reportDetailDrawerRef.value.open();
};

const tabsData = ref([
  { label: '本月数据' },
  { label: '近6月数据' },
  { label: '天河商贸中心' },
  { label: '海珠商业集团' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  let filteredList = reportObj.apilist;

  // 先应用搜索条件
  if (searchParams.value.statMonth) {
    filteredList = filteredList.filter(v => v.statMonth === searchParams.value.statMonth);
  }
  if (searchParams.value.merchantName) {
    filteredList = filteredList.filter(v => v.merchantName === searchParams.value.merchantName);
  }
  if (searchParams.value.areaName) {
    filteredList = filteredList.filter(v => v.areaName === searchParams.value.areaName);
  }
  if (searchParams.value.lotName) {
    filteredList = filteredList.filter(v => v.lotName === searchParams.value.lotName);
  }

  if (item.label === '本月数据') {
    count = filteredList.filter((v) => v.statMonth === '2026-02').length;
  } else if (item.label === '近6月数据') {
    const currentMonth = '2026-02';
    const currentDate = new Date(currentMonth + '-01');
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const startMonth = sixMonthsAgo.toISOString().slice(0, 7);

    count = filteredList.filter(v => v.statMonth >= startMonth && v.statMonth <= currentMonth).length;
  } else if (item.label === '天河商贸中心') {
    count = filteredList.filter((v) => v.merchantName === '天河商贸中心').length;
  } else if (item.label === '海珠商业集团') {
    count = filteredList.filter((v) => v.merchantName === '海珠商业集团').length;
  } else if (item.label === '全部数据') {
    count = filteredList.length;
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
const reportDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <ReportDetailDrawer
      ref="reportDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`商户月运营详情 - ${reportObj.detailObj.merchantName}`"
      @edit="handleEdit"
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
      <template #merchantName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.merchantName }}
        </el-text>
      </template>
      <template #totalIncome="{ row }">
        <el-tag type="success" size="small">
          ¥{{ row.totalIncome?.toLocaleString() }}
        </el-tag>
      </template>
      <template #totalOrder="{ row }">
        <el-tag type="info" size="small">
          {{ row.totalOrder?.toLocaleString() }}
        </el-tag>
      </template>
      <template #growthRate="{ row }">
        <el-tag
          :type="parseFloat(row.growthRate) > 8 ? 'success' :
                 parseFloat(row.growthRate) > 4 ? 'primary' :
                 parseFloat(row.growthRate) > 0 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.growthRate }}
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
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
          />
          <IconButton
            content="删除"
            icon-name="Delete"
            color="#F56C6C"
            @click="handleDelete(row)"
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
            总营收: ¥{{ reportObj.list.reduce((sum, v) => sum + v.totalIncome, 0).toLocaleString() }};
            总订单数: {{ reportObj.list.reduce((sum, v) => sum + v.totalOrder, 0).toLocaleString() }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
