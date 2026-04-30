<script setup>
import { nextTick, reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

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
});

// 数据对象
const dataObj = reactive({
  total: 0,
  list: [],
  pageSize: 10,
  currentPage: 1,
});

// 获取弹窗标题
const getDrawerTitle = () => {
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

// 获取表格列配置
const gridColumns = useGridColumns();

// 初始化表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns,
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
    pagerConfig: {
      total: dataObj.total,
      currentPage: dataObj.currentPage,
      pageSize: dataObj.pageSize,
    },
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
    },
    showOverflow: true,
    height: 'auto',
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
      winningRate: (Math.random() * 20 + 5).toFixed(2) + '%',
      couponSendCount: Math.floor(Math.random() * 300) + 30,
      couponVerifyRate: (Math.random() * 40 + 20).toFixed(2) + '%',
      cardOrderCount: Math.floor(Math.random() * 100) + 10,
      revenue: (Math.random() * 10000 + 1000).toFixed(2),
      exchangeCount: Math.floor(Math.random() * 200) + 20,
      totalStock: Math.floor(Math.random() * 5000) + 500,
      warnStockCount: Math.floor(Math.random() * 50) + 5,
      generateStatus: ['已生成', '生成中', '生成失败'][Math.floor(Math.random() * 3)],
      generateTime: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      operator: ['张三', '李四', '王五', '赵六', '钱七'][Math.floor(Math.random() * 5)],
      filterRule: `统计时段: 2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
      creator: 'system',
      createTime: Date.now() - Math.floor(Math.random() * 86400000 * 30),
      updateTime: Date.now() - Math.floor(Math.random() * 86400000 * 7),
    });
  }

  return mockList;
};

// 获取钻取数据
const getDrillDownData = async (pageObj) => {
  const page = pageObj.page;

  try {
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
  }

  console.log('打开钻取弹窗:', drillInfo);

  // 设置抽屉标题
  drawerApi.setState({
    title: getDrawerTitle(),
  });

  drawerApi.open();

  // 等待抽屉打开后加载数据
  nextTick(() => {
    setTimeout(() => {
      gridApi.query();
    }, 100);
  });
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
      <!-- 筛选条件展示 -->
      <div class="filter-section">
        <div class="filter-item">
          <span class="filter-label">钻取类型：</span>
          <ElTag type="primary" size="default">{{ getTypeDisplayText() }}</ElTag>
        </div>
        <div class="filter-item">
          <span class="filter-label">钻取值：</span>
          <ElTag type="success" size="default">{{ getValueDisplayText() }}</ElTag>
        </div>
        <div class="filter-item">
          <span class="filter-label">报表周期：</span>
          <ElTag :type="getReportCycleTagType(drillInfo.reportCycle || '日报')" size="default">
            {{ drillInfo.reportCycle || '日报' }}
          </ElTag>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
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
        </Grid>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.drill-down-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.table-section {
  flex: 1;
  overflow: hidden;
  padding: 8px;
}

:deep(.vxe-grid) {
  height: 100%;
}

:deep(.vxe-table) {
  height: calc(100% - 44px) !important;
}

:deep(.vxe-body--row) {
  height: 40px;
}
</style>
