<script setup>
import { computed, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createPointActivity,
  exportPointActivity,
  getPointActivityPage,
  updatePointActivity,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import { formatDate } from '#/utils/genchuan/formatTime';
import ImportExcelDialog from '#/views/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity/components/ImportExcelDialog.vue';
import StatusConfirmDialog from '#/views/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity/components/StatusConfirmDialog.vue';

import {
  dataList,
  detailFields,
  getPointActivityStatusTagType,
  getPointActivityTypeTagType,
  getStationNamesByIds,
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
const formData = ref();

// 组件引用
const importExcelDialogRef = ref();
const statusConfirmDialogRef = ref();

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

    // 校验开始时间不得晚于结束时间
    if (
      values.startTime &&
      values.endTime &&
      values.startTime > values.endTime
    ) {
      ElMessage.error('开始时间不得晚于结束时间');
      return;
    }

    // 处理提交数据
    const submitData = {
      ...values,
      // 将stationIds数组转换为逗号分隔的字符串
      stationIds: Array.isArray(values.stationIds)
        ? values.stationIds.join(',')
        : values.stationIds,
    };

    try {
      if (formData.value?.id) {
        // 将id转换为数字类型
        await updatePointActivity({
          ...submitData,
          id: Number(formData.value.id),
        });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      } else {
        await createPointActivity(submitData);
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      // 显示接口返回的错误信息
      const errorMsg =
        error?.msg ||
        error?.message ||
        (formData.value?.id ? '编辑失败' : '新增失败');
      ElMessage.error(errorMsg);
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
  filterAuditorName.value = '';
  filterStationId.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    // 构建导出参数，包含当前筛选条件
    const exportParams = {
      pageNo: 1,
      pageSize: 200, // 最大导出200条
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      status: filterStatus.value || dataObj.searchParams.status,
      startTime: dataObj.searchParams.timeRange?.[0],
      endTime: dataObj.searchParams.timeRange?.[1],
    };

    const data = await exportPointActivity(exportParams);
    downloadFileFromBlobPart({ fileName: '积分活动数据.xlsx', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    const errorMsg = error?.msg || error?.message || '导出失败';
    ElMessage.error(errorMsg);
    console.error(error);
  }
}

/** 导入Excel */
function handleImport() {
  importExcelDialogRef.value?.open();
}

/** 创建 */
async function handleCreate() {
  // 切换到新增表单schema
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
  formDrawerApi.setData({
    title: textObj.editText,
    ...row,
  });
  formDrawerApi.open();
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

/** 生效活动 */
function handleActivate(row) {
  statusConfirmDialogRef.value?.open('activate', row);
}

/** 暂停活动 */
function handlePause(row) {
  statusConfirmDialogRef.value?.open('pause', row);
}

/** 启用活动 */
function handleEnable(row) {
  statusConfirmDialogRef.value?.open('enable', row);
}

const checkedIds = ref([]);
const checkedRows = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

// 快捷筛选变量
const filterType = ref('');
const filterStatus = ref('');
const filterAuditorName = ref('');
const filterStationId = ref('');
const filterDate = ref(''); // 日期筛选（用于折线图钻取）

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  // 静态数据备份
  staticData: dataList(),
  useStaticData: false,
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
    // 构建查询参数
    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      name: dataObj.searchParams.name,
      type: filterType.value || dataObj.searchParams.type,
      status: filterStatus.value || dataObj.searchParams.status,
      date: filterDate.value || undefined, // 日期筛选（用于折线图钻取）
      startTime: !filterDate.value ? dataObj.searchParams.timeRange?.[0] : undefined,
      endTime: !filterDate.value ? dataObj.searchParams.timeRange?.[1] : undefined,
    };

    const response = await getPointActivityPage(queryParams);
    if (response && response.list && response.list.length > 0) {
      dataObj.useStaticData = false;
      dataObj.total = response.total;
      dataObj.list = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        startTimeStr: formatDate(item.startTime),
        endTimeStr: formatDate(item.endTime),
        createTimeStr: formatDate(item.createTime),
        updateTimeStr: formatDate(item.updateTime),
        auditTimeStr: formatDate(item.auditTime),
        stationNames: getStationNamesByIds(item.stationIds),
      }));
    } else {
      // 接口返回为空，使用静态数据
      throw new Error('接口返回数据为空');
    }
  } catch (error) {
    console.error('获取积分活动数据失败，使用静态数据:', error);
    dataObj.useStaticData = true;
    // 使用静态数据
    const staticData = dataObj.staticData;
    dataObj.total = staticData.length;
    dataObj.list = staticData.slice(
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
  if (
    values.timeRange &&
    Array.isArray(values.timeRange) &&
    values.timeRange.length === 2
  ) {
    searchParams.startTime = values.timeRange[0];
    searchParams.endTime = values.timeRange[1];
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

// 处理活动类型点击
const handleTypeClick = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

// 处理活动状态点击
const handleStatusClick = (status) => {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
};

// 处理审核人点击
const handleAuditorClick = (auditorName) => {
  filterAuditorName.value =
    filterAuditorName.value === auditorName ? '' : auditorName;
  // 这里可以打开操作人员详情弹窗
  ElMessage.info(`打开操作人员详情弹窗: ${auditorName}`);
};

// 处理场站点击 - 取第一个场站ID进行筛选
const handleStationClick = (stationIds) => {
  if (!stationIds) return;
  const firstStationId = stationIds.split(',')[0];
  filterStationId.value =
    filterStationId.value === firstStationId ? '' : firstStationId;
  gridApi.query();
};

// 处理参与人数点击 - 打开活动参与用户明细弹窗
const handleJoinCountClick = (row) => {
  ElMessage.info(`打开活动参与用户明细弹窗: ${row.name}`);
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

const handleCancelAuditorFilter = () => {
  filterAuditorName.value = '';
  gridApi.query();
};

const handleCancelStationFilter = () => {
  filterStationId.value = '';
  gridApi.query();
};

const handleCancelDateFilter = () => {
  filterDate.value = '';
  gridApi.query();
};

/** 获取活动状态标签文本 */
function getStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(status));
  return dict ? dict.label : status;
}

/** 获取活动类型标签文本 */
function getTypeLabel(type) {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return dict ? dict.label : type;
}

/** 获取场站标签文本 */
function getStationLabel(stationId) {
  const station = stationOptions.find((s) => s.value === stationId);
  return station ? station.label : stationId;
}

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  switch (type) {
    case 'card': {
      if (value === 'all') {
        // 总活动数，清空所有筛选
        filterType.value = '';
        filterStatus.value = '';
      } else if (value === 'users') {
        // 累计参与用户数，可以跳转到用户明细页面
        ElMessage.info('查看累计参与用户明细');
        return;
      }

      break;
    }
    case 'date': {
      // 按日期筛选 - 直接将统计接口返回的date值传入分页接口中查询
      filterDate.value = value;
      break;
    }
    case 'type': {
      // 按活动类型筛选
      filterType.value = value;
      break;
    }
    // No default
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
      :title="`${dataObj.detailObj.name}详情`"
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
          style="display: flex; flex-wrap: wrap; align-items: center"
        >
          <!-- 活动类型筛选标签 -->
          <ElTag
            v-if="filterType"
            type="success"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            活动类型：{{ getTypeLabel(filterType) }}
          </ElTag>
          <!-- 活动状态筛选标签 -->
          <ElTag
            v-if="filterStatus"
            type="warning"
            closable
            @close="handleCancelStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            活动状态：{{ getStatusLabel(filterStatus) }}
          </ElTag>
          <!-- 审核人筛选标签 -->
          <ElTag
            v-if="filterAuditorName"
            type="info"
            closable
            @close="handleCancelAuditorFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            审核人：{{ filterAuditorName }}
          </ElTag>
          <!-- 场站筛选标签 -->
          <ElTag
            v-if="filterStationId"
            type="primary"
            closable
            @close="handleCancelStationFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            活动覆盖场站：{{ getStationLabel(filterStationId) }}
          </ElTag>
          <!-- 日期筛选标签 -->
          <ElTag
            v-if="filterDate"
            type="danger"
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
      <!-- 活动名称插槽 - 点击跳转积分活动详情弹窗 -->
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
      <!-- 活动类型插槽 - 点击筛选同类型 -->
      <template #type="{ row }">
        <ElTag
          @click="handleTypeClick(row.type)"
          :type="getPointActivityTypeTagType(row.type)"
          style="cursor: pointer"
        >
          {{ getTypeLabel(row.type) }}
        </ElTag>
      </template>
      <!-- 活动时间插槽 - 无钻取交互 -->
      <template #activityTime="{ row }">
        <span>{{ row.startTimeStr }} 至 {{ row.endTimeStr }}</span>
      </template>
      <!-- 参与人数插槽 - 点击跳转活动参与用户明细弹窗 -->
      <template #joinCount="{ row }">
        <el-text
          @click="handleJoinCountClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.joinCount }}
        </el-text>
      </template>
      <!-- 活动状态插槽 - 点击筛选同状态 -->
      <template #status="{ row }">
        <ElTag
          @click="handleStatusClick(row.status)"
          :type="getPointActivityStatusTagType(row.status)"
          style="cursor: pointer"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>
      <!-- 审核人插槽 - 点击跳转操作人员详情弹窗 -->
      <template #auditorName="{ row }">
        <el-text
          v-if="row.auditorName"
          @click="handleAuditorClick(row.auditorName)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.auditorName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <!-- 活动覆盖场站插槽 - 点击筛选该场站下的活动列表 -->
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
      <!-- 行操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 生效按钮 - 待生效状态显示 -->
          <IconButton
            v-if="row.status === '0'"
            content="生效"
            icon-name="CircleCheckFilled"
            @click="handleActivate(row)"
          />
          <!-- 暂停按钮 - 进行中状态显示 -->
          <IconButton
            v-if="row.status === '1'"
            content="暂停"
            icon-name="VideoPause"
            @click="handlePause(row)"
          />
          <!-- 启用按钮 - 已暂停状态显示 -->
          <IconButton
            v-if="row.status === '3'"
            content="启用"
            icon-name="SwitchButton"
            @click="handleEnable(row)"
          />
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <!-- 编辑按钮 - 非已结束状态显示 -->
          <IconButton
            v-if="row.status !== '2'"
            content="编辑"
            icon-name="Edit"
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
          <span>
            本页统计：积分活动数量: {{ dataObj.list.length }}; 进行中:
            {{
              dataObj.list.filter(
                (v) => v.status === '1' || v.statusName === '进行中',
              ).length
            }}; 已结束:
            {{
              dataObj.list.filter(
                (v) => v.status === '2' || v.statusName === '已结束',
              ).length
            }}; 已暂停:
            {{
              dataObj.list.filter(
                (v) => v.status === '3' || v.statusName === '已暂停',
              ).length
            }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <!-- 导入Excel弹窗 -->
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />

    <!-- 状态操作确认弹窗 -->
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>
<style scoped></style>
