<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import UnbindDrawer from '../components/UnbindDrawer.vue';
import UpdateStatusDrawer from '../components/UpdateStatusDrawer.vue';
import {
  dataList,
  detailFields,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});
const getTitle = computed(() => {
  return formData.value?.deviceId ? textObj.editText : textObj.addText;
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
const formData = ref();

// 解绑抽屉
const [UnbindDrawerComp, unbindDrawerApi] = useVbenDrawer({
  title: '解绑设备',
  placement: 'right',
  width: '500px',
  appendToMain: true,
  modal: false,
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() {
    unbindDrawerApi.close();
  },
  async onConfirm() {
    // 触发抽屉组件的提交事件
    unbindDrawerRef.value?.handleSubmit();
  },
  async onOpenChange(isOpen) {
    if (!isOpen && unbindDrawerRef.value?.formApi) {
      unbindDrawerRef.value.formApi.resetForm();
    }
  },
});

// 更新状态抽屉
const [UpdateStatusDrawerComp, updateStatusDrawerApi] = useVbenDrawer({
  title: '更新设备状态',
  placement: 'right',
  width: '500px',
  appendToMain: true,
  modal: false,
  showFooter: true,
  confirmText: '确认',
  cancelText: '取消',
  onCancel() {
    updateStatusDrawerApi.close();
  },
  async onConfirm() {
    // 触发抽屉组件的提交事件
    updateStatusDrawerRef.value?.handleSubmit();
  },
  async onOpenChange(isOpen) {
    if (!isOpen && updateStatusDrawerRef.value?.formApi) {
      updateStatusDrawerRef.value.formApi.resetForm();
    }
  },
});

// 抽屉引用
const unbindDrawerRef = ref(null);
const updateStatusDrawerRef = ref(null);

// 抽屉数据
const unbindRow = ref({});
const updateStatusRow = ref({});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
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
        if (v.deviceId === formData.value?.deviceId) {
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
      if (formData.value?.deviceId) {
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

/** 创建设备 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑设备 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}
// async function handleDelete(row) {
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deleting', [row.deviceTypeName]),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter(
//       (v) => v.deviceId !== row.deviceId,
//     );
//     ElMessage.success(
//       $t('ui.actionMessage.deleteSuccess', [row.deviceTypeName]),
//     );
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.deviceId),
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
  checkedIds.value = records.map((item) => item.deviceId);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
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

  // 根据activeName和筛选条件筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    switch (activeName.value) {
      case '在线': {
        statusMatch = v.deviceStatusName === '在线';
        break;
      }
      case '故障': {
        statusMatch = v.deviceStatusName === '故障';
        break;
      }
      case '离线': {
        statusMatch = v.deviceStatusName === '离线';
        break;
      }
      case '维护中': {
        statusMatch = v.deviceStatusName === '维护中';
        break;
      }
    }

    // 设备类型筛选
    const deviceTypeMatch =
      !filterDeviceType.value || v.deviceTypeName === filterDeviceType.value;

    // 所属资产筛选
    const assetNameMatch =
      !filterAssetName.value || v.assetName === filterAssetName.value;

    return statusMatch && deviceTypeMatch && assetNameMatch;
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
  schema: useFormSchema().map((v) => {
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
      keyField: 'deviceId',
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
const filterDeviceType = ref(''); // 设备类型筛选：空=未筛选，有值=当前筛选设备类型
const filterAssetName = ref(''); // 所属资产筛选：空=未筛选，有值=当前筛选所属资产

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 修改tabsData为五个标签：全部、在线、离线、故障、维护中
const tabsData = ref([
  { label: '全部' },
  { label: '在线' },
  { label: '离线' },
  { label: '故障' },
  { label: '维护中' },
]);

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  switch (item.label) {
    case '全部': {
      count = dataObj.apilist.length;

      break;
    }
    case '在线': {
      // 统计deviceStatusName为'在线'的数据
      count = dataObj.apilist.filter(
        (v) => v.deviceStatusName === '在线',
      ).length;

      break;
    }
    case '故障': {
      // 统计deviceStatusName为'故障'的数据
      count = dataObj.apilist.filter(
        (v) => v.deviceStatusName === '故障',
      ).length;

      break;
    }
    case '离线': {
      // 统计deviceStatusName为'离线'的数据
      count = dataObj.apilist.filter(
        (v) => v.deviceStatusName === '离线',
      ).length;

      break;
    }
    case '维护中': {
      // 统计deviceStatusName为'维护中'的数据
      count = dataObj.apilist.filter(
        (v) => v.deviceStatusName === '维护中',
      ).length;

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

// 处理设备类型点击
const handleDeviceTypeClick = (deviceType) => {
  filterDeviceType.value =
    filterDeviceType.value === deviceType ? '' : deviceType;
  gridApi.query();
};

/** 取消设备类型筛选（筛选标签关闭按钮） */
const handleCancelDeviceTypeFilter = () => {
  filterDeviceType.value = '';
  gridApi.query();
};

// 处理所属资产点击
const handleAssetNameClick = (assetName) => {
  filterAssetName.value = filterAssetName.value === assetName ? '' : assetName;
  gridApi.query();
};

/** 取消所属资产筛选（筛选标签关闭按钮） */
const handleCancelAssetNameFilter = () => {
  filterAssetName.value = '';
  gridApi.query();
};

// 解绑按钮点击事件
function handleUnbind() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要解绑的设备');
    return;
  }
  if (checkedIds.value.length > 1) {
    ElMessage.warning('请选择单个设备进行解绑');
    return;
  }
  const selectedRow = dataObj.apilist.find(
    (item) => item.deviceId === checkedIds.value[0],
  );
  if (selectedRow) {
    unbindRow.value = selectedRow;
    unbindDrawerApi.open();
  }
}

// 解绑提交事件
function handleUnbindSubmit(values) {
  // 找到要解绑的设备并更新其所属资产字段
  const deviceIndex = dataObj.apilist.findIndex(
    (item) => item.deviceId === unbindRow.value.deviceId,
  );
  if (deviceIndex !== -1) {
    dataObj.apilist[deviceIndex].assetName = '已解绑';
  }
  ElMessage.success('设备解绑成功');
  unbindDrawerApi.close();
  handleRefresh();
}

// 更新状态按钮点击事件
function handleUpdateStatus(row) {
  updateStatusRow.value = row;
  updateStatusDrawerApi.open();
}

// 更新状态提交事件
function handleUpdateStatusSubmit(values) {
  // 找到要更新状态的设备并更新其状态字段
  const deviceIndex = dataObj.apilist.findIndex(
    (item) => item.deviceId === updateStatusRow.value.deviceId,
  );
  if (deviceIndex !== -1) {
    dataObj.apilist[deviceIndex].deviceStatusName = values.newStatus;
  }
  ElMessage.success('设备状态更新成功');
  updateStatusDrawerApi.close();
  handleRefresh();
}

// 状态标签类型映射
const getStatusType = (status) => {
  switch (status) {
    case '在线': {
      return 'success';
    }
    case '故障': {
      return 'danger';
    }
    case '离线': {
      return 'info';
    }
    case '维护中': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.deviceTypeName}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!-- 解绑抽屉 -->
    <UnbindDrawerComp>
      <UnbindDrawer
        ref="unbindDrawerRef"
        :row="unbindRow"
        @close="unbindDrawerApi.close()"
        @submit="handleUnbindSubmit"
      />
    </UnbindDrawerComp>
    <!-- 更新状态抽屉 -->
    <UpdateStatusDrawerComp>
      <UpdateStatusDrawer
        ref="updateStatusDrawerRef"
        :row="updateStatusRow"
        @close="updateStatusDrawerApi.close()"
        @submit="handleUpdateStatusSubmit"
      />
    </UpdateStatusDrawerComp>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
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
          <!-- 设备类型筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterDeviceType"
            type="primary"
            closable
            @close="handleCancelDeviceTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            设备类型：{{ filterDeviceType }}
          </el-tag>
          <!-- 所属资产筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterAssetName"
            type="success"
            closable
            @close="handleCancelAssetNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属资产：{{ filterAssetName }}
          </el-tag>
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
            content="解绑"
            icon-name="Link"
            :disabled="isEmpty(checkedIds)"
            @click="handleUnbind"
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
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #deviceId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceId }}
        </el-text>
      </template>
      <template #deviceStatusName="{ row }">
        <el-tag :type="getStatusType(row.deviceStatusName)">
          {{ row.deviceStatusName }}
        </el-tag>
      </template>

      <!-- 设备类型插槽 -->
      <template #deviceTypeName="{ row }">
        <el-text
          @click="handleDeviceTypeClick(row.deviceTypeName)"
          class="common-align"
          type="primary"
        >
          {{ row.deviceTypeName }}
        </el-text>
      </template>

      <!-- 所属资产插槽 -->
      <template #assetName="{ row }">
        <el-text
          @click="handleAssetNameClick(row.assetName)"
          class="common-align"
          type="primary"
        >
          {{ row.assetName }}
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
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="更新状态"
            icon-name="Refresh"
            @click="handleUpdateStatus(row)"
          />
          <!--          <IconButton-->
          <!--            content="删除"-->
          <!--            icon-name="delete"-->
          <!--            color="#F56C6C"-->
          <!--            @click="handleDelete(row)"-->
          <!--          />-->
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
            本页统计：终端设备数量: 15; 在线: 10; 离线: 2; 故障: 2; 维护中: 1
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
