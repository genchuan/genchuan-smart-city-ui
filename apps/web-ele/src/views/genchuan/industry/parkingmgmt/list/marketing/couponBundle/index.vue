<script setup>
import { computed, ref } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { dataList, releaseDataList, useDataList } from './table/data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

// 控制统计组件显示/隐藏的状态
const showStats = ref(false);

// 切换统计组件显示/隐藏状态
const toggleStats = () => {
  showStats.value = !showStats.value;
};

const tabArray = ref([
  {
    label: '券包管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '定向发放管理',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
  {
    label: '使用记录',
    components: Table,
    showSecondary: true,
    secondShow: false,
  },
]);
const activeName = ref('券包管理');
const secondShow = ref(false);

// 当前激活的标签页
const currentTab = ref('券包管理');

// 监听标签页切换，更新当前标签页
const tabChange = (tabName) => {
  activeName.value = tabName;
  currentTab.value = tabName;
};

// 获取当前标签页的统计数据
const statsData = computed(() => {
  switch (currentTab.value) {
    case '使用记录': {
      return getUsageRecordStats();
    }
    case '券包管理': {
      return getCouponBundleStats();
    }
    case '定向发放管理': {
      return getTargetedDistributionStats();
    }
    // No default
  }
  return {};
});

// 券包管理统计数据
function getCouponBundleStats() {
  const data = dataList();
  const totalCount = data.length;
  const onlineCount = data.filter((item) => item.status === '上架').length;
  const totalSold = data.reduce((sum, item) => sum + item.soldCount, 0);

  // 适用范围占比
  const applyScopeMap = {};
  data.forEach((item) => {
    applyScopeMap[item.applyScope] = (applyScopeMap[item.applyScope] || 0) + 1;
  });
  const applyScopeData = Object.entries(applyScopeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 优惠券类型占比
  const couponTypeMap = {};
  data.forEach((item) => {
    const coupons = item.couponName.split(',');
    coupons.forEach((coupon) => {
      const type = coupon.trim().split(' ')[0];
      couponTypeMap[type] = (couponTypeMap[type] || 0) + 1;
    });
  });
  const couponTypeData = Object.entries(couponTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 各券包销量排名
  const salesRankData = data
    .map((item) => ({
      name: item.packageName,
      value: item.soldCount,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    cards: [
      { title: '券包总数', value: totalCount },
      { title: '上架券包数', value: onlineCount },
      { title: '已售总数', value: totalSold },
    ],
    charts: [
      {
        type: 'pie',
        title: '适用范围占比',
        data: applyScopeData,
      },
      {
        type: 'pie',
        title: '优惠券类型占比',
        data: couponTypeData,
      },
      {
        type: 'bar',
        title: '各券包销量排名',
        xAxis: salesRankData.map((item) => item.name),
        series: salesRankData.map((item) => item.value),
      },
    ],
  };
}

// 定向发放管理统计数据
function getTargetedDistributionStats() {
  const data = releaseDataList();
  const totalReleaseCount = data.reduce(
    (sum, item) => sum + item.releaseCount,
    0,
  );
  const successReleaseCount = data.reduce(
    (sum, item) => sum + item.receiveCount,
    0,
  );
  const avgReceiveRate =
    data.length > 0
      ? `${(
          data.reduce(
            (sum, item) => sum + Number.parseInt(item.receiveRate),
            0,
          ) / data.length
        ).toFixed(1)}%`
      : '0%';

  // 定向用户标签占比
  const userTagMap = {};
  data.forEach((item) => {
    userTagMap[item.targetedUserTag] =
      (userTagMap[item.targetedUserTag] || 0) + 1;
  });
  const userTagData = Object.entries(userTagMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 发放方式占比
  const releaseWayMap = {};
  data.forEach((item) => {
    releaseWayMap[item.releaseWay] = (releaseWayMap[item.releaseWay] || 0) + 1;
  });
  const releaseWayData = Object.entries(releaseWayMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 定向发放数量趋势
  const releaseTrendData = data
    .map((item) => ({
      name: item.releaseTime.slice(0, 10),
      value: item.releaseCount,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    cards: [
      { title: '总发放次数', value: totalReleaseCount },
      { title: '成功发放次数', value: successReleaseCount },
      { title: '平均领取率', value: avgReceiveRate },
    ],
    charts: [
      {
        type: 'pie',
        title: '定向用户标签占比',
        data: userTagData,
      },
      {
        type: 'pie',
        title: '发放方式占比',
        data: releaseWayData,
      },
      {
        type: 'bar',
        title: '定向发放数量趋势',
        xAxis: releaseTrendData.map((item) => item.name),
        series: releaseTrendData.map((item) => item.value),
      },
    ],
  };
}

// 使用记录统计数据
function getUsageRecordStats() {
  const data = useDataList();
  const totalUseCount = data.length;
  const validUseCount = data.filter(
    (item) => item.useStatus === '已使用',
  ).length;
  const avgDeductAmount =
    data.length > 0
      ? (
          data.reduce((sum, item) => sum + item.deductAmount, 0) / data.length
        ).toFixed(2)
      : '0.00';

  // 使用状态占比
  const useStatusMap = {};
  data.forEach((item) => {
    useStatusMap[item.useStatus] = (useStatusMap[item.useStatus] || 0) + 1;
  });
  const useStatusData = Object.entries(useStatusMap).map(([name, value]) => ({
    name,
    value,
  }));

  // 券包类型占比
  const packageTypeMap = {};
  data.forEach((item) => {
    packageTypeMap[item.packageName] =
      (packageTypeMap[item.packageName] || 0) + 1;
  });
  const packageTypeData = Object.entries(packageTypeMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 各券包使用次数排行
  const usageRankData = Object.entries(packageTypeMap)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    cards: [
      { title: '总使用次数', value: totalUseCount },
      { title: '有效使用次数', value: validUseCount },
      { title: '平均抵扣金额', value: avgDeductAmount },
    ],
    charts: [
      {
        type: 'pie',
        title: '使用状态占比',
        data: useStatusData,
      },
      {
        type: 'pie',
        title: '券包类型占比',
        data: packageTypeData,
      },
      {
        type: 'bar',
        title: '各券包使用次数排行',
        xAxis: usageRankData.map((item) => item.name),
        series: usageRankData.map((item) => item.value),
      },
    ],
  };
}
</script>
<template>
  <div class="common-index">
    <!-- 统计可视化组件，根据showStats状态显示/隐藏 -->
    <StatsVisualization v-if="showStats" :data="statsData" />
    <div class="icon-change">
      <el-icon
        class="tabel-tab-icon"
        v-if="secondShow"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        class="tabel-tab-icon"
        v-if="!secondShow"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          :second-show="item.secondShow"
          :active-tab="item.label"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
          :key="item.label"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
