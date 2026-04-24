<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getReceiveRecordPage } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';
import CheckRecordDrawer from '#/views/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord/components/CheckRecordDrawer.vue';

import {
  dataList,
  detailFields,
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
  filterStatsType.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
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

// 统计组件钻取筛选变量
const filterReceiveDate = ref('');
const filterStatsType = ref('');

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
      no: dataObj.searchParams.no,
      userId: dataObj.searchParams.userId,
      userName: dataObj.searchParams.userName,
      couponId: dataObj.searchParams.couponId,
      couponName: dataObj.searchParams.couponName,
      status: filterStatus.value || dataObj.searchParams.status,
      syncStatus: filterSyncStatus.value || dataObj.searchParams.syncStatus,
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

// ==================== 统计组件钻取筛选处理 ====================

/** 处理统计组件的钻取筛选 */
const handleStatsFilter = (type, subType, value) => {
  if (type === 'card') {
    // 卡片点击 - 总领用量或核销率
    filterStatsType.value = subType;
    ElMessage.info(
      `已筛选: ${subType === 'total' ? '总领用量' : '累计核销率'}`,
    );
  } else if (type === 'date') {
    // 折线图节点点击 - 按日期筛选
    filterReceiveDate.value = value;
    ElMessage.info(`已筛选日期: ${value}`);
  }
  gridApi.query();
};

/** 取消日期筛选 */
const handleCancelDateFilter = () => {
  filterReceiveDate.value = '';
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

/** 打开优惠券详情弹窗 */
const handleOpenCouponDetail = (row) => {
  ElMessage.info(`查看优惠券详情: ${row.couponName}`);
  // TODO: 实现优惠券详情弹窗
};

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
          <!-- 统计组件-类型筛选标签 -->
          <ElTag
            v-if="filterStatsType"
            type="info"
            closable
            @close="handleCancelStatsTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            统计类型：{{
              filterStatsType === 'total' ? '总领用量' : '累计核销率'
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
