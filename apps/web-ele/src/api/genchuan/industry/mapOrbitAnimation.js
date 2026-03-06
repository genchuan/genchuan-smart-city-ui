import { ref, unref, watch } from 'vue';

/**
 * 地图绕点旋转动画组合式函数（适配 TMap）
 * @param {Ref<TMap.Map>} mapInstanceRef - 地图实例的 ref 对象（必须）
 * @param {object} options - 绕点动画配置项
 * @returns {object} 动画控制方法 + 状态
 */
export const mapOrbitAnimation = (mapInstanceRef, options) => {
  // 读取本地存储配置
  const getStoredConfig = () => {
    const stored = localStorage.getItem('parkingMapOrbitConfig');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('读取本地地图配置失败，使用默认值:', error);
      }
    }
    return null;
  };

  // 默认配置
  const defaultConfig = {
    center: { lat: 24.9, lng: 118.69 },
    rotateSpeed: 0.05,
    pitch: 40,
    zoom: 12,
    loop: true,
  };

  // 合并配置：本地存储 > 用户传入 > 默认值
  const storedConfig = getStoredConfig();
  const orbitConfig = ref({
    ...defaultConfig,
    ...(storedConfig || options),
  });

  // 动画状态
  const orbitStatus = ref({
    playing: true,
    currentRotation: 0,
    animationFrameId: null,
    isInited: false,
  });

  // 旋转循环逻辑
  const orbitLoop = () => {
    const map = unref(mapInstanceRef);
    if (!map || !orbitStatus.value.playing) return;

    const { center, rotateSpeed, loop } = orbitConfig.value;
    if (!center || !rotateSpeed) return;

    const orbitCenter = new TMap.LatLng(center.lat, center.lng);

    let newRotation = orbitStatus.value.currentRotation + rotateSpeed;
    if (newRotation >= 360) {
      if (!loop) {
        stopOrbitAnimation();
        return;
      }
      newRotation = 0;
    }

    try {
      map.setCenter(orbitCenter);
      map.setRotation(newRotation);
    } catch (error) {
      console.warn('更新地图旋转状态失败:', error);
      return;
    }

    orbitStatus.value.currentRotation = newRotation;
    orbitStatus.value.animationFrameId = requestAnimationFrame(orbitLoop);
  };

  // 启动动画
  const startOrbitAnimation = () => {
    const map = unref(mapInstanceRef);
    if (!map) {
      console.warn('地图实例未初始化，无法启动环绕动画');
      return;
    }
    if (orbitStatus.value.playing && orbitStatus.value.isInited) {
      console.warn('环绕动画已在播放中，无需重复启动');
      return;
    }

    const { center, pitch, zoom } = orbitConfig.value;
    if (!center) return;

    const orbitCenter = new TMap.LatLng(center.lat, center.lng);

    try {
      map.setZoom(zoom);
      map.setPitch(pitch);
      map.setCenter(orbitCenter);
      map.setRotation(orbitStatus.value.currentRotation || 0);
    } catch (error) {
      console.error('初始化地图视角失败:', error);
      return;
    }

    orbitStatus.value.isInited = true;
    orbitStatus.value.playing = true;
    orbitLoop();
  };

  // 停止动画
  const stopOrbitAnimation = () => {
    orbitStatus.value.playing = false;

    if (orbitStatus.value.animationFrameId) {
      cancelAnimationFrame(orbitStatus.value.animationFrameId);
      orbitStatus.value.animationFrameId = null;
    }
  };

  // 切换播放/暂停
  const toggleOrbitAnimation = () => {
    if (orbitStatus.value.playing) {
      stopOrbitAnimation();
    } else {
      orbitStatus.value.isInited = false;
      startOrbitAnimation();
    }
  };

  // 监听配置变化
  watch(
    orbitConfig,
    (newConfig) => {
      try {
        localStorage.setItem(
          'parkingMapOrbitConfig',
          JSON.stringify(newConfig),
        );
      } catch (error) {
        console.warn('同步配置到本地存储失败:', error);
      }

      if (orbitStatus.value.playing) {
        stopOrbitAnimation();
        orbitStatus.value.isInited = false;
        startOrbitAnimation();
      }
    },
    { deep: true },
  );

  // 暴露方法和状态
  return {
    orbitStatus,
    orbitConfig,
    startOrbitAnimation,
    stopOrbitAnimation,
    toggleOrbitAnimation,
  };
};
