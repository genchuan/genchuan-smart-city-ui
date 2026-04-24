<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCouponMgmt,
  exportCouponMgmt,
  getCouponMgmtPage,
  updateCouponMgmt,
} from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { formatDate } from '#/utils/genchuan/formatTime';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import ResendConfirmDialog from '../components/ResendConfirmDialog.vue';
import SendCouponDialog from '../components/SendCouponDialog.vue';
import VerifyConfirmDialog from '../components/VerifyConfirmDialog.vue';
import {
  dataList,
  detailFields,
  getCouponStatusLabel,
  getCouponStatusTagType,
  getCouponTypeLabel,
  getCouponTypeTagType,
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
const importExcelDialogRef = ref(null);
const sendCouponDialogRef = ref(null);
const verifyConfirmDialogRef = ref(null);
const resendConfirmDialogRef = ref(null);
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
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    try {
      if (formData.value?.id) {
        await updateCouponMgmt({ ...values, id: formData.value.id });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      } else {
        await createCouponMgmt(values);
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error(
        formData.value?.id
          ? $t('ui.actionMessage.editFailed')
          : $t('ui.actionMessage.addFailed'),
      );
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

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterType.value = '';
  filterStatus.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const response = await exportCouponMgmt();
    // 处理文件下载
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = textObj.excelAllName;
    document.body.append(link);
    link.click();
    link.remove();
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

/** 创建 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 打开导入弹窗 */
function handleImport() {
  if (importExcelDialogRef.value) {
    importExcelDialogRef.value.open();
  }
}

/** 打开发放弹窗 */
function handleSend(row) {
  if (sendCouponDialogRef.value) {
    sendCouponDialogRef.value.open(row);
  }
}

/** 打开核销确认弹窗 */
function handleVerify(row) {
  if (verifyConfirmDialogRef.value) {
    verifyConfirmDialogRef.value.open(row);
  }
}

/** 打开重新发放确认弹窗 */
function handleResend(row) {
  if (resendConfirmDialogRef.value) {
    resendConfirmDialogRef.value.open(row);
  }
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除这条数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    // 删除接口未在文档中定义，使用模拟删除
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
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
const filterType = ref('');
const filterStatus = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  searchParams: {},
  useStaticData: true,
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  try {
    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      status: filterStatus.value || dataObj.searchParams.status,
      amount: dataObj.searchParams.amount,
      useCondition: dataObj.searchParams.useCondition,
      senderName: dataObj.searchParams.senderName,
      receiverName: dataObj.searchParams.receiverName,
    };

    // 处理有效期范围
    if (
      dataObj.searchParams.validTime &&
      dataObj.searchParams.validTime.length === 2
    ) {
      queryParams.validTimeStart = dataObj.searchParams.validTime[0];
      queryParams.validTimeEnd = dataObj.searchParams.validTime[1];
    }

    // 处理创建时间范围
    if (
      dataObj.searchParams.createTime &&
      dataObj.searchParams.createTime.length === 2
    ) {
      queryParams.createTimeStart = dataObj.searchParams.createTime[0];
      queryParams.createTimeEnd = dataObj.searchParams.createTime[1];
    }

    // 处理发放时间范围
    if (
      dataObj.searchParams.sendTime &&
      dataObj.searchParams.sendTime.length === 2
    ) {
      queryParams.sendTimeStart = dataObj.searchParams.sendTime[0];
      queryParams.sendTimeEnd = dataObj.searchParams.sendTime[1];
    }

    // 处理核销时间范围
    if (
      dataObj.searchParams.verifyTime &&
      dataObj.searchParams.verifyTime.length === 2
    ) {
      queryParams.verifyTimeStart = dataObj.searchParams.verifyTime[0];
      queryParams.verifyTimeEnd = dataObj.searchParams.verifyTime[1];
    }

    const response = await getCouponMgmtPage(queryParams);
    if (response && response.list && response.list.length > 0) {
      dataObj.useStaticData = false;
      dataObj.total = response.total;
      dataObj.apilist = response.list.map((item) => ({
        ...item,
        createTimeStr: formatDate(item.createTime),
        updateTimeStr: formatDate(item.updateTime),
        sendTimeStr: formatDate(item.sendTime),
        verifyTimeStr: formatDate(item.verifyTime),
        validTimeStr: formatDate(item.validTime),
      }));
    } else {
      // 接口返回为空，使用静态数据
      console.log('分页接口返回为空，使用静态数据');
      const staticData = dataList();
      dataObj.apilist = staticData;
      dataObj.total = staticData.length;
    }
  } catch (error) {
    // 接口调用失败，错误信息打印到控制台，使用静态数据
    console.error('分页接口调用失败，使用静态数据:', error);
    const staticData = dataList();
    dataObj.apilist = staticData;
    dataObj.total = staticData.length;
  }

  // 根据searchParams和快捷筛选变量筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (
        value &&
        !['createTime', 'sendTime', 'validTime', 'verifyTime'].includes(key)
      ) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });
    // 应用快捷筛选变量
    if (filterType.value && v.type !== filterType.value) {
      searchMatch = false;
    }
    if (filterStatus.value && v.status !== filterStatus.value) {
      searchMatch = false;
    }
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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

// 处理券名称点击 - 打开详情
const handleNameClick = (row) => {
  handleOpenDetail(row);
};

// ==================== 快捷筛选处理 ====================

// 处理券类型点击
const handleTypeClick = (row) => {
  filterType.value = filterType.value === row.type ? '' : row.type;
  gridApi.query();
};

// 处理券状态点击
const handleStatusClick = (row) => {
  filterStatus.value = filterStatus.value === row.status ? '' : row.status;
  gridApi.query();
};

// 取消筛选
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

// 处理发放人点击 - 跳转操作人员详情
const handleSenderClick = (row) => {
  ElMessage.info(`查看操作人员详情: ${row.senderName}`);
};

// 处理领取人点击 - 跳转用户详情
const handleReceiverClick = (row) => {
  ElMessage.info(`查看用户详情: ${row.receiverName}`);
};

/** 处理统计组件的钻取筛选 */
function handleStatsFilter(filterSource, filterValue) {
  switch (filterSource) {
    case 'card': {
      // 点击卡片
      if (filterValue === 'send') {
        ElMessage.info('按发放量筛选');
      } else if (filterValue === 'verify') {
        ElMessage.info('按核销率筛选');
      }

      break;
    }
    case 'date': {
      // 点击折线图 - 按日期筛选
      ElMessage.info(`筛选日期: ${filterValue}`);

      break;
    }
    case 'type': {
      // 点击柱状图 - 按券类型筛选
      dataObj.searchParams = { ...dataObj.searchParams, type: filterValue };
      gridApi.query();

      break;
    }
    // No default
  }
}

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});

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
      :title="`${dataObj.detailObj.name || '优惠券'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!-- 导入弹窗 -->
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <!-- 发放弹窗 -->
    <SendCouponDialog ref="sendCouponDialogRef" @success="handleRefresh" />
    <!-- 核销确认弹窗 -->
    <VerifyConfirmDialog
      ref="verifyConfirmDialogRef"
      @success="handleRefresh"
    />
    <!-- 重新发放确认弹窗 -->
    <ResendConfirmDialog
      ref="resendConfirmDialogRef"
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
          <!-- 券类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            券类型：{{ getCouponTypeLabel(filterType) }}
          </ElTag>
          <!-- 券状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="success"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            券状态：{{ getCouponStatusLabel(filterStatus) }}
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
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
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
      <!-- 券名称插槽 - 点击跳转优惠券详情弹窗 -->
      <template #name="{ row }">
        <el-text
          @click="handleNameClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 券类型插槽 - 点击筛选同类型 -->
      <template #type="{ row }">
        <ElTag
          :type="getCouponTypeTagType(row.type)"
          style="cursor: pointer"
          @click="handleTypeClick(row)"
        >
          {{ getCouponTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 券状态插槽 - 点击筛选同状态 -->
      <template #status="{ row }">
        <ElTag
          :type="getCouponStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleStatusClick(row)"
        >
          {{ getCouponStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 发放人插槽 - 点击跳转操作人员详情 -->
      <template #senderName="{ row }">
        <el-text
          v-if="row.senderName"
          @click="handleSenderClick(row)"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.senderName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 领取人插槽 - 点击跳转用户详情 -->
      <template #receiverName="{ row }">
        <el-text
          v-if="row.receiverName"
          @click="handleReceiverClick(row)"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.receiverName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="row.status === '0'"
            content="发放"
            icon-name="Promotion"
            @click="handleSend(row)"
          />
          <IconButton
            v-if="row.status === '1'"
            content="核销"
            icon-name="Check"
            @click="handleVerify(row)"
          />
          <IconButton
            v-if="row.status === '2' || row.status === '3'"
            content="重新发放"
            icon-name="RefreshRight"
            @click="handleResend(row)"
          />
          <IconButton
            v-if="row.status === '0'"
            content="编辑"
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
          <span> 本页统计：优惠券数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
