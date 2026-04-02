<!-- charging-pile/table/index.vue -->
<template>
  <div class="park-lot-table-new">
    <!-- 抽屉：新增/编辑 -->
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 抽屉：详情 -->
    <PileDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" />

    <!-- 抽屉：车位详情 -->
    <LotDetailDrawer ref="lotDetailDrawerRef" />

    <!-- 抽屉：搜索 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 调试弹窗（带结果和二维码） -->
    <el-dialog v-model="debugDialogVisible" title="调试充电桩" width="30%">
      <el-form :model="debugForm">
        <el-form-item label="调试结果">
          <el-input v-model="debugForm.result" type="textarea" rows="3" placeholder="请输入调试结果" />
        </el-form-item>
        <el-form-item label="充电枪二维码" v-if="debugQrcode">
          <img :src="debugQrcode" style="width: 100px; height: 100px;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="debugDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDebug">确认调试</el-button>
      </template>
    </el-dialog>

    <!-- 二维码预览弹窗 -->
    <el-dialog v-model="qrcodePreviewVisible" title="二维码预览" width="400px" center>
      <div style="text-align: center;">
        <img :src="qrcodePreviewSrc" style="max-width: 100%;" />
      </div>
    </el-dialog>

    <!-- 表格 -->
    <Grid>
      <!-- 顶部 tabs 和筛选标签 -->
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)" :name="item.name" />
            </el-tabs>
          </div>
          <el-tag v-if="searchParams.pileCode" type="primary" closable @close="handleClearField('pileCode')">
            设备编号：{{ searchParams.pileCode }}
          </el-tag>
          <el-tag v-if="searchParams.model" type="primary" closable @close="handleClearField('model')">
            型号：{{ searchParams.model }}
          </el-tag>
          <el-tag v-if="searchParams.manufacturer" type="primary" closable @close="handleClearField('manufacturer')">
            生产厂家：{{ searchParams.manufacturer }}
          </el-tag>
          <el-tag v-if="searchParams.stationName" type="primary" closable @close="handleClearField('stationName')">
            所属场站：{{ searchParams.stationName }}
          </el-tag>
          <el-tag v-if="searchParams.chargeMode" type="primary" closable @close="handleClearField('chargeMode')">
            充电模式：{{ chargeModeMap.get(String(searchParams.chargeMode)) || searchParams.chargeMode }}
          </el-tag>
          <el-tag v-if="searchParams.pileStatus" type="primary" closable @close="handleClearField('pileStatus')">
            设备状态：{{ pileStatusMap.get(String(searchParams.pileStatus)) || searchParams.pileStatus }}
          </el-tag>
          <el-tag v-if="searchParams.faultFlag !== undefined" type="primary" closable @close="handleClearField('faultFlag')">
            故障标记：{{ searchParams.faultFlag ? '有故障' : '无故障' }}
          </el-tag>
          <el-tag v-if="searchParams.createTimeBegin" type="primary" closable @close="handleClearField('createTimeBegin')">
            创建时间：{{ searchParams.createTimeBegin }} 至 {{ searchParams.createTimeEnd }}
          </el-tag>
          <el-tag v-if="searchParams.creator" type="primary" closable @close="handleClearField('creator')">
            创建人：{{ searchParams.creator }}
          </el-tag>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="编辑" icon-name="edit" :disabled="checkedIds.length !== 1" @click="handleEditSelected" />
          <IconButton content="停用" icon-name="Close" :disabled="!hasDisableableSelected" @click="handleBatchDisable" />
          <IconButton content="调试" icon-name="Operation" :disabled="!hasDebugableSelected" @click="handleBatchDebug" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <el-dropdown @command="handleExportWithType">
            <IconButton content="导出" icon-name="download" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="Excel">Excel</el-dropdown-item>
                <el-dropdown-item command="PDF">PDF</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #pileCode="{ row }">
        <el-text @click="handleGarageOpenDetail(row)" class="common-align" type="primary">
          {{ row.pileCode }}
        </el-text>
      </template>
      <template #model="{ row }">
        <el-text @click="handleFieldClick('model', row.model)" class="common-align" type="primary">
          {{ row.model }}
        </el-text>
      </template>
      <template #manufacturer="{ row }">
        <el-text @click="handleFieldClick('manufacturer', row.manufacturer)" class="common-align" type="primary">
          {{ row.manufacturer }}
        </el-text>
      </template>
      <template #stationName="{ row }">
        <el-text @click="handleFieldClick('stationName', row.stationName)" class="common-align" type="primary">
          {{ row.stationName }}
        </el-text>
      </template>
      <template #lotName="{ row }">
        <el-text @click="handleLotDetail(row)" class="common-align" type="primary">
          {{ row.lotName || '-' }}
        </el-text>
      </template>
      <template #chargeMode="{ row }">
        <el-text @click="handleFieldClick('chargeMode', row.chargeMode)" class="common-align" type="primary">
          {{ row.chargeModeName }}
        </el-text>
      </template>
      <template #pileStatus="{ row }">
        <el-text @click="handleFieldClick('pileStatus', row.pileStatus)" class="common-align" type="primary">
          {{ row.pileStatusName }}
        </el-text>
      </template>
      <template #faultFlag="{ row }">
        <el-text @click="handleFieldClick('faultFlag', row.faultFlag)" class="common-align" :type="row.faultFlag ? 'danger' : 'success'">
          {{ row.faultFlag ? '有故障' : '无故障' }}
        </el-text>
      </template>
      <template #qrcode="{ row }">
        <el-image
          v-if="row.qrcodeBase64"
          :src="row.qrcodeBase64"
          style="width: 40px; height: 40px; cursor: pointer"
          fit="contain"
          @click="previewQrcode(row)"
        />
        <span v-else>-</span>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFieldClick('createTime', row.createTime)" class="common-align" type="primary">
          {{ row.createTime }}
        </el-text>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFieldClick('creator', row.creator)" class="common-align" type="primary">
          {{ row.creator }}
        </el-text>
      </template>
      <!-- 行内操作按钮 - 根据状态动态展示 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap;">
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="查看" icon-name="View" @click="handleGarageOpenDetail(row)" />

          <template v-if="row.pileStatusName === '未调试'">
            <IconButton content="调试" icon-name="Operation" @click="handleDebug(row)" />
          </template>

          <template v-else-if="row.pileStatusName === '已调试'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="停用" icon-name="Close" @click="handleDisable(row)" />
          </template>

          <template v-else-if="row.pileStatusName === '已启用'">
            <IconButton content="停用" icon-name="Close" @click="handleDisable(row)" />
            <IconButton content="重启" icon-name="Refresh" @click="handleRestart(row)" />
          </template>

          <template v-else-if="row.pileStatusName === '已停用'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="重启" icon-name="Refresh" @click="handleRestart(row)" />
          </template>

          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <!-- 底部统计 -->
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
  exportPile,
  getStationSimpleList,
  getLotSimpleList,
  getChargeModeDict,
  getPileStatusDict,
  getLotDetail,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

import PileDetailDrawer from './detail.vue';
import LotDetailDrawer from './lotDetail.vue';
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

// ==================== 基础数据 ====================
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});
const searchParams = ref({});
const formData = ref();
const checkedIds = ref([]);
const activeName = ref('全部');
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
});

// 字典映射
const chargeModeMap = ref(new Map());
const pileStatusMap = ref(new Map());
const defaultStatusId = ref(null);

// 调试弹窗
const debugDialogVisible = ref(false);
const debugForm = ref({ id: null, result: '' });
const debugQrcode = ref('');

// 二维码预览弹窗
const qrcodePreviewVisible = ref(false);
const qrcodePreviewSrc = ref('');

// 详情抽屉
const detailDrawerRef = ref(null);
const lotDetailDrawerRef = ref(null);

// ==================== 辅助函数 ====================
const createLabel = (item) => `${item.label} (${item.count})`;

async function formatList(list) {
  // 为每一行异步获取二维码 Base64（如果后端未直接返回）
  const formatted = [];
  for (const item of (list || [])) {
    let qrcodeBase64 = null;
    if (item.qrcode) {
      // 如果后端返回了 qrcode 字段（可能是 URL），则尝试获取 Base64
      // 这里假设后端返回的 qrcode 字段是 Base64 字符串，直接使用
      qrcodeBase64 = item.qrcode;
    } else if (item.id) {
      // 如果没有，则主动请求（注意性能，可改为批量请求或懒加载）
      try {
        qrcodeBase64 = await getQrcode(item.id);
      } catch (e) {
        console.warn(`获取二维码失败 id=${item.id}`, e);
      }
    }
    formatted.push({
      ...item,
      createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      faultFlagText: item.faultFlag ? '有故障' : '无故障',
      pileStatusName: pileStatusMap.value.get(String(item.pileStatus)) || item.pileStatusName || '未知',
      chargeModeName: chargeModeMap.value.get(String(item.chargeMode)) || item.chargeModeName || '未知',
      qrcodeBase64,
    });
  }
  return formatted;
}

// 获取表格数据
const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value !== '全部') {
    const statusId = getStatusIdByName(activeName.value);
    if (statusId) params.pileStatus = statusId;
  }
  try {
    const res = await getPageList(params);
    const { list, total } = res;
    const formattedList = await formatList(list);
    dataObj.list = formattedList;
    dataObj.total = total;
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

const handleClearField = (fieldName) => {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  if (fieldName === 'createTimeBegin') {
    delete newParams.createTimeEnd;
  }
  searchParams.value = newParams;
  queryFormApi.setValues({ [fieldName]: '' });
  handleRefresh();
};

const handleFieldClick = (fieldName, value) => {
  if (fieldName === 'createTime') {
    const dayStr = dayjs(value).format('YYYY-MM-DD');
    const createTimeBegin = `${dayStr} 00:00:00`;
    const createTimeEnd = `${dayStr} 23:59:59`;
    searchParams.value = { ...searchParams.value, createTimeBegin, createTimeEnd };
    queryFormApi.setValues({ createTimeBegin, createTimeEnd });
  } else if (fieldName === 'creator') {
    searchParams.value = { ...searchParams.value, creator: value };
    queryFormApi.setValues({ creator: value });
  } else {
    searchParams.value = { ...searchParams.value, [fieldName]: value };
    queryFormApi.setValues({ [fieldName]: value });
  }
  handleRefresh();
};

const previewQrcode = (row) => {
  if (row.qrcodeBase64) {
    qrcodePreviewSrc.value = row.qrcodeBase64;
    qrcodePreviewVisible.value = true;
  } else {
    ElMessage.warning('暂无二维码');
  }
};

async function handleExportWithType(exportType) {
  if (exportType === 'PDF') {
    ElMessage.info('PDF导出功能开发中，敬请期待');
    return;
  }
  const loadingInstance = ElLoading.service({ text: '正在导出...' });
  try {
    const params = { ...searchParams.value, exportType };
    const blob = await exportPile(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `充电桩列表_${dayjs().format('YYYYMMDD')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loadingInstance.close();
  }
}

const handleLotDetail = async (row) => {
  if (!row.lotId) {
    ElMessage.warning('该充电桩未绑定车位');
    return;
  }
  lotDetailDrawerRef.value?.open(row.lotId);
};

// ==================== 增删改查操作 ====================
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
  } finally {
    loadingInstance.close();
  }
}

async function handleDebug(row) {
  debugForm.value = { id: row.id, result: '' };
  debugQrcode.value = row.qrcodeBase64 || '';
  debugDialogVisible.value = true;
}

async function confirmDebug() {
  const { id, result } = debugForm.value;
  const loadingInstance = ElLoading.service({ text: '调试中...' });
  try {
    // 注意：调试接口可能需要传递 debugResult，但文档中没有，只传 id
    await debugPile({ id, debugResult: result });
    ElMessage.success('调试成功，状态已更新为已调试');
    // 重新获取二维码
    const base64 = await getQrcode(id);
    debugQrcode.value = base64;
    setTimeout(() => {
      debugDialogVisible.value = false;
      emit('refresh-chart');
      handleRefresh();
    }, 1500);
  } catch (error) {
    ElMessage.error(error.message || '调试失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleEnable(row) {
  await confirm('确定启用该充电桩吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await enablePile({ id: row.id });
    ElMessage.success('已启用');
    emit('refresh-chart');
    handleRefresh();
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
    // 停用接口需要 remark 字段，可选
    await disablePile({ id: row.id, remark: '管理员停用' });
    ElMessage.success('已停用');
    emit('refresh-chart');
    handleRefresh();
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
    emit('refresh-chart');
    checkedIds.value = [];
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量调试失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchDisable() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row && (row.pileStatusName === '已调试' || row.pileStatusName === '已启用');
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的充电桩中没有可停用的设备');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 个充电桩进行批量停用吗？`);
  const loadingInstance = ElLoading.service({ text: '批量停用中...' });
  try {
    await Promise.all(validIds.map(id => disablePile({ id, remark: '批量停用' })));
    ElMessage.success('批量停用成功');
    emit('refresh-chart');
    checkedIds.value = [];
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量停用失败');
  } finally {
    loadingInstance.close();
  }
}

const hasDisableableSelected = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row && (row.pileStatusName === '已调试' || row.pileStatusName === '已启用');
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

function resetFilter() {
  searchParams.value = {};
  queryFormApi.resetForm();
  handleRefresh();
}

function setFilter(filters) {
  if (Object.keys(filters).length === 0) {
    resetFilter();
  } else {
    const newFilters = { ...filters };
    if (newFilters.chargeMode && typeof newFilters.chargeMode === 'string' && !chargeModeMap.value.has(newFilters.chargeMode)) {
      const id = getChargeModeIdByName(newFilters.chargeMode);
      if (id) newFilters.chargeMode = id;
    }
    if (newFilters.pileStatus && typeof newFilters.pileStatus === 'string' && !pileStatusMap.value.has(newFilters.pileStatus)) {
      const id = getStatusIdByName(newFilters.pileStatus);
      if (id) newFilters.pileStatus = id;
    }
    Object.assign(searchParams.value, newFilters);
    queryFormApi.setValues(newFilters);
    handleRefresh();
  }
}

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const handleClick = () => {
  handleRefresh();
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

const handleGarageOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// ==================== 表单相关 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
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
    chargeModeMap.value.clear();
    (chargeModes || []).forEach(item => chargeModeMap.value.set(String(item.value), item.label));
    pileStatusMap.value.clear();
    (pileStatuses || []).forEach(item => pileStatusMap.value.set(String(item.value), item.label));
    const notDebugged = (pileStatuses || []).find(item => item.label === '未调试');
    if (notDebugged) defaultStatusId.value = notDebugged.value;

    await formApi.updateSchema([
      { fieldName: 'stationId', componentProps: { options: Array.isArray(stationList) ? stationList : [] } },
      { fieldName: 'lotId', componentProps: { options: Array.isArray(lotList) ? lotList : [] } },
      { fieldName: 'chargeMode', componentProps: { options: Array.isArray(chargeModes) ? chargeModes : [] } },
      // 编辑时设备状态隐藏，不允许修改
      { fieldName: 'pileStatus', componentProps: { hidden: true } },
    ]);

    await queryFormApi.updateSchema([
      { fieldName: 'chargeMode', componentProps: { options: chargeModes || [] } },
      { fieldName: 'pileStatus', componentProps: { options: pileStatuses || [] } },
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
      // 编辑时，注意后端可能要求 pileStatus 字段，但不可编辑，直接使用原值
      await formApi.setValues(drawerData);
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
    if (!validateResult.valid) return;
    let values = formApi.form.values;
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;
    const isEdit = !!id;
    const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.saving') });
    try {
      if (!isEdit) {
        if (!values.pileStatus && defaultStatusId.value) {
          values.pileStatus = defaultStatusId.value;
        }
        await createPile(values);
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      } else {
        // 编辑时移除 pileStatus，防止后端校验
        delete values.pileStatus;
        await updatePile({ id, ...values });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      }
      emit('refresh-chart');
      handleRefresh();
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
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
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
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
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

defineExpose({
  setFilter,
  resetFilter,
});

onMounted(() => {
  loadFormOptions().then(() => {
    handleRefresh();
  });
});
</script>
