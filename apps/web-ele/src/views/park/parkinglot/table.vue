<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api/system/role';

import { reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRole, deleteRoleList, exportRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import NewForm from './newForm.vue';

const dataObj = reactive({
  showSearch: false,
});
const [NewFormModel, newFormApi] = useVbenDrawer({
  connectedComponent: NewForm,
});

const [searchDrawer, searchDrawerApi] = useVbenDrawer();
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
  newFormApi
    .setData({
      title: '新增停车场',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row: SystemRoleApi.Role) {
  newFormApi
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
const testObj = reactive({
  total: 10,
  apilist: [
    {
      id: '1',
      name: '芗城区XX社区公共停车场',
      type: '公共',
      address: '芗城区XX街道XX路88号',
      status: '启用',
      parkTotal: '90',
      pricing: '首小时8元，后续每小时4元，封顶32元',
      business: '06:00-24:00',
      division: '芗城区-东铺头街道',
      grid: '东铺头街道网格001',
      managementMatters: '泊位占用处置',
      phone: '13800138000',
      reason: '',
    },
    {
      id: '2',
      name: '龙文区碧湖公园停车场',
      type: '公共',
      address: '龙文区碧湖路126号',
      status: '禁用',
      parkTotal: '120',
      pricing: '首小时6元，后续每小时3元，封顶28元',
      business: '07:00-22:00',
      division: '龙文区-碧湖街道',
      grid: '碧湖街道网格002',
      managementMatters: '设施故障维修',
      phone: '123456789',
      reason: '道闸系统升级维护',
    },
    {
      id: '3',
      name: '龙海区石码镇便民停车场',
      type: '公共',
      address: '龙海区石码镇解放北路59号',
      status: '禁用',
      parkTotal: '68',
      pricing: '首小时4元，后续每小时2元，封顶20元',
      business: '08:00-21:00',
      division: '龙海区-石码街道',
      grid: '石码街道网格001',
      managementMatters: '设施升级改造',
      phone: '13959678987',
      reason: '充电桩设备更换',
    },
    {
      id: '4',
      name: '龙海区闽齐社区停车场',
      type: '公共',
      address: '闽齐社区西门',
      status: '启用',
      parkTotal: '35',
      pricing: '首小时5元，后续每小时2元，封顶24元',
      business: '24H',
      division: '龙海区-海澄镇',
      grid: '海澄镇网格001',
      managementMatters: '泊位占用处置,设施故障维修',
      phone: '15399916161',
      reason: '',
    },
    {
      id: '5',
      name: '芗城区江滨路生态停车场',
      type: '公共',
      address: '芗城区江滨南路189号',
      status: '启用',
      parkTotal: '150',
      pricing: '首小时10元，后续每小时5元，封顶40元',
      business: '06:00-24:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格003',
      managementMatters: '车流高峰疏导,泊位占用处置',
      phone: '8888888',
      reason: '',
    },
    {
      id: '6',
      name: '龙文区万达商圈停车场',
      type: '公共',
      address: '龙文区建元东路2号',
      status: '启用',
      parkTotal: '200',
      pricing: '首小时7元，后续每小时3元，封顶30元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格002',
      managementMatters: '运营状态变更,数据统计分析',
      phone: '15860234567',
      reason: '',
    },
    {
      id: '7',
      name: '长泰区武安镇公共停车场',
      type: '公共',
      address: '长泰区武安镇人民西路77号',
      status: '启用',
      parkTotal: '85',
      pricing: '首小时5元，后续每小时2元，封顶22元',
      business: '07:00-23:00',
      division: '长泰区-武安镇',
      grid: '武安镇网格001',
      managementMatters: '定期设施巡检',
      phone: '13706987654',
      reason: '',
    },
    {
      id: '8',
      name: '漳浦县绥安镇便民停车场',
      type: '公共',
      address: '漳浦县绥安镇金浦大道101号',
      status: '禁用',
      parkTotal: '72',
      pricing: '首小时4元，后续每小时1元，封顶18元',
      business: '08:00-20:00',
      division: '漳浦县-绥安镇',
      grid: '绥安镇网格001',
      managementMatters: '应急事件处置',
      phone: '13695901234',
      reason: '场地积水清理',
    },
    {
      id: '9',
      name: '芗城区巷口街道停车场',
      type: '公共',
      address: '芗城区新华东路32号',
      status: '启用',
      parkTotal: '45',
      pricing: '首小时6元，后续每小时3元，封顶26元',
      business: '06:00-23:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格002',
      managementMatters: '收费标准调整,泊位占用处置',
      phone: '18960012345',
      reason: '',
    },
    {
      id: '10',
      name: '龙文区蓝田街道停车场',
      type: '公共',
      address: '龙文区蓝田街道梧桥中路58号',
      status: '启用',
      parkTotal: '110',
      pricing: '首小时8元，后续每小时4元，封顶35元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格001',
      managementMatters: '环境卫生管理,设施故障维修',
      phone: '15980567890',
      reason: '',
    },
  ],
  list: [],
});
const topName = ref('车辆信息管理');
// 表格数据获取
const getTableData = () => {
  const tabelObj = {
    list: testObj.apilist.map((v) => v),
    total: testObj.apilist.length,
  };
  tabelObj.list = tabelObj.list.filter((v) => {
    console.log(activeName.value);
    if (activeName.value === '全部') {
      return true;
    }
    return v.status === activeName.value;
  });
  return tabelObj;
};

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'grid-cols-4',
    },
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
  wrapperClass: 'grid-cols-4',
});
function onSubmit() {}
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
  dataObj.showSearch = !dataObj.showSearch;
};
const searchOpen = () => {
  searchDrawerApi.open();
};
</script>

<template>
  <div class="park-lot-table">
    <NewFormModel @success="handleRefresh" />
    <searchDrawer title="搜索栏设置" />
    <QueryForm class="query-form" v-if="dataObj.showSearch" />
    <Grid>
      <template #table-title>
        <div class="tabel-tabs">
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
  </div>
</template>
<style lang="scss" scoped>
.park-lot-table {
  padding-top: 5px;
}
</style>
