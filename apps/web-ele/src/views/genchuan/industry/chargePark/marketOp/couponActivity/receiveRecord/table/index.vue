<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportReceiveRecord,
  getReceiveRecordPage,
} from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord';
import { getCouponMgmtDetail } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/couponMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';
import CheckRecordDrawer from '#/views/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord/components/CheckRecordDrawer.vue';

import {
  dataList,
  detailFields,
  dynamicCouponSearchOptions,
  fetchCouponSearchOptions,
  getCurrentCouponSearchOptions,
  getReceiveRecordStatusLabel,
  getReceiveRecordStatusTagType,
  getReceiveRecordSyncStatusLabel,
  getReceiveRecordSyncStatusTagType,
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
const checkRecordDrawerRef = ref(null);
const couponDetailDrawerRef = ref(null);
const formData = ref();
const couponDetailData = ref({});
const couponDetailTitle = ref('优惠券详情');

// 优惠券详情字段配置 - 不包含xxid字段
const couponDetailFields = [
  { key: 'name', label: '券名称' },
  {
    key: 'type',
    label: '券类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(value));
      return getDictTagTypeFromDict(dict, 'primary');
    },
  },
  {
    key: 'amount',
    label: '面额',
    formatter: (value, row) => {
      if (!row) return value;
      if (row.type === '1') {
        return `${(value * 10).toFixed(1)}折`;
      } else if (row.type === '2') {
        return `${value}小时`;
      }
      return `¥${value}`;
    },
  },
  { key: 'useCondition', label: '使用条件' },
  {
    key: 'status',
    label: '券状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => {
      const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(value));
      return getDictTagTypeFromDict(dict, 'info');
    },
  },
  { key: 'senderName', label: '发放人' },
  { key: 'sendTimeStr', label: '发放时间' },
  { key: 'receiverName', label: '领取人' },
  { key: 'verifyTimeStr', label: '核销时间' },
  { key: 'validTimeStr', label: '有效期' },
  { key: 'description', label: '券描述' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTimeStr', label: '更新时间' },
];

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
  async onConfirm() {},
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
  filterStatus.value = '';
  filterSyncStatus.value = '';
  filterReceiveDate.value = '';
  gridApi.query();
}

/** 导出表格 - 使用API导出 */
async function handleExport() {
  try {
    const data = await exportReceiveRecord();
    downloadFileFromBlobPart({
      fileName: textObj.excelAllName,
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 核查 - 打开核查抽屉 */
function handleCheck(row) {
  checkRecordDrawerRef.value?.open(row);
}

/** 核查成功回调 */
function handleCheckSuccess() {
  handleRefresh();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterStatus = ref('');
const filterSyncStatus = ref('');

// 统计组件钻取筛选变量 - 日期筛选
const filterReceiveDate = ref('');

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
    // 构建API请求参数 - 参照pointActivity的传参处理逻辑
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      no: dataObj.searchParams.no,
      userId: dataObj.searchParams.userId,
      userName: dataObj.searchParams.userName,
      couponId: dataObj.searchParams.couponId,
      couponName: dataObj.searchParams.couponName,
      status: filterStatus.value || dataObj.searchParams.status,
      syncStatus: filterSyncStatus.value || dataObj.searchParams.syncStatus,
      date: filterReceiveDate.value || undefined, // 统计折线图钻取筛选（参数名改为date）
      // RangePicker 返回数组格式 [start, end]，后端会接收为两个同名参数
      receiveTime:
        filterReceiveDate.value || !dataObj.searchParams.receiveTime
          ? undefined
          : dataObj.searchParams.receiveTime,
    };

    const response = await getReceiveRecordPage(params);
    if (response) {
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
        if (
          value &&
          !['archiveTime', 'receiveTime', 'verifyTime'].includes(key)
        ) {
          searchMatch =
            typeof value === 'string'
              ? searchMatch && v[key]?.toString().includes(value)
              : searchMatch && v[key] === value;
        }
      });
      // 应用快捷筛选变量
      if (filterStatus.value && v.status !== filterStatus.value) {
        searchMatch = false;
      }
      if (filterSyncStatus.value && v.syncStatus !== filterSyncStatus.value) {
        searchMatch = false;
      }
      // 应用日期筛选
      if (filterReceiveDate.value) {
        const recordDate = v.receiveTime
          ? new Date(Number(v.receiveTime)).toISOString().split('T')[0]
          : '';
        if (recordDate !== filterReceiveDate.value) {
          searchMatch = false;
        }
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

const [QueryForm, queryFormApi] = useVbenForm({
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

// 处理记录状态点击
const handleFilterByStatus = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理同步状态点击
const handleFilterBySyncStatus = (syncStatus) => {
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

// 取消日期筛选
const handleCancelDateFilter = () => {
  filterReceiveDate.value = '';
  gridApi.query();
};

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, subType, value) => {
  if (type === 'card') {
    // 卡片点击
    if (subType === 'verifyRate') {
      // 点击累计核销率 - 筛选"已核查"状态的领用记录（status=2表示已核查）
      filterStatus.value = filterStatus.value === '2' ? '' : '2';
      gridApi.query();
    } else if (subType === 'total') {
      // 点击总领用量 - 清除状态筛选，显示所有记录
      filterStatus.value = '';
      gridApi.query();
    }
  } else if (type === 'date') {
    // 折线图节点点击 - 按日期筛选
    filterReceiveDate.value = filterReceiveDate.value === value ? '' : value;
    gridApi.query();
  }
};

defineExpose({
  handleStatsFilter,
});

// 页面加载时获取优惠券列表
onMounted(async () => {
  await fetchCouponSearchOptions();
  // 动态更新搜索表单的优惠券选项
  const currentCouponOptions = getCurrentCouponSearchOptions();
  await queryFormApi.updateSchema([
    {
      fieldName: 'couponId',
      componentProps: {
        options: currentCouponOptions,
      },
    },
  ]);
});

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开领用记录详情弹窗 */
const handleOpenRecordDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开用户详情弹窗 */
const handleOpenUserDetail = (row) => {
  ElMessage.info(`查看用户详情: ${row.userName}`);
  // TODO: 实现用户详情弹窗
};

/** 打开优惠券详情弹窗 - 查看单个优惠券详情 */
async function handleOpenCouponDetail(row) {
  if (!row.couponId) {
    ElMessage.warning('优惠券ID不存在');
    return;
  }

  try {
    const couponDetail = await getCouponMgmtDetail(Number(row.couponId));
    if (couponDetail && couponDetail.id) {
      // 格式化时间字段（处理null值）
      const formattedDetail = {
        ...couponDetail,
        createTimeStr: couponDetail.createTime
          ? formatDate(couponDetail.createTime)
          : '-',
        updateTimeStr: couponDetail.updateTime
          ? formatDate(couponDetail.updateTime)
          : '-',
        sendTimeStr: couponDetail.sendTime
          ? formatDate(couponDetail.sendTime)
          : '-',
        verifyTimeStr: couponDetail.verifyTime
          ? formatDate(couponDetail.verifyTime)
          : '-',
        validTimeStr: couponDetail.validTime
          ? formatDate(couponDetail.validTime)
          : '-',
      };

      // 设置数据和标题
      couponDetailData.value = formattedDetail;
      couponDetailTitle.value = `${formattedDetail.name || '优惠券'}详情`;

      // 使用nextTick确保DOM更新后再打开抽屉
      await nextTick();
      if (couponDetailDrawerRef.value) {
        couponDetailDrawerRef.value.open();
      } else {
        console.error('优惠券详情抽屉组件未找到');
        ElMessage.error('打开详情失败，请重试');
      }
    } else {
      ElMessage.error('获取优惠券详情失败');
    }
  } catch (error) {
    console.error('获取优惠券详情失败:', error);
    ElMessage.error('获取优惠券详情失败');
  }
}

/** 打开核查明细弹窗 */
const handleOpenCheckDetail = (row) => {
  if (row.checkResult) {
    ElMessage.info(`核查结果: ${row.checkResult}`);
  } else {
    ElMessage.info('暂无核查结果');
  }
  // TODO: 实现核查明细弹窗
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
      :title="`${dataObj.detailObj.no || '领用记录'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   优惠券详情抽屉 - 展示单个优惠券详情-->
    <DetailDrawer
      ref="couponDetailDrawerRef"
      :title="couponDetailTitle"
      :data="couponDetailData"
      :fields="couponDetailFields"
    />
    <!--   核查抽屉-->
    <CheckRecordDrawer
      ref="checkRecordDrawerRef"
      @success="handleCheckSuccess"
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
            type="primary"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            记录状态：{{ getReceiveRecordStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 同步状态筛选标签 -->
          <ElTag
            v-if="filterSyncStatus"
            type="success"
            closable
            @close="handleCancelSyncStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            同步状态：{{ getReceiveRecordSyncStatusLabel(filterSyncStatus) }}
          </ElTag>
          <!-- 统计组件-日期筛选标签 -->
          <ElTag
            v-if="filterReceiveDate"
            type="warning"
            closable
            @close="handleCancelDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            领用日期：{{ filterReceiveDate }}
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
      <!-- 记录编号 - 点击跳转详情 -->
      <template #no="{ row }">
        <el-text
          @click="handleOpenRecordDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.no }}
        </el-text>
      </template>
      <!-- 用户名称 - 点击跳转用户详情 -->
      <template #userName="{ row }">
        <el-text
          @click="handleOpenUserDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userName }}
        </el-text>
      </template>
      <!-- 优惠券名称 - 点击跳转优惠券详情 -->
      <template #couponName="{ row }">
        <el-text
          @click="handleOpenCouponDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.couponName }}
        </el-text>
      </template>
      <!-- 领用时间 - 格式化显示 -->
      <template #receiveTime="{ row }">
        <span>{{
          row.receiveTime
            ? formatDate(
                new Date(Number(row.receiveTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 记录状态 - 点击筛选同状态 -->
      <template #statusName="{ row }">
        <ElTag
          :type="getReceiveRecordStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ getReceiveRecordStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 核销时间 - 格式化显示 -->
      <template #verifyTime="{ row }">
        <span>{{
          row.verifyTime
            ? formatDate(
                new Date(Number(row.verifyTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}</span>
      </template>
      <!-- 核查结果 - 点击查看核查明细 -->
      <template #checkResult="{ row }">
        <el-text
          @click="handleOpenCheckDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.checkResult || '-' }}
        </el-text>
      </template>
      <!-- 同步状态 - 点击筛选同同步状态 -->
      <template #syncStatusName="{ row }">
        <ElTag
          :type="getReceiveRecordSyncStatusTagType(row.syncStatus)"
          style="cursor: pointer"
          @click="handleFilterBySyncStatus(row.syncStatus)"
        >
          {{ getReceiveRecordSyncStatusLabel(row.syncStatus) }}
        </ElTag>
      </template>
      <!-- 归档时间 - 格式化显示 -->
      <template #archiveTime="{ row }">
        <span>{{
          row.archiveTime
            ? formatDate(
                new Date(Number(row.archiveTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : '-'
        }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="row.status === '1'"
            content="核查"
            icon-name="CircleCheck"
            @click="handleCheck(row)"
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
            本页统计：领用记录数量: {{ dataObj.list.length }}; 正常记录:
            {{ dataObj.list.filter((v) => v.status === '0').length }}; 异常记录:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 已核查:
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
