<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form.js';
import { useVbenVxeGrid } from '#/adapter/vxe-table.js';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales/index.js';
import { exportToExcel } from '#/utils/excel.js';

import {
  dataList,
  detailFields,
  statusMap,
  textObj,
  useFormSchema,
  useGridColumns,
} from './data.js';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  tabName: {
    type: String,
    default: '充值订单',
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
  return formData.value?.id
    ? textObj(props.tabName).editText
    : textObj(props.tabName).addText;
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
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(props.tabName),
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
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
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
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

// 充值抽屉
const [RechargeDrawer, rechargeDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  placement: 'right',
  title: '充值',
  onCancel() {
    rechargeDrawerApi.close();
  },
  onConfirm() {
    const rechargeData = rechargeFormApi.form.values;
    // 这里可以处理充值逻辑
    console.log('充值数据:', rechargeData);
    ElMessage.success('充值提交成功');
    rechargeDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      rechargeFormApi.resetForm();
    }
  },
});

// 充值表单
const [RechargeForm, rechargeFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'userName',
      label: '用户姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户姓名',
      },
      rules: 'required',
    },
    {
      fieldName: 'carNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargeType',
      label: '充值类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充值类型',
        options: [
          { label: '套餐充值', value: 'package' },
          { label: '自定义充值', value: 'custom' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'rechargePackage',
      label: '充值套餐',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充值套餐',
        options: [
          { label: '月卡套餐', value: '月卡套餐' },
          { label: '季卡套餐', value: '季卡套餐' },
          { label: '年卡套餐', value: '年卡套餐' },
        ],
      },
      vIf: '{{ $formValues.rechargeType === "package" }}',
    },
    {
      fieldName: 'customAmount',
      label: '自定义金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入自定义金额',
        min: 0,
      },
      rules:
        '{{ $formValues.rechargeType === "custom" ? "required" : undefined }}',
    },
    {
      fieldName: 'payType',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '微信支付', value: '微信支付' },
          { label: '支付宝', value: '支付宝' },
          { label: '银行卡', value: '银行卡' },
        ],
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(
    dataObj.apilist,
    textObj(props.tabName).excelName,
    textObj(props.tabName).excelAllName,
  );
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
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.rechargeNo]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.rechargeNo]));
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
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
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
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList(props.tabName).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(props.tabName),
  list: [],
  searchParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  // 根据activeName和searchParams筛选数据
  const filteredList = dataObj.apilist.filter((v) => {
    // 状态筛选
    let statusMatch = true;
    if (props.tabName === '储值卡管理') {
      switch (activeName.value) {
        case '已禁用': {
          statusMatch = v.cardStatus === '已禁用';
          break;
        }
        case '已过期': {
          statusMatch = v.cardStatus === '已过期';
          break;
        }
        case '未激活': {
          statusMatch = v.cardStatus === '未激活';
          break;
        }
        case '正常': {
          statusMatch = v.cardStatus === '正常';
          break;
        }
      }
    } else if (props.tabName === '充值优惠管理') {
      switch (activeName.value) {
        case '已结束': {
          statusMatch = v.status === '已结束';
          break;
        }
        case '未开始': {
          statusMatch = v.status === '未开始';
          break;
        }
        case '进行中': {
          statusMatch = v.status === '进行中';
          break;
        }
      }
    } else {
      switch (activeName.value) {
        case '处理中': {
          statusMatch = v.rechargeStatus === '处理中';
          break;
        }
        case '失败': {
          statusMatch = v.rechargeStatus === '失败';
          break;
        }
        case '成功': {
          statusMatch = v.rechargeStatus === '成功';
          break;
        }
      }
    }

    // 搜索条件筛选
    let searchMatch = true;
    Object.keys(dataObj.searchParams).forEach((key) => {
      const value = dataObj.searchParams[key];
      if (value) {
        searchMatch =
          typeof value === 'string'
            ? searchMatch && v[key]?.toString().includes(value)
            : searchMatch && v[key] === value;
      }
    });

    // 字段点击筛选
    const fieldMatch =
      (!filterCarNumber.value || v.carNumber === filterCarNumber.value) &&
      (!filterRechargePackage.value ||
        v.rechargePackage === filterRechargePackage.value) &&
      (!filterPayType.value || v.payType === filterPayType.value) &&
      (!filterUserName.value || v.userName === filterUserName.value) &&
      (!filterPromotionType.value ||
        v.promotionType === filterPromotionType.value) &&
      (!filterApplicablePackage.value ||
        v.applicablePackage === filterApplicablePackage.value) &&
      (!filterPackageType.value || v.packageType === filterPackageType.value);

    return statusMatch && searchMatch && fieldMatch;
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
  schema: useFormSchema(props.tabName).map((v) => {
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
function onSubmit(values) {
  dataObj.searchParams = values;
  handleRefresh();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.tabName),
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

const activeName = ref('全部');

// 筛选状态
const filterCarNumber = ref(''); // 车牌号码筛选
const filterRechargePackage = ref(''); // 充值套餐筛选
const filterPayType = ref(''); // 支付方式筛选
const filterUserName = ref(''); // 用户姓名筛选
const filterPromotionType = ref(''); // 优惠类型筛选
const filterApplicablePackage = ref(''); // 适用套餐筛选
const filterPackageType = ref(''); // 套餐类型筛选

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 处理字段点击筛选
const handleFieldClick = (field, value) => {
  switch (field) {
    case 'applicablePackage': {
      filterApplicablePackage.value =
        filterApplicablePackage.value === value ? '' : value;
      break;
    }
    case 'carNumber': {
      filterCarNumber.value = filterCarNumber.value === value ? '' : value;
      break;
    }
    case 'packageType': {
      filterPackageType.value = filterPackageType.value === value ? '' : value;
      break;
    }
    case 'payType': {
      filterPayType.value = filterPayType.value === value ? '' : value;
      break;
    }
    case 'promotionType': {
      filterPromotionType.value =
        filterPromotionType.value === value ? '' : value;
      break;
    }
    case 'rechargePackage': {
      filterRechargePackage.value =
        filterRechargePackage.value === value ? '' : value;
      break;
    }
    case 'userName': {
      filterUserName.value = filterUserName.value === value ? '' : value;
      break;
    }
  }
  gridApi.query();
};

// 取消字段筛选
const handleCancelFieldFilter = (field) => {
  switch (field) {
    case 'applicablePackage': {
      filterApplicablePackage.value = '';
      break;
    }
    case 'carNumber': {
      filterCarNumber.value = '';
      break;
    }
    case 'packageType': {
      filterPackageType.value = '';
      break;
    }
    case 'payType': {
      filterPayType.value = '';
      break;
    }
    case 'promotionType': {
      filterPromotionType.value = '';
      break;
    }
    case 'rechargePackage': {
      filterRechargePackage.value = '';
      break;
    }
    case 'userName': {
      filterUserName.value = '';
      break;
    }
  }
  gridApi.query();
};

// 根据标签页类型动态设置三级状态标签
const tabsData = computed(() => {
  if (props.tabName === '储值卡管理') {
    return [
      { label: '全部' },
      { label: '正常' },
      { label: '未激活' },
      { label: '已过期' },
      { label: '已禁用' },
    ];
  } else if (props.tabName === '充值优惠管理') {
    return [
      { label: '全部' },
      { label: '未开始' },
      { label: '进行中' },
      { label: '已结束' },
    ];
  } else {
    return [
      { label: '全部' },
      { label: '处理中' },
      { label: '成功' },
      { label: '失败' },
    ];
  }
});

// 创建标签文本，显示数量统计
const createLabel = (item) => {
  let count = 0;

  if (props.tabName === '储值卡管理') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已禁用': {
        count = dataObj.apilist.filter((v) => v.cardStatus === '已禁用').length;
        break;
      }
      case '已过期': {
        count = dataObj.apilist.filter((v) => v.cardStatus === '已过期').length;
        break;
      }
      case '未激活': {
        count = dataObj.apilist.filter((v) => v.cardStatus === '未激活').length;
        break;
      }
      case '正常': {
        count = dataObj.apilist.filter((v) => v.cardStatus === '正常').length;
        break;
      }
      // No default
    }
  } else if (props.tabName === '充值优惠管理') {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '已结束': {
        count = dataObj.apilist.filter((v) => v.status === '已结束').length;
        break;
      }
      case '未开始': {
        count = dataObj.apilist.filter((v) => v.status === '未开始').length;
        break;
      }
      case '进行中': {
        count = dataObj.apilist.filter((v) => v.status === '进行中').length;
        break;
      }
      // No default
    }
  } else {
    switch (item.label) {
      case '全部': {
        count = dataObj.apilist.length;
        break;
      }
      case '处理中': {
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '处理中',
        ).length;
        break;
      }
      case '失败': {
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '失败',
        ).length;
        break;
      }
      case '成功': {
        count = dataObj.apilist.filter(
          (v) => v.rechargeStatus === '成功',
        ).length;
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

// 处理充值按钮点击
const handleRecharge = () => {
  rechargeDrawerApi.open();
};

// 处理资产转移按钮点击
const handleAssetTransfer = async (row) => {
  try {
    await confirm('确定要进行资产转移吗？');
    // 这里可以处理资产转移逻辑
    console.log('发起资产转移审核流程');
    // 设置审核状态为待审核
    row.auditStatus = '待审核';
    handleRefresh();
    ElMessage.success('资产转移审核流程已发起');
  } catch {
    // 用户取消确认
    console.log('用户取消资产转移');
  }
};

// 处理退款按钮点击
const handleRefund = async (row) => {
  try {
    await confirm('确定要进行退款吗？');
    // 这里可以处理退款逻辑
    console.log('发起退款流程');
    ElMessage.success('退款流程已发起');
  } catch {
    // 用户取消确认
    console.log('用户取消退款');
  }
};

// 开票抽屉
const [InvoiceDrawer, invoiceDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  placement: 'right',
  title: '开具发票',
  onCancel() {
    invoiceDrawerApi.close();
  },
  onConfirm() {
    const invoiceData = invoiceFormApi.form.values;
    // 这里可以处理开票逻辑
    console.log('开票数据:', invoiceData);
    ElMessage.success('电子发票已生成');
    invoiceDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      invoiceFormApi.resetForm();
    }
  },
});

// 开票表单
const [InvoiceForm, invoiceFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'invoiceTitle',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票抬头',
      },
      rules: 'required',
    },
    {
      fieldName: 'taxNumber',
      label: '税号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入税号',
      },
      rules: 'required',
    },
    {
      fieldName: 'invoiceType',
      label: '发票类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择发票类型',
        options: [
          { label: '增值税普通发票', value: '普通发票' },
          { label: '增值税专用发票', value: '专用发票' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'invoiceAmount',
      label: '开票金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入开票金额',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

// 处理开票按钮点击
const handleInvoice = (row) => {
  invoiceDrawerApi.open();
};

// 处理下载按钮点击
const handleDownload = (row) => {
  // 这里可以处理下载充值凭证PDF的逻辑
  console.log('下载充值凭证:', row.rechargeNo);
  ElMessage.success('充值凭证下载成功');
};

// 处理禁用按钮点击
const handleDisable = async (row) => {
  try {
    const confirmMessage =
      props.tabName === '充值优惠管理'
        ? '确定要关闭活动吗？'
        : '确定要禁用该卡吗？';
    await confirm(confirmMessage);

    if (props.tabName === '充值优惠管理') {
      // 处理活动禁用逻辑
      row.status = '已结束';
      console.log('关闭活动:', row.promotionId);
      ElMessage.success('活动已关闭');
    } else if (props.tabName === '储值卡管理') {
      // 处理储值卡禁用逻辑
      row.cardStatus = '已禁用';
      console.log('禁用储值卡:', row.prepaidCardId);
      ElMessage.success('储值卡已禁用');
    }

    handleRefresh();
  } catch {
    // 用户取消确认
    console.log('用户取消禁用操作');
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
        props.tabName === '储值卡管理'
          ? `${dataObj.detailObj.prepaidCardId}详情`
          : props.tabName === '充值优惠管理'
            ? `${dataObj.detailObj.promotionId}详情`
            : `${dataObj.detailObj.rechargeNo}详情`
      "
      :data="dataObj.detailObj"
      :fields="detailFields(props.tabName)"
    />
    <!--   充值抽屉-->
    <RechargeDrawer>
      <RechargeForm />
    </RechargeDrawer>
    <!--   开票抽屉-->
    <InvoiceDrawer>
      <InvoiceForm />
    </InvoiceDrawer>
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

          <!-- 筛选标签 -->
          <el-tag
            v-if="filterCarNumber"
            type="primary"
            closable
            @close="handleCancelFieldFilter('carNumber')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            车牌号码：{{ filterCarNumber }}
          </el-tag>
          <el-tag
            v-if="filterRechargePackage"
            type="primary"
            closable
            @close="handleCancelFieldFilter('rechargePackage')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            充值套餐：{{ filterRechargePackage }}
          </el-tag>
          <el-tag
            v-if="filterPayType"
            type="primary"
            closable
            @close="handleCancelFieldFilter('payType')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            支付方式：{{ filterPayType }}
          </el-tag>
          <el-tag
            v-if="filterUserName"
            type="primary"
            closable
            @close="handleCancelFieldFilter('userName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            用户姓名：{{ filterUserName }}
          </el-tag>
          <el-tag
            v-if="filterPromotionType"
            type="primary"
            closable
            @close="handleCancelFieldFilter('promotionType')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            优惠类型：{{ filterPromotionType }}
          </el-tag>
          <el-tag
            v-if="filterApplicablePackage"
            type="primary"
            closable
            @close="handleCancelFieldFilter('applicablePackage')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            适用套餐：{{ filterApplicablePackage }}
          </el-tag>
          <el-tag
            v-if="filterPackageType"
            type="primary"
            closable
            @close="handleCancelFieldFilter('packageType')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            套餐类型：{{ filterPackageType }}
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
            content="充值"
            icon-name="Wallet"
            @click="handleRecharge"
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
      <template #rechargeNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.rechargeNo }}
        </el-text>
      </template>
      <template #promotionId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.promotionId }}
        </el-text>
      </template>
      <template #auditStatus="{ row }">
        <el-tag :type="statusMap.auditStatus[row.auditStatus]?.type">
          {{ statusMap.auditStatus[row.auditStatus]?.text }}
        </el-tag>
      </template>
      <template #rechargeStatus="{ row }">
        <el-tag :type="statusMap.rechargeStatus[row.rechargeStatus]?.type">
          {{ statusMap.rechargeStatus[row.rechargeStatus]?.text }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '进行中'
              ? 'success'
              : row.status === '未开始'
                ? 'warning'
                : 'info'
          "
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #prepaidCardId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.prepaidCardId }}
        </el-text>
      </template>
      <template #cardStatus="{ row }">
        <el-tag
          :type="
            row.cardStatus === '正常'
              ? 'success'
              : row.cardStatus === '未激活'
                ? 'warning'
                : row.cardStatus === '已过期'
                  ? 'info'
                  : row.cardStatus === '已禁用'
                    ? 'danger'
                    : 'danger'
          "
        >
          {{ row.cardStatus }}
        </el-tag>
      </template>

      <!-- 字段筛选插槽 -->
      <template #carNumber="{ row }">
        <el-text
          @click="handleFieldClick('carNumber', row.carNumber)"
          class="common-align"
          type="primary"
        >
          {{ row.carNumber }}
        </el-text>
      </template>
      <template #rechargePackage="{ row }">
        <el-text
          @click="handleFieldClick('rechargePackage', row.rechargePackage)"
          class="common-align"
          type="primary"
        >
          {{ row.rechargePackage }}
        </el-text>
      </template>
      <template #payType="{ row }">
        <el-text
          @click="handleFieldClick('payType', row.payType)"
          class="common-align"
          type="primary"
        >
          {{ row.payType }}
        </el-text>
      </template>
      <template #userName="{ row }">
        <el-text
          @click="handleFieldClick('userName', row.userName)"
          class="common-align"
          type="primary"
        >
          {{ row.userName }}
        </el-text>
      </template>
      <template #promotionType="{ row }">
        <el-text
          @click="handleFieldClick('promotionType', row.promotionType)"
          class="common-align"
          type="primary"
        >
          {{ row.promotionType }}
        </el-text>
      </template>
      <template #applicablePackage="{ row }">
        <el-text
          @click="handleFieldClick('applicablePackage', row.applicablePackage)"
          class="common-align"
          type="primary"
        >
          {{ row.applicablePackage }}
        </el-text>
      </template>
      <template #packageType="{ row }">
        <el-text
          @click="handleFieldClick('packageType', row.packageType)"
          class="common-align"
          type="primary"
        >
          {{ row.packageType }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮 - 所有标签页都显示 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 编辑按钮 - 仅充值订单和充值优惠管理标签页显示 -->
          <IconButton
            v-if="
              props.tabName === '充值订单' || props.tabName === '充值优惠管理'
            "
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />

          <!-- 资产转移按钮 - 仅充值订单标签页显示 -->
          <IconButton
            v-if="props.tabName === '充值订单'"
            content="资产转移"
            icon-name="Switch"
            @click="handleAssetTransfer(row)"
          />

          <!-- 退款按钮 - 仅充值订单标签页显示 -->
          <IconButton
            v-if="props.tabName === '充值订单'"
            content="退款"
            icon-name="RefreshRight"
            @click="handleRefund(row)"
          />

          <!-- 下载按钮 - 仅充值记录标签页显示 -->
          <IconButton
            v-if="props.tabName === '充值记录'"
            content="下载"
            icon-name="download"
            @click="handleDownload(row)"
          />

          <!-- 禁用按钮 - 充值优惠管理和储值卡管理标签页显示 -->
          <IconButton
            v-if="
              props.tabName === '充值优惠管理' || props.tabName === '储值卡管理'
            "
            content="禁用"
            icon-name="Lock"
            @click="handleDisable(row)"
          />

          <!-- 开票按钮 - 充值订单和充值记录标签页显示 -->
          <IconButton
            v-if="props.tabName === '充值订单' || props.tabName === '充值记录'"
            content="开票"
            icon-name="Ticket"
            @click="handleInvoice(row)"
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
          <span v-if="props.tabName === '储值卡管理'">
            本页统计：储值卡数量: {{ dataObj.list.length }}; 正常:
            {{ dataObj.list.filter((v) => v.cardStatus === '正常').length }};
            未激活:
            {{ dataObj.list.filter((v) => v.cardStatus === '未激活').length }};
            已过期:
            {{ dataObj.list.filter((v) => v.cardStatus === '已过期').length }};
            已禁用:
            {{ dataObj.list.filter((v) => v.cardStatus === '已禁用').length }}
          </span>
          <span v-else-if="props.tabName === '充值优惠管理'">
            本页统计：充值优惠数量: {{ dataObj.list.length }}; 进行中:
            {{ dataObj.list.filter((v) => v.status === '进行中').length }};
            未开始:
            {{ dataObj.list.filter((v) => v.status === '未开始').length }};
            已结束:
            {{ dataObj.list.filter((v) => v.status === '已结束').length }}
          </span>
          <span v-else>
            本页统计：充值记录数量: {{ dataObj.list.length }}; 成功:
            {{
              dataObj.list.filter((v) => v.rechargeStatus === '成功').length
            }}; 失败:
            {{ dataObj.list.filter((v) => v.rechargeStatus === '失败').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj(props.tabName).total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.common-align {
  cursor: pointer;
}
</style>
