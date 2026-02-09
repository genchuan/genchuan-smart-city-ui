<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElTimeline, ElTimelineItem } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, textObj, useFormSchema, useGridColumns, detailFields, orderStatusOptions, payStatusOptions, statusTrackDataList, statusTrackTextObj, useStatusTrackFormSchema, useStatusTrackGridColumns, statusTrackDetailFields, statusOptions, orderDetailDataList, orderDetailTextObj, useOrderDetailFormSchema, useOrderDetailGridColumns, orderDetailDetailFields, orderDetailStatusOptions } from './data';
import DetailDrawer from '#/components/common/DetailDrawer.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '订单生成',
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
  if (props.activeTab === '订单生成') {
    return textObj;
  } else if (props.activeTab === '状态跟踪') {
    return statusTrackTextObj;
  } else {
    return orderDetailTextObj;
  }
});

const getTitle = computed(() => {
  return formData.value?.orderNo ? currentTextObj.value.editText : currentTextObj.value.addText;
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
  if (props.activeTab === '订单生成') {
    return useFormSchema();
  } else if (props.activeTab === '状态跟踪') {
    return useStatusTrackFormSchema();
  } else {
    return useOrderDetailFormSchema();
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
  watch: {
    'props.activeTab': {
      handler() {
        formApi.setSchema(currentFormSchema.value);
      },
      immediate: true,
    },
  },
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === currentTextObj.value.addText) {
      if (props.activeTab === '订单生成') {
        // 生成新的订单编号
        obj.orderNo = `TEMP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(dataObj.apilist.length + 1).padStart(4, '0')}`;
        obj.createTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        obj.operator = '系统';
      } else {
        // 状态跟踪记录
        obj.changeTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.orderNo === formData.value?.orderNo) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.orderNo) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 补录抽屉
const [SupplementDrawer, supplementDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '订单补录',
  onCancel() {
    supplementDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 生成新的订单编号
    obj.orderNo = `TEMP${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(dataObj.apilist.length + 1).padStart(4, '0')}`;
    obj.createTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    obj.operator = '系统';
    obj.orderStatus = '待支付';
    obj.payStatus = '待支付';
    dataObj.apilist.push(obj);
    handleRefresh();
    supplementDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
    }
  },
});

// 跟踪抽屉
const [TrackDrawer, trackDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '订单状态跟踪',
  onCancel() {
    trackDrawerApi.close();
  },
  onConfirm() {
    trackDrawerApi.close();
  },
});

// 跟踪数据
const trackData = ref({
  orderNo: '',
  carNumber: '',
  timeline: []
});

// 干预抽屉
const [InterventionDrawer, interventionDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '异常订单干预',
  onCancel() {
    interventionDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 这里可以添加干预措施的提交逻辑
    ElMessage.success('干预措施已提交');
    interventionDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
    }
  },
});

// 干预表单 schema
const useInterventionFormSchema = () => {
  return [
    {
      fieldName: 'interventionMeasure',
      label: '干预措施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入干预措施',
        type: 'textarea',
        rows: 4
      },
      rules: 'required'
    },
    {
      fieldName: 'interventionReason',
      label: '干预原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入干预原因',
        type: 'textarea',
        rows: 3
      }
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人'
      },
      rules: 'required'
    }
  ];
};

// 开票抽屉
const [InvoiceDrawer, invoiceDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '开具发票',
  onCancel() {
    invoiceDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 这里可以添加开票逻辑
    ElMessage.success('电子发票已生成');
    invoiceDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
    }
  },
});

// 开票表单 schema
const useInvoiceFormSchema = () => {
  return [
    {
      fieldName: 'invoiceType',
      label: '发票类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票类型',
        options: [
          { label: '增值税普通发票', value: '普通发票' },
          { label: '增值税专用发票', value: '专用发票' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'invoiceTitle',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票抬头'
      },
      rules: 'required'
    },
    {
      fieldName: 'taxpayerId',
      label: '纳税人识别号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入纳税人识别号'
      },
      rules: 'required'
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话'
      },
      rules: 'required'
    },
    {
      fieldName: 'contactEmail',
      label: '联系邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系邮箱'
      },
      rules: 'required'
    }
  ];
};

/** 刷新表格 */
const gridApiRef = ref(null);

function handleRefresh() {
  if (gridApiRef.value) {
    gridApiRef.value.query();
  }
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
}

/** 补录订单 */
function handleSupplement() {
  supplementDrawerApi.open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: textObj.editText,
      ...row,
    })
    .open();
}

/** 取消订单 */
async function handleCancelOrder(row) {
  try {
    await confirm('确定要取消该订单吗？');
    const loadingInstance = ElLoading.service({
      text: '取消订单中...'
    });

    // 更新订单状态为已取消
    const orderIndex = dataObj.apilist.findIndex(v => v.orderNo === row.orderNo);
    if (orderIndex !== -1) {
      dataObj.apilist[orderIndex].orderStatus = '已取消';
      dataObj.apilist[orderIndex].payStatus = '待支付';
    }

    handleRefresh();
    ElMessage.success('订单已成功取消');
    loadingInstance.close();
  } catch (error) {
    // 用户取消确认
  }
}

/** 跟踪订单状态 */
function handleTrackStatus(row) {
  // 模拟订单状态流转时间轴数据
  trackData.value = {
    orderNo: row.orderNo,
    carNumber: row.carNumber,
    timeline: [
      {
        time: '2026-02-01 08:30:00',
        status: '订单创建',
        description: '系统生成临时停车订单'
      },
      {
        time: '2026-02-01 08:30:00',
        status: '待支付',
        description: '等待用户支付停车费用'
      },
      {
        time: '2026-02-01 09:30:00',
        status: '已支付',
        description: '用户完成支付'
      },
      {
        time: '2026-02-01 09:30:00',
        status: '已完成',
        description: '订单支付成功，交易完成'
      }
    ]
  };
  trackDrawerApi.open();
}

/** 干预异常订单 */
function handleIntervention() {
  // 检查是否选中了异常订单
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择需要干预的异常订单');
    return;
  }

  // 打开干预抽屉
  interventionDrawerApi.open();
}

/** 下载订单明细PDF */
function handleDownloadOrder(row) {
  // 模拟PDF下载功能
  ElMessage.success('订单明细PDF文件正在下载');
  // 这里可以添加实际的PDF下载逻辑
  console.log('下载订单明细:', row.orderNo);
}

/** 开具发票 */
function handleInvoice(row) {
  // 打开开票抽屉
  invoiceDrawerApi.open();
}
// async function handleDelete(row) {
//   const loadingInstance = ElLoading.service({
//     text: $t('ui.actionMessage.deleting', [row.orderNo]),
//   });
//   try {
//     dataObj.apilist = dataObj.apilist.filter((v) => v.orderNo !== row.orderNo);
//     ElMessage.success(
//       $t('ui.actionMessage.deleteSuccess', [row.orderNo]),
//     );
//     handleRefresh();
//   } finally {
//     loadingInstance.close();
//   }
// }

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.orderNo),
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
  checkedIds.value = records.map((item) => item.orderNo);
}
const currentDataList = computed(() => {
  if (props.activeTab === '订单生成') {
    return dataList();
  } else if (props.activeTab === '状态跟踪') {
    return statusTrackDataList();
  } else {
    return orderDetailDataList();
  }
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: currentDataList.value.length,
  currentPage: 1,
  pageSize: 10,
  apilist: currentDataList.value,
  list: [],
});

// 监听标签页变化，更新数据列表
watch(() => props.activeTab, () => {
  dataObj.apilist = currentDataList.value;
  dataObj.total = currentDataList.value.length;
  handleRefresh();
}, { immediate: true });
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和筛选条件筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (activeName.value !== '全部') {
      if (props.activeTab === '订单生成') {
        statusMatch = v.orderStatus === activeName.value;
      } else if (props.activeTab === '状态跟踪') {
        statusMatch = v.currentStatus === activeName.value;
      } else {
        statusMatch = v.orderStatusName === activeName.value;
      }
    }

    // 快捷筛选
    const carNumberMatch = !filterCarNumber.value || v.carNumber === filterCarNumber.value;
    const lotNameMatch = !filterLotName.value || v.lotName === filterLotName.value;
    const feeTypeNameMatch = !filterFeeTypeName.value || v.feeTypeName === filterFeeTypeName.value;
    const payStatusMatch = !filterPayStatus.value || v.payStatus === filterPayStatus.value;
    const payTypeMatch = !filterPayType.value || v.payType === filterPayType.value;

    return statusMatch && carNumberMatch && lotNameMatch && feeTypeNameMatch && payStatusMatch && payTypeMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

const currentQuerySchema = computed(() => {
  let schema;
  if (props.activeTab === '订单生成') {
    schema = useFormSchema();
  } else if (props.activeTab === '状态跟踪') {
    schema = useStatusTrackFormSchema();
  } else {
    schema = useOrderDetailFormSchema();
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
  schema: currentQuerySchema.value,
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  watch: {
    'props.activeTab': {
      handler() {
        if (QueryForm) {
          QueryForm.setSchema(currentQuerySchema.value);
        }
      },
      immediate: true,
    },
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

const currentGridColumns = computed(() => {
  if (props.activeTab === '订单生成') {
    return useGridColumns();
  } else if (props.activeTab === '状态跟踪') {
    return useStatusTrackGridColumns();
  } else {
    return useOrderDetailGridColumns();
  }
});

const [Grid, gridApi] = useVbenVxeGrid({
  onMounted() {
    gridApiRef.value = gridApi;
  },
  gridOptions: {
    columns: currentGridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'orderNo',
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
  watch: {
    'props.activeTab': {
      handler() {
        if (gridApiRef.value) {
          gridApiRef.value.setColumns(currentGridColumns.value);
        }
      },
      immediate: true,
    },
  },
});

const activeName = ref('全部');

// 快捷筛选变量
const filterCarNumber = ref(''); // 车牌号码筛选
const filterLotName = ref(''); // 所属车场筛选
const filterFeeTypeName = ref(''); // 费率类型筛选
const filterPayStatus = ref(''); // 支付状态筛选
const filterPayType = ref(''); // 支付方式筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 根据当前标签页使用不同的状态选项
const tabsData = computed(() => {
  if (props.activeTab === '订单生成') {
    return orderStatusOptions;
  } else if (props.activeTab === '状态跟踪') {
    return statusOptions;
  } else {
    return orderDetailStatusOptions;
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (item.value === '') {
    count = dataObj.apilist.length;
  } else {
    if (props.activeTab === '订单生成') {
      count = dataObj.apilist.filter((v) => v.orderStatus === item.value).length;
    } else if (props.activeTab === '状态跟踪') {
      count = dataObj.apilist.filter((v) => v.currentStatus === item.value).length;
    } else {
      count = dataObj.apilist.filter((v) => v.orderStatusName === item.value).length;
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

// 快捷筛选处理函数

// 处理车牌号码点击
const handleCarNumberClick = (carNumber) => {
  filterCarNumber.value = filterCarNumber.value === carNumber ? '' : carNumber;
  gridApi.query();
};

/** 取消车牌号码筛选 */
const handleCancelCarNumberFilter = () => {
  filterCarNumber.value = '';
  gridApi.query();
};

// 处理所属车场点击
const handleLotNameClick = (lotName) => {
  filterLotName.value = filterLotName.value === lotName ? '' : lotName;
  gridApi.query();
};

/** 取消所属车场筛选 */
const handleCancelLotNameFilter = () => {
  filterLotName.value = '';
  gridApi.query();
};

// 处理费率类型点击
const handleFeeTypeNameClick = (feeTypeName) => {
  filterFeeTypeName.value = filterFeeTypeName.value === feeTypeName ? '' : feeTypeName;
  gridApi.query();
};

/** 取消费率类型筛选 */
const handleCancelFeeTypeNameFilter = () => {
  filterFeeTypeName.value = '';
  gridApi.query();
};

// 处理支付状态点击
const handlePayStatusClick = (payStatus) => {
  filterPayStatus.value = filterPayStatus.value === payStatus ? '' : payStatus;
  gridApi.query();
};

/** 取消支付状态筛选 */
const handleCancelPayStatusFilter = () => {
  filterPayStatus.value = '';
  gridApi.query();
};

// 处理支付方式点击
const handlePayTypeClick = (payType) => {
  filterPayType.value = filterPayType.value === payType ? '' : payType;
  gridApi.query();
};

/** 取消支付方式筛选 */
const handleCancelPayTypeFilter = () => {
  filterPayType.value = '';
  gridApi.query();
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <SupplementDrawer>
      <Form />
    </SupplementDrawer>
    <TrackDrawer>
      <div class="track-drawer-content">
        <div class="track-header">
          <div class="order-info-item">
            <span class="label">订单编号：</span>
            <span class="value">{{ trackData.orderNo }}</span>
          </div>
          <div class="order-info-item">
            <span class="label">车牌号码：</span>
            <span class="value">{{ trackData.carNumber }}</span>
          </div>
        </div>
        <div class="track-timeline">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in trackData.timeline"
              :key="index"
              :timestamp="item.time"
              :type="index === 0 ? 'primary' : index === trackData.timeline.length - 1 ? 'success' : 'info'"
              :size="16"
              :icon="index === 0 ? 'Plus' : index === trackData.timeline.length - 1 ? 'Check' : 'Clock'"
            >
              <div class="timeline-item-content">
                <div class="status">{{ item.status }}</div>
                <div class="description">{{ item.description }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </TrackDrawer>


    <InterventionDrawer>
      <Form :schema="useInterventionFormSchema()" />
    </InterventionDrawer>
    <InvoiceDrawer>
      <Form :schema="useInvoiceFormSchema()" />
    </InvoiceDrawer>
<!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${dataObj.detailObj.orderNo}详情`"
      :data="dataObj.detailObj"
      :fields="props.activeTab === '订单生成' ? detailFields : props.activeTab === '状态跟踪' ? statusTrackDetailFields : orderDetailDetailFields"
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
          <!-- 快捷筛选标签 -->
          <el-tag
            v-if="filterCarNumber"
            type="primary"
            closable
            @close="handleCancelCarNumberFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号码：{{ filterCarNumber }}
          </el-tag>
          <el-tag
            v-if="filterLotName"
            type="success"
            closable
            @close="handleCancelLotNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属车场：{{ filterLotName }}
          </el-tag>
          <el-tag
            v-if="filterFeeTypeName"
            type="warning"
            closable
            @close="handleCancelFeeTypeNameFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            费率类型：{{ filterFeeTypeName }}
          </el-tag>
          <el-tag
            v-if="filterPayStatus"
            type="success"
            closable
            @close="handleCancelPayStatusFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付状态：{{ filterPayStatus }}
          </el-tag>
          <el-tag
            v-if="filterPayType"
            type="danger"
            closable
            @close="handleCancelPayTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付方式：{{ filterPayType }}
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
          <!-- 订单生成标签页特有按钮 -->
          <IconButton
            v-if="props.activeTab === '订单生成'"
            content="补录"
            icon-name="Edit"
            @click="handleSupplement"
          />
          <!-- 状态跟踪标签页特有按钮 -->
          <IconButton
            v-if="props.activeTab === '状态跟踪'"
            content="干预"
            icon-name="Operation"
            @click="handleIntervention"
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
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>

      <!-- 车牌号码快捷筛选 -->
      <template #carNumber="{ row }">
        <el-text
          @click="handleCarNumberClick(row.carNumber)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.carNumber }}
        </el-text>
      </template>

      <!-- 所属车场快捷筛选 -->
      <template #lotName="{ row }">
        <el-text
          @click="handleLotNameClick(row.lotName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.lotName }}
        </el-text>
      </template>

      <!-- 费率类型快捷筛选 -->
      <template #feeTypeName="{ row }">
        <el-text
          @click="handleFeeTypeNameClick(row.feeTypeName)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.feeTypeName }}
        </el-text>
      </template>

      <!-- 支付状态快捷筛选 -->
      <template #payStatus="{ row }">
        <el-tag
          :type="row.payStatus === '已支付' ? 'success' : row.payStatus === '待支付' ? 'warning' : 'danger'"
          @click="handlePayStatusClick(row.payStatus)"
          class="cursor-pointer"
        >
          {{ row.payStatus }}
        </el-tag>
      </template>

      <!-- 支付方式快捷筛选 -->
      <template #payType="{ row }">
        <el-text
          @click="handlePayTypeClick(row.payType)"
          class="common-align cursor-pointer"
          type="primary"
        >
          {{ row.payType || '-' }}
        </el-text>
      </template>
      <template #orderStatus="{ row }">
        <el-tag :type="row.orderStatus === '已完成' ? 'success' : row.orderStatus === '待支付' ? 'warning' : 'danger'">
          {{ row.orderStatus }}
        </el-tag>
      </template>

      <template #currentStatus="{ row }">
        <el-tag :type="row.currentStatus === '已完成' ? 'success' : row.currentStatus === '待支付' ? 'warning' : 'danger'">
          {{ row.currentStatus }}
        </el-tag>
      </template>
      <template #orderStatusName="{ row }">
        <el-tag :type="row.orderStatusName === '已完成' ? 'success' : row.orderStatusName === '待支付' ? 'warning' : 'danger'">
          {{ row.orderStatusName }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 - 所有标签页都有 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 订单生成标签页特有按钮 -->
          <template v-if="props.activeTab === '订单生成'">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="取消"
              icon-name="RefreshLeft"
              @click="handleCancelOrder(row)"
            />
          </template>

          <!-- 状态跟踪标签页特有按钮 -->
          <template v-else-if="props.activeTab === '状态跟踪'">
            <IconButton
              content="跟踪"
              icon-name="Operation"
              @click="handleTrackStatus(row)"
            />
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
          </template>

          <!-- 订单明细标签页特有按钮 -->
          <template v-else-if="props.activeTab === '订单明细'">
            <IconButton
              content="下载"
              icon-name="Download"
              @click="handleDownloadOrder(row)"
            />
            <IconButton
              content="开票"
              icon-name="Tickets"
              @click="handleInvoice(row)"
            />
          </template>

          <!-- 删除按钮 - 所有标签页都有 -->
<!--          <IconButton-->
<!--            content="删除"-->
<!--            icon-name="delete"-->
<!--            color="#F56C6C"-->
<!--            @click="handleDelete(row)"-->
<!--          />-->
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
          <span> 本页统计：订单数量: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ currentTextObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.track-drawer-content {
  padding: 20px;
  font-size: 14px;
}

.track-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.order-info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.order-info-item .label {
  font-weight: 500;
  margin-right: 8px;
  color: #606266;
  min-width: 80px;
}

.order-info-item .value {
  color: #303133;
  font-weight: 400;
}

.track-timeline {
  margin-top: 20px;
}

.timeline-item-content {
  padding: 8px 0;
}

.timeline-item-content .status {
  font-weight: 500;
  margin-bottom: 4px;
  color: #303133;
}

.timeline-item-content .description {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

.el-timeline-item__timestamp {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
