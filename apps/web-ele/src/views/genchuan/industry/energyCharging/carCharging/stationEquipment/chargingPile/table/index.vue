<!-- chargingPile/table/index.vue -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { stationList } from '#/api/genchuan/industry/energyCharging/carCharging/chargingPile/index.js';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
});

// ==================== 模拟数据 ====================
const generateMockList = () => {
  const list = [];
  const models = ['DC-60kW', 'AC-7kW', 'DC-120kW', 'AC-22kW', 'DC-150kW'];
  const manufacturers = ['特来电', '星星充电', '国网', '南网', '普天'];
  const stations = [
    { id: 1, name: '城区商圈充电站' },
    { id: 2, name: '工业园区充电站' },
    { id: 3, name: '高速服务区充电站' },
  ];
  const chargeModes = ['直流', '交流', '交直流混合'];
  const statuses = ['未调试', '已调试', '已启用', '已停用'];

  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    list.push({
      id: i,
      pileCode: `CP-${String(i).padStart(6, '0')}`,
      model: models[Math.floor(Math.random() * models.length)],
      power: Math.floor(Math.random() * 150) + 7,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      stationId: stations[Math.floor(Math.random() * stations.length)].id,
      stationName: stations[Math.floor(Math.random() * stations.length)].name,
      lotId: i,
      lotCode: `CL-${String(i).padStart(6, '0')}`,
      chargeMode: chargeModes[Math.floor(Math.random() * chargeModes.length)],
      pileStatus: status,
      faultFlag: Math.random() > 0.8 ? 1 : 0,
      runTime: Math.floor(Math.random() * 2000),
      qrcode: status !== '未调试' ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${`CP-${String(i).padStart(6, '0')}`}` : null,
      remark: '模拟数据',
      creator: 'admin',
      createTime: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  return list;
};

let mockPileList = ref(generateMockList());

// 模拟分页查询
const getTableDataMock = async (params) => {
  let filtered = [...mockPileList.value];
  if (params.pileCode) filtered = filtered.filter(item => item.pileCode.includes(params.pileCode));
  if (params.model) filtered = filtered.filter(item => item.model.includes(params.model));
  if (params.manufacturer) filtered = filtered.filter(item => item.manufacturer.includes(params.manufacturer));
  if (params.stationId) filtered = filtered.filter(item => item.stationId === params.stationId);
  if (params.chargeMode) filtered = filtered.filter(item => item.chargeMode === params.chargeMode);
  if (params.pileStatus) filtered = filtered.filter(item => item.pileStatus === params.pileStatus);
  if (params.faultFlag !== undefined && params.faultFlag !== '') filtered = filtered.filter(item => item.faultFlag === params.faultFlag);
  const total = filtered.length;
  const start = (params.pageNo - 1) * params.pageSize;
  const list = filtered.slice(start, start + params.pageSize);
  return { list, total };
};

// 模拟新增
const createMock = async (data) => {
  const exists = mockPileList.value.some(item => item.pileCode === data.pileCode);
  if (exists) throw new Error('设备编号已存在');
  const newId = Math.max(...mockPileList.value.map(i => i.id), 0) + 1;
  const newItem = {
    ...data,
    id: newId,
    faultFlag: 0,
    runTime: 0,
    qrcode: null,
    creator: 'admin',
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  mockPileList.value.push(newItem);
  return newItem;
};

// 模拟更新
const updateMock = async (data) => {
  const index = mockPileList.value.findIndex(item => item.id === data.id);
  if (index === -1) throw new Error('充电桩不存在');
  const exists = mockPileList.value.some(item => item.pileCode === data.pileCode && item.id !== data.id);
  if (exists) throw new Error('设备编号已存在');
  mockPileList.value[index] = { ...mockPileList.value[index], ...data, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
};

// 模拟调试
const debugMock = async (ids) => {
  const idArr = ids.split(',').map(Number);
  idArr.forEach(id => {
    const idx = mockPileList.value.findIndex(i => i.id === id);
    if (idx !== -1 && mockPileList.value[idx].pileStatus === '未调试') {
      mockPileList.value[idx].pileStatus = '已调试';
      mockPileList.value[idx].qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockPileList.value[idx].pileCode}`;
    }
  });
};

// 模拟启用
const enableMock = async (ids) => {
  const idArr = ids.split(',').map(Number);
  idArr.forEach(id => {
    const idx = mockPileList.value.findIndex(i => i.id === id);
    if (idx !== -1 && (mockPileList.value[idx].pileStatus === '已调试' || mockPileList.value[idx].pileStatus === '已停用')) {
      mockPileList.value[idx].pileStatus = '已启用';
    }
  });
};

// 模拟停用
const disableMock = async (ids) => {
  const idArr = ids.split(',').map(Number);
  idArr.forEach(id => {
    const idx = mockPileList.value.findIndex(i => i.id === id);
    if (idx !== -1 && (mockPileList.value[idx].pileStatus === '已调试' || mockPileList.value[idx].pileStatus === '已启用')) {
      mockPileList.value[idx].pileStatus = '已停用';
    }
  });
};

// 模拟重启
const restartMock = async (ids) => {
  const idArr = ids.split(',').map(Number);
  idArr.forEach(id => {
    const idx = mockPileList.value.findIndex(i => i.id === id);
    if (idx !== -1) {
      ElMessage.success(`充电桩 ${mockPileList.value[idx].pileCode} 已重启`);
    }
  });
};

// ==================== 表格相关 ====================
const dataObj = reactive({
  total: 0,
  list: [],
  serachObj: {},
  detailObj: {},
});

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.serachObj,
    tenantId: 1,
  };
  const res = await getTableDataMock(params);
  dataObj.total = res.total;
  dataObj.list = res.list;
  return dataObj;
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
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

// 搜索表单
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async (values) => {
    dataObj.serachObj = values;
    gridApi.reload();
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema()
    .filter(v => v.isSearch)
    .map(v => {
      delete v.rules;
      return v;
    }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 新增/编辑抽屉
const formData = ref({});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isEdit),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const values = await formApi.getValues();
    if (formData.value.id) {
      await updateMock({ ...formData.value, ...values });
      ElMessage.success('编辑成功');
    } else {
      await createMock(values);
      ElMessage.success('新增成功');
    }
    formDrawerApi.close();
    gridApi.reload();
    window.dispatchEvent(new Event('refreshChart'));
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) await formApi.setValues(formData.value);
      else formApi.resetForm();
    }
  },
});

function handleCreate() { formDrawerApi.setData({ pileStatus: '未调试' }).open(); }
function handleEdit(row) { formDrawerApi.setData(row).open(); }

// 详情
const parkDetailDrawerRef = ref(null);
async function handleView(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
}

// 调试弹窗
const debugModalApi = useVbenModal({ title: '充电桩调试', width: 500 });
const currentDebugIds = ref([]);
async function handleDebug(row) {
  currentDebugIds.value = [row.id];
  debugModalApi.open();
}
async function confirmDebug() {
  await debugMock(currentDebugIds.value.join(','));
  ElMessage.success('调试成功，已生成充电枪二维码');
  debugModalApi.close();
  gridApi.reload();
  window.dispatchEvent(new Event('refreshChart'));
  const pile = mockPileList.value.find(p => p.id === currentDebugIds.value[0]);
  if (pile?.qrcode) {
    ElMessageBox.alert(`<img src="${pile.qrcode}" style="width:200px;height:200px;" />`, '充电枪二维码', { dangerouslyUseHTMLString: true });
  }
}

// 启用/停用/重启
async function handleEnable(row) {
  await confirm('确定启用该充电桩吗？')();
  await enableMock(row.id);
  ElMessage.success('启用成功');
  gridApi.reload();
  window.dispatchEvent(new Event('refreshChart'));
}
async function handleDisable(row) {
  await confirm('确定停用该充电桩吗？')();
  await disableMock(row.id);
  ElMessage.success('停用成功');
  gridApi.reload();
  window.dispatchEvent(new Event('refreshChart'));
}
async function handleRestart(row) {
  await restartMock(row.id);
  gridApi.reload();
}

// 批量操作
const checkedIds = ref([]);
async function batchDisable() {
  if (!checkedIds.value.length) return ElMessage.warning('请选择充电桩');
  await confirm(`确定停用选中的 ${checkedIds.value.length} 个充电桩吗？`)();
  await disableMock(checkedIds.value.join(','));
  ElMessage.success('批量停用成功');
  gridApi.reload();
  window.dispatchEvent(new Event('refreshChart'));
}
async function batchDebug() {
  if (!checkedIds.value.length) return ElMessage.warning('请选择充电桩');
  await confirm(`确定调试选中的 ${checkedIds.value.length} 个充电桩吗？`)();
  await debugMock(checkedIds.value.join(','));
  ElMessage.success('批量调试成功');
  gridApi.reload();
  window.dispatchEvent(new Event('refreshChart'));
}

// 导出模拟
async function handleExport(type = 'Excel') {
  const params = { ...dataObj.serachObj, exportType: type };
  const { list } = await getTableDataMock({ ...params, pageNo: 1, pageSize: 10000 });
  const exportColumns = useGridColumns().filter(col => col.field && col.type !== 'checkbox' && col.title !== '操作');
  const wsData = [exportColumns.map(col => col.title)];
  list.forEach(item => {
    wsData.push(exportColumns.map(col => item[col.field] ?? '-'));
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, '充电桩列表');
  XLSX.writeFile(wb, `充电桩列表_${dayjs().format('YYYYMMDD')}.xlsx`);
  ElMessage.success('导出成功');
}

function handleRefresh() { gridApi.reload(); }

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});
function openSearch() { drawerApi.open(); }

function handleFullShow() { screenfull.toggle(); }

// 图表联动事件
window.addEventListener('filterByType', (e) => {
  dataObj.serachObj.model = e.detail.model;
  gridApi.reload();
});
window.addEventListener('filterByStatus', (e) => {
  const { pileStatus, faultFlag } = e.detail;
  if (pileStatus !== undefined) dataObj.serachObj.pileStatus = pileStatus;
  if (faultFlag !== undefined) dataObj.serachObj.faultFlag = faultFlag;
  if (pileStatus === undefined && faultFlag === undefined) {
    delete dataObj.serachObj.pileStatus;
    delete dataObj.serachObj.faultFlag;
  }
  gridApi.reload();
});
window.addEventListener('refreshChart', () => {
  gridApi.reload();
});

// ========== 钻取筛选标签功能 ==========
// 字段名称映射
const fieldNameMap = {
  pileCode: '设备编号',
  model: '型号',
  manufacturer: '生产厂家',
  stationId: '所属场站',
  chargeMode: '充电模式',
  pileStatus: '设备状态',
  faultFlag: '故障标记',
};

// 获取字段显示值（特殊字段转换）
const getFieldDisplayValue = (field, value) => {
  if (value === undefined || value === null || value === '') return null;
  if (field === 'stationId') {
    const station = stationList.find(s => s.id === value);
    return station ? station.name : value;
  }
  if (field === 'faultFlag') {
    return value === 1 ? '有故障' : '无故障';
  }
  return value;
};

// 当前有效筛选条件
const activeFilters = computed(() => {
  const filters = [];
  Object.keys(dataObj.serachObj).forEach(key => {
    const value = dataObj.serachObj[key];
    if (value !== undefined && value !== null && value !== '' && fieldNameMap[key]) {
      filters.push({
        field: key,
        label: fieldNameMap[key],
        value: getFieldDisplayValue(key, value),
      });
    }
  });
  return filters;
});

// 清除单个筛选
function handleClearFilter(field) {
  delete dataObj.serachObj[field];
  gridApi.reload();
}

// 清除所有筛选
function handleClearAllFilters() {
  Object.keys(dataObj.serachObj).forEach(key => {
    if (fieldNameMap[key]) {
      delete dataObj.serachObj[key];
    }
  });
  gridApi.reload();
}
// ========================================

// 钻取筛选函数（与表格列点击联动）
function handleFieldClick(field, value) {
  dataObj.serachObj[field] = value;
  gridApi.reload();
}

function handleViewLot(lotId) {
  ElMessage.info(`跳转车位详情，车位ID：${lotId}`);
}

function previewQrcode(url) {
  if (!url) return ElMessage.warning('暂无二维码');
  ElMessageBox.alert(`<img src="${url}" style="width:200px;height:200px;" />`, '充电枪二维码', { dangerouslyUseHTMLString: true });
}

function handleFaultFlagClick(row) {
  dataObj.serachObj.faultFlag = row.faultFlag;
  delete dataObj.serachObj.pileStatus;
  gridApi.reload();
}
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <FormDrawer :title="formData.id ? '编辑充电桩' : '新增充电桩'">
      <Form />
    </FormDrawer>

    <!-- 搜索抽屉 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" title="充电桩详情" />

    <!-- 调试弹窗 -->
    <debugModalApi.Modal>
      <div class="p-4">确认对选中的充电桩进行调试吗？调试完成后将生成充电枪二维码。</div>
      <template #footer>
        <el-button @click="debugModalApi.close">取消</el-button>
        <el-button type="primary" @click="confirmDebug">确认调试</el-button>
      </template>
    </debugModalApi.Modal>

    <!-- 表格主体 -->
    <Grid>
      <!-- 钻取筛选标签区域 -->
      <template #table-title>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <el-tag
            v-for="filter in activeFilters"
            :key="filter.field"
            type="primary"
            closable
            @close="handleClearFilter(filter.field)"
          >
            {{ filter.label }}：{{ filter.value }}
          </el-tag>
          <el-tag
            v-if="activeFilters.length > 0"
            type="info"
            closable
            @close="handleClearAllFilters"
          >
            清除全部
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="批量停用" icon-name="delete" color="#F56C6C" :disabled="!checkedIds.length" @click="batchDisable" />
          <IconButton content="批量调试" icon-name="Setting" :disabled="!checkedIds.length" @click="batchDebug" />
          <IconButton content="导出Excel" icon-name="download" @click="handleExport('Excel')" />
          <IconButton content="导出PDF" icon-name="download" @click="handleExport('PDF')" />
          <IconButton content="搜索" icon-name="search" @click="openSearch" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取插槽 -->
      <template #pileCode="{ row }">
        <el-text class="common-align" type="primary" @click="handleView(row)">{{ row.pileCode }}</el-text>
      </template>
      <template #model="{ row }">
        <el-text class="common-align" type="primary" @click="handleFieldClick('model', row.model)">{{ row.model }}</el-text>
      </template>
      <template #manufacturer="{ row }">
        <el-text class="common-align" type="primary" @click="handleFieldClick('manufacturer', row.manufacturer)">{{ row.manufacturer }}</el-text>
      </template>
      <template #stationName="{ row }">
        <el-text class="common-align" type="primary" @click="handleFieldClick('stationId', row.stationId)">{{ row.stationName }}</el-text>
      </template>
      <template #lotCode="{ row }">
        <el-text v-if="row.lotCode" class="common-align" type="primary" @click="handleViewLot(row.lotId)">{{ row.lotCode }}</el-text>
        <span v-else>--</span>
      </template>
      <template #chargeMode="{ row }">
        <el-text class="common-align" type="primary" @click="handleFieldClick('chargeMode', row.chargeMode)">{{ row.chargeMode }}</el-text>
      </template>
      <template #pileStatus="{ row }">
        <el-tag :type="row.pileStatus === '已启用' ? 'success' : (row.pileStatus === '已停用' ? 'info' : 'warning')" effect="plain" style="cursor: pointer" @click="handleFieldClick('pileStatus', row.pileStatus)">
          {{ row.pileStatus }}
        </el-tag>
      </template>
      <template #faultFlag="{ row }">
        <el-tag :type="row.faultFlag ? 'danger' : 'success'" size="small" effect="plain" style="cursor:pointer" @click="handleFaultFlagClick(row)">
          {{ row.faultFlag ? '有故障' : '无故障' }}
        </el-tag>
      </template>
      <template #qrcode="{ row }">
        <el-button v-if="row.qrcode" type="primary" link @click="previewQrcode(row.qrcode)">预览</el-button>
        <span v-else>--</span>
      </template>

      <!-- 操作列：根据状态展示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleView(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <!-- 未调试 -->
          <template v-if="row.pileStatus === '未调试'">
            <IconButton content="调试" icon-name="Setting" @click="handleDebug(row)" />
          </template>
          <!-- 已调试 -->
          <template v-else-if="row.pileStatus === '已调试'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="停用" icon-name="delete" @click="handleDisable(row)" />
          </template>
          <!-- 已启用 -->
          <template v-else-if="row.pileStatus === '已启用'">
            <IconButton content="停用" icon-name="delete" @click="handleDisable(row)" />
            <IconButton content="重启" icon-name="refresh" @click="handleRestart(row)" />
          </template>
          <!-- 已停用 -->
          <template v-else-if="row.pileStatus === '已停用'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="重启" icon-name="refresh" @click="handleRestart(row)" />
          </template>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.park-img-center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 700px;
  height: 700px;
}
:deep(.el-table) {
  --el-table-header-text-color: #303133;
  --el-table-row-hover-bg-color: #f5f7fa;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
