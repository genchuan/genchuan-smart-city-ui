<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getChargingPilePage,
  createChargingPile,
  updateChargingPile,
  getChargingPileDetail,
  debugChargingPile,
  enableChargingPile,
  disableChargingPile,
  restartChargingPile,
  exportChargingPile,
  getQrcode,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingPile/index.js';
import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
});

// 表格数据
const checkedIds = ref([]);
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  serachObj: {},
  list: [],
});
let isRedArray = [];

// 列表请求
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
    tenantId: 1,
  };
  const data = await getChargingPilePage(params);
  dataObj.total = data.total;
  dataObj.list = data.list.map(v => ({
    ...v,
    createTime: v.createTime,
    updateTime: v.updateTime,
  }));
  return dataObj;
};

// 表格实例
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
      await updateChargingPile({ ...formData.value, ...values });
      ElMessage.success('编辑成功');
    } else {
      await createChargingPile(values);
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

function handleCreate() { formDrawerApi.setData({}).open(); }
function handleEdit(row) { formDrawerApi.setData(row).open(); }

// 详情
const parkDetailDrawerRef = ref(null);
async function handleView(row) {
  const res = await getChargingPileDetail(row.id);
  dataObj.detailObj = res.data;
  parkDetailDrawerRef.value.open();
}

// 调试弹窗
const debugModalApi = useVbenModal({ title: '充电桩调试', width: 500 });
const currentDebugId = ref(null);
async function handleDebug(row) {
  currentDebugId.value = row.id;
  debugModalApi.open();
}
async function confirmDebug() {
  await debugChargingPile({ id: currentDebugId.value, debugResult: '调试通过', updater: 'admin' });
  ElMessage.success('调试成功，已生成充电枪二维码');
  debugModalApi.close();
  gridApi.reload();
  const qrRes = await getQrcode(currentDebugId.value);
  if (qrRes.data) {
    ElMessageBox.alert(`<img src="${qrRes.data}" style="width:200px;height:200px;" />`, '充电枪二维码', { dangerouslyUseHTMLString: true });
  }
}

// 启用/停用/重启
async function handleEnable(row) {
  await confirm('确定启用该充电桩吗？')();
  await enableChargingPile({ id: row.id, updater: 'admin' });
  ElMessage.success('启用成功');
  gridApi.reload();
}
async function handleDisable(row) {
  await confirm('确定停用该充电桩吗？')();
  await disableChargingPile({ id: row.id, updater: 'admin' });
  ElMessage.success('停用成功');
  gridApi.reload();
}
async function handleRestart(row) {
  await restartChargingPile({ id: row.id, updater: 'admin' });
  ElMessage.success('重启成功');
  gridApi.reload();
}

// 批量操作
async function batchDisable() {
  if (!checkedIds.value.length) return ElMessage.warning('请选择充电桩');
  await confirm(`确定停用选中的 ${checkedIds.value.length} 个充电桩吗？`)();
  for (const id of checkedIds.value) {
    await disableChargingPile({ id, updater: 'admin' });
  }
  ElMessage.success('批量停用成功');
  gridApi.reload();
}
async function batchDebug() {
  if (!checkedIds.value.length) return ElMessage.warning('请选择充电桩');
  await confirm(`确定调试选中的 ${checkedIds.value.length} 个充电桩吗？`)();
  for (const id of checkedIds.value) {
    await debugChargingPile({ id, debugResult: '批量调试通过', updater: 'admin' });
  }
  ElMessage.success('批量调试成功');
  gridApi.reload();
}

// 导出
async function handleExport(type = 'Excel') {
  const params = { ...dataObj.serachObj, exportType: type, tenantId: 1 };
  const data = await exportChargingPile(params);
  downloadFileFromBlobPart({ fileName: `充电桩列表.${type.toLowerCase()}`, source: data });
}

// 刷新
function handleRefresh() { gridApi.reload(); }

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  onConfirm() {},
  async onOpenChange() {},
});
function openSearch() { drawerApi.open(); }

// 全屏
function handleFullShow() { screenfull.toggle(); }

// 底部合计显示切换
const changeTotalShow = () => { dataObj.totalShow = !dataObj.totalShow; };

// 监听图表筛选事件
watch(() => dataObj.serachObj, () => gridApi.reload(), { deep: true });
window.addEventListener('filterByType', (e) => {
  dataObj.serachObj.model = e.detail.model;
  gridApi.reload();
});
window.addEventListener('filterByStatus', (e) => {
  if (e.detail.pileStatus) dataObj.serachObj.pileStatus = e.detail.pileStatus;
  if (e.detail.faultFlag !== undefined) dataObj.serachObj.faultFlag = e.detail.faultFlag;
  gridApi.reload();
});
window.addEventListener('refreshChart', () => {
  gridApi.reload();
});

// 图片预览
const previewVisible = ref(false);
const currentImage = ref('');
function previewImage(url) {
  currentImage.value = url;
  previewVisible.value = true;
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

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="600px" center>
      <img v-if="currentImage" :src="currentImage" style="width: 100%; height: auto" />
    </el-dialog>

    <!-- 详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" title="充电桩详情" />

    <!-- 调试弹窗 -->
    <debugModalApi.Modal>
      <div class="p-4">确认对充电桩 {{ currentDebugId }} 进行调试吗？调试完成后将生成充电枪二维码。</div>
      <template #footer>
        <el-button @click="debugModalApi.close">取消</el-button>
        <el-button type="primary" @click="confirmDebug">确认调试</el-button>
      </template>
    </debugModalApi.Modal>

    <!-- 表格主体 -->
    <Grid>
      <!-- 表格标题区（保留二级 tabs 结构，充电桩暂不需要） -->
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <!-- 可扩展二级筛选 -->
        </div>
      </template>

      <!-- 工具栏按钮（完全复用处罚通知书复审管理的插槽位置） -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="批量停用"
            icon-name="delete"
            color="#F56C6C"
            :disabled="!checkedIds.length"
            @click="batchDisable"
          />
          <IconButton
            content="批量调试"
            icon-name="Setting"
            :disabled="!checkedIds.length"
            @click="batchDebug"
          />
          <IconButton content="导出Excel" icon-name="download" @click="handleExport('Excel')" />
          <IconButton content="导出PDF" icon-name="download" @click="handleExport('PDF')" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton content="搜索" icon-name="search" @click="openSearch" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取插槽 -->
      <template #pileCode="{ row }">
        <el-text class="common-align" type="primary" @click="handleView(row)">{{ row.pileCode }}</el-text>
      </template>
      <template #model="{ row }">
        <el-text class="common-align" type="primary" @click="dataObj.serachObj.model = row.model; gridApi.reload()">{{ row.model }}</el-text>
      </template>
      <template #manufacturer="{ row }">
        <el-text class="common-align" type="primary" @click="dataObj.serachObj.manufacturer = row.manufacturer; gridApi.reload()">{{ row.manufacturer }}</el-text>
      </template>
      <template #stationName="{ row }">
        <el-text class="common-align" type="primary" @click="dataObj.serachObj.stationId = row.stationId; gridApi.reload()">{{ row.stationName }}</el-text>
      </template>
      <template #lotCode="{ row }">
        <el-text v-if="row.lotCode" class="common-align" type="primary" @click="handleViewLot(row.lotId)">{{ row.lotCode }}</el-text>
        <span v-else>--</span>
      </template>
      <template #chargeMode="{ row }">
        <el-text class="common-align" type="primary" @click="dataObj.serachObj.chargeMode = row.chargeMode; gridApi.reload()">{{ row.chargeMode }}</el-text>
      </template>
      <template #pileStatus="{ row }">
        <el-tag :type="row.pileStatus === '已启用' ? 'success' : (row.pileStatus === '已停用' ? 'info' : 'warning')" effect="plain">
          {{ row.pileStatus }}
        </el-tag>
      </template>
      <template #faultFlag="{ row }">
        <el-tag :type="row.faultFlag ? 'danger' : 'success'" size="small" effect="plain">
          {{ row.faultFlag ? '有故障' : '无故障' }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleView(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton v-if="row.pileStatus === '未调试'" content="调试" icon-name="Setting" @click="handleDebug(row)" />
          <template v-else-if="row.pileStatus === '已调试'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="停用" icon-name="delete" @click="handleDisable(row)" />
          </template>
          <template v-else-if="row.pileStatus === '已启用'">
            <IconButton content="停用" icon-name="delete" @click="handleDisable(row)" />
            <IconButton content="重启" icon-name="refresh" @click="handleRestart(row)" />
          </template>
          <template v-else-if="row.pileStatus === '已停用'">
            <IconButton content="启用" icon-name="Check" @click="handleEnable(row)" />
            <IconButton content="重启" icon-name="refresh" @click="handleRestart(row)" />
          </template>
        </div>
      </template>

      <!-- 底部合计 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
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
