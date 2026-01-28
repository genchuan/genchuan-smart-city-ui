<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
// 引入封装后的详情抽屉组件
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

// 引入数据配置
import {
  carInfoData,
  parkLotList,
  parkOrderList,
  payerList,
  proxyOrderList,
  proxyRecordList,
  proxyRuleList,
  textObj,
  useProxyOrderFormSchema,
  useProxyOrderGridColumns,
  useProxyRecordFormSchema,
  useProxyRecordGridColumns,
  useProxyRuleFormSchema,
  useProxyRuleGridColumns,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  tabName: {
    type: String,
    default: 'proxyRule',
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

// 付款方详情字段配置
const payerDetailFields = computed(() => {
  return [
    { label: '商户ID', key: 'merchantId' },
    { label: '商户名称', key: 'merchantName' },
    { label: '商户编码', key: 'merchantCode' },
    { label: '联系人', key: 'contactPerson' },
    { label: '联系电话', key: 'contactPhone' },
    { label: '地址', key: 'address' },
    { label: '经营范围', key: 'businessScope' },
    {
      label: '状态',
      key: 'status',
      type: 'tag',
      tagType: (status) => {
        if (status === '启用') return 'success';
        if (status === '禁用') return 'danger';
        return 'info';
      },
    },
    {
      label: '结算比例',
      key: 'settlementRatio',
      formatter: (value) => `${value}%`,
    },
    { label: '创建时间', key: 'createTime' },
    { label: '更新时间', key: 'updateTime' },
    { label: '创建人', key: 'createBy' },
    { label: '备注', key: 'remark' },
  ];
});

// 代付规则详情字段配置
const proxyRuleDetailFields = computed(() => {
  return [
    { label: '规则ID', key: 'proxyId' },
    { label: '规则名称', key: 'proxyName' },
    { label: '代付类型', key: 'proxyType' },
    { label: '付款方ID', key: 'payerId' },
    { label: '收款方类型', key: 'payeeType' },
    {
      label: '单笔额度',
      key: 'singleAmount',
      formatter: (value) =>
        `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
    },
    {
      label: '月度额度',
      key: 'monthlyAmount',
      formatter: (value) =>
        `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
    },
    { label: '代付对象类型', key: 'objectType' },
    { label: '生效时间', key: 'startTime' },
    {
      label: '失效时间',
      key: 'endTime',
      formatter: (value) => value || '永久',
    },
    {
      label: '状态',
      key: 'status',
      type: 'tag',
      tagType: (status) => {
        return status === '启用' ? 'success' : 'danger';
      },
    },
    { label: '创建人', key: 'createBy' },
    { label: '创建时间', key: 'createTime' },
    { label: '更新时间', key: 'updateTime' },
    { label: '备注', key: 'remark' },
  ];
});

// 停车订单详情字段配置
const parkOrderDetailFields = computed(() => {
  return [
    { label: '停车订单ID', key: 'park_order_id' },
    { label: '停车订单编号', key: 'park_order_no' },
    { label: '停车场ID', key: 'park_id' },
    { label: '车牌号码', key: 'plate_no' },
    { label: '入场时间', key: 'enter_time' },
    { label: '离场时间', key: 'exit_time' },
    {
      label: '停车时长',
      key: 'park_duration',
      formatter: (value) => `${value}分钟`,
    },
    {
      label: '总费用',
      key: 'total_amount',
      formatter: (value) =>
        `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
    },
    {
      label: '支付状态',
      key: 'payment_status',
      type: 'tag',
      tagType: (status) => {
        if (status === '已支付') return 'success';
        if (status === '待支付') return 'warning';
        if (status === '代付中') return 'info';
        return 'danger';
      },
    },
    {
      label: '支付时间',
      key: 'payment_time',
      formatter: (value) => value || '-',
    },
    { label: '用户ID', key: 'user_id' },
    { label: '创建时间', key: 'create_time' },
    { label: '更新时间', key: 'update_time' },
    { label: '备注', key: 'remark' },
  ];
});

// 停车场详情字段配置
const parkLotDetailFields = computed(() => {
  return [
    { label: '停车场ID', key: 'park_id' },
    { label: '停车场名称', key: 'park_name' },
    { label: '停车场编码', key: 'park_code' },
    { label: '停车场地址', key: 'park_address' },
    { label: '停车场类型', key: 'park_type' },
    { label: '运营方ID', key: 'operator_id' },
    { label: '总车位数量', key: 'total_space' },
    {
      label: '状态',
      key: 'status',
      type: 'tag',
      tagType: (status) => {
        if (status === '启用') return 'success';
        if (status === '维护') return 'warning';
        if (status === '停用') return 'danger';
        return 'info';
      },
    },
    { label: '创建时间', key: 'create_time' },
    { label: '更新时间', key: 'update_time' },
    { label: '创建人', key: 'create_by' },
    { label: '备注', key: 'remark' },
  ];
});

// 代付订单详情字段配置（记录页）
const proxyOrderDetailFields = computed(() => {
  return [
    { label: '订单ID', key: 'orderId' },
    { label: '代付订单号', key: 'proxyOrderNo' },
    { label: '停车订单ID', key: 'parkOrderId' },
    { label: '代付规则ID', key: 'proxyId' },
    {
      label: '代付金额',
      key: 'proxyAmount',
      formatter: (value) =>
        `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
    },
    {
      label: '订单状态',
      key: 'orderStatus',
      type: 'tag',
      tagType: (status) => {
        if (status === '已代付') return 'success';
        if (status === '待代付') return 'warning';
        if (status === '代付失败') return 'danger';
        return 'info';
      },
    },
    {
      label: '失败原因',
      key: 'failReason',
      formatter: (value) => value || '-',
    },
    {
      label: '代付时间',
      key: 'proxyTime',
      formatter: (value) => value || '-',
    },
    { label: '创建时间', key: 'createTime' },
    { label: '更新时间', key: 'updateTime' },
    { label: '备注', key: 'remark' },
  ];
});

// 车辆详情字段配置
const carDetailFields = computed(() => {
  return [
    { label: '车辆ID', key: 'car_id' },
    { label: '车牌号码', key: 'car_number' },
    { label: '车辆类型', key: 'car_type' },
    { label: '用户ID', key: 'user_id' },
    { label: '品牌', key: 'brand' },
    { label: '颜色', key: 'color' },
    {
      label: '绑定状态',
      key: 'bind_status',
      type: 'tag',
      tagType: (status) => {
        return status === '已绑定' ? 'success' : 'danger';
      },
    },
    { label: '创建时间', key: 'create_time' },
    { label: '更新时间', key: 'update_time' },
    { label: '备注', key: 'remark' },
  ];
});

// 当前激活的标签页
const activeTab = ref(props.tabName);

// 创建一个稳定的pagerConfig对象，用于vxe-table
const pagerConfig = reactive({
  totalShow: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 监听tabName变化，更新activeTab
watch(
  () => props.tabName,
  (newVal) => {
    activeTab.value = newVal;
    activeName.value = '全部';
    updatePagerConfig();
    handleRefresh();
  },
);

// 监听activeTab变化，更新pagerConfig
watch(
  () => activeTab.value,
  () => {
    updatePagerConfig();
    handleRefresh();
  },
);

// 更新pagerConfig函数
function updatePagerConfig() {
  const currentData = dataObj[activeTab.value];
  // 更新pagerConfig的属性，保持对象引用稳定
  pagerConfig.total = currentData.total;
  pagerConfig.currentPage = currentData.currentPage;
  pagerConfig.pageSize = currentData.pageSize;
  pagerConfig.totalShow = currentData.totalShow;
}

// 数据对象
const dataObj = reactive({
  // 代付规则
  proxyRule: {
    totalShow: false,
    total: proxyRuleList().length,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    apilist: proxyRuleList(),
    list: [],
  },
  // 代付订单
  proxyOrder: {
    totalShow: false,
    total: proxyOrderList().length,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    apilist: proxyOrderList(),
    list: [],
  },
  // 代付记录
  proxyRecord: {
    totalShow: false,
    total: proxyRecordList().length,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    apilist: proxyRecordList(),
    list: [],
  },
});

// 初始化pagerConfig
updatePagerConfig();

// 搜索表单数据
const searchFormData = reactive({
  proxyRule: {},
  proxyOrder: {},
  proxyRecord: {},
});

// 状态筛选
const activeName = ref('全部');

// 表单数据
const formData = ref();

// 详情相关
const selectedItem = ref(null);
const detailDrawerRef = ref(null);

// 付款方详情
const selectedPayer = ref(null);
const payerDetailDrawerRef = ref(null);

// 代付规则详情
const selectedProxyRule = ref(null);
const proxyRuleDetailDrawerRef = ref(null);

// 停车订单详情
const selectedParkOrder = ref(null);
const parkOrderDetailDrawerRef = ref(null);

// 停车场详情
const selectedParkLot = ref(null);
const parkLotDetailDrawerRef = ref(null);

// 代付订单详情（记录页）
const selectedProxyOrder = ref(null);
const proxyOrderDetailDrawerRef = ref(null);

// 车辆详情
const selectedCar = ref(null);
const carDetailDrawerRef = ref(null);

// 获取当前标签页的数据对象
const currentDataObj = computed(() => dataObj[activeTab.value]);

// 获取当前标签页的文字描述
const currentTextObj = computed(() => textObj[activeTab.value]);

// 获取当前标题
const getTitle = computed(() => {
  if (activeTab.value === 'proxyRule') {
    return formData.value?.proxyId
      ? textObj.proxyRule.editText
      : textObj.proxyRule.addText;
  } else if (activeTab.value === 'proxyOrder') {
    return formData.value?.orderId
      ? textObj.proxyOrder.editText
      : textObj.proxyOrder.addText;
  } else {
    return formData.value?.recordId
      ? textObj.proxyRecord.editText
      : textObj.proxyRecord.addText;
  }
});

// 搜索抽屉
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

// 表单配置
const getFormSchema = () => {
  if (activeTab.value === 'proxyRule') {
    return useProxyRuleFormSchema();
  } else if (activeTab.value === 'proxyOrder') {
    return useProxyOrderFormSchema();
  } else {
    return useProxyRecordFormSchema();
  }
};

// 表格列配置
const getGridColumns = () => {
  if (activeTab.value === 'proxyRule') {
    return useProxyRuleGridColumns();
  } else if (activeTab.value === 'proxyOrder') {
    return useProxyOrderGridColumns();
  } else {
    return useProxyRecordGridColumns();
  }
};

// 表单
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: getFormSchema(),
  showDefaultActions: false,
});

// 表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    const currentApiList = dataObj[activeTab.value].apilist;

    if (formDrawerApi.sharedData.payload.title.includes('新增')) {
      // 新增逻辑
      let newItem;
      if (activeTab.value === 'proxyRule') {
        newItem = {
          ...obj,
          proxyId: String(Date.now()),
          createBy: 'admin',
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          assetIds: JSON.stringify([]),
          parkIds: JSON.stringify([]),
          objectIds: JSON.stringify([]),
        };
      } else if (activeTab.value === 'proxyOrder') {
        newItem = {
          ...obj,
          orderId: String(Date.now()),
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
      } else {
        newItem = {
          ...obj,
          recordId: String(Date.now()),
          createBy: 'admin',
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
      }
      currentApiList.push(newItem);
    } else {
      // 编辑逻辑
      currentApiList.forEach((v, i) => {
        const key =
          activeTab.value === 'proxyRule'
            ? 'proxyId'
            : activeTab.value === 'proxyOrder'
              ? 'orderId'
              : 'recordId';
        if (v[key] === formData.value?.[key]) {
          currentApiList[i] = {
            ...obj,
            [key]: v[key],
            updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
        }
      });
    }

    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (
        formData.value?.proxyId ||
        formData.value?.orderId ||
        formData.value?.recordId
      ) {
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
  const currentApiList = dataObj[activeTab.value].apilist;
  const currentText = textObj[activeTab.value];
  exportToExcel(
    currentApiList,
    currentText.excelName,
    currentText.excelAllName,
  );
}

/** 创建 */
function handleCreate() {
  const currentText = textObj[activeTab.value];
  formDrawerApi
    .setData({
      title: currentText.addText,
    })
    .open();
}

/** 编辑 */
function handleEdit(row) {
  const currentText = textObj[activeTab.value];
  formDrawerApi
    .setData({
      title: currentText.editText,
      ...row,
    })
    .open();
}

/** 删除 */
async function handleDelete(row) {
  const currentApiList = dataObj[activeTab.value].apilist;
  const key =
    activeTab.value === 'proxyRule'
      ? 'proxyId'
      : activeTab.value === 'proxyOrder'
        ? 'orderId'
        : 'recordId';

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row[key]]),
  });

  try {
    dataObj[activeTab.value].apilist = currentApiList.filter(
      (v) => v[key] !== row[key],
    );
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row[key]]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除 */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));

  const currentApiList = dataObj[activeTab.value].apilist;
  const key =
    activeTab.value === 'proxyRule'
      ? 'proxyId'
      : activeTab.value === 'proxyOrder'
        ? 'orderId'
        : 'recordId';

  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });

  try {
    dataObj[activeTab.value].apilist = currentApiList.filter(
      (v) => !checkedIds.value.includes(v[key]),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 选中的ID数组
const checkedIds = ref([]);

/** 处理行选择 */
function handleRowCheckboxChange({ records }) {
  const key =
    activeTab.value === 'proxyRule'
      ? 'proxyId'
      : activeTab.value === 'proxyOrder'
        ? 'orderId'
        : 'recordId';
  checkedIds.value = records.map((item) => item[key]);
}

// 统计显示切换
const changeTotalShow = () => {
  const currentData = dataObj[activeTab.value];
  currentData.totalShow = !currentData.totalShow;
  pagerConfig.totalShow = currentData.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const currentData = dataObj[activeTab.value];
  const page = pageObj.page;

  // 获取所有相关数据列表
  const allProxyRules = proxyRuleList();
  const allProxyOrders = proxyOrderList();
  const allParkOrders = parkOrderList();
  const allParkLots = parkLotList();

  // 过滤数据并添加关联字段
  const filteredData = currentData.apilist
    .filter((v) => {
      // 状态过滤
      if (activeName.value !== '全部') {
        if (activeTab.value === 'proxyRule') {
          if (v.status !== activeName.value) {
            return false;
          }
        } else {
          const statusField =
            activeTab.value === 'proxyOrder' ? 'orderStatus' : 'proxyStatus';
          if (v[statusField] !== activeName.value) {
            return false;
          }
        }
      }

      // 搜索条件过滤
      const searchData = searchFormData[activeTab.value];
      for (const [key, value] of Object.entries(searchData)) {
        if (value && v[key] && !String(v[key]).includes(String(value))) {
          return false;
        }
      }

      return true;
    })
    .map((v) => {
      const newRow = { ...v };

      // 为所有行添加付款方名称
      const payer = payerList().find((m) => m.merchantId === v.payerId);
      newRow.payerName = payer?.merchantName || v.payerId;

      // 根据不同标签页添加不同的关联字段
      if (activeTab.value === 'proxyOrder') {
        // 代付订单页
        // 添加代付规则名称
        const proxyRule = allProxyRules.find((r) => r.proxyId === v.proxyId);
        newRow.proxyName = proxyRule?.proxyName || v.proxyId;

        // 添加停车订单编号
        const parkOrder = allParkOrders.find(
          (o) => o.park_order_id === v.parkOrderId,
        );
        newRow.parkOrderNo = parkOrder?.park_order_no || v.parkOrderId;
      } else if (activeTab.value === 'proxyRecord') {
        // 代付记录页
        // 添加代付规则名称
        const proxyRule = allProxyRules.find((r) => r.proxyId === v.proxyId);
        newRow.proxyName = proxyRule?.proxyName || v.proxyId;

        // 添加代付订单编号
        const proxyOrder = allProxyOrders.find(
          (o) => o.orderId === v.proxyOrderId,
        );
        newRow.proxyOrderNo = proxyOrder?.proxyOrderNo || v.proxyOrderId;

        // 添加停车订单编号
        const parkOrder = allParkOrders.find(
          (o) => o.park_order_id === v.parkOrderId,
        );
        newRow.parkOrderNo = parkOrder?.park_order_no || v.parkOrderId;

        // 添加停车场名称
        const parkLot = allParkLots.find((p) => p.park_id === v.parkId);
        newRow.parkName = parkLot?.park_name || v.parkId;
      }

      return newRow;
    });

  const total = filteredData.length;
  const list = filteredData.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  // 更新currentData用于其他目的
  currentData.total = total;
  currentData.list = list;
  currentData.currentPage = page.currentPage;
  currentData.pageSize = page.pageSize;

  // 更新pagerConfig，保持与vxe-table状态同步
  pagerConfig.total = total;
  pagerConfig.currentPage = page.currentPage;
  pagerConfig.pageSize = page.pageSize;

  // 只返回vxe-table需要的list和total属性
  return { list, total };
};

// 搜索表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: getFormSchema().map((v) => {
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
function onSubmit(values) {
  searchFormData[activeTab.value] = values;
  drawerApi.close();
  handleRefresh();
}

// 表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField:
        activeTab.value === 'proxyRule'
          ? 'proxyId'
          : activeTab.value === 'proxyOrder'
            ? 'orderId'
            : 'recordId',
      isHover: true,
    },
    pagerConfig,
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

// 状态标签页数据
const statusTabsData = computed(() => {
  return activeTab.value === 'proxyRule'
    ? [{ label: '全部' }, { label: '启用' }, { label: '禁用' }]
    : [
        { label: '全部' },
        { label: '待代付' },
        { label: '已代付' },
        { label: '代付失败' },
      ];
});

// 创建状态标签
const createStatusLabel = (item) => {
  const currentApiList = dataObj[activeTab.value].apilist;
  let count = 0;

  if (item.label === '全部') {
    count = currentApiList.length;
  } else {
    if (activeTab.value === 'proxyRule') {
      count = currentApiList.filter((v) => v.status === item.label).length;
    } else {
      const statusField =
        activeTab.value === 'proxyOrder' ? 'orderStatus' : 'proxyStatus';
      count = currentApiList.filter(
        (v) => v[statusField] === item.label,
      ).length;
    }
  }

  return `${item.label}(${count})`;
};

// 状态标签页切换
const handleStatusChange = () => {
  handleRefresh();
};

// 搜索显示
const handleSerachShow = () => {
  drawerApi.open();
};

// 全屏切换
const handleFullShow = () => {
  screenfull.toggle();
};

// 打开详情
const handleOpenDetail = (row) => {
  selectedItem.value = row;
  detailDrawerRef.value.open();
};

// 打开付款方详情
const handleOpenPayerDetail = (row) => {
  // 从payerList中获取付款方数据
  const allPayer = payerList();
  selectedPayer.value =
    allPayer.find((m) => m.merchantId === row.payerId) || {};
  payerDetailDrawerRef.value.open();
};

// 打开代付规则详情
const handleOpenProxyRuleDetail = (row) => {
  // 从proxyRuleList中获取代付规则数据
  const allProxyRules = proxyRuleList();
  selectedProxyRule.value =
    allProxyRules.find((r) => r.proxyId === row.proxyId) || {};
  proxyRuleDetailDrawerRef.value.open();
};

// 打开停车订单详情
const handleOpenParkOrderDetail = (row) => {
  // 从parkOrderList中获取停车订单数据
  const allParkOrders = parkOrderList();
  selectedParkOrder.value =
    allParkOrders.find((o) => o.park_order_id === row.parkOrderId) || {};
  parkOrderDetailDrawerRef.value.open();
};

// 打开停车场详情
const handleOpenParkLotDetail = (row) => {
  // 从parkLotList中获取停车场数据
  const allParkLots = parkLotList();
  selectedParkLot.value =
    allParkLots.find((p) => p.park_id === row.parkId) || {};
  parkLotDetailDrawerRef.value.open();
};

// 打开代付订单详情（记录页）
const handleOpenProxyOrderDetail = (row) => {
  // 从proxyOrderList中获取代付订单数据
  const allProxyOrders = proxyOrderList();
  selectedProxyOrder.value =
    allProxyOrders.find((o) => o.orderId === row.proxyOrderId) || {};
  proxyOrderDetailDrawerRef.value.open();
};

// 详情关闭处理
const handleDetailClose = () => {
  selectedItem.value = null;
};

// 付款方详情关闭处理
const handlePayerDetailClose = () => {
  selectedPayer.value = null;
};

// 代付规则详情关闭处理
const handleProxyRuleDetailClose = () => {
  selectedProxyRule.value = null;
};

// 停车订单详情关闭处理
const handleParkOrderDetailClose = () => {
  selectedParkOrder.value = null;
};

// 停车场详情关闭处理
const handleParkLotDetailClose = () => {
  selectedParkLot.value = null;
};

// 代付订单详情关闭处理
const handleProxyOrderDetailClose = () => {
  selectedProxyOrder.value = null;
};

// 打开车辆详情
const handleOpenCarInfo = (row) => {
  // 从carInfoData中获取车辆数据
  selectedCar.value =
    carInfoData.find((car) => car.car_number === row.plateNo) || {};
  carDetailDrawerRef.value.open();
};

// 车辆详情关闭处理
const handleCarDetailClose = () => {
  selectedCar.value = null;
};

// 详情字段配置
const detailFields = computed(() => {
  if (activeTab.value === 'proxyRule') {
    return [
      { label: '规则ID', key: 'proxyId' },
      { label: '规则名称', key: 'proxyName' },
      { label: '代付类型', key: 'proxyType' },
      { label: '付款方ID', key: 'payerId' },
      { label: '收款方类型', key: 'payeeType' },
      {
        label: '单笔额度',
        key: 'singleAmount',
        formatter: (value) =>
          `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
      },
      {
        label: '月度额度',
        key: 'monthlyAmount',
        formatter: (value) =>
          `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
      },
      { label: '代付对象类型', key: 'objectType' },
      { label: '生效时间', key: 'startTime' },
      {
        label: '失效时间',
        key: 'endTime',
        formatter: (value) => value || '永久',
      },
      {
        label: '状态',
        key: 'status',
        type: 'tag',
        tagType: (status) => {
          return status === '启用' ? 'success' : 'danger';
        },
      },
      { label: '创建人', key: 'createBy' },
      { label: '创建时间', key: 'createTime' },
      { label: '更新时间', key: 'updateTime' },
      { label: '备注', key: 'remark' },
    ];
  } else if (activeTab.value === 'proxyOrder') {
    return [
      { label: '订单ID', key: 'orderId' },
      { label: '代付订单号', key: 'proxyOrderNo' },
      { label: '停车订单ID', key: 'parkOrderId' },
      { label: '代付规则ID', key: 'proxyId' },
      {
        label: '代付金额',
        key: 'proxyAmount',
        formatter: (value) =>
          `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
      },
      {
        label: '订单状态',
        key: 'orderStatus',
        type: 'tag',
        tagType: (status) => {
          if (status === '已代付') return 'success';
          if (status === '待代付') return 'warning';
          if (status === '代付失败') return 'danger';
          return 'info';
        },
      },
      {
        label: '失败原因',
        key: 'failReason',
        formatter: (value) => value || '-',
      },
      {
        label: '代付时间',
        key: 'proxyTime',
        formatter: (value) => value || '-',
      },
      { label: '创建时间', key: 'createTime' },
      { label: '更新时间', key: 'updateTime' },
      { label: '备注', key: 'remark' },
    ];
  } else {
    return [
      { label: '记录ID', key: 'recordId' },
      { label: '记录编号', key: 'recordNo' },
      { label: '代付订单ID', key: 'proxyOrderId' },
      { label: '代付规则ID', key: 'proxyId' },
      { label: '停车订单ID', key: 'parkOrderId' },
      { label: '停车场ID', key: 'parkId' },
      { label: '车牌号码', key: 'plateNo' },
      { label: '代付对象类型', key: 'proxyObjectType' },
      { label: '代付对象ID', key: 'proxyObjectId' },
      {
        label: '代付金额',
        key: 'proxyAmount',
        formatter: (value) =>
          `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
      },
      {
        label: '停车总费用',
        key: 'parkTotalAmount',
        formatter: (value) =>
          `¥${typeof value === 'number' ? value.toFixed(2) : '0.00'}`,
      },
      {
        label: '代付状态',
        key: 'proxyStatus',
        type: 'tag',
        tagType: (status) => {
          if (status === '已代付') return 'success';
          if (status === '待代付') return 'warning';
          if (status === '代付失败') return 'danger';
          return 'info';
        },
      },
      {
        label: '失败原因',
        key: 'failReason',
        formatter: (value) => value || '-',
      },
      {
        label: '代付时间',
        key: 'proxyTime',
        formatter: (value) => value || '-',
      },
      { label: '入场时间', key: 'parkEnterTime' },
      { label: '离场时间', key: 'parkExitTime' },
      { label: '创建人', key: 'createBy' },
      { label: '创建时间', key: 'createTime' },
      { label: '更新时间', key: 'updateTime' },
      { label: '备注', key: 'remark' },
    ];
  }
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 使用封装后的详情抽屉组件 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :data="selectedItem"
      :fields="detailFields"
      :title="
        selectedItem
          ? activeTab === 'proxyRule'
            ? selectedItem.proxyName
            : activeTab === 'proxyOrder'
              ? selectedItem.proxyOrderNo
              : selectedItem.recordNo
          : '详情'
      "
      @close="handleDetailClose"
    />

    <!-- 付款方详情抽屉 -->
    <DetailDrawer
      ref="payerDetailDrawerRef"
      :data="selectedPayer"
      :fields="payerDetailFields"
      :title="selectedPayer?.merchantName || '付款方详情'"
      @close="handlePayerDetailClose"
    />

    <!-- 代付规则详情抽屉 -->
    <DetailDrawer
      ref="proxyRuleDetailDrawerRef"
      :data="selectedProxyRule"
      :fields="proxyRuleDetailFields"
      :title="selectedProxyRule?.proxyName || '代付规则详情'"
      @close="handleProxyRuleDetailClose"
    />

    <!-- 停车订单详情抽屉 -->
    <DetailDrawer
      ref="parkOrderDetailDrawerRef"
      :data="selectedParkOrder"
      :fields="parkOrderDetailFields"
      :title="selectedParkOrder?.park_order_no || '停车订单详情'"
      @close="handleParkOrderDetailClose"
    />
    <!-- 车辆详情抽屉 -->
    <DetailDrawer
      ref="carDetailDrawerRef"
      :data="selectedCar"
      :fields="carDetailFields"
      :title="selectedCar?.car_number || '车辆详情'"
      @close="handleCarDetailClose"
    />

    <!-- 停车场详情抽屉 -->
    <DetailDrawer
      ref="parkLotDetailDrawerRef"
      :data="selectedParkLot"
      :fields="parkLotDetailFields"
      :title="selectedParkLot?.park_name || '停车场详情'"
      @close="handleParkLotDetailClose"
    />

    <!-- 代付订单详情抽屉（记录页） -->
    <DetailDrawer
      ref="proxyOrderDetailDrawerRef"
      :data="selectedProxyOrder"
      :fields="proxyOrderDetailFields"
      :title="selectedProxyOrder?.proxyOrderNo || '代付订单详情'"
      @close="handleProxyOrderDetailClose"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleStatusChange"
            >
              <el-tab-pane
                v-for="item in statusTabsData"
                :key="item.label"
                :label="createStatusLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
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

      <!-- 代付规则模板 -->
      <template #proxyName="{ row }">
        <el-text
          v-if="activeTab === 'proxyRule'"
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.proxyName }}
        </el-text>
        <el-text
          v-else
          @click="handleOpenProxyRuleDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.proxyName }}
        </el-text>
      </template>

      <!-- 付款方模板 -->
      <template #payerName="{ row }">
        <el-text
          @click="handleOpenPayerDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.payerName || row.payerId }}
        </el-text>
      </template>

      <template #status="{ row }">
        <el-tag
          v-if="activeTab === 'proxyRule' && row.status === '启用'"
          type="success"
          size="small"
        >
          {{ row.status }}
        </el-tag>
        <el-tag
          v-else-if="activeTab === 'proxyRule' && row.status === '禁用'"
          type="danger"
          size="small"
        >
          {{ row.status }}
        </el-tag>
      </template>

      <!-- 代付订单编号模板 -->
      <template #proxyOrderNo="{ row }">
        <el-text
          v-if="activeTab === 'proxyRecord'"
          @click="handleOpenProxyOrderDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.proxyOrderNo }}
        </el-text>
        <el-text
          v-else
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.proxyOrderNo }}
        </el-text>
      </template>

      <!-- 停车订单ID模板 -->
      <template #parkOrderId="{ row }">
        <el-text
          @click="handleOpenParkOrderDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.parkOrderId }}
        </el-text>
      </template>

      <template #orderStatus="{ row }">
        <el-tag v-if="row.orderStatus === '已代付'" type="success" size="small">
          {{ row.orderStatus }}
        </el-tag>
        <el-tag
          v-else-if="row.orderStatus === '待代付'"
          type="warning"
          size="small"
        >
          {{ row.orderStatus }}
        </el-tag>
        <el-tag
          v-else-if="row.orderStatus === '代付失败'"
          type="danger"
          size="small"
        >
          {{ row.orderStatus }}
        </el-tag>
      </template>

      <!-- 代付记录模板 -->
      <template #recordNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.recordNo }}
        </el-text>
      </template>

      <!-- 停车订单模板（记录页） -->
      <template #parkOrderNo="{ row }">
        <el-text
          @click="handleOpenParkOrderDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.parkOrderNo || row.parkOrderId }}
        </el-text>
      </template>

      <!-- 车牌号模板 -->
      <template #plateNo="{ row }">
        <el-text
          @click="handleOpenCarInfo(row)"
          class="common-align"
          type="primary"
        >
          {{ row.plateNo }}
        </el-text>
      </template>

      <!-- 停车场模板 -->
      <template #parkName="{ row }">
        <el-text
          @click="handleOpenParkLotDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.parkName || row.parkId }}
        </el-text>
      </template>

      <template #proxyStatus="{ row }">
        <el-tag v-if="row.proxyStatus === '已代付'" type="success" size="small">
          {{ row.proxyStatus }}
        </el-tag>
        <el-tag
          v-else-if="row.proxyStatus === '待代付'"
          type="warning"
          size="small"
        >
          {{ row.proxyStatus }}
        </el-tag>
        <el-tag
          v-else-if="row.proxyStatus === '代付失败'"
          type="danger"
          size="small"
        >
          {{ row.proxyStatus }}
        </el-tag>
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
          <el-icon class="tabel-tab-icon" v-if="!currentDataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="currentDataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：{{ currentDataObj.list.length }} 条记录 </span>
        </div>
        <div class="common-total-bottom" v-if="currentDataObj.totalShow">
          <span> 全部统计：{{ currentTextObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
