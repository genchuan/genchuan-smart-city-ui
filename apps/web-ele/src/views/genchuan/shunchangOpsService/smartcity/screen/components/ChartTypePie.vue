<template>
  <div class="chart-type-pie" :style="{ height: height }">
    <div
      class="chart-type-pie-left"
      :id="idName"
      :style="{ height: picHeight, width: picWidth }"
    ></div>
    <ul class="chart-type-pie-right" v-if="rightData.length > 0">
      <li v-for="(item, key) in rightData" :key="key">
        <span class="c1"></span>
        <div class="c2">
          <span>{{ item.title }}</span>
          <label
            ><i>{{ item.num }}</i> {{ item.unit }}</label
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  height: {
    type: String,
    default: 'calc(100% - 35px)',
  },
  picHeight: {
    type: String,
    default: '100%',
  },
  picWidth: {
    type: String,
    default: '300px',
  },
  idName: {
    type: String,
    default: 'picLeftId',
  },
  rightData: {
    type: Array,
    default: () => {
      // { title: '技术咨询项目数', num: '40', unit: '个' }
      return [];
    },
  },
  // 设置圆形块颜色
  color: {
    type: Array,
    default: () => {
      // ['#0fc779', '#ffad14']
      return [
        '#0fc779',
        '#ffad14',
        '#14a1ff',
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
      ];
    },
  },
  // 设置是圆形还是中间镂空  array ['40%', '70%']  中间镂空   '80%'  这个就是圆形
  radius: {
    type: [Array, String],
    default: '80%',
  },
  // 是否展示成南丁格尔图
  roseType: {
    type: Boolean,
    default: false,
  },
  // 圆形结果数据
  resData: {
    type: Array,
    default: () => {
      // { value: 20, name: '运营型项目数' },
      return [];
    },
  },
});

const pieGraph = () => {
  let chartDom = document.getElementById(props.idName);
  let myChart = echarts.init(chartDom);
  let option;
  option = {
    //颜色
    color: props.color,
    // 提示框组件
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {d}%',
    },

    //-------------------
    //快捷小图显示在哪
    legend: {
      show: false,
      // top: '0'
    },
    toolbox: {
      show: false, //是否显示工具栏组件
    },
    series: [
      {
        type: 'pie',
        radius: props.radius,
        center: ['50%', '50%'],
        // hoverAnimation: true, //鼠标移入变大
        emphasis: {
          scale: true, // 使用 emphasis.scale 替代 hoverAnimation
        },
        roseType: props.roseType,
        labelLine: {
          //图形外文字线
          // normal: {
          length: 15,
          length2: 15,
          // }
        },
        label: {
          // normal: {
          show: false,
          // formatter: '{c|{c}%}  \n  {b|{b}}',       //图形外文字上下显示
          formatter: '{b|{b}} {c|{c}%}', //图形外文字上下显示
          borderWidth: 20,
          borderRadius: 4,
          padding: [0, -20], //文字和图的边距
          rich: {
            a: {
              color: '#c2c2c2',
              fontSize: 16,
              lineHeight: 30,
            },
            b: {
              //name 文字样式
              fontSize: 18,
              lineHeight: 30,
              color: '#c2c2c2',
            },
            c: {
              //value 文字样式
              fontSize: 18,
              lineHeight: 30,
              color: '#fff',
              align: 'center',
            },
            // }
          },
        },
        itemStyle: {
          borderRadius: 3,
          borderColor: '#010032',
          borderWidth: 3,
        },
        data: props.resData,
      },
    ],
  };

  option && myChart.setOption(option);
};

onMounted(() => {
  pieGraph();
});
</script>

<style lang="scss" scoped>
.chart-type-pie {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;

  .chart-type-pie-right {
    flex: 1;

    li {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-start;
      padding: 5px 0;
      background: #001118;

      .c1 {
        width: 8px;
        height: 35px;
        margin-right: 15px;
        background-image: linear-gradient(#03a0e9, #0f5fbf);
        border-radius: 12px;
      }

      .c2 {
        span {
          display: block;
          font-size: 14px;
          color: #fff;
        }

        label {
          font-size: 16px;
          color: #0eafff;

          i {
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
    }

    li:nth-of-type(2) {
      margin: 8px 0;
    }
  }
}
</style>
