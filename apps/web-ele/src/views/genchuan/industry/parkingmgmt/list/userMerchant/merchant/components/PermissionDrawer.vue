<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { ACTION_ICON } from '#/adapter/vxe-table';

import { permissionChangeLogs, permissionQueryList } from '../table/data.js';

interface Props {
  merchant: any;
}

const props = defineProps<Props>();

const emit = defineEmits(['close']);

// 权限组选项
const permissionGroups = ref([
  { label: '停车场商户基础权限组', value: 'parking_basic' },
  { label: '充电商户基础权限组', value: 'charge_basic' },
  { label: '综合商户权限组', value: 'comprehensive' },
]);

// 选择的权限组
const selectedGroup = ref('');

// 权限明细
const permissionDetails = ref([
  {
    groupName: '订单管理',
    permissions: [
      {
        id: 'order:view',
        name: '订单查看',
        description: '查看名下停车场订单数据',
        checked: true,
      },
      {
        id: 'order:export',
        name: '订单导出',
        description: '导出订单数据报表',
        checked: true,
      },
      {
        id: 'order:refund',
        name: '订单退款',
        description: '处理订单退款申请',
        checked: false,
      },
    ],
  },
  {
    groupName: '设备管理',
    permissions: [
      {
        id: 'device:view',
        name: '设备状态查看',
        description: '查看停车场设备运行状态',
        checked: true,
      },
      {
        id: 'device:config',
        name: '设备参数配置',
        description: '修改停车场设备运行参数',
        checked: false,
      },
    ],
  },
  {
    groupName: '财务管理',
    permissions: [
      {
        id: 'finance:settle',
        name: '结算管理',
        description: '查看和管理结算数据',
        checked: false,
      },
      {
        id: 'finance:report',
        name: '财务报表',
        description: '查看财务报表数据',
        checked: false,
      },
    ],
  },
]);

// 计算属性：是否全选
const isAllChecked = computed(() => {
  const allPermissions = permissionDetails.value.flatMap(
    (group) => group.permissions,
  );
  return allPermissions.every((perm) => perm.checked);
});

// 全选/取消全选
const handleAllCheck = (checked: boolean) => {
  permissionDetails.value.forEach((group) => {
    group.permissions.forEach((perm) => {
      perm.checked = checked;
    });
  });
};

// 激活的标签页
const activeTab = ref('assign');

// 计算商户状态标签
const statusTag = computed(() => {
  return {
    label: '已授权',
    type: 'success',
  };
});

// 权限搜索关键词
const permissionSearch = ref('');

// 日志变更类型搜索关键词
const logTypeSearch = ref('');

// 搜索过滤后的权限列表
const filteredPermissions = computed(() => {
  if (!permissionSearch.value) {
    return permissionQueryList;
  }
  return permissionQueryList.filter(
    (perm) =>
      perm.permName.includes(permissionSearch.value) ||
      perm.permDesc.includes(permissionSearch.value),
  );
});

// 搜索过滤后的日志列表
const filteredChangeLogs = computed(() => {
  if (!logTypeSearch.value) {
    return permissionChangeLogs;
  }
  return permissionChangeLogs.filter((log) =>
    log.changeType.includes(logTypeSearch.value),
  );
});

// 导出权限日志
const exportPermissionLogs = () => {
  ElMessage.success('权限日志导出成功');
};

// 导出权限清单
const exportPermissionList = () => {
  ElMessage.success('权限清单导出成功');
};
</script>

<template>
  <div class="permission-management">
    <!-- 商户信息卡片 -->
    <div class="merchant-info-card">
      <div class="merchant-icon">
        <span class="icon-box">
          <i class="iconfont icon-company"></i>
        </span>
      </div>
      <div class="merchant-details">
        <div class="merchant-name">
          {{ merchant.merchantName }}
          <el-tag :type="statusTag.type" class="ml-2">
            {{ statusTag.label }}
          </el-tag>
        </div>
        <div class="merchant-meta">
          <span class="meta-item">商户ID: {{ merchant.merchantId }}</span>
          <span class="meta-item"
            >业务类型: {{ merchant.businessScope || '综合业务' }}</span
          >
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" class="permission-tabs">
      <el-tab-pane label="权限分配" name="assign">
        <!-- 权限组选择 -->
        <div class="form-section">
          <div class="form-item">
            <label class="form-label required">权限组</label>
            <el-select
              v-model="selectedGroup"
              placeholder="请选择权限组"
              class="w-full"
            >
              <el-option
                v-for="group in permissionGroups"
                :key="group.value"
                :label="group.label"
                :value="group.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 权限明细 -->
        <div class="permission-section">
          <div class="section-header">
            <span class="section-title">权限明细</span>
            <el-checkbox v-model="isAllChecked" @change="handleAllCheck">
              全选
            </el-checkbox>
          </div>

          <div class="permission-groups">
            <div
              v-for="group in permissionDetails"
              :key="group.groupName"
              class="permission-group"
            >
              <h4 class="group-title">{{ group.groupName }}</h4>
              <div class="permission-list">
                <div
                  v-for="perm in group.permissions"
                  :key="perm.id"
                  class="permission-item"
                >
                  <div class="permission-info">
                    <el-checkbox v-model="perm.checked">
                      {{ perm.name }}
                    </el-checkbox>
                    <span class="permission-description">{{
                      perm.description
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="权限变更日志" name="log">
        <div class="form-section">
          <!-- 搜索框和导出按钮 -->
          <div
            class="search-export-container"
            style="
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="search-input-wrapper" style="width: 300px">
              <el-input
                v-model="logTypeSearch"
                placeholder="请输入变更类型"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-search"></i>
                </template>
              </el-input>
            </div>
            <!-- 导出权限日志按钮 -->
            <el-button type="primary" plain @click="exportPermissionLogs">
              <i :class="ACTION_ICON.DOWNLOAD"></i>
              导出权限日志
            </el-button>
          </div>

          <!-- 日志列表 -->
          <div class="change-logs-list">
            <div
              v-for="log in filteredChangeLogs"
              :key="log.id"
              class="log-item"
            >
              <div class="log-header">
                <div class="log-time">{{ log.changeTime }}</div>
                <el-tag
                  :type="
                    log.changeType === '新增'
                      ? 'success'
                      : log.changeType === '删除'
                        ? 'danger'
                        : 'warning'
                  "
                >
                  {{ log.changeType }}
                </el-tag>
              </div>
              <div class="log-content">
                <div class="log-info">
                  <span class="log-label">变更人:</span>
                  <span class="log-value">{{ log.changeBy }}</span>
                </div>
                <div class="log-info">
                  <span class="log-label">变更权限:</span>
                  <span class="log-value">{{ log.permName }}</span>
                </div>
                <div class="log-info">
                  <span class="log-label">变更原因:</span>
                  <span class="log-value">{{ log.changeReason }}</span>
                </div>
                <div class="log-info">
                  <span class="log-label">变更前:</span>
                  <span class="log-value">{{ log.beforePerm || '无' }}</span>
                </div>
                <div class="log-info">
                  <span class="log-label">变更后:</span>
                  <span class="log-value">{{ log.afterPerm || '无' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="权限查询" name="query">
        <div class="form-section">
          <!-- 搜索框和导出按钮 -->
          <div
            class="search-export-container"
            style="
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="search-input-wrapper" style="width: 300px">
              <el-input
                v-model="permissionSearch"
                placeholder="请输入权限名称或描述"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-search"></i>
                </template>
              </el-input>
            </div>
            <!-- 导出权限清单按钮 -->
            <el-button type="primary" plain @click="exportPermissionList">
              <i :class="ACTION_ICON.DOWNLOAD"></i>
              导出权限清单
            </el-button>
          </div>

          <!-- 权限列表 -->
          <div class="permission-query-list">
            <div
              v-for="perm in filteredPermissions"
              :key="perm.id"
              class="query-perm-item"
            >
              <div class="perm-header">
                <span class="perm-name">{{ perm.permName }}</span>
                <el-tag
                  :type="perm.status === '有效' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ perm.status }}
                </el-tag>
              </div>
              <div class="perm-content">
                <div class="perm-desc">{{ perm.permDesc }}</div>
                <div class="perm-meta">
                  <div class="meta-item">
                    <span class="meta-label">生效时间:</span>
                    <span class="meta-value">{{ perm.effectiveTime }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">失效时间:</span>
                    <span class="meta-value">{{ perm.expireTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.permission-management {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .merchant-info-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: #f0f9ff;
    border: 1px solid #e0f2fe;
    border-radius: 8px;
    margin-bottom: 20px;

    .merchant-icon {
      margin-right: 16px;

      .icon-box {
        width: 48px;
        height: 48px;
        background-color: #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
    }

    .merchant-details {
      flex: 1;

      .merchant-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #1e293b;
      }

      .merchant-meta {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #64748b;

        .meta-item {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .permission-tabs {
    margin-bottom: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      margin-bottom: 12px;
    }

    .el-tabs__content {
      flex: 1;
      overflow: auto;

      > .el-tab-pane {
        padding: 16px 0;
      }
    }
  }

  .form-section {
    margin-bottom: 20px;

    .form-item {
      margin-bottom: 16px;

      .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #334155;

        &.required::after {
          content: '*';
          color: #ef4444;
          margin-left: 4px;
        }
      }
    }
  }

  .permission-section {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        font-weight: 600;
        font-size: 16px;
        color: #334155;
      }
    }

    .permission-groups {
      .permission-group {
        margin-bottom: 24px;

        .group-title {
          font-weight: 600;
          font-size: 14px;
          color: #475569;
          margin-bottom: 12px;
        }

        .permission-list {
          .permission-item {
            margin-bottom: 12px;

            .permission-info {
              display: flex;
              flex-direction: column;
              gap: 4px;

              .permission-description {
                font-size: 13px;
                color: #64748b;
                margin-left: 22px;
              }
            }
          }
        }
      }
    }
  }

  /* 变更日志样式 */
  .change-logs-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .log-item {
    padding: 16px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .log-time {
      font-size: 14px;
      color: #64748b;
    }
  }

  .log-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .log-info,
  .log-change-item,
  .log-change-detail {
    display: flex;
    gap: 8px;
  }

  .log-label,
  .meta-label {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    min-width: 70px;
  }

  .log-value,
  .meta-value {
    font-size: 13px;
    color: #334155;
  }

  .log-change-detail {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
    flex-direction: column;
    gap: 4px;
  }

  /* 权限查询样式 */
  .permission-query-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
  }

  .query-perm-item {
    padding: 16px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .perm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .perm-name {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
    }
  }

  .perm-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .perm-desc {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .perm-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-item {
    display: flex;
    gap: 8px;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    .el-button--primary {
      background-color: #3b82f6;
      border-color: #3b82f6;

      &:hover {
        background-color: #2563eb;
        border-color: #2563eb;
      }
    }
  }
}
</style>
