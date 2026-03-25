<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import IconButton from '#/components/common/IconButton.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  detailFieldsOutbound,
  detailFieldsStock,
  getWorkorderByNo,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'inbound',
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
  if (props.type === 'outbound') {
    return formData.value?.outId
      ? textObj.outboundEditText
      : textObj.outboundAddText;
  } else if (props.type === 'stock') {
    return formData.value?.sparePartId
      ? textObj.stockEditText
      : textObj.stockAddText;
  }
  return formData.value?.inId ? textObj.editText : textObj.addText;
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
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: useFormSchema(props.type),
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
    let currentList;
    let idField;
    let addText;

    if (props.type === 'outbound') {
      currentList = dataObj.outboundList;
      idField = 'outId';
      addText = textObj.outboundAddText;
    } else if (props.type === 'stock') {
      currentList = dataObj.stockList;
      idField = 'sparePartId';
      addText = textObj.stockAddText;
    } else {
      currentList = dataObj.inboundList;
      idField = 'inId';
      addText = textObj.addText;
    }

    if (formDrawerApi.sharedData.payload.title === addText) {
      currentList.push(obj);
    } else {
      currentList.forEach((v, i) => {
        if (v[idField] === formData.value?.[idField]) {
          currentList[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      let idField;
      if (props.type === 'outbound') {
        idField = 'outId';
      } else if (props.type === 'stock') {
        idField = 'sparePartId';
      } else {
        idField = 'inId';
      }
      if (formData.value?.[idField]) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 入库表单
const [StockInForm, stockInFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: useFormSchema('inbound'),
  showDefaultActions: false,
});

// 出库表单
const [StockOutForm, stockOutFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: useFormSchema('outbound'),
  showDefaultActions: false,
});

// 入库抽屉
const [StockInDrawer, stockInDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    stockInDrawerApi.close();
  },
  onConfirm() {
    const obj = stockInFormApi.form.values;
    // 添加到入库列表
    dataObj.inboundList.push(obj);
    // 更新库存数量
    const stockItem = dataObj.stockList.find(
      (item) => item.sparePartId === obj.sparePartId,
    );
    if (stockItem) {
      stockItem.stockQuantity =
        (Number.parseInt(stockItem.stockQuantity) || 0) +
        (Number.parseInt(obj.quantity) || 0);
      // 更新库存状态
      stockItem.stockStatus =
        stockItem.stockQuantity >= stockItem.safeStock ? '正常' : '不足';
    }
    handleRefresh();
    stockInDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = stockInDrawerApi.getData();
      if (data) {
        await stockInFormApi.setValues(data);
      } else {
        stockInFormApi.resetForm();
      }
    }
  },
});

// 出库抽屉
const [StockOutDrawer, stockOutDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    stockOutDrawerApi.close();
  },
  onConfirm() {
    const obj = stockOutFormApi.form.values;
    // 添加到出库列表
    dataObj.outboundList.push(obj);
    // 更新库存数量
    const stockItem = dataObj.stockList.find(
      (item) => item.sparePartId === obj.sparePartId,
    );
    if (stockItem) {
      stockItem.stockQuantity =
        (Number.parseInt(stockItem.stockQuantity) || 0) -
        (Number.parseInt(obj.outQuantity) || 0);
      // 更新库存状态
      if (stockItem.stockQuantity >= stockItem.safeStock) {
        stockItem.stockStatus = '正常';
      } else if (stockItem.stockQuantity <= 0) {
        stockItem.stockStatus = '不足';
      } else {
        stockItem.stockStatus = '不足';
      }
    }
    handleRefresh();
    stockOutDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = stockOutDrawerApi.getData();
      if (data) {
        await stockOutFormApi.setValues(data);
      } else {
        stockOutFormApi.resetForm();
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
  let currentList;
  let excelName;
  let excelAllName;

  if (props.type === 'outbound') {
    currentList = dataObj.outboundList;
    excelName = textObj.outboundExcelName;
    excelAllName = textObj.outboundExcelAllName;
  } else if (props.type === 'stock') {
    currentList = dataObj.stockList;
    excelName = textObj.stockExcelName;
    excelAllName = textObj.stockExcelAllName;
  } else {
    currentList = dataObj.inboundList;
    excelName = textObj.excelName;
    excelAllName = textObj.excelAllName;
  }
  exportToExcel(currentList, excelName, excelAllName);
}

/** 创建设备 */
function handleCreate() {
  let addText;
  if (props.type === 'outbound') {
    addText = textObj.outboundAddText;
  } else if (props.type === 'stock') {
    addText = textObj.stockAddText;
  } else {
    addText = textObj.addText;
  }
  formDrawerApi
    .setData({
      title: addText,
    })
    .open();
}

/** 编辑设备 */
function handleEdit(row) {
  let editText;
  if (props.type === 'outbound') {
    editText = textObj.outboundEditText;
  } else if (props.type === 'stock') {
    editText = textObj.stockEditText;
  } else {
    editText = textObj.editText;
  }
  formDrawerApi
    .setData({
      title: editText,
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.partName]),
  });
  try {
    let idField;
    if (props.type === 'outbound') {
      idField = 'outId';
      dataObj.outboundList = dataObj.outboundList.filter(
        (v) => v.outId !== row.outId,
      );
    } else if (props.type === 'stock') {
      idField = 'sparePartId';
      dataObj.stockList = dataObj.stockList.filter(
        (v) => v.sparePartId !== row.sparePartId,
      );
    } else {
      idField = 'inId';
      dataObj.inboundList = dataObj.inboundList.filter(
        (v) => v.inId !== row.inId,
      );
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.partName]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (props.type === 'outbound') {
      dataObj.outboundList = dataObj.outboundList.filter(
        (v) => !checkedIds.value.includes(v.outId),
      );
    } else if (props.type === 'stock') {
      dataObj.stockList = dataObj.stockList.filter(
        (v) => !checkedIds.value.includes(v.sparePartId),
      );
    } else {
      dataObj.inboundList = dataObj.inboundList.filter(
        (v) => !checkedIds.value.includes(v.inId),
      );
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
  if (props.type === 'outbound') {
    checkedIds.value = records.map((item) => item.outId);
  } else if (props.type === 'stock') {
    checkedIds.value = records.map((item) => item.sparePartId);
  } else {
    checkedIds.value = records.map((item) => item.inId);
  }
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  inboundList: [],
  outboundList: [],
  stockList: [],
  list: [],
});

// 初始化数据
const initData = () => {
  switch (props.type) {
    case 'inbound': {
      dataObj.inboundList = dataList('inbound');
      dataObj.total = dataObj.inboundList.length;

      break;
    }
    case 'outbound': {
      dataObj.outboundList = dataList('outbound');
      dataObj.total = dataObj.outboundList.length;

      break;
    }
    case 'stock': {
      dataObj.stockList = dataList('stock');
      dataObj.total = dataObj.stockList.length;

      break;
    }
    // No default
  }
};

// 初始化数据
initData();

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;
  let currentList;

  if (props.type === 'outbound') {
    currentList = dataObj.outboundList;
  } else if (props.type === 'stock') {
    currentList = dataObj.stockList;
  } else {
    currentList = dataObj.inboundList;
  }

  // 根据activeName筛选数据
  let filteredList;
  if (props.type === 'stock') {
    // 库存管理根据库存状态筛选
    filteredList = currentList.filter((v) => {
      switch (activeName.value) {
        case '不足': {
          return v.stockStatus === '不足';
        }
        case '全部': {
          return true;
        }
        case '正常': {
          return v.stockStatus === '正常';
        }
        case '过剩': {
          return v.stockStatus === '过剩';
        }
        default: {
          return true;
        }
      }
    });
  } else {
    // 其他类型根据审核状态筛选
    filteredList = currentList.filter((v) => {
      switch (activeName.value) {
        case '全部': {
          return true;
        }
        case '已审核': {
          return v.statusName === '已审核';
        }
        case '已拒绝': {
          return v.statusName === '已拒绝';
        }
        case '待审核': {
          return v.statusName === '待审核';
        }
        default: {
          return true;
        }
      }
    });
  }

  // 快捷筛选
  filteredList = filteredList.filter((v) => {
    // 备件名称筛选
    if (filterPartName.value && v.partName !== filterPartName.value) {
      return false;
    }
    // 供应商筛选
    if (filterSupplier.value && v.supplier !== filterSupplier.value) {
      return false;
    }
    // 库存更新结果筛选
    if (filterStockResult.value && v.stockResult !== filterStockResult.value) {
      return false;
    }
    // 使用设备筛选
    if (filterUseDevice.value && v.useDevice !== filterUseDevice.value) {
      return false;
    }
    // 备件编码筛选
    if (filterPartCode.value && v.partCode !== filterPartCode.value) {
      return false;
    }
    // 备件类型筛选
    if (filterPartType.value && v.partType !== filterPartType.value) {
      return false;
    }
    // 关联工单筛选
    if (
      filterRelatedWorkorder.value &&
      v.relatedWorkorder !== filterRelatedWorkorder.value
    ) {
      return false;
    }
    return true;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
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
  schema: useFormSchema(props.type).map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.type),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField:
        props.type === 'outbound'
          ? 'outId'
          : props.type === 'stock'
            ? 'sparePartId'
            : 'inId',
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

// 快捷筛选相关
const filterPartName = ref(''); // 备件名称筛选
const filterSupplier = ref(''); // 供应商筛选
const filterStockResult = ref(''); // 库存更新结果筛选
const filterUseDevice = ref(''); // 使用设备筛选
const filterPartCode = ref(''); // 备件编码筛选
const filterPartType = ref(''); // 备件类型筛选
const filterRelatedWorkorder = ref(''); // 关联工单筛选

// 关联工单详情
const workorderDetailObj = ref({});
const workorderDetailDrawerRef = ref(null);

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理快捷筛选点击
const handleFilterClick = (filterKey, value) => {
  switch (filterKey) {
    case 'partCode': {
      filterPartCode.value = filterPartCode.value === value ? '' : value;
      break;
    }
    case 'partName': {
      filterPartName.value = filterPartName.value === value ? '' : value;
      break;
    }
    case 'partType': {
      filterPartType.value = filterPartType.value === value ? '' : value;
      break;
    }
    case 'relatedWorkorder': {
      filterRelatedWorkorder.value =
        filterRelatedWorkorder.value === value ? '' : value;
      break;
    }
    case 'stockResult': {
      filterStockResult.value = filterStockResult.value === value ? '' : value;
      break;
    }
    case 'supplier': {
      filterSupplier.value = filterSupplier.value === value ? '' : value;
      break;
    }
    case 'useDevice': {
      filterUseDevice.value = filterUseDevice.value === value ? '' : value;
      break;
    }
  }
  gridApi.query();
};

// 取消快捷筛选
const handleCancelFilter = (filterKey) => {
  switch (filterKey) {
    case 'partCode': {
      filterPartCode.value = '';
      break;
    }
    case 'partName': {
      filterPartName.value = '';
      break;
    }
    case 'partType': {
      filterPartType.value = '';
      break;
    }
    case 'relatedWorkorder': {
      filterRelatedWorkorder.value = '';
      break;
    }
    case 'stockResult': {
      filterStockResult.value = '';
      break;
    }
    case 'supplier': {
      filterSupplier.value = '';
      break;
    }
    case 'useDevice': {
      filterUseDevice.value = '';
      break;
    }
  }
  gridApi.query();
};

// 处理关联工单点击
const handleRelatedWorkorderClick = (row) => {
  // 根据工单号获取运维工单详情
  workorderDetailObj.value = getWorkorderByNo(row.relatedWorkorder);
  workorderDetailDrawerRef.value.open();
};

// 处理入库操作
const handleStockIn = (row) => {
  // 准备入库数据，回显当前备件信息
  const stockInData = {
    sparePartId: row.sparePartId,
    partName: row.partName,
    partCode: row.partCode,
    partType: row.partType,
    specModel: row.specModel,
    supplier: row.supplier,
    unitPrice: row.unitPrice,
    quantity: 1, // 默认入库数量
    inTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    operator: '当前用户',
    statusName: '待审核',
  };
  stockInDrawerApi.setData(stockInData).open();
};

// 处理出库操作
const handleStockOut = (row) => {
  // 准备出库数据，回显当前备件信息
  const stockOutData = {
    sparePartId: row.sparePartId,
    partName: row.partName,
    partCode: row.partCode,
    partType: row.partType,
    specModel: row.specModel,
    supplier: row.supplier,
    unitPrice: row.unitPrice,
    outQuantity: 1, // 默认出库数量
    outTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    operator: '当前用户',
    statusName: '待审核',
  };
  stockOutDrawerApi.setData(stockOutData).open();
};

// 根据当前类型动态生成状态标签
const tabsData = computed(() => {
  if (props.type === 'stock') {
    return [
      { label: '全部' },
      { label: '正常' },
      { label: '不足' },
      { label: '过剩' },
    ];
  }
  return [
    { label: '全部' },
    { label: '待审核' },
    { label: '已审核' },
    { label: '已拒绝' },
  ];
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;
  let currentList;

  // 根据当前类型选择正确的数据列表
  if (props.type === 'outbound') {
    currentList = dataObj.outboundList;
  } else if (props.type === 'stock') {
    currentList = dataObj.stockList;
  } else {
    currentList = dataObj.inboundList;
  }

  switch (item.label) {
    case '不足': {
      // 统计stockStatus为'不足'的数据
      count = currentList.filter((v) => v.stockStatus === '不足').length;
      break;
    }
    case '全部': {
      count = currentList.length;
      break;
    }
    case '已审核': {
      // 统计statusName为'已审核'的数据
      count = currentList.filter((v) => v.statusName === '已审核').length;
      break;
    }
    case '已拒绝': {
      // 统计statusName为'已拒绝'的数据
      count = currentList.filter((v) => v.statusName === '已拒绝').length;
      break;
    }
    case '待审核': {
      // 统计statusName为'待审核'的数据
      count = currentList.filter((v) => v.statusName === '待审核').length;
      break;
    }
    case '正常': {
      // 统计stockStatus为'正常'的数据
      count = currentList.filter((v) => v.stockStatus === '正常').length;
      break;
    }
    case '过剩': {
      // 统计stockStatus为'过剩'的数据
      count = currentList.filter((v) => v.stockStatus === '过剩').length;
      break;
    }
  }

  return `${item.label}(${count})`;
};

// 处理状态标签切换
const handleClick = () => {
  // 重新获取表格数据，根据新的状态筛选
  gridApi.query();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

// 状态标签类型映射
const getStatusType = (status) => {
  switch (status) {
    case '不足': {
      return 'danger';
    }
    // 审核状态
    case '已审核': {
      return 'success';
    }
    case '已拒绝': {
      return 'danger';
    }
    case '待审核': {
      return 'warning';
    }
    // 库存状态
    case '正常': {
      return 'success';
    }
    case '过剩': {
      return 'warning';
    }
    default: {
      return 'info';
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
      :title="`${dataObj.detailObj.partName}详情`"
      :data="dataObj.detailObj"
      :fields="
        props.type === 'outbound'
          ? detailFieldsOutbound
          : props.type === 'stock'
            ? detailFieldsStock
            : detailFields
      "
    />
    <!-- 入库抽屉 -->
    <StockInDrawer title="入库操作">
      <StockInForm />
    </StockInDrawer>
    <!-- 出库抽屉 -->
    <StockOutDrawer title="出库操作">
      <StockOutForm />
    </StockOutDrawer>
    <!-- 关联工单详情抽屉 -->
    <DetailDrawer
      ref="workorderDetailDrawerRef"
      :title="`${workorderDetailObj.workorderNo}详情`"
      :data="workorderDetailObj"
      :fields="[
        { key: 'workorderId', label: '工单ID' },
        { key: 'workorderNo', label: '工单号' },
        { key: 'orderType', label: '工单类型' },
        { key: 'faultId', label: '故障ID' },
        { key: 'assetId', label: '所属资产ID' },
        { key: 'deviceIds', label: '关联设备ID列表' },
        { key: 'content', label: '工单内容' },
        { key: 'emergencyLevel', label: '紧急程度' },
        { key: 'assignTo', label: '派发给' },
        { key: 'assignTime', label: '派单时间' },
        { key: 'claimTime', label: '认领时间' },
        { key: 'completeTime', label: '完成时间' },
        { key: 'status', label: '工单状态' },
        { key: 'acceptResult', label: '验收结果' },
        { key: 'acceptBy', label: '验收人ID' },
        { key: 'acceptTime', label: '验收时间' },
        { key: 'createBy', label: '创建人ID' },
        { key: 'createTime', label: '创建时间' },
        { key: 'updateTime', label: '更新时间' },
        { key: 'remark', label: '备注' },
      ]"
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
            v-if="filterPartName"
            type="primary"
            closable
            @close="handleCancelFilter('partName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            备件名称：{{ filterPartName }}
          </el-tag>
          <el-tag
            v-if="filterSupplier"
            type="success"
            closable
            @close="handleCancelFilter('supplier')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            供应商：{{ filterSupplier }}
          </el-tag>
          <el-tag
            v-if="filterStockResult"
            type="warning"
            closable
            @close="handleCancelFilter('stockResult')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            库存更新结果：{{ filterStockResult }}
          </el-tag>
          <el-tag
            v-if="filterUseDevice"
            type="info"
            closable
            @close="handleCancelFilter('useDevice')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            使用设备：{{ filterUseDevice }}
          </el-tag>
          <el-tag
            v-if="filterPartCode"
            type="danger"
            closable
            @close="handleCancelFilter('partCode')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            备件编码：{{ filterPartCode }}
          </el-tag>
          <el-tag
            v-if="filterPartType"
            type="primary"
            closable
            @close="handleCancelFilter('partType')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            备件类型：{{ filterPartType }}
          </el-tag>
          <el-tag
            v-if="filterRelatedWorkorder"
            type="success"
            closable
            @close="handleCancelFilter('relatedWorkorder')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            关联工单：{{ filterRelatedWorkorder }}
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
      <template #inId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{
            props.type === 'outbound'
              ? row.outId
              : props.type === 'stock'
                ? row.sparePartId
                : row.inId
          }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-tag :type="getStatusType(row.statusName || row.stockStatus)">
          {{ row.statusName || row.stockStatus }}
        </el-tag>
      </template>

      <!-- 备件名称插槽 -->
      <template #partName="{ row }">
        <el-text
          @click="handleFilterClick('partName', row.partName)"
          class="common-align"
          type="primary"
        >
          {{ row.partName }}
        </el-text>
      </template>

      <!-- 供应商插槽 -->
      <template #supplier="{ row }">
        <el-text
          @click="handleFilterClick('supplier', row.supplier)"
          class="common-align"
          type="primary"
        >
          {{ row.supplier }}
        </el-text>
      </template>

      <!-- 库存更新结果插槽 -->
      <template #stockResult="{ row }">
        <el-text
          @click="handleFilterClick('stockResult', row.stockResult)"
          class="common-align"
          type="primary"
        >
          {{ row.stockResult }}
        </el-text>
      </template>

      <!-- 使用设备插槽 -->
      <template #useDevice="{ row }">
        <el-text
          @click="handleFilterClick('useDevice', row.useDevice)"
          class="common-align"
          type="primary"
        >
          {{ row.useDevice }}
        </el-text>
      </template>

      <!-- 备件编码插槽 -->
      <template #partCode="{ row }">
        <el-text
          @click="handleFilterClick('partCode', row.partCode)"
          class="common-align"
          type="primary"
        >
          {{ row.partCode }}
        </el-text>
      </template>

      <!-- 备件类型插槽 -->
      <template #partType="{ row }">
        <el-text
          @click="handleFilterClick('partType', row.partType)"
          class="common-align"
          type="primary"
        >
          {{ row.partType }}
        </el-text>
      </template>

      <!-- 关联工单插槽 -->
      <template #relatedWorkorder="{ row }">
        <el-text
          @click="handleRelatedWorkorderClick(row)"
          class="common-align"
          type="primary"
        >
          {{ row.relatedWorkorder }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <!-- 库存管理标签页不显示编辑按钮 -->
          <IconButton
            v-if="props.type !== 'stock'"
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <!-- 库存管理标签页显示入库和出库按钮，隐藏删除按钮 -->
          <template v-if="props.type === 'stock'">
            <IconButton
              content="入库"
              icon-name="Plus"
              @click="handleStockIn(row)"
            />
            <IconButton
              content="出库"
              icon-name="Minus"
              @click="handleStockOut(row)"
            />
          </template>
          <!-- 其他标签页显示删除按钮 -->
          <IconButton
            v-else
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
          <span>
            本页统计：{{
              props.type === 'outbound'
                ? '出库单数'
                : props.type === 'stock'
                  ? '库存件数'
                  : '入库单数'
            }}: {{ dataObj.total }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>
            全部统计：{{
              props.type === 'outbound'
                ? textObj.outboundTotal
                : props.type === 'stock'
                  ? textObj.stockTotal
                  : textObj.total
            }}
          </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
