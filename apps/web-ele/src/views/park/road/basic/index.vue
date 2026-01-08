<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api/system/role';

import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRole, deleteRoleList, exportRole } from '#/api/system/role';
import { $t } from '#/locales';

import {
  dataList,
  useFormSchema,
  useGridColumns,
  useGridFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});
const getTitle = computed(() => {
  return formData.value?.id ? '编辑停车场' : '新增停车场';
});
const [Drawer, drawerApi] = useVbenDrawer({
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange(isOpen: boolean) {},
});
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
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formData.value = formDrawerApi.getData<Record<string, any>>();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});
const [searchDrawer] = useVbenDrawer();
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const data = await exportRole(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '角色.xls', source: data });
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增停车场',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row: SystemRoleApi.Role) {
  formDrawerApi
    .setData({
      title: '编辑停车场',
      ...row,
    })
    .open();
}

/** 删除角色 */
async function handleDelete(row: SystemRoleApi.Role) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    await deleteRole(row.id!);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除角色 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    await deleteRoleList(checkedIds.value);
    checkedIds.value = [];
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: SystemRoleApi.Role[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}
const dataObj = reactive({
  total: 10,
  apilist: dataList(),
  list: [],
});
// 表格数据获取
const getTableData = () => {
  const tabelObj = {
    list: dataObj.apilist.map((v) => v),
    total: dataObj.apilist.length,
  };
  tabelObj.list = tabelObj.list.filter((v) => {
    if (activeName.value === '全部') {
      return true;
    }
    return v.status === activeName.value;
  });
  return tabelObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useGridFormSchema(),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});
// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => getTableData(),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  } as VxeTableGridOptions<SystemRoleApi.Role>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
} as any);

const activeName = ref('全部');
const tabsData = ref([{ label: '全部' }, { label: '启用' }, { label: '禁用' }]);
const handleClick = (tab, event: Event) => {
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
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- <NewFormModel @success="handleRefresh" /> -->
    <searchDrawer title="搜索栏设置" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
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
                :label="item.label"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增停车场',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['system:role:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['system:role:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
              auth: ['system:role:delete'],
              onClick: handleDeleteBatch,
            },
          ]"
        />
        <button
          class="vxe-button type--button size--small is--circle ml-2"
          title="搜索"
          type="button"
          @click="handleSerachShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-icon-search"
          ></i>
        </button>
        <button
          class="vxe-button type--button size--small is--circle"
          title="全屏"
          type="button"
          @click="handleFullShow"
        >
          <i
            class="vxe-button--item vxe-button--prefix-icon vxe-table-icon-fullscreen"
          ></i>
        </button>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['system:role:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['system:role:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
    <div class="bottom-title">
      总计: 停车场数量10;车位总数:1211;评价车场车位73;
    </div>
  </div>
</template>
<style lang="scss">
.park-lot-table-new {
  padding-top: 5px;
  padding-bottom: 20px;
  .table-first {
    display: flex;
    align-items: center;
    .tabel-tab-icon {
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .vxe-tools--wrapper {
    position: fixed;
    right: 85px;
    top: 90px;
  }
  .vxe-tools--operate {
    position: fixed;
    right: 0px;
    top: 90px;
  }
  .vxe-pager .vxe-pager--sizes {
    margin-right: 10px;
  }
  .bottom-title {
    position: relative;
    margin-top: -30px;
    margin-left: 10px;
  }
  .common-tool-bar-config {
    .vxe-tools--operate {
      .vxe-button:nth-child(2) {
        display: none;
      }
    }
  }
}
</style>
