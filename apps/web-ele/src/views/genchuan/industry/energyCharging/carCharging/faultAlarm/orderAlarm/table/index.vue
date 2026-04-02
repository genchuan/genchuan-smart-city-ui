<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportOrderAlarm,
  getOrderAlarmPage,
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';

import {
  detailFields,
  formatTimestamp,
  getAbnormalTypeTagType,
  getAlarmStatusTagType,
  getVerifyResultTagType,
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
const formData = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
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
    formDrawerApi.close();
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
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    await exportOrderAlarm();
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
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

/** 删除 */
async function handleDelete(row) {
  try {
    await confirm(`确定删除 "${row.alarmCode}" 吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.alarmCode]),
  });
  try {
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.alarmCode]));
    handleRefresh();
  } catch (error) {
    ElMessage.error('删除失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
async function handleDeleteBatch() {
  try {
    await confirm($t('确定删除这些数据吗？'));
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('删除失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterPlateNo = ref('');
const filterAbnormalType = ref('');
const filterAlarmStatus = ref('');
const filterCreatorName = ref('');
const filterAlarmTimeStart = ref('');
const filterAlarmTimeEnd = ref('');
const filterHandleTimeStart = ref('');
const filterHandleTimeEnd = ref('');

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

  try {
    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      plateNo: filterPlateNo.value,
      abnormalType: filterAbnormalType.value,
      alarmStatus: filterAlarmStatus.value,
      creatorName: filterCreatorName.value,
      startAlarmTime: filterAlarmTimeStart.value,
      endAlarmTime: filterAlarmTimeEnd.value,
      startHandleTime: filterHandleTimeStart.value,
      endHandleTime: filterHandleTimeEnd.value,
      ...dataObj.searchParams,
    };

    const response = await getOrderAlarmPage(queryParams);
    if (response) {
      dataObj.total = response.total;
      dataObj.list = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        alarmTime: item.alarmTime ? formatTimestamp(item.alarmTime) : '',
        handleTime: item.handleTime ? formatTimestamp(item.handleTime) : '',
      }));
    }
  } catch (error) {
    ElMessage.error('获取数据失败');
    console.error(error);
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
  const searchParams = { ...values };
  // 处理时间范围
  if (values.alarmTime && Array.isArray(values.alarmTime)) {
    searchParams.startAlarmTime = values.alarmTime[0];
    searchParams.endAlarmTime = values.alarmTime[1];
    delete searchParams.alarmTime;
  }
  dataObj.searchParams = searchParams;
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

const openOrderDetail = () => {
  ElMessage.info('打开订单详情');
};

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

// 处理用户ID/车牌号点击
const handleUserInfoClick = (plateNo) => {
  filterPlateNo.value = filterPlateNo.value === plateNo ? '' : plateNo;
  gridApi.query();
};

// 处理异常类型点击
const handleAbnormalTypeClick = (abnormalType) => {
  filterAbnormalType.value = filterAbnormalType.value === abnormalType ? '' : abnormalType;
  gridApi.query();
};

// 处理告警状态点击
const handleAlarmStatusClick = (alarmStatus) => {
  filterAlarmStatus.value = filterAlarmStatus.value === alarmStatus ? '' : alarmStatus;
  gridApi.query();
};

// 处理操作人点击
const handleCreatorClick = (creatorName) => {
  filterCreatorName.value = filterCreatorName.value === creatorName ? '' : creatorName;
  gridApi.query();
};

// 处理告警时间点击
const handleAlarmTimeClick = (alarmTime) => {
  filterAlarmTimeStart.value = alarmTime;
  filterAlarmTimeEnd.value = alarmTime;
  gridApi.query();
};

// 处理处理时间点击
const handleHandleTimeClick = (handleTime) => {
  filterHandleTimeStart.value = handleTime;
  filterHandleTimeEnd.value = handleTime;
  gridApi.query();
};

// 取消筛选
const handleCancelPlateNoFilter = () => {
  filterPlateNo.value = '';
  gridApi.query();
};

const handleCancelAbnormalTypeFilter = () => {
  filterAbnormalType.value = '';
  gridApi.query();
};

const handleCancelAlarmStatusFilter = () => {
  filterAlarmStatus.value = '';
  gridApi.query();
};

const handleCancelCreatorFilter = () => {
  filterCreatorName.value = '';
  gridApi.query();
};

const handleCancelAlarmTimeFilter = () => {
  filterAlarmTimeStart.value = '';
  filterAlarmTimeEnd.value = '';
  gridApi.query();
};

const handleCancelHandleTimeFilter = () => {
  filterHandleTimeStart.value = '';
  filterHandleTimeEnd.value = '';
  gridApi.query();
};

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  if (type === 'status') {
    if (value === 'all') {
      filterAlarmStatus.value = '';
    } else {
      const dictOptions = getDictOptions(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, 'string');
      const dictItem = dictOptions.find((item) => item.label === value);
      filterAlarmStatus.value = dictItem ? dictItem.value : value;
    }
  } else if (type === 'abnormalType') {
    const dictOptions = getDictOptions(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, 'string');
    const dictItem = dictOptions.find((item) => item.label === value);
    filterAbnormalType.value = dictItem ? dictItem.value : value;
  }
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
      :title="`${dataObj.detailObj.alarmCode}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
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
          <!-- 车牌号筛选标签 -->
          <ElTag
            v-if="filterPlateNo"
            type="primary"
            closable
            @close="handleCancelPlateNoFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号：{{ filterPlateNo }}
          </ElTag>
          <!-- 异常类型筛选标签 -->
          <ElTag
            v-if="filterAbnormalType"
            type="success"
            closable
            @close="handleCancelAbnormalTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            异常类型：{{ getDictObj(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, String(filterAbnormalType))?.label || filterAbnormalType }}
          </ElTag>
          <!-- 告警状态筛选标签 -->
          <ElTag
            v-if="filterAlarmStatus"
            type="warning"
            closable
            @close="handleCancelAlarmStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警状态：{{ getDictObj(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, String(filterAlarmStatus))?.label || filterAlarmStatus }}
          </ElTag>
          <!-- 操作人筛选标签 -->
          <ElTag
            v-if="filterCreatorName"
            type="info"
            closable
            @close="handleCancelCreatorFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            操作人：{{ filterCreatorName }}
          </ElTag>
          <!-- 告警时间筛选标签 -->
          <ElTag
            v-if="filterAlarmTimeStart"
            type="primary"
            closable
            @close="handleCancelAlarmTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            告警时间：{{ filterAlarmTimeStart }} 至 {{ filterAlarmTimeEnd }}
          </ElTag>
          <!-- 处理时间筛选标签 -->
          <ElTag
            v-if="filterHandleTimeStart"
            type="primary"
            closable
            @close="handleCancelHandleTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            处理时间：{{ filterHandleTimeStart }} 至 {{ filterHandleTimeEnd }}
          </ElTag>
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
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <!-- 告警编号插槽 - 点击跳转详情 -->
      <template #alarmCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.alarmCode }}
        </el-text>
      </template>
      <!-- 订单编号插槽 - 点击跳转订单详情 -->
      <template #orderCode="{ row }">
        <el-text
          @click="openOrderDetail()"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.orderCode }}
        </el-text>
      </template>
      <!-- 用户ID/车牌号插槽 - 点击筛选 -->
      <template #userInfo="{ row }">
        <el-text
          @click="handleUserInfoClick(row.plateNo)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userId }}/{{ row.plateNo }}
        </el-text>
      </template>
      <!-- 异常类型插槽 - 点击筛选 -->
      <template #abnormalType="{ row }">
        <ElTag
          @click="handleAbnormalTypeClick(row.abnormalType)"
          :type="getAbnormalTypeTagType(row.abnormalType)"
          style="cursor: pointer"
        >
          {{ getDictObj(DICT_TYPE.ORDER_ALARM_ABNORMAL_TYPE, String(row.abnormalType))?.label || row.abnormalType }}
        </ElTag>
      </template>
      <!-- 告警时间插槽 - 点击筛选 -->
      <template #alarmTime="{ row }">
        <el-text
          @click="handleAlarmTimeClick(row.alarmTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.alarmTime }}
        </el-text>
      </template>
      <!-- 关联充电桩插槽 - 点击跳转充电桩详情 -->
      <template #pileName="{ row }">
        <el-text
          @click="$message.info('打开充电桩详情')"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.pileName }}
        </el-text>
      </template>
      <!-- 告警状态插槽 - 点击筛选 -->
      <template #alarmStatus="{ row }">
        <ElTag
          @click="handleAlarmStatusClick(row.alarmStatus)"
          :type="getAlarmStatusTagType(row.alarmStatus)"
          style="cursor: pointer"
        >
          {{ getDictObj(DICT_TYPE.ORDER_ALARM_ALARM_STATUS, String(row.alarmStatus))?.label || row.alarmStatus }}
        </ElTag>
      </template>
      <!-- 核实结果插槽 - 无钻取交互，仅显示字典标签 -->
      <template #verifyResult="{ row }">
        <ElTag :type="getVerifyResultTagType(row.verifyResult)">
          {{ getDictObj(DICT_TYPE.ORDER_ALARM_VERIFY_RESULT, String(row.verifyResult))?.label || row.verifyResult }}
        </ElTag>
      </template>
      <!-- 处理时间插槽 - 点击筛选 -->
      <template #handleTime="{ row }">
        <el-text
          @click="handleHandleTimeClick(row.handleTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.handleTime }}
        </el-text>
      </template>
      <!-- 操作人插槽 - 点击筛选 -->
      <template #creatorName="{ row }">
        <el-text
          @click="handleCreatorClick(row.creatorName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.creatorName }}
        </el-text>
      </template>
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
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
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
          <span> 本页统计：订单告警数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
