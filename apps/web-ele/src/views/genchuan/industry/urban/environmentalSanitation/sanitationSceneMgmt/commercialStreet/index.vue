<script setup>
import {computed, reactive, ref, watch} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {isEmpty} from '@vben/utils';
import {ElLoading, ElMessage} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {$t} from '#/locales';
import {exportToExcel} from '#/utils/excel.js';
import ParkDetailDrawer from './components/detail.vue';
import Chart2 from './components/chart2.vue';
import {
  dataList,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/commercialStreet/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/commercialStreet/form.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => formDrawerApi.close(),
  onConfirm: () => {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) dataObj.apilist[i] = obj;
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) await formApi.setValues(formData.value);
      else formApi.resetForm();
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  formDrawerApi.setData({title: textObj.addText}).open();
}

function handleEdit(row) {
  formDrawerApi.setData({title: textObj.editText, ...row}).open();
}

async function handleDelete(row) {
  const loading = ElLoading.service({text: $t('ui.actionMessage.deleting', [row.name])});
  try {
    dataObj.apilist = dataObj.apilist.filter(v => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({text: $t('ui.actionMessage.deletingBatch')});
  try {
    dataObj.apilist = dataObj.apilist.filter(v => !checkedIds.value.includes(v.id));
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loading.close();
  }
}

const checkedIds = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const activeName = ref('全部');
const tabsData = ref([
  {label: '全部'},
  {label: '保洁待执行'},
  {label: '收运待执行'},
  {label: '设施待维护'},
  {label: '问题待处置'},
  {label: '已完成'},
]);

const createLabel = (item) => {
  if (item.label === '全部') return `${item.label} (${dataObj.apilist.length})`;
  return `${item.label} (${dataObj.apilist.filter(v => v.status === item.label).length})`;
};

const gridColumns = ref(getColumnsByStatus(activeName.value));

const getTableData = ({page}) => {
  const filtered = dataObj.apilist.filter(v => activeName.value === '全部' || v.status === activeName.value);
  dataObj.total = filtered.length;
  dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  return dataObj;
};

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: () => {
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({columns: gridColumns.value});
  }
});

const handleClick = () => gridApi.query();
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const parkDetailDrawerRef = ref(null);
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
};
// 特殊字段钻取（如区域、投诉编号等）
const handleOpenAreaFilter = (area) => {
  activeName.value = '全部';
  // 可以触发查询，这里简单刷新
  gridApi.query();
};
const handleOpenStatusFilter = (status) => {
  activeName.value = status;
  gridApi.query();
};
const handleOpenComplaintDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
};
const arrowChange = () => emit('arrow-change');
const handleProcess = (row) => ElMessage.info(`处理任务：${row.toiletName}，状态：${row.status}`);

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form/>
    </FormDrawer>
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <el-tabs v-model="activeName" @tab-change="handleClick">
            <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)"
                         :name="item.label"/>
          </el-tabs>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="批量删除" icon-name="delete" color="#F56C6C"
                      :disabled="isEmpty(checkedIds)" @click="handleDeleteBatch"/>
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>

      <!-- 钻取列自定义渲染 -->
      <template #toiletName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.toiletName }}</el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleOpenAreaFilter(row.area)" type="primary">{{ row.area }}</el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleOpenStatusFilter(row.status)" type="primary">{{
            row.status
          }}
        </el-text>
      </template>
      <template #vehicle="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.vehicle }}</el-text>
      </template>
      <template #planStatus="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.planStatus }}</el-text>
      </template>
      <template #repairId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.repairId }}</el-text>
      </template>
      <template #facilityType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.facilityType }}</el-text>
      </template>
      <template #complaintId="{ row }">
        <el-text @click="handleOpenComplaintDetail(row)" type="primary">{{ row.complaintId }}</el-text>
      </template>
      <template #complaintType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.complaintType }}</el-text>
      </template>
      <template #photoUrl="{ row }">
        <a v-if="row.photoUrl" :href="row.photoUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #proofUrl="{ row }">
        <a v-if="row.proofUrl" :href="row.proofUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #taskType="{ row }">
        {{ row.taskType || '-' }}
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)"/>
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)"/>
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow"/>
            <ArrowUp v-else/>
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.apilist" />
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
/* 强制显示底部容器，覆盖全局样式的 display: none */
:deep(.vxe-grid--bottom-wrapper) {
  display: block !important;
}
</style>
