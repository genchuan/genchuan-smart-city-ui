<script setup>
import {computed, reactive, ref, watch} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {isEmpty} from '@vben/utils';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {$t} from '#/locales';
import detailDrawer from './components/detail.vue';

// 导入真实接口
import {
  getChargingStationPage,
  createChargingStation,
  updateChargingStation,
  disableChargingStation,
  enableChargingStation,
  exportChargingStation,
  getChargingStationDetail,
  batchUpdateChargingStation,
  batchDisableChargingStation,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/data.js';

// 导入表单配置
import {
  textObj,
  useFormSchema,
  useSearchSchema,
  useDisableSchema,
  getColumnsByStatus,
  useBatchUpdateSchema,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/form.js';

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

// ---------- 时间格式化工具 ----------
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ---------- 状态管理 ----------
const activeName = ref('全部');
const tagFilters = ref({});
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});
const checkedIds = ref([]);

// ---------- 搜索抽屉 ----------
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

const [SearchForm, searchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async () => {
    const rawValues = await searchFormApi.getValues();
    dataObj.searchParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useSearchSchema(),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

// ---------- 新增/编辑抽屉 ----------
const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditForm, editFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;
    delete formValues.createTime;
    const loading = ElLoading.service({text: isAdd ? '新增中...' : '保存中...'});
    try {
      if (isAdd) {
        await createChargingStation(formValues);
        ElMessage.success('新增成功');
      } else {
        await updateChargingStation({...formValues, id: formData.value.id});
        ElMessage.success('编辑成功');
      }
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '操作失败，请重试';
      ElMessage.error(errMsg);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        const editData = {...formData.value};
        delete editData.createByName;
        delete editData.updateTime;
        delete editData.createTime;
        await editFormApi.setValues(editData);
      } else {
        await editFormApi.resetForm();
      }
    }
  },
});

// ---------- 批量编辑抽屉 ----------
const batchUpdateData = ref({ids: []});
const [BatchUpdateForm, batchUpdateFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useBatchUpdateSchema(),
  showDefaultActions: false,
});

const [BatchUpdateDrawer, batchUpdateDrawerApi] = useVbenDrawer({
  title: '批量编辑场站',
  appendToMain: true,
  modal: false,
  onCancel: () => batchUpdateDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchUpdateFormApi.getValues();
    const updateData = {};
    if (formValues.coopMode !== undefined && formValues.coopMode !== '') {
      updateData.coopMode = formValues.coopMode;
    }
    if (formValues.manager !== undefined && formValues.manager !== '') {
      updateData.manager = formValues.manager;
    }
    if (Object.keys(updateData).length === 0) {
      ElMessage.warning('请至少填写一个要修改的字段');
      return;
    }

    const loading = ElLoading.service({text: '批量编辑中...'});
    try {
      await batchUpdateChargingStation({
        ids: batchUpdateData.value.ids,
        ...updateData,
      });
      ElMessage.success('批量编辑成功');
      handleRefresh();
      batchUpdateDrawerApi.close();
    } catch (error) {
      console.error('批量编辑失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '批量编辑失败，请重试';
      ElMessage.error(errMsg);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchUpdateFormApi.resetForm();
    }
  },
});

const handleBatchUpdate = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  batchUpdateData.value.ids = [...checkedIds.value];
  batchUpdateDrawerApi.open();
};

// ---------- 单条停用抽屉（仅用于行内停用） ----------
const disableData = ref({ids: [], stopReason: ''});
const [DisableForm, disableFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useDisableSchema(),
  showDefaultActions: false,
});

const [DisableDrawer, disableDrawerApi] = useVbenDrawer({
  title: '停用场站',
  appendToMain: true,
  modal: false,
  onCancel: () => disableDrawerApi.close(),
  async onConfirm() {
    const formValues = await disableFormApi.getValues();
    const {stopReason} = formValues;
    if (!stopReason) {
      ElMessage.warning('请填写停用原因');
      return;
    }
    const loading = ElLoading.service({text: '停用中...'});
    try {
      // 单条停用，直接调用 disableChargingStation
      const id = disableData.value.ids[0];
      await disableChargingStation({id, stopReason});
      ElMessage.success('停用成功');
      handleRefresh();
      disableDrawerApi.close();
    } catch (error) {
      console.error('停用失败', error);
      ElMessage.error(error?.response?.data?.msg || error?.message || '停用失败');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await disableFormApi.resetForm();
    }
  },
});

// ---------- 批量停用抽屉（新增） ----------
const batchDisableData = ref({ids: [], stopReason: ''});
const [BatchDisableForm, batchDisableFormApi] = useVbenForm({
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 80},
  layout: 'horizontal',
  schema: useDisableSchema(),
  showDefaultActions: false,
});

const [BatchDisableDrawer, batchDisableDrawerApi] = useVbenDrawer({
  title: '批量停用场站',
  appendToMain: true,
  modal: false,
  onCancel: () => batchDisableDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchDisableFormApi.getValues();
    const {stopReason} = formValues;
    if (!stopReason) {
      ElMessage.warning('请填写停用原因');
      return;
    }
    const loading = ElLoading.service({text: '批量停用中...'});
    try {
      await batchDisableChargingStation({
        ids: batchDisableData.value.ids,
        stopReason,
      });
      ElMessage.success('批量停用成功');
      handleRefresh();
      batchDisableDrawerApi.close();
    } catch (error) {
      console.error('批量停用失败', error);
      ElMessage.error(error?.response?.data?.msg || error?.message || '批量停用失败');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchDisableFormApi.resetForm();
    }
  },
});

// ---------- 启用确认 ----------
const handleEnable = async (row) => {
  try {
    await ElMessageBox.confirm('确定启用该场站吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({text: '启用中...'});
    try {
      await enableChargingStation({id: row.id});
      ElMessage.success('启用成功');
      handleRefresh();
    } catch (error) {
      console.error('启用失败', error);
      ElMessage.error(error?.response?.data?.msg || error?.message || '启用失败');
    } finally {
      loading.close();
    }
  } catch {
    // 取消操作
  }
};

// ---------- 批量停用（修改：打开新抽屉） ----------
const handleBatchDisable = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  const hasInvalid = selectedRows.some(row => row.stationStatus !== 'enabled');
  batchDisableData.value.ids = [...checkedIds.value];
  batchDisableDrawerApi.open(); // 打开新的批量停用抽屉
};

// ---------- 行内停用（使用原有单条抽屉） ----------
const handleRowDisable = (row) => {
  disableData.value.ids = [row.id];
  disableDrawerApi.open();
};

// ---------- 获取表格数据 ----------
const getTableData = async ({page}) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    ...tagFilters.value,
  };
  try {
    const res = await getChargingStationPage(params);
    const listData = res.data?.list || res.list || [];
    const total = res.data?.total || res.total || 0;
    dataObj.total = total;
    dataObj.list = listData;
    return dataObj;
  } catch (error) {
    console.error('获取数据失败', error);
    ElMessage.error('数据加载失败，请重试');
    dataObj.total = 0;
    dataObj.list = [];
    return dataObj;
  }
};

// ---------- Grid 配置 ----------
const gridColumns = ref(getColumnsByStatus(activeName.value));

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
  gridEvents: {
    checkboxAll: ({records}) => {
      checkedIds.value = records.map(item => item.id);
    },
    checkboxChange: ({records}) => {
      checkedIds.value = records.map(item => item.id);
    },
  },
  showSearchForm: false,
});

watch(activeName, () => {
  gridColumns.value = getColumnsByStatus(activeName.value);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({columns: gridColumns.value});
  }
  dataObj.searchParams = {};
  tagFilters.value = {};
  searchDrawerApi.close();
  handleRefresh();
});

// ---------- 标签筛选 ----------
function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] === value) {
    delete tagFilters.value[field];
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    stationName: '场站名称',
    address: '场站地址',
    coopMode: '合作模式',
    manager: '负责人',
    stationStatus: '场站状态',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  return value;
}

// ---------- 导出 ----------
async function handleExport() {
  const params = {...dataObj.searchParams, ...tagFilters.value};
  try {
    const res = await exportChargingStation(params);
    const blob = res.data || res;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `充电场站列表_${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error('导出失败，请重试');
  }
}

// ---------- 其他操作 ----------
function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  editDrawerApi.setData({}).open();
}

function handleEdit(row) {
  editDrawerApi.setData(row).open();
}

function handleSerachShow() {
  searchFormApi.resetForm();
  searchDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

const detailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const res = await getChargingStationDetail({id: row.id});
    const detail = res.data || res;
    if (detail.createTime) detail.createTime = formatTimestamp(detail.createTime);
    if (detail.updateTime) detail.updateTime = formatTimestamp(detail.updateTime);
    dataObj.detailObj = detail;
    detailDrawerRef.value?.open();
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败，请稍后重试');
  }
}

const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 合作模式映射
const coopModeMap = {
  self: '自营',
  joint: '联营',
  franchise: '加盟',
};

// 转换函数
const getCoopModeLabel = (value) => coopModeMap[value] || value;
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm/>
    </EditDrawer>

    <!-- 批量编辑抽屉 -->
    <BatchUpdateDrawer title="批量编辑场站">
      <BatchUpdateForm/>
    </BatchUpdateDrawer>

    <!-- 单条停用抽屉 -->
    <DisableDrawer title="停用场站">
      <DisableForm/>
    </DisableDrawer>

    <!-- 批量停用抽屉（新增） -->
    <BatchDisableDrawer title="批量停用场站">
      <BatchDisableForm/>
    </BatchDisableDrawer>

    <!-- 详情抽屉 -->
    <detailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj"/>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <SearchForm/>
    </SearchDrawer>

    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton
            content="批量编辑"
            icon-name="Edit"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchUpdate"
          />
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <!-- 停用按钮现在打开新的批量停用抽屉 -->
          <IconButton
            content="停用"
            icon-name="CircleClose"
            color="#E6A23C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchDisable"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow"/>
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 钻取列自定义渲染 -->
      <template #stationCode="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.stationCode }}</el-text>
      </template>

      <template #stationName="{ row }">
        <el-text @click="handleFilterTagClick('stationName', row.stationName)" type="primary">
          {{ row.stationName }}
        </el-text>
      </template>

      <template #address="{ row }">
        <el-text @click="handleFilterTagClick('address', row.address)" type="primary">
          {{ row.address }}
        </el-text>
      </template>

      <template #coopMode="{ row }">
        <el-text @click="handleFilterTagClick('coopMode', row.coopMode)" type="primary">
          {{ getCoopModeLabel(row.coopMode) }}
        </el-text>
      </template>

      <template #manager="{ row }">
        <el-text @click="handleFilterTagClick('manager', row.manager)" type="primary">
          {{ row.manager }}
        </el-text>
      </template>

      <template #status="{ row }">
        <el-text @click="handleFilterTagClick('stationStatus', row.stationStatus)" type="primary">
          {{ row.stationStatus }}
        </el-text>
      </template>

      <!-- 时间列格式化 -->
      <template #createTime="{ row }">
        {{ formatTimestamp(row.createTime) }}
      </template>

      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)"/>
          <template v-if="row.stationStatus === 'wait' || row.stationStatus === '未启用'">
            <IconButton content="启用" icon-name="CircleCheck" @click="handleEnable(row)"/>
          </template>
          <template v-else-if="row.stationStatus === 'enabled' || row.stationStatus === '已启用'">
            <IconButton content="停用" icon-name="CircleClose" color="#E6A23C"
                        @click="handleRowDisable(row)"/>
          </template>
          <template v-else-if="row.stationStatus === 'disabled' || row.stationStatus === '已停用'">
            <IconButton content="启用" icon-name="CircleCheck" @click="handleEnable(row)"/>
          </template>
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
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'"
               class="bottom-chart-wrapper">
            <!-- 图表组件可后续扩展 -->
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>
