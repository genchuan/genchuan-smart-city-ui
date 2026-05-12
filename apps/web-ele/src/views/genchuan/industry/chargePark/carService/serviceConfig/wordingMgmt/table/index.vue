<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="openCreate" />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #name="{ row }">
        <el-tooltip content="点击筛选同名称的话术记录" placement="top">
          <el-text @click="filterByName(row.name)" type="primary" style="cursor: pointer">
            {{ row.name }}
          </el-text>
        </el-tooltip>
      </template>
      <template #type="{ row }">
        <el-tooltip content="点击筛选同类型的话术记录" placement="top">
          <el-tag @click="filterByType(row.type)" style="cursor: pointer">
            {{ row.type }}
          </el-tag>
        </el-tooltip>
      </template>
      <template #status="{ row }">
        <el-tooltip content="点击筛选同状态的话术记录" placement="top">
          <el-tag :type="row.status === '已生效' ? 'success' : 'info'"
                  @click="filterByStatus(row.status)" style="cursor: pointer">
            {{ row.status }}
          </el-tag>
        </el-tooltip>
      </template>

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

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <EditDrawer>
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="话术名称" required>
          <el-input v-model="editForm.name" :disabled="isEdit" placeholder="请输入话术名称（唯一）" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="话术内容" required>
          <el-input v-model="editForm.content" type="textarea" rows="4" placeholder="请输入话术内容" maxlength="500" show-word-limit />
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

    <WordingMgmtDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="话术详情" />
  </div>
</template>

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
  enableWordingMgmt,
  disableWordingMgmt,
  getWordingMgmtDetail,
  checkNameUnique,
} from '#/api/genchuan/industry/chargePark/carService/serviceConfig/wordingMgmt/index.js';
import { useFormSchema, useGridColumns } from './data';
import WordingMgmtDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const arrowChange = () => emit('arrow-change');

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
  modifiedItems: [],
});

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

const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isSearch).map(v => { delete v.rules; return v; }),
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
  if (isReset) await resetAllFilters();
  else { dataObj.searchObj = { ...values }; dataObj.currentPage = 1; gridApi.query(); }
}

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchObj };
  delete next[fieldName];
  dataObj.searchObj = next;
  dataObj.currentPage = 1;
  gridApi.query();
  // Drawer 表单可能未挂载，setValues 仅做软同步，失败不影响列表刷新
  Promise.resolve(QueryFormApi.setValues?.({ [fieldName]: null }, false)).catch(() => {});
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.name) filters.push({ label: `话术名称：${obj.name}`, field: 'name' });
  if (obj.type) filters.push({ label: `类型：${obj.type}`, field: 'type' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
  },
  showSearchForm: false,
});

const handleRefresh = () => {
  gridApi.query();
  // 通知图表组件刷新统计数据
  window.dispatchEvent(new CustomEvent('wording-mgmt-refresh-stats'));
};

const editForm = reactive({ id: null, name: '', content: '', type: '' });
const isEdit = ref(false);
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 550,
  title: computed(() => isEdit.value ? '编辑话术' : '新增话术'),
  onCancel: () => editDrawerApi.close(),
  onConfirm: async () => {
    if (!editForm.name) return ElMessage.warning('请输入话术名称');
    if (!editForm.content) return ElMessage.warning('请输入话术内容');
    if (!editForm.type) return ElMessage.warning('请选择话术类型');
    // 仅新增时校验唯一；编辑时名称为禁用项无需重复校验
    if (!isEdit.value) {
      const isUnique = await checkNameUnique({ name: editForm.name });
      if (!isUnique) return ElMessage.warning('话术名称已存在');
    }
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

const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getWordingMgmtDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

const filterByType = (type) => {
  dataObj.searchObj = { ...dataObj.searchObj, type };
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByStatus = (status) => {
  dataObj.searchObj = { ...dataObj.searchObj, status };
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByName = (name) => {
  dataObj.searchObj = { ...dataObj.searchObj, name };
  dataObj.currentPage = 1;
  gridApi.query();
};

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
    newSearchObj.highMatchRate = true;
  }
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

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
