<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPointActivityDetail } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';
import {
  createPrizeMgmt,
  exportPrizeMgmt,
  getPrizeMgmtPage,
  updatePrizeMgmt,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/prizeMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { formatDate } from '#/utils/genchuan/formatTime';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  activityDetailFields,
  detailFields,
  dynamicActivityOptions,
  fetchActivityOptions,
  getCurrentActivityOptions,
  getPrizeStatusTagType,
  getPrizeTypeTagType,
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
const activityDetailDrawerRef = ref(null);
const importExcelDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
const formData = ref();
const activityDetailData = ref({});
const activityDetailTitle = ref('活动详情');

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
    const loadingInstance = ElLoading.service({
      text: formData.value?.id ? '保存中...' : '创建中...',
    });
    try {
      if (formData.value?.id) {
        await updatePrizeMgmt({ ...values, id: formData.value.id });
        ElMessage.success('编辑成功');
      } else {
        await createPrizeMgmt(values);
        ElMessage.success('创建成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error(error);
      ElMessage.error(formData.value?.id ? '编辑失败' : '创建失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();

      // 确保活动数据已加载（如果还未加载或加载失败）
      if (dynamicActivityOptions.value.length === 0) {
        await fetchActivityOptions();
      }

      // 动态更新活动选项到表单组件
      const currentActivityOptions = getCurrentActivityOptions();
      await formApi.updateSchema([
        {
          fieldName: 'activityId',
          componentProps: {
            options: currentActivityOptions,
          },
        },
      ]);

      if (formData.value?.id) {
        // 编辑模式：确保 activityId 是字符串类型以匹配选项的 value
        const editData = { ...formData.value };
        if (editData.activityId) {
          editData.activityId = String(editData.activityId);
        }
        // 使用 nextTick 确保选项更新完成后再设置值
        await nextTick();
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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportPrizeMgmt();
    downloadFileFromBlobPart({ fileName: '奖品数据.xlsx', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 创建 */
async function handleCreate() {
  // 设置表单schema（新增时使用初始库存标签）
  await formApi.setState({ schema: useFormSchema(false) });
  formDrawerApi
    .setData({
      title: textObj.addText,
      status: '1', // 默认启用
    })
    .open();
}

/** 编辑 */
async function handleEdit(row) {
  // 设置表单schema（编辑时使用当前库存标签）
  await formApi.setState({ schema: useFormSchema(true) });
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

/** 打开启用确认弹窗 */
function handleEnableConfirm(row) {
  if (statusConfirmDialogRef.value) {
    statusConfirmDialogRef.value.open(row, 'enable');
  }
}

/** 打开禁用确认弹窗 */
function handleDisableConfirm(row) {
  if (statusConfirmDialogRef.value) {
    statusConfirmDialogRef.value.open(row, 'disable');
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

  // 构建查询参数
  const queryParams = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    name: dataObj.searchParams.name,
    type: filterType.value || dataObj.searchParams.type,
    stock: dataObj.searchParams.stock,
    status: filterStatus.value || dataObj.searchParams.status,
    activityId: dataObj.searchParams.activityId,
    sendCount: dataObj.searchParams.sendCount,
    warnThreshold: dataObj.searchParams.warnThreshold,
  };

  // 处理创建时间范围
  if (
    dataObj.searchParams.createTime &&
    dataObj.searchParams.createTime.length === 2
  ) {
    queryParams.createTimeStart = dataObj.searchParams.createTime[0];
    queryParams.createTimeEnd = dataObj.searchParams.createTime[1];
  }

  const response = await getPrizeMgmtPage(queryParams);
  if (response && response.list) {
    dataObj.total = response.total;
    dataObj.list = response.list.map((item) => ({
      ...item,
      id: String(item.id),
      createTimeStr: formatDate(item.createTime),
      updateTimeStr: formatDate(item.updateTime),
      syncTimeStr: formatDate(item.syncTime),
    }));
  } else {
    // 接口返回为空或无数据，清空列表
    dataObj.total = 0;
    dataObj.list = [];
  }

  return dataObj;
};

const [QueryForm, searchFormApi] = useVbenForm({
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
    return { ...v };
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

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

// 处理绑定活动点击 - 打开活动详情弹窗
async function handleActivityClick(row) {
  if (!row.activityId) {
    ElMessage.warning('该奖品未绑定活动');
    return;
  }

  try {
    const loadingInstance = ElLoading.service({
      text: '正在加载活动详情...',
    });

    // 调用接口获取活动详情
    const activityDetail = await getPointActivityDetail(Number(row.activityId));

    loadingInstance.close();

    if (!activityDetail || !activityDetail.id) {
      ElMessage.error('未能获取到活动详情');
      return;
    }

    // 格式化时间字段，与 pointActivity 列表页保持一致
    const formattedDetail = {
      ...activityDetail,
      startTimeStr: formatDate(activityDetail.startTime),
      endTimeStr: formatDate(activityDetail.endTime),
      createTimeStr: formatDate(activityDetail.createTime),
      updateTimeStr: formatDate(activityDetail.updateTime),
      auditTimeStr: formatDate(activityDetail.auditTime),
    };

    // 设置数据并更新标题
    activityDetailData.value = formattedDetail;
    activityDetailTitle.value = `活动详情 - ${activityDetail.name || '未知'}`;

    // 使用nextTick确保DOM更新后再打开抽屉
    await nextTick();
    if (activityDetailDrawerRef.value) {
      activityDetailDrawerRef.value.open();
    } else {
      console.error('活动详情抽屉组件未找到');
      ElMessage.error('打开详情失败，请重试');
    }
  } catch (error) {
    console.error('获取活动详情失败:', error);
    ElMessage.error('获取活动详情失败');
  }
}

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 快捷筛选处理 ====================

// 处理奖品类型点击
const handleTypeClick = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理奖品状态点击
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
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

/** 获取奖品类型标签文本 */
function getTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取奖品状态标签文本 */
function getStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 处理统计组件的钻取筛选 */
function handleStatsFilter(filterSource, filterValue) {
  if (filterSource === 'type') {
    // 点击柱状图 - 按奖品类型筛选
    filterType.value = filterValue;
    gridApi.query();
  } else if (filterSource === 'card') {
    // 点击卡片
    if (filterValue === 'distribute') {
      // 点击累计发放量 - 可以按发放量排序或筛选
      ElMessage.info('按发放量筛选');
    } else {
      // 点击总奖品数 - 显示全部
      filterType.value = '';
      filterStatus.value = '';
      gridApi.query();
    }
  }
}

// 暴露方法给父组件
defineExpose({
  handleStatsFilter,
});

// 页面加载时获取活动列表
onMounted(async () => {
  await fetchActivityOptions();
  // 更新搜索表单的活动选项
  const currentActivityOptions = getCurrentActivityOptions();
  if (searchFormApi) {
    await searchFormApi.updateSchema([
      {
        fieldName: 'activityId',
        componentProps: {
          options: currentActivityOptions,
        },
      },
    ]);
  }
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.name || '奖品'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   活动详情抽屉 - 展示绑定活动的详细信息 -->
    <DetailDrawer
      ref="activityDetailDrawerRef"
      :title="activityDetailTitle"
      :data="activityDetailData"
      :fields="activityDetailFields"
    />
    <!-- 导入弹窗 -->
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <!-- 状态确认弹窗 -->
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
          <!-- 奖品类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="primary"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            奖品类型：{{ getTypeLabel(filterType) }}
          </ElTag>
          <!-- 奖品状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="success"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            奖品状态：{{ getStatusLabel(filterStatus) }}
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
      <!-- 奖品名称插槽 - 点击跳转奖品详情弹窗 -->
      <template #name="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 奖品类型插槽 - 点击筛选同类型奖品 -->
      <template #type="{ row }">
        <ElTag
          @click="handleTypeClick(row.type)"
          :type="getPrizeTypeTagType(row.type)"
          style="cursor: pointer"
        >
          {{ getTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 奖品状态插槽 - 点击筛选同状态奖品 -->
      <template #status="{ row }">
        <ElTag
          @click="handleStatusClick(row.status)"
          :type="getPrizeStatusTagType(row.status)"
          style="cursor: pointer"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 绑定活动插槽 - 点击打开关联活动详情弹窗 -->
      <template #activityName="{ row }">
        <el-text
          v-if="row.activityName"
          @click="handleActivityClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.activityName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 行操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="row.status === '0'"
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.status === '1'"
            content="启用"
            icon-name="CircleCheck"
            @click="handleEnableConfirm(row)"
          />
          <IconButton
            v-if="row.status === '0'"
            content="禁用"
            icon-name="CircleClose"
            color="#F56C6C"
            @click="handleDisableConfirm(row)"
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
          <span>
            本页统计：奖品数量: {{ dataObj.list.length }}; 启用:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 禁用:
            {{ dataObj.list.filter((v) => v.status === '0').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped></style>
