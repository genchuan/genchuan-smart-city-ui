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

// 导入真实接口（用于“全部”标签页）
import {
  getPublicInstitutionPage,
  createPublicInstitution,
  updatePublicInstitution,
  deletePublicInstitution,
  deletePublicInstitutionBatch,
  exportPublicInstitutionExcel,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/publicInstitution/data.js';

// 导入原有模拟数据（用于非“全部”标签页）
import { dataList } from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/publicInstitution/data.js';

// 导入表单配置（新增了接口相关的 schema）
import {
  textObj,
  useFormSchema,                     // 原有表单（模拟数据）
  usePublicInstitutionEditSchema,     // 新增：接口表单
  usePublicInstitutionSearchSchema,   // 新增：搜索表单
  getColumnsByStatus,
  getAreaOptions,
  getUserOptions,
  getOperationStatusOptions,
  getInstitutionTypeOptions,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/publicInstitution/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '保洁待执行' },
  { label: '问题待处置' },
  { label: '核查待验收' },
  { label: '已完成' },
]);

// 模拟数据源（保留原有）
const mockDataList = dataList();

// 数据对象（同时用于接口数据和模拟数据）
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],           // 当前页数据
  searchParams: {},   // 搜索参数（仅用于接口）
});

const checkedIds = ref([]);

// 加载的下拉选项（用于接口表单）
const loadedOptions = reactive({
  area: [],
  user: [],
  operationStatus: [],
  institutionType: [],
});

// 判断当前标签页是否使用接口数据（只有“全部”标签页用接口）
const isApiTab = computed(() => activeName.value === '全部');

// 标签页计数（保持原有方式，但全部标签页总数动态更新）
const counts = ref({
  total: mockDataList.length,
  statusCounts: {
    全部: mockDataList.length,
    保洁待执行: mockDataList.filter(v => v.status === '保洁待执行').length,
    问题待处置: mockDataList.filter(v => v.status === '问题待处置').length,
    核查待验收: mockDataList.filter(v => v.status === '核查待验收').length,
    已完成: mockDataList.filter(v => v.status === '已完成').length,
  },
});

const createLabel = (item) => {
  const key = item.label;
  if (key === '全部') {
    return `${key} (${counts.value.total})`;
  } else {
    return `${key} (${counts.value.statusCounts[key]})`;
  }
};

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 转换函数（接口数据 -> 表格显示） ----------
function convertPublicInstitutionItem(item) {
  // 解析 cleanerIds（JSON字符串转数组）
  let cleanerIds = item.cleanerIds;
  if (typeof cleanerIds === 'string') {
    try {
      cleanerIds = JSON.parse(cleanerIds);
    } catch {
      cleanerIds = cleanerIds ? cleanerIds.split(',').map(s => s.trim()) : [];
    }
  }
  return {
    ...item,
    cleanerIds,
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
  };
}

// ---------- 获取表格数据 ----------
const getTableData = async ({ page }) => {
  if (isApiTab.value) {
    // 全部标签页：调用接口
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
    };
    try {
      const res = await getPublicInstitutionPage(params);
      const listData = res.data?.list || res.list || [];
      const total = res.data?.total || res.total || 0;
      counts.value.total = total; // 更新计数
      dataObj.total = total;
      dataObj.list = listData.map(convertPublicInstitutionItem);
      return dataObj;
    } catch (error) {
      console.error('获取数据失败', error);
      ElMessage.error('数据加载失败，请重试');
      dataObj.total = 0;
      dataObj.list = [];
      return dataObj;
    }
  } else {
    // 其他标签页：使用模拟数据过滤
    const filtered = mockDataList.filter(v => activeName.value === '全部' || v.status === activeName.value);
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

// ---------- 原有搜索抽屉（用于非“全部”标签页） ----------
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: () => {
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// ---------- 新增搜索抽屉（用于“全部”标签页） ----------
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
  schema: usePublicInstitutionSearchSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// ---------- 搜索抽屉（复用同一个抽屉，内部动态切换表单） ----------
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 原有编辑抽屉（用于非“全部”标签页，基于模拟数据） ----------
const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
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
      // 新增：推入模拟数据数组
      mockDataList.push(obj);
    } else {
      // 编辑：更新模拟数据
      const index = mockDataList.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) mockDataList[index] = obj;
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

// ---------- 新增编辑抽屉（用于“全部”标签页，基于接口） ----------
const apiFormData = ref();
const getApiTitle = computed(() => (apiFormData.value?.id ? textObj.editText : textObj.addText));

const [ApiEditForm, apiEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: usePublicInstitutionEditSchema(),
  showDefaultActions: false,
});

const [ApiEditDrawer, apiEditDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => apiEditDrawerApi.close(),
  async onConfirm() {
    const formValues = await apiEditFormApi.getValues();
    const isAdd = !apiFormData.value?.id;

    // 处理数组字段转JSON字符串（cleanerIds）
    const submitData = { ...formValues };
    if (submitData.cleanerIds && Array.isArray(submitData.cleanerIds)) {
      submitData.cleanerIds = JSON.stringify(submitData.cleanerIds);
    }

    try {
      if (isAdd) {
        await createPublicInstitution(submitData);
      } else {
        // 合并原有数据（避免丢失字段）
        const originalData = { ...apiFormData.value };
        delete originalData.areaName;
        delete originalData.institutionTypeName;
        delete originalData.managerName;
        delete originalData.operationStatusName;
        delete originalData.cleanerIds; // 避免重复
        delete originalData.$tableRowIndex;

        const fullData = { ...originalData, ...submitData, id: originalData.id };
        if (fullData.cleanerIds && Array.isArray(fullData.cleanerIds)) {
          fullData.cleanerIds = JSON.stringify(fullData.cleanerIds);
        }
        await updatePublicInstitution(fullData);
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      apiEditDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '操作失败，请重试';
      ElMessage.error(errMsg);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      apiFormData.value = apiEditDrawerApi.getData();
      if (apiFormData.value?.id) {
        // 解析 cleanerIds
        const editData = { ...apiFormData.value };
        if (editData.cleanerIds && typeof editData.cleanerIds === 'string') {
          try {
            editData.cleanerIds = JSON.parse(editData.cleanerIds);
          } catch {
            editData.cleanerIds = editData.cleanerIds.split(',').map(s => s.trim());
          }
        }
        await apiEditFormApi.setValues(editData);
      } else {
        await apiEditFormApi.resetForm();
      }
    }
  },
});

// ---------- 操作函数 ----------
function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  // 根据当前标签页重置对应的搜索表单
  if (isApiTab.value) {
    searchFormApi.resetForm();
  } else {
    queryFormApi.resetForm();
  }
  searchDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function handleCreate() {
  if (isApiTab.value) {
    apiEditDrawerApi.setData({}).open();
  } else {
    formDrawerApi.setData({ title: textObj.addText }).open();
  }
}

function handleEdit(row) {
  if (isApiTab.value) {
    apiEditDrawerApi.setData(row).open();
  } else {
    formDrawerApi.setData({ title: textObj.editText, ...row }).open();
  }
}

async function handleDelete(row) {
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deleting', [row.name || row.toiletName]) });
  try {
    if (isApiTab.value) {
      await deletePublicInstitution(row.id);
    } else {
      // 模拟数据删除
      const index = mockDataList.findIndex(v => v.id === row.id);
      if (index !== -1) mockDataList.splice(index, 1);
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
    if (isApiTab.value) {
      await deletePublicInstitutionBatch(checkedIds.value);
    } else {
      // 模拟数据批量删除
      checkedIds.value.forEach(id => {
        const index = mockDataList.findIndex(v => v.id === id);
        if (index !== -1) mockDataList.splice(index, 1);
      });
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

async function handleExport() {
  if (isApiTab.value) {
    const params = dataObj.searchParams || {};
    try {
      const response = await exportPublicInstitutionExcel(params);
      const blob = response.data || response;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `公共机构环境管理_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      ElMessage.error('导出失败：' + (error.message || '未知错误'));
    }
  } else {
    exportToExcel(mockDataList, textObj.excelName, textObj.excelAllName);
  }
}

// 详情抽屉引用
const parkDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
}

// 以下为原有各标签页特有的操作函数（完全保留）
function handleOpenAreaFilter(area) {
  activeName.value = '全部';
  // 可以触发查询，这里简单刷新
  gridApi.query();
}
function handleOpenStatusFilter(status) {
  activeName.value = status;
  gridApi.query();
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

// ---------- 加载 options（用于接口表单） ----------
async function loadOptions() {
  try {
    const [areaRes, userRes, statusRes, typeRes] = await Promise.all([
      getAreaOptions(),
      getUserOptions(),
      getOperationStatusOptions(),
      getInstitutionTypeOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    };

    loadedOptions.area = extractData(areaRes);
    loadedOptions.user = extractData(userRes);
    loadedOptions.operationStatus = extractData(statusRes);
    loadedOptions.institutionType = extractData(typeRes);

    // 更新接口编辑表单
    await apiEditFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'institutionTypeId', componentProps: { options: loadedOptions.institutionType } },
      { fieldName: 'cleanerIds', componentProps: { options: loadedOptions.user } }, // 保洁人员也是用户
    ]);

    // 更新搜索表单
    await searchFormApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'managerId', componentProps: { options: loadedOptions.user } },
      { fieldName: 'operationStatusId', componentProps: { options: loadedOptions.operationStatus } },
      { fieldName: 'institutionTypeId', componentProps: { options: loadedOptions.institutionType } },
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
    <!-- 原有编辑抽屉（用于非“全部”标签页） -->
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 新增接口编辑抽屉（用于“全部”标签页） -->
    <ApiEditDrawer :title="getApiTitle">
      <ApiEditForm />
    </ApiEditDrawer>

    <!-- 详情抽屉（兼容两种数据源） -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />

    <!-- 搜索抽屉（动态显示不同表单） -->
    <SearchDrawer title="搜索">
      <SearchForm v-if="isApiTab" />
      <QueryForm v-else />
    </SearchDrawer>

    <Grid>
<!--      <template #table-title>-->
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
<!--      </template>-->

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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

      <!-- 钻取列自定义渲染（兼容两种数据源） -->
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.name || row.toiletName }}</el-text>
      </template>
      <template #institutionType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.institutionTypeName || row.institutionType }}</el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleOpenAreaFilter(row.areaName || row.area)" type="primary">
          {{ row.areaName || row.area }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleOpenStatusFilter(row.operationStatusName || row.status)" type="primary">
          {{ row.operationStatusName || row.status }}
        </el-text>
      </template>

      <!-- 原有其他钻取插槽（完全保留） -->
      <template #toiletName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.toiletName }}</el-text>
      </template>
      <template #complaintId="{ row }">
        <el-text @click="handleOpenComplaintDetail(row)" type="primary">{{ row.complaintId }}</el-text>
      </template>
      <template #complaintType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.complaintType }}</el-text>
      </template>
      <template #repairId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.repairId }}</el-text>
      </template>
      <template #facilityType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.facilityType }}</el-text>
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

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
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
            <Chart2 :active-name="activeName" :data-list="mockDataList" />
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
