<!-- card-view.vue - 卡片视图组件 -->
<script setup>
import { onMounted, ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElCard, ElEmpty, ElImage, ElMessage, ElPagination, ElPopconfirm, ElTooltip } from 'element-plus';

import { getProductPage } from '#/api/iot/product/product';
import { DictTag } from '#/components/dict-tag';

const props = defineProps({
  categoryList: {
    type: Array,
    default: () => [],
  },
  searchParams: {
    type: Object,
    default: () => ({
      name: '',
      productKey: '',
    }),
  },
});

const emit = defineEmits([
  'create',
  'delete',
  'detail',
  'edit',
  'thingModel',
]);

const loading = ref(false);
const list = ref([]);
const total = ref(0);
const queryParams = ref({
  pageNo: 1,
  pageSize: 12,
});

/** 获取分类名称 */
function getCategoryName(categoryId) {
  const category = props.categoryList.find((c) => c.id === categoryId);
  return category?.name || '未分类';
}

/** 获取产品列表 */
async function getList() {
  loading.value = true;
  try {
    const data = await getProductPage({
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
function handlePageChange(page, pageSize) {
  queryParams.value.pageNo = page;
  queryParams.value.pageSize = pageSize;
  getList();
}

defineExpose({
  reload: getList,
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
  <div class="product-card-view">
    <!-- 产品卡片列表 -->
    <div v-loading="loading" class="min-h-96">
      <div v-if="list.length > 0" class="card-grid">
        <div
          v-for="item in list"
          :key="item.id"
          class="card-item"
        >
          <el-card :body-style="{ padding: '16px' }" class="product-card h-full" shadow="hover">
            <!-- 顶部标题区域 -->
            <div class="mb-3 flex items-center">
              <div class="product-icon">
                <IconifyIcon :icon="item.icon || 'lucide:box'" class="text-xl" />
              </div>
              <div class="ml-3 min-w-0 flex-1">
                <div class="product-title">{{ item.name }}</div>
              </div>
            </div>
            <!-- 内容区域 -->
            <div class="mb-3 flex items-start">
              <div class="info-list flex-1">
                <div class="info-item">
                  <span class="info-label">产品分类</span>
                  <span class="info-value text-primary">
                    {{ getCategoryName(item.categoryId) }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">产品类型</span>
                  <DictTag
                    :type="DICT_TYPE.IOT_PRODUCT_DEVICE_TYPE"
                    :value="item.deviceType"
                    class="info-tag"
                  />
                </div>
                <div class="info-item">
                  <span class="info-label">产品标识</span>
                  <el-tooltip :content="item.productKey || item.id" placement="top">
                    <span class="info-value product-key cursor-pointer">
                      {{ item.productKey || item.id }}
                    </span>
                  </el-tooltip>
                </div>
              </div>
              <!-- 产品图片 -->
              <div class="product-image">
                <el-image
                  v-if="item.picUrl"
                  :src="item.picUrl"
                  :preview-src-list="[item.picUrl]"
                  class="size-full rounded object-cover"
                  fit="cover"
                />
                <IconifyIcon v-else icon="lucide:image" class="text-2xl opacity-50" />
              </div>
            </div>
            <!-- 按钮组 -->
            <div class="action-buttons">
              <el-button size="small" class="action-btn action-btn-edit" @click="emit('edit', item)">
                <IconifyIcon icon="lucide:edit" class="mr-1" />
                编辑
              </el-button>
              <el-button size="small" class="action-btn action-btn-detail" @click="emit('detail', item.id)">
                <IconifyIcon icon="lucide:eye" class="mr-1" />
                详情
              </el-button>
              <el-button size="small" class="action-btn action-btn-model" @click="emit('thingModel', item.id)">
                <IconifyIcon icon="lucide:git-branch" class="mr-1" />
                物模型
              </el-button>
              <el-tooltip v-if="item.status === 1" content="已发布的产品不能删除">
                <el-button size="small" type="danger" disabled class="action-btn action-btn-delete !w-8">
                  <IconifyIcon icon="lucide:trash-2" class="text-sm" />
                </el-button>
              </el-tooltip>
              <el-popconfirm
                v-else
                :title="`确认删除产品 ${item.name} 吗?`"
                @confirm="emit('delete', item)"
              >
                <template #reference>
                  <el-button size="small" type="danger" class="action-btn action-btn-delete !w-8">
                    <IconifyIcon icon="lucide:trash-2" class="text-sm" />
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </div>
      </div>
      <!-- 空状态 -->
      <el-empty v-else description="暂无产品数据" class="my-20" />
    </div>

    <!-- 分页 -->
    <div v-if="list.length > 0" class="mt-3 flex justify-end">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-card-view {
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .product-card {
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }

    // 产品图标
    .product-icon {
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

    // 产品标题
    .product-title {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
      font-weight: 600;
      line-height: 36px;
      white-space: nowrap;
    }

    // 信息列表
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
          width: 65px;
          margin-right: 8px;
          opacity: 0.65;
        }

        .info-value {
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
          white-space: nowrap;

          &.text-primary {
            color: #1890ff;
          }
        }

        .product-key {
          display: inline-block;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          vertical-align: middle;
          white-space: nowrap;
          opacity: 0.85;
        }

        .info-tag {
          font-size: 12px;
        }
      }
    }

    // 产品图片
    .product-image {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      color: #1890ff;
      background: linear-gradient(135deg, #40a9ff15 0%, #1890ff15 100%);
      border-radius: 8px;
    }

    // 按钮组
    .action-buttons {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      margin-top: auto;
      border-top: 1px solid var(--el-border-color-light);

      .action-btn {
        flex: 1;
        height: 32px;
        font-size: 13px;
        border-radius: 6px;
        transition: all 0.2s;

        &.action-btn-edit {
          color: #1890ff;
          border-color: #1890ff;

          &:hover {
            color: white;
            background: #1890ff;
          }
        }

        &.action-btn-detail {
          color: #52c41a;
          border-color: #52c41a;

          &:hover {
            color: white;
            background: #52c41a;
          }
        }

        &.action-btn-model {
          color: #fa8c16;
          border-color: #fa8c16;

          &:hover {
            color: white;
            background: #fa8c16;
          }
        }

        &.action-btn-delete {
          flex: 0 0 32px;
          padding: 0;
        }
      }
    }
  }
}

.mb-3 {
  margin-bottom: 0.75rem;
}
.ml-3 {
  margin-left: 0.75rem;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.my-20 {
  margin-top: 5rem;
  margin-bottom: 5rem;
}
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.justify-end {
  justify-content: flex-end;
}
.min-w-0 {
  min-width: 0;
}
.h-full {
  height: 100%;
}
.size-full {
  width: 100%;
  height: 100%;
}
.rounded {
  border-radius: 0.25rem;
}
.object-cover {
  object-fit: cover;
}
.text-xl {
  font-size: 1.25rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.text-sm {
  font-size: 0.875rem;
}
.opacity-50 {
  opacity: 0.5;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
