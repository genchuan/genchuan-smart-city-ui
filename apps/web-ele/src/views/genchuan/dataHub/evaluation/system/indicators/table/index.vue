<script setup>
import { computed, reactive, ref, onMounted, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage,ElMessageBox } from 'element-plus';
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
  saveFullIndexSystem,   // 新增的复合保存接口
  getObjectTypeSimpleList,
  getStatusSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/indicators';
import detailDrawer from './detail.vue';
import CategoryManager from '#/views/genchuan/dataHub/evaluation/system/components/CategoryManager.vue'; // 新增组件
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

// 基本信息表单实例
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

// 分类管理器引用
const categoryManagerRef = ref(null);
// 分类数据
const categoryData = ref([]);

// 新增/编辑抽屉
const formData = ref();

// 加载表单下拉选项的方法
const loadFormOptions = async () => {
  try {
    const [objectTypeOptions, statusOptions] = await Promise.all([
      getObjectTypeSimpleList(),
      getStatusSimpleList(),
    ]);

    // 确保返回的是数组，否则置空
    const objectOpts = Array.isArray(objectTypeOptions) ? objectTypeOptions : [];
    const statusOpts = Array.isArray(statusOptions) ? statusOptions : [];

    await formApi.updateSchema([
      {
        fieldName: 'objectTypeId',
        componentProps: { options: objectOpts },
      },
      {
        fieldName: 'statusId',
        componentProps: { options: statusOpts },
      },
    ]);
  } catch (error) {
    console.error('加载下拉选项失败', error);
    ElMessage.error('加载下拉选项失败，请重试');
    // 失败时置空选项，避免显示旧数据
    await formApi.updateSchema([
      { fieldName: 'objectTypeId', componentProps: { options: [] } },
      { fieldName: 'statusId', componentProps: { options: [] } },
    ]);
  }
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 1000, // 加宽以适应分类配置
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    // 保存逻辑
    const basicValid = await formApi.validate();
    if (!basicValid.valid) return;

    // 校验分类管理器
    if (!categoryManagerRef.value?.validate()) {
      return;
    }

    const basicValues = formApi.form.values;
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;

    // 组装完整数据
    const fullData = {
      ...basicValues,
      systemId: drawerData.systemId, // 编辑时可能已有 systemId
      categories: categoryData.value,
    };

    const loadingInstance = ElLoading.service({ text: id ? '更新中...' : '创建中...' });
    try {
      // 调用复合保存接口（若后端无此接口，请替换为分步保存逻辑）
      await saveFullIndexSystem(fullData);
      ElMessage.success(id ? '编辑成功' : '新增成功');
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
      // 先加载下拉选项
      await loadFormOptions();

      const data = formDrawerApi.getData();
      formData.value = data;

      if (data?.id) {
        // 编辑模式：先设置基本信息
        await formApi.setValues(data);
        // 如果有 systemId，则加载详情获取分类数据
        if (data.systemId) {
          const loading = ElLoading.service({ text: '加载详情...', target: '.vben-drawer' });
          try {
            const detail = await getIndexSystemDetail(data.systemId);
            // 将 detail.categories 转换为分类管理器需要的格式
            categoryData.value = (detail.categories || []).map(cat => ({
              categoryId: cat.categoryId,
              name: cat.name,
              weight: cat.weight,
              sortNo: cat.sortNo,
              items: (cat.items || []).map(item => ({
                itemId: item.itemId,
                name: item.name,
                indexType: item.indexTypeName,
                calcWay: item.calcWayName,
                threshold: item.threshold,
                weight: item.weight,
                sortNo: item.sortNo,
              })),
            }));
          } catch (error) {
            ElMessage.error('加载分类数据失败');
            categoryData.value = [];
          } finally {
            loading.close();
          }
        } else {
          categoryData.value = [];
        }
      } else {
        // 新增模式：清空表单和分类数据
        formApi.resetForm();
        // 设置默认状态为启用
        await formApi.setValues({ statusId: 1 });
        categoryData.value = [];

        // 如果是新增版本，需要处理从上一版本复制数据
        if (formDrawerApi.sharedData?.payload?.title === textObj.versionText) {
          const source = formDrawerApi.sharedData.payload.source;
          if (source && source.systemId) {
            const loading = ElLoading.service({ text: '加载源体系数据...', target: '.vben-drawer' });
            try {
              const detail = await getIndexSystemDetail(source.systemId);
              // 填充基本信息
              await formApi.setValues({
                name: detail.baseInfo.name,
                code: detail.baseInfo.code,
                objectTypeId: source.objectTypeId, // 从源行数据中取，因为 detail.baseInfo 可能没有ID
                version: '', // 版本号清空，让用户重新输入
                desc: detail.baseInfo.description,
                statusId: 1,
              });
              // 填充分类数据
              categoryData.value = (detail.categories || []).map(cat => ({
                categoryId: `temp_${Date.now()}_${Math.random()}`, // 临时ID
                name: cat.name,
                weight: cat.weight,
                sortNo: cat.sortNo,
                items: (cat.items || []).map(item => ({
                  itemId: `temp_${Date.now()}_${Math.random()}`,
                  name: item.name,
                  indexType: item.indexTypeName,
                  calcWay: item.calcWayName,
                  threshold: item.threshold,
                  weight: item.weight,
                  sortNo: item.sortNo,
                })),
              }));
            } catch (error) {
              ElMessage.error('加载源体系数据失败');
            } finally {
              loading.close();
            }
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
    tabsData.value[0].count = res.totalCount || 0;
    tabsData.value[1].count = res.status1Count || 0;
    tabsData.value[2].count = res.status2Count || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
  }
}

/** 格式化列表数据 */
function formatList(list) {
  return (list || []).map(item => ({
    ...item,
    createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
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
  // 将源行数据通过 sharedData 传递给弹窗
  formDrawerApi.setData({ title: textObj.versionText }).open({
    payload: { title: textObj.versionText, source: row },
  });
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

async function handleDisable(row) {
  if (row.statusId !== 1) {
    ElMessage.warning('当前状态不是启用，不能执行停用操作');
    return;
  }
  await ElMessageBox.confirm('确定停用该指标体系吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
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
  await ElMessageBox.confirm('确定启用该指标体系吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
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
  await ElMessageBox.confirm('确定删除该指标体系吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
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

/** 批量状态变更 */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  await ElMessageBox.confirm(`确定将选中的对象${targetStatus}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

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

/** 普通导出（按当前搜索条件，导出全部）- 前端生成 Excel */
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '正在获取数据...' });
  try {
    // 构建查询参数（包含搜索条件 + 状态筛选）
    const params = {
      ...searchParams.value,
      pageNo: 1,
      pageSize: 1000, // 每页大小，可根据后端限制调整
    };
    if (activeName.value !== '全部') {
      params.statusId = activeName.value === '启用' ? 1 : 2;
    }

    let allData = [];
    let pageNo = 1;
    let hasMore = true;

    // 循环获取所有数据
    while (hasMore) {
      params.pageNo = pageNo;
      const res = await getAllPage(params);
      const { list, total } = res;
      if (list && list.length > 0) {
        // 格式化当前页数据
        const formattedList = formatList(list);
        allData = allData.concat(formattedList);
        pageNo++;
        // 如果当前页数据小于 pageSize，说明是最后一页
        if (list.length < params.pageSize) {
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

    // 获取当前标签页对应的表格列配置，并过滤掉不需要导出的列
    const allColumns = getGridColumnsByTab(activeName.value);
    const exportColumns = allColumns.filter(
      col => col.field && col.type !== 'checkbox' && col.title !== '操作'
    ).map(col => ({ field: col.field, title: col.title }));

    // 构建 Excel 数据：表头 + 数据行
    const wsData = [];
    // 添加表头（按表格列顺序）
    wsData.push(exportColumns.map(col => col.title));
    // 添加数据行
    allData.forEach(item => {
      const row = exportColumns.map(col => item[col.field] ?? '-');
      wsData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '指标体系');

    // 根据当前标签生成文件名（去除无关的 areaName 字段）
    let fileName;
    if (activeName.value === '全部') {
      fileName = `指标体系列表_${dayjs().format('YYYYMMDD')}.xlsx`;
    } else if (activeName.value === '启用') {
      fileName = `启用指标体系_${dayjs().format('YYYYMMDD')}.xlsx`;
    } else if (activeName.value === '停用') {
      fileName = `停用指标体系_${dayjs().format('YYYYMMDD')}.xlsx`;
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

/** 批量导出选中行（前端生成多 sheet Excel） */
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

  // 获取当前标签页对应的表格列配置
  const allColumns = getGridColumnsByTab(activeName.value);
  const exportColumns = allColumns.filter(
    col => col.field && col.type !== 'checkbox' && col.title !== '操作'
  ).map(col => ({ field: col.field, title: col.title }));

  try {
    for (const row of selectedRows) {
      const formattedItem = row; // 已通过 formatList 处理

      // 构建单条数据对象（key 为中文表头）
      const rowForSheet = {};
      exportColumns.forEach(col => {
        rowForSheet[col.title] = formattedItem[col.field] ?? '-';
      });

      const ws = XLSX.utils.json_to_sheet([rowForSheet]);

      // 生成 sheet 名称（避免重复和过长）
      let sheetName = (formattedItem.name || `体系_${formattedItem.id}`).replace(/[\\/:*?"<>|]/g, '_');
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
    const res = await getIndexSystemDetail(row.systemId);
    console.log('详情接口返回:', res);
    const baseInfo = res.baseInfo || {};
    const categories = res.categories || [];

    // 计算分类总数和指标项总数（优先从 categories 计算）
    const categoryCount = categories.length;
    const itemCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

    dataObj.garageDetail = {
      name: baseInfo.name || row.name || '-',
      code: baseInfo.code || row.code || '-',
      objectTypeName: baseInfo.objectTypeName || row.objectTypeName || '-',
      version: baseInfo.version || row.version || '-',
      desc: baseInfo.description || row.desc || '-',
      statusName: baseInfo.statusName || row.statusName || '-',
      categoryCount: categoryCount || row.categoryCount || 0,
      itemCount: itemCount || row.itemCount || 0,
      createUserName: baseInfo.createUserName || row.createUserName || '-',
      createTime: baseInfo.createTime
        ? dayjs(baseInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
        : (row.createTime || '-'),
      updateUserName: baseInfo.updateUserName || row.updateUserName || '-',
      updateTime: baseInfo.updateTime
        ? dayjs(baseInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')
        : (row.updateTime || '-'),
      lastUseTime: row.lastUseTime || undefined,
      useCount: row.useCount ?? 0,
      changeLogShort: row.changeLogShort || '-',
      categories: categories.map(cat => ({
        categoryId: cat.categoryId,
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
      createTime: row.createTime,
      updateUserName: row.updateUserName,
      updateTime: row.updateTime,
      lastUseTime: row.lastUseTime,
      useCount: row.useCount,
      changeLog: row.changeLog || '-',
      categories: [],
    };
  } finally {
    loadingInstance.close();
    detailRef.value.open();
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
    <!-- 新增/编辑抽屉，宽度加大，包含分类管理器 -->
    <FormDrawer :title="getTitle" class="genchuan-detail-drawer">
      <Form />
      <CategoryManager ref="categoryManagerRef" v-model="categoryData" />
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
          <template v-if="activeName === '全部'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <IconButton
              content="批量导出"
              icon-name="download"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchExport"
            />
            <IconButton
              content="批量停用"
              icon-name="close"
              color="#F56C6C"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchStatusChange"
            />
          </template>

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
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
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
