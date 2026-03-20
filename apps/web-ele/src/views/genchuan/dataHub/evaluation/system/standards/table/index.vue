<script setup>
import { computed, reactive, ref, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
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

// 当前编辑的分类或指标数据
const currentCategory = ref(null);
const currentItem = ref(null);
const activeTab = ref('全部');

// 临时存储当前编辑分类下的指标列表（用于分类抽屉内管理）
const currentCategoryItems = ref([]);

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

    // 校验同一体系内名称唯一性
    const existing = dataObj.apilist.find(c =>
      c.systemId === values.systemId && c.name === values.name &&
      c.standardCategoryId !== currentCategory.value?.standardCategoryId
    );
    if (existing) {
      ElMessage.error('该体系下已存在同名分类');
      return;
    }

    const title = categoryDrawerApi.sharedData.payload?.title;
    if (title === textObj.addText) {
      // 新增分类
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
        itemCount: currentCategoryItems.value.length,
        items: currentCategoryItems.value.map(item => ({
          ...item,
          indicatorId: item.indicatorId || `ind_${Date.now()}_${Math.random()}`
        })),
        changeLog: '新建分类'
      };
      dataObj.apilist.push(newCategory);
    } else if (title === textObj.editText) {
      // 编辑分类
      const index = dataObj.apilist.findIndex(c => c.standardCategoryId === currentCategory.value?.standardCategoryId);
      if (index !== -1) {
        dataObj.apilist[index] = {
          ...dataObj.apilist[index],
          name: values.name,
          systemId: values.systemId,
          systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
          statusId: values.statusId || 's1',
          statusName: values.statusId === 's2' ? '停用' : '启用',
          updateByName: '当前用户',
          updateTime: new Date().toLocaleString(),
          itemCount: currentCategoryItems.value.length,
          items: currentCategoryItems.value,
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
        // 深拷贝指标列表到临时列表
        currentCategoryItems.value = payload.category.items ? JSON.parse(JSON.stringify(payload.category.items)) : [];
      } else {
        currentCategory.value = null;
        categoryFormApi.resetForm();
        currentCategoryItems.value = [];
      }
    }
  }
});

// 指标项表单抽屉（用于在分类抽屉内新增/编辑指标）
const [ItemForm, itemFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'name',
      label: '指标名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入指标名称' },
    },
    {
      fieldName: 'weight',
      label: '权重',
      component: 'InputNumber',
      rules: 'required',
      componentProps: { placeholder: '请输入权重', min: 0, step: 0.1 },
    },
    {
      fieldName: 'standards',
      label: '标准档次',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '每行一个档次，例如：\n没有\n有1-5处散落垃圾' },
      autosize: { minRows: 5, maxRows: 10 },
      rules: 'required',
    },
    {
      fieldName: 'scores',
      label: '对应分数',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '每行一个分数，与档次一一对应，例如：\n100\n70' },
      autosize: { minRows: 5, maxRows: 10 },
      rules: 'required',
    },
    {
      fieldName: 'sortNo',
      label: '排序序号',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入整数', min: 1, precision: 0 },
      rules: 'required',
    }
  ],
  showDefaultActions: false,
});

const [ItemDrawer, itemDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { itemDrawerApi.close(); },
  onConfirm: async () => {
    const valid = await itemFormApi.validate();
    if (!valid.valid) return;

    const values = itemFormApi.form.values;
    // 将文本域中的行转换为数组
    const standards = values.standands.split('\n').map(s => s.trim()).filter(s => s);
    const scores = values.scores.split('\n').map(s => s.trim()).filter(s => s);
    if (standards.length !== scores.length) {
      ElMessage.error('标准档次与对应分数数量不一致');
      return;
    }

    const payload = itemDrawerApi.sharedData.payload;
    const { mode, onSave } = payload || {};

    if (mode === 'temp') {
      // 临时列表（分类抽屉内）
      if (currentItem.value) {
        // 编辑
        const index = currentCategoryItems.value.findIndex(i => i.indicatorId === currentItem.value.indicatorId);
        if (index !== -1) {
          currentCategoryItems.value[index] = {
            ...currentCategoryItems.value[index],
            ...values,
            standards,
            scores
          };
        }
      } else {
        // 新增
        const newItem = {
          indicatorId: `ind_${Date.now()}_${Math.random()}`,
          ...values,
          standards,
          scores,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        };
        currentCategoryItems.value.push(newItem);
      }
      // 排序
      currentCategoryItems.value.sort((a,b) => a.sortNo - b.sortNo);
      if (onSave) onSave();
    }
    itemDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const payload = itemDrawerApi.sharedData.payload;
      currentItem.value = payload?.item || null;
      if (currentItem.value) {
        // 编辑时，将数组转换回文本域
        await itemFormApi.setValues({
          ...currentItem.value,
          standards: currentItem.value.standards.join('\n'),
          scores: currentItem.value.scores.join('\n')
        });
      } else {
        itemFormApi.resetForm();
      }
    }
  }
});

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

// 图表数据计算（可选，若不需要可移除）
const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const enabled = list.filter(v => v.statusName === '启用').length;
  const itemTotal = list.reduce((acc, v) => acc + (v.itemCount || 0), 0);

  const cardList = [
    { title: '总分类数', value: total, color: '#13ce66' },
    { title: '启用分类数', value: enabled, color: '#4ECDC4' },
    { title: '指标总数', value: itemTotal, color: '#FFC107' }
  ];

  const systemMap = {};
  list.forEach(v => { systemMap[v.systemName] = (systemMap[v.systemName] || 0) + 1; });
  const pieData1 = Object.entries(systemMap).map(([name, value]) => ({ name, value }));

  const gradeMap = {};
  // 由于不再有档次维度，此处饼图可能不再适用，可忽略或保持空
  const pieData2 = [];

  const topCategories = list.slice(0, 8);
  const barData = {
    xData: topCategories.map(v => v.name.length > 6 ? v.name.slice(0,6)+'...' : v.name),
    series: [{ name: '指标数量', data: topCategories.map(v => v.itemCount || 0) }]
  };
  return { cardList, pieData1, pieData2, barData };
});

// 钻取筛选
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
    if (activeTab.value === '全部') return true;
    return v.statusName === activeTab.value;
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
  // 导出分类及指标明细
  const sheets = [
    {
      name: '标准分类',
      data: dataObj.apilist.map(c => ({
        '分类名称': c.name,
        '适用体系': c.systemName,
        '指标数量': c.itemCount,
        '状态': c.statusName,
        '创建人': c.createByName,
        '创建时间': c.createTime,
        '变更日志': c.changeLog
      }))
    },
    {
      name: '指标明细',
      data: dataObj.apilist.flatMap(c =>
        (c.items || []).map(item => ({
          '所属分类': c.name,
          '指标名称': item.name,
          '标准档次': item.standards.join('；'),
          '对应分数': item.scores.join('；'),
          '权重': item.weight,
          '排序': item.sortNo
        }))
      )
    }
  ];
  exportToExcel(sheets, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  categoryDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  categoryDrawerApi.setData({ title: textObj.editText, category: row }).open();
}

function handleAddItem(row) {
  // 从表格行直接新增指标（暂未实现，可通过编辑分类内操作）
  ElMessage.info('请点击编辑分类，在分类内添加指标');
}

// 在分类抽屉内新增指标
function addItemInDrawer() {
  itemDrawerApi.setData({
    title: textObj.addItemText,
    mode: 'temp',
    onSave: () => {
      // 保存后已自动更新 currentCategoryItems
    }
  }).open();
}

// 在分类抽屉内编辑指标
function editItemInDrawer(item) {
  itemDrawerApi.setData({
    title: textObj.editItemText,
    item,
    mode: 'temp'
  }).open();
}

// 在分类抽屉内删除指标
function removeItemFromDrawer(item) {
  ElMessageBox.confirm('确定删除该指标吗？', '提示', { type: 'warning' }).then(() => {
    const index = currentCategoryItems.value.findIndex(i => i.indicatorId === item.indicatorId);
    if (index !== -1) {
      currentCategoryItems.value.splice(index, 1);
    }
  }).catch(() => {});
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
  const targetStatus = activeTab.value === '停用' ? '启用' : '停用';
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
const handleTabChange = () => {
  gridApi.setGridOptions({ columns: getGridColumnsByTab(activeTab.value) });
  gridApi.query();
};

// 详情抽屉
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
    <!-- 分类抽屉（含指标管理） -->
    <CategoryDrawer :title="categoryDrawerApi.sharedData.payload?.title" class="genchuan-detail-drawer">
      <CategoryForm />
      <!-- 指标管理区域（仅在编辑/新增时显示） -->
      <div class="category-items-section" v-if="currentCategoryItems.length || categoryDrawerApi?.sharedData?.payload?.title === textObj.addText">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0;">指标列表</h4>
          <el-button type="primary" size="small" @click="addItemInDrawer">新增指标</el-button>
        </div>
        <el-table :data="currentCategoryItems" border size="small">
          <el-table-column prop="name" label="指标名称" min-width="150" />
          <el-table-column prop="weight" label="权重" width="80" />
          <el-table-column prop="sortNo" label="排序" width="80" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button size="small" @click="editItemInDrawer(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="removeItemFromDrawer(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </CategoryDrawer>

    <!-- 指标项抽屉（用于新增/编辑指标） -->
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
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
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
          <IconButton v-if="activeTab === '全部'" content="新增分类" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            v-if="activeTab !== '停用'"
            content="批量停用"
            icon-name="close"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton
            v-if="activeTab === '停用'"
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

<style scoped>
.category-items-section {
  margin-top: 20px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
}
.category-items-section h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
</style>
