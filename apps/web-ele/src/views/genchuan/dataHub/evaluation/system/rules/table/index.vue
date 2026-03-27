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
  getRuleCategoryAllPage,
  getRuleStatusCount,
  updateRuleCategory,
  getRuleCategoryDetail,
  getIndexSystemSimpleList,
  getStatusSimpleList,
  deleteRuleCategory,
} from '#/api/genchuan/dataHub/evaluation/system/rules/index.js';
import detailDrawer from './detail.vue';
import RuleItemManager from '#/views/genchuan/dataHub/evaluation/system/components/RuleItemManager.vue';
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
const ruleItemList = ref([]);
const activeName = ref('全部');
const detailRef = ref(null);
const ruleItemManagerRef = ref(null);

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
function handleFieldClick(field, value, displayValue) {
  if (field === 'statusId') {
    // 状态钻取：切换到全部标签，设置状态筛选
    activeName.value = '全部';
    searchParams.value = {
      ...searchParams.value,
      statusId: value,
      statusName: displayValue,
    };
    // 清除可能存在的其他状态字段
    delete searchParams.value.statusIdInput;
  } else if (field === 'systemName') {
    // 适用指标体系钻取
    searchParams.value = {
      ...searchParams.value,
      systemName: value,
    };
    delete searchParams.value.systemId;
  }
  // 刷新表格
  handleRefresh();
}

function handleClearField(field) {
  const newParams = { ...searchParams.value };
  if (field === 'systemName') {
    delete newParams.systemName;
    delete newParams.systemId;
  } else if (field === 'status') {
    delete newParams.statusId;
    delete newParams.statusName;
  }
  searchParams.value = newParams;
  handleRefresh();
}

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

const loadFormOptions = async () => {
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
    console.error('加载下拉选项失败', error);
  }
};

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 800,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const basicValid = await formApi.validate();
    if (!basicValid.valid) return;

    const basicValues = formApi.form.values;
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;

    // 从 RuleItemManager 获取最新规则项数据
    const latestRuleItems = ruleItemManagerRef.value?.getItems() || ruleItemList.value;

    // 清理临时ID，并补充必填字段
    const cleanRuleItems = latestRuleItems.map(item => {
      const cleanedItem = { ...item };
      // 删除临时ID
      if (cleanedItem.id && cleanedItem.id.toString().startsWith('temp_')) {
        delete cleanedItem.id;
      }
      // 处理细则
      cleanedItem.details = (cleanedItem.details || []).map(detail => {
        const cleanedDetail = { ...detail };
        if (cleanedDetail.id && cleanedDetail.id.toString().startsWith('temp_')) {
          delete cleanedDetail.id;
        }
        if (item.id && !item.id.toString().startsWith('temp_')) {
          cleanedDetail.ruleId = item.id;
        } else {
          delete cleanedDetail.ruleId;
        }
        return cleanedDetail;
      });
      return cleanedItem;
    });

    // 构建 commentRules，补充 systemId、ruleCategoryId
    const commentRules = cleanRuleItems.map(item => {
      const ruleData = {
        id: item.id,
        ruleName: item.ruleName,
        applyObjectType: item.applyObjectType,
        effectiveStartTime: item.effectiveStartTime,
        effectiveEndTime: item.effectiveEndTime,
        details: item.details,
        status: item.status !== undefined ? item.status : 1,
        // 补充关联字段
        systemId: basicValues.systemId,
        ruleCategoryId: id,
      };

      // 对于已存在的规则项，保留原有的 itemId 和 ruleType（如果存在）
      if (item.id && !item.id.toString().startsWith('temp_')) {
        if (item.itemId) ruleData.itemId = item.itemId;
        if (item.ruleType) ruleData.ruleType = item.ruleType;
      } else {
        // 新增规则项：若后端要求必填，可设置为默认值；否则删除这两个字段
        // 这里假设后端已改为非必填，不传递
        // 如需传递默认值，取消下面注释
        // ruleData.itemId = 0;
        // ruleData.ruleType = 2; // 默认扣分
      }

      return ruleData;
    });

    // 构建完整 payload
    const payload = {
      name: basicValues.name,
      systemId: basicValues.systemId,
      statusId: basicValues.statusId,
      commentRules,
    };
    // 如果有 id 则传入，否则不传（让后端处理新增）
    if (id) payload.id = id;

    const loadingInstance = ElLoading.service({ text: id ? '更新中...' : '创建中...' });
    try {
      await updateRuleCategory(payload);
      ElMessage.success(id ? '编辑成功' : '新增成功');
      emit('data-change');
      handleRefresh();
      fetchStatusCount();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存规则分类失败', error);
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
        // 编辑模式：确保 systemId 为数字，避免与选项 value 类型不匹配导致显示编码
        const setData = { ...data };
        if (setData.systemId) setData.systemId = Number(setData.systemId);
        await formApi.setValues(setData);
        const loading = ElLoading.service({ text: '加载详情...', target: '.vben-drawer' });
        try {
          const detail = await getRuleCategoryDetail(data.id);
          ruleItemList.value = (detail.commentRules || []).map(rule => ({
            id: rule.id,
            ruleName: rule.ruleName,
            itemId: rule.itemId,
            itemName: rule.itemName,
            ruleType: rule.ruleType,
            ruleTypeName: rule.ruleType === 1 ? '加分' : '扣分',
            status: rule.status,
            applyObjectType: rule.applyObjectType,
            effectiveStartTime: rule.effectiveStartTime,
            effectiveEndTime: rule.effectiveEndTime,
            details: (rule.details || []).map(d => ({
              id: d.id,
              minValue: d.minValue,
              maxValue: d.maxValue,
              operatorMin: d.operatorMin,
              operatorMax: d.operatorMax,
              score: d.score,
              sortOrder: d.sortOrder,
              remark: d.remark,
            })),
          }));
        } catch (error) {
          ElMessage.error('加载规则项失败');
          ruleItemList.value = [];
        } finally {
          loading.close();
        }
      } else {
        // 新增模式
        formApi.resetForm();
        await formApi.setValues({ statusId: 1 });
        ruleItemList.value = [];
      }
    }
  },
});

// ==================== 表格数据获取 ====================
// 格式化列表数据（供表格和导出共用）
function formatList(list) {
  return (list || []).map(item => ({
    ...item,
    createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    lastUseTime: item.lastUseTime ? dayjs(item.lastUseTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    useCount: item.useCount ?? 0,
    itemCount: item.itemCount ?? 0,
    changeLog: item.changeLog || '-',
    createByName: item.createUserName,
    updateByName: item.updateUserName,
  }));
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
    const res = await getRuleCategoryAllPage(params);
    const { list, total } = res;
    dataObj.list = formatList(list);
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    console.error('获取规则分类列表失败', error);
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

// ==================== 状态计数 ====================
async function fetchStatusCount() {
  try {
    const res = await getRuleStatusCount();
    tabsData.value[0].count = res.totalCount || 0;
    tabsData.value[1].count = res.status1Count || 0;
    tabsData.value[2].count = res.status2Count || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
  }
}

// ==================== 操作函数 ====================
function handleRefresh() {
  gridApi.query();
}

// 普通导出（按当前查询条件导出全部数据，前端生成 Excel）
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
    const pageSize = 200; // 接口最大限制
    let hasMore = true;

    while (hasMore) {
      const params = { ...baseParams, pageNo, pageSize };
      const res = await getRuleCategoryAllPage(params);
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
    XLSX.utils.book_append_sheet(wb, ws, '规则分类');

    let fileName;
    switch (activeName.value) {
      case '停用':
        fileName = `停用规则分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
        break;
      case '启用':
        fileName = `启用规则分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
        break;
      default:
        fileName = `规则分类列表_${dayjs().format('YYYYMMDD')}.xlsx`;
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

// 批量导出（选中的行，每个规则分类生成一个 sheet）
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }

  // 获取当前页中选中的数据
  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  if (selectedRows.length === 0) {
    ElMessage.warning('选中的数据不在当前页，请刷新后重试');
    return;
  }

  const loading = ElLoading.service({ text: '正在生成导出文件...' });
  const wb = XLSX.utils.book_new();

  // 获取当前标签页的列配置
  const columns = getGridColumnsByTab(activeName.value);
  const exportColumns = columns.filter(
    col => col.field && col.type !== 'checkbox' && col.title !== '操作'
  ).map(col => ({ field: col.field, title: col.title }));

  try {
    for (const row of selectedRows) {
      // 构建单行数据对象
      const rowForSheet = {};
      exportColumns.forEach(col => {
        rowForSheet[col.title] = row[col.field] ?? '-';
      });
      const ws = XLSX.utils.json_to_sheet([rowForSheet]);

      // 处理 sheet 名称：使用规则分类名称，去除非法字符
      let sheetName = (row.name || `规则分类_${row.id}`).replaceAll(/[\\/:*?"<>|]/g, '_');
      if (sheetName.length > 31) sheetName = `${sheetName.slice(0, 28)}...`;
      let finalSheetName = sheetName;
      let counter = 1;
      while (wb.SheetNames.includes(finalSheetName)) {
        finalSheetName = `${sheetName}_${counter}`;
        counter++;
      }

      XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
    }

    if (wb.SheetNames.length === 0) {
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

function handleCreate() {
  formDrawerApi.setData({}).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ ...row }).open();
}

async function handleDelete(row) {
  await confirm(`确定删除规则分类“${row.name}”吗？`);
  const loadingInstance = ElLoading.service({ text: '删除中...' });
  try {
    await deleteRuleCategory(row.id);
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
  await ElMessageBox.confirm('确定停用该规则分类吗？', '提示', { type: 'warning' });
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await updateRuleCategory({ id: row.id, statusId: 2 });
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
  await ElMessageBox.confirm('确定启用该规则分类吗？', '提示', { type: 'warning' });
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await updateRuleCategory({ id: row.id, statusId: 1 });
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
  await ElMessageBox.confirm(`确定将选中的对象${targetStatus}吗？`, '提示', { type: 'warning' });

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
    await Promise.all(validIds.map(id => updateRuleCategory({ id, statusId: targetStatusId })));
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

// 详情抽屉
async function handleGarageOpenDetail(row) {
  const loadingInstance = ElLoading.service({ text: '加载详情中...' });
  try {
    const res = await getRuleCategoryDetail(row.id);
    dataObj.garageDetail = {
      ...row,
      ruleItems: (res.commentRules || []).map(rule => ({
        id: rule.id,
        ruleName: rule.ruleName,
        itemId: rule.itemId,
        itemName: rule.itemName,
        ruleType: rule.ruleType,
        ruleTypeName: rule.ruleType === 1 ? '加分' : '扣分',
        status: rule.status,
        applyObjectType: rule.applyObjectType,
        effectiveStartTime: rule.effectiveStartTime,
        effectiveEndTime: rule.effectiveEndTime,
        details: (rule.details || []).map(d => ({
          id: d.id,
          minValue: d.minValue,
          maxValue: d.maxValue,
          operatorMin: d.operatorMin,
          operatorMax: d.operatorMax,
          score: d.score,
          sortOrder: d.sortOrder,
          remark: d.remark,
        })),
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
const handleTabChange = () => {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
  handleRefresh();
};

// 规则项刷新回调
const handleRuleItemsRefresh = async () => {
  if (!formData.value?.id) return;
  const detail = await getRuleCategoryDetail(formData.value.id);
  ruleItemList.value = (detail.commentRules || []).map(rule => ({
    id: rule.id,
    ruleName: rule.ruleName,
    itemId: rule.itemId,
    itemName: rule.itemName,
    ruleType: rule.ruleType,
    ruleTypeName: rule.ruleType === 1 ? '加分' : '扣分',
    status: rule.status,
    applyObjectType: rule.applyObjectType,
    effectiveStartTime: rule.effectiveStartTime,
    effectiveEndTime: rule.effectiveEndTime,
    details: (rule.details || []).map(d => ({
      id: d.id,
      minValue: d.minValue,
      maxValue: d.maxValue,
      operatorMin: d.operatorMin,
      operatorMax: d.operatorMax,
      score: d.score,
      sortOrder: d.sortOrder,
      remark: d.remark,
    })),
  }));
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
    <!-- 新增/编辑抽屉 -->
    <FormDrawer :title="getTitle" class="genchuan-detail-drawer">
      <Form />
      <!-- 规则项管理区域（始终显示，因为可能新增规则项） -->
      <RuleItemManager
        ref="ruleItemManagerRef"
        v-if="formData?.id || ruleItemList.length > 0"
        v-model="ruleItemList"
        :category-id="formData?.id"
        @refresh="handleRuleItemsRefresh"
      />
    </FormDrawer>

    <!-- 详情抽屉 -->
    <detailDrawer
      ref="detailRef"
      :detail-obj="dataObj.garageDetail"
    />

    <!-- 搜索抽屉（输入框版本，无需 open-change 事件） -->
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

          <!-- 钻取筛选标签：适用指标体系 -->
          <el-tag
            v-if="searchParams.systemName"
            type="primary"
            closable
            @close="handleClearField('systemName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用指标体系：{{ searchParams.systemName }}
          </el-tag>

          <!-- 钻取筛选标签：状态 -->
          <el-tag
            v-if="searchParams.statusName"
            type="warning"
            closable
            @close="handleClearField('status')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
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
        <el-text @click="handleFieldClick('systemName', row.systemName, row.systemName)" class="common-align" type="primary">
          {{ row.systemName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-text @click="handleFieldClick('statusId', row.statusId, row.statusName)" class="common-align" type="primary">
          {{ row.statusName }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
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
          <span>本页统计：规则分类数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusId === 1).length }}，停用{{ dataObj.list.filter(v => v.statusId === 2).length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：规则分类总数{{ dataObj.total }}，启用{{ tabsData[1].count }}，停用{{ tabsData[2].count }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
