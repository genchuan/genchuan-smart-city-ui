<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAllPage,
  getStatusCount,
  createIndexSystem,
  updateIndexSystem,
  deleteIndexSystem,
  getIndexSystemDetail,
  exportIndexSystem,
  getObjectTypeSimpleList,
  getStatusSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/indicators.js';
import detailDrawer from './detail.vue';
import {
  textObj,
  useFormSchema,
  useQuerySchema,
  getGridColumnsByTab,
  objectTypeList,
  statusList,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 搜索参数
const searchParams = ref({});

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

// 表单实例
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

// 新增/编辑抽屉
const formData = ref();
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const validateResult = await formApi.validate();
    if (!validateResult.valid) return;

    const values = formApi.form.values;
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;
    const isEdit = !!id;

    const loadingInstance = ElLoading.service({ text: isEdit ? '更新中...' : '创建中...' });
    try {
      if (!isEdit) {
        await createIndexSystem({ ...values, statusId: 1 });
        ElMessage.success('新增成功');
      } else {
        await updateIndexSystem({ id, ...values });
        ElMessage.success('编辑成功');
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
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
        if (formDrawerApi.sharedData.payload?.title === textObj.versionText) {
          const source = formDrawerApi.sharedData.payload.source;
          if (source) {
            await formApi.setValues({
              ...source,
              id: undefined,
              version: '',
              statusId: 1,
            });
          }
        }
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 获取状态计数（用于 tabs） */
async function fetchStatusCount() {
  try {
    const res = await getStatusCount();
    // 假设返回 { status1Count: 4, status2Count: 1, totalCount: 5 }
    tabsData.value[0].count = res.totalCount || 0;
    tabsData.value[1].count = res.status1Count || 0;
    tabsData.value[2].count = res.status2Count || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
  }
}

/** 格式化列表数据（日期、默认值等） */
function formatList(list) {
  return (list || []).map(item => ({
    ...item,
    bizCreateTime: item.bizCreateTime ? dayjs(item.bizCreateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    lastUseTime: item.lastUseTime ? dayjs(item.lastUseTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    useCount: item.useCount ?? 0,
    categoryCount: item.categoryCount ?? 0,
    itemCount: item.itemCount ?? 0,
    desc: item.desc || '-',
    changeLogShort: item.changeLogShort || '-',
    threshold: item.threshold ?? '-',
    categoryWeight: item.categoryWeight ?? '-',
    itemWeight: item.itemWeight ?? '-',
  }));
}

/** 获取表格数据 */
const dataObj = reactive({
  totalShow: false,
  total: 0,
  list: [],
  garageDetail: {},
});

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
    const res = await getAllPage(params);
    const { list, total } = res;
    dataObj.list = formatList(list);
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    console.error('表格数据获取失败', error);
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumnsByTab('全部'),
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

// 搜索表单
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
    },
  },
});

function onSubmit(values) {
  const cleaned = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== '' && v != null)
  );
  searchParams.value = cleaned;
  drawerApi.close();
  handleRefresh();
}

// 标签页
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部', name: '全部', count: 0 },
  { label: '启用', name: '启用', count: 0 },
  { label: '停用', name: '停用', count: 0 },
]);

const createLabel = (item) => `${item.label} (${item.count})`;

const handleTabChange = () => {
  gridApi.setGridOptions({ columns: getGridColumnsByTab(activeName.value) });
  handleRefresh();
};

// 操作按钮
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

function handleNewVersion(row) {
  formDrawerApi.setData({ title: textObj.versionText, source: row }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

async function handleDisable(row) {
  if (row.statusId !== 1) {
    ElMessage.warning('当前状态不是启用，不能执行停用操作');
    return;
  }
  await confirm('确定停用该指标体系吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await updateIndexSystem({ id: row.id, statusId: 2 });
    ElMessage.success('已停用');
    emit('refresh-chart');
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
  await confirm('确定启用该指标体系吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await updateIndexSystem({ id: row.id, statusId: 1 });
    ElMessage.success('已启用');
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

async function handleDelete(row) {
  await confirm('确定删除该指标体系吗？');
  const loadingInstance = ElLoading.service({ text: '删除中...' });
  try {
    await deleteIndexSystem(row.id);
    ElMessage.success('删除成功');
    emit('refresh-chart');
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更（停用/启用） */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  await confirm(`确定将选中的对象${targetStatus}吗？`);

  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    if (targetStatus === '启用') return row?.statusId === 2;
    else return row?.statusId === 1;
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的对象中没有可操作的数据');
    return;
  }

  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    await Promise.all(validIds.map(id => updateIndexSystem({ id, statusId: targetStatusId })));
    ElMessage.success(`批量${targetStatus}成功`);
    emit('refresh-chart');
    checkedIds.value = [];
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

// 选中 ID
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

/** 导出（调用后端接口，下载 Excel） */
async function handleExport() {
  const params = {
    ...searchParams.value,
    ...(activeName.value !== '全部' && { statusId: activeName.value === '启用' ? 1 : 2 }),
  };
  const loadingInstance = ElLoading.service({ text: '导出中...' });
  try {
    const blob = await exportIndexSystem(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `指标体系_${activeName.value}_${dayjs().format('YYYYMMDD')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

/** 批量导出选中行（多 sheet Excel） */
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }

  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  if (!selectedRows.length) {
    ElMessage.warning('选中的数据不在当前页，请刷新后重试');
    return;
  }

  const loading = ElLoading.service({ text: '正在生成导出文件...' });
  const wb = XLSX.utils.book_new();
  const allColumns = getGridColumnsByTab(activeName.value);
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
      let sheetName = (row.name || `体系_${row.id}`).replace(/[\\/:*?"<>|]/g, '_');
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 28) + '...';
      let finalSheetName = sheetName;
      let counter = 1;
      while (wb.SheetNames.includes(finalSheetName)) {
        finalSheetName = `${sheetName}_${counter}`;
        counter++;
      }
      XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
    }

    if (!wb.SheetNames.length) {
      ElMessage.warning('没有有效数据可导出');
      return;
    }

    const fileName = `批量导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('批量导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loading.close();
  }
}

/** 详情抽屉 */
const detailRef = ref(null);
async function handleGarageOpenDetail(row) {
  const loadingInstance = ElLoading.service({ text: '加载详情中...' });
  try {
    const res = await getIndexSystemDetail(row.id);
    console.log('详情接口返回:', res);

    // 根据实际接口结构调整：假设返回结构为 { data: { baseInfo, categories } } 或直接 data 为详情对象
    const detailData = res.data || {};
    const baseInfo = detailData.baseInfo || detailData;
    const categories = detailData.categories || [];

    dataObj.garageDetail = {
      // 基本信息
      name: baseInfo.name,
      code: baseInfo.code,
      objectTypeName: baseInfo.objectTypeName,
      version: baseInfo.version,
      desc: baseInfo.desc,
      categoryCount: baseInfo.categoryCount ?? 0,
      itemCount: baseInfo.itemCount ?? 0,
      statusName: baseInfo.statusName,
      // 人员与时间
      createUserName: baseInfo.createByName || baseInfo.createUserName || '-',
      createTime: baseInfo.createTime ? dayjs(baseInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      updateUserName: baseInfo.updateByName || baseInfo.updateUserName || '-',
      updateTime: baseInfo.updateTime ? dayjs(baseInfo.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      // 可选字段
      lastUseTime: baseInfo.lastUseTime ? dayjs(baseInfo.lastUseTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
      useCount: baseInfo.useCount,
      changeLog: baseInfo.changeLog || '-',
      // 分类及指标项
      categories: categories.map(cat => ({
        categoryId: cat.id || cat.categoryId,
        name: cat.name,
        weight: cat.weight,
        sortNo: cat.sortNo,
        items: (cat.items || []).map(item => ({
          name: item.name,
          indexTypeName: item.indexTypeName,
          calcWayName: item.calcWayName,
          threshold: item.threshold,
          weight: item.weight,
        })),
      })),
    };
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error(`获取详情失败，将显示基本信息`);
    // 后备数据：直接从行数据中提取已有字段
    dataObj.garageDetail = {
      name: row.name,
      code: row.code,
      objectTypeName: row.objectTypeName,
      version: row.version,
      desc: row.desc,
      categoryCount: row.categoryCount ?? 0,
      itemCount: row.itemCount ?? 0,
      statusName: row.statusName,
      createUserName: row.createUserName,
      createTime: row.bizCreateTime,
      updateUserName: row.updateUserName,
      updateTime: row.updateTime,
      lastUseTime: row.lastUseTime,
      useCount: row.useCount,
      changeLog: row.changeLog || '-',
      categories: [], // 无分类数据
    };
  } finally {
    loadingInstance.close();
    detailRef.value.open(); // 确保无论成功失败都打开抽屉
  }
}

// 钻取筛选
const handleFieldClick = (fieldName, value, displayValue) => {
  if (fieldName === 'objectTypeId' || fieldName === 'statusId') {
    searchParams.value = { ...searchParams.value, [fieldName]: value };
    if (fieldName === 'objectTypeId') searchParams.value.objectTypeName_display = displayValue;
    if (fieldName === 'statusId') searchParams.value.statusName_display = displayValue;
  } else {
    searchParams.value = { ...searchParams.value, [fieldName]: value };
  }
  handleRefresh();
};

const handleClearField = (fieldName) => {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  if (fieldName === 'objectTypeId') delete newParams.objectTypeName_display;
  if (fieldName === 'statusId') delete newParams.statusName_display;
  searchParams.value = newParams;
  handleRefresh();
};

// 工具栏按钮
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

onMounted(() => {
  handleRefresh();
  fetchStatusCount();
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <detailDrawer
      ref="detailRef"
      :detail-obj="dataObj.garageDetail"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

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
            v-if="searchParams.code"
            type="primary"
            closable
            @close="handleClearField('code')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            体系编码：{{ searchParams.code }}
          </el-tag>
          <el-tag
            v-if="searchParams.objectTypeId && searchParams.objectTypeName_display"
            type="success"
            closable
            @close="handleClearField('objectTypeId')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用对象类型：{{ searchParams.objectTypeName_display }}
          </el-tag>
          <el-tag
            v-if="searchParams.statusId && searchParams.statusName_display"
            type="warning"
            closable
            @close="handleClearField('statusId')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            状态：{{ searchParams.statusName_display }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部标签按钮 -->
          <template v-if="activeName === '全部'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton
              content="批量停用"
              icon-name="close"
              color="#F56C6C"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchStatusChange"
            />
          </template>

          <!-- 启用/停用标签按钮 -->
          <template v-else>
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton
              content="批量导出"
              icon-name="download"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchExport"
            />
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
          </template>

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
      <template #code="{ row }">
        <el-text @click="handleFieldClick('code', row.code)" class="common-align" type="primary">
          {{ row.code }}
        </el-text>
      </template>
      <template #objectTypeName="{ row }">
        <el-text
          @click="handleFieldClick('objectTypeId', row.objectTypeId, row.objectTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.objectTypeName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-text
          @click="handleFieldClick('statusId', row.statusId, row.statusName)"
          class="common-align"
          type="primary"
        >
          {{ row.statusName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton v-if="activeName !== '停用'" content="新增版本" icon-name="DocumentCopy" @click="handleNewVersion(row)" />
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
          <!-- 如需删除按钮可取消注释 -->
          <!-- <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" /> -->
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：指标项数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusId === 1).length }}，停用{{ dataObj.list.filter(v => v.statusId === 2).length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：指标项总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
