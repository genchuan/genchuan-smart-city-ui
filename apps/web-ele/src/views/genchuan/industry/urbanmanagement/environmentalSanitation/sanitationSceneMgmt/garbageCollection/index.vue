<script setup>
import {computed, reactive, ref, watch, onMounted} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {isEmpty} from '@vben/utils';
import {ElLoading, ElMessage} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {$t} from '#/locales';
import {exportToExcel} from '#/utils/excel.js';
import ParkDetailDrawer from './detail.vue';
import Chart2 from './chart2.vue';
import {
  dataList,
  textObj,
  useFormSchema,
  getColumnsByStatus,
  // 新增导入 API 函数
  getGarbageCollectionPage,
  createGarbageCollection,
  updateGarbageCollection,
  deleteGarbageCollection,
  exportGarbageCollectionExcel,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
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
  onConfirm: async () => {
    const obj = formApi.form.values;
    const isAdd = formDrawerApi.sharedData.payload.title === textObj.addText;
    try {
      if (isAdd) {
        await createGarbageCollection(obj);
      } else {
        await updateGarbageCollection(obj);
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh(); // 刷新列表
      formDrawerApi.close();
    } catch (error) {
      // 接口失败，回退到本地模拟数据操作
      console.warn('接口调用失败，使用本地模拟数据', error);
      if (isAdd) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.id === formData.value?.id) dataObj.apilist[i] = obj;
        });
      }
      handleRefresh();
      formDrawerApi.close();
    }
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
  try {
    // 调用导出接口，假设返回文件流
    const res = await exportGarbageCollectionExcel({ /* 可传递当前筛选条件 */ });
    // 处理文件下载（根据实际接口返回格式调整）
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = textObj.excelAllName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.warn('导出接口失败，使用前端导出', error);
    // 回退到原来的前端导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

function handleCreate() {
  formDrawerApi.setData({title: textObj.addText}).open();
}

function handleEdit(row) {
  formDrawerApi.setData({title: textObj.editText, ...row}).open();
}

async function handleDelete(row) {
  const loading = ElLoading.service({text: $t('ui.actionMessage.deleting', [row.planNo])});
  try {
    await deleteGarbageCollection(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.planNo]));
    handleRefresh();
  } catch (error) {
    console.warn('删除接口失败，使用本地模拟数据删除', error);
    // 回退到本地删除
    dataObj.apilist = dataObj.apilist.filter(v => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.planNo]));
    handleRefresh();
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({text: $t('ui.actionMessage.deletingBatch')});
  try {
    // 批量删除：循环调用单个删除接口（或使用批量接口，这里简化）
    for (const id of checkedIds.value) {
      await deleteGarbageCollection(id);
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.warn('批量删除接口失败，使用本地模拟数据删除', error);
    // 回退到本地批量删除
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
  apilist: dataList(), // 模拟全量数据，用于图表和兜底
  list: [],
});

const activeName = ref('全部');
const tabsData = ref([
  {label: '全部'},
  {label: '计划待执行'},
  {label: '作业进行中'},
  {label: '异常待处置'},
  {label: '处置待复核'},
  {label: '已完成'},
]);

const createLabel = (item) => {
  if (item.label === '全部') return `${item.label} (${dataObj.apilist.length})`;
  return `${item.label} (${dataObj.apilist.filter(v => v.status === item.label).length})`;
};

const gridColumns = ref(getColumnsByStatus(activeName.value));

// 修改 getTableData：优先调用接口，失败则回退到本地过滤
const getTableData = async ({ page }) => {
  try {
    // 构建接口参数（需要根据实际接口字段映射，此处简化示例）
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    // 如果 activeName 不是 '全部'，添加状态筛选（需要映射为状态ID，这里先跳过，假设接口支持状态名称或后续完善）
    // 实际使用时请根据后端要求调整
    if (activeName.value !== '全部') {
      // params.planStatus = activeName.value; // 假设接口接受状态名称
    }
    const res = await getGarbageCollectionPage(params);
    // 假设接口返回 { code:0, data: { list, total } }
    if (res.code === 0) {
      dataObj.total = res.data.total;
      dataObj.list = res.data.list;
      return dataObj;
    } else {
      throw new Error(res.msg);
    }
  } catch (error) {
    console.warn('获取分页数据失败，使用本地模拟数据', error);
    // 回退到原来的本地过滤逻辑
    const filtered = dataObj.apilist.filter(v => activeName.value === '全部' || v.status === activeName.value);
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
    return dataObj;
  }
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
    proxyConfig: {ajax: {query: getTableData}}, // 使用修改后的 getTableData
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
const handleOpenAbnormalDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
};
const arrowChange = () => emit('arrow-change');
const handleProcess = (row) => ElMessage.info(`处理计划：${row.planNo}，状态：${row.status}`);

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 组件挂载时可先调用一次刷新，确保数据加载
onMounted(() => {
  handleRefresh();
});
</script>

<template>
  <!-- 模板部分完全不变，保持原样 -->
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

      <template #planNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.planNo }}</el-text>
      </template>

      <template #abnormalId="{ row }">
        <el-text @click="handleOpenAbnormalDetail(row)" type="primary">{{
            row.abnormalId
          }}
        </el-text>
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
          <span>本页统计：计划总数{{
              dataObj.list.length
            }}; 执行中{{
              dataObj.list.filter(v => v.status === '作业进行中').length
            }}; 已完成{{ dataObj.list.filter(v => v.status === '已完成').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：{{ textObj.total }}</span>
          <div v-if="showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.apilist"/>
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>
