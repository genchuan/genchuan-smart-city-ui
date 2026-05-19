<script setup>
import { computed, nextTick, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictObj } from '@vben/hooks';

import { ElMessage, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getCycleReportBarDrillData,
  getCycleReportCardDrillActivityCount,
  getCycleReportCardDrillCardOrderCount,
  getCycleReportCardDrillCouponSendCount,
  getCycleReportCardDrillExchangeCount,
  getCycleReportCardDrillJoinUserCount,
  getCycleReportCardDrillLotteryCount,
  getCycleReportCardDrillRevenue,
  getCycleReportCardDrillTotalStock,
  getCycleReportCardDrillVerifyRate,
  getCycleReportCardDrillWarnStockCount,
  getCycleReportCardDrillWinningRate,
  getCycleReportLineDrillData,
  getCycleReportPieDrillData,
  getTableDrillActivityCount,
  getTableDrillCardOrderCount,
  getTableDrillCouponSendCount,
  getTableDrillExchangeCount,
  getTableDrillJoinUserCount,
  getTableDrillLotteryCount,
  getTableDrillTotalStock,
  getTableDrillVerifyRate,
  getTableDrillWarnStockCount,
  getTableDrillWinningRate,
  getTableDrillRevenue,
} from '#/api/genchuan/industry/chargePark/marketOp/decisionAnalysis/marketOpReport';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

import {
  getGenerateStatusTagType,
  getReportCycleTagType,
  useGridColumns,
} from '../table/data';

const emit = defineEmits(['close']);

// 钻取信息
const drillInfo = reactive({
  drillType: '',
  drillValue: '',
  drillName: '',
  reportCycle: '',
  reportId: '',
  categoryId: '',
});

// 数据对象
const dataObj = reactive({
  total: 0,
  list: [],
  pageSize: 10,
  currentPage: 1,
});

// 是否为卡片钻取类型
const isCardDrill = computed(() => {
  const cardTypes = [
    'activityCount',
    'joinUserCount',
    'lotteryCount',
    'winningRate',
    'couponSendCount',
    'couponVerifyRate',
    'cardOrderCount',
    'revenue',
    'exchangeCount',
    'totalStock',
    'warnStockCount',
  ];
  return cardTypes.includes(drillInfo.drillType);
});

// 是否为图表钻取类型
const isChartDrill = computed(() => {
  const chartTypes = [
    // 饼图类型
    'ruleType',
    'configType',
    'couponPackageType',
    // 柱状图类型
    'activityType',
    'prizeType',
    'couponType',
    'cardType',
    'exchangeCategory',
    // 折线图类型
    'joinTrend',
    'lotteryTrend',
    'couponSendTrend',
    'orderTrend',
    'stockTrend',
  ];
  return chartTypes.includes(drillInfo.drillType);
});

// 是否为表格字段钻取类型
const isTableDrill = computed(() => {
  const tableDrillTypes = [
    'tableActivityCount',
    'tableJoinUserCount',
    'tableLotteryCount',
    'tableWinningRate',
    'tableCouponSendCount',
    'tableVerifyRate',
    'tableCardOrderCount',
    'tableRevenue',
    'tableExchangeCount',
    'tableTotalStock',
    'tableWarnStockCount',
  ];
  return tableDrillTypes.includes(drillInfo.drillType);
});

// 卡片类型映射
const cardTypeMap = {
  activityCount: { name: '活动数', api: getCycleReportCardDrillActivityCount },
  joinUserCount: {
    name: '参与用户数',
    api: getCycleReportCardDrillJoinUserCount,
  },
  lotteryCount: { name: '抽奖量', api: getCycleReportCardDrillLotteryCount },
  winningRate: { name: '中奖率', api: getCycleReportCardDrillWinningRate },
  couponSendCount: {
    name: '优惠券发放量',
    api: getCycleReportCardDrillCouponSendCount,
  },
  couponVerifyRate: { name: '核销率', api: getCycleReportCardDrillVerifyRate },
  cardOrderCount: {
    name: '卡种订单量',
    api: getCycleReportCardDrillCardOrderCount,
  },
  revenue: { name: '营收', api: getCycleReportCardDrillRevenue },
  exchangeCount: { name: '兑换量', api: getCycleReportCardDrillExchangeCount },
  totalStock: { name: '总库存', api: getCycleReportCardDrillTotalStock },
  warnStockCount: {
    name: '预警库存数',
    api: getCycleReportCardDrillWarnStockCount,
  },
};

// 图表钻取类型映射 - 用于确定调用哪个API
const chartTypeMap = {
  // 饼图类型 - pieType 参数值
  ruleType: { chartType: 'pie', apiParam: 'ruleType', apiName: '获取规则/消耗规则', api: getCycleReportPieDrillData },
  configType: { chartType: 'pie', apiParam: 'configType', apiName: '系统配置/自定义配置', api: getCycleReportPieDrillData },
  couponPackageType: { chartType: 'pie', apiParam: 'packageType', apiName: '新人券包/活动券包/会员券包', api: getCycleReportPieDrillData },
  // 柱状图类型 - categoryType 参数值
  activityType: { chartType: 'bar', apiParam: 'activityType', api: getCycleReportBarDrillData },
  prizeType: { chartType: 'bar', apiParam: 'prizeType', api: getCycleReportBarDrillData },
  couponType: { chartType: 'bar', apiParam: 'couponType', api: getCycleReportBarDrillData },
  cardType: { chartType: 'bar', apiParam: 'cardType', api: getCycleReportBarDrillData },
  exchangeCategory: { chartType: 'bar', apiParam: 'exchangeCategoryType', api: getCycleReportBarDrillData },
  pointActivityType: { chartType: 'bar', apiParam: 'pointActivityType', api: getCycleReportBarDrillData },
  // 折线图类型 - lineType 参数值
  joinTrend: { chartType: 'line', apiParam: 'activityTrend', lineName: '活动参与趋势', api: getCycleReportLineDrillData },
  lotteryTrend: { chartType: 'line', apiParam: 'lotteryTrend', lineName: '抽奖量趋势', api: getCycleReportLineDrillData },
  couponSendTrend: { chartType: 'line', apiParam: 'couponTrend', lineName: '优惠券发放趋势', api: getCycleReportLineDrillData },
  orderTrend: { chartType: 'line', apiParam: 'orderTrend', lineName: '订单量趋势', api: getCycleReportLineDrillData },
  stockTrend: { chartType: 'line', apiParam: 'stockTrend', lineName: '库存趋势', api: getCycleReportLineDrillData },
};

// 表格字段钻取类型映射 - 用于确定调用哪个API
const tableDrillTypeMap = {
  tableActivityCount: {
    name: '活动数',
    api: getTableDrillActivityCount,
  },
  tableJoinUserCount: {
    name: '参与用户数',
    api: getTableDrillJoinUserCount,
  },
  tableLotteryCount: {
    name: '抽奖量',
    api: getTableDrillLotteryCount,
  },
  tableWinningRate: {
    name: '中奖率',
    api: getTableDrillWinningRate,
  },
  tableCouponSendCount: {
    name: '优惠券发放量',
    api: getTableDrillCouponSendCount,
  },
  tableVerifyRate: {
    name: '核销率',
    api: getTableDrillVerifyRate,
  },
  tableCardOrderCount: {
    name: '卡种订单量',
    api: getTableDrillCardOrderCount,
  },
  tableRevenue: {
    name: '营收',
    api: getTableDrillRevenue,
  },
  tableExchangeCount: {
    name: '兑换量',
    api: getTableDrillExchangeCount,
  },
  tableTotalStock: {
    name: '总库存',
    api: getTableDrillTotalStock,
  },
  tableWarnStockCount: {
    name: '预警库存数',
    api: getTableDrillWarnStockCount,
  },
};

// 获取弹窗标题
const getDrawerTitle = () => {
  // 卡片钻取类型
  if (isCardDrill.value) {
    const cardInfo = cardTypeMap[drillInfo.drillType];
    return `${cardInfo?.name || '卡片'}钻取明细`;
  }
  // 表格字段钻取类型
  if (isTableDrill.value) {
    const tableInfo = tableDrillTypeMap[drillInfo.drillType];
    return `${tableInfo?.name || '字段'}钻取明细 - ${drillInfo.reportCycle || ''}`;
  }
  // 图表钻取类型
  const typeMap = {
    ruleType: '规则类型',
    configType: '配置类型',
    couponPackageType: '券包类型',
    activityType: '活动类型',
    prizeType: '奖品类型',
    couponType: '优惠券类型',
    cardType: '卡种类型',
    exchangeCategory: '兑换类目',
    joinTrend: '活动参与',
    lotteryTrend: '抽奖量',
    couponSendTrend: '优惠券发放',
    orderTrend: '订单量',
    stockTrend: '库存',
  };
  const typeName = typeMap[drillInfo.drillType] || '明细';
  const displayValue = drillInfo.drillName || drillInfo.drillValue || '-';
  return `${typeName}钻取明细 - ${displayValue}`;
};

// 获取类型显示文本
const getTypeDisplayText = () => {
  // 卡片钻取类型
  if (isCardDrill.value) {
    const cardInfo = cardTypeMap[drillInfo.drillType];
    return cardInfo?.name || '卡片数据';
  }
  // 图表钻取类型
  const typeMap = {
    ruleType: '规则类型占比',
    configType: '配置类型占比',
    couponPackageType: '券包类型占比',
    activityType: '活动类型分布',
    prizeType: '奖品类型分布',
    couponType: '优惠券类型分布',
    cardType: '卡种类型分布',
    exchangeCategory: '兑换类目分布',
    joinTrend: '活动参与趋势',
    lotteryTrend: '抽奖量趋势',
    couponSendTrend: '优惠券发放趋势',
    orderTrend: '订单量趋势',
    stockTrend: '库存趋势',
  };
  return typeMap[drillInfo.drillType] || drillInfo.drillType || '-';
};

// 获取值显示文本
const getValueDisplayText = () => {
  return drillInfo.drillName || drillInfo.drillValue || '-';
};

// 字典标签类型获取函数
const getPointLotteryStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_LOTTERY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPointLotteryStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_LOTTERY_STATUS, String(status));
  return dict ? dict.label : status;
};

const getPrizeMgmtTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPrizeMgmtTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
};

// PRIZE_MGMT_STATUS 字典处理 (奖品状态：上架/下架)
const getPrizeMgmtStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPrizeMgmtStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.PRIZE_MGMT_STATUS, String(status));
  return dict ? dict.label : status;
};

const getCouponMgmtTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCouponMgmtTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_TYPE, String(type));
  return dict ? dict.label : type;
};

const getCouponMgmtStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCouponMgmtStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.COUPON_MGMT_STATUS, String(status));
  return dict ? dict.label : status;
};

const getCardOrderPayStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCardOrderPayStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_ORDER_PAY_STATUS, String(status));
  return dict ? dict.label : status;
};

const getExchangeOrderPayStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getExchangeOrderPayStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.EXCHANGE_ORDER_PAY_STATUS, String(status));
  return dict ? dict.label : status;
};

const getStockControlStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getStockControlStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_STATUS, String(status));
  return dict ? dict.label : status;
};

const getStockControlWarnStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_WARN_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getStockControlWarnStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_WARN_STATUS, String(status));
  return dict ? dict.label : status;
};

// POINT_ACTIVITY_TYPE 字典处理
const getPointActivityTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPointActivityTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_TYPE, String(type));
  return dict ? dict.label : type;
};

// POINT_ACTIVITY_STATUS 字典处理
const getPointActivityStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPointActivityStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_ACTIVITY_STATUS, String(status));
  return dict ? dict.label : status;
};

// CARD_CONFIG_TYPE 字典处理
const getCardConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCardConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// CARD_CONFIG_STATUS 字典处理 (卡种状态/配置状态：上架/下架/停用)
const getCardConfigStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCardConfigStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.CARD_CONFIG_STATUS, String(status));
  return dict ? dict.label : status;
};

// RULE_CONFIG_TYPE 字典处理 (饼图-规则类型)
const getRuleConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getRuleConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.RULE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// ACTIVITY_CONFIG_TYPE 字典处理 (饼图-配置类型)
const getActivityConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getActivityConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.ACTIVITY_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// PACKAGE_CONFIG_TYPE 字典处理 (饼图-券包类型)
const getPackageConfigTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getPackageConfigTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.PACKAGE_CONFIG_TYPE, String(type));
  return dict ? dict.label : type;
};

// COMMON_STATUS 字典处理 (通用状态)
const getCommonStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.COMMON_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getCommonStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.COMMON_STATUS, String(status));
  return dict ? dict.label : status;
};

// POINT_LOTTERY_STATUS 字典处理 (折线图-抽奖趋势)
const getLotteryStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_LOTTERY_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getLotteryStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.POINT_LOTTERY_STATUS, String(status));
  return dict ? dict.label : status;
};

// STOCK_CONTROL_WARN_STATUS 字典处理 (折线图-库存趋势-预警状态)
const getStockWarnStatusTagType = (warnStatus) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_WARN_STATUS, String(warnStatus));
  return getDictTagTypeFromDict(dict, 'primary');
};

const getStockWarnStatusLabel = (warnStatus) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_WARN_STATUS, String(warnStatus));
  return dict ? dict.label : warnStatus;
};

// 获取表格列配置
const getGridColumns = () => {
  // 卡片钻取类型 - 使用不同的列配置
  if (isCardDrill.value) {
    return getCardDrillColumns(drillInfo.drillType);
  }
  // 图表钻取类型 - 使用图表钻取列配置
  if (isChartDrill.value) {
    return getChartDrillColumns(drillInfo.drillType);
  }
  // 表格字段钻取类型 - 使用表格字段钻取列配置
  if (isTableDrill.value) {
    return getTableDrillColumns(drillInfo.drillType);
  }
  // 默认使用原有列配置
  return useGridColumns();
};

// 表格字段钻取列配置 - 根据不同钻取类型返回不同字段（注意：xxId字段不显示）
const getTableDrillColumns = (tableDrillType) => {
  const baseColumns = [{ type: 'seq', width: 60, title: '序号' }];

  switch (tableDrillType) {
    case 'tableActivityCount': {
      return [
        ...baseColumns,
        { field: 'name', title: '活动名称', minWidth: 150 },
        {
          field: 'type',
          title: '活动类型',
          minWidth: 120,
          slots: { default: 'pointActivityType' },
        },
        {
          field: 'startTime',
          title: '开始时间',
          minWidth: 160,
          slots: { default: 'startTime' },
        },
        {
          field: 'endTime',
          title: '结束时间',
          minWidth: 160,
          slots: { default: 'endTime' },
        },
        {
          field: 'joinCount',
          title: '参与人数',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '活动状态',
          minWidth: 100,
          slots: { default: 'pointActivityStatus' },
        },
        { field: 'creator', title: '创建人', minWidth: 100 },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'tableJoinUserCount': {
      return [
        ...baseColumns,
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'deptName', title: '所属部门', minWidth: 120 },
        {
          field: 'joinTime',
          title: '参与时间',
          minWidth: 160,
          slots: { default: 'joinTime' },
        },
        { field: 'joinActivityName', title: '活动名称', minWidth: 150 },
      ];
    }
    case 'tableLotteryCount': {
      return [
        ...baseColumns,
        { field: 'no', title: '抽奖记录编号', minWidth: 180 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'lotteryTime',
          title: '抽奖时间',
          minWidth: 160,
          slots: { default: 'lotteryTime' },
        },
        {
          field: 'costPoint',
          title: '消耗积分',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '记录状态',
          minWidth: 100,
          slots: { default: 'status' },
        },
      ];
    }
    case 'tableWinningRate': {
      return [
        ...baseColumns,
        { field: 'lotteryNo', title: '抽奖记录编号', minWidth: 180 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'lotteryTime',
          title: '抽奖时间',
          minWidth: 160,
          slots: { default: 'lotteryTime' },
        },
        { field: 'prizeName', title: '奖品名称', minWidth: 150 },
        {
          field: 'prizeType',
          title: '奖品类型',
          minWidth: 100,
          slots: { default: 'prizeType' },
        },
        {
          field: 'sendTime',
          title: '发放时间',
          minWidth: 160,
          slots: { default: 'sendTime' },
        },
      ];
    }
    case 'tableCouponSendCount': {
      return [
        ...baseColumns,
        { field: 'name', title: '优惠券名称', minWidth: 150 },
        {
          field: 'type',
          title: '优惠券类型',
          minWidth: 120,
          slots: { default: 'couponType' },
        },
        { field: 'amount', title: '面额/折扣', minWidth: 100 },
        {
          field: 'sendTime',
          title: '发放时间',
          minWidth: 160,
          slots: { default: 'sendTime' },
        },
        { field: 'senderName', title: '发放人', minWidth: 100 },
        { field: 'receiverName', title: '接收人', minWidth: 120 },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'couponStatus' },
        },
      ];
    }
    case 'tableVerifyRate': {
      return [
        ...baseColumns,
        { field: 'couponName', title: '优惠券名称', minWidth: 150 },
        {
          field: 'couponType',
          title: '优惠券类型',
          minWidth: 120,
          slots: { default: 'couponType' },
        },
        { field: 'amount', title: '面额/折扣', minWidth: 100 },
        { field: 'receiverName', title: '接收人', minWidth: 120 },
        {
          field: 'verifyTime',
          title: '核销时间',
          minWidth: 160,
          slots: { default: 'verifyTime' },
        },
        { field: 'verifyPersonName', title: '核销人', minWidth: 100 },
      ];
    }
    case 'tableCardOrderCount': {
      return [
        ...baseColumns,
        { field: 'no', title: '订单编号', minWidth: 180 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'cardName', title: '卡种名称', minWidth: 120 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        { field: 'amount', title: '订单金额', minWidth: 100, sortable: true },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'cardOrderPayStatus' },
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
      ];
    }
    case 'tableRevenue': {
      return [
        ...baseColumns,
        // { field: 'orderId', title: '订单ID', minWidth: 100 },
        { field: 'orderNo', title: '订单编号', minWidth: 180 },
        {
          field: 'orderAmount',
          title: '订单金额',
          minWidth: 120,
          sortable: true,
          formatter: ({ cellValue }) => `¥${Number(cellValue).toFixed(2)}`,
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
        { field: 'payType', title: '支付方式', minWidth: 100 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
      ];
    }
    case 'tableExchangeCount': {
      return [
        ...baseColumns,
        // { field: 'id', title: '兑换订单ID', minWidth: 100 },
        { field: 'no', title: '订单编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'goodsName', title: '商品名称', minWidth: 150 },
        { field: 'costPoint', title: '消耗积分', minWidth: 100, sortable: true },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'exchangeOrderPayStatus' },
        },
        {
          field: 'exchangeTime',
          title: '兑换时间',
          minWidth: 160,
          slots: { default: 'exchangeTime' },
        },
      ];
    }
    case 'tableTotalStock': {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 150 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'status',
          title: '库存状态',
          minWidth: 100,
          slots: { default: 'stockControlStatus' },
        },
      ];
    }
    case 'tableWarnStockCount': {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 150 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'warnStatus',
          title: '告警状态',
          minWidth: 100,
          slots: { default: 'stockControlWarnStatus' },
        },
      ];
    }
    default: {
      return baseColumns;
    }
  }
};

// 图表钻取列配置 - 根据不同钻取类型返回不同字段
const getChartDrillColumns = (chartType) => {
  const baseColumns = [{ type: 'seq', width: 60, title: '序号' }];

  switch (chartType) {
    // ========== 饼图钻取 ==========
    case 'ruleType': {
      return [
        ...baseColumns,
        { field: 'ruleName', title: '规则名称', minWidth: 150 },
        {
          field: 'ruleType',
          title: '规则类型',
          minWidth: 120,
          slots: { default: 'ruleConfigType' },
        },
        // { field: 'description', title: '规则描述', minWidth: 200 },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'commonStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'configType': {
      return [
        ...baseColumns,
        { field: 'configName', title: '配置名称', minWidth: 150 },
        {
          field: 'configType',
          title: '配置类型',
          minWidth: 120,
          slots: { default: 'activityConfigType' },
        },
        // { field: 'description', title: '配置描述', minWidth: 200 },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'commonStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'couponPackageType': {
      return [
        ...baseColumns,
        { field: 'packageName', title: '券包名称', minWidth: 150 },
        {
          field: 'packageType',
          title: '券包类型',
          minWidth: 120,
          slots: { default: 'packageConfigType' },
        },
        // { field: 'couponCount', title: '包含优惠券数量', minWidth: 140 },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'commonStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    // ========== 柱状图钻取 ==========
    case 'activityType': {
      return [
        ...baseColumns,
        { field: 'name', title: '活动名称', minWidth: 150 },
        {
          field: 'type',
          title: '活动类型',
          minWidth: 120,
          slots: { default: 'pointActivityType' },
        },
        {
          field: 'startTime',
          title: '开始时间',
          minWidth: 160,
          slots: { default: 'startTime' },
        },
        {
          field: 'endTime',
          title: '结束时间',
          minWidth: 160,
          slots: { default: 'endTime' },
        },
        {
          field: 'joinCount',
          title: '参与人数',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '活动状态',
          minWidth: 100,
          slots: { default: 'pointActivityStatus' },
        },
      ];
    }
    case 'prizeType': {
      return [
        ...baseColumns,
        { field: 'name', title: '奖品名称', minWidth: 150 },
        {
          field: 'type',
          title: '奖品类型',
          minWidth: 100,
          slots: { default: 'chartPrizeType' },
        },
        { field: 'stock', title: '库存数量', minWidth: 100, sortable: true },
        { field: 'sendCount', title: '发放数量', minWidth: 100, sortable: true },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'prizeMgmtStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'couponType': {
      return [
        ...baseColumns,
        { field: 'name', title: '券名称', minWidth: 150 },
        {
          field: 'type',
          title: '券类型',
          minWidth: 100,
          slots: { default: 'couponType' },
        },
        { field: 'amount', title: '面额/折扣', minWidth: 100 },
        // { field: 'sendCount', title: '发放数量', minWidth: 100, sortable: true },
        // { field: 'verifyRate', title: '核销率', minWidth: 100 },
        {
          field: 'sendTime',
          title: '发放时间',
          minWidth: 160,
          slots: { default: 'sendTime' },
        },
        {
          field: 'status',
          title: '券状态',
          minWidth: 100,
          slots: { default: 'couponStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'cardType': {
      return [
        ...baseColumns,
        { field: 'name', title: '卡种名称', minWidth: 120 },
        {
          field: 'type',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        { field: 'price', title: '价格', minWidth: 100, sortable: true },
        { field: 'saleCount', title: '销售数量', minWidth: 100, sortable: true },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'cardConfigStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'exchangeCategory': {
      return [
        ...baseColumns,
        { field: 'no', title: '订单编号', minWidth: 180 },
        { field: 'goodsName', title: '商品名称', minWidth: 150 },
        {
          field: 'costPoint',
          title: '消耗积分',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'exchangeOrderPayStatus' },
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    // ========== 折线图钻取 ==========
    case 'joinTrend': {
      return [
        ...baseColumns,
        { field: 'name', title: '活动名称', minWidth: 150 },
        {
          field: 'type',
          title: '活动类型',
          minWidth: 120,
          slots: { default: 'pointActivityType' },
        },
        {
          field: 'startTime',
          title: '开始时间',
          minWidth: 160,
          slots: { default: 'startTime' },
        },
        {
          field: 'endTime',
          title: '结束时间',
          minWidth: 160,
          slots: { default: 'endTime' },
        },
        {
          field: 'joinCount',
          title: '参与人数',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '活动状态',
          minWidth: 100,
          slots: { default: 'pointActivityStatus' },
        },
        { field: 'creator', title: '创建人', minWidth: 100 },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'lotteryTrend': {
      return [
        ...baseColumns,
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'lotteryTime',
          title: '抽奖时间',
          minWidth: 160,
          slots: { default: 'lotteryTime' },
        },
        {
          field: 'costPoint',
          title: '消耗积分',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '记录状态',
          minWidth: 100,
          slots: { default: 'lotteryStatus' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'couponSendTrend': {
      return [
        ...baseColumns,
        { field: 'no', title: '领取编号', minWidth: 180 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'receiveTime',
          title: '领取时间',
          minWidth: 160,
          slots: { default: 'receiveTime' },
        },
        {
          field: 'status',
          title: '券状态',
          minWidth: 100,
          slots: { default: 'couponStatus' },
        },
        {
          field: 'verifyTime',
          title: '核销时间',
          minWidth: 160,
          slots: { default: 'verifyTime' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'orderTrend': {
      return [
        ...baseColumns,
        { field: 'no', title: '订单编号', minWidth: 180 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'amount', title: '订单金额', minWidth: 100, sortable: true },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'cardOrderPayStatus' },
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'stockTrend': {
      return [
        ...baseColumns,
        { field: 'currentStock', title: '当前库存', minWidth: 100, sortable: true },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100, sortable: true },
        {
          field: 'status',
          title: '库存状态',
          minWidth: 100,
          slots: { default: 'stockControlStatus' },
        },
        {
          field: 'warnStatus',
          title: '预警状态',
          minWidth: 100,
          slots: { default: 'stockWarnStatus' },
        },
        {
          field: 'syncTime',
          title: '同步时间',
          minWidth: 160,
          slots: { default: 'syncTime' },
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    default: {
      return baseColumns;
    }
  }
};

// 卡片钻取列配置
const getCardDrillColumns = (cardType) => {
  const baseColumns = [{ type: 'seq', width: 60, title: '序号' }];

  switch (cardType) {
    case 'activityCount': {
      return [
        ...baseColumns,
        { field: 'name', title: '活动名称', minWidth: 150 },
        {
          field: 'type',
          title: '活动类型',
          minWidth: 120,
          slots: { default: 'pointActivityType' },
        },
        {
          field: 'startTime',
          title: '开始时间',
          minWidth: 160,
          slots: { default: 'startTime' },
        },
        {
          field: 'endTime',
          title: '结束时间',
          minWidth: 160,
          slots: { default: 'endTime' },
        },
        {
          field: 'joinCount',
          title: '参与人数',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'pointActivityStatus' },
        },
        { field: 'creator', title: '创建人', minWidth: 100 },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160,
          slots: { default: 'createTime' },
        },
      ];
    }
    case 'cardOrderCount': {
      return [
        ...baseColumns,
        { field: 'no', title: '订单编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'cardName', title: '卡种名称', minWidth: 120 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        { field: 'amount', title: '订单金额', minWidth: 100, sortable: true },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'cardOrderPayStatus' },
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
      ];
    }
    case 'revenue': {
      return [
        ...baseColumns,
        // { field: 'orderId', title: '订单ID', minWidth: 100 },
        { field: 'orderNo', title: '订单编号', minWidth: 180 },
        {
          field: 'orderAmount',
          title: '订单金额',
          minWidth: 120,
          sortable: true,
          formatter: ({ cellValue }) => `¥${Number(cellValue).toFixed(2)}`,
        },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
        { field: 'payType', title: '支付方式', minWidth: 100 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
      ];
    }
    case 'exchangeCount': {
      return [
        ...baseColumns,
        // { field: 'id', title: '兑换订单ID', minWidth: 100 },
        { field: 'no', title: '订单编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'goodsName', title: '商品名称', minWidth: 150 },
        { field: 'costPoint', title: '消耗积分', minWidth: 100, sortable: true },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'exchangeOrderPayStatus' },
        },
        {
          field: 'exchangeTime',
          title: '兑换时间',
          minWidth: 160,
          slots: { default: 'exchangeTime' },
        },
      ];
    }
    case 'totalStock': {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 150 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'status',
          title: '库存状态',
          minWidth: 100,
          slots: { default: 'stockControlStatus' },
        },
      ];
    }
    case 'warnStockCount': {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 150 },
        {
          field: 'cardType',
          title: '卡种类型',
          minWidth: 100,
          slots: { default: 'cardConfigType' },
        },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'warnStatus',
          title: '告警状态',
          minWidth: 100,
          slots: { default: 'stockControlWarnStatus' },
        },
      ];
    }
    case 'couponSendCount': {
      return [
        ...baseColumns,
        { field: 'name', title: '优惠券名称', minWidth: 150 },
        {
          field: 'type',
          title: '优惠券类型',
          minWidth: 120,
          slots: { default: 'couponType' },
        },
        { field: 'amount', title: '面额/折扣', minWidth: 100 },
        {
          field: 'sendTime',
          title: '发放时间',
          minWidth: 160,
          slots: { default: 'sendTime' },
        },
        { field: 'senderName', title: '发放人', minWidth: 100 },
        { field: 'receiverName', title: '接收人', minWidth: 120 },
        {
          field: 'status',
          title: '状态',
          minWidth: 100,
          slots: { default: 'couponStatus' },
        },
      ];
    }
    case 'couponVerifyRate': {
      return [
        ...baseColumns,
        // { field: 'couponId', title: '优惠券ID', minWidth: 100 },
        { field: 'couponName', title: '优惠券名称', minWidth: 150 },
        {
          field: 'couponType',
          title: '优惠券类型',
          minWidth: 120,
          slots: { default: 'couponType' },
        },
        { field: 'amount', title: '面额/折扣', minWidth: 100 },
        { field: 'receiverName', title: '接收人', minWidth: 120 },
        {
          field: 'verifyTime',
          title: '核销时间',
          minWidth: 160,
          slots: { default: 'verifyTime' },
        },
        { field: 'verifyPersonName', title: '核销人', minWidth: 100 },
      ];
    }
    case 'exchangeCount': {
      return [
        ...baseColumns,
        { field: 'no', title: '兑换记录编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'goodsName', title: '商品名称', minWidth: 150 },
        {
          field: 'costPoint',
          title: '消耗积分',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'payStatus',
          title: '支付状态',
          minWidth: 100,
          slots: { default: 'exchangeOrderPayStatus' },
        },
        {
          field: 'exchangeTime',
          title: '兑换时间',
          minWidth: 160,
          slots: { default: 'exchangeTime' },
        },
      ];
    }
    case 'joinUserCount': {
      return [
        ...baseColumns,
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        { field: 'deptName', title: '所属部门', minWidth: 120 },
        {
          field: 'joinTime',
          title: '参与时间',
          minWidth: 160,
          slots: { default: 'joinTime' },
        },
        // { field: 'joinActivityId', title: '活动ID', minWidth: 100 },
        { field: 'joinActivityName', title: '活动名称', minWidth: 150 },
      ];
    }
    case 'lotteryCount': {
      return [
        ...baseColumns,
        { field: 'no', title: '抽奖记录编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'lotteryTime',
          title: '抽奖时间',
          minWidth: 160,
          slots: { default: 'lotteryTime' },
        },
        {
          field: 'costPoint',
          title: '消耗积分',
          minWidth: 100,
          sortable: true,
        },
        {
          field: 'status',
          title: '记录状态',
          minWidth: 100,
          slots: { default: 'status' },
        },
      ];
    }
    case 'revenue': {
      return [
        ...baseColumns,
        { field: 'orderNo', title: '订单编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'orderAmount',
          title: '订单金额',
          minWidth: 100,
          sortable: true,
        },
        // {
        //   field: 'payStatus',
        //   title: '支付状态',
        //   minWidth: 100,
        //   slots: { default: 'cardOrderPayStatus' },
        // },
        {
          field: 'payTime',
          title: '支付时间',
          minWidth: 160,
          slots: { default: 'payTime' },
        },
        // { field: 'payType', title: '支付方式', minWidth: 100 },
      ];
    }
    case 'totalStock':
    {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 120 },
        { field: 'cardType', title: '卡种类型', minWidth: 100 },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'status',
          title: '库存状态',
          minWidth: 100,
          slots: { default: 'stockControlStatus' },
        },
      ];
    }
    case 'warnStockCount': {
      return [
        ...baseColumns,
        // { field: 'cardId', title: '卡种ID', minWidth: 100 },
        { field: 'cardName', title: '卡种名称', minWidth: 120 },
        { field: 'cardType', title: '卡种类型', minWidth: 100 },
        {
          field: 'currentStock',
          title: '当前库存',
          minWidth: 100,
          sortable: true,
        },
        { field: 'warnThreshold', title: '预警阈值', minWidth: 100 },
        {
          field: 'warnStatus',
          title: '预警状态',
          minWidth: 100,
          slots: { default: 'stockControlWarnStatus' },
        },
      ];
    }
    case 'winningRate': {
      return [
        ...baseColumns,
        { field: 'lotteryNo', title: '抽奖记录编号', minWidth: 180 },
        // { field: 'userId', title: '用户ID', minWidth: 100 },
        { field: 'userName', title: '用户名称', minWidth: 120 },
        {
          field: 'lotteryTime',
          title: '抽奖时间',
          minWidth: 160,
          slots: { default: 'lotteryTime' },
        },
        { field: 'prizeName', title: '奖品名称', minWidth: 150 },
        {
          field: 'prizeType',
          title: '奖品类型',
          minWidth: 100,
          slots: { default: 'prizeType' },
        },
        {
          field: 'sendTime',
          title: '发放时间',
          minWidth: 160,
          slots: { default: 'sendTime' },
        },
      ];
    }
    default: {
      return baseColumns;
    }
  }
};

// 初始化表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return getDrillDownData({ page });
        },
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
  showSearchForm: false,
});

// 生成模拟数据
const generateMockData = () => {
  const mockList = [];
  const count = 25;

  for (let i = 0; i < count; i++) {
    mockList.push({
      id: i + 1,
      reportCycle: drillInfo.reportCycle || '日报',
      statTime: `2026-01-${String((i % 28) + 1).padStart(2, '0')} 00:00:00-2026-01-${String((i % 28) + 1).padStart(2, '0')} 23:59:59`,
      activityCount: Math.floor(Math.random() * 50) + 10,
      joinUserCount: Math.floor(Math.random() * 1000) + 100,
      lotteryCount: Math.floor(Math.random() * 500) + 50,
      winningRate: `${(Math.random() * 20 + 5).toFixed(2)}%`,
      couponSendCount: Math.floor(Math.random() * 300) + 30,
      couponVerifyRate: `${(Math.random() * 40 + 20).toFixed(2)}%`,
      cardOrderCount: Math.floor(Math.random() * 100) + 10,
      revenue: (Math.random() * 10_000 + 1000).toFixed(2),
      exchangeCount: Math.floor(Math.random() * 200) + 20,
      totalStock: Math.floor(Math.random() * 5000) + 500,
      warnStockCount: Math.floor(Math.random() * 50) + 5,
      generateStatus: ['已生成', '生成中', '生成失败'][
        Math.floor(Math.random() * 3)
      ],
      generateTime: Date.now() - Math.floor(Math.random() * 86_400_000 * 7),
      operator: ['张三', '李四', '王五', '赵六', '钱七'][
        Math.floor(Math.random() * 5)
      ],
      filterRule: `统计时段: 2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
      creator: 'system',
      createTime: Date.now() - Math.floor(Math.random() * 86_400_000 * 30),
      updateTime: Date.now() - Math.floor(Math.random() * 86_400_000 * 7),
    });
  }

  return mockList;
};

// 生成卡片钻取模拟数据
const generateCardMockData = (cardType) => {
  const mockList = [];
  const count = 25;
  const statusList = ['待生效', '进行中', '已结束', '已暂停'];
  const payStatusList = ['待支付', '已支付', '已完成', '已取消'];
  const couponStatusList = ['未领取', '已领取', '已使用', '已过期'];
  const stockStatusList = ['正常库存', '低库存', '预警库存'];
  const warnStatusList = ['未告警', '已告警'];

  for (let i = 0; i < count; i++) {
    const baseData = {
      id: i + 1,
      tenantId: 1,
    };

    switch (cardType) {
      case 'activityCount': {
        mockList.push({
          ...baseData,
          name: `活动${i + 1}`,
          type: ['注册赠分', '消费赠分', '邀请赠分', '活动赠分'][
            Math.floor(Math.random() * 4)
          ],
          startTime: '2026-04-01 00:00:00',
          endTime: '2026-04-30 23:59:59',
          joinCount: Math.floor(Math.random() * 200) + 50,
          status: statusList[Math.floor(Math.random() * statusList.length)],
          creator: ['admin', 'system', 'operator'][
            Math.floor(Math.random() * 3)
          ],
          createTime: '2026-03-28 10:30:00',
        });
        break;
      }
      case 'cardOrderCount':
      case 'revenue': {
        mockList.push({
          ...baseData,
          no: `CARD20260429${String(i).padStart(3, '0')}`,
          userId: 10_000 + i,
          userName: `user${String(i).padStart(3, '0')}`,
          cardId: 600 + i,
          cardName: ['月卡', '季卡', '年卡'][Math.floor(Math.random() * 3)],
          cardType: ['月卡', '季卡', '年卡'][Math.floor(Math.random() * 3)],
          amount: [99, 269, 999][Math.floor(Math.random() * 3)],
          orderAmount: [99, 269, 999][Math.floor(Math.random() * 3)],
          payStatus:
            payStatusList[Math.floor(Math.random() * payStatusList.length)],
          payTime: '2026-04-29 09:30:00',
          payType: ['微信支付', '支付宝', '银行卡'][
            Math.floor(Math.random() * 3)
          ],
        });
        break;
      }
      case 'couponSendCount': {
        mockList.push({
          ...baseData,
          name: ['10元满减券', '20元折扣券', '50元充电券'][
            Math.floor(Math.random() * 3)
          ],
          type: ['满减', '折扣', '时长', '立减'][Math.floor(Math.random() * 4)],
          amount: [10, 20, 50][Math.floor(Math.random() * 3)],
          sendTime: '2026-04-29 08:30:00',
          senderId: 10_000,
          senderName: 'admin',
          receiverId: 10_001 + i,
          receiverName: `user${String(i).padStart(3, '0')}`,
          status:
            couponStatusList[
              Math.floor(Math.random() * couponStatusList.length)
            ],
        });
        break;
      }
      case 'couponVerifyRate': {
        mockList.push({
          ...baseData,
          couponId: 400 + i,
          couponName: ['10元满减券', '20元折扣券'][
            Math.floor(Math.random() * 2)
          ],
          couponType: ['满减', '折扣'][Math.floor(Math.random() * 2)],
          amount: [10, 20][Math.floor(Math.random() * 2)],
          receiverId: 10_001 + i,
          receiverName: `user${String(i).padStart(3, '0')}`,
          verifyTime: '2026-04-29 10:40:00',
          verifyPersonId: 10_000,
          verifyPersonName: 'admin',
        });
        break;
      }
      case 'exchangeCount': {
        mockList.push({
          ...baseData,
          no: `EX20260429${String(i).padStart(3, '0')}`,
          userId: 10_000 + i,
          userName: `user${String(i).padStart(3, '0')}`,
          goodsName: ['50元充电券', '100元充电券', '充电宝'][
            Math.floor(Math.random() * 3)
          ],
          costPoint: [500, 1000, 2000][Math.floor(Math.random() * 3)],
          payStatus:
            payStatusList[Math.floor(Math.random() * payStatusList.length)],
          exchangeTime: '2026-04-29 10:10:00',
        });
        break;
      }
      case 'joinUserCount': {
        mockList.push({
          ...baseData,
          userId: 10_000 + i,
          userName: `user${String(i).padStart(3, '0')}`,
          deptName: ['运营部', '技术部', '市场部', '客服部'][
            Math.floor(Math.random() * 4)
          ],
          joinTime: '2026-04-29 09:15:30',
          joinActivityId: 100 + i,
          joinActivityName: `4月积分赠礼活动${i + 1}`,
        });
        break;
      }
      case 'lotteryCount': {
        mockList.push({
          ...baseData,
          no: `LOT20260429${String(i).padStart(3, '0')}`,
          userId: 10_000 + i,
          userName: `user${String(i).padStart(3, '0')}`,
          lotteryTime: '2026-04-29 09:20:30',
          costPoint: [50, 100, 200][Math.floor(Math.random() * 3)],
          status: ['正常记录', '异常记录', '已核查'][
            Math.floor(Math.random() * 3)
          ],
        });
        break;
      }
      case 'totalStock':
      case 'warnStockCount': {
        mockList.push({
          ...baseData,
          cardId: 600 + i,
          cardName: ['月卡', '季卡', '年卡', '日卡'][
            Math.floor(Math.random() * 4)
          ],
          cardType: ['月卡', '季卡', '年卡', '日卡'][
            Math.floor(Math.random() * 4)
          ],
          currentStock: Math.floor(Math.random() * 300) + 20,
          warnThreshold: 50,
          status:
            stockStatusList[Math.floor(Math.random() * stockStatusList.length)],
          warnStatus:
            warnStatusList[Math.floor(Math.random() * warnStatusList.length)],
        });
        break;
      }
      case 'winningRate': {
        mockList.push({
          ...baseData,
          lotteryId: 2000 + i,
          lotteryNo: `LOT20260429${String(i).padStart(3, '0')}`,
          userId: 10_000 + i,
          userName: `user${String(i).padStart(3, '0')}`,
          lotteryTime: '2026-04-29 09:20:30',
          prizeId: 300 + i,
          prizeName: ['10元优惠券', '20元优惠券', '50元充电券'][
            Math.floor(Math.random() * 3)
          ],
          prizeType: ['优惠券', '实物', '虚拟'][Math.floor(Math.random() * 3)],
          sendTime: '2026-04-29 09:21:00',
        });
        break;
      }
      default: {
        mockList.push(baseData);
      }
    }
  }

  return mockList;
};

// 生成图表钻取模拟数据
const generateChartMockData = (chartType) => {
  const mockList = [];
  const count = 25;
  const statusList = ['启用', '禁用'];
  const commonStatusList = ['上架', '下架'];

  for (let i = 0; i < count; i++) {
    const baseData = {
      id: i + 1,
    };

    switch (chartType) {
      // ========== 饼图钻取数据 ==========
      case 'ruleType': {
        mockList.push({
          ...baseData,
          name: ['注册赠分规则', '消费赠分规则', '邀请赠分规则', '活动赠分规则'][
            Math.floor(Math.random() * 4)
          ],
          type: ['获取规则', '消耗规则'][Math.floor(Math.random() * 2)],
          description: `规则描述${i + 1}`,
          status: statusList[Math.floor(Math.random() * statusList.length)],
          createTime: '2026-03-01 10:00:00',
        });
        break;
      }
      case 'configType': {
        mockList.push({
          ...baseData,
          name: ['系统配置1', '系统配置2', '自定义配置1', '自定义配置2'][
            Math.floor(Math.random() * 4)
          ],
          type: ['系统配置', '自定义配置'][Math.floor(Math.random() * 2)],
          description: `配置描述${i + 1}`,
          status: statusList[Math.floor(Math.random() * statusList.length)],
          createTime: '2026-03-15 14:00:00',
        });
        break;
      }
      case 'couponPackageType': {
        mockList.push({
          ...baseData,
          name: ['新人券包', '活动券包', '会员券包', '节日券包'][
            Math.floor(Math.random() * 4)
          ],
          type: ['新人券包', '活动券包', '会员券包'][Math.floor(Math.random() * 3)],
          couponCount: Math.floor(Math.random() * 10) + 1,
          status: statusList[Math.floor(Math.random() * statusList.length)],
          createTime: '2026-03-20 09:00:00',
        });
        break;
      }
      // ========== 柱状图钻取数据 ==========
      case 'activityType': {
        mockList.push({
          ...baseData,
          name: `活动${i + 1}`,
          type: ['注册赠分', '消费赠分', '邀请赠分', '活动赠分'][
            Math.floor(Math.random() * 4)
          ],
          startTime: '2026-04-01 00:00:00',
          endTime: '2026-04-30 23:59:59',
          joinCount: Math.floor(Math.random() * 500) + 50,
          status: ['待生效', '进行中', '已结束', '已暂停'][
            Math.floor(Math.random() * 4)
          ],
        });
        break;
      }
      case 'prizeType': {
        mockList.push({
          ...baseData,
          name: ['一等奖', '月卡优惠券包', '8元充值券', '停车券10元', '7折充电券', '20元充电券', '15元充电通券', '5元充电优惠券'][
            Math.floor(Math.random() * 8)
          ],
          type: String(Math.floor(Math.random() * 4)),
          stock: Math.floor(Math.random() * 15000) + 100,
          sendCount: Math.floor(Math.random() * 3500),
          status: String(Math.floor(Math.random() * 2)),
          createTime: String(1777273598000 + Math.random() * 100000000),
        });
        break;
      }
      case 'couponType': {
        mockList.push({
          ...baseData,
          name: ['10元满减券', '20元折扣券', '50元充电券', '9折时长券'][
            Math.floor(Math.random() * 4)
          ],
          type: ['满减', '折扣', '时长', '立减'][Math.floor(Math.random() * 4)],
          amount: [10, 20, 50, 0.9][Math.floor(Math.random() * 4)],
          sendCount: Math.floor(Math.random() * 300) + 30,
          verifyRate: `${(Math.random() * 50 + 10).toFixed(1)}%`,
          status: ['未领取', '已领取', '已使用', '已过期'][
            Math.floor(Math.random() * 4)
          ],
        });
        break;
      }
      case 'cardType': {
        mockList.push({
          ...baseData,
          name: ['充电月卡-特惠版', '周储值享月卡', '快充季电月卡', '港闸充电月卡', '企业充电月卡', '充电通月卡', '停车月卡-轻惠版', '充电月卡-豪华版', '充电月卡-轻享版'][
            Math.floor(Math.random() * 9)
          ],
          type: String(Math.floor(Math.random() * 5)),
          price: [329, 349, 499, 199, 899, 699, 299, 599, 399][Math.floor(Math.random() * 9)],
          saleCount: Math.floor(Math.random() * 100) + 10,
          status: String(Math.floor(Math.random() * 2)),
          createTime: String(1776876559000 + Math.random() * 100000000),
        });
        break;
      }
      case 'exchangeCategory': {
        mockList.push({
          ...baseData,
          no: `EO202603${String(i).padStart(5, '0')}`,
          goodsName: ['USB集线器（4口）', '50元充电券', '100元充电券', '充电宝', '数据线', '停车优惠券', '新用户专享', '会员专属礼包'][
            Math.floor(Math.random() * 8)
          ],
          categoryId: Math.floor(Math.random() * 5) + 1,
          costPoint: [50, 100, 130, 200, 500, 800, 1000][Math.floor(Math.random() * 7)],
          payStatus: String(Math.floor(Math.random() * 4)),
          payTime: String(1774450533000 + Math.random() * 100000000),
          createTime: String(1776877089000 + Math.random() * 100000000),
        });
        break;
      }
      // ========== 折线图钻取数据 ==========
      case 'joinTrend': {
        mockList.push({
          ...baseData,
          name: ['周三会员日', '新春赠分活动', '高速服务区赠分', '雨天特别赠分'][
            Math.floor(Math.random() * 4)
          ],
          type: String(Math.floor(Math.random() * 3)),
          startTime: String(1775016000000 + Math.random() * 100000000),
          endTime: String(1780000000000 + Math.random() * 100000000),
          joinCount: Math.floor(Math.random() * 500) + 100,
          status: String(Math.floor(Math.random() * 3)),
          creator: '亘川智城',
          createTime: String(1776839732000 + Math.random() * 100000000),
        });
        break;
      }
      case 'lotteryTrend': {
        mockList.push({
          ...baseData,
          userName: `user${String(i).padStart(3, '0')}`,
          lotteryTime: String(1776371400000 + Math.random() * 100000000),
          costPoint: [100, 150, 200][Math.floor(Math.random() * 3)],
          status: String(Math.floor(Math.random() * 3)),
          createTime: String(1776840858000 + Math.random() * 100000000),
        });
        break;
      }
      case 'couponSendTrend': {
        mockList.push({
          ...baseData,
          no: `RCV202603${String(i).padStart(6, '0')}`,
          userName: `user${String(i).padStart(3, '0')}`,
          receiveTime: String(1773842400000 + Math.random() * 100000000),
          status: String(Math.floor(Math.random() * 2)),
          verifyTime: Math.random() > 0.5 ? String(1774000000000 + Math.random() * 100000000) : null,
          createTime: String(1776843537000 + Math.random() * 100000000),
        });
        break;
      }
      case 'orderTrend': {
        mockList.push({
          ...baseData,
          no: `CO202603${String(i).padStart(5, '0')}`,
          userName: `user${String(i).padStart(3, '0')}`,
          amount: [49.90, 129, 299, 399, 899, 2499, 3599][Math.floor(Math.random() * 7)],
          payStatus: String([-1, 2, 3][Math.floor(Math.random() * 3)]),
          payTime: Math.random() > 0.5 ? String(1774709733000 + Math.random() * 100000000) : null,
          createTime: String(1776876559000 + Math.random() * 100000000),
        });
        break;
      }
      case 'stockTrend': {
        mockList.push({
          ...baseData,
          currentStock: Math.floor(Math.random() * 1000) + 10,
          warnThreshold: [5, 10, 15, 20, 50, 80, 100][Math.floor(Math.random() * 7)],
          status: String(Math.floor(Math.random() * 3)),
          warnStatus: String(Math.floor(Math.random() * 3)),
          syncTime: String(1776834000000 + Math.random() * 100000000),
          createTime: String(1776876559000 + Math.random() * 100000000),
        });
        break;
      }
      default: {
        mockList.push(baseData);
      }
    }
  }

  return mockList;
};

// 生成表格字段钻取模拟数据
const generateTableDrillMockData = (tableDrillType) => {
  const mockList = [];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const baseData = {
      id: i + 1,
    };

    switch (tableDrillType) {
      case 'tableActivityCount': {
        mockList.push({
          ...baseData,
          name: `活动${i + 1}`,
          type: ['注册赠分', '消费赠分', '邀请赠分', '活动赠分'][
            Math.floor(Math.random() * 4)
          ],
          startTime: '2026-04-01 00:00:00',
          endTime: '2026-04-30 23:59:59',
          joinCount: Math.floor(Math.random() * 200) + 50,
          status: ['待生效', '进行中', '已结束', '已暂停'][
            Math.floor(Math.random() * 4)
          ],
          creator: 'admin',
          createTime: '2026-03-28 10:30:00',
        });
        break;
      }
      case 'tableJoinUserCount': {
        mockList.push({
          ...baseData,
          userName: `user${String(i).padStart(3, '0')}`,
          deptName: ['运营部', '技术部', '市场部', '客服部'][
            Math.floor(Math.random() * 4)
          ],
          joinTime: '2026-04-29 09:15:30',
          joinActivityName: `4月积分赠礼活动${i + 1}`,
        });
        break;
      }
      case 'tableLotteryCount': {
        mockList.push({
          ...baseData,
          no: `LOT20260429${String(i).padStart(3, '0')}`,
          userName: `user${String(i).padStart(3, '0')}`,
          lotteryTime: '2026-04-29 09:20:30',
          costPoint: [50, 100, 200][Math.floor(Math.random() * 3)],
          status: ['正常记录', '异常记录', '已核查'][
            Math.floor(Math.random() * 3)
          ],
        });
        break;
      }
      case 'tableWinningRate': {
        mockList.push({
          ...baseData,
          lotteryNo: `LOT20260429${String(i).padStart(3, '0')}`,
          userName: `user${String(i).padStart(3, '0')}`,
          lotteryTime: '2026-04-29 09:20:30',
          prizeName: ['10元优惠券', '20元优惠券', '50元充电券'][
            Math.floor(Math.random() * 3)
          ],
          prizeType: ['优惠券', '实物', '虚拟'][Math.floor(Math.random() * 3)],
          sendTime: '2026-04-29 09:21:00',
        });
        break;
      }
      case 'tableCouponSendCount': {
        mockList.push({
          ...baseData,
          name: ['10元满减券', '20元折扣券', '50元充电券'][
            Math.floor(Math.random() * 3)
          ],
          type: ['满减', '折扣', '时长', '立减'][Math.floor(Math.random() * 4)],
          amount: [10, 20, 50][Math.floor(Math.random() * 3)],
          sendTime: '2026-04-29 08:30:00',
          senderName: 'admin',
          receiverName: `user${String(i).padStart(3, '0')}`,
          status: ['未领取', '已领取', '已使用', '已过期'][
            Math.floor(Math.random() * 4)
          ],
        });
        break;
      }
      case 'tableVerifyRate': {
        mockList.push({
          ...baseData,
          couponName: ['10元满减券', '20元折扣券'][
            Math.floor(Math.random() * 2)
          ],
          couponType: ['满减', '折扣'][Math.floor(Math.random() * 2)],
          amount: [10, 20][Math.floor(Math.random() * 2)],
          receiverName: `user${String(i).padStart(3, '0')}`,
          verifyTime: '2026-04-29 10:40:00',
          verifyPersonName: 'admin',
        });
        break;
      }
      case 'tableCardOrderCount': {
        mockList.push({
          ...baseData,
          no: `CARD20260429${String(i).padStart(3, '0')}`,
          userName: `user${String(i).padStart(3, '0')}`,
          cardName: ['月卡', '季卡', '年卡'][Math.floor(Math.random() * 3)],
          cardType: ['日卡', '周卡', '月卡', '季卡', '年卡'][
            Math.floor(Math.random() * 5)
          ],
          amount: [9.9, 29, 99, 269, 999][Math.floor(Math.random() * 5)],
          payStatus: ['待支付', '已支付', '已完成', '已取消'][
            Math.floor(Math.random() * 4)
          ],
          payTime: '2026-04-29 09:30:00',
        });
        break;
      }
      default: {
        mockList.push(baseData);
      }
    }
  }

  return mockList;
};

// 获取钻取数据
const getDrillDownData = async (pageObj) => {
  const page = pageObj.page;

  try {
    // 卡片钻取类型 - 调用对应接口
    if (isCardDrill.value) {
      const cardInfo = cardTypeMap[drillInfo.drillType];
      if (cardInfo && cardInfo.api) {
        const response = await cardInfo.api({
          pageNo: page.currentPage,
          pageSize: page.pageSize,
        });
        const data = response?.data || response;
        if (data) {
          dataObj.total = data.total || 0;
          dataObj.currentPage = data.pageNum || page.currentPage;
          dataObj.pageSize = data.pageSize || page.pageSize;
          dataObj.list = data.list || [];
          return {
            total: dataObj.total,
            list: dataObj.list,
          };
        }
      }
      // 接口未返回数据，使用模拟数据
      const mockData = generateCardMockData(drillInfo.drillType);
      dataObj.total = mockData.length;
      dataObj.currentPage = page.currentPage;
      dataObj.pageSize = page.pageSize;
      dataObj.list = mockData.slice(
        (page.currentPage - 1) * page.pageSize,
        page.currentPage * page.pageSize,
      );
      return {
        total: dataObj.total,
        list: dataObj.list,
      };
    }

    // 图表钻取类型 - 调用对应的图表钻取接口
    if (isChartDrill.value) {
      const chartInfo = chartTypeMap[drillInfo.drillType];
      if (chartInfo && chartInfo.api) {
        // 构建请求参数
        let params = {
          pageNo: page.currentPage,
          pageSize: page.pageSize,
        };

        // 根据图表类型添加不同的参数（使用 API 需要的实际参数值）
        if (chartInfo.chartType === 'pie') {
          // 饼图钻取：pieType + pieValue（传入枚举值而非中文标签）
          params.pieType = chartInfo.apiParam;  // ruleType/configType/packageType
          params.pieValue = drillInfo.drillValue || '';  // 枚举值（如 "1", "2"）
        } else if (chartInfo.chartType === 'bar') {
          // 柱状图钻取：categoryType [+ categoryValue / categoryId]
          params.categoryType = chartInfo.apiParam;  // activityType/couponType/prizeType/...
          // 如果是 exchangeCategoryType 类型，不传 categoryValue，只传 categoryId（必传）
          if (chartInfo.apiParam === 'exchangeCategoryType') {
            // categoryId 必传，来自图表数据中的 categoryId
            params.categoryId = drillInfo.categoryId || '';
          } else {
            // 其余情况传递 categoryValue（枚举值）
            params.categoryValue = drillInfo.drillValue || '';
          }
        } else if (chartInfo.chartType === 'line') {
          // 折线图钻取：lineType + lineName + date
          params.lineType = chartInfo.apiParam;  // activityTrend/lotteryTrend/...
          params.lineName = chartInfo.lineName || drillInfo.drillName || '';
          params.date = drillInfo.drillValue || drillInfo.drillName || '';
        }

        console.log('图表钻取请求参数:', params);

        const response = await chartInfo.api(params);
        const data = response?.data || response;
        if (data) {
          dataObj.total = data.total || 0;
          dataObj.currentPage = data.pageNum || page.currentPage;
          dataObj.pageSize = data.pageSize || page.pageSize;
          dataObj.list = data.list || [];
          return {
            total: dataObj.total,
            list: dataObj.list,
          };
        }
      }

      // 接口未返回数据，使用模拟数据
      const mockData = generateChartMockData(drillInfo.drillType);
      dataObj.total = mockData.length;
      dataObj.currentPage = page.currentPage;
      dataObj.pageSize = page.pageSize;
      dataObj.list = mockData.slice(
        (page.currentPage - 1) * page.pageSize,
        page.currentPage * page.pageSize,
      );
      return {
        total: dataObj.total,
        list: dataObj.list,
      };
    }

    // 表格字段钻取类型 - 调用对应的表格字段钻取接口
    if (isTableDrill.value) {
      const tableInfo = tableDrillTypeMap[drillInfo.drillType];
      if (tableInfo && tableInfo.api) {
        // 构建请求参数（需要 reportId）
        const params = {
          reportId: drillInfo.reportId || drillInfo.drillValue || '',
          pageNo: page.currentPage,
          pageSize: page.pageSize,
        };

        console.log('表格字段钻取请求参数:', params);

        const response = await tableInfo.api(params);
        const data = response?.data || response;
        if (data) {
          dataObj.total = data.total || 0;
          dataObj.currentPage = data.pageNum || page.currentPage;
          dataObj.pageSize = data.pageSize || page.pageSize;
          dataObj.list = data.list || [];
          return {
            total: dataObj.total,
            list: dataObj.list,
          };
        }
      }

      // 接口未返回数据，使用模拟数据
      const mockData = generateTableDrillMockData(drillInfo.drillType);
      dataObj.total = mockData.length;
      dataObj.currentPage = page.currentPage;
      dataObj.pageSize = page.pageSize;
      dataObj.list = mockData.slice(
        (page.currentPage - 1) * page.pageSize,
        page.currentPage * page.pageSize,
      );
      return {
        total: dataObj.total,
        list: dataObj.list,
      };
    }

    // 默认 - 使用原有模拟数据
    await new Promise((resolve) => setTimeout(resolve, 200));
    const mockData = generateMockData();
    dataObj.total = mockData.length;
    dataObj.currentPage = page.currentPage;
    dataObj.pageSize = page.pageSize;
    dataObj.list = mockData.slice(
      (page.currentPage - 1) * page.pageSize,
      page.currentPage * page.pageSize,
    );
    return {
      total: dataObj.total,
      list: dataObj.list,
    };
  } catch (error) {
    console.error('获取钻取数据失败:', error);
    ElMessage.error('获取钻取数据失败');
    return {
      total: 0,
      list: [],
    };
  }
};

// 打开弹窗
const open = async (info) => {
  if (info) {
    drillInfo.drillType = info.drillType || '';
    drillInfo.drillValue = info.drillValue || '';
    drillInfo.drillName = info.drillName || '';
    drillInfo.reportCycle = info.reportCycle || '';
    drillInfo.reportId = info.reportId || '';
    drillInfo.categoryId = info.categoryId || '';
  }

  console.log('打开钻取弹窗:', drillInfo);

  // 设置抽屉标题
  drawerApi.setState({
    title: getDrawerTitle(),
  });

  await nextTick();

  // 动态更新表格列配置
  const newColumns = getGridColumns();
  gridApi.setGridOptions({ columns: newColumns });

  drawerApi.open();

  // 等待抽屉打开后加载数据
  setTimeout(() => {
    gridApi.query();
  }, 100);
};

// 关闭弹窗
const close = () => {
  drawerApi.close();
  emit('close');
};

// 使用 useVbenDrawer - 通过 class 设置宽度为 75%
const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  mask: false,
  modal: false,
  closeOnClickModal: false,
  closeOnPressEscape: true,
  // 使用 Tailwind CSS 类设置宽度为 75vw
  class: 'w-[75vw]',
  onCancel() {
    close();
  },
});

// 导出方法
defineExpose({
  open,
  close,
});
</script>

<template>
  <Drawer>
    <div class="drill-down-wrapper">
      <!-- 数据表格 -->
      <Grid>
        <template #reportCycle="{ row }">
          <ElTag :type="getReportCycleTagType(row.reportCycle)">
            {{ row.reportCycle }}
          </ElTag>
        </template>
        <template #generateStatus="{ row }">
          <ElTag :type="getGenerateStatusTagType(row.generateStatus)">
            {{ row.generateStatus }}
          </ElTag>
        </template>
        <!-- 卡片钻取字典字段插槽 -->
        <template #pointActivityType="{ row }">
          <ElTag :type="getPointActivityTypeTagType(row.type)">
            {{ getPointActivityTypeLabel(row.type) }}
          </ElTag>
        </template>
        <template #pointActivityStatus="{ row }">
          <ElTag :type="getPointActivityStatusTagType(row.status)">
            {{ getPointActivityStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #cardConfigType="{ row }">
          <ElTag :type="getCardConfigTypeTagType(row.type || row.cardType)">
            {{ getCardConfigTypeLabel(row.type || row.cardType) }}
          </ElTag>
        </template>
        <template #cardConfigStatus="{ row }">
          <ElTag :type="getCardConfigStatusTagType(row.status)">
            {{ getCardConfigStatusLabel(row.status) }}
          </ElTag>
        </template>
        <!-- 图表钻取字典字段插槽 -->
        <template #ruleConfigType="{ row }">
          <ElTag :type="getRuleConfigTypeTagType(row.ruleType)">
            {{ getRuleConfigTypeLabel(row.ruleType) }}
          </ElTag>
        </template>
        <template #activityConfigType="{ row }">
          <ElTag :type="getActivityConfigTypeTagType(row.configType)">
            {{ getActivityConfigTypeLabel(row.configType) }}
          </ElTag>
        </template>
        <template #packageConfigType="{ row }">
          <ElTag :type="getPackageConfigTypeTagType(row.packageType)">
            {{ getPackageConfigTypeLabel(row.packageType) }}
          </ElTag>
        </template>
        <template #commonStatus="{ row }">
          <ElTag :type="getCommonStatusTagType(row.status)">
            {{ getCommonStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #status="{ row }">
          <ElTag :type="getPointLotteryStatusTagType(row.status)">
            {{ getPointLotteryStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #prizeType="{ row }">
          <ElTag :type="getPrizeMgmtTypeTagType(row.prizeType)">
            {{ getPrizeMgmtTypeLabel(row.prizeType) }}
          </ElTag>
        </template>
        <!-- 图表钻取-奖品类型（柱状图prizeType）使用 chartPrizeType 避免同名冲突 -->
        <template #chartPrizeType="{ row }">
          <ElTag :type="getPrizeMgmtTypeTagType(row.type)">
            {{ getPrizeMgmtTypeLabel(row.type) }}
          </ElTag>
        </template>
        <template #prizeMgmtStatus="{ row }">
          <ElTag :type="getPrizeMgmtStatusTagType(row.status)">
            {{ getPrizeMgmtStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #couponType="{ row }">
          <ElTag :type="getCouponMgmtTypeTagType(row.type || row.couponType)">
            {{ getCouponMgmtTypeLabel(row.type || row.couponType) }}
          </ElTag>
        </template>
        <template #couponStatus="{ row }">
          <ElTag :type="getCouponMgmtStatusTagType(row.status)">
            {{ getCouponMgmtStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #cardOrderPayStatus="{ row }">
          <ElTag :type="getCardOrderPayStatusTagType(row.payStatus)">
            {{ getCardOrderPayStatusLabel(row.payStatus) }}
          </ElTag>
        </template>
        <template #exchangeOrderPayStatus="{ row }">
          <ElTag :type="getExchangeOrderPayStatusTagType(row.payStatus)">
            {{ getExchangeOrderPayStatusLabel(row.payStatus) }}
          </ElTag>
        </template>
        <template #stockControlStatus="{ row }">
          <ElTag :type="getStockControlStatusTagType(row.status)">
            {{ getStockControlStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #stockControlWarnStatus="{ row }">
          <ElTag :type="getStockControlWarnStatusTagType(row.warnStatus)">
            {{ getStockControlWarnStatusLabel(row.warnStatus) }}
          </ElTag>
        </template>
        <template #lotteryStatus="{ row }">
          <ElTag :type="getLotteryStatusTagType(row.status)">
            {{ getLotteryStatusLabel(row.status) }}
          </ElTag>
        </template>
        <template #stockWarnStatus="{ row }">
          <ElTag :type="getStockWarnStatusTagType(row.warnStatus)">
            {{ getStockWarnStatusLabel(row.warnStatus) }}
          </ElTag>
        </template>
        <!-- 时间字段格式化插槽 -->
        <template #startTime="{ row }">
          {{
            row.startTime
              ? formatDate(
                  new Date(Number(row.startTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #endTime="{ row }">
          {{
            row.endTime
              ? formatDate(
                  new Date(Number(row.endTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #joinTime="{ row }">
          {{
            row.joinTime
              ? formatDate(
                  new Date(Number(row.joinTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #lotteryTime="{ row }">
          {{
            row.lotteryTime
              ? formatDate(
                  new Date(Number(row.lotteryTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #sendTime="{ row }">
          {{
            row.sendTime
              ? formatDate(
                  new Date(Number(row.sendTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #verifyTime="{ row }">
          {{
            row.verifyTime
              ? formatDate(
                  new Date(Number(row.verifyTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #receiveTime="{ row }">
          {{
            row.receiveTime
              ? formatDate(
                  new Date(Number(row.receiveTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #syncTime="{ row }">
          {{
            row.syncTime
              ? formatDate(
                  new Date(Number(row.syncTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #payTime="{ row }">
          {{
            row.payTime
              ? formatDate(
                  new Date(Number(row.payTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #exchangeTime="{ row }">
          {{
            row.exchangeTime
              ? formatDate(
                  new Date(Number(row.exchangeTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
        <template #createTime="{ row }">
          {{
            row.createTime
              ? formatDate(
                  new Date(Number(row.createTime)),
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '-'
          }}
        </template>
      </Grid>
    </div>
  </Drawer>
</template>

<style scoped>
.drill-down-wrapper {
  width: 100%;
}
</style>
