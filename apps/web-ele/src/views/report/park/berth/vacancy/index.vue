<!-- index.vue 内部 - 泊位空置报表版本 -->
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
import VacancyDetailDrawer from '#/views/report/park/berth/vacancy/detail.vue';

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
    text: $t('ui.actionMessage.deleting', [row.areaName + ' - ' + row.parkType + ' - ' + row.vacancyReason]),
  });
  try {
    reportObj.apilist = reportObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.areaName + ' - ' + row.parkType + ' - ' + row.vacancyReason]));
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
  if (activeName.value === '今日数据') {
    filteredList = reportObj.apilist.filter(v => v.statDate === '2026-02-05');
  } else if (activeName.value === '本周数据') {
    filteredList = reportObj.apilist.filter(v => {
      const date = new Date(v.statDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    });
  } else if (activeName.value === '商业停车场') {
    filteredList = reportObj.apilist.filter(v => v.parkType === '商业停车场');
  } else if (activeName.value === '路侧停车') {
    filteredList = reportObj.apilist.filter(v => v.parkType === '路侧停车');
  } else if (activeName.value === '维护保养') {
    filteredList = reportObj.apilist.filter(v => v.vacancyReason === '维护保养');
  } else if (activeName.value === '设备故障') {
    filteredList = reportObj.apilist.filter(v => v.vacancyReason === '设备故障');
  } else if (activeName.value === '2小时以上') {
    filteredList = reportObj.apilist.filter(v => v.vacancyDuration === '2小时以上');
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

const activeName = ref('今日数据');
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  // 通过ref调用组件的open方法
  vacancyDetailDrawerRef.value.open();
  console.log(row);
};

// 查看地图分布图
const handleViewMap = (row) => {
  // 这里可以跳转到地图页面，传递区域参数
  window.open(`/map/distribution?area=${row.areaName}&type=vacancy`, '_blank');
};

const tabsData = ref([
  { label: '今日数据' },
  { label: '本周数据' },
  { label: '商业停车场' },
  { label: '路侧停车' },
  { label: '维护保养' },
  { label: '设备故障' },
  { label: '2小时以上' },
  { label: '全部数据' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '今日数据') {
    count = reportObj.apilist.filter((v) => v.statDate === '2026-02-05').length;
  } else if (item.label === '本周数据') {
    count = reportObj.apilist.filter(v => {
      const date = new Date(v.statDate);
      const weekStart = new Date('2026-02-01');
      const weekEnd = new Date('2026-02-07');
      return date >= weekStart && date <= weekEnd;
    }).length;
  } else if (item.label === '商业停车场') {
    count = reportObj.apilist.filter((v) => v.parkType === '商业停车场').length;
  } else if (item.label === '路侧停车') {
    count = reportObj.apilist.filter((v) => v.parkType === '路侧停车').length;
  } else if (item.label === '维护保养') {
    count = reportObj.apilist.filter((v) => v.vacancyReason === '维护保养').length;
  } else if (item.label === '设备故障') {
    count = reportObj.apilist.filter((v) => v.vacancyReason === '设备故障').length;
  } else if (item.label === '2小时以上') {
    count = reportObj.apilist.filter((v) => v.vacancyDuration === '2小时以上').length;
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
const vacancyDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <VacancyDetailDrawer
      ref="vacancyDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`泊位空置详情 - ${reportObj.detailObj.areaName} ${reportObj.detailObj.parkType}`"
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
      <template #areaName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.areaName }}
        </el-text>
      </template>
      <template #vacancyDuration="{ row }">
        <el-tag
          :type="row.vacancyDuration === '4小时以上' ? 'danger' :
                 row.vacancyDuration === '2小时以上' ? 'warning' :
                 row.vacancyDuration === '2-4小时' ? 'primary' : 'success'"
          size="small"
        >
          {{ row.vacancyDuration }}
        </el-tag>
      </template>
      <template #vacancyReason="{ row }">
        <el-tag
          :type="row.vacancyReason === '设备故障' ? 'danger' :
                 row.vacancyReason === '维护保养' ? 'warning' :
                 row.vacancyReason === '车场改造' ? 'primary' :
                 row.vacancyReason === '临时关闭' ? 'info' : 'success'"
          size="small"
        >
          {{ row.vacancyReason }}
        </el-tag>
      </template>
      <template #vacantBerth="{ row }">
        <el-tag type="warning" size="small">
          {{ row.vacantBerth }}
        </el-tag>
      </template>
      <template #avgVacancyRate="{ row }">
        <el-tag
          :type="parseFloat(row.avgVacancyRate) > 20 ? 'danger' :
                 parseFloat(row.avgVacancyRate) > 15 ? 'warning' : 'success'"
          size="small"
        >
          {{ row.avgVacancyRate }}
        </el-tag>
      </template>
      <template #longTermVacancyCount="{ row }">
        <el-tag type="danger" size="small">
          {{ row.longTermVacancyCount }}
        </el-tag>
      </template>
      <template #totalBerth="{ row }">
        <el-tag type="primary" size="small">
          {{ row.totalBerth }}
        </el-tag>
      </template>
      <template #occupiedBerth="{ row }">
        <el-tag type="success" size="small">
          {{ row.occupiedBerth }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
            总空置数: {{ reportObj.list.reduce((sum, v) => sum + v.vacantBerth, 0) }};
            长期空置: {{ reportObj.list.reduce((sum, v) => sum + v.longTermVacancyCount, 0) }};
            平均空置率: {{ (reportObj.list.reduce((sum, v) => sum + parseFloat(v.avgVacancyRate), 0) / reportObj.list.length).toFixed(2) }}%;
            </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
