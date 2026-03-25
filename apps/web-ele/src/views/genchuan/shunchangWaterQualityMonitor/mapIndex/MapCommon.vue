<script setup>
import { defineProps, onMounted, ref } from 'vue';

// 组件属性定义：明确类型和默认值，增强稳定性
const props = defineProps({
  idName: {
    type: String,
    default: 'chinaEcharts',
    required: false,
  },
  height: {
    type: String,
    default: 'calc(100% - 40px - 20px)',
    required: false,
  },
  marginTop: {
    type: String,
    default: '10px',
    required: false,
  },
  geometriesArray: {
    type: Array,
    default: () => [],
    required: false, // 标记点数据为必需属性
  },
});

// 信息窗口状态管理：独立控制显示/隐藏和数据存储
const showInfoWindow = ref(false);
const currentInfo = ref({});
const infoWindow = ref(null); // 绑定信息窗口DOM元素
let map = null; // 地图实例
let markerLayer = null; // 标记点图层实例

// 初始化地图：异步加载腾讯地图API
const initMap = () => {
  // 避免重复加载脚本
  if (window.TMap && typeof window.init === 'function') {
    mapCallback();
    return;
  }

  const script = document.createElement('script');
  // 腾讯地图API地址（含密钥，确保密钥有效）
  script.src =
    'https://map.qq.com/api/gljs?v=1.exp&key=6RBBZ-2SECL-C25PX-EHDO4-7KBD3-QAFCJ&callback=init';
  script.async = true;
  // 全局回调函数：地图加载完成后执行
  window.init = mapCallback;
  document.head.append(script);
};

// 地图初始化回调：创建地图、添加标记点
const mapCallback = () => {
  // 1. 创建地图实例（确保容器存在）
  const mapContainer = document.getElementById(props.idName);
  if (!mapContainer) {
    console.error('地图容器不存在，请检查idName是否正确');
    return;
  }

  map = new TMap.Map(mapContainer, {
    center: new TMap.LatLng(26.793_227, 117.810_114), // 顺昌县中心坐标
    zoom: 11, // 初始缩放级别（适配县域范围）
    mapStyleId: 'style1我的自定义样式', // 自定义地图样式（需确保已创建）
    dragEnable: true, // 允许拖拽
    zoomEnable: true, // 允许缩放
  });

  // 2. 处理标记点数据（过滤无效数据）
  const geometriesData = [];
  props.geometriesArray.forEach((item, index) => {
    // 验证经纬度有效性（避免无效标记）
    if (!item.x || !item.y || isNaN(Number(item.x)) || isNaN(Number(item.y))) {
      console.warn(`第${index + 1}个标记点数据无效，跳过`, item);
      return;
    }

    geometriesData.push({
      id: index.toString(), // 唯一标识（用于后续操作）
      styleId: 'myStyle', // 关联标记点样式
      // 腾讯地图LatLng参数：纬度(y)在前，经度(x)在后（核心注意点）
      position: new TMap.LatLng(Number(item.y), Number(item.x)),
      properties: { ...item }, // 存储完整工程信息
    });
  });

  // 3. 创建标记点图层
  markerLayer = new TMap.MultiMarker({
    map,
    // 标记点样式定义（可根据需求调整）
    styles: {
      myStyle: new TMap.MarkerStyle({
        width: 25, // 标记点宽度（像素）
        height: 35, // 标记点高度（像素）
        // 若需显示自定义图标，取消注释并修改路径（建议使用项目内资源）
        // src: new URL('@/assets/img/marker.png', import.meta.url).href,
        anchor: { x: 16, y: 32 }, // 图标焦点位置（对应针尖/底部）
      }),
    },
    geometries: geometriesData, // 标记点数据
  });

  // 4. 绑定标记点点击事件（核心交互）
  markerLayer.on('click', handleMarkerClick);
};

// 标记点点击处理：显示信息窗口并定位
const handleMarkerClick = (evt) => {
  // 验证事件数据有效性
  if (!evt.geometry || !evt.geometry.properties) {
    console.warn('点击事件数据无效', evt);
    return;
  }

  // 1. 存储当前点击的工程信息
  currentInfo.value = evt.geometry.properties;
  // 2. 显示信息窗口
  showInfoWindow.value = true;

  // 3. 计算并设置信息窗口位置（确保在标记点附近）
  const markerPosition = evt.geometry.position;
  const pixel = map.projectToContainer(markerPosition); // 经纬度转容器像素坐标

  // 确保信息窗口DOM已渲染（v-if控制下需等待DOM更新）
  setTimeout(() => {
    if (infoWindow.value) {
      const mapRect = document
        // eslint-disable-next-line unicorn/prefer-query-selector
        .getElementById(props.idName)
        .getBoundingClientRect();
      const infoRect = infoWindow.value.getBoundingClientRect();

      // 计算位置：避免信息窗口超出地图容器
      let left = pixel.x + 20; // 右移20px避开标记点
      let top = pixel.y - 100; // 上移100px显示在标记点上方

      // 右边界校验：超出则左移显示
      if (left + infoRect.width > mapRect.width) {
        left = pixel.x - infoRect.width - 20;
      }
      // 上边界校验：超出则下移显示
      if (top < 0) {
        top = pixel.y + 40;
      }

      // 设置最终位置
      infoWindow.value.style.left = `${left}px`;
      infoWindow.value.style.top = `${top}px`;
    }
  }, 0);
};

// 信息窗口关闭方法：统一控制显示状态
const hideInfoWindow = () => {
  console.log('进入关闭方法');
  showInfoWindow.value = false;
  // 强制Vue更新DOM
  nextTick(() => {
    console.log('信息窗口已关闭');
  });
  // 可选：清空缓存的信息（避免下次打开显示旧数据）
  // currentInfo.value = {};
};

// 组件挂载时初始化地图
onMounted(() => {
  initMap();
});
</script>

<template>
  <div
    :id="idName"
    :style="{ width: '100%', height, marginTop }"
    class="map-common-css"
  >
    <div
      ref="infoWindow"
      class="info-window"
      v-if="showInfoWindow"
      style="z-index: 9999999"
    >
      <div class="info-window-title">{{ currentInfo.name || '工程信息' }}</div>
      <div class="info-window-content">
        <p><span>类型：</span>{{ currentInfo.type || '未填写' }}</p>
        <p><span>乡镇：</span>{{ currentInfo.township || '未填写' }}</p>
        <p><span>村庄：</span>{{ currentInfo.village || '未填写' }}</p>
        <p>
          <span>供水人口：</span>{{ currentInfo.waterSupplyPopulation || 0 }}人
        </p>
      </div>

      <div class="info-window-close" @click.stop="hideInfoWindow">×</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 地图容器基础样式
.map-common-css {
  position: relative; // 为信息窗口绝对定位提供上下文
  z-index: 1; // 确保地图在底层
  overflow: hidden;
  border-radius: 8px;
}

// 信息窗口样式：强调层级和交互体验
.info-window {
  position: absolute;
  z-index: 1000; // 确保在地图和标记点之上
  width: 330px; // 固定宽度（适配内容）
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  pointer-events: auto; // 确保内部元素可点击
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 15%); // 阴影增强层次感

  // 信息窗口标题
  .info-window-title {
    padding-bottom: 8px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    word-break: break-all; // 处理长名称换行
    border-bottom: 1px solid #eee;
  }

  // 信息窗口内容
  .info-window-content {
    p {
      margin: 6px 0;
      color: #666;

      span {
        font-weight: 500;
        color: #333;
      }
    }
  }

  // 关闭按钮
  .info-window-close {
    position: absolute;
    top: 8px;
    right: 10px;
    // 确保按钮在最上层
    z-index: 1002 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 18px;
    color: #999;
    cursor: pointer;
    border-radius: 50%; // 圆形点击区域（提升点击体验）

    //  hover效果：增强交互反馈
    &:hover {
      color: #ff4d4f;
      background-color: #f5f5f5;
      transform: scale(1.1);
      transition: all 0.2s;
    }
  }
}
</style>
