<script setup>
import { reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  auditUnplateEnter,
  confirmUnplateEnter,
  correctUnplateEnter,
  createUnplateEnter,
  exportUnplateEnter,
  getUnplateEnterPage,
} from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/unplateEnter';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  textObj,
  useAuditFormSchema,
  useCorrectFormSchema,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
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

const [SearchForm, searchFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showDefaultActions: false,
});

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
    try {
      const values = createFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await createUnplateEnter(values);
        ElMessage.success('新增成功');
        handleRefresh();
        createFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('新增失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      createFormApi.resetForm();
    }
  },
});

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

const [CorrectFormDrawer, correctFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    correctFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      const values = correctFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await correctUnplateEnter({ id: values.id, ...values });
        ElMessage.success('修正成功');
        handleRefresh();
        correctFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('修正失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const formData = correctFormDrawerApi.getData();
      if (formData?.id) {
        await correctFormApi.setValues(formData);
      }
    }
  },
});

const [AuditFormDrawer, auditFormDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    auditFormDrawerApi.close();
  },
  async onConfirm() {
    try {
      await auditFormApi.validate();
      const values = auditFormApi.form.values;
      const loadingInstance = ElLoading.service({ text: '提交中...' });
      try {
        await auditUnplateEnter(values);
        ElMessage.success('审核成功');
        handleRefresh();
        auditFormDrawerApi.close();
      } finally {
        loadingInstance.close();
      }
    } catch (error) {
      ElMessage.error('审核失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const formData = auditFormDrawerApi.getData();
      if (formData?.id) {
        await auditFormApi.setValues({ id: formData.id });
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  if (USE_REAL_API) {
    try {
      await exportUnplateEnter(dataObj.searchParams);
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

function handleEdit(row) {
  correctFormDrawerApi
    .setData({
      title: '修正无牌入场',
      ...row,
    })
    .open();
}

function handleAudit(row) {
  auditFormDrawerApi
    .setData({
      title: '审核无牌入场',
      ...row,
    })
    .open();
}

async function handleConfirm(row) {
  try {
    await confirm({
      title: '确认操作',
      content: `确定要确认该无牌入场记录吗？`,
    });
    const loadingInstance = ElLoading.service({ text: '确认中...' });
    try {
      await confirmUnplateEnter(row.id);
      ElMessage.success('确认成功');
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('确认失败');
      console.error(error);
    }
  }
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

      const res = await getUnplateEnterPage(params);
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
      case '异常': {
        statusMatch = v.status === '异常';
        break;
      }
      case '正常': {
        statusMatch = v.status === '正常';
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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

const tabsData = ref([{ label: '全部' }, { label: '正常' }, { label: '异常' }]);

const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;
      break;
    }
    case '异常': {
      count = dataObj.apilist.filter((v) => v.status === '异常').length;
      break;
    }
    case '正常': {
      count = dataObj.apilist.filter((v) => v.status === '正常').length;
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
</script>

<template>
  <div class="park-lot-table-new">
    <CreateFormDrawer title="新增无牌入场">
      <CreateForm />
    </CreateFormDrawer>
    <AuditFormDrawer title="审核无牌入场">
      <AuditForm />
    </AuditFormDrawer>
    <CorrectFormDrawer title="修正无牌入场">
      <CorrectForm />
    </CorrectFormDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      title="无牌入场详情"
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
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="审核"
            icon-name="CircleCheck"
            @click="handleAudit(row)"
          />
          <IconButton
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
          />
          <IconButton
            content="修正"
            icon-name="edit"
            @click="handleEdit(row)"
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
