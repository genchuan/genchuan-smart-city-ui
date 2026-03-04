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
  getGridColumnsByTab,
  objectTypeList,
  indexTypeList,
  calcWayList,
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
  return formData.value?.systemId ? textObj.editText : textObj.addText;
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
    if (formDrawerApi.sharedData.payload.title === textObj.addText || formDrawerApi.sharedData.payload.title === textObj.versionText) {
      // 新增或新增版本
      obj.systemId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      obj.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
      obj.statusName = statusList.find(s => s.id === (obj.statusId || 's1'))?.name || '启用';
      obj.createByName = '当前用户';
      obj.createTime = new Date().toLocaleString();
      obj.updateByName = '当前用户';
      obj.updateTime = obj.createTime;
      obj.categoryCount = 0;
      obj.itemCount = 0;
      obj.categories = [];
      obj.changeLog = '新建体系';
      dataObj.apilist.push(obj);
      dataObj.currentPage = 1;
    } else {
      // 编辑
      const index = dataObj.apilist.findIndex(v => v.systemId === formData.value?.systemId);
      if (index !== -1) {
        const updated = { ...dataObj.apilist[index], ...obj };
        updated.objectTypeName = objectTypeList.find(t => t.id === obj.objectTypeId)?.name || '';
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
      if (formData.value?.systemId) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
        if (formDrawerApi.sharedData.payload.title === textObj.versionText) {
          const source = formDrawerApi.sharedData.payload.source;
          if (source) {
            await formApi.setValues({
              ...source,
              systemId: undefined,
              version: '',
              statusId: 's1'
            });
          }
        }
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

function handleNewVersion(row) {
  formDrawerApi.setData({ title: textObj.versionText, source: row }).open();
}

function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该指标体系吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.systemId === row.systemId);
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
  await confirm('确定启用该指标体系吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.systemId === row.systemId);
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
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.systemId) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.systemId)) {
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
  checkedIds.value = records.map(item => item.systemId);
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
const filterCode = ref('');
const filterObjectType = ref('');
const filterStatus = ref('');

// 钻取点击处理函数
const handleCodeClick = (code) => {
  filterCode.value = filterCode.value === code ? '' : code;
  gridApi.query();
};
const handleObjectTypeClick = (objectType) => {
  filterObjectType.value = filterObjectType.value === objectType ? '' : objectType;
  gridApi.query();
};
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 取消筛选标签
const handleCancelCodeFilter = () => {
  filterCode.value = '';
  gridApi.query();
};
const handleCancelObjectTypeFilter = () => {
  filterObjectType.value = '';
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
      if (params.code && !item.code.includes(params.code)) match = false;
      if (params.objectTypeId && item.objectTypeId !== params.objectTypeId) match = false;
      if (params.version && !item.version.includes(params.version)) match = false;
      if (params.desc && item.desc && !item.desc.includes(params.desc)) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      return match;
    });
  }

  // 钻取筛选
  if (filterCode.value) {
    filtered = filtered.filter(item => item.code === filterCode.value);
  }
  if (filterObjectType.value) {
    filtered = filtered.filter(item => item.objectTypeName === filterObjectType.value);
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
    rowConfig: { keyField: 'systemId', isHover: true },
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
  const versionCounts = {};
  list.forEach(v => { versionCounts[v.version] = (versionCounts[v.version] || 0) + 1; });
  const versionCards = Object.entries(versionCounts).slice(0, 3).map(([ver, cnt]) => ({
    title: `${ver}体系数`,
    value: cnt,
    color: '#FF6B6B'
  }));
  while (versionCards.length < 1) versionCards.push({ title: '版本体系数', value: 0, color: '#FF6B6B' });

  const itemTotal = list.reduce((acc, v) => acc + (v.itemCount || 0), 0);

  const cardList = [
    { title: '总体系数', value: total, color: '#13ce66' },
    { title: '启用体系数', value: enabled, color: '#4ECDC4' },
    ...versionCards.slice(0, 1),
    { title: '指标项总数', value: itemTotal, color: '#FFC107' }
  ];

  const objTypeMap = {};
  list.forEach(v => { objTypeMap[v.objectTypeName] = (objTypeMap[v.objectTypeName] || 0) + 1; });
  const pieData1 = Object.entries(objTypeMap).map(([name, value]) => ({ name, value }));

  const indexTypeMap = {};
  list.forEach(sys => {
    sys.categories?.forEach(cat => {
      cat.items?.forEach(item => {
        const typeName = item.indexTypeName;
        indexTypeMap[typeName] = (indexTypeMap[typeName] || 0) + 1;
      });
    });
  });
  const pieData2 = Object.entries(indexTypeMap).map(([name, value]) => ({ name, value }));

  const topSystems = list.slice(0, 8);
  const barData = {
    xData: topSystems.map(v => v.name.length > 6 ? v.name.slice(0,6)+'...' : v.name),
    series: [{ name: '指标项数量', data: topSystems.map(v => v.itemCount || 0) }]
  };

  return { cardList, pieData1, pieData2, barData };
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 图表区域 -->
    <ObjectChart
      :card-list="chartData.cardList"
      :pie-data1="chartData.pieData1"
      :pie-data2="chartData.pieData2"
      :bar-data="chartData.barData"
    />

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
            v-if="filterCode"
            type="primary"
            closable
            @close="handleCancelCodeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            体系编码：{{ filterCode }}
          </el-tag>
          <el-tag
            v-if="filterObjectType"
            type="success"
            closable
            @close="handleCancelObjectTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用对象类型：{{ filterObjectType }}
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
          <IconButton v-if="activeName === '全部'" content="新增" icon-name="Plus" @click="handleCreate" />
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
      <template #code="{ row }">
        <el-text @click="handleCodeClick(row.code)" class="common-align" type="primary">
          {{ row.code }}
        </el-text>
      </template>
      <template #objectTypeName="{ row }">
        <el-text @click="handleObjectTypeClick(row.objectTypeName)" class="common-align" type="primary">
          {{ row.objectTypeName }}
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
          <IconButton v-if="activeName !== '停用'" content="新增版本" icon-name="DocumentCopy" @click="handleNewVersion(row)" />
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
          <span>本页统计：体系数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：体系总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
