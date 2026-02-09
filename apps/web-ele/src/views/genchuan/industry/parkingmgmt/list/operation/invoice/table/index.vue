<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, generateDataList, queryDataList, orderOptions, orderDetails, textObj, generateTextObj, queryTextObj, useFormSchema, useGenerateFormSchema, useQueryFormSchema, useGridColumns, useGenerateGridColumns, useQueryGridColumns, detailFields, generateDetailFields, queryDetailFields, statusOptions, carDetailFields, carInfoData } from './data';
import DetailDrawer from '#/components/common/DetailDrawer.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  activeTab: {
    type: String,
    default: '发票申请',
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
  let currentTextObj;
  let isEdit;
  switch (props.activeTab) {
    case '发票申请':
      currentTextObj = textObj;
      isEdit = !!formData.value?.applicationId;
      break;
    case '发票生成':
      currentTextObj = generateTextObj;
      isEdit = !!formData.value?.invoiceId;
      break;
    case '发票查询':
      currentTextObj = queryTextObj;
      isEdit = !!formData.value?.invoiceId;
      break;
    default:
      currentTextObj = textObj;
      isEdit = false;
  }
  return isEdit ? currentTextObj.editText : currentTextObj.addText;
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
const orderDetailDrawerRef = ref(null);
const carDetailDrawerRef = ref(null);
const formData = ref();

// 选中的车辆信息
const selectedCars = ref([]);

// 订单详情抽屉字段配置
const orderDetailFields = [
  { key: 'type', label: '订单类型' },
  { key: 'orderTempId', label: '临停订单ID' },
  { key: 'orderPeriodId', label: '期卡订单ID' },
  { key: 'carNumber', label: '车牌号码' },
  { key: 'entryId', label: '入场记录ID' },
  { key: 'exitId', label: '离场记录ID' },
  { key: 'lotId', label: '所属车场' },
  { key: 'spaceId', label: '泊位ID' },
  { key: 'parkingDuration', label: '停放时长(分钟)' },
  { key: 'originalAmount', label: '应收金额' },
  { key: 'originalPrice', label: '原价' },
  { key: 'discountAmount', label: '优惠金额' },
  { key: 'payAmount', label: '实付金额' },
  { key: 'feeStrategyId', label: '费率策略ID' },
  { key: 'userId', label: '用户ID' },
  { key: 'carId', label: '车辆ID' },
  { key: 'packageId', label: '期卡套餐ID' },
  { key: 'lotIds', label: '适用车场ID列表' },
  { key: 'effectTime', label: '生效时间' },
  { key: 'expireTime', label: '到期时间' },
  { key: 'orderStatus', label: '订单状态' },
  { key: 'payStatus', label: '支付状态' },
  { key: 'payType', label: '支付方式' },
  { key: 'paymentId', label: '缴费记录ID' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
  { key: 'remark', label: '备注' }
];
// 创建表单实例，根据当前激活的标签页使用相应的表单配置
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: props.activeTab === '发票申请' ? useFormSchema() : props.activeTab === '发票生成' ? useGenerateFormSchema() : useQueryFormSchema(),
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
    if (props.activeTab === '发票申请') {
      if (formDrawerApi.sharedData.payload.title === textObj.addText) {
        // 为新增数据生成一个唯一的applicationId
        const newId = 'APP' + String(dataObj.apilist.length + 1).padStart(3, '0');
        obj.applicationId = newId;
        obj.applicationNo = 'AP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(dataObj.apilist.length + 1).padStart(4, '0');
        obj.estimateTime = obj.estimateTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
        obj.relatedOrderCount = obj.relatedOrderCount || 1;
        obj.invoiceStatus = obj.invoiceStatus || '待处理';
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.applicationId === formData.value?.applicationId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else if (props.activeTab === '发票生成') {
      if (formDrawerApi.sharedData.payload.title === generateTextObj.addText) {
        // 为新增数据生成一个唯一的invoiceId
        const newId = 'INV' + String(dataObj.apilist.length + 1).padStart(3, '0');
        obj.invoiceId = newId;
        obj.refreshButton = true;
        obj.issueTime = obj.issueTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
        obj.sendStatus = obj.sendStatus || '待发送';
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.invoiceId === formData.value?.invoiceId) {
            dataObj.apilist[i] = obj;
          }
        });
      }
    } else if (props.activeTab === '发票查询') {
      if (formDrawerApi.sharedData.payload.title === queryTextObj.addText) {
        // 为新增数据生成一个唯一的invoiceId
        const newId = 'INV' + String(dataObj.apilist.length + 1).padStart(3, '0');
        obj.invoiceId = newId;
        obj.operationButton = true;
        obj.issueTime = obj.issueTime || new Date().toISOString().slice(0, 19).replace('T', ' ');
        obj.invoiceAmount = obj.invoiceAmount || 0.00;
        obj.invoiceStatus = obj.invoiceStatus || '待处理';
        dataObj.apilist.push(obj);
      } else {
        dataObj.apilist.forEach((v, i) => {
          if (v.invoiceId === formData.value?.invoiceId) {
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
      // 重置表单
      formApi.resetForm();
      // 根据当前激活的标签页设置表单值
      if (props.activeTab === '发票申请' && formData.value?.applicationId) {
        await formApi.setValues(formData.value);
      } else if ((props.activeTab === '发票生成' || props.activeTab === '发票查询') && formData.value?.invoiceId) {
        await formApi.setValues(formData.value);
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 撤销发票申请 */
async function handleCancel(row) {
  if (row.invoiceStatus === '已开具') {
    ElMessage.warning('已开具的发票无法撤销');
    return;
  }

  try {
    await confirm('确定要撤销该发票申请吗？');
    const loadingInstance = ElLoading.service({
      text: '正在撤销发票申请...',
    });

    // 模拟撤销操作
    setTimeout(() => {
      row.invoiceStatus = '已撤销';
      ElMessage.success('发票申请已成功撤销');
      handleRefresh();
      loadingInstance.close();
    }, 1000);
  } catch (error) {
    // 用户取消确认
  }
}

/** 下载发票PDF文件 */
function handleDownload(row) {
  // 模拟下载操作
  ElMessage.success('发票PDF文件已开始下载');
  // 实际项目中这里应该是一个真实的下载链接
  console.log('下载发票PDF文件:', row.pdfUrl || `https://example.com/invoices/${row.invoiceId}.pdf`);
}

/** 重发发票 */
async function handleResend(row) {
  try {
    await confirm('确定要重新发送该发票吗？');
    const loadingInstance = ElLoading.service({
      text: '正在重新发送发票...',
    });

    // 模拟重发操作
    setTimeout(() => {
      ElMessage.success('发票已成功重新发送至接收邮箱');
      loadingInstance.close();
    }, 1000);
  } catch (error) {
    // 用户取消确认
  }
}

/** 导出表格 */
async function handleExport() {
  let currentTextObj;
  switch (props.activeTab) {
    case '发票申请':
      currentTextObj = textObj;
      break;
    case '发票生成':
      currentTextObj = generateTextObj;
      break;
    case '发票查询':
      currentTextObj = queryTextObj;
      break;
    default:
      currentTextObj = textObj;
  }
  exportToExcel(dataObj.apilist, currentTextObj.excelName, currentTextObj.excelAllName);
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: textObj.addText,
    })
    .open();
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
async function handleDelete(row) {
  const id = props.activeTab === '发票申请' ? row.applicationId : row.invoiceId;
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [id]),
  });
  try {
    if (props.activeTab === '发票申请') {
      dataObj.apilist = dataObj.apilist.filter((v) => v.applicationId !== row.applicationId);
    } else {
      dataObj.apilist = dataObj.apilist.filter((v) => v.invoiceId !== row.invoiceId);
    }
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [id]),
    );
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
    if (props.activeTab === '发票申请') {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => !checkedIds.value.includes(v.applicationId),
      );
    } else {
      dataObj.apilist = dataObj.apilist.filter(
        (v) => !checkedIds.value.includes(v.invoiceId),
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
  checkedIds.value = records.map((item) => item.applicationId || item.invoiceId);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: props.activeTab === '发票申请' ? dataList().length : props.activeTab === '发票生成' ? generateDataList().length : queryDataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: props.activeTab === '发票申请' ? dataList() : props.activeTab === '发票生成' ? generateDataList() : queryDataList(),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 监听activeTab变化，切换数据
watch(() => props.activeTab, (newTab) => {
  // 切换数据列表
  switch (newTab) {
    case '发票申请':
      dataObj.apilist = dataList();
      break;
    case '发票生成':
      dataObj.apilist = generateDataList();
      break;
    case '发票查询':
      dataObj.apilist = queryDataList();
      break;
    default:
      dataObj.apilist = dataList();
  }
  dataObj.total = dataObj.apilist.length;
  dataObj.currentPage = 1;

  // 重置表单
  formApi.resetForm();

  // 刷新表格数据
  handleRefresh();
});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和filterInvoiceType筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (activeName.value !== '全部') {
      statusMatch = v.invoiceStatus === activeName.value;
    }

    // 发票类型筛选
    const invoiceTypeMatch = !filterInvoiceType.value || v.invoiceType === filterInvoiceType.value;

    return statusMatch && invoiceTypeMatch;
  });

  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

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
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit() {
  drawerApi.close();
}

// 根据当前激活的标签页初始化表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: props.activeTab === '发票申请' ? useGridColumns() : props.activeTab === '发票生成' ? useGenerateGridColumns() : useQueryGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: props.activeTab === '发票申请' ? 'applicationId' : 'invoiceId',
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

// 监听activeTab变化，更新表格配置
watch(() => props.activeTab, (newTab) => {
  // 刷新表格数据
  handleRefresh();
});

const activeName = ref('全部');
const filterInvoiceType = ref(''); // 发票类型筛选：空=未筛选，有值=当前筛选发票类型

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理发票类型点击
const handleInvoiceTypeClick = (invoiceType) => {
  filterInvoiceType.value = filterInvoiceType.value === invoiceType ? '' : invoiceType;
  gridApi.query();
};

/** 取消发票类型筛选（筛选标签关闭按钮） */
const handleCancelInvoiceTypeFilter = () => {
  filterInvoiceType.value = '';
  gridApi.query();
};

// 处理订单详情点击
const handleOrderDetail = (row) => {
  // 解析订单选择字段，获取订单列表
  const orderNames = row.orderSelection.split(',').map(order => order.trim());
  // 根据订单名称获取订单详情
  const orderDetailsList = orderNames.map(orderName => orderDetails[orderName]).filter(Boolean);
  // 将订单详情列表设置到dataObj中
  dataObj.orderDetailObj = orderDetailsList;
  // 打开订单详情抽屉
  orderDetailDrawerRef.value.open();
};

// 处理车牌号码点击
const handleCarNumberClick = (row) => {
  // 根据车牌号码获取车辆信息
  const carInfo = carInfoData.find(car => car.car_number === row.carNumber);
  if (carInfo) {
    selectedCars.value = [carInfo];
    // 打开车辆详情抽屉
    if (carDetailDrawerRef.value) {
      carDetailDrawerRef.value.open();
    }
  }
};

// 处理车辆详情抽屉关闭事件
const handleCarDetailClose = () => {
  selectedCars.value = [];
};

// 修改tabsData为三个标签：全部、待处理、处理中、已开具
const tabsData = ref(statusOptions.map(item => ({ label: item.label })));

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter((v) => v.invoiceStatus === item.label).length;
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
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
<!--   详情抽屉-->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="`${props.activeTab === '发票申请' ? dataObj.detailObj.applicationId : dataObj.detailObj.invoiceId}详情`"
      :data="dataObj.detailObj"
      :fields="props.activeTab === '发票申请' ? detailFields : props.activeTab === '发票生成' ? generateDetailFields : queryDetailFields"
    />
    <!-- 订单详情抽屉 -->
    <DetailDrawer
      ref="orderDetailDrawerRef"
      :title="'订单信息详情'"
      :data="dataObj.orderDetailObj"
      :fields="orderDetailFields"
    />

    <!-- 车辆详情抽屉 -->
    <DetailDrawer
      ref="carDetailDrawerRef"
      :title="'车辆信息详情'"
      :data="selectedCars"
      :fields="carDetailFields"
      @close="handleCarDetailClose"
      @confirm="handleCarDetailClose"
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
          <!-- 发票类型筛选标签：蓝色primary，仅筛选时显示 -->
          <el-tag
            v-if="filterInvoiceType"
            type="primary"
            closable
            @close="handleCancelInvoiceTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            发票类型：{{ filterInvoiceType }}
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
      <template #applicationId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.applicationId }}
        </el-text>
      </template>
      <template #invoiceStatus="{ row }">
        <el-tag
          :type="row.invoiceStatus === '已开具' ? 'success' : row.invoiceStatus === '处理中' ? 'warning' : row.invoiceStatus === '已撤销' ? 'danger' : 'info'"
        >
          {{ row.invoiceStatus }}
        </el-tag>
      </template>
      <template #refreshButton="{ row }">
        <el-button
          @click="handleRefresh"
          size="small"
          type="primary"
          plain
        >
          刷新
        </el-button>
      </template>
      <template #invoiceId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.invoiceId }}
        </el-text>
      </template>
      <template #sendStatus="{ row }">
        <el-tag
          :type="row.sendStatus === '已发送' ? 'success' : 'warning'"
        >
          {{ row.sendStatus }}
        </el-tag>
      </template>
      <template #orderSelection="{ row }">
        <el-text
          @click="handleOrderDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.orderSelection }}
        </el-text>
      </template>

      <!-- 发票类型插槽 -->
      <template #invoiceType="{ row }">
        <el-text
          @click="handleInvoiceTypeClick(row.invoiceType)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.invoiceType }}
        </el-text>
      </template>

      <!-- 车牌号码插槽 -->
      <template #carNumber="{ row }">
        <el-text
          @click="handleCarNumberClick(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.carNumber }}
        </el-text>
      </template>

      <template #pdfUrl="{ row }">
        <el-text
          @click="handleDownload(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.pdfUrl }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 所有标签页都显示详情按钮 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 发票申请标签页显示编辑和撤销按钮 -->
          <template v-if="props.activeTab === '发票申请'">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="撤销"
              icon-name="RefreshLeft"
              :disabled="row.invoiceStatus === '已开具'"
              @click="handleCancel(row)"
            />
          </template>

          <!-- 发票生成和发票查询标签页显示下载和重发按钮 -->
          <template v-else>
            <IconButton
              content="下载"
              icon-name="Download"
              @click="handleDownload(row)"
            />
            <IconButton
              content="重发"
              icon-name="RefreshRight"
              @click="handleResend(row)"
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
          <span> 本页统计：{{ props.activeTab }}: {{ dataObj.list.length }} </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ props.activeTab === '发票申请' ? textObj.total : props.activeTab === '发票生成' ? generateTextObj.total : queryTextObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
