<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  userList: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '查看领取用户',
  },
});

const emit = defineEmits(['close']);

const [Drawer, drawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: false,
  showConfirmButton: false,
  onCancel() {
    emit('close');
    drawerApi.close();
  },
});

// 暴露open方法给父组件
defineExpose({
  open: drawerApi.open,
  setData: drawerApi.setData,
});
</script>

<template>
  <Drawer>
    <div class="detail-container">
      <div class="detail-card">
        <div class="user-list-container">
          <el-table :data="userList" style="width: 100%">
            <el-table-column prop="userId" label="用户ID" min-width="100" />
            <el-table-column prop="userName" label="用户姓名" min-width="100" />
            <el-table-column
              prop="userPhone"
              label="用户手机号"
              min-width="120"
            />
            <el-table-column
              prop="receiveTime"
              label="领取时间"
              min-width="180"
            />
            <el-table-column prop="status" label="状态" min-width="80" />
          </el-table>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.detail-container {
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.detail-card {
  padding: 20px;
  margin-bottom: 16px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-card:last-child {
  margin-bottom: 0;
}

.user-list-container {
  height: 100%;
  overflow: auto;
}
</style>
