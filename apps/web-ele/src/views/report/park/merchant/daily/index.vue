<!-- index.vue 内部 - 商户日运营数据报表版本 -->
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
import ReportDetailDrawer from '#/views/report/park/merchant/daily/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns, getMaxId } from './data';

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
  schema: extendedFormSchema(),
  showDefaultActions: false,
});

// 扩展表单配置，包含所有字段
function extendedFormSchema() {
  const baseSchema = useFormSchema();
  return [
    ...baseSchema,
    {
      fieldName: 'totalEntry',
      label: '入场车流量',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        min: 0,
        placeholder: '请输入入场车流量',
      },
      rules: 'required',
    },
    {
      fieldName: 'totalIncome',
      label: '营收总额',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        min: 0,
        placeholder: '请输入营收总额',
      },
      rules: 'required',
    },
    {
      fieldName: 'orderCount',
      label: '订单数',
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        min: 0,
        placeholder: '请输入订单数',
      },
      rules: 'required',
    },
    {
      fieldName: 'avgUtilization',
      label: '平均利用率',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入平均利用率，如：78.5%',
      },
      rules: 'required',
    },
  ];
}

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
        totalEntry: Number(obj.totalEntry) || 0,
        totalIncome: Number(obj.totalIncome) || 0,
        orderCount: Number(obj.orderCount) || 0,
        avgUtilization: obj.avgUtilization || '0%',
        updateTime: currentTime,
        operator: '系统自动生成'
      };
      reportObj.apilist.unshift(newData); // 添加到列表开头
      ElMessage.success('新增成功');
    } else {
      // 编辑数据
      const index = reportObj.apilist.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) {
        const updatedData = {
          ...reportObj.apilist[index],
          ...obj,
          totalEntry: Number(obj.totalEntry) || 0,
          totalIncome: Number(obj.totalIncome) || 0,
          orderCount: Number(obj.orderCount) || 0,
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
        // 可以设置默认值，比如默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        formApi.setValues({
          statDate: today
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
  exportToExcel([row], `${row.merchantName}-${row.lotName}`, `${row.merchantName}-${row.lotName}.xlsx`);
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
    text: $t('ui.actionMessage.deleting', [row.merchantName + ' - ' + row.lotName]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.merchantName + ' - ' + row.lotName]));
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

// 搜索条件
const searchParams = ref({});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;

  // 1. 先根据标签页过滤
  if (activeName.value === '今日数据') {
    filteredList = filteredList.filter(v => v.statDate === '2026-02-05');
  } else if (activeName.value === '本周数据') {
    filteredList = filteredList.filter(v => {
      const date = new Date(v.statDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    });
  } else if (activeName.value === '商业停车场') {
    filteredList = filteredList.filter(v => v.merchantName.includes('商业'));
  } else if (activeName.value === '小区物业') {
    filteredList = filteredList.filter(v => v.merchantName.includes('小区'));
  }

  // 2. 再根据搜索条件过滤
  if (searchParams.value.statDate) {
    filteredList = filteredList.filter(v => v.statDate === searchParams.value.statDate);
  }
  if (searchParams.value.merchantName) {
    filteredList = filteredList.filter(v => v.merchantName.includes(searchParams.value.merchantName));
  }
  if (searchParams.value.areaName) {
    filteredList = filteredList.filter(v => v.areaName === searchParams.value.areaName);
  }
  if (searchParams.value.lotName) {
    filteredList = filteredList.filter(v => v.lotName.includes(searchParams.value.lotName));
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
    rules: undefined, // 移除表单验证规则，搜索不需要验证
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

const activeName = ref('今日数据');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  reportDetailDrawerRef.value.open();
};

const tabsData = ref([
  { label: '今日数据' },
  { label: '本周数据' },
  { label: '商业停车场' },
  { label: '小区物业' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  let filteredList = reportObj.apilist;

  // 先应用搜索条件
  if (searchParams.value.statDate) {
    filteredList = filteredList.filter(v => v.statDate === searchParams.value.statDate);
  }
  if (searchParams.value.merchantName) {
    filteredList = filteredList.filter(v => v.merchantName.includes(searchParams.value.merchantName));
  }
  if (searchParams.value.areaName) {
    filteredList = filteredList.filter(v => v.areaName === searchParams.value.areaName);
  }
  if (searchParams.value.lotName) {
    filteredList = filteredList.filter(v => v.lotName.includes(searchParams.value.lotName));
  }

  if (item.label === '今日数据') {
    count = filteredList.filter((v) => v.statDate === '2026-02-05').length;
  } else if (item.label === '本周数据') {
    count = filteredList.filter(v => {
      const date = new Date(v.statDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    }).length;
  } else if (item.label === '商业停车场') {
    count = filteredList.filter((v) => v.merchantName.includes('商业')).length;
  } else if (item.label === '小区物业') {
    count = filteredList.filter((v) => v.merchantName.includes('小区')).length;
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
      :title="`商户运营详情 - ${reportObj.detailObj.merchantName}`"
    />
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 二级标签 -->
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
      <template #merchantName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.merchantName }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-tag type="primary" size="small">
          {{ row.areaName }}
        </el-tag>
      </template>
      <template #lotName="{ row }">
        <el-tag type="info" size="small">
          {{ row.lotName }}
        </el-tag>
      </template>
      <template #totalEntry="{ row }">
        <el-tag type="info" size="small">
          {{ row.totalEntry }}
        </el-tag>
      </template>
      <template #totalIncome="{ row }">
        <el-tag type="success" size="small">
          ¥{{ row.totalIncome.toLocaleString() }}
        </el-tag>
      </template>
      <template #orderCount="{ row }">
        <el-tag type="warning" size="small">
          {{ row.orderCount }}
        </el-tag>
      </template>
      <template #avgUtilization="{ row }">
        <el-tag
          :type="parseFloat(row.avgUtilization) > 80 ? 'success' :
                 parseFloat(row.avgUtilization) > 70 ? 'primary' :
                 parseFloat(row.avgUtilization) > 60 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.avgUtilization }}
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
            入场车流量: {{ reportObj.list.reduce((sum, v) => sum + v.totalEntry, 0) }};
            营收总额: ¥{{ reportObj.list.reduce((sum, v) => sum + v.totalIncome, 0).toLocaleString() }};
            订单数: {{ reportObj.list.reduce((sum, v) => sum + v.orderCount, 0) }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
