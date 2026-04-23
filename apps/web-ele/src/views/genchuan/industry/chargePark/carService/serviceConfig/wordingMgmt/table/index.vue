<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getWordingMgmtPage,
  createWordingMgmt,
  updateWordingMgmt,
  saveWordingMgmt,
  enableWordingMgmt,
  disableWordingMgmt,
  getWordingMgmtDetail,
  checkNameUnique,
} from '#/api/genchuan/industry/chargePark/carService/serviceConfig/wordingMgmt/index.js';
import { useFormSchema, useGridColumns } from './data';
import WordingMgmtDetailDrawer from './detail.vue';

const props = defineProps({ secondShow: Boolean });

// 数据状态
const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
  modifiedItems: [], // 存储修改过的行（用于批量保存）
});

// ==================== 获取表格数据 ====================
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getWordingMgmtPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

// ==================== 搜索表单 ====================
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter(v => v.isSearch)
    .map(v => {
      delete v.rules;
      return v;
    }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
  } else {
    dataObj.searchObj = { ...values };
    dataObj.currentPage = 1;
    gridApi.query();
  }
}

const handleClearField = async (fieldName) => {
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
  const currentFormValues = await QueryFormApi.getValues();
  delete currentFormValues[fieldName];
  await QueryFormApi.setValues(currentFormValues, false);
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.name) filters.push({ label: `话术名称：${obj.name}`, field: 'name' });
  if (obj.type) filters.push({ label: `类型：${obj.type}`, field: 'type' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  return filters;
});

// ==================== 表格组件 ====================
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
  },
  showSearchForm: false,
});

function handleRefresh() { gridApi.query(); }

// ==================== 新增/编辑抽屉 ====================
const editForm = reactive({ id: null, name: '', content: '', type: '' });
const isEdit = ref(false);
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 550,
  title: computed(() => isEdit.value ? '编辑话术' : '新增话术'),
  onCancel: () => editDrawerApi.close(),
  onConfirm: async () => {
    if (!editForm.name) return ElMessage.warning('请输入话术名称');
    if (!editForm.content) return ElMessage.warning('请输入话术内容');
    if (!editForm.type) return ElMessage.warning('请选择话术类型');
    // 校验名称唯一性
    const isUnique = await checkNameUnique({ name: editForm.name, id: editForm.id || undefined });
    if (!isUnique) return ElMessage.warning('话术名称已存在');
    if (isEdit.value) {
      await updateWordingMgmt(editForm);
      ElMessage.success('编辑成功');
    } else {
      await createWordingMgmt(editForm);
      ElMessage.success('新增成功');
    }
    editDrawerApi.close();
    handleRefresh();
  },
});
const openCreate = () => {
  isEdit.value = false;
  editForm.id = null;
  editForm.name = '';
  editForm.content = '';
  editForm.type = '';
  editDrawerApi.open();
};
const openEdit = (row) => {
  isEdit.value = true;
  editForm.id = row.id;
  editForm.name = row.name;
  editForm.content = row.content;
  editForm.type = row.type;
  editDrawerApi.open();
};

// ==================== 批量保存（保存当前页面所有修改） ====================
const handleSaveAll = async () => {
  // 获取表格所有数据（包括编辑过的）
  const tableData = gridApi.getTableData().tableData;
  const items = tableData.map(row => ({
    id: row.id || null,
    name: row.name,
    content: row.content,
    type: row.type,
  }));
  if (items.length === 0) return ElMessage.warning('暂无数据可保存');
  await saveWordingMgmt({ items });
  ElMessage.success('保存成功');
  handleRefresh();
};

// ==================== 生效/禁用 ====================
const handleEnable = async (row) => {
  await enableWordingMgmt({ id: row.id });
  ElMessage.success('已生效');
  handleRefresh();
};
const handleDisable = async (row) => {
  await confirm('确认禁用该话术吗？禁用后将不再用于客服匹配。');
  await disableWordingMgmt({ id: row.id });
  ElMessage.success('已禁用');
  handleRefresh();
};

// ==================== 详情抽屉 ====================
const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getWordingMgmtDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

// ==================== 钻取筛选 ====================
const filterByType = (type) => {
  dataObj.searchObj.type = type;
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByStatus = (status) => {
  dataObj.searchObj.status = status;
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByName = (name) => {
  dataObj.searchObj.name = name;
  dataObj.currentPage = 1;
  gridApi.query();
};

// ==================== 图表刷新事件 ====================
const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  if (filters?.type) {
    newSearchObj.type = filters.type;
    delete newSearchObj.status;
  } else if (filters?.status) {
    newSearchObj.status = filters.status;
    delete newSearchObj.type;
  } else if (filters?.highMatchRate) {
    // 匹配率钻取：可传额外参数，此处仅作示例
    newSearchObj.highMatchRate = true;
  }
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

// ==================== 搜索抽屉 & 全屏 ====================
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
const handleSearchShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

onMounted(() => {
  window.addEventListener('wording-mgmt-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('wording-mgmt-chart-refresh', handleChartRefresh);
});
</script>

<template>
  <div class="park-lot-table-new">
    <Grid>
      <!-- 筛选标签区 -->
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="add" @click="openCreate" />
          <IconButton content="保存" icon-name="check" @click="handleSaveAll" />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 话术ID：跳转详情抽屉 -->
      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>

      <!-- 话术名称：筛选同名称 -->
      <template #name="{ row }">
        <el-text @click="filterByName(row.name)" type="primary" style="cursor: pointer">
          {{ row.name }}
        </el-text>
      </template>

      <!-- 话术类型：筛选同类型 -->
      <template #type="{ row }">
        <el-tag @click="filterByType(row.type)" style="cursor: pointer">
          {{ row.type }}
        </el-tag>
      </template>

      <!-- 话术状态：筛选同状态 -->
      <template #status="{ row }">
        <el-tag :type="row.status === '已生效' ? 'success' : 'info'"
                @click="filterByStatus(row.status)" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '未生效'">
            <IconButton content="生效" icon-name="check" @click="handleEnable(row)" />
            <IconButton content="编辑" icon-name="Edit" @click="openEdit(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '已生效'">
            <IconButton content="禁用" icon-name="close" @click="handleDisable(row)" />
            <IconButton content="编辑" icon-name="Edit" @click="openEdit(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <!-- 新增/编辑抽屉 -->
    <EditDrawer>
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="话术名称" required>
          <el-input v-model="editForm.name" placeholder="请输入话术名称（唯一）" />
        </el-form-item>
        <el-form-item label="话术内容" required>
          <el-input v-model="editForm.content" type="textarea" rows="4" placeholder="请输入话术内容" />
        </el-form-item>
        <el-form-item label="话术类型" required>
          <el-select v-model="editForm.type" placeholder="请选择">
            <el-option label="快捷回复" value="快捷回复" />
            <el-option label="自动回复" value="自动回复" />
            <el-option label="投诉回复" value="投诉回复" />
          </el-select>
        </el-form-item>
      </el-form>
    </EditDrawer>

    <!-- 详情抽屉 -->
    <WordingMgmtDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="话术详情" />
  </div>
</template>
