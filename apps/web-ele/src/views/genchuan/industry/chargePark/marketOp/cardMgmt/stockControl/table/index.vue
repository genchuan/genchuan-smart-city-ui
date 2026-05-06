<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportStockControl,
  getStockControlPage,
} from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { exportToExcel } from '#/utils/excel.js';
import { formatDate } from '#/utils/genchuan/formatTime';

import AllocateDrawer from '../components/AllocateDrawer.vue';
import ReplenishDialog from '../components/ReplenishDialog.vue';
import WarnConfirmDialog from '../components/WarnConfirmDialog.vue';
import {
  dataList,
  detailFields,
  getStockControlStatusLabel,
  getStockControlStatusTagType,
  getStockControlWarnStatusLabel,
  getStockControlWarnStatusTagType,
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
const allocateDrawerRef = ref(null);
const replenishDialogRef = ref(null);
const warnDialogRef = ref(null);
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

/** 刷新表格 */
function handleRefresh() {
  // 清除快捷筛选
  filterStatus.value = '';
  filterWarnStatus.value = '';
  filterCardId.value = '';
  filterDate.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const data = await exportStockControl();
    exportToExcel(data, textObj.excelName, textObj.excelAllName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
    // 使用静态数据导�?    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 调配 - 打开抽屉 */
function handleAllocate(row) {
  allocateDrawerRef.value?.open(row);
}

/** 补货 - 打开弹窗 */
function handleReplenish(row) {
  replenishDialogRef.value?.open(row);
}

/** 告警 - 打开确认弹窗 */
function handleWarn(row) {
  warnDialogRef.value?.open(row);
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变�?
const filterStatus = ref('');
const filterWarnStatus = ref('');
const filterCardId = ref('');
const filterDate = ref('');

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
      cardId: filterCardId.value || dataObj.searchParams.cardId,
      status: filterStatus.value || dataObj.searchParams.status,
      warnStatus: filterWarnStatus.value || dataObj.searchParams.warnStatus,
      // 日期筛选参数
      date: filterDate.value || undefined,
    };

    const response = await getStockControlPage(params);
    if (response) {
      const { list, total } = response;
      dataObj.total = total || 0;
      // 处理列表数据，将status和warnStatus转换为对应的名称
      dataObj.list = (list || []).map((item) => ({
        ...item,
        statusName: getStockControlStatusLabel(item.status),
        warnStatusName: getStockControlWarnStatusLabel(item.warnStatus),
      }));
      return dataObj;
    }
  } catch (error) {
    // 接口请求失败，使用静态数据
    console.error('分页接口请求失败，使用静态数据', error);

    // 根据searchParams和快捷筛选变量筛选静态数据
    const filteredList = dataObj.apilist.filter((v) => {
      let searchMatch = true;
      Object.keys(dataObj.searchParams).forEach((key) => {
        const value = dataObj.searchParams[key];
        if (value && !['syncTime'].includes(key)) {
          if (key === 'currentStockMin') {
            searchMatch = searchMatch && v.currentStock >= value;
          } else if (key === 'currentStockMax') {
            searchMatch = searchMatch && v.currentStock <= value;
          } else {
            searchMatch =
              typeof value === 'string'
                ? searchMatch && v[key]?.toString().includes(value)
                : searchMatch && v[key] === value;
          }
        }
      });
      // 应用快捷筛选变量
      if (filterStatus.value && v.status !== filterStatus.value) {
        searchMatch = false;
      }
      if (filterWarnStatus.value && v.warnStatus !== filterWarnStatus.value) {
        searchMatch = false;
      }
      if (filterCardId.value && v.cardId !== Number(filterCardId.value)) {
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

// 处理库存状态点击
const handleFilterByStatus = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理告警状态点击
const handleFilterByWarnStatus = (warnStatus) => {
  filterWarnStatus.value =
    filterWarnStatus.value === warnStatus ? '' : warnStatus;
  gridApi.query();
};

// 取消筛选
const handleCancelStatusFilter = () => {
  filterStatus.value = '';
  gridApi.query();
};

const handleCancelWarnStatusFilter = () => {
  filterWarnStatus.value = '';
  gridApi.query();
};

// 取消卡种筛选
const handleCancelCardIdFilter = () => {
  filterCardId.value = '';
  gridApi.query();
};

// 取消日期筛选
const handleCancelDateFilter = () => {
  filterDate.value = '';
  gridApi.query();
};

// ==================== 详情弹窗处理 ====================

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开卡种详情弹窗 */
const handleOpenCardDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

/** 打开库存调配明细弹窗 */
const handleOpenAllocateDetail = (row) => {
  ElMessage.info(
    `查看库存调配明细: ${row.cardName}，调配记录数: ${row.allocateCount}`,
  );
  // TODO: 实现库存调配明细弹窗
};

/** 打开库存补货明细弹窗 */
const handleOpenReplenishDetail = (row) => {
  ElMessage.info(
    `查看库存补货明细: ${row.cardName}，补货记录数: ${row.replenishCount}`,
  );
  // TODO: 实现库存补货明细弹窗
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  // 清空之前的筛选
  filterStatus.value = '';
  filterWarnStatus.value = '';
  filterCardId.value = '';
  filterDate.value = '';

  switch (type) {
    case 'card': {
      if (value === 'total') {
        // 总库存 - 清空筛选
        filterStatus.value = '';
        filterWarnStatus.value = '';
      } else if (value === 'warn') {
        // 预警库存 - 筛选预警状态
        filterStatus.value = '2'; // 预警库存
      }
      break;
    }
    case 'status': {
      // 直接设置状态筛选（用于预警库存数卡片点击）
      filterStatus.value = value;
      break;
    }
    case 'cardId': {
      // 卡种筛选
      filterCardId.value = value;
      break;
    }
    case 'date': {
      // 日期筛选
      filterDate.value = value;
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
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.cardName || '库存管控'}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   调配抽屉-->
    <AllocateDrawer ref="allocateDrawerRef" @success="handleRefresh" />
    <!--   补货弹窗-->
    <ReplenishDialog ref="replenishDialogRef" @success="handleRefresh" />
    <!--   告警确认弹窗-->
    <WarnConfirmDialog ref="warnDialogRef" @success="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 快捷筛选标�?-->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <!-- 库存状态筛选标�?-->
          <ElTag
            v-if="filterStatus"
            type="primary"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            库存状态：{{ getStockControlStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 告警状态筛选标�?-->
          <ElTag
            v-if="filterWarnStatus"
            type="success"
            closable
            @close="handleCancelWarnStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警状态：{{ getStockControlWarnStatusLabel(filterWarnStatus) }}
          </ElTag>
          <!-- 卡种筛选标签 -->
          <ElTag
            v-if="filterCardId"
            type="warning"
            closable
            @close="handleCancelCardIdFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            卡种ID：{{ filterCardId }}
          </ElTag>
          <!-- 日期筛选标签 -->
          <ElTag
            v-if="filterDate"
            type="info"
            closable
            @close="handleCancelDateFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            日期：{{ filterDate }}
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
            :icon-name="showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <!-- 卡种名称 - 点击跳转详情 -->
      <template #cardName="{ row }">
        <el-text
          @click="handleOpenCardDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.cardName }}
        </el-text>
      </template>
      <!-- 库存状�?- 点击筛选同状�?-->
      <template #statusName="{ row }">
        <ElTag
          :type="getStockControlStatusTagType(row.status)"
          style="cursor: pointer"
          @click="handleFilterByStatus(row.status)"
        >
          {{ row.statusName }}
        </ElTag>
      </template>
      <!-- 更新时间 - 格式化显�?-->
      <template #updateTime="{ row }">
        <span>{{
          row.updateTime
            ? formatDate(
                new Date(Number(row.updateTime)),
                'YYYY-MM-DD HH:mm:ss',
              )
            : ''
        }}</span>
      </template>
      <!-- 调配记录 - 点击跳转调配明细 -->
      <template #allocateCount="{ row }">
        <el-text
          @click="handleOpenAllocateDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.allocateCount }}
        </el-text>
      </template>
      <!-- 补货记录 - 点击跳转补货明细 -->
      <template #replenishCount="{ row }">
        <el-text
          @click="handleOpenReplenishDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.replenishCount }}
        </el-text>
      </template>
      <!-- 告警状�?- 点击筛选同告警状�?-->
      <template #warnStatusName="{ row }">
        <ElTag
          :type="getStockControlWarnStatusTagType(row.warnStatus)"
          style="cursor: pointer"
          @click="handleFilterByWarnStatus(row.warnStatus)"
        >
          {{ row.warnStatusName }}
        </ElTag>
      </template>
      <!-- 同步时间 - 格式化显�?-->
      <template #syncTime="{ row }">
        <span>{{
          row.syncTime
            ? formatDate(new Date(Number(row.syncTime)), 'YYYY-MM-DD HH:mm:ss')
            : '-'
        }}</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 正常库存: 查看、调配-->
          <template v-if="row.status === '0'">
            <IconButton
              content="调配"
              icon-name="Switch"
              @click="handleAllocate(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 低库存 补货、查看、调配-->
          <template v-else-if="row.status === '1'">
            <IconButton
              content="补货"
              icon-name="Plus"
              @click="handleReplenish(row)"
            />
            <IconButton
              content="调配"
              icon-name="Switch"
              @click="handleAllocate(row)"
            />
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleOpenDetail(row)"
            />
          </template>
          <!-- 预警库存: 告警、补货、查看、调配 -->
          <template v-else-if="row.status === '2'">
            <IconButton
              v-if="row.warnStatus === '0'"
              content="告警"
              icon-name="Warning"
              @click="handleWarn(row)"
            />
            <IconButton
              content="补货"
              icon-name="Plus"
              @click="handleReplenish(row)"
            />
            <IconButton
              content="调配"
              icon-name="Switch"
              @click="handleAllocate(row)"
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
            本页统计：库存管控数量 {{ dataObj.list.length }}; 正常库存:
            {{ dataObj.list.filter((v) => v.status === '0').length }}; 低库存:
            {{ dataObj.list.filter((v) => v.status === '1').length }}; 预警库存:
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
