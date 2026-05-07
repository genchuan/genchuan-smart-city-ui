<template>
  <DetailDrawer title="用户详情">
    <div class="detail-card" v-loading="loading">
      <div v-if="userData" class="detail-card-content">
        <div class="detail-card-row">
          <div class="detail-row-left">用户ID：</div>
          <div class="detail-row-right">{{ userData.id || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">用户名：</div>
          <div class="detail-row-right">{{ userData.username || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">昵称：</div>
          <div class="detail-row-right">{{ userData.nickname || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">手机号：</div>
          <div class="detail-row-right">{{ userData.mobile || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">邮箱：</div>
          <div class="detail-row-right">{{ userData.email || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">
            <el-tag :type="Number(userData.status) === 0 ? 'success' : 'danger'">
              {{ Number(userData.status) === 0 ? '启用' : '禁用' }}
            </el-tag>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ formatTimestamp(userData.createTime) }}</div>
        </div>
      </div>
      <el-empty v-else description="暂无数据" />
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElEmpty, ElTag } from 'element-plus';

// 时间戳格式化函数
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  // 检查是否为有效日期
  if (isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const loading = ref(false);
const userData = ref(null);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel() {
    detailDrawerApi.close();
  },
});

const open = async (data) => {
  userData.value = data;
  detailDrawerApi.open();
};

const close = () => {
  detailDrawerApi.close();
  userData.value = null;
};

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 450px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
