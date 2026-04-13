<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import { Location } from '@element-plus/icons-vue';

// 定义组件接收的属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// 初始化抽屉实例
const [LeakageRangeDrawer, leakageRangeDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() {
    leakageRangeDrawerApi.close();
    emit('close');
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    console.log('抽屉状态变化:', isOpen);
    if (isOpen) {
      // 当抽屉打开时初始化地图
      console.log('抽屉打开，准备初始化地图');
      setTimeout(() => {
        console.log('执行地图初始化');
        initMap();
      }, 300); // 增加延迟时间，确保抽屉完全打开，容器渲染完成
    }
  }
});

// 表单数据
const formData = reactive({
  pipeArea: '',
  leakageRange: '',
  leakageLevel: '疑似泄漏',
  description: ''
});

// 管网分区选项
const pipeAreaOptions = [
  { label: '福州市鼓楼区供水管网分区', value: '福州市鼓楼区供水管网分区' },
  { label: '厦门市思明区供水管网分区', value: '厦门市思明区供水管网分区' },
  { label: '泉州市丰泽区供水管网分区', value: '泉州市丰泽区供水管网分区' },
  { label: '漳州市芗城区供水管网分区', value: '漳州市芗城区供水管网分区' },
  { label: '莆田市城厢区供水管网分区', value: '莆田市城厢区供水管网分区' },
  { label: '宁德市蕉城区供水管网分区', value: '宁德市蕉城区供水管网分区' },
  { label: '龙岩市新罗区供水管网分区', value: '龙岩市新罗区供水管网分区' },
  { label: '三明市梅列区供水管网分区', value: '三明市梅列区供水管网分区' },
  { label: '南平市延平区供水管网分区', value: '南平市延平区供水管网分区' },
  { label: '平潭综合实验区供水管网分区', value: '平潭综合实验区供水管网分区' }
];

// 地图相关变量
const mapInstance = ref(null);
const marker = ref(null);
const infoWindow = ref(null);
const mapInitialized = ref(false);
const mapContainer = ref(null);
const mapLoading = ref(true);

// 地图点击位置
const mapClickPosition = ref(null);

// 地图控件
const control = ref(null);
const scale = ref(null);

// 初始化腾讯地图
const initMap = () => {
  console.log('开始初始化地图');
  // 确保加载状态为true
  mapLoading.value = true;
  console.log('mapLoading初始值设置为:', mapLoading.value);
  
  if (mapInitialized.value) {
    console.log('地图已经初始化');
    mapLoading.value = false;
    console.log('mapLoading值更新为:', mapLoading.value);
    return;
  }
  
  // 检查是否已经加载了腾讯地图API
  if (window.TMap) {
    console.log('腾讯地图API已加载，直接初始化');
    mapCallback();
    return;
  }
  
  const callbackName = 'initTencentMap';
  const script = document.createElement('script');
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=QTQBZ-F3RWW-JJJRV-YNPA5-ZIKDK-3SBNO&callback=${callbackName}`;
  script.async = true;
  window[callbackName] = () => {
    console.log('腾讯地图API加载完成，开始初始化地图');
    mapCallback();
    delete window[callbackName];
  };
  document.head.appendChild(script);
  console.log('已添加腾讯地图API脚本');
  
  // 设置超时，确保即使API加载失败也能更新状态
  setTimeout(() => {
    if (mapLoading.value && !mapInitialized.value) {
      console.log('API加载超时，强制更新地图加载状态');
      mapLoading.value = false;
      ElMessage.warning('地图加载超时，请刷新页面重试');
    }
  }, 10000);
};

// 地图初始化回调
const mapCallback = () => {
  console.log('进入地图初始化回调');
  
  // 确保在所有情况下都能更新加载状态
  const updateLoadingStatus = (status) => {
    mapLoading.value = status;
    console.log('mapLoading值更新为:', mapLoading.value);
  };
  
  if (!mapContainer.value) {
    console.error('地图容器不存在');
    ElMessage.error('地图容器不存在，无法初始化地图');
    updateLoadingStatus(false);
    return;
  }
  
  if (!window.TMap) {
    console.error('TMap API 未加载');
    ElMessage.error('TMap API 加载失败，无法初始化地图');
    updateLoadingStatus(false);
    return;
  }
  
  try {
    console.log('开始创建地图实例');
    // 创建地图实例
    mapInstance.value = new window.TMap.Map(mapContainer.value, {
      center: new window.TMap.LatLng(25.0438, 118.7614), // 福州市中心
      zoom: 13,
      baseMap: { type: 'vector' }
    });
    
    console.log('地图实例创建成功');
    
    // 创建信息窗
    infoWindow.value = new window.TMap.InfoWindow({
      map: mapInstance.value,
      position: new window.TMap.LatLng(0, 0),
      content: '',
      offset: { x: 0, y: -30 },
      visible: false
    });
    
    console.log('信息窗创建成功');
    
    // 绑定地图点击事件
    console.log('开始绑定地图点击事件');
    mapInstance.value.on('click', handleMapClick);
    console.log('地图点击事件绑定成功');
    
    // 绑定地图加载完成事件
    mapInstance.value.on('loaded', () => {
      console.log('地图加载完成事件触发');
      updateLoadingStatus(false);
    });
    
    // 同时设置一个超时，确保即使加载事件未触发也能更新状态
    setTimeout(() => {
      if (mapLoading.value) {
        console.log('超时，强制更新地图加载状态');
        updateLoadingStatus(false);
      }
    }, 3000); // 缩短超时时间
    
    mapInitialized.value = true;
    console.log('地图初始化完成');
    
    // 立即更新加载状态，因为地图实例已经创建成功
    updateLoadingStatus(false);
  } catch (error) {
    ElMessage.error('地图初始化失败: ' + error.message);
    console.error('地图初始化错误:', error);
    updateLoadingStatus(false);
  }
};

// 处理地图点击事件
const handleMapClick = (event) => {
  console.log('地图点击事件触发:', event);
  if (!window.TMap) {
    ElMessage.error('TMap API 未加载，无法创建标记');
    return;
  }
  
  try {
    const lat = event.latLng.lat;
    const lng = event.latLng.lng;
    const position = `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    
    // 更新表单数据
    formData.leakageRange = position;
    mapClickPosition.value = position;
    
    // 移除旧标记
    if (marker.value) {
      marker.value.destroy();
    }
    
    // 创建新标记（不使用外部图标，避免加载失败）
    marker.value = new window.TMap.MultiMarker({
      map: mapInstance.value,
      styles: {
        default: new window.TMap.MarkerStyle({
          width: 30,
          height: 30,
          anchor: { x: 15, y: 30 },
          color: '#f56c6c'
        })
      },
      geometries: [{
        id: 'leakage-marker',
        styleId: 'default',
        position: new window.TMap.LatLng(lat, lng)
      }]
    });
    
    // 显示信息窗
    infoWindow.value.setContent(`<div style="padding: 10px;">泄漏位置: ${position}</div>`);
    infoWindow.value.setPosition(new window.TMap.LatLng(lat, lng));
    infoWindow.value.open();
    
    // 显示成功消息
    ElMessage.success({
      message: `已标注泄漏位置: ${position}`,
      duration: 3000
    });
  } catch (error) {
    ElMessage.error('标注泄漏位置失败: ' + error.message);
    console.error('地图点击事件错误:', error);
  }
};

// 组件挂载时不需要初始化地图，改为在抽屉打开时初始化
// onMounted(() => {
//   initMap();
// });

// 组件卸载时清理地图资源
onUnmounted(() => {
  if (marker.value) {
    marker.value.destroy();
  }
  if (infoWindow.value) {
    infoWindow.value.destroy();
  }
  if (control.value) {
    control.value.destroy();
  }
  if (scale.value) {
    scale.value.destroy();
  }
  if (mapInstance.value) {
    mapInstance.value.destroy();
  }
  mapInitialized.value = false;
  mapLoading.value = true;
});

// 保存标注
const handleSave = () => {
  if (!formData.pipeArea) {
    ElMessage.warning('请选择管网分区');
    return;
  }
  if (!formData.leakageRange) {
    ElMessage.warning('请标注泄漏范围');
    return;
  }
  if (!formData.leakageLevel) {
    ElMessage.warning('请选择泄漏等级');
    return;
  }
  
  // 模拟保存操作
  ElMessage.success({
    message: `泄漏范围标注成功！\n管网分区: ${formData.pipeArea}\n泄漏等级: ${formData.leakageLevel}\n泄漏位置: ${formData.leakageRange}\n已关联至预警工单`,
    duration: 4000,
    type: 'success'
  });
  
  // 重置表单
  formData.pipeArea = '';
  formData.leakageRange = '';
  formData.leakageLevel = '疑似泄漏';
  formData.description = '';
  mapClickPosition.value = null;
  
  leakageRangeDrawerApi.close();
  emit('close');
};

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => leakageRangeDrawerApi.open(),
  close: () => leakageRangeDrawerApi.close(),
});
</script>

<template>
  <LeakageRangeDrawer title="标注泄漏范围">
    <div class="leakage-range-container">
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        <div class="form-item">
          <label class="form-label">管网分区 <span class="required">*</span></label>
          <el-select v-model="formData.pipeArea" class="w-full" placeholder="请选择管网分区">
            <el-option
              v-for="option in pipeAreaOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        <div class="form-item">
          <label class="form-label">泄漏范围 <span class="required">*</span></label>
          <el-input v-model="formData.leakageRange" class="w-full" placeholder="请在地图上点击标注" />
        </div>
        <div class="form-item">
          <label class="form-label">泄漏等级 <span class="required">*</span></label>
          <el-select v-model="formData.leakageLevel" class="w-full" placeholder="请选择泄漏等级">
            <el-option label="疑似泄漏" value="疑似泄漏" />
            <el-option label="确认泄漏" value="确认泄漏" />
            <el-option label="严重泄漏" value="严重泄漏" />
          </el-select>
        </div>
        <div class="form-item">
          <label class="form-label">备注说明</label>
          <el-input
            v-model="formData.description"
            class="w-full"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息，如泄漏特征、发现时间等"
          />
        </div>
      </div>
      
      <div class="map-section">
        <h3 class="section-title">地图标注</h3>
        <div class="map-container">
          <!-- 腾讯地图容器 -->
          <div ref="mapContainer" class="tencent-map" style="width: 100%; height: 100%;"></div>
          
          <!-- 地图加载状态 -->
          <div v-if="mapLoading" class="map-loading-overlay">
            <el-icon class="loading-icon"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#409eff"><path d="M512 0a512 512 0 1 1 0 1024 512A512 512 0 0 1 512 0zm0 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768z" fill="currentColor" fill-opacity=".2"></path><path d="M512 128a384 384 0 0 1 275.808 659.2l-45.248 45.248A320 320 0 0 0 512 224h-32v192h32a192 192 0 0 1 0 384h-64a192 192 0 0 1 0-384h32V224a256 256 0 0 0-256 256v64a128 128 0 1 0 256 0v-64a128 128 0 0 1 128-128h32a64 64 0 0 0-64-64h-32a320 320 0 0 0-230.592 99.456l-45.248-45.248A384 384 0 0 1 512 128z" fill="currentColor"></path></svg></el-icon>
            <p>地图加载中...</p>
          </div>
          
          <!-- 未标注提示 -->
          <div v-else-if="!mapClickPosition" class="map-placeholder-overlay">
            <el-icon class="map-icon"><Location /></el-icon>
            <p>点击地图标注泄漏位置</p>
          </div>
          
          <!-- 已标注信息 -->
          <div v-else class="map-info-overlay">
            <p class="info-text">已标注泄漏位置: {{ mapClickPosition }}</p>
            <p class="info-hint">点击地图可重新标注位置</p>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <el-button @click="leakageRangeDrawerApi.close()">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </LeakageRangeDrawer>
</template>

<style scoped lang="scss">
.leakage-range-container {
  padding: 20px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .form-section {
    margin-bottom: 25px;
    
    .form-item {
      margin-bottom: 15px;
      
      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
        margin-bottom: 8px;
        
        .required {
          color: #f56c6c;
        }
      }
    }
  }
  
  .map-section {
    margin-bottom: 25px;
    
    .map-container {
      width: 100%;
      height: 300px;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      border: 1px solid #e4e7ed;
      
      .tencent-map {
        width: 100%;
        height: 100%;
      }
      
      .map-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 20;
        pointer-events: none;
        
        .loading-icon {
          font-size: 48px;
          color: #409eff;
          margin-bottom: 15px;
          animation: spin 1s linear infinite;
        }
        
        p {
          font-size: 14px;
          color: #606266;
          background-color: white;
          padding: 8px 16px;
          border-radius: 4px;
        }
      }
      
      .map-placeholder-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 10;
        pointer-events: none; /* 让点击事件穿透到地图 */
        
        .map-icon {
          font-size: 48px;
          color: #409eff;
          margin-bottom: 15px;
        }
        
        p {
          font-size: 14px;
          color: #606266;
          background-color: white;
          padding: 8px 16px;
          border-radius: 4px;
        }
      }
      
      .map-info-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        border-top: 1px solid #e4e7ed;
        z-index: 10;
        pointer-events: none; /* 让点击事件穿透到地图 */
        
        .info-text {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
          margin-bottom: 4px;
          background-color: white;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .info-hint {
          font-size: 12px;
          color: #909399;
          background-color: white;
          padding: 4px 8px;
          border-radius: 4px;
        }
      }
    }
  }
  
  .action-section {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
}

// 旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>