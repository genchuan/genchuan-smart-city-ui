<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
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
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/data.js';

// 导入表单配置
import {
  textObj,
  useFormSchema,
  useSearchSchema,
  useDisableSchema,
  getColumnsByStatus,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
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
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
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
  submitButtonOptions: { content: '查询' },
});

// ---------- 新增/编辑抽屉 ----------
const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditForm, editFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
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
    // 删除 createTime 字段，由后端自动生成
    delete formValues.createTime;
    const loading = ElLoading.service({ text: isAdd ? '新增中...' : '保存中...' });
    try {
      if (isAdd) {
        await createChargingStation(formValues);
        ElMessage.success('新增成功');
      } else {
        await updateChargingStation({ ...formValues, id: formData.value.id });
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
        // 编辑模式：直接使用传入的 row 数据回填，避免额外请求
        const editData = { ...formData.value };
        // 删除可能多余的字段，避免覆盖表单默认值
        delete editData.createByName;
        delete editData.updateTime;
        delete editData.createTime; // 创建时间不参与编辑
        await editFormApi.setValues(editData);
      } else {
        await editFormApi.resetForm();
        // 新增时不需要设置创建时间
      }
    }
  },
});

// ---------- 停用弹窗（单条/批量共用） ----------
const disableData = ref({ ids: [], stopReason: '' });
const [DisableForm, disableFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
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
    const { stopReason } = formValues;
    if (!stopReason) {
      ElMessage.warning('请填写停用原因');
      return;
    }
    const loading = ElLoading.service({ text: '停用中...' });
    try {
      const ids = disableData.value.ids;
      if (ids.length === 1) {
        await disableChargingStation({ id: ids[0], stopReason });
      } else {
        for (const id of ids) {
          await disableChargingStation({ id, stopReason });
        }
      }
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
      disableFormApi.resetForm();
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
    const loading = ElLoading.service({ text: '启用中...' });
    try {
      await enableChargingStation({ id: row.id });
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

// ---------- 批量停用 ----------
const handleBatchDisable = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  const hasInvalid = selectedRows.some(row => row.stationStatus !== 'enabled');
  if (hasInvalid) {
    ElMessage.warning('只能停用状态为“已启用”的场站');
    return;
  }
  disableData.value.ids = [...checkedIds.value];
  disableDrawerApi.open();
};

// ---------- 行内停用 ----------
const handleRowDisable = (row) => {
  if (row.stationStatus !== 'enabled') {
    ElMessage.warning('只能停用已启用的场站');
    return;
  }
  disableData.value.ids = [row.id];
  disableDrawerApi.open();
};

// ---------- 获取表格数据 ----------
const getTableData = async ({ page }) => {
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
    dataObj.list = listData; // 原始数据，时间戳在模板中格式化
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
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: ({ records }) => { checkedIds.value = records.map(item => item.id); },
    checkboxChange: ({ records }) => { checkedIds.value = records.map(item => item.id); },
  },
  showSearchForm: false,
});

watch(activeName, () => {
  gridColumns.value = getColumnsByStatus(activeName.value);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
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
    coopModeName: '合作模式',
    manager: '负责人',
    stationStatusName: '场站状态',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  return value;
}

// ---------- 导出 ----------
async function handleExport() {
  const params = { ...dataObj.searchParams, ...tagFilters.value };
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
    const res = await getChargingStationDetail({ id: row.id });
    const detail = res.data || res;
    // 格式化详情中的时间字段
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
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm/>
    </EditDrawer>

    <!-- 停用抽屉 -->
    <DisableDrawer title="停用场站">
      <DisableForm/>
    </DisableDrawer>

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
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
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
        <el-text @click="handleFilterTagClick('coopModeName', row.coopModeName)" type="primary">
          {{ row.coopModeName }}
        </el-text>
      </template>

      <template #manager="{ row }">
        <el-text @click="handleFilterTagClick('manager', row.manager)" type="primary">
          {{ row.manager }}
        </el-text>
      </template>

      <template #status="{ row }">
        <el-text @click="handleFilterTagClick('stationStatusName', row.stationStatusName)" type="primary">
          {{ row.stationStatusName }}
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
          <template v-if="row.stationStatus === 'disabled'">
            <IconButton content="启用" icon-name="CircleCheck" @click="handleEnable(row)"/>
          </template>
          <template v-else-if="row.stationStatus === 'enabled'">
            <IconButton content="停用" icon-name="CircleClose" color="#E6A23C" @click="handleRowDisable(row)"/>
          </template>
          <template v-else-if="row.stationStatus === 'stopped'">
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
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <!-- 图表组件可后续扩展 -->
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>
