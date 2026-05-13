<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';

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
import { getStationInfoDetail } from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { formatDate } from '#/utils/genchuan/formatTime';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import ResendConfirmDialog from '../components/ResendConfirmDialog.vue';
import SendCouponDialog from '../components/SendCouponDialog.vue';
import VerifyConfirmDialog from '../components/VerifyConfirmDialog.vue';
import {
  detailFields,
  dynamicStationOptions,
  fetchStationOptions,
  getCurrentStationOptions,
  getCouponStatusLabel,
  getCouponStatusTagType,
  getCouponTypeLabel,
  getCouponTypeTagType,
  getStationNamesByIds,
  stationDetailFields,
  stationOptions,
  textObj,
  useEditFormSchema,
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
const stationDetailDrawerRef = ref(null);
const importExcelDialogRef = ref(null);
const sendCouponDialogRef = ref(null);
const verifyConfirmDialogRef = ref(null);
const resendConfirmDialogRef = ref(null);
const formData = ref();
const stationDetailData = ref([]);
const stationDetailTitle = ref('场站详情');

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

    // 处理场站数据
    let submitStationIds = values.stationIds;

    // 将stationIds数组转换为逗号分隔的字符串
    if (Array.isArray(submitStationIds)) {
      submitStationIds = submitStationIds.join(',');
    }

    // 处理提交数据
    const submitData = {
      ...values,
      stationIds: submitStationIds,
    };

    try {
      if (formData.value?.id) {
        await updateCouponMgmt({ ...submitData, id: formData.value.id });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      } else {
        await createCouponMgmt(submitData);
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

      // 确保场站数据已加载（如果还未加载或加载失败）
      if (dynamicStationOptions.value.length === 0) {
        await fetchStationOptions();
      }

      // 动态更新场站选项到表单组件
      const currentStationOptions = getCurrentStationOptions();
      await formApi.updateSchema([
        {
          fieldName: 'stationIds',
          componentProps: {
            options: currentStationOptions,
          },
        },
      ]);

      if (formData.value?.id) {
        // 编辑模式：将stationIds字符串转换为数组以支持多选回显
        const editData = { ...formData.value };
        if (editData.stationIds && typeof editData.stationIds === 'string') {
          editData.stationIds = editData.stationIds.split(',');
        }
        await formApi.setValues(editData);
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
  filterDate.value = '';
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
async function handleCreate() {
  // 切换到新增表单schema（所有字段可编辑）
  await formApi.setState({ schema: useFormSchema() });
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑 */
async function handleEdit(row) {
  // 切换到编辑表单schema（核心字段不可编辑）
  await formApi.setState({ schema: useEditFormSchema() });
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
const filterDate = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  searchParams: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;

  // 构建查询参数 - 直接使用 searchParams 中的值，RangePicker 返回的数组会自动转换为同名字段传给后端
  const queryParams = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    name: dataObj.searchParams.name,
    type: filterType.value || dataObj.searchParams.type,
    status: filterStatus.value || dataObj.searchParams.status,
    date: filterDate.value || dataObj.searchParams.date,
    amount: dataObj.searchParams.amount,
    useCondition: dataObj.searchParams.useCondition,
    senderName: dataObj.searchParams.senderName,
    receiverName: dataObj.searchParams.receiverName,
    // RangePicker 返回数组格式 [start, end]，后端会接收为两个同名参数
    createTime:
      !dataObj.searchParams.createTime ? undefined : dataObj.searchParams.createTime,
    sendTime:
      !dataObj.searchParams.sendTime ? undefined : dataObj.searchParams.sendTime,
    verifyTime:
      !dataObj.searchParams.verifyTime ? undefined : dataObj.searchParams.verifyTime,
    validTime:
      !dataObj.searchParams.validTime ? undefined : dataObj.searchParams.validTime,
  };

  const response = await getCouponMgmtPage(queryParams);
  if (response && response.list) {
    dataObj.total = response.total;
    dataObj.list = response.list.map((item) => ({
      ...item,
      createTimeStr: formatDate(item.createTime),
      updateTimeStr: formatDate(item.updateTime),
      sendTimeStr: formatDate(item.sendTime),
      verifyTimeStr: formatDate(item.verifyTime),
      validTimeStr: formatDate(item.validTime),
      // 优先使用后端接口返回的 stationNames，如果没有则使用本地函数作为回退
      stationNames:
        item.stationNames || getStationNamesByIds(item.stationIds),
    }));
    dataObj.apilist = dataObj.list;
  } else {
    // 接口返回为空或无数据，清空列表
    dataObj.total = 0;
    dataObj.list = [];
    dataObj.apilist = [];
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
  dataObj.searchParams = { ...values };
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

// 处理场站点击 - 打开场站详情弹窗，展示多个场站的详情
async function handleStationClick(stationIds) {
  if (!stationIds) {
    ElMessage.warning('该优惠券未配置适用场站');
    return;
  }

  const stationIdArr = stationIds.split(',').filter((id) => id.trim());
  if (stationIdArr.length === 0) {
    ElMessage.warning('该优惠券未配置适用场站');
    return;
  }

  try {
    const loadingInstance = ElLoading.service({
      text: '正在加载场站详情...',
    });

    // 并发请求所有场站详情
    const detailPromises = stationIdArr.map((id) =>
      getStationInfoDetail(Number(id.trim())).catch((error) => {
        console.error(`获取场站ID ${id} 详情失败:`, error);
        return null;
      }),
    );

    const detailResults = await Promise.all(detailPromises);

    // 过滤掉请求失败的
    const formattedDetails = detailResults.filter(
      (detail) => detail && detail.id,
    );

    loadingInstance.close();

    if (formattedDetails.length === 0) {
      ElMessage.error('未能获取到任何场站详情');
      return;
    }

    // 设置数据并更新标题
    stationDetailData.value = formattedDetails;
    stationDetailTitle.value = `适用场站 (${formattedDetails.length}个)`;

    // 使用nextTick确保DOM更新后再打开抽屉
    await nextTick();
    if (stationDetailDrawerRef.value) {
      stationDetailDrawerRef.value.open();
    } else {
      console.error('场站详情抽屉组件未找到');
      ElMessage.error('打开详情失败，请重试');
    }
  } catch (error) {
    console.error('获取场站详情失败:', error);
    ElMessage.error('获取场站详情失败');
  }
}

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

const handleCancelDateFilter = () => {
  filterDate.value = '';
  gridApi.query();
};

/** 处理统计组件的钻取筛选 */
function handleStatsFilter(filterSource, filterValue) {
  switch (filterSource) {
    case 'card': {
      // 点击卡片
      if (filterValue === 'send') {
        // 按发放量筛选（暂时不做特殊处理）
        ElMessage.info('按发放量筛选');
      } else if (filterValue === 'verify') {
        // 累计核销率卡片 - 筛选"已使用"状态的券
        // "已使用"状态的字典值为 '2'
        filterStatus.value = filterStatus.value === '2' ? '' : '2';
        gridApi.query();
      }

      break;
    }
    case 'date': {
      // 点击折线图 - 按日期筛选
      filterDate.value = filterDate.value === filterValue ? '' : filterValue;
      gridApi.query();

      break;
    }
    case 'type': {
      // 点击柱状图 - 按券类型筛选
      filterType.value = filterType.value === filterValue ? '' : filterValue;
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

// 页面加载时获取场站列表
onMounted(async () => {
  await fetchStationOptions();
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
    <!--   场站详情抽屉 - 展示多个场站详情-->
    <DetailDrawer
      ref="stationDetailDrawerRef"
      :title="stationDetailTitle"
      :data="stationDetailData"
      :fields="stationDetailFields"
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
          <!-- 日期筛选标签 -->
          <ElTag
            v-if="filterDate"
            type="warning"
            closable
            @close="handleCancelDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            发放日期：{{ filterDate }}
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
      <!-- 适用场站插槽 - 点击打开场站详情弹窗 -->
      <template #stationNames="{ row }">
        <el-text
          v-if="row.stationIds"
          @click="handleStationClick(row.stationIds)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationNames }}
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
            v-if="row.status === '3'"
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
