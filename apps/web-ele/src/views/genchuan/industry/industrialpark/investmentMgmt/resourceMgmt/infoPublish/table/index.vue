<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteInfoPublish,
  offlineInfoPublish,
  publishInfoPublish,
  responseInfoPublish,
  updateInfoPublish,
  updateInfoPublishPolicy,
} from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/infoPublish';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';

import InfoDetailDrawer from '../components/InfoDetailDrawer.vue';
import InfoOperationDialog from '../components/InfoOperationDialog.vue';
import {
  dataList,
  detailFields,
  getInfoStatusLabel,
  getInfoStatusTagType,
  getInfoTypeLabel,
  getInfoTypeTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

/** 获取当前用户信息 */
const userStore = useUserStore();

/** 获取当前登录用户的账号名 */
const getCurrentUsername = () => {
  return userStore.userInfo?.username || 'admin';
};

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

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
const infoDetailDrawerRef = ref(null);
const operationDialogRef = ref(null);
const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 录入信息 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑信息 - 需要选中数据 */
function handleEdit(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow =
    row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  formDrawerApi
    .setData({
      title: textObj.editText,
      ...targetRow,
    })
    .open();
}

/** 配置政策 - 需要选中数据（打开操作表单） */
async function handleConfig(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow =
    row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '配置',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 发布信息 - 需要选中数据（打开操作表单） */
async function handlePublish(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow =
    row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '发布',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 响应咨询（打开操作表单） */
async function handleResponse(row) {
  operationDialogRef.value.open({
    title: '响应',
    id: row.id,
    ...row,
  });
}

/** 更新信息 - 需要选中数据（打开操作表单） */
async function handleUpdate(row) {
  if (!row && checkedIds.value.length === 0) {
    ElMessage.warning('请先选中一条数据');
    return;
  }

  const targetRow =
    row || dataObj.apilist.find((item) => item.id === checkedIds.value[0]);
  if (!targetRow) return;

  operationDialogRef.value.open({
    title: '更新',
    id: targetRow.id,
    ...targetRow,
  });
}

/** 下架信息 */
async function handleOffline(row) {
  await confirm('确定要下架该信息吗？下架后将不再对外展示。');
  const loadingInstance = ElLoading.service({ text: '正在下架...' });
  try {
    await offlineInfoPublish({
      id: row.id,
      handleUser: getCurrentUsername(),
    });
    ElMessage.success('下架成功');
    handleRefresh();
  } catch (error) {
    console.error('下架失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 删除信息 */
async function handleDelete(row) {
  await confirm('确定要删除该信息吗？删除后不可恢复。');
  const loadingInstance = ElLoading.service({ text: '正在删除...' });
  try {
    await deleteInfoPublish([row.id]);
    ElMessage.success('删除成功');
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 查看详情（基础详情） */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 查看完整详情（包含政策配置、咨询记录） */
const handleOpenInfoDetail = (row) => {
  infoDetailDrawerRef.value.open(row);
};

/** 点击信息标题打开完整详情 */
const handleInfoTitleClick = (row) => {
  handleOpenInfoDetail(row);
};

/** 处理操作对话框确认回调 */
const handleOperationConfirm = async (values) => {
  const { title, id, ...params } = values;
  const loadingInstance = ElLoading.service({ text: `正在${title}...` });

  try {
    switch (title) {
      case '发布': {
        await publishInfoPublish({
          id,
          publishTime:
            params.publishTime || String(Math.floor(Date.now() / 1000)),
          handleUser: getCurrentUsername(),
        });
        break;
      }
      case '响应': {
        await responseInfoPublish({
          id,
          responseUser: getCurrentUsername(),
          consultCount: params.consultCount,
          responseRate: params.responseRate,
          handleUser: getCurrentUsername(),
        });
        break;
      }
      case '更新': {
        await updateInfoPublish({
          id,
          infoTitle: params.infoTitle,
          infoType: params.infoType,
          policyConfig: params.policyConfig,
          handleUser: getCurrentUsername(),
        });
        break;
      }
      case '配置': {
        await updateInfoPublishPolicy({
          id,
          policyConfig: params.policyConfig,
          handleUser: getCurrentUsername(),
        });
        break;
      }
      default: {
        throw new Error(`未知操作类型：${title}`);
      }
    }

    ElMessage.success(`${title}成功`);
    handleRefresh();
  } catch (error) {
    console.error(`${title}失败:`, error);
    ElMessage.error(`${title}失败`);
  } finally {
    loadingInstance.close();
  }
};

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

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据searchParams筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'consultCount') {
          searchMatch = searchMatch && v[key] == Number(value);
        } else if (key === 'responseRate') {
          searchMatch = searchMatch && v[key] == Number(value);
        } else if (typeof value === 'string') {
          searchMatch = searchMatch && v[key]?.toString().includes(value);
        } else {
          searchMatch = searchMatch && v[key] === value;
        }
      }
    });

    return searchMatch;
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

// 搜索表单查询
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

// 根据状态获取行按钮配置
const getRowButtons = (row) => {
  const status = Number(row.infoStatus);

  switch (status) {
    case 0: {
      return [
        { content: '编辑', iconName: 'Edit', handler: () => handleEdit(row) },
        {
          content: '发布',
          iconName: 'Promotion',
          handler: () => handlePublish(row),
        },
        {
          content: '删除',
          iconName: 'Delete',
          color: '#F56C6C',
          handler: () => handleDelete(row),
        },
      ];
    }
    case 1: {
      return [
        {
          content: '响应',
          iconName: 'ChatDotRound',
          handler: () => handleResponse(row),
        },
        {
          content: '下架',
          iconName: 'Bottom',
          color: '#E6A23C',
          handler: () => handleOffline(row),
        },
        {
          content: '修改',
          iconName: 'EditPen',
          handler: () => handleUpdate(row),
        },
      ];
    }
    case 2: {
      return [
        {
          content: '查看',
          iconName: 'View',
          handler: () => handleOpenInfoDetail(row),
        },
        {
          content: '删除',
          iconName: 'Delete',
          color: '#F56C6C',
          handler: () => handleDelete(row),
        },
      ];
    }
    default: {
      return [];
    }
  }
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
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   基础详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.infoTitle} 详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   信息完整详情抽屉（含政策配置、咨询记录） -->
    <InfoDetailDrawer ref="infoDetailDrawerRef" />
    <!--   操作对话框（配置/响应） -->
    <InfoOperationDialog
      ref="operationDialogRef"
      @confirm="handleOperationConfirm"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit()" />
          <IconButton
            content="配置"
            icon-name="Setting"
            @click="handleConfig()"
          />
          <IconButton
            content="发布"
            icon-name="Promotion"
            @click="handlePublish()"
          />
          <IconButton
            content="响应"
            icon-name="ChatDotRound"
            @click="handleResponse()"
          />
          <IconButton
            content="更新"
            icon-name="RefreshRight"
            @click="handleUpdate()"
          />
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
      <template #infoTitle="{ row }">
        <el-text
          @click="handleInfoTitleClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.infoTitle }}
        </el-text>
      </template>
      <template #infoType="{ row }">
        <el-tag :type="getInfoTypeTagType(row.infoType)">
          {{ getInfoTypeLabel(row.infoType) }}
        </el-tag>
      </template>
      <template #responseRate="{ row }">
        <span>{{ (row.responseRate * 100).toFixed(1) }}%</span>
      </template>
      <template #infoStatus="{ row }">
        <el-tag :type="getInfoStatusTagType(row.infoStatus)">
          {{ getInfoStatusLabel(row.infoStatus) }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-for="(btn, index) in getRowButtons(row)" :key="index">
            <IconButton
              :content="btn.content"
              :icon-name="btn.iconName"
              :color="btn.color"
              @click="btn.handler"
            />
          </template>
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
          <span> 本页统计：{{ textObj.total }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.info-title-link:hover {
  color: #66b1ff;
}
</style>
