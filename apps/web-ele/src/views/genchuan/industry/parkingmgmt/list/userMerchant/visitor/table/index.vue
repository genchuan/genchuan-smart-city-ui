<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
// 引入封装后的详情抽屉组件
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

// 引入权限和记录抽屉组件
import PermissionDrawer from '../components/PermissionDrawer.vue';
import RecordDrawer from '../components/RecordDrawer.vue';
import { dataList, textObj, useFormSchema, useGridColumns } from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});
const getTitle = computed(() => {
  return formData.value?.visitorId ? textObj.editText : textObj.addText;
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
// 移除原 DetailDrawer 初始化逻辑
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
        if (v.visitorId === formData.value?.visitorId) {
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
      if (formData.value?.visitorId) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 访客权限和记录抽屉相关
const selectedVisitor = ref(null);

// 权限管理抽屉
const [PermissionDrawerComp, permissionDrawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(
    () => `权限管理 - ${selectedVisitor.value?.visitorName || '访客'}`,
  ),
  onCancel() {
    permissionDrawerApi.close();
  },
  async onOpenChange() {},
});

// 记录管理抽屉
const [RecordDrawerComp, recordDrawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(
    () => `记录管理 - ${selectedVisitor.value?.visitorName || '访客'}`,
  ),
  onCancel() {
    recordDrawerApi.close();
  },
  async onOpenChange() {},
});
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建访客 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑访客 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.visitorName]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.visitorId !== row.visitorId,
    );
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.visitorName]));
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
      (v) => !checkedIds.value.includes(v.visitorId),
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
  checkedIds.value = records.map((item) => item.visitorId);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {}, // 保留详情对象用于传递给组件
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeName.value === '全部') {
        return true;
      }
      return v.status === activeName.value;
    })
    .slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  return dataObj;
};

const [QueryForm] = useVbenForm({
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
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
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
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'visitorId',
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
// 修改打开详情的方法，调用组件的open方法
const handleOpenDetail = (row) => {
  selectedVisitor.value = row;
  // 通过ref调用组件的open方法
  detailDrawerRef.value.open();
};
const tabsData = ref([
  { label: '全部' },
  { label: '待审核' },
  { label: '已通过' },
  { label: '已拒绝' },
  { label: '已结束' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
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
const handleOpenPermission = (row) => {
  selectedVisitor.value = row;
  permissionDrawerApi.open();
};
const handleOpenRecord = (row) => {
  selectedVisitor.value = row;
  recordDrawerApi.open();
};
// 定义组件ref，用于调用组件方法
const detailDrawerRef = ref(null);

// 详情关闭处理
const handleDetailClose = () => {
  selectedVisitor.value = null;
};

// 定义详情抽屉的字段配置
const detailFields = [
  { label: '访客ID', key: 'visitorId' },
  { label: '访客姓名', key: 'visitorName' },
  { label: '手机号', key: 'phone' },
  { label: '身份证号', key: 'idCard' },
  { label: '车牌号码', key: 'plateNumber' },
  { label: '访问资源', key: 'visitAssetId' },
  { label: '访问事由', key: 'visitReason' },
  { label: '拜访对象', key: 'visitObject' },
  { label: '访问时间', key: 'visitTime' },
  { label: '离开时间', key: 'leaveTime' },
  { label: '预计停留时长', key: 'expectedStayTime' },
  {
    label: '状态',
    key: 'status',
    type: 'tag',
    tagType: (status) => {
      if (status === '待审核') return 'warning';
      if (status === '已通过') return 'success';
      if (status === '已拒绝') return 'danger';
      if (status === '已结束') return 'info';
      return 'info';
    },
  },
  { label: '审核人', key: 'approveBy' },
  { label: '审核时间', key: 'approveTime' },
  { label: '创建时间', key: 'createTime' },
  { label: '备注', key: 'remark' },
];
</script>
<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!-- 使用封装后的详情抽屉组件 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :data="selectedVisitor"
      :fields="detailFields"
      :title="`${selectedVisitor?.visitorName || '访客详情'}`"
      @close="handleDetailClose"
    />
    <!-- 权限抽屉 -->
    <PermissionDrawerComp>
      <PermissionDrawer
        :visitor="selectedVisitor"
        @close="permissionDrawerApi.close"
      />
    </PermissionDrawerComp>
    <!-- 记录抽屉 -->
    <RecordDrawerComp>
      <RecordDrawer :visitor="selectedVisitor" @close="recordDrawerApi.close" />
    </RecordDrawerComp>
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
                :label="createLabel(item)"
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
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              disabled: isEmpty(checkedIds),
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
      <template #visitorName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.visitorName }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === '待审核'" type="warning" size="small">
          {{ row.status }}
        </el-tag>
        <el-tag v-else-if="row.status === '已通过'" type="success" size="small">
          {{ row.status }}
        </el-tag>
        <el-tag v-else-if="row.status === '已拒绝'" type="danger" size="small">
          {{ row.status }}
        </el-tag>
        <el-tag v-else-if="row.status === '已结束'" type="info" size="small">
          {{ row.status }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '详情',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleOpenDetail.bind(null, row),
            },
            {
              label: '编辑',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '删除',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.visitorName]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
          :drop-down-actions="[
            {
              label: '权限',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.KEY,
              onClick: handleOpenPermission.bind(null, row),
            },
            {
              label: '记录',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.RECORD,
              onClick: handleOpenRecord.bind(null, row),
            },
          ]"
        />
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：访客数量5;已通过3;待审核2 </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
