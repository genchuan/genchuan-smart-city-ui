<!-- 设备物模型：设备属性、事件管理、服务调用 -->
<script lang="ts" setup>
import type { ThingModelData } from '#/api/iot/thingmodel';

import { ref } from 'vue';

import { ContentWrap } from '@vben/common-ui';

import { ElTabs, ElTabPane } from 'element-plus';

import DeviceDetailsThingModelEvent from './thing-model-event.vue';
import DeviceDetailsThingModelProperty from './thing-model-property.vue';
import DeviceDetailsThingModelService from './thing-model-service.vue';

const props = defineProps<{
  deviceId: number;
  thingModelList: ThingModelData[];
}>();

const activeTab = ref('property'); // 默认选中设备属性
</script>

<template>
  <ContentWrap>
    <el-tabs v-model="activeTab" class="thing-model-tabs">
      <el-tab-pane label="设备属性（运行状态）" name="property">
        <DeviceDetailsThingModelProperty
          v-if="activeTab === 'property'"
          :device-id="deviceId"
        />
      </el-tab-pane>
      <el-tab-pane label="设备事件上报" name="event">
        <DeviceDetailsThingModelEvent
          v-if="activeTab === 'event'"
          :device-id="props.deviceId"
          :thing-model-list="props.thingModelList"
        />
      </el-tab-pane>
      <el-tab-pane label="设备服务调用" name="service">
        <DeviceDetailsThingModelService
          v-if="activeTab === 'service'"
          :device-id="deviceId"
          :thing-model-list="props.thingModelList"
        />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<style scoped>
.thing-model-tabs {
  height: auto;
  padding: 0;
}

:deep(.el-tabs__header) {
  margin-bottom: 16px;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style>
