<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  getOrderStatusTagType,
  getStatusTagType,
  orderDataList,
  orderDetailFields,
  orderTextObj,
  smsConfigDataList,
  smsConfigDetailFields,
  smsConfigTextObj,
  textObj,
  useFormSchema,
  useGridColumns,
  useOrderFormSchema,
  useOrderGridColumns,
  useSmsConfigFormSchema,
  useSmsConfigGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '卡种配置',
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
const currentTextObj = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return orderTextObj;
  } else if (props.activeTab === '短信通知配置') {
    return smsConfigTextObj;
  } else {
    return textObj;
  }
});

const getTitle = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return formData.value?.orderNo
      ? orderTextObj.editText
      : orderTextObj.addText;
  } else if (props.activeTab === '短信通知配置') {
    return formData.value?.templateId
      ? smsConfigTextObj.editText
      : smsConfigTextObj.addText;
  } else {
    return formData.value?.cardId ? textObj.editText : textObj.addText;
  }
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
const currentFormSchema = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return useOrderFormSchema();
  } else if (props.activeTab === '短信通知配置') {
    return useSmsConfigFormSchema();
  } else {
    return useFormSchema();
  }
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: currentFormSchema.value,
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (props.activeTab === '畅停卡订单') {
      if (formDrawerApi.sharedData.payload.title === orderTextObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.orderNo === formData.value?.orderNo) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else if (props.activeTab === '短信通知配置') {
      if (formDrawerApi.sharedData.payload.title === smsConfigTextObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.templateId === formData.value?.templateId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else {
      if (formDrawerApi.sharedData.payload.title === textObj.addText) {
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.cardId === formData.value?.cardId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (props.activeTab === '畅停卡订单') {
        if (formData.value?.orderNo) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
      } else if (props.activeTab === '短信通知配置') {
        if (formData.value?.templateId) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
      } else {
        if (formData.value?.cardId) {
          await formApi.setValues(formData.value);
        } else {
          formApi.resetForm();
        }
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
  if (props.activeTab === '畅停卡订单') {
    exportToExcel(
      dataObj.apilist,
      orderTextObj.excelName,
      orderTextObj.excelAllName,
    );
  } else if (props.activeTab === '短信通知配置') {
    exportToExcel(
      dataObj.apilist,
      smsConfigTextObj.excelName,
      smsConfigTextObj.excelAllName,
    );
  } else {
    exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
  }
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title:
        props.activeTab === '畅停卡订单'
          ? orderTextObj.addText
          : textObj.addText,
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title:
        props.activeTab === '畅停卡订单'
          ? orderTextObj.editText
          : textObj.editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  if (props.activeTab === '畅停卡订单') {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.orderNo]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => v.orderNo !== row.orderNo,
      );
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.orderNo]));
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } else if (props.activeTab === '短信通知配置') {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.templateName]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter((v) => v.templateId !== row.templateId);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.templateName]));
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  } else {
    const loadingInstance = ElLoading.service({
      text: $t('ui.actionMessage.deleting', [row.cardName]),
    });
    try {
      dataObj.apilist = dataObj.apilist.filter((v) => v.cardId !== row.cardId);
      ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.cardName]));
      handleRefresh();
    } finally {
      loadingInstance.close();
    }
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (props.activeTab === '畅停卡订单') {
      dataObj.apilist = dataObj.apilist.filter((v) => !checkedIds.value.includes(v.orderNo));
    } else if (props.activeTab === '短信通知配置') {
      dataObj.apilist = dataObj.apilist.filter((v) => !checkedIds.value.includes(v.templateId));
    } else {
      dataObj.apilist = dataObj.apilist.filter((v) => !checkedIds.value.includes(v.cardId));
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  if (props.activeTab === '畅停卡订单') {
    checkedIds.value = records.map((item) => item.orderNo);
  } else if (props.activeTab === '短信通知配置') {
    checkedIds.value = records.map((item) => item.templateId);
  } else {
    checkedIds.value = records.map((item) => item.cardId);
  }
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total:
    props.activeTab === '畅停卡订单'
      ? orderDataList().length
      : props.activeTab === '短信通知配置'
      ? smsConfigDataList().length
      : dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: props.activeTab === '畅停卡订单' ? orderDataList() : props.activeTab === '短信通知配置' ? smsConfigDataList() : dataList(),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName筛选数据
    const filteredList = dataObj.apilist.filter((v) => {
      // 状态筛选
      let statusMatch = true;
      if (props.activeTab === '畅停卡订单') {
        switch (activeName.value) {
          case '全部': {
            statusMatch = true;
            break;
          }
          case '已取消': {
            statusMatch = v.orderStatus === '已取消';
            break;
          }
          case '已激活': {
            statusMatch = v.orderStatus === '已激活';
            break;
          }
          case '已过期': {
            statusMatch = v.orderStatus === '已过期';
            break;
          }
          case '待激活': {
            statusMatch = v.orderStatus === '待激活';
            break;
          }
          // No default
        }
      } else if (props.activeTab === '短信通知配置') {
        switch (activeName.value) {
          case '全部': {
            statusMatch = true;
            break;
          }
          case '启用': {
            statusMatch = v.enableStatus === '启用';
            break;
          }
          case '禁用': {
            statusMatch = v.enableStatus === '禁用';
            break;
          }
          // No default
        }
      } else {
        switch (activeName.value) {
          case '下架': {
            statusMatch = v.status === '下架';
            break;
          }
          case '全部': {
            statusMatch = true;
            break;
          }
          case '在售': {
            statusMatch = v.status === '在售';
            break;
          }
          case '已过期': {
            statusMatch = v.status === '已过期';
            break;
          }
          // No default
        }
      }

    // 卡种类型筛选
    const cardTypeMatch =
      !filterCardType.value || v.cardType === filterCardType.value;

    // 适用车场筛选
    const applicableParkingLotMatch =
      !filterApplicableParkingLot.value ||
      v.applicableParkingLot === filterApplicableParkingLot.value;

    // 适用卡种筛选（短信通知配置标签页）
    const applicableCardMatch =
      !filterApplicableCard.value || v.applicableCard === filterApplicableCard.value;

    // 触发事件筛选（短信通知配置标签页）
    const triggerEventMatch =
      !filterTriggerEvent.value || v.triggerEvent === filterTriggerEvent.value;

    // 搜索条件筛选
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch = typeof value === 'string' ? searchMatch && v[key]?.toString().includes(value) : searchMatch && v[key] === value;
      }
    });

    return statusMatch && cardTypeMatch && applicableParkingLotMatch && applicableCardMatch && triggerEventMatch && searchMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const queryFormSchema = computed(() => {
  let schema;
  if (props.activeTab === '畅停卡订单') {
    schema = useOrderFormSchema();
  } else if (props.activeTab === '短信通知配置') {
    schema = useSmsConfigFormSchema();
  } else {
    schema = useFormSchema();
  }
  return schema.map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  });
});

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: queryFormSchema.value,
  // 是否可展开
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

const gridColumns = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return useOrderGridColumns();
  } else if (props.activeTab === '短信通知配置') {
    return useSmsConfigGridColumns();
  } else {
    return useGridColumns();
  }
});

const gridKeyField = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return 'orderNo';
  } else if (props.activeTab === '短信通知配置') {
    return 'templateId';
  } else {
    return 'cardId';
  }
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: gridKeyField.value,
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

const activeName = ref('全部');

// 快捷筛选变量
const filterCardType = ref(''); // 卡种类型筛选：空=未筛选，有值=当前筛选卡种类型
const filterApplicableParkingLot = ref(''); // 适用车场筛选：空=未筛选，有值=当前筛选适用车场
const filterApplicableCard = ref(''); // 适用卡种筛选：空=未筛选，有值=当前筛选适用卡种
const filterTriggerEvent = ref(''); // 触发事件筛选：空=未筛选，有值=当前筛选触发事件

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理卡种类型点击筛选
const handleCardTypeClick = (cardType) => {
  filterCardType.value = filterCardType.value === cardType ? '' : cardType;
  handleRefresh();
};

/** 取消卡种类型筛选（筛选标签关闭按钮） */
const handleCancelCardTypeFilter = () => {
  filterCardType.value = '';
  handleRefresh();
};

// 处理适用车场点击筛选
const handleApplicableParkingLotClick = (applicableParkingLot) => {
  filterApplicableParkingLot.value =
    filterApplicableParkingLot.value === applicableParkingLot
      ? ''
      : applicableParkingLot;
  handleRefresh();
};

/** 取消适用车场筛选（筛选标签关闭按钮） */
const handleCancelApplicableParkingLotFilter = () => {
  filterApplicableParkingLot.value = '';
  handleRefresh();
};

// 处理适用卡种点击筛选
const handleApplicableCardClick = (applicableCard) => {
  filterApplicableCard.value = filterApplicableCard.value === applicableCard ? '' : applicableCard;
  handleRefresh();
};

/** 取消适用卡种筛选（筛选标签关闭按钮） */
const handleCancelApplicableCardFilter = () => {
  filterApplicableCard.value = '';
  handleRefresh();
};

// 处理触发事件点击筛选
const handleTriggerEventClick = (triggerEvent) => {
  filterTriggerEvent.value = filterTriggerEvent.value === triggerEvent ? '' : triggerEvent;
  handleRefresh();
};

/** 取消触发事件筛选（筛选标签关闭按钮） */
const handleCancelTriggerEventFilter = () => {
  filterTriggerEvent.value = '';
  handleRefresh();
};

// 根据activeTab显示不同的标签页
const tabsData = computed(() => {
  if (props.activeTab === '畅停卡订单') {
    return [
      { label: '全部' },
      { label: '待激活' },
      { label: '已激活' },
      { label: '已过期' },
      { label: '已取消' },
    ];
  } else if (props.activeTab === '短信通知配置') {
    return [
      { label: '全部' },
      { label: '启用' },
      { label: '禁用' },
    ];
  } else {
    return [
      { label: '全部' },
      { label: '在售' },
      { label: '下架' },
      { label: '已过期' },
    ];
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.activeTab === '畅停卡订单') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已取消': {
        count = dataObj.apilist.filter(
          (v) => v.orderStatus === '已取消',
        ).length;
        break;
      }
      case '已激活': {
        count = dataObj.apilist.filter(
          (v) => v.orderStatus === '已激活',
        ).length;
        break;
      }
      case '已过期': {
        count = dataObj.apilist.filter(
          (v) => v.orderStatus === '已过期',
        ).length;
        break;
      }
      case '待激活': {
        count = dataObj.apilist.filter(
          (v) => v.orderStatus === '待激活',
        ).length;
        break;
      }
      // No default
    }
  } else if (props.activeTab === '短信通知配置') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '启用': {
        count = dataObj.apilist.filter(
          (v) => v.enableStatus === '启用',
        ).length;
        break;
      }
      case '禁用': {
        count = dataObj.apilist.filter(
          (v) => v.enableStatus === '禁用',
        ).length;
        break;
      }
      // No default
    }
  } else {
    switch (item.label) {
      case '下架': {
        count = dataObj.apilist.filter((v) => v.status === '下架').length;
        break;
      }
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '在售': {
        count = dataObj.apilist.filter((v) => v.status === '在售').length;
        break;
      }
      case '已过期': {
        count = dataObj.apilist.filter((v) => v.status === '已过期').length;
        break;
      }
      // No default
    }
  }

  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 处理上下架状态切换
const handleToggleStatus = async (row) => {
  // 已过期的无法设置上下架
  if (row.status === '已过期') {
    ElMessage.warning('已过期的卡种无法设置上下架');
    return;
  }

  const currentStatus = row.status;
  const newStatus = currentStatus === '在售' ? '下架' : '在售';
  const confirmMessage =
    currentStatus === '在售' ? '确定要下架该卡种吗？' : '确定要上架该卡种吗？';

  try {
    await ElMessageBox.confirm(confirmMessage, '操作确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: `正在${newStatus}卡种...`,
    });

    // 更新数据中的状态
    dataObj.apilist.forEach((v, i) => {
      if (v.cardId === row.cardId) {
        dataObj.apilist[i].status = newStatus;
      }
    });

    ElMessage.success(`${newStatus}成功`);
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 处理退款操作
const handleRefund = async (row) => {
  try {
    await ElMessageBox.confirm('确定要为该订单发起退款吗？', '退款确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: '正在处理退款...',
    });

    // 只更新数据中的支付状态为已退款，保持订单状态不变
    dataObj.apilist.forEach((v, i) => {
      if (v.orderNo === row.orderNo) {
        dataObj.apilist[i].payStatus = '已退款';
      }
    });

    ElMessage.success('退款成功');
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退款失败');
    }
  }
};

// 处理禁用操作
const handleDisable = async (row) => {
  try {
    await ElMessageBox.confirm('确定要禁用该短信通知模板吗？', '禁用确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const loadingInstance = ElLoading.service({
      text: '正在处理禁用操作...',
    });

    // 更新数据中的启用状态为禁用
    dataObj.apilist.forEach((v, i) => {
      if (v.templateId === row.templateId) {
        dataObj.apilist[i].enableStatus = '禁用';
      }
    });

    ElMessage.success('禁用成功');
    handleRefresh();

    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('禁用失败');
    }
  }
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
      :title="
        props.activeTab === '畅停卡订单'
          ? `${dataObj.detailObj.orderNo}详情`
          : props.activeTab === '短信通知配置'
          ? `${dataObj.detailObj.templateName}详情`
          : `${dataObj.detailObj.cardName}详情`
      "
      :data="dataObj.detailObj"
      :fields="
        props.activeTab === '畅停卡订单'
          ? orderDetailFields
          : props.activeTab === '短信通知配置'
          ? smsConfigDetailFields
          : detailFields
      "
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
          <!-- 卡种类型筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterCardType"
            type="primary"
            closable
            @close="handleCancelCardTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            卡种类型：{{ filterCardType }}
          </el-tag>
          <!-- 适用车场筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterApplicableParkingLot"
            type="success"
            closable
            @close="handleCancelApplicableParkingLotFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用车场：{{ filterApplicableParkingLot }}
          </el-tag>
          <!-- 适用卡种筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterApplicableCard"
            type="primary"
            closable
            @close="handleCancelApplicableCardFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用卡种：{{ filterApplicableCard }}
          </el-tag>
          <!-- 触发事件筛选标签：绿色success，仅筛选时显示 -->
          <el-tag
            v-if="filterTriggerEvent"
            type="success"
            closable
            @close="handleCancelTriggerEventFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            触发事件：{{ filterTriggerEvent }}
          </el-tag>
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
      <!-- 卡种配置标签页插槽 -->
      <template #cardId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.cardId }}
        </el-text>
      </template>
      <template #cardType="{ row }">
        <el-text
          @click="handleCardTypeClick(row.cardType)"
          class="common-align"
          type="primary"
        >
          {{ row.cardType }}
        </el-text>
      </template>
      <template #applicableParkingLot="{ row }">
        <el-text
          @click="handleApplicableParkingLotClick(row.applicableParkingLot)"
          class="common-align"
          type="primary"
        >
          {{ row.applicableParkingLot }}
        </el-text>
      </template>
      <template #enableStatus="{ row }">
        <el-tag :type="getStatusTagType(row.enableStatus)">
          {{ row.enableStatus }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 畅停卡订单标签页插槽 -->
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #payStatus="{ row }">
        <el-tag :type="getOrderStatusTagType(row.payStatus)">
          {{ row.payStatus }}
        </el-tag>
      </template>
      <template #orderStatus="{ row }">
        <el-tag :type="getOrderStatusTagType(row.orderStatus)">
          {{ row.orderStatus }}
        </el-tag>
      </template>

      <!-- 短信通知配置标签页插槽 -->
      <template #templateId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.templateId }}
        </el-text>
      </template>

      <template #applicableCard="{ row }">
        <el-text
          @click="handleApplicableCardClick(row.applicableCard)"
          class="common-align"
          type="primary"
        >
          {{ row.applicableCard }}
        </el-text>
      </template>
      <template #triggerEvent="{ row }">
        <el-text
          @click="handleTriggerEventClick(row.triggerEvent)"
          class="common-align"
          type="primary"
        >
          {{ row.triggerEvent }}
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
          <!-- 上下架按钮只在卡种配置标签页显示 -->
          <IconButton
            v-if="props.activeTab !== '畅停卡订单' && props.activeTab !== '短信通知配置'"
            :content="row.status === '在售' ? '下架' : '上架'"
            :icon-name="row.status === '在售' ? 'Bottom' : 'Top'"
            :color="row.status === '在售' ? '#E6A23C' : '#67C23A'"
            :disabled="row.status === '已过期'"
            @click="handleToggleStatus(row)"
          />
          <!-- 禁用按钮只在短信通知配置标签页显示 -->
          <IconButton
            v-if="props.activeTab === '短信通知配置' && row.enableStatus === '启用'"
            content="禁用"
            icon-name="Lock"
            color="#F56C6C"
            @click="handleDisable(row)"
          />
          <!-- 退款按钮只在畅停卡订单标签页显示，仅已支付订单可操作 -->
          <IconButton
            v-if="props.activeTab === '畅停卡订单' && row.payStatus === '已支付'"
            content="退款"
            icon-name="RefreshRight"
            color="#409EFF"
            @click="handleRefund(row)"
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
          <span v-if="props.activeTab === '畅停卡订单'">
            本页统计：畅停卡订单数量: {{ dataObj.total }}; 待激活:
            {{
              dataObj.apilist.filter((v) => v.orderStatus === '待激活').length
            }}; 已激活:
            {{
              dataObj.apilist.filter((v) => v.orderStatus === '已激活').length
            }}; 已过期:
            {{
              dataObj.apilist.filter((v) => v.orderStatus === '已过期').length
            }}; 已取消:
            {{
              dataObj.apilist.filter((v) => v.orderStatus === '已取消').length
            }}
          </span>
          <span v-else-if="props.activeTab === '短信通知配置'">
            本页统计：短信通知模板数量: {{ dataObj.total }}; 启用:
            {{
              dataObj.apilist.filter((v) => v.enableStatus === '启用').length
            }}; 禁用:
            {{
              dataObj.apilist.filter((v) => v.enableStatus === '禁用').length
            }}
          </span>
          <span v-else>
            本页统计：无限停车卡数量: {{ dataObj.total }}; 在售:
            {{ dataObj.apilist.filter((v) => v.status === '在售').length }};
            下架:
            {{ dataObj.apilist.filter((v) => v.status === '下架').length }};
            已过期:
            {{ dataObj.apilist.filter((v) => v.status === '已过期').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：{{
              props.activeTab === '畅停卡订单'
                ? orderTextObj.total
                : props.activeTab === '短信通知配置'
                ? smsConfigTextObj.total
                : textObj.total
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
