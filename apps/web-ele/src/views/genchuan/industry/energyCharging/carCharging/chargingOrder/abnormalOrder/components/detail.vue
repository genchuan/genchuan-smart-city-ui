<script setup>
import {computed, defineProps, toRefs, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElMessage, ElLoading} from 'element-plus';
import {
  remarkAbnormalOrder
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/abnormalOrder/data.js';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});
const emit = defineEmits(['refresh']);

const {detailObj, title} = toRefs(props);

// 时间戳格式化（兼容秒和毫秒）
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  let ts = parseInt(timestamp);
  if (ts.toString().length === 10) ts *= 1000;
  const date = new Date(ts);
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 格式化金额
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
};

const drawerTitle = computed(() => {
  const name = detailObj.value?.orderCode || '异常订单';
  return title.value || `${name}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

// 备注编辑
const remarkText = ref('');
const isEditingRemark = ref(false);
const saveRemarkLoading = ref(false);

const startEditRemark = () => {
  remarkText.value = detailObj.value.remark || '';
  isEditingRemark.value = true;
};

const cancelEditRemark = () => {
  isEditingRemark.value = false;
  remarkText.value = '';
};

const saveRemark = async () => {
  if (!detailObj.value.id) return;
  saveRemarkLoading.value = true;
  try {
    const res = await remarkAbnormalOrder({id: detailObj.value.id, remark: remarkText.value});
    if (res === true) {
      detailObj.value.remark = remarkText.value;
      ElMessage.success('备注保存成功');
      isEditingRemark.value = false;
      emit('refresh');
    } else {
      ElMessage.error('保存失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('保存失败');
  } finally {
    saveRemarkLoading.value = false;
  }
};

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">📋 基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常编号：</div>
        <div class="detail-row-right">{{ detailObj.abnormalCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号：</div>
        <div class="detail-row-right">{{ detailObj.orderCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号：</div>
        <div class="detail-row-right">{{ detailObj.plateNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属场站：</div>
        <div class="detail-row-right">{{ detailObj.stationName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常类型：</div>
        <div class="detail-row-right">{{ detailObj.abnormalType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常原因：</div>
        <div class="detail-row-right">{{ detailObj.abnormalReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.abnormalTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常状态：</div>
        <div class="detail-row-right">{{ detailObj.abnormalStatus || '-' }}</div>
      </div>

      <!-- 核实信息 -->
      <div class="detail-section">🔍 核实信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">排查人员：</div>
        <div class="detail-row-right">{{ detailObj.checkUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">排查时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.checkTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核实结果：</div>
        <div class="detail-row-right">{{ detailObj.verifyResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核实人：</div>
        <div class="detail-row-right">{{ detailObj.verifyUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核实时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.verifyTime) }}</div>
      </div>

      <!-- 处理信息 -->
      <div class="detail-section">🛠️ 处理信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理措施：</div>
        <div class="detail-row-right">{{ detailObj.handleMeasure || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理人：</div>
        <div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.handleTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完结时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.completeTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">退款金额：</div>
        <div class="detail-row-right">{{ formatMoney(detailObj.refundAmount) }}</div>
      </div>

      <!-- 备注（可编辑） -->
      <div class="detail-section">📝 备注</div>
      <div class="detail-card-row remark-row">
        <div class="detail-row-left">备注：</div>
        <div class="detail-row-right remark-content">
          <div v-if="!isEditingRemark" class="remark-text">
            {{ detailObj.remark || '无' }}
            <el-button link type="primary" @click="startEditRemark" style="margin-left: 8px;">编辑
            </el-button>
          </div>
          <div v-else class="remark-edit">
            <el-input v-model="remarkText" type="textarea" :rows="3" placeholder="请输入备注"/>
            <div class="remark-actions">
              <el-button size="small" @click="cancelEditRemark">取消</el-button>
              <el-button size="small" type="primary" :loading="saveRemarkLoading"
                         @click="saveRemark">保存
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">⏰ 时间信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建者：</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新者：</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  min-height: 750px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;

  &:first-child {
    margin-top: 0;
  }
}

.remark-row .detail-row-right {
  display: flex;
  flex-direction: column;
}

.remark-edit {
  width: 100%;

  .remark-actions {
    margin-top: 8px;
    text-align: right;
  }
}
</style>
