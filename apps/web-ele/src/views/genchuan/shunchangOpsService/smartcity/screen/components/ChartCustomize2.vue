<template>
  <div class="chart-customize2-css">
    <div class="f1">
      <span>{{ paramsData[0].name }}</span>
      <div>
        <i>{{ paramsData[0].num }}</i> {{ paramsData[0].unit }}
      </div>
    </div>
    <div class="f2">
      <div class="g1">
        <div class="h1">{{ paramsData[1].name }}</div>
        <div class="h2">
          <i>{{ paramsData[1].num }}</i> {{ paramsData[1].unit }}
        </div>
      </div>
      <div class="g1">
        <div class="h1">{{ paramsData[2].name }}</div>
        <div class="h2">
          <i>{{ paramsData[2].num }}</i> {{ paramsData[2].unit }}
        </div>
      </div>
    </div>
    <div class="f2 f3">
      <div class="g1">
        <div class="h1">{{ paramsData[3].name }}</div>
        <div class="h2">
          <i>{{ paramsData[3].num }}</i> {{ paramsData[3].unit }}
        </div>
      </div>
      <div class="g1">
        <div class="h1">{{ paramsData[4].name }}</div>
        <div class="h2">
          <i>{{ paramsData[4].num }}</i> {{ paramsData[4].unit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  paramsData: {
    type: Array,
    default: () => [
      { name: '', num: '', unit: '' },
      { name: '', num: '', unit: '' },
      { name: '', num: '', unit: '' },
      { name: '', num: '', unit: '' },
      { name: '', num: '', unit: '' },
    ],
  },
});
</script>

<style lang="scss" scoped>
.chart-customize2-css {
  height: calc(100% - 50px - 35px);
  margin: 25px;
  background: url('../assets/images/dataV-01.jpg') no-repeat;
  background-size: 100% 100%;

  .f1 {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;

    span {
      margin-left: 70px;
      font-size: 16px;
      color: #fff;
    }

    div {
      margin-right: 30px;
      font-size: 14px;
      color: #0eafff;

      i {
        font-size: 26px;
        font-weight: bold;
      }
    }
  }

  .f2 {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 28px 30px 0;

    .g1 {
      .h1 {
        height: auto;
        font-size: 14px;
        color: #fff;
      }

      .h2 {
        height: auto;
        font-size: 14px;
        color: #0eafff;

        i {
          font-size: 26px;
          font-weight: bold;
        }
      }
    }
  }

  .f3 {
    padding-top: 22px;
  }
}
</style>
