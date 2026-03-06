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
  useVetoItemFormSchema,
  getGridColumnsByTab,
  objectTypeList,
  ruleTypeList,
  indexSystemList,
  indexItemList,
  userList,
  statusList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => {
  return formData.value?.ruleCategoryId ? textObj.editText : textObj.addText;
});

const getRuleItemTitle = computed(() => {
  return ruleItemFormData.value?.ruleItemId ? '编辑规则项' : textObj.addRuleItemText;
});

const getVetoItemTitle = computed(() => {
  return vetoItemFormData.value?.vetoItemId ? '编辑否决项' : textObj.addVetoItemText;
});

// 搜索参数
const searchParams = ref({});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

const formData = ref();
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
      obj.vetoCount = 0;
      obj.ruleItems = [];
      obj.vetoItems = [];
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
        dataObj.apilist[index] = updated;
      }
    }
    handleRefresh();
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
const ruleItemFormData = ref();
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

// 否决项表单
const vetoItemFormData = ref();
const [VetoItemForm, vetoItemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useVetoItemFormSchema(),
  showDefaultActions: false,
});

const [VetoItemDrawer, vetoItemDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { vetoItemDrawerApi.close(); },
  onConfirm() {
    const obj = vetoItemFormApi.form.values;
    if (vetoItemDrawerApi.sharedData.payload.ruleCategoryId) {
      // 关联到规则分类的否决项
      const ruleCategoryId = vetoItemDrawerApi.sharedData.payload.ruleCategoryId;
      const index = dataObj.apilist.findIndex(v => v.ruleCategoryId === ruleCategoryId);
      if (index !== -1) {
        if (vetoItemFormData.value?.vetoItemId) {
          // 编辑否决项
          const vetoItemIndex = dataObj.apilist[index].vetoItems.findIndex(vi => vi.vetoItemId === vetoItemFormData.value.vetoItemId);
          if (vetoItemIndex !== -1) {
            const updatedVetoItem = { ...dataObj.apilist[index].vetoItems[vetoItemIndex], ...obj };
            updatedVetoItem.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
            dataObj.apilist[index].vetoItems[vetoItemIndex] = updatedVetoItem;
          }
        } else {
          // 新增否决项
          obj.vetoItemId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
          obj.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
          dataObj.apilist[index].vetoItems.push(obj);
          dataObj.apilist[index].vetoCount += 1;
        }
        dataObj.apilist[index].updateByName = '当前用户';
        dataObj.apilist[index].updateTime = new Date().toLocaleString();
        dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；否决项更新';
      }
    } else {
      // 全局否决项
      // 这里可以添加全局否决项的逻辑
    }
    handleRefresh();
    vetoItemDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      vetoItemFormData.value = vetoItemDrawerApi.getData();
      if (vetoItemFormData.value?.vetoItemId) {
        await vetoItemFormApi.setValues(vetoItemFormData.value);
      } else {
        vetoItemFormApi.resetForm();
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

function handleAddRuleItem(row) {
  ruleItemDrawerApi.setData({ title: textObj.addRuleItemText, ruleCategoryId: row.ruleCategoryId }).open();
}

function handleAddVetoItem(row) {
  vetoItemDrawerApi.setData({ title: textObj.addVetoItemText, ruleCategoryId: row.ruleCategoryId }).open();
}

function handleAddGlobalVetoItem() {
  vetoItemDrawerApi.setData({ title: textObj.addVetoItemText }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
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
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.ruleCategoryId);
}

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

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// ==================== 新增钻取筛选变量 ====================
const filterSystem = ref('');
const filterStatus = ref('');

// 钻取点击处理函数
const handleSystemClick = (system) => {
  filterSystem.value = filterSystem.value === system ? '' : system;
  gridApi.query();
};
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 取消筛选标签
const handleCancelSystemFilter = () => {
  filterSystem.value = '';
  gridApi.query();
};
const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

// ==================== 修改 getTableData，加入钻取筛选 ====================
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

  // 钻取筛选
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

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return { ...v };
  }),
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

const activeName = ref('全部');
const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  detailRef.value.open();
};

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

const detailRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};

// 图表数据计算
const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const enabled = list.filter(v => v.statusName === '启用').length;
  const totalRuleItems = list.reduce((acc, v) => acc + (v.itemCount || 0), 0);
  const totalVetoItems = list.reduce((acc, v) => acc + (v.vetoCount || 0), 0);

  const cardList = [
    { title: '总分类数', value: total, color: '#13ce66' },
    { title: '规则项总数', value: totalRuleItems, color: '#4ECDC4' },
    { title: '否决项总数', value: totalVetoItems, color: '#FF6B6B' },
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
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <RuleItemDrawer :title="getRuleItemTitle">
      <RuleItemForm />
    </RuleItemDrawer>

    <VetoItemDrawer :title="getVetoItemTitle">
      <VetoItemForm />
    </VetoItemDrawer>

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
          <!-- 钻取筛选标签 -->
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
          <IconButton v-if="activeName === '全部'" content="新增否决项" icon-name="Plus" @click="handleAddGlobalVetoItem" />
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
      <!-- 列插槽：名称点击打开详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 新增钻取列插槽 -->
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
