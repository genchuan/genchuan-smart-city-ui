<script setup>
import { computed, nextTick, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportPointLottery,
  getPointLotteryPage,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointLottery';
import { getPrizeMgmtDetail } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/prizeMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

import CheckDrawer from '../components/CheckDrawer.vue';
import {
  detailFields,
  getPointLotteryStatusTagType,
  getPointLotterySyncStatusTagType,
  textObj,
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

// 奖品详情字段配置
const prizeDetailFields = [
  { key: 'id', label: '奖品ID' },
  { key: 'name', label: '奖品名称' },
  {
    key: 'type',
    label: '奖品类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(value));
      return getDictTagTypeFromDict(dict, 'primary');
    },
  },
  { key: 'stock', label: '当前库存' },
  {
    key: 'status',
    label: '奖品状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(value));
      return getDictTagTypeFromDict(dict, 'info');
    },
  },
  { key: 'activityName', label: '绑定活动' },
  { key: 'sendCount', label: '发放量' },
  { key: 'warnThreshold', label: '预警阈值' },
  { key: 'description', label: '奖品描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'syncTimeStr', label: '同步时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];

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
const checkDrawerRef = ref(null);
const prizeDetailDrawerRef = ref(null);
const formData = ref();
const prizeDetailData = ref({ id: '' });

// 奖品详情标题计算属性
const prizeDetailTitle = computed(() => {
  return prizeDetailData.value?.name
    ? `${prizeDetailData.value.name}详情`
    : '奖品详情';
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: [],
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
    }
  },
});

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterStatus.value = '';
  filterSyncStatus.value = '';
  filterLotteryDate.value = '';
  filterStatsType.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportPointLottery();
    downloadFileFromBlobPart({
      fileName: '积分抽奖记录数据.xlsx',
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 打开核查抽屉 */
function handleCheck(row) {
  checkDrawerRef.value?.open(row);
}

/** 打开奖品详情抽屉 */
async function handleOpenPrizeDetail(row) {
  if (!row.prizeId) {
    ElMessage.warning('奖品ID不存在');
    return;
  }
  try {
    const prizeDetail = await getPrizeMgmtDetail(Number(row.prizeId));
    if (prizeDetail && prizeDetail.id) {
      // 格式化时间字段（处理null值）
      const formattedDetail = {
        ...prizeDetail,
        createTimeStr: prizeDetail.createTime
          ? formatDate(prizeDetail.createTime)
          : '-',
        syncTimeStr: prizeDetail.syncTime
          ? formatDate(prizeDetail.syncTime)
          : '-',
        updateTimeStr: prizeDetail.updateTime
          ? formatDate(prizeDetail.updateTime)
          : '-',
      };
      prizeDetailData.value = formattedDetail;
      // 使用nextTick确保DOM更新后再打开抽屉
      await nextTick();
      if (prizeDetailDrawerRef.value) {
        prizeDetailDrawerRef.value.open();
      } else {
        console.error('奖品详情抽屉组件未找到');
        ElMessage.error('打开详情失败，请重试');
      }
    } else {
      ElMessage.error('获取奖品详情失败');
    }
  } catch (error) {
    console.error('获取奖品详情失败:', error);
    ElMessage.error('获取奖品详情失败');
  }
}

/** 删除 - 已屏蔽 */
async function handleDelete(row) {
  // 功能已屏蔽
  ElMessage.info('删除功能暂未开放');
  console.log('删除', row);
}

/** 批量删除 - 已屏蔽 */
async function handleDeleteBatch() {
  // 功能已屏蔽
  ElMessage.info('批量删除功能暂未开放');
}

const checkedIds = ref([]);
const checkedRows = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

// 快捷筛选变量
const filterStatus = ref('');
const filterSyncStatus = ref('');

// 统计组件钻取筛选变量
const filterLotteryDate = ref('');
const filterStatsType = ref('');

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

  // 构建查询参数 - 直接使用 searchParams 中的值，RangePicker 返回的数组会自动转换为同名字段传给后端
  const queryParams = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    // 基础字段
    no: dataObj.searchParams.no,
    // 关联字段 - 用户、奖品、发放人
    userId: dataObj.searchParams.userId,
    prizeId: dataObj.searchParams.prizeId,
    senderId: dataObj.searchParams.senderId,
    // 字典字段
    status: filterStatus.value || dataObj.searchParams.status,
    syncStatus: filterSyncStatus.value || dataObj.searchParams.syncStatus,
    // RangePicker 返回数组格式 [start, end]，后端会接收为两个同名参数
    lotteryTime:
      filterLotteryDate.value || !dataObj.searchParams.lotteryTime
        ? undefined
        : dataObj.searchParams.lotteryTime,
    sendTime:
      !dataObj.searchParams.sendTime ? undefined : dataObj.searchParams.sendTime,
    // 数值范围字段
    costPointMin: dataObj.searchParams.costPointMin,
    costPointMax: dataObj.searchParams.costPointMax,
    // 文本字段
    checkResult: dataObj.searchParams.checkResult,
    // 统计组件钻取筛选字段
    statsType: filterStatsType.value || dataObj.searchParams.statsType,
  };

  const response = await getPointLotteryPage(queryParams);
  if (response && response.list) {
    dataObj.total = response.total;
    dataObj.list = response.list.map((item) => ({
      ...item,
      id: String(item.id),
      lotteryTimeStr: formatDate(item.lotteryTime),
      sendTimeStr: formatDate(item.sendTime),
      createTimeStr: formatDate(item.createTime),
      updateTimeStr: formatDate(item.updateTime),
    }));
  } else {
    // 接口返回为空或无数据，清空列表
    dataObj.total = 0;
    dataObj.list = [];
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

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 快捷筛选处理 ====================

// 处理记录状态点击
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理同步状态点击
const handleSyncStatusClick = (syncStatus) => {
  filterSyncStatus.value =
    filterSyncStatus.value === syncStatus ? '' : syncStatus;
  gridApi.query();
};

// 取消筛选
const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

const handleCancelSyncStatusFilter = () => {
  filterSyncStatus.value = '';
  gridApi.query();
};

/** 获取记录状态标签文本 */
function getStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.POINT_LOTTERY_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 获取同步状态标签文本 */
function getSyncStatusLabel(syncStatus) {
  const dict = getDictObj(
    DICT_TYPE.POINT_LOTTERY_SYNC_STATUS,
    String(syncStatus),
  );
  return dict ? dict.label : syncStatus;
}

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, subType, value) => {
  if (type === 'card') {
    // 卡片点击 - 总抽奖量或中奖率
    filterStatsType.value = subType;
    ElMessage.info(
      `已筛选: ${subType === 'total' ? '总抽奖量' : '累计中奖率'}`,
    );
  } else if (type === 'date') {
    // 折线图节点点击 - 按日期筛选
    filterLotteryDate.value = value;
    ElMessage.info(`已筛选日期: ${value}`);
  }
  gridApi.query();
};

/** 取消日期筛选 */
const handleCancelDateFilter = () => {
  filterLotteryDate.value = '';
  gridApi.query();
};

/** 取消统计类型筛选 */
const handleCancelStatsTypeFilter = () => {
  filterStatsType.value = '';
  gridApi.query();
};

defineExpose({
  handleStatsFilter,
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
      :title="`${dataObj.detailObj.no || '抽奖记录'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   奖品详情抽屉-->
    <DetailDrawer
      ref="prizeDetailDrawerRef"
      :title="prizeDetailTitle"
      :data="prizeDetailData"
      :fields="prizeDetailFields"
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
          <!-- 记录状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="warning"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            记录状态：{{ getStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 同步状态筛选标签 -->
          <ElTag
            v-if="filterSyncStatus"
            type="primary"
            closable
            @close="handleCancelSyncStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            同步状态：{{ getSyncStatusLabel(filterSyncStatus) }}
          </ElTag>
          <!-- 统计组件-日期筛选标签 -->
          <ElTag
            v-if="filterLotteryDate"
            type="success"
            closable
            @close="handleCancelDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            抽奖日期：{{ filterLotteryDate }}
          </ElTag>
          <!-- 统计组件-类型筛选标签 -->
          <ElTag
            v-if="filterStatsType"
            type="primary"
            closable
            @close="handleCancelStatsTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            统计类型：{{
              filterStatsType === 'total' ? '总抽奖量' : '累计中奖率'
            }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
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
      <!-- 抽奖记录编号插槽 - 点击跳转抽奖记录详情弹窗 -->
      <template #no="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.no }}
        </el-text>
      </template>
      <!-- 奖品名称插槽 - 点击打开奖品详情抽屉 -->
      <template #prizeName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenPrizeDetail(row)"
        >
          {{ row.prizeName }}
        </el-text>
      </template>
      <!-- 记录状态插槽 - 点击筛选同状态抽奖记录 -->
      <template #status="{ row }">
        <ElTag
          @click="handleStatusClick(row.status)"
          :type="getPointLotteryStatusTagType(row.status)"
          style="cursor: pointer"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 同步状态插槽 - 点击筛选同同步状态记录 -->
      <template #syncStatus="{ row }">
        <ElTag
          @click="handleSyncStatusClick(row.syncStatus)"
          :type="getPointLotterySyncStatusTagType(row.syncStatus)"
          style="cursor: pointer"
        >
          {{ getSyncStatusLabel(row.syncStatus) }}
        </ElTag>
      </template>
      <!-- 行操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 异常记录显示核查按钮 -->
          <IconButton
            v-if="row.status === '1'"
            content="核查"
            icon-name="CircleCheck"
            @click="handleCheck(row)"
          />
          <!-- 所有记录都显示查看按钮 -->
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
            本页统计：抽奖记录数量: {{ dataObj.list.length }}; 正常记录:
            {{ dataObj.list.filter((v) => v.status === '0').length }}; 异常记录:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 已核查:
            {{ dataObj.list.filter((v) => v.status === '2').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <!-- 核查抽屉 -->
    <CheckDrawer ref="checkDrawerRef" @success="handleRefresh" />
  </div>
</template>
<style scoped></style>
