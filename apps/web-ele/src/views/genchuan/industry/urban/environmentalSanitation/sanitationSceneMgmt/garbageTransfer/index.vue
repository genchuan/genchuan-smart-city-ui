<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import ParkDetailDrawer from './components/detail.vue';
import Chart2 from './components/chart2.vue';

// 导入真实接口（新增）
import {
  getGarbageTransferPage,
  createGarbageTransfer,
  updateGarbageTransfer,
  deleteGarbageTransfer,
  deleteGarbageTransferBatch,
  exportGarbageTransferExcel,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';

// 导入原有模拟数据（保留，用于非“全部”标签页）
import { dataList } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/data.js';

// 导入表单配置（已更新）
import {
  textObj,
  useGarbageTransferFormSchema,
  useGarbageTransferSearchSchema,
  getColumnsByStatus,
  getAreaOptions,
  getUserOptions,
  getOperationStatusOptions,
  getEquipmentOptions,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageTransfer/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '车辆待进站' },
  { label: '作业进行中' },
  { label: '预警待处理' },
  { label: '设备待维护' },
  { label: '已完成' },
]);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// 点击字段添加/移除筛选条件
function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] === value) {
    delete tagFilters.value[field];
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload(); // 刷新表格
}

// 删除单个筛选标签
function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

// 根据字段名获取显示文本（用于标签头部）
function getFieldLabel(field) {
  const map = {
    areaCode: '所属区域',
    operationStatusId: '运营状态',
  };
  return map[field] || field;
}

// 根据字段和值获取显示文本（用于标签内容）
function getTagDisplayText(field, id) {
  if (id == null) return '';
  let options = [];
  switch (field) {
    case 'areaCode':
      options = loadedOptions.area;
      break;
    case 'operationStatusId':
      options = loadedOptions.operationStatus;
      break;
    default:
      return id;
  }
  const found = options.find(opt => opt.value === id);
  return found ? found.label : id;
}

// 计数（保留原有模拟数据的计数方式，但“全部”标签页会从接口获取总数）
const counts = ref({
  total: 0,
  statusCounts: {
    全部: 0,
    车辆待进站: 0,
    作业进行中: 0,
    预警待处理: 0,
    设备待维护: 0,
    已完成: 0,
  },
});

// 创建标签文本（保留原有逻辑，但“全部”标签页总数会动态更新）
const createLabel = (item) => {
  const key = item.label;
  if (key === '全部') {
    return `${key} (${counts.value.total || 0})`;
  } else {
    // 非全部标签页仍使用模拟数据过滤计数（保持不变）
    const filtered = dataList().filter(v => v.status === key).length;
    return `${key} (${filtered})`;
  }
};

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

const loadedOptions = reactive({
  area: [],
  user: [],
  operationStatus: [],
  equipment: [],
});

// 判断当前标签页是否使用接口数据（只有“全部”标签页用接口）
const isApiTab = computed(() => activeName.value === '全部');

// 判断是否为问题待处置等（保留，这里没有用到但可保留）
const isProblemTab = computed(() => false);

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 搜索表单（新增） ----------
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
  schema: useGarbageTransferSearchSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 编辑表单（新增/编辑） ----------
const [EditForm, editFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useGarbageTransferFormSchema(),
  showDefaultActions: false,
});

const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;

    // 处理数组字段转JSON字符串（equipmentIds）
    const submitData = { ...formValues };
    if (submitData.equipmentIds && Array.isArray(submitData.equipmentIds)) {
      submitData.equipmentIds = JSON.stringify(submitData.equipmentIds);
    }

    try {
      if (isAdd) {
        await createGarbageTransfer(submitData);
      } else {
        // 合并原有数据（避免丢失字段）
        const originalData = { ...formData.value };
        delete originalData.areaName;
        delete originalData.equipmentsName;
        delete originalData.operationStatusName;
        delete originalData.managerName;
        delete originalData.$tableRowIndex;

        const fullData = { ...originalData, ...submitData, id: originalData.id };
        if (fullData.equipmentIds && Array.isArray(fullData.equipmentIds)) {
          fullData.equipmentIds = JSON.stringify(fullData.equipmentIds);
        }
        await updateGarbageTransfer(fullData);
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '操作失败，请重试';
      ElMessage.error(errMsg);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        // 解析equipmentIds
        const editData = { ...formData.value };
        if (editData.equipmentIds && typeof editData.equipmentIds === 'string') {
          try {
            editData.equipmentIds = JSON.parse(editData.equipmentIds);
          } catch {
            editData.equipmentIds = editData.equipmentIds.split(',').map(s => s.trim());
          }
        }
        await editFormApi.setValues(editData);
      } else {
        await editFormApi.resetForm();
      }
    }
  },
});

// ---------- 数据转换函数（兼容接口数据和模拟数据） ----------
function convertGarbageTransferItem(item) {
  // 如果是接口数据（有name字段），转换为表格所需格式
  if (item.name !== undefined) {
    // 解析 equipmentIds
    let equipmentIds = item.equipmentIds;
    if (typeof equipmentIds === 'string') {
      try {
        equipmentIds = JSON.parse(equipmentIds);
      } catch {
        equipmentIds = equipmentIds ? equipmentIds.split(',').map(s => s.trim()) : [];
      }
    }

    // 解析环境数据JSON（可选）
    let environmentDataObj = {};
    if (item.environmentData && typeof item.environmentData === 'string') {
      try {
        environmentDataObj = JSON.parse(item.environmentData);
      } catch {}
    }

    return {
      ...item,
      equipmentIds,
      environmentDataObj,
      createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
      updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    };
  }

  // 如果是模拟数据，原样返回（不需要转换）
  return item;
}

// 获取表格数据
const getTableData = async ({ page }) => {
  if (activeName.value === '全部') {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
      ...tagFilters.value,
    };
    try {
      const res = await getGarbageTransferPage(params);
      const listData = res.data?.list || res.list || [];
      const total = res.data?.total || res.total || 0;

      counts.value.total = total;
      dataObj.total = total;

      // 关键修改：对每项数据进行设备名称映射
      dataObj.list = listData.map(item => {
        const converted = convertGarbageTransferItem(item); // 先解析 equipmentIds 为数组
        if (converted.equipmentIds && Array.isArray(converted.equipmentIds)) {
          // 根据设备选项映射为名称数组
          converted.equipmentsName = converted.equipmentIds.map(id => {
            const option = loadedOptions.equipment.find(opt => opt.value === id);
            return option ? option.label : id; // 若找不到则回退显示 ID
          });
        } else {
          converted.equipmentsName = [];
        }
        return converted;
      });

      return dataObj;
    } catch (error) {
      console.error('获取数据失败', error);
      ElMessage.error('数据加载失败，请重试');
      dataObj.total = 0;
      dataObj.list = [];
      return dataObj;
    }
  } else {
    // 其他标签页：使用模拟数据，根据状态过滤（完全保留原有逻辑）
    const allData = dataList();
    const filtered = allData.filter(v => v.status === activeName.value);
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
    return dataObj;
  }
};

// ---------- Grid 配置 ----------
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
    checkboxAll: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
    checkboxChange: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
  },
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  tagFilters.value = {}; // 切换标签页时清空筛选
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();
  parkDetailDrawerRef.value?.close();
  handleRefresh();
});

// ---------- 操作函数 ----------
function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  searchFormApi.resetForm();
  searchDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function handleCreate() {
  editDrawerApi.setData({}).open();
}

function handleEdit(row) {
  editDrawerApi.setData(row).open();
}

async function handleDelete(row) {
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deleting', [row.name || row.toiletName]) });
  try {
    if (activeName.value === '全部') {
      await deleteGarbageTransfer(row.id);
    } else {
      // 其他标签页暂时不支持删除（或保留原有模拟删除逻辑）
      ElMessage.info('非全部标签页暂不支持删除');
      return;
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) return;
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deletingBatch') });
  try {
    if (activeName.value === '全部') {
      await deleteGarbageTransferBatch(checkedIds.value);
    } else {
      ElMessage.info('非全部标签页暂不支持批量删除');
      return;
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量删除失败：' + error.message);
  } finally {
    loading.close();
  }
}

// 导出
async function handleExport() {
  const params = dataObj.searchParams || {};
  try {
    let response;
    if (activeName.value === '全部') {
      response = await exportGarbageTransferExcel(params);
    } else {
      // 其他标签页使用原有导出模拟数据的方法
      exportToExcel(dataObj.list, textObj.excelName, textObj.excelAllName);
      return;
    }

    const blob = response.data || response;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `转运站运营数据_${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    ElMessage.error('导出失败：' + (error.message || '未知错误'));
  }
}

// 详情抽屉引用
const parkDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
}

function handleOpenComplaintDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
}
const arrowChange = () => emit('arrow-change');
const handleProcess = (row) => ElMessage.info(`处理任务：${row.toiletName}，状态：${row.status}`);

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 加载 options
async function loadOptions() {
  try {
    const [
      areaOptionsRes,
      userOptionsRes,
      statusOptionsRes,
      equipOptionsRes,
    ] = await Promise.all([
      getAreaOptions(),
      getUserOptions(),
      getOperationStatusOptions(),
      getEquipmentOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    };

    loadedOptions.area = extractData(areaOptionsRes);
    loadedOptions.user = extractData(userOptionsRes);
    loadedOptions.operationStatus = extractData(statusOptionsRes);
    loadedOptions.equipment = extractData(equipOptionsRes);

    // 更新编辑表单
    await editFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'equipmentIds', componentProps: { options: loadedOptions.equipment } },
    ]);

    // 更新搜索表单
    await searchFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
    ]);

    console.log('所有选项加载成功');
  } catch (error) {
    console.error('加载选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  }
}

onMounted(async () => {
  await loadOptions();
  handleRefresh();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm />
    </EditDrawer>

    <!-- 详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <SearchForm />
    </SearchDrawer>

    <Grid>
      <template #table-title>
<!--        <div class="tabel-tabs" v-if="props.secondShow">-->
<!--          <el-tabs v-model="activeName" @tab-change="handleClick">-->
<!--            <el-tab-pane-->
<!--              v-for="item in tabsData"-->
<!--              :key="item.label"-->
<!--              :label="createLabel(item)"-->
<!--              :name="item.label"-->
<!--            />-->
<!--          </el-tabs>-->
<!--        </div>-->

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
          <!-- 全部标签页显示新增按钮，其他标签页不显示（保留原有逻辑） -->
          <IconButton v-if="activeName === '全部'" content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 钻取列自定义渲染（保留原有所有钻取插槽） -->
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.name || row.toiletName }}</el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleFilterTagClick('areaCode', row.areaCode)" type="primary">
          {{ row.areaName || row.area }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleFilterTagClick('operationStatusId', row.operationStatusId)" type="primary">
          {{ row.operationStatusName || row.status }}
        </el-text>
      </template>

      <!-- 原有其他状态钻取插槽（完全保留） -->
      <template #reserveId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.reserveId }}</el-text>
      </template>
      <template #licensePlate="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.licensePlate }}</el-text>
      </template>
      <template #garbageType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.garbageType }}</el-text>
      </template>
      <template #operationId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.operationId }}</el-text>
      </template>
      <template #alarmId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmId }}</el-text>
      </template>
      <template #alarmType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmType }}</el-text>
      </template>
      <template #transferName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.transferName }}</el-text>
      </template>
      <template #maintenanceId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.maintenanceId }}</el-text>
      </template>
      <template #equipmentName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.equipmentName }}</el-text>
      </template>
      <template #taskType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.taskType }}</el-text>
      </template>
      <template #photoUrl="{ row }">
        <a v-if="row.photoUrl" :href="row.photoUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>
      <template #proofUrl="{ row }">
        <a v-if="row.proofUrl" :href="row.proofUrl" target="_blank">查看</a>
        <span v-else>-</span>
      </template>

      <!-- 操作列（保留原有所有操作按钮） -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <!-- 全部标签页可编辑/删除，其他标签页仅保留原有操作（如处理等） -->
          <template v-if="activeName === '全部'">
            <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
            <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
          </template>
          <!-- 原有其他状态的操作按钮（完全保留） -->
          <template v-else>
            <IconButton content="处理" icon-name="Checked" @click="handleProcess(row)" />
          </template>
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.list" />
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
/* 强制显示底部容器，覆盖全局样式的 display: none */
//:deep(.vxe-grid--bottom-wrapper) {
//  display: block !important;
//}
</style>
