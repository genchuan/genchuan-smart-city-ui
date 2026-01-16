<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import PermissionDrawer from '../components/PermissionDrawer.vue';
import SettlementDrawer from '../components/SettlementDrawer.vue';
import {
  merchantDetailFields,
  merchantList,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});
const getTitle = computed(() => {
  return formData.value?.merchantId ? textObj.editText : textObj.addText;
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

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
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
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.merchantId === formData.value?.merchantId) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
    ElMessage.success('操作成功');
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.merchantId) {
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

/** 创建商户 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑商户 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 删除商户 */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.merchantName]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.merchantId !== row.merchantId,
    );
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.merchantName]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.merchantId),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 状态切换 */
async function handleStatusChange(row) {
  // 获取新状态
  const newStatus = row.status;
  // 保存旧状态，用于用户取消时恢复
  const oldStatus = newStatus === '正常' ? '停业' : '正常';
  // 显示确认对话框
  try {
    await confirm(
      $t(`确定将商户 ${row.merchantName} 的状态切换为 ${newStatus} 吗？`),
    );
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.updating', [row.merchantName]),
    });
    try {
      // 更新数据源
      const index = dataObj.apilist.findIndex(
        (v) => v.merchantId === row.merchantId,
      );
      if (index !== -1) {
        dataObj.apilist[index].status = newStatus;
        ElMessage.success(
          $t('ui.actionMessage.updateSuccess', [row.merchantName]),
        );
        handleRefresh();
      }
    } finally {
      loadingInstance.close();
    }
  } catch {
    // 用户取消确认，恢复旧状态
    row.status = oldStatus;
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.merchantId);
}

const dataObj = reactive({
  totalShow: false,
  total: merchantList.length,
  currentPage: 1,
  pageSize: 10,
  apilist: [...merchantList],
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
      if (statusActiveName.value === '全部') {
        return true;
      }
      return v.status === statusActiveName.value;
    }).length;
  dataObj.list = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (statusActiveName.value === '全部') {
        return true;
      }
      return v.status === statusActiveName.value;
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
      keyField: 'merchantId',
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

const statusActiveName = ref('全部');
const topTabsData = ref([
  { label: '全部', value: '全部' },
  { label: '正常', value: '正常' },
  { label: '停业', value: '停业' },
  { label: '注销', value: '注销' },
]);

const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.value).length})`;
  if (item.value === '全部') {
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

const selectedMerchant = ref(null);

const detailDrawerRef = ref(null);

const handleOpenDetail = (row) => {
  selectedMerchant.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleDetailClose = () => {
  selectedMerchant.value = null;
};

// 权限管理抽屉
const [PermissionDrawerWrapper, permissionDrawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(
    () => `权限管理 - ${selectedMerchant.value?.merchantName || '商户'}`,
  ),
  onCancel() {
    permissionDrawerApi.close();
  },
  async onOpenChange() {},
});

const handleOpenPermission = (row) => {
  selectedMerchant.value = row;
  permissionDrawerApi.open();
};

// 结算管理抽屉
const [SettlementDrawerWrapper, settlementDrawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(
    () => `结算管理 - ${selectedMerchant.value?.merchantName || '商户'}`,
  ),
  onCancel() {
    settlementDrawerApi.close();
  },
  async onOpenChange() {},
});

const handleOpenSettlement = (row) => {
  selectedMerchant.value = row;
  settlementDrawerApi.open();
};
</script>
<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :title="selectedMerchant?.merchantName || '商户详情'"
      :data="selectedMerchant"
      :fields="merchantDetailFields"
      @close="handleDetailClose"
      @confirm="handleDetailClose"
    />

    <!-- 权限管理抽屉 -->
    <PermissionDrawerWrapper>
      <PermissionDrawer
        v-if="selectedMerchant"
        :merchant="selectedMerchant"
        @close="permissionDrawerApi.close"
      />
    </PermissionDrawerWrapper>

    <!-- 结算管理抽屉 -->
    <SettlementDrawerWrapper>
      <SettlementDrawer
        v-if="selectedMerchant"
        :merchant="selectedMerchant"
        @close="settlementDrawerApi.close"
      />
    </SettlementDrawerWrapper>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-title-container">
          <div v-if="props.secondShow" class="tabel-tabs-container">
            <!-- 商户状态标签页 -->
            <el-tabs
              v-model="statusActiveName"
              class="demo-tabs auth-status-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in topTabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.value"
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
      <template #merchantName="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.merchantName }}
        </el-text>
      </template>
      <template #settlementRatio="{ row }">
        {{ (row.settlementRatio * 100).toFixed(2) }}%
      </template>
      <template #status="{ row }">
        <div class="status-cell">
          <el-switch
            v-if="row.status !== '注销'"
            v-model="row.status"
            active-value="正常"
            inactive-value="停业"
            active-color="#13ce66"
            inactive-color="#f56c6c"
            @change="handleStatusChange(row)"
          />
          <el-tag v-else type="danger">
            {{ row.status }}
          </el-tag>
        </div>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleOpenDetail.bind(null, row),
            },
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.merchantName]),
                confirm: handleDelete.bind(null, row),
              },
            },
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.KEY,
              onClick: handleOpenPermission.bind(null, row),
            },
            {
              type: 'primary',
              link: true,
              icon: ACTION_ICON.MONEY,
              onClick: handleOpenSettlement.bind(null, row),
            },
          ]"
        />
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon">
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
          <span>
            本页统计：商户数量{{ dataObj.list.length }};正常:{{
              dataObj.list.filter((item) => item.status === '正常').length
            }};停业:{{
              dataObj.list.filter((item) => item.status === '停业').length
            }};注销:{{
              dataObj.list.filter((item) => item.status === '注销').length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：商户数量{{ dataObj.apilist.length }};正常:{{
              dataObj.apilist.filter((item) => item.status === '正常').length
            }};停业:{{
              dataObj.apilist.filter((item) => item.status === '停业').length
            }};注销:{{
              dataObj.apilist.filter((item) => item.status === '注销').length
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
