<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
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

/** 确认禁用用户 */
async function confirmDisable(row) {
  try {
    await ElMessageBox.confirm(
      `确定要禁用商户"${row.merchantName}"吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    // 用户确认后执行禁用操作
    await handleDisable(row);
  } catch {
    // 用户取消操作，不执行任何操作
  }
}
async function handleDisable(row) {
  const loadingInstance = ElLoading.service({
    text: `正在禁用商户"${row.merchantName}"...`,
  });
  try {
    // 更新数据源中的对应数据
    const index = dataObj.apilist.findIndex(v => v.merchantId === row.merchantId);
    if (index !== -1) {
      dataObj.apilist[index].status = '禁用';
      // 同时更新当前行的状态，确保UI实时更新
      row.status = '禁用';
      ElMessage.success(`商户"${row.merchantName}"禁用成功`);
      handleRefresh();
    }
  } finally {
    loadingInstance.close();
  }
}
/** 删除商户 */
// async function handleDelete(row) {
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deleting', [row.merchantName]),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter(
//       (v) => v.merchantId !== row.merchantId,
//     );
//     ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.merchantName]));
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

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
// async function handleStatusChange(row) {
//   // 获取新状态
//   const newStatus = row.status;
//   // 保存旧状态，用于用户取消时恢复
//   const oldStatus = newStatus === '正常' ? '停业' : '正常';
//   // 显示确认对话框
//   try {
//     await confirm(
//       $t(`确定将商户 ${row.merchantName} 的状态切换为 ${newStatus} 吗？`),
//     );
//     const loadingInstance = ElLoading.service({
//       text: $t('ui.actionMessage.updating', [row.merchantName]),
//     });
//     try {
//       // 更新数据源
//       const index = dataObj.apilist.findIndex(
//         (v) => v.merchantId === row.merchantId,
//       );
//       if (index !== -1) {
//         dataObj.apilist[index].status = newStatus;
//         ElMessage.success(
//           $t('ui.actionMessage.updateSuccess', [row.merchantName]),
//         );
//         handleRefresh();
//       }
//     } finally {
//       loadingInstance.close();
//     }
//   } catch {
//     // 用户取消确认，恢复旧状态
//     row.status = oldStatus;
//   }
// }

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.merchantId);
}

// 保存搜索条件
const searchFormData = ref({});

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
  
  // 根据状态和搜索条件过滤数据
  const filteredData = dataObj.apilist.filter((v) => {
    // 状态过滤
    if (statusActiveName.value !== '全部' && v.status !== statusActiveName.value) {
      return false;
    }
    
    // 搜索条件过滤
    for (const [key, value] of Object.entries(searchFormData.value)) {
      if (value) {
        const fieldValue = v[key];
        if (fieldValue) {
          if (key === 'businessScope') {
            // 处理经营范围字段，它是数组类型
            if (Array.isArray(fieldValue)) {
              // 检查数组中是否有任何一个元素包含搜索值
              if (!fieldValue.some(scope => scope.includes(value))) {
                return false;
              }
            } else if (typeof fieldValue === 'string') {
              // 兼容字符串类型
              if (!fieldValue.includes(value)) {
                return false;
              }
            } else {
              return false;
            }
          } else if (typeof fieldValue === 'string') {
            if (!fieldValue.includes(value)) {
              return false;
            }
          } else if (fieldValue !== value) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    
    return true;
  });
  
  dataObj.total = filteredData.length;
  dataObj.list = filteredData.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm, queryFormApi] = useVbenForm({
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
  // 获取表单值并保存到搜索条件
  searchFormData.value = queryFormApi.form.values;
  // 关闭抽屉
  drawerApi.close();
  // 刷新表格数据
  handleRefresh();
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
  { label: '禁用', value: '禁用' },
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
      <!-- 账号状态插槽 -->
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '正常'
              ? 'success'
              : row.status === '禁用'
                ? 'danger'
                : row.status === '注销'
                  ? 'warning'
                  : 'info'
          "
        >
          {{ row.status }}
        </el-tag>
      </template>
      <!--      <template #status="{ row }">-->
      <!--        <div class="status-cell">-->
      <!--          <el-switch-->
      <!--            v-if="row.status !== '注销'"-->
      <!--            v-model="row.status"-->
      <!--            active-value="正常"-->
      <!--            inactive-value="停业"-->
      <!--            active-color="#13ce66"-->
      <!--            inactive-color="#f56c6c"-->
      <!--            @change="handleStatusChange(row)"-->
      <!--          />-->
      <!--          <el-tag v-else type="danger">-->
      <!--            {{ row.status }}-->
      <!--          </el-tag>-->
      <!--        </div>-->
      <!--      </template>-->
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
          <!--          <IconButton-->
          <!--            content="删除"-->
          <!--            icon-name="delete"-->
          <!--            color="#F56C6C"-->
          <!--            @click="handleDelete(row)"-->
          <!--          />-->
          <IconButton
            content="禁用"
            icon-name="Lock"
            color="#F56C6C"
            :disabled="row.status !== '正常'"
            @click="confirmDisable(row)"
          />
          <IconButton
            content="权限"
            icon-name="key"
            @click="handleOpenPermission(row)"
          />
          <IconButton
            content="结算"
            icon-name="Ticket"
            @click="handleOpenSettlement(row)"
          />
        </div>
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
            }};禁用:{{
              dataObj.list.filter((item) => item.status === '禁用').length
            }};注销:{{
              dataObj.list.filter((item) => item.status === '注销').length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：商户数量{{ dataObj.apilist.length }};正常:{{
              dataObj.apilist.filter((item) => item.status === '正常').length
            }};禁用:{{
              dataObj.apilist.filter((item) => item.status === '禁用').length
            }};注销:{{
              dataObj.apilist.filter((item) => item.status === '注销').length
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
