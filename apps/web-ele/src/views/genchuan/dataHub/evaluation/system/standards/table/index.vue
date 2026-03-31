<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStandardCategoryPage,
  getStandardCategoryDetail,
  createStandardCategory,
  updateStandardCategory,
  deleteStandardCategory,
  exportStandardCategory,
  getIndexSystemSimpleList,
  getStatusSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/standards/index.js';
import detailDrawer from './detail.vue';
import StandardItemManager from '#/views/genchuan/dataHub/evaluation/system/components/StandardItemManager.vue';
import {
  textObj,
  useFormSchema,
  useSearchFormSchema,
  getGridColumnsByTab,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'data-change']);

// ==================== 数据定义 ====================
const dataObj = reactive({
  totalShow: false,
  total: 0,
  list: [],
  garageDetail: {},
});
const checkedIds = ref([]);
const searchParams = ref({});
const formData = ref();
const activeName = ref('全部');
const detailRef = ref(null);
const standardItemManagerRef = ref(null);

// 标准项数据（用于 v-model 绑定 StandardItemManager）
const standardItems = ref([]);

// ==================== computed ====================
const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

const tabsData = ref([
  { label: '全部', name: '全部', count: 0 },
  { label: '启用', name: '启用', count: 0 },
  { label: '停用', name: '停用', count: 0 },
]);

const createLabel = (item) => `${item.label} (${item.count})`;

// ==================== 钻取筛选方法 ====================
function handleSystemClick(systemName) {
  searchParams.value = { ...searchParams.value, systemName };
  handleRefresh();
}
function handleStatusClick(statusName) {
  searchParams.value = { ...searchParams.value, statusName };
  handleRefresh();
}
function handleClearField(field) {
  const newParams = { ...searchParams.value };
  delete newParams[field];
  searchParams.value = newParams;
  handleRefresh();
}

// ==================== 状态计数 ====================
async function fetchStatusCount() {
  try {
    const [allRes, enableRes, disableRes] = await Promise.all([
      getStandardCategoryPage({ pageNo: 1, pageSize: 1 }),
      getStandardCategoryPage({ pageNo: 1, pageSize: 1, statusId: 1 }),
      getStandardCategoryPage({ pageNo: 1, pageSize: 1, statusId: 2 }),
    ]);
    tabsData.value[0].count = allRes.total || 0;
    tabsData.value[1].count = enableRes.total || 0;
    tabsData.value[2].count = disableRes.total || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
    ElMessage.error('获取统计信息失败，请稍后重试');
  }
}

// ==================== 表格数据获取 ====================
function formatList(list) {
  return (list || []).map(item => {
    // 变更日志截断
    let changeLogShort = '-';
    if (item.changeLog != null) {
      const logStr = String(item.changeLog);
      changeLogShort = logStr.length > 50 ? logStr.substring(0, 50) + '...' : logStr;
    }

    return {
      ...item,
      createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      lastUseTime: item.lastUseTime ? dayjs(item.lastUseTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      useCount: item.useCount ?? 0,
      itemCount: item.itemCount ?? 0,
      changeLogShort,
      creatorName: item.creatorName,
      updaterName: item.updaterName,
    };
  });
}

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value !== '全部') {
    params.statusId = activeName.value === '启用' ? 1 : 2;
  }
  try {
    const res = await getStandardCategoryPage(params);
    const { list, total } = res;
    dataObj.list = formatList(list);
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    console.error('获取标准分类列表失败', error);
    ElMessage.error('获取列表失败');
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

const gridColumns = ref(getGridColumnsByTab('全部'));

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
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

// ==================== 搜索抽屉 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
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
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    },
  },
});

async function loadSearchOptions() {
  try {
    const [systemOptions, statusOptions] = await Promise.all([
      getIndexSystemSimpleList(),
      getStatusSimpleList(),
    ]);
    await queryFormApi.updateSchema([
      {
        fieldName: 'systemId',
        componentProps: { options: systemOptions },
      },
      {
        fieldName: 'statusId',
        componentProps: { options: statusOptions },
      },
    ]);
  } catch (error) {
    console.error('加载搜索选项失败', error);
  }
}

function onSubmit(values) {
  const cleaned = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== '' && v != null)
  );
  searchParams.value = cleaned;
  drawerApi.close();
  handleRefresh();
}

// ==================== 新增/编辑抽屉 ====================
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

async function loadFormOptions() {
  try {
    const [systemOptions, statusOptions] = await Promise.all([
      getIndexSystemSimpleList(),
      getStatusSimpleList(),
    ]);
    await formApi.updateSchema([
      {
        fieldName: 'systemId',
        componentProps: { options: systemOptions },
      },
      {
        fieldName: 'statusId',
        componentProps: { options: statusOptions },
      },
    ]);
  } catch (error) {
    console.error('加载表单选项失败', error);
  }
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 800,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const basicValid = await formApi.validate();
    if (!basicValid.valid) return;

    // 从 StandardItemManager 获取最新标准项数据
    const latestItems = standardItemManagerRef.value?.getItems() || standardItems.value;

    // 清理临时ID
    const cleanItems = latestItems.map(item => ({
      id: !String(item.id).startsWith('temp_') ? item.id : undefined,
      grade: item.grade,
      scoreRange: item.scoreRange,
      sortNo: item.sortNo,
    }));

    const basicValues = formApi.form.values;
    const id = formDrawerApi.getData()?.id;

    const payload = {
      name: basicValues.name,
      systemId: Number(basicValues.systemId),
      statusId: Number(basicValues.statusId),
      items: cleanItems,
    };
    if (id) payload.id = Number(id);

    const loadingInstance = ElLoading.service({ text: id ? '更新中...' : '创建中...' });
    try {
      if (id) {
        await updateStandardCategory(payload);
      } else {
        await createStandardCategory(payload);
      }
      ElMessage.success(id ? '编辑成功' : '新增成功');
      emit('data-change');
      handleRefresh();
      fetchStatusCount();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存标准分类失败', error);
      ElMessage.error(error.message || '保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await loadFormOptions();
      const data = formDrawerApi.getData();
      formData.value = data;
      if (data?.id) {
        // 编辑模式
        await formApi.setValues({
          name: data.name,
          systemId: Number(data.systemId),
          statusId: Number(data.statusId),
        });
        const loading = ElLoading.service({ text: '加载详情...', target: '.vben-drawer' });
        try {
          const detail = await getStandardCategoryDetail(data.id);
          // 直接赋值给标准项数组，通过 v-model 传递给组件
          standardItems.value = (detail.items || []).map(item => ({
            id: item.id,
            grade: item.grade,
            scoreRange: item.scoreRange,
            sortNo: item.sortNo,
          }));
        } catch (error) {
          ElMessage.error('加载标准项失败');
        } finally {
          loading.close();
        }
      } else {
        // 新增模式
        formApi.resetForm();
        await formApi.setValues({ statusId: 1 });
        standardItems.value = [];
      }
    }
  },
});

// ==================== 操作函数 ====================
function handleRefresh() {
  gridApi.query();
  fetchStatusCount();
  emit('data-change');
}

function handleCreate() {
  formDrawerApi.setData({}).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ ...row }).open();
}

async function handleDelete(row) {
  await confirm(`确定删除标准分类“${row.name}”吗？`);
  const loadingInstance = ElLoading.service({ text: '删除中...' });
  try {
    await deleteStandardCategory(row.id);
    ElMessage.success('删除成功');
    emit('data-change');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

async function handleDisable(row) {
  if (row.statusId !== 1) {
    ElMessage.warning('当前状态不是启用，不能执行停用操作');
    return;
  }
  await ElMessageBox.confirm('确定停用该标准分类吗？', '提示', { type: 'warning' });
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await updateStandardCategory({ id: row.id, statusId: 2 });
    ElMessage.success('已停用');
    emit('data-change');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

async function handleEnable(row) {
  if (row.statusId !== 2) {
    ElMessage.warning('当前状态不是停用，不能执行启用操作');
    return;
  }
  await ElMessageBox.confirm('确定启用该标准分类吗？', '提示', { type: 'warning' });
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await updateStandardCategory({ id: row.id, statusId: 1 });
    ElMessage.success('已启用');
    emit('data-change');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  const allowedCurrentStatus = targetStatus === '启用' ? 2 : 1;

  const invalidRows = dataObj.list.filter(
    item => checkedIds.value.includes(item.id) && item.statusId !== allowedCurrentStatus
  );
  if (invalidRows.length) {
    ElMessage.warning(`选中的对象中存在状态不是“${allowedCurrentStatus === 1 ? '启用' : '停用'}”的项，无法批量${targetStatus}。`);
    return;
  }

  await ElMessageBox.confirm(`确定将选中的 ${checkedIds.value.length} 个对象${targetStatus}吗？`, '提示', { type: 'warning' });

  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    await Promise.all(checkedIds.value.map(id => updateStandardCategory({ id, statusId: targetStatusId })));
    ElMessage.success(`批量${targetStatus}成功`);
    emit('data-change');
    checkedIds.value = [];
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

// 导出（前端生成 Excel，与评价规则保持一致）
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '正在获取数据...' });
  try {
    // 构建查询参数（不含分页）
    const baseParams = { ...searchParams.value };
    if (activeName.value !== '全部') {
      baseParams.statusId = activeName.value === '启用' ? 1 : 2;
    }
    // 清理空值
    Object.keys(baseParams).forEach(key => {
      if (baseParams[key] === undefined || baseParams[key] === null || baseParams[key] === '') {
        delete baseParams[key];
      }
    });

    let allData = [];
    let pageNo = 1;
    const pageSize = 200;
    let hasMore = true;

    while (hasMore) {
      const params = { ...baseParams, pageNo, pageSize };
      const res = await getStandardCategoryPage(params);
      const { list } = res;
      if (list && list.length > 0) {
        allData = allData.concat(formatList(list));
        pageNo++;
        if (list.length < pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }

    // 获取当前标签页的列配置
    const columns = getGridColumnsByTab(activeName.value);
    // 过滤出需要导出的列（排除复选框和操作列）
    const exportColumns = columns.filter(
      col => col.field && col.type !== 'checkbox' && col.title !== '操作'
    ).map(col => ({ field: col.field, title: col.title }));

    // 构建工作表数据
    const wsData = [];
    wsData.push(exportColumns.map(col => col.title));
    allData.forEach(row => {
      const rowData = exportColumns.map(col => row[col.field] ?? '-');
      wsData.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '标准分类');

    let fileName;
    switch (activeName.value) {
      case '停用':
        fileName = `停用标准分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
        break;
      case '启用':
        fileName = `启用标准分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
        break;
      default:
        fileName = `标准分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
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

// 详情
async function handleGarageOpenDetail(row) {
  const loadingInstance = ElLoading.service({ text: '加载详情中...' });
  try {
    const res = await getStandardCategoryDetail(row.id);
    dataObj.garageDetail = {
      ...row,
      items: (res.items || []).map(item => ({
        grade: item.grade,
        scoreRange: item.scoreRange,
        sortNo: item.sortNo,
      })),
    };
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败，显示基本信息');
    dataObj.garageDetail = row;
  } finally {
    loadingInstance.close();
    detailRef.value.open();
  }
}

// 标签页切换
function handleTabChange() {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
  handleRefresh();
}

// 工具栏按钮
const handleSerachShow = async () => {
  await loadSearchOptions();
  drawerApi.open();
};
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

onMounted(() => {
  handleRefresh();
  fetchStatusCount();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <FormDrawer :title="getTitle" >
      <Form />
      <StandardItemManager
        ref="standardItemManagerRef"
        v-model="standardItems"
      />
    </FormDrawer>

    <!-- 详情抽屉 -->
    <detailDrawer ref="detailRef" :detail-obj="dataObj.garageDetail" />

    <!-- 搜索抽屉 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 表格 -->
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabChange">
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>

          <!-- 钻取筛选标签 -->
          <el-tag
            v-if="searchParams.systemName"
            type="primary"
            closable
            @close="handleClearField('systemName')"
            style="height: 32px; line-height: 32px"
          >
            适用体系：{{ searchParams.systemName }}
          </el-tag>
          <el-tag
            v-if="searchParams.statusName"
            type="warning"
            closable
            @close="handleClearField('statusName')"
            style="height: 32px; line-height: 32px"
          >
            状态：{{ searchParams.statusName }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton v-if="activeName === '全部'" content="新增分类" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            v-if="activeName !== '停用'"
            content="批量停用"
            icon-name="close"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton
            v-if="activeName === '停用'"
            content="批量启用"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 列插槽 -->
      <template #name="{ row }">
        <el-text @click="handleGarageOpenDetail(row)" class="common-align" type="primary">
          {{ row.name }}
        </el-text>
      </template>
      <template #systemName="{ row }">
        <el-text @click="handleSystemClick(row.systemName)" class="common-align" type="primary">
          {{ row.systemName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-text @click="handleStatusClick(row.statusName)" class="common-align" type="primary">
          {{ row.statusName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton
            v-if="row.statusId === 1"
            content="停用"
            icon-name="close"
            color="#F56C6C"
            @click="handleDisable(row)"
          />
          <IconButton
            v-if="row.statusId === 2"
            content="启用"
            icon-name="check"
            color="#67C23A"
            @click="handleEnable(row)"
          />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：分类数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusId === 1).length }}，停用{{ dataObj.list.filter(v => v.statusId === 2).length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：分类总数{{ tabsData[0].count }}，启用{{ tabsData[1].count }}，停用{{ tabsData[2].count }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
