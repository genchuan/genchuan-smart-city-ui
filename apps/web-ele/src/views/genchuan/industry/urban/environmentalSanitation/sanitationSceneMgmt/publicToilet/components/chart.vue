<script setup>
import {reactive, onMounted, ref, computed} from 'vue';
import {
  getPublicToiletChartAll
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/publicToilet/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';

const state = reactive({
  loading: false,
  cardList: [],        // 卡片数据
  pieData: {           // 饼图数据
    status: [],
    area: [],
  },
  barData: {           // 柱状图数据
    x: [],
    series: [],
  },
});

// 圆环图选项（基于原始数据生成）
const pieOptions = computed(() => [
  {
    title: '运营状态占比',
    data: state.pieData.status,
  },
  {
    title: '区域分布占比',
    data: state.pieData.area,
  },
]);

// 当前选中的圆环图索引和数据
const activePieIndex = ref(0);
const currentPieData = computed(() => pieOptions.value[activePieIndex.value] || pieOptions.value[0]);

// 切换圆环图
const handlePieChange = (index) => {
  activePieIndex.value = index;
};

// 通用数值转换（处理字符串或数字）
const toNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return Number(val) || 0;
};

// 获取图表数据
const fetchChartData = async () => {
  state.loading = true;
  try {
    const res = await getPublicToiletChartAll();
    console.log('接口原始响应:', res);

    // 判断是否有 card 字段（这是必要字段）
    if (res && typeof res === 'object' && res.card) {
      const {card, pie, cleaningQualifiedRateByArea} = res;

      // 卡片数据
      state.cardList = [
        {title: '总公厕数', value: toNumber(card?.totalToiletCount), color: '#409EFF'},
        {title: '正常运营数', value: toNumber(card?.normalOperationCount), color: '#67C23A'},
        {title: '保洁达标数', value: toNumber(card?.cleaningQualifiedCount), color: '#E6A23C'},
        {title: '无投诉数', value: toNumber(card?.noComplaintCount), color: '#F56C6C'},
      ];

      // 饼图数据
      state.pieData.status = Array.isArray(pie?.operationStatus) ? pie.operationStatus : [];
      state.pieData.area = Array.isArray(pie?.areaDistribution) ? pie.areaDistribution : [];

      // 柱状图数据
      const areaRates = Array.isArray(cleaningQualifiedRateByArea) ? cleaningQualifiedRateByArea : [];
      state.barData.x = areaRates.map(item => item.name || '');
      state.barData.series = areaRates.map(item => toNumber(item.value));
    } else {
      console.error('接口返回数据格式异常或缺少 card 字段', res);
    }
  } catch (error) {
    console.error('请求图表数据失败:', error);
  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="chart-box" v-loading="state.loading" element-loading-text="加载中...">
    <!-- 卡片区域 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="(item, index) in state.cardList"
        :key="index"
        v-bind="item"
      />
    </div>

    <!-- 圆环图区域（带下拉切换） -->
    <div class="pie-chart-area">
      <div class="pie-select-wrapper">
        <el-select
          v-model="activePieIndex"
          size="small"
          @change="handlePieChange"
        >
          <el-option
            v-for="(opt, idx) in pieOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>
      <Pie
        style="flex: 1 !important;"
        :title-text="currentPieData.title"
        :data="currentPieData.data"
      />
    </div>

    <!-- 区域保洁达标率柱状图 -->
    <Bar
      style="flex: 1.5 !important;"
      title="不同区域保洁达标率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '达标率', data: state.barData.series }]"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

/* 圆环图区域样式 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  height: 100%;
}

.pie-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
