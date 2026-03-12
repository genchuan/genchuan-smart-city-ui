<script setup>
import { computed, reactive, ref } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import detailDrawer from './detail.vue';
import {
  dataList,
  textObj,
  useFormSchema,
  useRuleItemFormSchema,
  getGridColumnsByTab,
  ruleTypeList,
  indexSystemList,
  indexItemList,
  statusList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'data-change']);

// ==================== 数据定义 ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

const checkedIds = ref([]);
const filterSystem = ref('');
const filterStatus = ref('');
const searchParams = ref({});
const formData = ref();
const ruleItemFormData = ref();
const activeName = ref('全部');
const detailRef = ref(null);

// ==================== computed ====================
const getTitle = computed(() => {
  return formData.value?.ruleCategoryId ? textObj.editText : textObj.addText;
});

const getRuleItemTitle = computed(() => {
  return ruleItemFormData.value?.ruleItemId ? '编辑规则项' : textObj.addRuleItemText;
});

const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '停用' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter(v => v.statusName === item.label).length;
  }
  return `${item.label} (${count})`;
};

// 图表数据计算（删除否决项总数）
const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const enabled = list.filter(v => v.statusName === '启用').length;
  const totalRuleItems = list.reduce((acc, v) => acc + (v.itemCount || 0), 0);

  const cardList = [
    { title: '总分类数', value: total, color: '#13ce66' },
    { title: '规则项总数', value: totalRuleItems, color: '#4ECDC4' },
    { title: '启用规则数', value: enabled, color: '#FFC107' }
  ];

  const systemMap = {};
  list.forEach(v => { systemMap[v.systemName] = (systemMap[v.systemName] || 0) + 1; });
  const pieData1 = Object.entries(systemMap).map(([name, value]) => ({ name, value }));

  const statusMap = {};
  list.forEach(v => { statusMap[v.statusName] = (statusMap[v.statusName] || 0) + 1; });
  const pieData2 = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const topCategories = list.slice(0, 8);
  const barData = {
    xData: topCategories.map(v => v.name.length > 6 ? v.name.slice(0,6)+'...' : v.name),
    series: [{ name: '规则项数量', data: topCategories.map(v => v.itemCount || 0) }]
  };
  return { cardList, pieData1, pieData2, barData };
});

// ==================== 抽屉和表单配置 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
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

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  onConfirm() {
    const obj = formApi.form.values;
    // 唯一性校验：同一体系下名称不能重复
    const exists = dataObj.apilist.some(item =>
      item.systemId === obj.systemId &&
      item.name === obj.name &&
      item.ruleCategoryId !== (formData.value?.ruleCategoryId || '')
    );
    if (exists) {
      ElMessage.error('同一指标体系下规则分类名称已存在');
      return;
    }

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增
      obj.ruleCategoryId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      obj.systemName = indexSystemList.find(t => t.id === obj.systemId)?.name || '';
      obj.statusName = statusList.find(s => s.id === (obj.statusId || 's1'))?.name || '启用';
      obj.createByName = '当前用户';
      obj.createTime = new Date().toLocaleString();
      obj.updateByName = '当前用户';
      obj.updateTime = obj.createTime;
      obj.itemCount = 0;
      obj.ruleItems = [];
      obj.changeLog = '新建规则分类';
      dataObj.apilist.push(obj);
      dataObj.currentPage = 1;
    } else {
      // 编辑
      const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === formData.value?.ruleCategoryId);
      if (index !== -1) {
        const updated = { ...dataObj.apilist[index], ...obj };
        updated.systemName = indexSystemList.find(t => t.id === obj.systemId)?.name || '';
        updated.statusName = statusList.find(s => s.id === (obj.statusId || 's1'))?.name || '';
        updated.updateByName = '当前用户';
        updated.updateTime = new Date().toLocaleString();
        updated.changeLog = (updated.changeLog || '') + '；编辑更新';
        // 注意：ruleItems 保持不变，已在外部通过规则项操作修改
        dataObj.apilist[index] = updated;
      }
    }
    handleRefresh();
    emit('data-change');
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.ruleCategoryId) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 规则项表单
const [RuleItemForm, ruleItemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useRuleItemFormSchema(),
  showDefaultActions: false,
});

const [RuleItemDrawer, ruleItemDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { ruleItemDrawerApi.close(); },
  onConfirm() {
    const obj = ruleItemFormApi.form.values;
    const ruleCategoryId = ruleItemDrawerApi.sharedData.payload.ruleCategoryId;
    const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === ruleCategoryId);
    if (index !== -1) {
      if (ruleItemFormData.value?.ruleItemId) {
        // 编辑规则项
        const ruleItemIndex = dataObj.apilist[index].ruleItems.findIndex(ri => ri.ruleItemId === ruleItemFormData.value.ruleItemId);
        if (ruleItemIndex !== -1) {
          const updatedRuleItem = { ...dataObj.apilist[index].ruleItems[ruleItemIndex], ...obj };
          updatedRuleItem.indexName = indexItemList.find(i => i.id === obj.indexId)?.name || '';
          updatedRuleItem.ruleTypeName = ruleTypeList.find(r => r.id === obj.ruleTypeId)?.name || '';
          dataObj.apilist[index].ruleItems[ruleItemIndex] = updatedRuleItem;
        }
      } else {
        // 新增规则项
        obj.ruleItemId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        obj.indexName = indexItemList.find(i => i.id === obj.indexId)?.name || '';
        obj.ruleTypeName = ruleTypeList.find(r => r.id === obj.ruleTypeId)?.name || '';
        dataObj.apilist[index].ruleItems.push(obj);
        dataObj.apilist[index].itemCount += 1;
      }
      dataObj.apilist[index].updateByName = '当前用户';
      dataObj.apilist[index].updateTime = new Date().toLocaleString();
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；规则项更新';
    }
    handleRefresh();
    emit('data-change');
    ruleItemDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      ruleItemFormData.value = ruleItemDrawerApi.getData();
      if (ruleItemFormData.value?.ruleItemId) {
        await ruleItemFormApi.setValues(ruleItemFormData.value);
      } else {
        ruleItemFormApi.resetForm();
      }
    }
  },
});

// ==================== 函数定义 ====================
function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  const sheets = [
    {
      name: '规则分类',
      data: dataObj.apilist.map(c => ({
        '规则分类名称': c.name,
        '适用指标体系': c.systemName,
        '规则项数量': c.itemCount,
        '状态': c.statusName,
        '创建人': c.createByName,
        '创建时间': c.createTime,
        '变更日志': c.changeLog
      }))
    },
    {
      name: '规则项明细',
      data: dataObj.apilist.flatMap(c =>
        (c.ruleItems || []).map(item => ({
          '所属分类': c.name,
          '规则项名称': item.name,
          '关联指标项': item.indexName,
          '评分逻辑': item.scoreLogic,
          '满分值': item.fullScore,
          '权重': item.weight,
          '规则类型': item.ruleTypeName
        }))
      )
    }
  ];
  exportToExcel(sheets, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

function handleAddRuleItem(row) {
  ruleItemDrawerApi.setData({ title: textObj.addRuleItemText, ruleCategoryId: row.ruleCategoryId }).open();
}

// 在编辑抽屉中新增规则项
function handleAddRuleItemInEdit(category) {
  ruleItemDrawerApi.setData({ title: textObj.addRuleItemText, ruleCategoryId: category.ruleCategoryId }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

// 在编辑抽屉中编辑规则项
function handleEditRuleItemInEdit(category, ruleItem) {
  ruleItemDrawerApi.setData({ title: '编辑规则项', ...ruleItem, ruleCategoryId: category.ruleCategoryId }).open();
}

// 删除规则项
async function handleDeleteRuleItem(category, ruleItem) {
  await confirm(`确定删除规则项“${ruleItem.name}”吗？`);
  const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === category.ruleCategoryId);
  if (index !== -1) {
    const ruleItems = dataObj.apilist[index].ruleItems;
    const ruleIndex = ruleItems.findIndex(ri => ri.ruleItemId === ruleItem.ruleItemId);
    if (ruleIndex !== -1) {
      ruleItems.splice(ruleIndex, 1);
      dataObj.apilist[index].itemCount = ruleItems.length;
      dataObj.apilist[index].updateByName = '当前用户';
      dataObj.apilist[index].updateTime = new Date().toLocaleString();
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；删除规则项';
      ElMessage.success('删除成功');
      handleRefresh();
      emit('data-change');
    }
  }
}

async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该规则分类吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === row.ruleCategoryId);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '停用';
      dataObj.apilist[index].statusId = 's2';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；停用操作';
    }
    ElMessage.success('已停用');
    handleRefresh();
    emit('data-change');
  } finally {
    loadingInstance.close();
  }
}

async function handleEnable(row) {
  if (row.statusName !== '停用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该规则分类吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === row.ruleCategoryId);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '启用';
      dataObj.apilist[index].statusId = 's1';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；启用操作';
    }
    ElMessage.success('已启用');
    handleRefresh();
    emit('data-change');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const allowedCurrentStatus = targetStatus === '启用' ? '停用' : '启用';
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.ruleCategoryId) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.ruleCategoryId)) {
        item.statusName = targetStatus;
        item.statusId = targetStatus === '启用' ? 's1' : 's2';
        item.changeLog = (item.changeLog || '') + `；批量${targetStatus}`;
      }
    });
    checkedIds.value = [];
    ElMessage.success(`批量${targetStatus}成功`);
    handleRefresh();
    emit('data-change');
  } finally {
    loadingInstance.close();
  }
}

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.ruleCategoryId);
}

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const handleSystemClick = (system) => {
  filterSystem.value = filterSystem.value === system ? '' : system;
  gridApi.query();
};

const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

const handleCancelSystemFilter = () => {
  filterSystem.value = '';
  gridApi.query();
};

const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

// 搜索表单 schema
const searchSchema = useFormSchema().map(v => {
  delete v.rules;
  return { ...v };
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: searchSchema,
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

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  let filtered = dataObj.apilist.filter(v => {
    if (activeName.value === '全部') return true;
    return v.statusName === activeName.value;
  });

  const params = searchParams.value;
  if (Object.keys(params).length > 0) {
    filtered = filtered.filter(item => {
      let match = true;
      if (params.name && !item.name.includes(params.name)) match = false;
      if (params.systemId && item.systemId !== params.systemId) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      return match;
    });
  }

  if (filterSystem.value) {
    filtered = filtered.filter(item => item.systemName === filterSystem.value);
  }
  if (filterStatus.value) {
    filtered = filtered.filter(item => item.statusName === filterStatus.value);
  }

  filtered.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));

  dataObj.total = filtered.length;
  dataObj.list = filtered.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

const gridColumns = ref(getGridColumnsByTab('全部'));

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'ruleCategoryId', isHover: true },
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

const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  detailRef.value.open();
};

const handleClick = () => {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
  gridApi.query();
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

// 获取当前编辑分类的规则项（实时数据）
const currentRuleItems = computed(() => {
  if (!formData.value?.ruleCategoryId) return [];
  const category = dataObj.apilist.find(c => c.ruleCategoryId === formData.value.ruleCategoryId);
  return category?.ruleItems || [];
});

defineExpose({
  dataList: dataObj.apilist
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle" class="genchuan-detail-drawer">
      <Form />
      <!-- 规则项管理区域（仅在编辑时显示） -->
      <div v-if="formData?.ruleCategoryId" class="rule-items-section" style="margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0; font-size: 14px; color: #1f2f3d;">规则项列表</h4>
          <el-button type="primary" size="small" @click="handleAddRuleItemInEdit(formData)">新增规则项</el-button>
        </div>
        <el-table :data="currentRuleItems" border size="small" style="width: 100%;" max-height="300">
          <el-table-column prop="name" label="规则项名称" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="indexName" label="关联指标项" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="scoreLogic" label="评分逻辑" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fullScore" label="满分值" width="80"></el-table-column>
          <el-table-column prop="weight" label="权重" width="80"></el-table-column>
          <el-table-column prop="ruleTypeName" label="规则类型" width="100"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEditRuleItemInEdit(formData, row)">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteRuleItem(formData, row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </FormDrawer>

    <RuleItemDrawer :title="getRuleItemTitle">
      <RuleItemForm />
    </RuleItemDrawer>

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
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <el-tag
            v-if="filterSystem"
            type="primary"
            closable
            @close="handleCancelSystemFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用指标体系：{{ filterSystem }}
          </el-tag>
          <el-tag
            v-if="filterStatus"
            type="warning"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            状态：{{ filterStatus }}
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
      <template #name="{ row }">
        <el-text
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
        >
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
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton v-if="activeName === '全部'" content="新增规则项" icon-name="Plus" @click="handleAddRuleItem(row)" />
          <IconButton
            v-if="row.statusName === '启用'"
            content="停用"
            icon-name="close"
            color="#F56C6C"
            @click="handleDisable(row)"
          />
          <IconButton
            v-if="row.statusName === '停用'"
            content="启用"
            icon-name="check"
            color="#67C23A"
            @click="handleEnable(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：规则分类数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：规则分类总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
