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
  useCategoryFormSchema,
  useItemFormSchema,
  getGridColumnsByTab,
  indexSystemList,
  statusList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

// 当前编辑的分类或标准项数据
const currentCategory = ref(null);
const currentItem = ref(null);
const activeTab = ref('全部'); // 用于决定批量操作文案等

// 标准分类表单抽屉
const [CategoryForm, categoryFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useCategoryFormSchema(),
  showDefaultActions: false,
});

const [CategoryDrawer, categoryDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { categoryDrawerApi.close(); },
  onConfirm: async () => {
    const values = categoryFormApi.form.values;
    if (!values.name || !values.systemId) {
      ElMessage.warning('请填写必填项');
      return;
    }
    // 模拟保存
    const title = categoryDrawerApi.sharedData.payload?.title;
    if (title === textObj.addText) {
      // 新增
      const newCategory = {
        standardCategoryId: Date.now().toString(),
        name: values.name,
        systemId: values.systemId,
        systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
        statusId: 's1',
        statusName: '启用',
        createByName: '当前用户',
        createTime: new Date().toLocaleString(),
        updateByName: '当前用户',
        updateTime: new Date().toLocaleString(),
        itemCount: 0,
        items: [],
        changeLog: '新建分类'
      };
      dataObj.apilist.push(newCategory);
    } else if (title === textObj.editText) {
      // 编辑
      const index = dataObj.apilist.findIndex(c => c.standardCategoryId === currentCategory.value?.standardCategoryId);
      if (index !== -1) {
        dataObj.apilist[index] = {
          ...dataObj.apilist[index],
          ...values,
          systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
          updateByName: '当前用户',
          updateTime: new Date().toLocaleString(),
          changeLog: (dataObj.apilist[index].changeLog || '') + '；编辑分类'
        };
      }
    }
    handleRefresh();
    categoryDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const payload = categoryDrawerApi.sharedData.payload;
      if (payload?.title === textObj.editText && payload?.category) {
        currentCategory.value = payload.category;
        await categoryFormApi.setValues(payload.category);
      } else {
        currentCategory.value = null;
        categoryFormApi.resetForm();
      }
    }
  }
});

// 标准项表单抽屉
const [ItemForm, itemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useItemFormSchema(),
  showDefaultActions: false,
});

const [ItemDrawer, itemDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { itemDrawerApi.close(); },
  onConfirm: async () => {
    const values = itemFormApi.form.values;
    if (!values.grade || !values.scoreRange || !values.sortNo) {
      ElMessage.warning('请填写完整');
      return;
    }
    const categoryId = itemDrawerApi.sharedData.payload?.categoryId;
    const categoryIndex = dataObj.apilist.findIndex(c => c.standardCategoryId === categoryId);
    if (categoryIndex === -1) return;

    const category = dataObj.apilist[categoryIndex];
    const items = category.items || [];

    // 分数范围重叠校验
    const rangePattern = /^(≥?\d+|\d+-\d+|<=\d+|<\\d+)$/; // 简化校验，实际需解析
    const newRange = values.scoreRange;
    const overlap = items.some(item => item.standardItemId !== currentItem.value?.standardItemId && isRangeOverlap(item.scoreRange, newRange));
    if (overlap) {
      ElMessage.error('分数范围与现有标准项重叠，请调整');
      return;
    }

    if (currentItem.value) {
      // 编辑
      const itemIndex = items.findIndex(i => i.standardItemId === currentItem.value.standardItemId);
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...values, updateTime: new Date().toLocaleString() };
      }
    } else {
      // 新增
      const newItem = {
        standardItemId: `item_${Date.now()}_${Math.random()}`,
        ...values,
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString()
      };
      items.push(newItem);
    }
    // 按sortNo排序
    items.sort((a, b) => a.sortNo - b.sortNo);
    category.items = items;
    category.itemCount = items.length;
    category.changeLog = (category.changeLog || '') + `；${currentItem.value ? '编辑' : '新增'}标准项`;
    category.updateTime = new Date().toLocaleString();

    handleRefresh();
    itemDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const payload = itemDrawerApi.sharedData.payload;
      if (payload?.item) {
        currentItem.value = payload.item;
        await itemFormApi.setValues(payload.item);
      } else {
        currentItem.value = null;
        itemFormApi.resetForm();
      }
    }
  }
});

// 分数范围重叠辅助函数（简化版，仅演示逻辑）
function isRangeOverlap(range1, range2) {
  // 实际应解析范围，此处简单返回false避免阻塞演示
  return false;
}

// 搜索参数
const searchParams = ref({});
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

// 图表数据计算
const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const enabled = list.filter(v => v.statusName === '启用').length;
  const itemTotal = list.reduce((acc, v) => acc + (v.itemCount || 0), 0);

  const cardList = [
    { title: '总分类数', value: total, color: '#13ce66' },
    { title: '启用分类数', value: enabled, color: '#4ECDC4' },
    { title: '标准项总数', value: itemTotal, color: '#FFC107' }
  ];

  // 适用体系占比
  const systemMap = {};
  list.forEach(v => { systemMap[v.systemName] = (systemMap[v.systemName] || 0) + 1; });
  const pieData1 = Object.entries(systemMap).map(([name, value]) => ({ name, value }));

  // 标准等级分布（从items中统计）
  const gradeMap = {};
  list.forEach(cat => {
    cat.items?.forEach(item => {
      gradeMap[item.grade] = (gradeMap[item.grade] || 0) + 1;
    });
  });
  const pieData2 = Object.entries(gradeMap).map(([name, value]) => ({ name, value }));

  // 各分类标准项数量柱状图
  const topCategories = list.slice(0, 8);
  const barData = {
    xData: topCategories.map(v => v.name.length > 6 ? v.name.slice(0,6)+'...' : v.name),
    series: [{ name: '标准项数量', data: topCategories.map(v => v.itemCount || 0) }]
  };

  return { cardList, pieData1, pieData2, barData };
});

// 筛选相关（钻取）
const filterSystem = ref('');
const filterStatus = ref('');

const handleSystemClick = (systemName) => {
  filterSystem.value = filterSystem.value === systemName ? '' : systemName;
  gridApi.query();
};
const handleStatusClick = (statusName) => {
  filterStatus.value = filterStatus.value === statusName ? '' : statusName;
  gridApi.query();
};

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

// 搜索表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    { fieldName: 'name', label: '分类名称', component: 'Input' },
    {
      fieldName: 'systemId',
      label: '适用体系',
      component: 'Select',
      componentProps: {
        options: indexSystemList.map(s => ({ label: s.name, value: s.id }))
      }
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: statusList.map(s => ({ label: s.name, value: s.id }))
      }
    }
  ],
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

// 表格与抽屉API
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumnsByTab('全部'),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'standardCategoryId', isHover: true },
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

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

// 操作函数
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.standardCategoryId);
}

function handleRefresh() {
  gridApi.query();
}

function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  categoryDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  categoryDrawerApi.setData({ title: textObj.editText, category: row }).open();
}

function handleAddItem(row) {
  itemDrawerApi.setData({ title: textObj.addItemText, categoryId: row.standardCategoryId }).open();
}

function handleEditItem(row, item) {
  itemDrawerApi.setData({ title: textObj.editItemText, categoryId: row.standardCategoryId, item }).open();
}

async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该标准分类吗？');
  const index = dataObj.apilist.findIndex(v => v.standardCategoryId === row.standardCategoryId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '停用';
    dataObj.apilist[index].statusId = 's2';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；停用操作';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('已停用');
  handleRefresh();
}

async function handleEnable(row) {
  if (row.statusName !== '停用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该标准分类吗？');
  const index = dataObj.apilist.findIndex(v => v.standardCategoryId === row.standardCategoryId);
  if (index !== -1) {
    dataObj.apilist[index].statusName = '启用';
    dataObj.apilist[index].statusId = 's1';
    dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；启用操作';
    dataObj.apilist[index].updateTime = new Date().toLocaleString();
  }
  ElMessage.success('已启用');
  handleRefresh();
}

async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const allowedCurrentStatus = targetStatus === '启用' ? '停用' : '启用';
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.standardCategoryId) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  dataObj.apilist.forEach(item => {
    if (checkedIds.value.includes(item.standardCategoryId)) {
      item.statusName = targetStatus;
      item.statusId = targetStatus === '启用' ? 's1' : 's2';
      item.changeLog = (item.changeLog || '') + `；批量${targetStatus}`;
      item.updateTime = new Date().toLocaleString();
    }
  });
  checkedIds.value = [];
  ElMessage.success(`批量${targetStatus}成功`);
  handleRefresh();
}

// 标签页切换
const activeName = ref('全部');
const tabsData = ref([{ label: '全部' }, { label: '启用' }, { label: '停用' }]);
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
  gridApi.setGridOptions({ columns: getGridColumnsByTab(activeName.value) });
  gridApi.query();
};

// 其他UI控制
const detailRef = ref(null);
function handleGarageOpenDetail(row) {
  dataObj.garageDetail = row;
  detailRef.value.open();
}
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const changeTotalShow = () => dataObj.totalShow = !dataObj.totalShow;
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 分类抽屉 -->
    <CategoryDrawer :title="categoryDrawerApi.sharedData.payload?.title">
      <CategoryForm />
    </CategoryDrawer>

    <!-- 标准项抽屉 -->
    <ItemDrawer :title="itemDrawerApi.sharedData.payload?.title">
      <ItemForm />
    </ItemDrawer>

    <!-- 详情抽屉 -->
    <detailDrawer
      ref="detailRef"
      :detail-obj="dataObj.garageDetail"
    />

    <!-- 搜索抽屉 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 主表格 -->
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" @tab-change="handleClick">
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <!-- 钻取标签 -->
          <el-tag v-if="filterSystem" type="primary" closable @close="filterSystem=''; gridApi.query()" style="height:32px; line-height:32px">
            适用体系：{{ filterSystem }}
          </el-tag>
          <el-tag v-if="filterStatus" type="warning" closable @close="filterStatus=''; gridApi.query()" style="height:32px; line-height:32px">
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

      <!-- 列插槽：名称点击打开详情 -->
      <template #name="{ row }">
        <el-text @click="handleGarageOpenDetail(row)" class="common-align" type="primary">
          {{ row.name }}
        </el-text>
      </template>
      <!-- 适用体系点击钻取 -->
      <template #systemName="{ row }">
        <el-text @click="handleSystemClick(row.systemName)" class="common-align" type="primary">
          {{ row.systemName }}
        </el-text>
      </template>
      <!-- 状态点击钻取 -->
      <template #statusName="{ row }">
        <el-text @click="handleStatusClick(row.statusName)" class="common-align" type="primary">
          {{ row.statusName }}
        </el-text>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton v-if="activeName === '全部'" content="新增标准项" icon-name="Plus" @click="handleAddItem(row)" />
          <!-- 标准项列表内嵌快速编辑（示例：可再添加一个编辑标准项的入口，但为避免拥挤，此处省略，可在详情中编辑） -->
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
          <span>本页统计：分类数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：分类总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
