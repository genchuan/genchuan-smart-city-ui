<script lang="ts" setup name="screen">
import { ref } from 'vue';
import { FullScreenContainer } from '@kjgl77/datav-vue3';

import CateringFumeMonitoring from './components/CateringFumeMonitoring.vue';
import CityAppearanceAndSanitation from './components/CityAppearanceAndSanitation.vue';
import CityOperationManagementServicePlatform from './components/CityOperationManagementServicePlatform.vue';
import DrainageAndFloodControl from './components/DrainageAndFloodControl.vue';
import FugitiveDustMonitoring from './components/FugitiveDustMonitoring.vue';
import HeaderTop from './components/HeaderTop.vue';
import IllegalConstructionInspectionManagement from './components/IllegalConstructionInspectionManagement.vue';
import IntelligentManholeCoverManagementSystem from './components/IntelligentManholeCoverManagementSystem.vue';
import Landscaping from './components/Landscaping.vue';
import MunicipalUtilities from './components/MunicipalUtilities.vue';
import ParkingManagement from './components/ParkingManagement.vue';
import SupervisionOfUrbanMuckTrucks from './components/SupervisionOfUrbanMuckTrucks.vue';
import WaterConservancyAndWaterAffairs from './components/WaterConservancyAndWaterAffairs.vue';

// 本地状态管理，替代 Pinia
const activeNav = ref('home');

// 处理导航变化
const handleNavChange = (navTag: string) => {
  activeNav.value = navTag;
};
</script>

<template>
  <FullScreenContainer class="dv-full-screen-container-main">
    <div class="leadershipCockpit-main">
      <HeaderTop @nav-change="handleNavChange" :active-nav="activeNav" />
      <!--智慧城市运行管理服务平台-->
      <CityOperationManagementServicePlatform v-if="activeNav === 'home'" />
      <!--水利水务-->
      <WaterConservancyAndWaterAffairs v-if="activeNav === '1'" />
      <!--市政公用-->
      <MunicipalUtilities v-if="activeNav == '2'" />
      <!--市容环卫-->
      <CityAppearanceAndSanitation v-if="activeNav == '3'" />
      <!--园林绿化-->
      <Landscaping v-if="activeNav == '5'" />
      <!--智能井盖-->
      <IntelligentManholeCoverManagementSystem v-if="activeNav === '61'" />
      <!--排水防涝-->
      <DrainageAndFloodControl v-if="activeNav == '62'" />
      <!--停车管理系统-->
      <ParkingManagement v-if="activeNav == '63'" />
      <!--扬尘监测系统-->
      <FugitiveDustMonitoring v-if="activeNav == '64'" />
      <!--城市渣土车监管系统-->
      <SupervisionOfUrbanMuckTrucks v-if="activeNav == '65'" />
      <!--餐饮油烟监测系统-->
      <CateringFumeMonitoring v-if="activeNav == '66'" />
      <!--违建巡查管理系统-->
      <IllegalConstructionInspectionManagement v-if="activeNav == '67'" />
    </div>
  </FullScreenContainer>
</template>

<style lang="scss">
@use './assets/chart/css/dataV';
</style>
