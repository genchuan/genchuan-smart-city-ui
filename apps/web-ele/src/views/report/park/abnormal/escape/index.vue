<!-- index.vue 内部 - 逃费数据报表版本 -->
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
import EscapeDetailDrawer from '#/views/report/park/abnormal/escape/detail.vue';

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

/** 创建逃费记录 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑逃费记录 */
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
    text: $t('ui.actionMessage.deleting', [row.carNumber + ' - ' + row.lotName]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.carNumber + ' - ' + row.lotName]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些逃费记录吗？'));
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

  if (formValues.carNumber) {
    filteredList = filteredList.filter(v =>
      v.carNumber.includes(formValues.carNumber)
    );
  }

  if (formValues.areaName) {
    filteredList = filteredList.filter(v => v.areaName === formValues.areaName);
  }

  if (formValues.lotId) {
    filteredList = filteredList.filter(v => v.lotId === formValues.lotId);
  }

  if (formValues.escapeLevel) {
    filteredList = filteredList.filter(v => v.escapeLevel === formValues.escapeLevel);
  }

  if (formValues.traceStatus) {
    filteredList = filteredList.filter(v => v.traceStatus === formValues.traceStatus);
  }

  if (formValues.timeRange && formValues.timeRange.length === 2) {
    const [startDate, endDate] = formValues.timeRange;
    filteredList = filteredList.filter(v => {
      const escapeDate = v.escapeTime.split(' ')[0];
      return escapeDate >= startDate && escapeDate <= endDate;
    });
  }

  // 标签页筛选
  if (activeName.value === '今日逃费') {
    filteredList = filteredList.filter(v => v.escapeTime.startsWith('2026-02-05'));
  } else if (activeName.value === '本周逃费') {
    filteredList = filteredList.filter(v => {
      const date = new Date(v.escapeTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    });
  } else if (activeName.value === '待追缴') {
    filteredList = filteredList.filter(v => v.traceStatus === '待追缴');
  } else if (activeName.value === '追缴中') {
    filteredList = filteredList.filter(v => v.traceStatus === '追缴中');
  } else if (activeName.value === '一级逃费') {
    filteredList = filteredList.filter(v => v.escapeLevel === '一级逃费');
  } else if (activeName.value === '二级逃费') {
    filteredList = filteredList.filter(v => v.escapeLevel === '二级逃费');
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

const activeName = ref('今日逃费');
// 打开详情
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  escapeDetailDrawerRef.value.open();
  console.log(row);
};

// 发起追缴
const handleTrace = (row) => {
  ElMessageBox.confirm(
    `确定要发起对车牌 ${row.carNumber} 的追缴吗？`,
    '发起追缴',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 更新追缴状态
    reportObj.apilist.forEach((v, i) => {
      if (v.id === row.id) {
        reportObj.apilist[i].traceStatus = '追缴中';
        reportObj.apilist[i].lastTraceTime = new Date().toLocaleString('zh-CN');
        reportObj.apilist[i].operator = '管理员';
      }
    });
    ElMessage.success('追缴已发起');
    handleRefresh();
  }).catch(() => {
    // 取消操作
  });
};

const tabsData = ref([
  { label: '今日逃费' },
  { label: '本周逃费' },
  { label: '待追缴' },
  { label: '追缴中' },
  { label: '一级逃费' },
  { label: '二级逃费' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '今日逃费') {
    count = reportObj.apilist.filter((v) => v.escapeTime.startsWith('2026-02-05')).length;
  } else if (item.label === '本周逃费') {
    count = reportObj.apilist.filter(v => {
      const date = new Date(v.escapeTime.split(' ')[0]);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    }).length;
  } else if (item.label === '待追缴') {
    count = reportObj.apilist.filter((v) => v.traceStatus === '待追缴').length;
  } else if (item.label === '追缴中') {
    count = reportObj.apilist.filter((v) => v.traceStatus === '追缴中').length;
  } else if (item.label === '一级逃费') {
    count = reportObj.apilist.filter((v) => v.escapeLevel === '一级逃费').length;
  } else if (item.label === '二级逃费') {
    count = reportObj.apilist.filter((v) => v.escapeLevel === '二级逃费').length;
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
const escapeDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <EscapeDetailDrawer
      ref="escapeDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`逃费详情 - ${reportObj.detailObj.carNumber}`"
    />
    <Drawer title="逃费数据筛选">
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
      <template #escapeId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.escapeId }}
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
      <template #escapeAmount="{ row }">
        <el-tag type="danger" size="small">
          ¥{{ row.escapeAmount }}
        </el-tag>
      </template>
      <template #escapeLevel="{ row }">
        <el-tag
          :type="row.escapeLevel === '一级逃费' ? 'danger' :
                 row.escapeLevel === '二级逃费' ? 'warning' : 'primary'"
          size="small"
        >
          {{ row.escapeLevel }}
        </el-tag>
      </template>
      <template #traceStatus="{ row }">
        <el-tag
          :type="row.traceStatus === '待追缴' ? 'info' :
                 row.traceStatus === '追缴中' ? 'warning' : 'success'"
          size="small"
        >
          {{ row.traceStatus }}
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
            v-if="row.traceStatus !== '已追缴'"
            content="追缴"
            icon-name="RefreshRight"
            color="#E6A23C"
            @click="handleTrace(row)"
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
            总逃费金额: ¥{{ reportObj.list.reduce((sum, v) => sum + v.escapeAmount, 0).toFixed(2) }};
            待追缴: {{ reportObj.list.filter(v => v.traceStatus === '待追缴').length }};
            追缴中: {{ reportObj.list.filter(v => v.traceStatus === '追缴中').length }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
