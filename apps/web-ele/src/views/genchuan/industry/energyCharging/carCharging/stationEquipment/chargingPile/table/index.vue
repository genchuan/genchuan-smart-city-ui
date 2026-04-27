<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <PileDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" />
    <LotDetailDrawer ref="lotDetailDrawerRef" />
    <DebugDrawer ref="debugDrawerRef" @success="handleDebugSuccess" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 二维码大图预览弹窗 -->
    <el-dialog v-model="qrcodePreviewVisible" title="二维码预览" width="400px" center>
      <div style="text-align: center;">
        <img :src="qrcodePreviewSrc" style="width: 100%" referrerpolicy="no-referrer" />
      </div>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <!-- 状态标签页 -->
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabChange">
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="`${item.label} (${item.count})`"
                :name="item.label"
              />
            </el-tabs>
          </div>

          <!-- 设备编号筛选标签 -->
          <el-tag v-if="searchParams.pileCode" type="primary" closable @close="handleClearField('pileCode')">
            设备编号：{{ searchParams.pileCode }}
          </el-tag>
          <!-- 型号筛选标签 -->
          <el-tag v-if="searchParams.model" type="primary" closable @close="handleClearField('model')">
            型号：{{ searchParams.model }}
          </el-tag>
          <!-- 生产厂家筛选标签 -->
          <el-tag v-if="searchParams.manufacturer" type="primary" closable @close="handleClearField('manufacturer')">
            生产厂家：{{ searchParams.manufacturer }}
          </el-tag>
          <!-- 所属场站筛选标签（显示场站名称） -->
          <el-tag v-if="searchParams.stationId" type="primary" closable @close="handleClearField('stationId')">
            所属场站：{{ stationMap.get(searchParams.stationId) || searchParams.stationId }}
          </el-tag>
          <!-- 充电模式筛选标签 -->
          <el-tag v-if="searchParams.chargeMode" type="primary" closable @close="handleClearField('chargeMode')">
            充电模式：{{ chargeModeMap.get(Number(searchParams.chargeMode)) || searchParams.chargeMode }}
          </el-tag>
          <!-- 设备状态筛选标签 -->
          <el-tag v-if="searchParams.pileStatus" type="primary" closable @close="handleClearField('pileStatus')">
            设备状态：{{ pileStatusMap.get(Number(searchParams.pileStatus)) || searchParams.pileStatus }}
          </el-tag>
          <!-- 故障标记筛选标签 -->
          <el-tag v-if="searchParams.faultFlag !== undefined && searchParams.faultFlag !== null && searchParams.faultFlag !== ''" type="primary" closable @close="handleClearField('faultFlag')">
            故障标记：{{ searchParams.faultFlag === true || searchParams.faultFlag === 'true' ? '有故障' : '无故障' }}
          </el-tag>
          <!-- 创建时间筛选标签 -->
          <el-tag v-if="searchParams.createTimeBegin" type="primary" closable @close="handleClearField('createTimeBegin')">
            创建时间：{{ searchParams.createTimeBegin }} 至 {{ searchParams.createTimeEnd }}
          </el-tag>
          <!-- 创建人筛选标签 -->
          <el-tag v-if="searchParams.creator" type="primary" closable @close="handleClearField('creator')">
            创建人：{{ searchParams.creator }}
          </el-tag>
          <!-- 运行时长筛选标签 -->
          <el-tag v-if="searchParams.runTime !== undefined && searchParams.runTime !== null && searchParams.runTime !== ''" type="primary" closable @close="handleClearField('runTime')">
            运行时长：{{ searchParams.runTime }} 小时
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部标签下的按钮 -->
          <template v-if="activeName === '全部'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton content="编辑" icon-name="edit" :disabled="checkedIds.length !== 1" @click="handleEditSelected" />
            <IconButton content="停用" icon-name="Close" :disabled="!hasDisableableSelected" @click="handleBatchDisable" />
            <IconButton content="调试" icon-name="Operation" :disabled="!hasDebugableSelected" @click="handleBatchDebug" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton content="批量导出" icon-name="download" :disabled="checkedIds.length === 0" @click="handleBatchExport" />
          </template>

          <!-- 启用/停用标签下的按钮 -->
          <template v-else>
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton content="批量导出" icon-name="download" :disabled="checkedIds.length === 0" @click="handleBatchExport" />
          </template>

          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板（钻取交互） -->
      <template #pileCode="{ row }">
        <el-text @click="handleGarageOpenDetail(row)" type="primary">{{ row.pileCode }}</el-text>
      </template>
      <template #model="{ row }">
        <el-text @click="handleFieldClick('model', row.model)" type="primary">{{ row.model }}</el-text>
      </template>
      <template #manufacturer="{ row }">
        <el-text @click="handleFieldClick('manufacturer', row.manufacturer)" type="primary">{{ row.manufacturer }}</el-text>
      </template>
      <!-- 所属场站点击时传递 stationId -->
      <template #stationName="{ row }">
        <el-text @click="handleFieldClick('stationId', row.stationId)" type="primary">{{ row.stationName }}</el-text>
      </template>
      <template #lotName="{ row }">
        <el-text @click="handleLotDetail(row)" type="primary">{{ row.lotName || '-' }}</el-text>
      </template>
      <template #chargeMode="{ row }">
        <el-text @click="handleFieldClick('chargeMode', row.chargeMode)" type="primary">{{ row.chargeModeName }}</el-text>
      </template>
      <template #pileStatus="{ row }">
        <el-text @click="handleFieldClick('pileStatus', row.pileStatus)" type="primary">{{ row.pileStatusName }}</el-text>
      </template>
      <template #faultFlag="{ row }">
        <el-text @click="handleFieldClick('faultFlag', row.faultFlag)" :type="row.faultFlag ? 'danger' : 'success'">
          {{ row.faultFlag ? '有故障' : '无故障' }}
        </el-text>
      </template>

      <!-- 二维码列（居中） -->
      <template #qrcode="{ row }">
        <div style="display: flex; justify-content: center; align-items: center;">
          <div v-if="row.qrcodeLoading" class="qrcode-loading">加载中...</div>
          <img
            v-else-if="row.qrcodeUrl"
            :src="row.qrcodeUrl"
            class="qrcode-img"
            referrerpolicy="no-referrer"
            @click="previewQrcode(row.id)"
            @error="() => handleImageError(row)"
          />
          <span v-else class="qrcode-placeholder">暂无</span>
        </div>
      </template>

      <template #createTime="{ row }">
        <el-text @click="handleFieldClick('createTime', row.createTime)" type="primary">{{ row.createTime }}</el-text>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFieldClick('creator', row.creator)" type="primary">{{ row.creator }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center;">
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="查看" icon-name="View" @click="handleGarageOpenDetail(row)" />

          <template v-if="row.pileStatusName === '未调试'">
            <IconButton content="调试" icon-name="Operation" @click="handleDebug(row)" />
          </template>
          <template v-else-if="row.pileStatusName === '已调试'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="停用" icon-name="Close" :disabled="row.faultFlag" @click="handleDisable(row)" />
          </template>
          <template v-else-if="row.pileStatusName === '已启用'">
            <IconButton content="停用" icon-name="Close" :disabled="row.faultFlag" @click="handleDisable(row)" />
            <IconButton content="重启" icon-name="Refresh" @click="handleRestart(row)" />
          </template>
          <template v-else-if="row.pileStatusName === '已停用'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="重启" icon-name="Refresh" @click="handleRestart(row)" />
          </template>

          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：充电桩数量{{ dataObj.list.length }}，运行中{{ dataObj.list.filter(v => v.pileStatusName === '已启用').length }}，故障{{ dataObj.list.filter(v => v.faultFlag).length }}，停用{{ dataObj.list.filter(v => v.pileStatusName === '已停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：充电桩总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  getPageList,
  createPile,
  updatePile,
  deletePile,
  debugPile,
  enablePile,
  disablePile,
  restartPile,
  getQrcode,
  getStationSimpleList,
  getLotSimpleList,
  getChargeModeDict,
  getPileStatusDict,
  getStatusCount,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

import PileDetailDrawer from './detail.vue';
import LotDetailDrawer from './lotDetail.vue';
import DebugDrawer from './debugDrawer.vue';
import {
  textObj,
  useFormSchema,
  useGridColumns,
  useQuerySchema,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);

const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));
const searchParams = ref({});
const formData = ref();
const checkedIds = ref([]);
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
});

const chargeModeMap = ref(new Map());
const pileStatusMap = ref(new Map());
const stationMap = ref(new Map()); // stationId -> stationName
const defaultStatusId = ref(null);

// 二维码相关
const qrcodePreviewVisible = ref(false);
const qrcodePreviewSrc = ref('');
const qrcodeUrlMap = ref(new Map());

const detailDrawerRef = ref(null);
const lotDetailDrawerRef = ref(null);
const debugDrawerRef = ref(null);

// ==================== 状态标签页相关 ====================
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部', name: '全部', count: 0 },
  { label: '已启用', name: '已启用', count: 0 },
  { label: '已停用', name: '已停用', count: 0 },
]);

async function fetchStatusCount() {
  try {
    const res = await getStatusCount();
    const statusMap = new Map(res.map(item => [Number(item.pileStatus), item.count]));
    const enableCount = statusMap.get(1) || 0;
    const disableCount = statusMap.get(2) || 0;
    const otherCount = (statusMap.get(3) || 0) + (statusMap.get(4) || 0);
    tabsData.value[0].count = enableCount + disableCount + otherCount;
    tabsData.value[1].count = enableCount;
    tabsData.value[2].count = disableCount;
  } catch (error) {
    console.error('获取状态计数失败', error);
  }
}

function handleTabChange() {
  dataObj.currentPage = 1;
  handleRefresh();
}

function formatList(list) {
  return (list || []).map(item => ({
    ...item,
    createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    pileStatusName: pileStatusMap.value.get(Number(item.pileStatus)) || item.pileStatusName || '未知',
    chargeModeName: chargeModeMap.value.get(Number(item.chargeMode)) || item.chargeModeName || '未知',
    qrcodeUrl: qrcodeUrlMap.value.get(item.id) || null,
    qrcodeLoading: !qrcodeUrlMap.value.has(item.id),
  }));
}

async function loadQrcodesForCurrentPage() {
  const pendingItems = dataObj.list.filter(item => !item.qrcodeUrl && item.qrcodeLoading === true);
  if (pendingItems.length === 0) return;
  const promises = pendingItems.map(async (item) => {
    try {
      const url = await getQrcode(item.id);
      const finalUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
      qrcodeUrlMap.value.set(item.id, finalUrl);
      item.qrcodeUrl = finalUrl;
    } catch (error) {
      console.error(`获取充电桩 ${item.id} 二维码失败`, error);
      item.qrcodeUrl = null;
    } finally {
      item.qrcodeLoading = false;
    }
  });
  await Promise.allSettled(promises);
}

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value === '已启用') {
    params.pileStatus = 1;
  } else if (activeName.value === '已停用') {
    params.pileStatus = 2;
  }

  try {
    const res = await getPageList(params);
    const { list, total } = res;
    dataObj.list = formatList(list);
    dataObj.total = total;
    loadQrcodesForCurrentPage();
    return dataObj;
  } catch (error) {
    console.error('表格数据获取失败', error);
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

const getStatusIdByName = (name) => {
  for (let [id, label] of pileStatusMap.value.entries()) {
    if (label === name) return id;
  }
  return null;
};

const getChargeModeIdByName = (name) => {
  for (let [id, label] of chargeModeMap.value.entries()) {
    if (label === name) return id;
  }
  return null;
};

function handleRefresh() {
  gridApi.query();
}

const handleImageError = (row) => {
  console.warn('二维码加载失败', row.qrcodeUrl);
  row.qrcodeUrl = null;
  row.qrcodeLoading = false;
};

const handleClearField = (fieldName) => {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  if (fieldName === 'createTimeBegin') {
    delete newParams.createTimeEnd;
  }
  searchParams.value = newParams;

  const formValues = { ...queryFormApi.getValues() };
  delete formValues[fieldName];
  if (fieldName === 'createTimeBegin') {
    delete formValues.createTimeEnd;
  }
  queryFormApi.setValues(formValues, false);

  dataObj.currentPage = 1;
  handleRefresh();
};

const handleFieldClick = (fieldName, value) => {
  if (fieldName === 'createTime') {
    const dayStr = dayjs(value).format('YYYY-MM-DD');
    const createTimeBegin = `${dayStr} 00:00:00`;
    const createTimeEnd = `${dayStr} 23:59:59`;
    searchParams.value = { ...searchParams.value, createTimeBegin, createTimeEnd };
    queryFormApi.setValues({ createTimeBegin, createTimeEnd }, false);
  } else if (fieldName === 'runTime') {
    searchParams.value = { ...searchParams.value, runTime: value };
    queryFormApi.setValues({ runTime: value }, false);
  } else if (fieldName === 'faultFlag') {
    const boolValue = value === true || value === 'true' || value === 1;
    searchParams.value = { ...searchParams.value, faultFlag: boolValue };
    queryFormApi.setValues({ faultFlag: boolValue }, false);
  } else if (fieldName === 'chargeMode') {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      searchParams.value = { ...searchParams.value, [fieldName]: numValue };
      queryFormApi.setValues({ [fieldName]: numValue }, false);
    }
  } else if (fieldName === 'stationId') {
    // value 已经是数字 ID，直接设置
    searchParams.value = { ...searchParams.value, [fieldName]: value };
    queryFormApi.setValues({ [fieldName]: value }, false);
  } else {
    searchParams.value = { ...searchParams.value, [fieldName]: value };
    queryFormApi.setValues({ [fieldName]: value }, false);
  }
  dataObj.currentPage = 1;
  handleRefresh();
};

function resetFilter() {
  searchParams.value = {};
  queryFormApi.resetForm();
  dataObj.currentPage = 1;
  handleRefresh();
}

function setFilter(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    resetFilter();
    return;
  }

  const newFilters = { ...filters };

  if (newFilters.chargeMode && typeof newFilters.chargeMode === 'string') {
    const id = getChargeModeIdByName(newFilters.chargeMode);
    if (id) newFilters.chargeMode = id;
    else {
      const num = Number(newFilters.chargeMode);
      if (!isNaN(num)) newFilters.chargeMode = num;
    }
  }

  if (newFilters.pileStatus && typeof newFilters.pileStatus === 'string' && !pileStatusMap.value.has(newFilters.pileStatus)) {
    const id = getStatusIdByName(newFilters.pileStatus);
    if (id) newFilters.pileStatus = id;
  }

  if (newFilters.faultFlag !== undefined && newFilters.faultFlag !== null) {
    newFilters.faultFlag = newFilters.faultFlag === true || newFilters.faultFlag === 'true' || newFilters.faultFlag === 1;
  }

  Object.assign(searchParams.value, newFilters);
  queryFormApi.setValues(newFilters, false);

  dataObj.currentPage = 1;
  handleRefresh();
}

const previewQrcode = async (id) => {
  let url = qrcodeUrlMap.value.get(id);
  if (!url) {
    try {
      url = await getQrcode(id);
      const finalUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
      qrcodeUrlMap.value.set(id, finalUrl);
      const row = dataObj.list.find(item => item.id === id);
      if (row) row.qrcodeUrl = finalUrl;
      url = finalUrl;
    } catch (error) {
      ElMessage.error('获取二维码失败');
      return;
    }
  }
  qrcodePreviewSrc.value = url;
  qrcodePreviewVisible.value = true;
};

// ==================== 导出功能 ====================
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '正在获取数据...' });
  try {
    const params = {
      ...searchParams.value,
      pageNo: 1,
      pageSize: 200,
    };
    if (activeName.value === '已启用') {
      params.pileStatus = 1;
    } else if (activeName.value === '已停用') {
      params.pileStatus = 2;
    }

    let allData = [];
    let pageNo = 1;
    let hasMore = true;
    while (hasMore) {
      params.pageNo = pageNo;
      const res = await getPageList(params);
      const { list, total } = res;
      if (list && list.length > 0) {
        const formattedList = formatList(list);
        allData = allData.concat(formattedList);
        pageNo++;
        if (list.length < params.pageSize) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }

    const allColumns = useGridColumns();
    const exportColumns = allColumns.filter(
      col => col.field && col.type !== 'checkbox' && col.title !== '操作'
    ).map(col => ({ field: col.field, title: col.title }));

    const wsData = [exportColumns.map(col => col.title)];
    allData.forEach(item => {
      const row = exportColumns.map(col => item[col.field] ?? '-');
      wsData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '充电桩');

    let fileName = `充电桩列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    if (activeName.value !== '全部') {
      fileName = `${activeName.value}充电桩_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    }
    XLSX.writeFile(wb, fileName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }

  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  if (selectedRows.length === 0) {
    ElMessage.warning('选中的数据不在当前页，请刷新后重试');
    return;
  }

  const loading = ElLoading.service({ text: '正在生成导出文件...' });
  const wb = XLSX.utils.book_new();
  const allColumns = useGridColumns();
  const exportColumns = allColumns.filter(
    col => col.field && col.type !== 'checkbox' && col.title !== '操作'
  ).map(col => ({ field: col.field, title: col.title }));

  try {
    for (const row of selectedRows) {
      const rowForSheet = {};
      exportColumns.forEach(col => {
        rowForSheet[col.title] = row[col.field] ?? '-';
      });

      const ws = XLSX.utils.json_to_sheet([rowForSheet]);
      let sheetName = (row.pileCode || `桩_${row.id}`).replace(/[\\/:*?"<>|]/g, '_');
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 28) + '...';
      let finalSheetName = sheetName;
      let counter = 1;
      while (wb.SheetNames.includes(finalSheetName)) {
        finalSheetName = `${sheetName}_${counter++}`;
      }
      XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
    }

    if (wb.SheetNames.length === 0) {
      ElMessage.warning('没有有效数据可导出');
      return;
    }

    const fileName = `充电桩批量导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('批量导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loading.close();
  }
}

const handleLotDetail = (row) => {
  if (!row.lotId) {
    ElMessage.warning('该充电桩未绑定车位');
    return;
  }
  lotDetailDrawerRef.value?.open(row.lotId);
};

function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

function handleEditSelected() {
  if (checkedIds.value.length !== 1) {
    ElMessage.warning('请选中一条要编辑的数据');
    return;
  }
  const row = dataObj.list.find(item => item.id === checkedIds.value[0]);
  if (row) handleEdit(row);
}

async function handleDelete(row) {
  await confirm($t('确定删除该充电桩吗？'));
  const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.deleting') });
  try {
    await deletePile(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

const handleDebug = (row) => {
  debugDrawerRef.value?.open(row);
};

async function handleEnable(row) {
  await confirm('确定启用该充电桩吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await enablePile({ id: row.id });
    ElMessage.success('已启用');
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } catch (error) {
    ElMessage.error(error.message || '启用失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleDisable(row) {
  await confirm('确定停用该充电桩吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await disablePile({ id: row.id, remark: '管理员停用' });
    ElMessage.success('已停用');
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } catch (error) {
    ElMessage.error(error.message || '停用失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleRestart(row) {
  const loadingInstance = ElLoading.service({ text: '重启中...' });
  try {
    await restartPile({ id: row.id });
    ElMessage.success('重启成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '重启失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchDebug() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.pileStatusName === '未调试';
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的充电桩中没有未调试状态的设备');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 个充电桩进行批量调试吗？`);
  const loadingInstance = ElLoading.service({ text: '批量调试中...' });
  try {
    await Promise.all(validIds.map(id => debugPile({ id, debugResult: '批量调试通过' })));
    ElMessage.success('批量调试成功');
    checkedIds.value = [];
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } catch (error) {
    ElMessage.error(error.message || '批量调试失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchDisable() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row && (row.pileStatusName === '已调试' || row.pileStatusName === '已启用') && !row.faultFlag;
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的充电桩中没有可停用的设备（故障设备无法停用）');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 个充电桩进行批量停用吗？`);
  const loadingInstance = ElLoading.service({ text: '批量停用中...' });
  try {
    await Promise.all(validIds.map(id => disablePile({ id, remark: '批量停用' })));
    ElMessage.success('批量停用成功');
    checkedIds.value = [];
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } catch (error) {
    ElMessage.error(error.message || '批量停用失败');
  } finally {
    loadingInstance.close();
  }
}

const hasDisableableSelected = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row && (row.pileStatusName === '已调试' || row.pileStatusName === '已启用') && !row.faultFlag;
  });
});

const hasDebugableSelected = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row && row.pileStatusName === '未调试';
  });
});

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

const handleDebugSuccess = () => {
  emit('refresh-chart');
  handleRefresh();
  fetchStatusCount();
};

const changeTotalShow = () => (dataObj.totalShow = !dataObj.totalShow);
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const handleGarageOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 表单相关
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const loadFormOptions = async () => {
  try {
    const [stationList, lotList, chargeModes, pileStatuses] = await Promise.all([
      getStationSimpleList(),
      getLotSimpleList(),
      getChargeModeDict(),
      getPileStatusDict(),
    ]);
    // 填充 stationMap
    stationMap.value.clear();
    (stationList || []).forEach(item => {
      stationMap.value.set(item.value, item.label);
    });
    const formattedChargeModes = (chargeModes || []).map(item => ({
      value: Number(item.value),
      label: item.label
    }));
    const formattedPileStatuses = (pileStatuses || []).map(item => ({
      value: Number(item.value),
      label: item.label
    }));

    chargeModeMap.value.clear();
    formattedChargeModes.forEach(item => chargeModeMap.value.set(item.value, item.label));
    pileStatusMap.value.clear();
    formattedPileStatuses.forEach(item => pileStatusMap.value.set(item.value, item.label));

    const notDebugged = formattedPileStatuses.find(item => item.label === '未调试');
    if (notDebugged) defaultStatusId.value = notDebugged.value;

    await formApi.updateSchema([
      { fieldName: 'stationId', componentProps: { options: Array.isArray(stationList) ? stationList : [] } },
      { fieldName: 'lotId', componentProps: { options: Array.isArray(lotList) ? lotList : [] } },
      { fieldName: 'chargeMode', componentProps: { options: formattedChargeModes } },
    ]);

    await queryFormApi.updateSchema([
      { fieldName: 'stationId', componentProps: { options: stationList || [] } },
      { fieldName: 'chargeMode', componentProps: { options: formattedChargeModes } },
      { fieldName: 'pileStatus', componentProps: { options: formattedPileStatuses } },
    ]);
  } catch (error) {
    console.error('加载下拉选项失败', error);
    ElMessage.error('加载下拉选项失败，请重试');
  }
};

const validateCodeUnique = async (rule, value, callback) => {
  if (!value) return callback();
  const currentId = formDrawerApi.getData()?.id;
  const duplicate = dataObj.list.find(item => item.id !== currentId && item.pileCode === value);
  if (duplicate) {
    callback(new Error('设备编号已存在，请重新输入'));
  } else {
    callback();
  }
};

const onOpenChange = async (isOpen) => {
  if (isOpen) {
    await loadFormOptions();
    const drawerData = formDrawerApi.getData() || {};
    formData.value = drawerData;
    if (drawerData.id) {
      const formValues = { ...drawerData };
      if (formValues.chargeMode !== undefined && formValues.chargeMode !== null) {
        formValues.chargeMode = Number(formValues.chargeMode);
      }
      await formApi.setValues(formValues);
    } else {
      formApi.resetForm();
      if (defaultStatusId.value) {
        await formApi.setValues({ pileStatus: defaultStatusId.value });
      }
    }
    await formApi.updateSchema([
      { fieldName: 'pileCode', rules: ['required', { validator: validateCodeUnique, trigger: 'blur' }] }
    ]);
  }
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const validateResult = await formApi.validate();
    if (!validateResult.valid) {
      ElMessage.warning('请正确填写表单中红色标记的字段');
      return;
    }
    let values = formApi.form.values;
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;
    const isEdit = !!id;
    const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.saving') });
    try {
      if (values.power !== undefined && values.power !== null) values.power = Number(values.power);
      if (values.chargeMode !== undefined && values.chargeMode !== null) values.chargeMode = Number(values.chargeMode);
      if (values.stationId !== undefined && values.stationId !== null) values.stationId = Number(values.stationId);
      if (values.lotId !== undefined && values.lotId !== null) values.lotId = Number(values.lotId);

      if (!isEdit) {
        if (!values.pileStatus && defaultStatusId.value) {
          values.pileStatus = defaultStatusId.value;
        }
        await createPile(values);
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      } else {
        delete values.pileStatus;
        await updatePile({ id, ...values });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      }
      emit('refresh-chart');
      handleRefresh();
      fetchStatusCount();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存失败', error);
      ElMessage.error(error.message || '保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  onOpenChange,
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useQuerySchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

function onSubmit(values) {
  searchParams.value = values;
  dataObj.currentPage = 1;
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { 'class-name': 'common-tool-bar-config', refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

defineExpose({
  setFilter,
  resetFilter,
  handleGarageOpenDetail,
  handleLotDetail,
  handleFieldClick
});

onMounted(() => {
  loadFormOptions().then(() => {
    handleRefresh();
    fetchStatusCount();
  });
});
</script>

<style scoped>
.qrcode-loading, .qrcode-placeholder {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 4px;
}
.qrcode-img {
  width: 40px;
  height: 40px;
  cursor: pointer;
  object-fit: contain;
}
</style>
