<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportCarInput,
  getCarInputPage,
  getCarInput,
  createCarInput,
  auditCarInput,
  confirmCarInput,
  correctCarInput,
} from '#/api/genchuan/industry/chargePark/vehiclePass/siteInput/carInput';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import IconButton from '#/components/common/IconButton.vue';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  textObj,
  useSearchFormSchema,
  useCreateFormSchema,
  useGridColumns,
  useAuditFormSchema,
  useCorrectFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 是否使用真实API（默认false使用模拟数据）
const USE_REAL_API = true;

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);

const [CreateForm, createFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
});

const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    createFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = createFormApi.form.values;
        await createCarInput(values);
        ElMessage.success('新增成功');
        handleRefresh();
        createFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('新增失败');
        console.error(error);
      }
    } else {
      const obj = createFormApi.form.values;
      dataObj.apilist.push(obj);
      handleRefresh();
      createFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  if (USE_REAL_API) {
    try {
      await exportCarInput(dataObj.searchParams);
      ElMessage.success('导出成功');
    } catch (error) {
      ElMessage.error('导出失败');
      console.error(error);
    }
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

function handleCreate() {
  createFormDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.plateNo]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.plateNo]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
  searchParams: {},
  currentRow: null,
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const page = pageObj.page;

  // 使用真实API
  if (USE_REAL_API) {
    try {
      const params = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...dataObj.searchParams,
      };

      const res = await getCarInputPage(params);
      dataObj.total = res.total || 0;
      dataObj.list = res.list || [];
      return dataObj;
    } catch (error) {
      ElMessage.error('获取数据失败');
      console.error(error);
      return dataObj;
    }
  }

  // 使用模拟数据
  const filteredList = dataObj.apilist.filter((v) => {
    let statusMatch = true;
    switch (activeName.value) {
      case '待审核': {
        statusMatch = v.status === '待审核';
        break;
      }
      case '已通过': {
        statusMatch = v.status === '已通过';
        break;
      }
      case '已驳回': {
        statusMatch = v.status === '已驳回';
        break;
      }
    }

    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });

    return statusMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
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

const handleOpenDetail = async (row) => {
  try {
    const loadingInstance = ElLoading.service({ text: '加载详情中...' });
    try {
      const data = await getCarInput(row.id);
      dataObj.detailObj = data;
      detailDrawerRef.value.open();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    console.error('获取详情失败:', error);
    ElMessage.error('获取详情失败');
    // 失败时使用行数据兜底
    dataObj.detailObj = row;
    detailDrawerRef.value.open();
  }
};

const tabsData = ref([
  { label: '全部' },
  { label: '待审核' },
  { label: '已通过' },
  { label: '已驳回' },
]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '待审核': {
      count = dataObj.apilist.filter((v) => v.status === '待审核').length;
      break;
    }
    case '已通过': {
      count = dataObj.apilist.filter((v) => v.status === '已通过').length;
      break;
    }
    case '已驳回': {
      count = dataObj.apilist.filter((v) => v.status === '已驳回').length;
      break;
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 处理图表卡片点击筛选
const handleFilterByChart = (event) => {
  const filterParams = event.detail;
  dataObj.searchParams = { ...dataObj.searchParams, ...filterParams };
  handleRefresh();
  ElMessage.success('已应用图表筛选');
};

onMounted(() => {
  window.addEventListener('filterByChart', handleFilterByChart);
});

onUnmounted(() => {
  window.removeEventListener('filterByChart', handleFilterByChart);
});

// 审核表单
const [AuditForm, auditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useAuditFormSchema(),
  showDefaultActions: false,
});

const [AuditFormDrawer, auditFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    auditFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = auditFormApi.form.values;
        await auditCarInput({
          id: dataObj.currentRow.id,
          ...values,
        });
        ElMessage.success('审核成功');
        handleRefresh();
        auditFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('审核失败');
        console.error(error);
      }
    } else {
      const values = auditFormApi.form.values;
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        dataObj.apilist[index].status =
          values.auditResult === '通过' ? '已通过' : '已驳回';
        dataObj.apilist[index].auditComment = values.auditComment;
      }
      handleRefresh();
      auditFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      auditFormApi.resetForm();
    }
  },
});

// 修正表单
const [CorrectForm, correctFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCorrectFormSchema(),
  showDefaultActions: false,
});

const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  async onConfirm() {
    if (USE_REAL_API) {
      try {
        const values = correctFormApi.form.values;
        await correctCarInput({
          id: dataObj.currentRow.id,
          ...values,
        });
        ElMessage.success('修正成功');
        handleRefresh();
        correctFormDrawerApi.close();
      } catch (error) {
        ElMessage.error('修正失败');
        console.error(error);
      }
    } else {
      const values = correctFormApi.form.values;
      const index = dataObj.apilist.findIndex(
        (v) => v.id === dataObj.currentRow.id,
      );
      if (index !== -1) {
        Object.assign(dataObj.apilist[index], values);
        dataObj.apilist[index].status = '待审核';
      }
      handleRefresh();
      correctFormDrawerApi.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen && dataObj.currentRow) {
      correctFormApi.setValues({
        plateNo: dataObj.currentRow.plateNo,
        spaceId: dataObj.currentRow.spaceId,
        areaId: dataObj.currentRow.areaId,
        remark: dataObj.currentRow.remark,
      });
    }
  },
});

// 审核操作
const handleAudit = (row) => {
  dataObj.currentRow = row;
  auditFormDrawerApi
    .setData({
      title: '审核车辆录入',
    })
    .open();
};

// 确认操作
const handleConfirm = async (row) => {
  await confirm('确定确认该录入信息吗？');
  if (USE_REAL_API) {
    try {
      await confirmCarInput({ id: row.id });
      ElMessage.success('确认成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error('确认失败');
      console.error(error);
    }
  } else {
    const index = dataObj.apilist.findIndex((v) => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].status = '已确认';
    }
    handleRefresh();
  }
};

// 修正操作
const handleCorrect = (row) => {
  dataObj.currentRow = row;
  correctFormDrawerApi
    .setData({
      title: '修正车辆录入',
    })
    .open();
};
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer :title="textObj.addText">
      <CreateForm />
    </CreateFormDrawer>
    <AuditFormDrawer title="审核车辆录入">
      <AuditForm />
    </AuditFormDrawer>
    <CorrectFormDrawer title="修正车辆录入">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.plateNo}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
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
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.id }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.plateNo }}
        </el-text>
      </template>
      <template #spaceId="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.spaceId }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '已通过'
              ? 'success'
              : row.status === '待审核'
                ? 'warning'
                : 'danger'
          "
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #areaName="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #inputUserName="{ row }">
        <el-text class="common-align" type="primary">
          {{ row.inputUserName }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="row.status === '待审核'"
            content="审核"
            icon-name="CircleCheck"
            @click="handleAudit(row)"
          />
          <IconButton
            v-if="row.status === '已通过'"
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="row.status === '已驳回'"
            content="修正"
            icon-name="edit"
            @click="handleCorrect(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：入场记录数量: {{ dataObj.list.length }}; 已选择:
            {{ checkedIds.length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
