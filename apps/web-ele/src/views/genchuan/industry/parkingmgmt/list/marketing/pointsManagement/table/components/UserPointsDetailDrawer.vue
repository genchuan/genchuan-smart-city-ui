<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['close']);
const userName = computed(() => props.userName);

// 积分变动明细数据
const pointsDetailData = ref([
  {
    recordId: 'REC001',
    changeType: '增加',
    changePoints: 50,
    changeTime: '2025-02-05 10:30:50',
    reason: '首次注册送积分',
    operator: '系统',
  },
  {
    recordId: 'REC002',
    changeType: '增加',
    changePoints: 10,
    changeTime: '2025-02-06 09:45:20',
    reason: '每日登录送积分',
    operator: '系统',
  },
  {
    recordId: 'REC003',
    changeType: '减少',
    changePoints: 20,
    changeTime: '2025-02-06 14:20:15',
    reason: '兑换优惠券',
    operator: '用户',
  },
  {
    recordId: 'REC004',
    changeType: '增加',
    changePoints: 30,
    changeTime: '2025-02-07 11:10:30',
    reason: '首次停车送积分',
    operator: '系统',
  },
  {
    recordId: 'REC005',
    changeType: '增加',
    changePoints: 15,
    changeTime: '2025-02-07 16:40:15',
    reason: '评价停车场送积分',
    operator: '系统',
  },
]);

/** 获取变动类型标签类型 */
function getChangeTypeTagType(changeType) {
  switch (changeType) {
    case '减少': {
      return 'danger';
    }
    case '增加': {
      return 'success';
    }
    default: {
      return 'info';
    }
  }
}

onMounted(() => {
  // 这里可以根据userId获取真实的积分变动明细数据
  console.log('获取用户积分明细:', props.userId);
});
</script>

<template>
  <div class="user-points-detail-drawer">
    <div class="drawer-header">
      <h3>{{ userName }}积分变动明细</h3>
    </div>
    <div class="drawer-content">
      <el-table :data="pointsDetailData" style="width: 100%">
        <el-table-column prop="recordId" label="记录ID" min-width="120" />
        <el-table-column prop="changeType" label="变动类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getChangeTypeTagType(row.changeType)">
              {{ row.changeType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="changePoints" label="变动积分" min-width="100" />
        <el-table-column prop="changeTime" label="变动时间" min-width="180" />
        <el-table-column prop="reason" label="变动原因" min-width="150" />
        <el-table-column prop="operator" label="操作人" min-width="100" />
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button @click="$emit('close')">关闭</el-button>
    </div>
  </div>
</template>

<style scoped>
.user-points-detail-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
}

.drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.drawer-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
}
</style>
