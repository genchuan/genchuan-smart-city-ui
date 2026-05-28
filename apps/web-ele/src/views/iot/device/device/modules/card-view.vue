<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElCard, ElCol, ElEmpty, ElPagination, ElPopconfirm, ElRow, ElTooltip } from 'element-plus';

import { getDevicePage } from '#/api/iot/device/device';
import { DictTag } from '#/components/dict-tag';

interface Props {
  products: any[];
  deviceGroups: any[];
  searchParams?: {
    deviceName: string;
    deviceType?: number;
    groupId?: number;
    nickname: string;
    productId?: number;
    status?: number;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  create: [];
  delete: [row: any];
  detail: [id: number];
  edit: [row: any];
  model: [id: number];
  productDetail: [productId: number];
}>();

const loading = ref(false);
const list = ref<any[]>([]);
const total = ref(0);
const queryParams = ref({
  pageNo: 1,
  pageSize: 12,
});

/** 获取产品名称 */
function getProductName(productId: number) {
  const product = props.products.find((p: any) => p.id === productId);
  return product?.name || '-';
}

/** 获取设备列表 */
async function getList() {
  loading.value = true;
  try {
    const data = await getDevicePage({
      ...queryParams.value,
      ...props.searchParams,
    });
    list.value = data.list || [];
    total.value = data.total || 0;
  } finally {
    loading.value = false;
  }
}

/** 处理页码变化 */
function handlePageChange(page: number, pageSize: number) {
  queryParams.value.pageNo = page;
  queryParams.value.pageSize = pageSize;
  getList();
}

defineExpose({
  reload: getList,
  search: () => {
    queryParams.value.pageNo = 1;
    getList();
  },
  query: () => {
    queryParams.value.pageNo = 1;
    getList();
  },
});

/** 初始化 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="device-card-view">
    <!-- 设备卡片列表 -->
    <div v-loading="loading" class="min-h-96">
      <el-row v-if="list.length > 0" :gutter="16">
        <el-col
          v-for="item in list"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="6"
        >
          <el-card
            shadow="hover"
            class="device-card"
            :body-style="{ padding: '16px' }"
          >
            <!-- 顶部标题区域 -->
            <div class="card-header">
              <div class="device-icon">
                <IconifyIcon icon="mdi:chip" class="text-xl" />
              </div>
              <div class="device-info">
                <div class="device-title">{{ item.deviceName }}</div>
              </div>
              <DictTag
                :type="DICT_TYPE.IOT_DEVICE_STATE"
                :value="item.state"
                class="status-tag"
              />
            </div>

            <!-- 内容区域 -->
            <div class="card-content">
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">所属产品</span>
                  <el-tooltip :content="getProductName(item.productId)" placement="top">
                    <a
                      class="info-value product-link"
                      @click="
                        (e) => {
                          e.stopPropagation();
                          emit('productDetail', item.productId);
                        }
                      "
                    >
                      {{ getProductName(item.productId) }}
                    </a>
                  </el-tooltip>
                </div>
                <div class="info-item">
                  <span class="info-label">设备类型</span>
                  <DictTag
                    :type="DICT_TYPE.IOT_PRODUCT_DEVICE_TYPE"
                    :value="item.deviceType"
                    class="info-tag"
                  />
                </div>
                <div class="info-item">
                  <span class="info-label">Deviceid</span>
                  <el-tooltip :content="item.Deviceid || item.id" placement="top">
                    <span class="info-value device-id">
                      {{ item.Deviceid || item.id }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <!-- 按钮组 -->
            <div class="action-buttons">
              <el-button size="small" class="action-btn edit-btn" @click="emit('edit', item)">
                <IconifyIcon icon="lucide:edit" class="btn-icon" />
                编辑
              </el-button>
              <el-button size="small" class="action-btn detail-btn" @click="emit('detail', item.id)">
                <IconifyIcon icon="lucide:eye" class="btn-icon" />
                详情
              </el-button>
              <el-button size="small" class="action-btn data-btn" @click="emit('model', item.id)">
                <IconifyIcon icon="lucide:database" class="btn-icon" />
                数据
              </el-button>
              <el-popconfirm
                :title="`确认删除设备 ${item.deviceName} 吗?`"
                @confirm="emit('delete', item)"
              >
                <template #reference>
                  <el-button size="small" type="danger" class="delete-btn">
                    <IconifyIcon icon="lucide:trash-2" />
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <el-empty v-else description="暂无设备数据" class="empty-state" />
    </div>

    <!-- 分页 -->
    <div v-if="list.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="(page) => handlePageChange(page, queryParams.pageSize)"
        @size-change="(size) => handlePageChange(queryParams.pageNo, size)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-card-view {
  .device-card {
    height: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .device-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: white;
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
    border-radius: 8px;
  }

  .device-info {
    flex: 1;
    min-width: 0;
    margin-left: 12px;
  }

  .device-title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
  }

  .status-tag {
    flex-shrink: 0;
    font-size: 12px;
  }

  .card-content {
    flex: 1;
    margin-bottom: 12px;
  }

  .info-list {
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        flex-shrink: 0;
        width: 60px;
        margin-right: 8px;
        color: #666;
      }

      .info-value {
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        white-space: nowrap;
      }

      .product-link {
        color: #409eff;
        cursor: pointer;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .device-id {
        max-width: 120px;
        overflow: hidden;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .info-tag {
        font-size: 12px;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    margin-top: auto;
    border-top: 1px solid #ebeef5;

    .action-btn {
      flex: 1;
      height: 32px;
      font-size: 13px;
      border-radius: 6px;

      .btn-icon {
        margin-right: 4px;
      }
    }

    .edit-btn {
      color: #409eff;
      border-color: #409eff;

      &:hover {
        color: white;
        background-color: #409eff;
      }
    }

    .detail-btn {
      color: #67c23a;
      border-color: #67c23a;

      &:hover {
        color: white;
        background-color: #67c23a;
      }
    }

    .data-btn {
      color: #e6a23c;
      border-color: #e6a23c;

      &:hover {
        color: white;
        background-color: #e6a23c;
      }
    }

    .delete-btn {
      flex: 0 0 32px;
      padding: 0;
    }
  }

  .empty-state {
    margin: 80px 0;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .min-h-96 {
    min-height: 384px;
  }
}

// 暗色模式适配
html.dark {
  .device-card-view {
    .info-list {
      .info-item {
        .info-label {
          color: #9ca3af;
        }

        .info-value {
          color: #e5e7eb;
        }
      }
    }

    .action-buttons {
      border-top-color: #4b5563;
    }
  }
}
</style>
