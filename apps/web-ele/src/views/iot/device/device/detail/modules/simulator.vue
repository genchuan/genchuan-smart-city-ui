<!-- 模拟设备 -->
<script lang="ts" setup>
import type { IotDeviceApi } from '#/api/iot/device/device';
import type { IotProductApi } from '#/api/iot/product/product';
import type { ThingModelData } from '#/api/iot/thingmodel';

import { computed, ref } from 'vue';

import { ContentWrap } from '@vben/common-ui';
import { DeviceStateEnum } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElCol,
  ElInput,
  ElMessage,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTabPane,
} from 'element-plus';

import { sendDeviceMessage } from '#/api/iot/device/device';
import {
  IotDeviceMessageMethodEnum,
  IoTThingModelTypeEnum,
} from '#/views/iot/utils/constants';

import DataDefinition from '../../../../thingmodel/modules/components/data-definition.vue';
import DeviceDetailsMessage from './message.vue';

const props = defineProps<{
  device: IotDeviceApi.Device;
  product: IotProductApi.Product;
  thingModelList: ThingModelData[];
}>();

// 消息弹窗
const activeTab = ref('upstream'); // 上行upstream、下行downstream
const upstreamTab = ref(IotDeviceMessageMethodEnum.PROPERTY_POST.method); // 上行子标签
const downstreamTab = ref(IotDeviceMessageMethodEnum.PROPERTY_SET.method); // 下行子标签
const deviceMessageRef = ref(); // 设备消息组件引用
const deviceMessageRefreshDelay = 2000; // 延迟 N 秒，保证模拟上行的消息被处理

// 折叠状态
const debugCollapsed = ref(false); // 指令调试区域折叠状态
const messageCollapsed = ref(false); // 设备消息区域折叠状态

// 表单数据：存储用户输入的模拟值
const formData = ref<Record<string, string>>({});

// 根据类型过滤物模型数据
const getFilteredThingModelList = (type: number) => {
  return props.thingModelList.filter(
    (item) => String(item.type) === String(type),
  );
};

// 计算属性：属性列表
const propertyList = computed(() =>
  getFilteredThingModelList(IoTThingModelTypeEnum.PROPERTY),
);

// 计算属性：事件列表
const eventList = computed(() =>
  getFilteredThingModelList(IoTThingModelTypeEnum.EVENT),
);

// 计算属性：服务列表
const serviceList = computed(() =>
  getFilteredThingModelList(IoTThingModelTypeEnum.SERVICE),
);

// 获取表单值
function getFormValue(identifier: string) {
  return formData.value[identifier] || '';
}

// 设置表单值
function setFormValue(identifier: string, value: string) {
  formData.value[identifier] = value;
}

// 属性上报
async function handlePropertyPost() {
  try {
    const params: Record<string, any> = {};
    propertyList.value.forEach((item) => {
      const value = formData.value[item.identifier!];
      if (value) {
        params[item.identifier!] = value;
      }
    });

    if (Object.keys(params).length === 0) {
      ElMessage.warning('请至少输入一个属性值');
      return;
    }

    await sendDeviceMessage({
      deviceId: props.device.id!,
      method: IotDeviceMessageMethodEnum.PROPERTY_POST.method,
      params,
    });

    ElMessage.success('属性上报成功');
    // 延迟刷新设备消息列表
    deviceMessageRef.value?.refresh(deviceMessageRefreshDelay);
  } catch (error) {
    ElMessage.error('属性上报失败');
    console.error(error);
  }
}

// 事件上报
async function handleEventPost(row: ThingModelData) {
  try {
    const valueStr = formData.value[row.identifier!];
    let params: any = {};

    if (valueStr) {
      try {
        params = JSON.parse(valueStr);
      } catch {
        ElMessage.error('事件参数格式错误，请输入有效的JSON格式');
        return;
      }
    }

    await sendDeviceMessage({
      deviceId: props.device.id!,
      method: IotDeviceMessageMethodEnum.EVENT_POST.method,
      params: {
        identifier: row.identifier,
        params,
      },
    });

    ElMessage.success('事件上报成功');
    // 延迟刷新设备消息列表
    deviceMessageRef.value?.refresh(deviceMessageRefreshDelay);
  } catch (error) {
    ElMessage.error('事件上报失败');
    console.error(error);
  }
}

// 状态变更
async function handleDeviceState(state: number) {
  try {
    await sendDeviceMessage({
      deviceId: props.device.id!,
      method: IotDeviceMessageMethodEnum.STATE_UPDATE.method,
      params: { state },
    });

    ElMessage.success('状态变更成功');
    // 延迟刷新设备消息列表
    deviceMessageRef.value?.refresh(deviceMessageRefreshDelay);
  } catch (error) {
    ElMessage.error('状态变更失败');
    console.error(error);
  }
}

// 属性设置
async function handlePropertySet() {
  try {
    const params: Record<string, any> = {};
    propertyList.value.forEach((item) => {
      const value = formData.value[item.identifier!];
      if (value) {
        params[item.identifier!] = value;
      }
    });

    if (Object.keys(params).length === 0) {
      ElMessage.warning('请至少输入一个属性值');
      return;
    }

    await sendDeviceMessage({
      deviceId: props.device.id!,
      method: IotDeviceMessageMethodEnum.PROPERTY_SET.method,
      params,
    });

    ElMessage.success('属性设置成功');
    // 延迟刷新设备消息列表
    deviceMessageRef.value?.refresh(deviceMessageRefreshDelay);
  } catch (error) {
    ElMessage.error('属性设置失败');
    console.error(error);
  }
}

// 服务调用
async function handleServiceInvoke(row: ThingModelData) {
  try {
    const valueStr = formData.value[row.identifier!];
    let params: any = {};

    if (valueStr) {
      try {
        params = JSON.parse(valueStr);
      } catch {
        ElMessage.error('服务参数格式错误，请输入有效的JSON格式');
        return;
      }
    }

    await sendDeviceMessage({
      deviceId: props.device.id!,
      method: IotDeviceMessageMethodEnum.SERVICE_INVOKE.method,
      params: {
        identifier: row.identifier,
        params,
      },
    });

    ElMessage.success('服务调用成功');
    // 延迟刷新设备消息列表
    deviceMessageRef.value?.refresh(deviceMessageRefreshDelay);
  } catch (error) {
    ElMessage.error('服务调用失败');
    console.error(error);
  }
}
</script>

<template>
  <ContentWrap>
    <el-row :gutter="16">
      <!-- 左侧：指令调试区域 -->
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-card class="simulator-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>指令调试</span>
              <el-button size="small" text @click="debugCollapsed = !debugCollapsed">
                <IconifyIcon v-if="!debugCollapsed" icon="lucide:chevron-up" />
                <IconifyIcon v-if="debugCollapsed" icon="lucide:chevron-down" />
              </el-button>
            </div>
          </template>
          <div v-show="!debugCollapsed">
            <el-tabs v-model="activeTab" class="simulator-tabs">
              <!-- 上行指令调试 -->
              <el-tab-pane label="上行指令调试" name="upstream">
                <el-tabs
                  v-if="activeTab === 'upstream'"
                  v-model="upstreamTab"
                  class="sub-tabs"
                >
                  <!-- 属性上报 -->
                  <el-tab-pane
                    :label="IotDeviceMessageMethodEnum.PROPERTY_POST.name"
                    :name="IotDeviceMessageMethodEnum.PROPERTY_POST.method"
                  >
                    <ContentWrap>
                      <el-table
                        :data="propertyList"
                        border
                        size="small"
                        style="width: 100%"
                        max-height="300"
                      >
                        <el-table-column prop="name" label="功能名称" width="100" fixed />
                        <el-table-column prop="identifier" label="标识符" width="120" fixed />
                        <el-table-column label="数据类型" width="90">
                          <template #default="{ row }">
                            {{ row.property?.dataType ?? '-' }}
                          </template>
                        </el-table-column>
                        <el-table-column label="数据定义" min-width="150">
                          <template #default="{ row }">
                            <DataDefinition :data="row" />
                          </template>
                        </el-table-column>
                        <el-table-column label="值" width="180" fixed="right">
                          <template #default="{ row }">
                            <el-input
                              :model-value="getFormValue(row.identifier)"
                              placeholder="输入值"
                              size="small"
                              @update:model-value="setFormValue(row.identifier, $event)"
                            />
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="action-footer">
                        <span class="tip-text">设置属性值后，点击「发送属性上报」按钮</span>
                        <el-button type="primary" @click="handlePropertyPost">
                          发送属性上报
                        </el-button>
                      </div>
                    </ContentWrap>
                  </el-tab-pane>

                  <!-- 事件上报 -->
                  <el-tab-pane
                    :label="IotDeviceMessageMethodEnum.EVENT_POST.name"
                    :name="IotDeviceMessageMethodEnum.EVENT_POST.method"
                  >
                    <ContentWrap>
                      <el-table
                        :data="eventList"
                        border
                        size="small"
                        style="width: 100%"
                        max-height="300"
                      >
                        <el-table-column prop="name" label="功能名称" width="100" fixed />
                        <el-table-column prop="identifier" label="标识符" width="120" fixed />
                        <el-table-column label="数据类型" width="90">
                          <template #default="{ row }">
                            {{ row.event?.dataType ?? '-' }}
                          </template>
                        </el-table-column>
                        <el-table-column label="数据定义" min-width="150">
                          <template #default="{ row }">
                            <DataDefinition :data="row" />
                          </template>
                        </el-table-column>
                        <el-table-column label="值" width="180">
                          <template #default="{ row }">
                            <el-input
                              :model-value="getFormValue(row.identifier)"
                              type="textarea"
                              :rows="3"
                              placeholder="输入事件参数（JSON格式）"
                              size="small"
                              @update:model-value="setFormValue(row.identifier, $event)"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" fixed="right">
                          <template #default="{ row }">
                            <el-button size="small" type="primary" @click="handleEventPost(row)">
                              上报事件
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </ContentWrap>
                  </el-tab-pane>

                  <!-- 状态变更 -->
                  <el-tab-pane
                    :label="IotDeviceMessageMethodEnum.STATE_UPDATE.name"
                    :name="IotDeviceMessageMethodEnum.STATE_UPDATE.method"
                  >
                    <ContentWrap>
                      <div class="state-buttons">
                        <el-button type="primary" @click="handleDeviceState(DeviceStateEnum.ONLINE)">
                          设备上线
                        </el-button>
                        <el-button type="danger" @click="handleDeviceState(DeviceStateEnum.OFFLINE)">
                          设备下线
                        </el-button>
                      </div>
                    </ContentWrap>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>

              <!-- 下行指令调试 -->
              <el-tab-pane label="下行指令调试" name="downstream">
                <el-tabs
                  v-if="activeTab === 'downstream'"
                  v-model="downstreamTab"
                  class="sub-tabs"
                >
                  <!-- 属性调试 -->
                  <el-tab-pane
                    :label="IotDeviceMessageMethodEnum.PROPERTY_SET.name"
                    :name="IotDeviceMessageMethodEnum.PROPERTY_SET.method"
                  >
                    <ContentWrap>
                      <el-table
                        :data="propertyList"
                        border
                        size="small"
                        style="width: 100%"
                        max-height="300"
                      >
                        <el-table-column prop="name" label="功能名称" width="100" fixed />
                        <el-table-column prop="identifier" label="标识符" width="120" fixed />
                        <el-table-column label="数据类型" width="90">
                          <template #default="{ row }">
                            {{ row.property?.dataType ?? '-' }}
                          </template>
                        </el-table-column>
                        <el-table-column label="数据定义" min-width="150">
                          <template #default="{ row }">
                            <DataDefinition :data="row" />
                          </template>
                        </el-table-column>
                        <el-table-column label="值" width="180" fixed="right">
                          <template #default="{ row }">
                            <el-input
                              :model-value="getFormValue(row.identifier)"
                              placeholder="输入值"
                              size="small"
                              @update:model-value="setFormValue(row.identifier, $event)"
                            />
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="action-footer">
                        <span class="tip-text">设置属性值后，点击「发送属性设置」按钮</span>
                        <el-button type="primary" @click="handlePropertySet">
                          发送属性设置
                        </el-button>
                      </div>
                    </ContentWrap>
                  </el-tab-pane>

                  <!-- 服务调用 -->
                  <el-tab-pane
                    :label="IotDeviceMessageMethodEnum.SERVICE_INVOKE.name"
                    :name="IotDeviceMessageMethodEnum.SERVICE_INVOKE.method"
                  >
                    <ContentWrap>
                      <el-table
                        :data="serviceList"
                        border
                        size="small"
                        style="width: 100%"
                        max-height="300"
                      >
                        <el-table-column prop="name" label="服务名称" width="100" fixed />
                        <el-table-column prop="identifier" label="标识符" width="120" fixed />
                        <el-table-column label="输入参数" min-width="150">
                          <template #default="{ row }">
                            <DataDefinition :data="row" />
                          </template>
                        </el-table-column>
                        <el-table-column label="参数值" width="180">
                          <template #default="{ row }">
                            <el-input
                              :model-value="getFormValue(row.identifier)"
                              type="textarea"
                              :rows="3"
                              placeholder="输入服务参数（JSON格式）"
                              size="small"
                              @update:model-value="setFormValue(row.identifier, $event)"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" fixed="right">
                          <template #default="{ row }">
                            <el-button size="small" type="primary" @click="handleServiceInvoke(row)">
                              服务调用
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </ContentWrap>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：设备消息区域 -->
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-card class="message-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>设备消息</span>
              <el-button size="small" text @click="messageCollapsed = !messageCollapsed">
                <IconifyIcon icon="lucide:chevron-down" />
              </el-button>
            </div>
          </template>
          <div v-show="!messageCollapsed">
            <DeviceDetailsMessage
              v-if="device.id"
              ref="deviceMessageRef"
              :device-id="device.id"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>
</template>

<style scoped>
.simulator-card,
.message-card {
  height: 100%;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.simulator-tabs {
  margin-top: 8px;
}

.sub-tabs {
  margin-top: 8px;
}

.action-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.tip-text {
  font-size: 12px;
  color: #909399;
}

.state-buttons {
  display: flex;
  gap: 16px;
}

/* 表格样式调整 */
:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table__header th) {
  background-color: #f5f7fa;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 12px;
}
</style>
