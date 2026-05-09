<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createExchangeCategory,
  exportExchangeCategory,
  getExchangeCategoryPage,
  updateExchangeCategory,
} from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeCategory';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  dataList,
  detailFields,
  getExchangeCategoryScopeLabel,
  getExchangeCategoryScopeTagType,
  getExchangeCategoryStatusLabel,
  getExchangeCategoryStatusTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';
import { downloadFileFromBlobPart } from '@vben/utils';

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
const importDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
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
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    // const loadingInstance = ElLoading.service({
    //   text: formData.value?.id ? '保存中...' : '新增中...',
    // });

    try {
      if (formData.value?.id) {
        await updateExchangeCategory({ ...values, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        await createExchangeCategory(values);
        ElMessage.success('新增成功');
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loadingInstance.close();
    }
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
  // 清除快捷筛选
  filterStatus.value = '';
  filterScope.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportExchangeCategory();
    downloadFileFromBlobPart({
      fileName: textObj.excelAllName,
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
    // 使用静态数据导出
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 导入 */
function handleImport() {
  importDialogRef.value?.open();
}

/** 创建 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 生效 */
function handleActivate(row) {
  statusConfirmDialogRef.value?.open(row, 'activate');
}

/** 禁用 */
function handleDisable(row) {
  statusConfirmDialogRef.value?.open(row, 'disable');
}

/** 启用 */
function handleEnable(row) {
  statusConfirmDialogRef.value?.open(row, 'enable');
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除这条数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    // 实际项目中应该调用删除API
    // await deleteExchangeCategory({ id: row.id });
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
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

// 快捷筛选变量
const filterStatus = ref('');
const filterScope = ref('');

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
const getTableData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 构建API请求参数
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      name: dataObj.searchParams.name,
      scope: filterScope.value || dataObj.searchParams.scope,
      status: filterStatus.value || dataObj.searchParams.status,
    };

    const response = await getExchangeCategoryPage(params);
    if (response) {
      console.log('========');
      console.log(response);
      const { list, total } = response;
      dataObj.total = total || 0;
      dataObj.list = list || [];
      return dataObj;
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据:', error);

    // 根据searchParams和快捷筛选变量筛选静态数据
    const filteredList = dataObj.apilist.filter((v) => {
      let searchMatch = true;
      Object.keys(dataObj.searchParams).forEach((key) => {
        const value = dataObj.searchParams[key];
        if (value && !['auditTime', 'createTime', 'effectTime'].includes(key)) {
          switch (key) {
            case 'goodsCountMax': {
              searchMatch = searchMatch && v.goodsCount <= value;

              break;
            }
            case 'goodsCountMin': {
              searchMatch = searchMatch && v.goodsCount >= value;

              break;
            }
            case 'sortMax': {
              searchMatch = searchMatch && v.sort <= value;

              break;
            }
            case 'sortMin': {
              searchMatch = searchMatch && v.sort >= value;

              break;
            }
            default: {
              searchMatch =
                typeof value === 'string'
                  ? searchMatch && v[key]?.toString().includes(value)
                  : searchMatch && v[key] === value;
            }
          }
        }
      });
      // 应用快捷筛选变量
      if (filterStatus.value && v.status !== filterStatus.value) {
        searchMatch = false;
      }
      if (filterScope.value && v.scope !== filterScope.value) {
        searchMatch = false;
      }
      return searchMatch;
    });

    dataObj.total = filteredList.length;
    dataObj.list = filteredList.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
  }
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
  schema: useSearchFormSchema(),
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

// ==================== 钻取筛选处理 ====================

// 处理类目状态点击
const handleFilterByStatus = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理适用范围点击
const handleFilterByScope = (scope) => {
  filterScope.value = filterScope.value === scope ? '' : scope;
  gridApi.query();
};

// 取消筛选
const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

// 取消适用范围筛选
const handleCancelScopeFilter = () => {
  filterScope.value = '';
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  // 清空之前的筛选
  dataObj.searchParams = {};
  filterStatus.value = '';
  filterScope.value = '';

  switch (type) {
    case 'card': {
      if (value === 'totalCategory') {
        // 总类目数 - 清空筛选，显示全部
        console.log('钻取：显示全部类目');
      } else if (value === 'totalGoods') {
        // 总商品数 - 可以筛选有商品的类目
        console.log('钻取：显示有商品的类目');
      }
      break;
    }
    case 'categoryId': {
      // 类目ID筛选 - 筛选特定类目
      dataObj.searchParams.id = value;
      console.log('钻取：筛选类目ID', value);
      break;
    }
    case 'status': {
      // 饼图点击 - 按类目状态筛选
      filterStatus.value = value;
      const statusName = getExchangeCategoryStatusLabel(value);
      ElMessage.info(`已筛选类目状态: ${statusName}`);
      break;
    }
    case 'scope': {
      // 柱状图点击 - 按适用范围筛选
      filterScope.value = value;
      const scopeName = getExchangeCategoryScopeLabel(value);
      ElMessage.info(`已筛选适用范围: ${scopeName}`);
      break;
    }
  }

  // 刷新表格
  gridApi.query();
};

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开类目详情弹窗 */
const handleOpenCategoryDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开商品明细弹窗 */
const handleOpenGoodsDetail = (row) => {
  ElMessage.info(`查看类目商品明细: ${row.name}，商品数量: ${row.goodsCount}`);
  // TODO: 实现商品明细弹窗
};

/** 打开操作人员详情弹窗 */
const handleOpenAuditorDetail = (row) => {
  if (row.auditorId) {
    ElMessage.info(`查看操作人员详情: ${row.auditorName}`);
    // TODO: 实现操作人员详情弹窗
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
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.name || '兑换类目'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   导入弹窗-->
    <ImportExcelDialog ref="importDialogRef" @success="handleRefresh" />
    <!--   状态确认弹窗-->
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 快捷筛选标签 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 类目状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="primary"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            类目状态：{{ getExchangeCategoryStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 适用范围筛选标签 -->
          <ElTag
            v-if="filterScope"
            type="success"
            closable
            @close="handleCancelScopeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用范围：{{ getExchangeCategoryScopeLabel(filterScope) }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导入" icon-name="Upload" @click="handleImport" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <!--          <IconButton-->
          <!--            content="批量删除"-->
          <!--            icon-name="delete"-->
          <!--            color="#F56C6C"-->
          <!--            :disabled="isEmpty(checkedIds)"-->
          <!--            @click="handleDeleteBatch"-->
          <!--          />-->
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
      <!-- 类目名称 - 点击跳转详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenCategoryDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 商品数量 - 点击跳转商品明细 -->
      <template #goodsCount="{ row }">
        <el-text
          @click="handleOpenGoodsDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.goodsCount }}
        </el-text>
      </template>
      <!-- 适用范围 - 点击筛选 -->
      <template #scopeName="{ row }">
        <ElTag
          :type="getExchangeCategoryScopeTagType(row.scope)"
          style="cursor: pointer"
          @click="handleFilterByScope(row.scope)"
        >
          {{ getExchangeCategoryScopeLabel(row.scope) }}
        </ElTag>
      </template>
      <!-- 类目状态 - 点击筛选同状态 -->
      <template #statusName="{ row }">
        <ElTag
          :type="getExchangeCategoryStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ getExchangeCategoryStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 创建时间 - 格式化显示 -->
      <template #createTime="{ row }">
        <span>{{
          row.createTime
            ? formatDate(
                new Date(Number(row.createTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 审核人 - 点击跳转操作人员详情 -->
      <template #auditorName="{ row }">
        <el-text
          v-if="row.auditorName"
          @click="handleOpenAuditorDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.auditorName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 审核时间 - 格式化显示 -->
      <template #auditTime="{ row }">
        <span>{{
          row.auditTime
            ? formatDate(new Date(Number(row.auditTime)), 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</span>
      </template>
      <!-- 生效时间 - 格式化显示 -->
      <template #effectTime="{ row }">
        <span>{{
          row.effectTime
            ? formatDate(
                new Date(Number(row.effectTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 未生效：生效、编辑、查看 -->
          <template v-if="row.status === '0'">
            <IconButton
              content="生效"
              icon-name="Check"
              @click="handleActivate(row)"
            />
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 已生效：禁用、编辑、查看 -->
          <template v-else-if="row.status === '1'">
            <IconButton
              content="禁用"
              icon-name="Close"
              @click="handleDisable(row)"
            />
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 已禁用：启用、查看 -->
          <template v-else-if="row.status === '2'">
            <IconButton
              content="启用"
              icon-name="RefreshRight"
              @click="handleEnable(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
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
          <span>
            本页统计：兑换类目数量: {{ dataObj.list.length }}; 已生效:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 未生效:
            {{ dataObj.list.filter((v) => v.status === '0').length }}; 已禁用:
            {{ dataObj.list.filter((v) => v.status === '2').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> {{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
