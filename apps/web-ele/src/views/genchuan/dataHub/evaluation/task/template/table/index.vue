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
  useTemplateFormSchema,
  getGridColumnsByTab,
  indexSystemList,
  subjectList,
  objectTypeList,
  cycleTypeList,
  statusList
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

// 当前编辑的模板数据
const currentTemplate = ref(null);
const activeTab = ref('全部'); // 用于决定批量操作文案等

// 任务模板表单抽屉
const [TemplateForm, templateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useTemplateFormSchema(),
  showDefaultActions: false,
});

const [TemplateDrawer, templateDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { templateDrawerApi.close(); },
  onConfirm: async () => {
    const values = templateFormApi.form.values;
    if (!values.name || !values.code || !values.objectTypeId || !values.systemId || !values.subjectId || !values.cycleTypeId) {
      ElMessage.warning('请填写必填项');
      return;
    }
    // 模拟保存
    const title = templateDrawerApi.sharedData.payload?.title;
    if (title === textObj.addText) {
      // 新增
      const newTemplate = {
        templateId: Date.now().toString(),
        name: values.name,
        code: values.code,
        objectTypeId: values.objectTypeId,
        objectTypeName: objectTypeList.find(o => o.id === values.objectTypeId)?.name,
        systemId: values.systemId,
        systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
        subjectId: values.subjectId,
        subjectName: subjectList.find(s => s.id === values.subjectId)?.name,
        cycleTypeId: values.cycleTypeId,
        cycleTypeName: cycleTypeList.find(c => c.id === values.cycleTypeId)?.name,
        desc: values.desc || '',
        statusId: 's1',
        statusName: '启用',
        createByName: '当前用户',
        createTime: new Date().toLocaleString(),
        updateByName: '当前用户',
        updateTime: new Date().toLocaleString(),
        useCount: 0,
        lastUseTime: '',
        changeLog: '新建模板'
      };
      dataObj.apilist.push(newTemplate);
    } else if (title === textObj.editText) {
      // 编辑
      const index = dataObj.apilist.findIndex(c => c.templateId === currentTemplate.value?.templateId);
      if (index !== -1) {
        dataObj.apilist[index] = {
          ...dataObj.apilist[index],
          ...values,
          objectTypeName: objectTypeList.find(o => o.id === values.objectTypeId)?.name,
          systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
          subjectName: subjectList.find(s => s.id === values.subjectId)?.name,
          cycleTypeName: cycleTypeList.find(c => c.id === values.cycleTypeId)?.name,
          updateByName: '当前用户',
          updateTime: new Date().toLocaleString(),
          changeLog: (dataObj.apilist[index].changeLog || '') + '；编辑模板'
        };
      }
    } else if (title === textObj.copyText) {
      // 复制模板
      const newTemplate = {
        templateId: Date.now().toString(),
        name: values.name,
        code: values.code,
        objectTypeId: values.objectTypeId,
        objectTypeName: objectTypeList.find(o => o.id === values.objectTypeId)?.name,
        systemId: values.systemId,
        systemName: indexSystemList.find(s => s.id === values.systemId)?.name,
        subjectId: values.subjectId,
        subjectName: subjectList.find(s => s.id === values.subjectId)?.name,
        cycleTypeId: values.cycleTypeId,
        cycleTypeName: cycleTypeList.find(c => c.id === values.cycleTypeId)?.name,
        desc: values.desc || '',
        statusId: 's1',
        statusName: '启用',
        createByName: '当前用户',
        createTime: new Date().toLocaleString(),
        updateByName: '当前用户',
        updateTime: new Date().toLocaleString(),
        useCount: 0,
        lastUseTime: '',
        changeLog: '复制模板创建'
      };
      dataObj.apilist.push(newTemplate);
    }
    handleRefresh();
    templateDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const payload = templateDrawerApi.sharedData.payload;
      if (payload?.title === textObj.editText && payload?.template) {
        currentTemplate.value = payload.template;
        await templateFormApi.setValues(payload.template);
      } else if (payload?.title === textObj.copyText && payload?.template) {
        currentTemplate.value = null;
        const copyData = { ...payload.template };
        delete copyData.templateId;
        delete copyData.code;
        delete copyData.createByName;
        delete copyData.createTime;
        delete copyData.updateByName;
        delete copyData.updateTime;
        delete copyData.useCount;
        delete copyData.lastUseTime;
        delete copyData.changeLog;
        copyData.name = copyData.name + '（复制）';
        await templateFormApi.setValues(copyData);
      } else {
        currentTemplate.value = null;
        templateFormApi.resetForm();
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

// 图表数据计算
const chartData = computed(() => {
  const list = dataObj.apilist;
  const total = list.length;
  const enabled = list.filter(v => v.statusName === '启用').length;
  const used = list.filter(v => v.useCount > 0).length;

  const cardList = [
    { title: '总模板数', value: total, color: '#13ce66' },
    { title: '启用模板数', value: enabled, color: '#4ECDC4' },
    { title: '已使用模板数', value: used, color: '#FFC107' }
  ];

  // 适用对象类型占比
  const objectTypeMap = {};
  list.forEach(v => { objectTypeMap[v.objectTypeName] = (objectTypeMap[v.objectTypeName] || 0) + 1; });
  const pieData1 = Object.entries(objectTypeMap).map(([name, value]) => ({ name, value }));

  // 任务周期占比
  const cycleTypeMap = {};
  list.forEach(v => { cycleTypeMap[v.cycleTypeName] = (cycleTypeMap[v.cycleTypeName] || 0) + 1; });
  const pieData2 = Object.entries(cycleTypeMap).map(([name, value]) => ({ name, value }));

  // 各模板使用次数柱状图
  const topTemplates = list.sort((a, b) => b.useCount - a.useCount).slice(0, 8);
  const barData = {
    xData: topTemplates.map(v => v.name.length > 6 ? v.name.slice(0,6)+'...' : v.name),
    series: [{ name: '使用次数', data: topTemplates.map(v => v.useCount || 0) }]
  };

  return { cardList, pieData1, pieData2, barData };
});

// 筛选相关（钻取）
const filterObjectType = ref('');
const filterSystem = ref('');
const filterSubject = ref('');
const filterCycle = ref('');
const filterStatus = ref('');

const handleObjectTypeClick = (objectTypeName) => {
  filterObjectType.value = filterObjectType.value === objectTypeName ? '' : objectTypeName;
  gridApi.query();
};
const handleSystemClick = (systemName) => {
  filterSystem.value = filterSystem.value === systemName ? '' : systemName;
  gridApi.query();
};
const handleSubjectClick = (subjectName) => {
  filterSubject.value = filterSubject.value === subjectName ? '' : subjectName;
  gridApi.query();
};
const handleCycleClick = (cycleTypeName) => {
  filterCycle.value = filterCycle.value === cycleTypeName ? '' : cycleTypeName;
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
      if (params.code && !item.code.includes(params.code)) match = false;
      if (params.objectTypeId && item.objectTypeId !== params.objectTypeId) match = false;
      if (params.cycleTypeId && item.cycleTypeId !== params.cycleTypeId) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      return match;
    });
  }

  // 钻取筛选
  if (filterObjectType.value) {
    filtered = filtered.filter(item => item.objectTypeName === filterObjectType.value);
  }
  if (filterSystem.value) {
    filtered = filtered.filter(item => item.systemName === filterSystem.value);
  }
  if (filterSubject.value) {
    filtered = filtered.filter(item => item.subjectName === filterSubject.value);
  }
  if (filterCycle.value) {
    filtered = filtered.filter(item => item.cycleTypeName === filterCycle.value);
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
    { fieldName: 'name', label: '模板名称', component: 'Input' },
    { fieldName: 'code', label: '模板编码', component: 'Input' },
    {
      fieldName: 'objectTypeId',
      label: '适用对象类型',
      component: 'Select',
      componentProps: {
        options: objectTypeList.map(o => ({ label: o.name, value: o.id }))
      }
    },
    {
      fieldName: 'cycleTypeId',
      label: '任务周期',
      component: 'Select',
      componentProps: {
        options: cycleTypeList.map(c => ({ label: c.name, value: c.id }))
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
    rowConfig: { keyField: 'templateId', isHover: true },
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
  checkedIds.value = records.map(item => item.templateId);
}

function handleRefresh() {
  gridApi.query();
}

function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

function handleCreate() {
  templateDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  templateDrawerApi.setData({ title: textObj.editText, template: row }).open();
}

function handleCopy(row) {
  templateDrawerApi.setData({ title: textObj.copyText, template: row }).open();
}

async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为"${row.statusName}"，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该任务模板吗？');
  const index = dataObj.apilist.findIndex(v => v.templateId === row.templateId);
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
    ElMessage.warning(`当前状态为"${row.statusName}"，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该任务模板吗？');
  const index = dataObj.apilist.findIndex(v => v.templateId === row.templateId);
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
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.templateId) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是"${allowedCurrentStatus}"的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  dataObj.apilist.forEach(item => {
    if (checkedIds.value.includes(item.templateId)) {
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
    <!-- 模板抽屉 -->
    <TemplateDrawer :title="templateDrawerApi.sharedData.payload?.title">
      <TemplateForm />
    </TemplateDrawer>

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
          <el-tag v-if="filterObjectType" type="primary" closable @close="filterObjectType=''; gridApi.query()" style="height:32px; line-height:32px">
            适用对象类型：{{ filterObjectType }}
          </el-tag>
          <el-tag v-if="filterSystem" type="success" closable @close="filterSystem=''; gridApi.query()" style="height:32px; line-height:32px">
            关联指标体系：{{ filterSystem }}
          </el-tag>
          <el-tag v-if="filterSubject" type="info" closable @close="filterSubject=''; gridApi.query()" style="height:32px; line-height:32px">
            评价主体：{{ filterSubject }}
          </el-tag>
          <el-tag v-if="filterCycle" type="warning" closable @close="filterCycle=''; gridApi.query()" style="height:32px; line-height:32px">
            任务周期：{{ filterCycle }}
          </el-tag>
          <el-tag v-if="filterStatus" type="danger" closable @close="filterStatus=''; gridApi.query()" style="height:32px; line-height:32px">
            状态：{{ filterStatus }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton v-if="activeName === '全部'" content="新增模板" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton v-if="activeName === '全部'" content="复制模板" icon-name="DocumentCopy" @click="handleCopy(gridApi.getGridInstance().getCurrentRow())" />
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
      <!-- 编码点击钻取 -->
      <template #code="{ row }">
        <el-text @click="() => { searchParams.value = { code: row.code }; gridApi.query(); }" class="common-align" type="primary">
          {{ row.code }}
        </el-text>
      </template>
      <!-- 适用对象类型点击钻取 -->
      <template #objectTypeName="{ row }">
        <el-text @click="handleObjectTypeClick(row.objectTypeName)" class="common-align" type="primary">
          {{ row.objectTypeName }}
        </el-text>
      </template>
      <!-- 关联指标体系点击钻取 -->
      <template #systemName="{ row }">
        <el-text @click="handleSystemClick(row.systemName)" class="common-align" type="primary">
          {{ row.systemName }}
        </el-text>
      </template>
      <!-- 评价主体点击钻取 -->
      <template #subjectName="{ row }">
        <el-text @click="handleSubjectClick(row.subjectName)" class="common-align" type="primary">
          {{ row.subjectName }}
        </el-text>
      </template>
      <!-- 任务周期点击钻取 -->
      <template #cycleTypeName="{ row }">
        <el-text @click="handleCycleClick(row.cycleTypeName)" class="common-align" type="primary">
          {{ row.cycleTypeName }}
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
          <IconButton content="复制" icon-name="DocumentCopy" @click="handleCopy(row)" />
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
          <span>本页统计：模板数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：模板总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
