<!-- index.vue 内部 - 运维人员绩效考核报表版本 -->
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
import PerformanceDetailDrawer from '#/views/report/park/OM/staff/detail.vue';

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
    text: $t('ui.actionMessage.deleting', [row.maintainer + ' - ' + row.period + ' - ' + row.indicatorName]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.maintainer + ' - ' + row.period + ' - ' + row.indicatorName]));
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

// 计算绩效等级分布
const performanceDistribution = computed(() => {
  const distribution = {
    excellent: 0, // ≥95
    good: 0,      // 90-94
    qualified: 0, // 85-89
    improvement: 0 // <85
  };

  reportObj.apilist.forEach(item => {
    const score = item.performanceScore;
    if (score >= 95) {
      distribution.excellent++;
    } else if (score >= 90) {
      distribution.good++;
    } else if (score >= 85) {
      distribution.qualified++;
    } else {
      distribution.improvement++;
    }
  });

  return distribution;
});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = reportObj.apilist;
  if (activeName.value === '月度绩效') {
    filteredList = reportObj.apilist.filter(v => v.statCycle === '月');
  } else if (activeName.value === '周度绩效') {
    filteredList = reportObj.apilist.filter(v => v.statCycle === '周');
  } else if (activeName.value === '优秀人员(≥95)') {
    filteredList = reportObj.apilist.filter(v => v.performanceScore >= 95);
  } else if (activeName.value === '待改进人员(<85)') {
    filteredList = reportObj.apilist.filter(v => v.performanceScore < 85);
  } else if (activeName.value === '综合绩效') {
    filteredList = reportObj.apilist.filter(v => v.indicatorName === '综合绩效');
  } else if (activeName.value === '维修质量') {
    filteredList = reportObj.apilist.filter(v => v.indicatorName === '维修质量');
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

const activeName = ref('月度绩效');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  performanceDetailDrawerRef.value.open();
  console.log(row);
};

// 导出绩效报告
const handleExportReport = (row) => {
  // 这里可以调用导出PDF的接口
  ElMessage.success(`正在导出 ${row.maintainer} 的绩效报告...`);
  // 实际项目中这里应该调用导出PDF的接口
};

const tabsData = ref([
  { label: '月度绩效' },
  { label: '周度绩效' },
  { label: '优秀人员(≥95)' },
  { label: '待改进人员(<85)' },
  { label: '综合绩效' },
  { label: '维修质量' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '月度绩效') {
    count = reportObj.apilist.filter((v) => v.statCycle === '月').length;
  } else if (item.label === '周度绩效') {
    count = reportObj.apilist.filter((v) => v.statCycle === '周').length;
  } else if (item.label === '优秀人员(≥95)') {
    count = reportObj.apilist.filter((v) => v.performanceScore >= 95).length;
  } else if (item.label === '待改进人员(<85)') {
    count = reportObj.apilist.filter((v) => v.performanceScore < 85).length;
  } else if (item.label === '综合绩效') {
    count = reportObj.apilist.filter((v) => v.indicatorName === '综合绩效').length;
  } else if (item.label === '维修质量') {
    count = reportObj.apilist.filter((v) => v.indicatorName === '维修质量').length;
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
const performanceDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <PerformanceDetailDrawer
      ref="performanceDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`绩效考核详情 - ${reportObj.detailObj.maintainer} ${reportObj.detailObj.period}`"
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
      <template #statCycle="{ row }">
        <el-tag
          :type="row.statCycle === '月' ? 'success' :
                 row.statCycle === '周' ? 'warning' : 'primary'"
          size="small"
        >
          {{ row.statCycle }}
        </el-tag>
      </template>
      <template #maintainer="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.maintainer }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-tag type="success" size="small">
          {{ row.areaName }}
        </el-tag>
      </template>
      <template #indicatorName="{ row }">
        <el-tag
          :type="row.indicatorName === '综合绩效' ? 'success' :
                 row.indicatorName === '响应速度' ? 'primary' :
                 row.indicatorName === '维修质量' ? 'warning' :
                 row.indicatorName === '工作效率' ? 'info' : ''"
          size="small"
        >
          {{ row.indicatorName }}
        </el-tag>
      </template>
      <template #workorderTimelyRate="{ row }">
        <el-tag
          :type="parseFloat(row.workorderTimelyRate) > 95 ? 'success' :
                 parseFloat(row.workorderTimelyRate) > 90 ? 'primary' :
                 parseFloat(row.workorderTimelyRate) > 85 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.workorderTimelyRate }}
        </el-tag>
      </template>
      <template #inspectionCompletionRate="{ row }">
        <el-tag
          :type="parseFloat(row.inspectionCompletionRate) > 95 ? 'success' :
                 parseFloat(row.inspectionCompletionRate) > 90 ? 'primary' :
                 parseFloat(row.inspectionCompletionRate) > 85 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.inspectionCompletionRate }}
        </el-tag>
      </template>
      <template #faultRepairRate="{ row }">
        <el-tag
          :type="parseFloat(row.faultRepairRate) > 95 ? 'success' :
                 parseFloat(row.faultRepairRate) > 90 ? 'primary' :
                 parseFloat(row.faultRepairRate) > 85 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.faultRepairRate }}
        </el-tag>
      </template>
      <template #avgDisposalTime="{ row }">
        <el-tag
          :type="parseFloat(row.avgDisposalTime) < 3 ? 'success' :
                 parseFloat(row.avgDisposalTime) < 4 ? 'primary' :
                 parseFloat(row.avgDisposalTime) < 5 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.avgDisposalTime }}
        </el-tag>
      </template>
      <template #performanceScore="{ row }">
        <el-tag
          :type="row.performanceScore >= 95 ? 'success' :
                 row.performanceScore >= 90 ? 'primary' :
                 row.performanceScore >= 85 ? 'warning' : 'danger'"
          size="small"
        >
          {{ row.performanceScore }}
        </el-tag>
      </template>
      <template #rank="{ row }">
        <el-tag
          :type="row.rank === 1 ? 'success' :
                 row.rank === 2 ? 'primary' :
                 row.rank === 3 ? 'warning' : 'info'"
          size="small"
        >
          第{{ row.rank }}名
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
            content="导出报告"
            icon-name="Document"
            @click="handleExportReport(row)"
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
            平均绩效分: {{ (reportObj.list.reduce((sum, v) => sum + v.performanceScore, 0) / reportObj.list.length).toFixed(2) }};
            最高分: {{ Math.max(...reportObj.list.map(v => v.performanceScore)).toFixed(2) }};
            最低分: {{ Math.min(...reportObj.list.map(v => v.performanceScore)).toFixed(2) }};
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
