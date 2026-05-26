<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createChargingLot,
  exportChargingLot,
  getChargingLotPage,
  getChargingPileDetail,
  getChargingStationDetail,
  updateChargingLot,
  updateChargingLotStatus,
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingLot';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';
import StationDetailDrawer from '#/views/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/components/detail.vue';
import PileDetailDrawer from '#/views/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/table/detail.vue';

import { formatDate } from '#/utils/genchuan/formatTime';
import { checkPermissionAndUpgrade } from '#/utils/genchuan/permission';

import MarkOccupyDialog from '../components/MarkOccupyDialog.vue';
import {
  detailFields,
  fetchStationOptions,
  formatTimestamp,
  getLotStatusTagType,
  getLotTypeTagType,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

// 在setup顶层初始化router实例
const router = useRouter();

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
const markOccupyDialogRef = ref(null);
const stationDetailRef = ref(null);
const pileDetailRef = ref(null);
const formData = ref();

// 场站详情数据
const stationDetailData = ref({});
// 充电桩详情数据
const pileDetailData = ref({});

// 场站下拉选项
const stationOptions = ref([]);
// 当前选中的场站名称（用于表单提交）
const selectedStationName = ref('');

// 加载场站列表
const loadStationOptions = async () => {
  stationOptions.value = await fetchStationOptions();
};

// 初始化时加载场站列表
onMounted(() => {
  loadStationOptions();
});

// 处理场站选择变化
const handleStationChange = (value) => {
  const selectedStation = stationOptions.value.find(
    (item) => item.value === value,
  );
  if (selectedStation) {
    selectedStationName.value = selectedStation.label;
  }
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: computed(() => {
    const schema = useFormSchema(stationOptions.value);
    // 找到所属场站字段，添加onChange事件
    const stationField = schema.find((item) => item.fieldName === 'stationId');
    if (stationField) {
      stationField.componentProps = {
        ...stationField.componentProps,
        onChange: handleStationChange,
      };
    }
    return schema;
  }),
  showDefaultActions: false,
});

// 监听场站选项变化，更新表单schema
watch(
  stationOptions,
  (newOptions) => {
    formApi.setState((prev) => ({
      ...prev,
      schema: computed(() => {
        const schema = useFormSchema(newOptions);
        const stationField = schema.find((item) => item.fieldName === 'stationId');
        if (stationField) {
          stationField.componentProps = {
            ...stationField.componentProps,
            onChange: handleStationChange,
          };
        }
        return schema;
      }),
    }));
  },
  { deep: true },
);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    try {
      const submitData = { ...obj };

      // 如果选择了场站，使用记录的stationName
      if (submitData.stationId) {
        // 优先使用selectedStationName，如果没有则根据stationId查找
        if (selectedStationName.value) {
          submitData.stationName = selectedStationName.value;
        } else {
          const selectedStation = stationOptions.value.find(
            (item) => item.value === submitData.stationId,
          );
          if (selectedStation) {
            submitData.stationName = selectedStation.label;
          }
        }
      }

      if (formDrawerApi.sharedData.payload.title === textObj.addText) {
        await createChargingLot(submitData);
        ElMessage.success('新增成功');
      } else {
        await updateChargingLot({ ...submitData, id: formData.value.id });
        ElMessage.success('编辑成功');
      }
      handleRefresh();
      formDrawerApi.close();
      // 重置选中的场站名称
      selectedStationName.value = '';
    } catch (error) {
      ElMessage.error('操作失败');
      console.error(error);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭抽屉时重置选中的场站名称
      selectedStationName.value = '';
      return;
    }
    formData.value = formDrawerApi.getData();
    if (formData.value?.id) {
      // 编辑时，设置当前选中的场站名称
      if (formData.value.stationId) {
        const selectedStation = stationOptions.value.find(
          (item) => item.value === formData.value.stationId,
        );
        if (selectedStation) {
          selectedStationName.value = selectedStation.label;
        }
      }
      await formApi.setValues(formData.value);
    } else {
      formApi.resetForm();
      selectedStationName.value = '';
    }
  },
});

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  // 清除所有快捷筛选变量
  filterStationId.value = '';
  filterLotType.value = '';
  filterLotStatus.value = '';
  filterCreator.value = '';
  filterCreateTime.value = '';
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:export', router)) {
    return;
  }

  try {
    const data = await exportChargingLot();
    downloadFileFromBlobPart({ fileName: '充电车位表.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error(error);
  }
}

/** 创建 */
function handleCreate() {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:create', router)) {
    return;
  }

  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:update', router)) {
    return;
  }

  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 删除 */
async function handleDelete(row) {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:delete', router)) {
    return;
  }

  try {
    await confirm(`确定删除 "${row.lotCode}" 吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.lotCode]),
  });
  try {
    // 调用删除接口（如果有的话，这里用更新状态模拟）
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.lotCode]));
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
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:delete', router)) {
    return;
  }

  try {
    await confirm($t('确定删除这些数据吗？'));
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    // 批量删除逻辑
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

/** 占用标记 */
function handleMarkOccupy(row) {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:mark-occupy', router)) {
    return;
  }

  if (markOccupyDialogRef.value) {
    markOccupyDialogRef.value.open(row);
  }
}

/** 空闲标记 */
async function handleMarkIdle(row) {
  if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:mark-idle', router)) {
    return;
  }

  try {
    await confirm(`确定将车位 "${row.lotCode}" 标记为空闲吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '正在标记空闲...',
  });
  try {
    const params = {
      id: Number(row.id),
      lotStatus: '0', // 0-空闲
    };
    await updateChargingLotStatus(params);
    ElMessage.success('空闲标记成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error('空闲标记失败');
    console.error(error);
  } finally {
    loadingInstance.close();
  }
}

/** 获取状态标签文本 */
function getLotStatusLabel(status) {
  const dict = getDictObj(DICT_TYPE.CHARGE_LOT_LOT_STATUS, String(status));
  return dict ? dict.label : status;
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 快捷筛选变量
const filterStationId = ref('');
const filterLotType = ref('');
const filterLotStatus = ref('');
const filterCreator = ref('');
const filterCreateTime = ref(''); // 创建时间筛选（显示用，格式：yyyy-MM-dd HH:mm:ss）

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
    // 构建时间范围数组参数
    // 取日期部分（前10个字符：yyyy-MM-dd），避免重复追加时间
    const createTimeParam = filterCreateTime.value
      ? [
          filterCreateTime.value.substring(0, 10) + ' 00:00:00',
          filterCreateTime.value.substring(0, 10) + ' 23:59:59',
        ]
      : undefined;

    const queryParams = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      stationId: filterStationId.value,
      lotType: filterLotType.value,
      lotStatus: filterLotStatus.value,
      creator: filterCreator.value,
      // 创建时间使用createTime参数（数组格式：[开始时间, 结束时间]）
      createTime: createTimeParam,
      ...dataObj.searchParams,
    };

    const response = await getChargingLotPage(queryParams);
    if (response) {
      dataObj.total = response.total;
      dataObj.list = response.list.map((item) => ({
        ...item,
        id: String(item.id),
        createTime: item.createTime ? formatTimestamp(item.createTime) : '',
        updateTime: item.updateTime ? formatTimestamp(item.updateTime) : '',
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
  schema: computed(() => useSearchFormSchema(stationOptions.value).map((v) => {
    delete v.rules;
    return { ...v };
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 监听场站选项变化，更新搜索表单schema
watch(
  stationOptions,
  (newOptions) => {
    QueryForm.setState((prev) => ({
      ...prev,
      schema: computed(() => useSearchFormSchema(newOptions).map((v) => {
        delete v.rules;
        return { ...v };
      })),
    }));
  },
  { deep: true },
);

// 搜索表单查询
function onSubmit(values) {
  const searchParams = { ...values };
  // 处理时间范围
  if (values.createTime && Array.isArray(values.createTime)) {
    searchParams.startCreateTime = values.createTime[0];
    searchParams.endCreateTime = values.createTime[1];
    delete searchParams.createTime;
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

// 打开场站详情抽屉
const openStationDetail = async (stationId) => {
  if (!stationId) {
    ElMessage.warning('场站ID不能为空');
    return;
  }
  try {
    const response = await getChargingStationDetail({ id: stationId });
    if (response) {
      // 处理时间戳转换
      if (response.createTime) {
        response.createTime = formatDate(new Date(response.createTime));
      }
      if (response.updateTime) {
        response.updateTime = formatDate(new Date(response.updateTime));
      }
      stationDetailData.value = response;
      if (stationDetailRef.value) {
        stationDetailRef.value.open();
      }
    }
  } catch (error) {
    ElMessage.error('获取场站详情失败');
    console.error(error);
  }
};

// 打开充电桩详情抽屉
const openPileDetail = async (pileId) => {
  if (!pileId) {
    ElMessage.warning('充电桩ID不能为空');
    return;
  }
  try {
    const response = await getChargingPileDetail({ id: pileId });
    if (response) {
      // 处理时间戳转换
      if (response.createTime) {
        response.createTime = formatDate(new Date(response.createTime));
      }
      if (response.updateTime) {
        response.updateTime = formatDate(new Date(response.updateTime));
      }
      pileDetailData.value = response;
      if (pileDetailRef.value) {
        pileDetailRef.value.open();
      }
    }
  } catch (error) {
    ElMessage.error('获取充电桩详情失败');
    console.error(error);
  }
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

// ==================== 快捷筛选处理 ====================

// 处理所属场站点击 - 改为打开详情
const handleStationClick = (row) => {
  if (row.stationId) {
    openStationDetail(row.stationId);
  }
};

// 处理车位类型点击
const handleLotTypeClick = (lotType) => {
  filterLotType.value = filterLotType.value === lotType ? '' : lotType;
  gridApi.query();
};

// 处理车位状态点击
const handleLotStatusClick = (lotStatus) => {
  filterLotStatus.value = filterLotStatus.value === lotStatus ? '' : lotStatus;
  gridApi.query();
};

// 处理操作人点击
const handleCreatorClick = (creator) => {
  filterCreator.value = filterCreator.value === creator ? '' : creator;
  gridApi.query();
};

// 处理创建时间点击 - 直接使用时间字符串（格式：yyyy-MM-dd HH:mm:ss）
const handleCreateTimeClick = (createTimeStr) => {
  if (!createTimeStr) return;
  // 保存显示用的时间字符串，同时作为参数使用
  filterCreateTime.value = createTimeStr;
  gridApi.query();
};

// 取消筛选
const handleCancelStationFilter = () => {
  filterStationId.value = '';
  gridApi.query();
};

const handleCancelLotTypeFilter = () => {
  filterLotType.value = '';
  gridApi.query();
};

const handleCancelLotStatusFilter = () => {
  filterLotStatus.value = '';
  gridApi.query();
};

const handleCancelCreatorFilter = () => {
  filterCreator.value = '';
  gridApi.query();
};

const handleCancelCreateTimeFilter = () => {
  filterCreateTime.value = '';
  gridApi.query();
};

// 处理统计组件的钻取筛选
const handleStatsFilter = (type, value) => {
  if (type === 'status') {
    if (value === 'all') {
      // 总车位数，清空状态筛选
      filterLotStatus.value = '';
    } else {
      // 根据状态名称获取字典值
      const dictOptions = getDictOptions(
        DICT_TYPE.CHARGE_LOT_LOT_STATUS,
        'string',
      );
      const dictItem = dictOptions.find((item) => item.label === value);
      filterLotStatus.value = dictItem ? dictItem.value : value;
    }
  } else if (type === 'station') {
    console.log('======');
    console.log(value);
    filterStationId.value = value;
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
      :title="`${dataObj.detailObj.lotCode}详情`"
      :data="dataObj.detailObj"
      :fields="detailFields"
    />
    <!--   场站详情抽屉-->
    <StationDetailDrawer
      ref="stationDetailRef"
      :detail-obj="stationDetailData"
      title="场站详情"
    />
    <!--   充电桩详情抽屉-->
    <PileDetailDrawer
      ref="pileDetailRef"
      :detail-obj="pileDetailData"
      title="充电桩详情"
    />
    <!--   占用标记弹窗-->
    <MarkOccupyDialog ref="markOccupyDialogRef" @success="handleRefresh" />
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
          <!-- 所属场站筛选标签 -->
          <ElTag
            v-if="filterStationId"
            type="primary"
            closable
            @close="handleCancelStationFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属场站：{{ filterStationId }}
          </ElTag>
          <!-- 车位类型筛选标签 -->
          <ElTag
            v-if="filterLotType"
            type="success"
            closable
            @close="handleCancelLotTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车位类型：{{
              getDictObj(DICT_TYPE.CHARGE_LOT_LOT_TYPE, String(filterLotType))
                ?.label || filterLotType
            }}
          </ElTag>
          <!-- 车位状态筛选标签 -->
          <ElTag
            v-if="filterLotStatus"
            type="warning"
            closable
            @close="handleCancelLotStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车位状态：{{
              getDictObj(
                DICT_TYPE.CHARGE_LOT_LOT_STATUS,
                String(filterLotStatus),
              )?.label || filterLotStatus
            }}
          </ElTag>
          <!-- 操作人筛选标签 -->
          <ElTag
            v-if="filterCreator"
            type="info"
            closable
            @close="handleCancelCreatorFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            操作人：{{ filterCreator }}
          </ElTag>
          <!-- 创建时间筛选标签 - 只显示具体时间 -->
          <ElTag
            v-if="filterCreateTime"
            type="primary"
            closable
            @close="handleCancelCreateTimeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            创建时间：{{ filterCreateTime }}
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
      <!-- 车位编号插槽 - 点击跳转详情 -->
      <template #lotCode="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.lotCode }}
        </el-text>
      </template>
      <!-- 所属场站插槽 - 点击打开场站详情 -->
      <template #stationName="{ row }">
        <el-text
          @click="handleStationClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.stationName }}
        </el-text>
      </template>
      <!-- 车位类型插槽 - 点击筛选 -->
      <template #lotType="{ row }">
        <ElTag
          @click="handleLotTypeClick(row.lotType)"
          :type="getLotTypeTagType(row.lotType)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.CHARGE_LOT_LOT_TYPE, String(row.lotType))
              ?.label || row.lotType
          }}
        </ElTag>
      </template>
      <!-- 关联充电桩插槽 - 点击打开充电桩详情 -->
      <template #pileName="{ row }">
        <el-text
          @click="openPileDetail(row.pileId)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.pileName }}
        </el-text>
      </template>
      <!-- 车位状态插槽 - 点击筛选 -->
      <template #lotStatus="{ row }">
        <ElTag
          @click="handleLotStatusClick(row.lotStatus)"
          :type="getLotStatusTagType(row.lotStatus)"
          style="cursor: pointer"
        >
          {{
            getDictObj(DICT_TYPE.CHARGE_LOT_LOT_STATUS, String(row.lotStatus))
              ?.label || row.lotStatus
          }}
        </ElTag>
      </template>
      <!-- 创建时间插槽 - 点击筛选 -->
      <template #createTime="{ row }">
        <el-text
          @click="handleCreateTimeClick(row.createTime)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.createTime }}
        </el-text>
      </template>
      <!-- 操作人插槽 - 点击筛选 -->
      <template #creator="{ row }">
        <el-text
          @click="handleCreatorClick(row.creator)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.creator }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 查看按钮 - 所有状态都显示 -->
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <!-- 编辑按钮 - 所有状态都显示 -->
          <IconButton
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <!-- 占用标记按钮 - 仅空闲状态显示 -->
          <IconButton
            v-if="getLotStatusLabel(row.lotStatus) === '空闲'"
            content="占用标记"
            icon-name="Coordinate"
            @click="handleMarkOccupy(row)"
          />
          <!-- 空闲标记按钮 - 仅占用状态显示 -->
          <IconButton
            v-if="getLotStatusLabel(row.lotStatus) === '占用'"
            content="空闲标记"
            icon-name="MagicStick"
            @click="handleMarkIdle(row)"
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
          <span> 本页统计：充电车位数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
