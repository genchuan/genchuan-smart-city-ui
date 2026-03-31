<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const entranceName = detailObj.value?.entranceName || '出入口';
  return title.value || `${entranceName}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 原生预览图片
function previewImage(url) {
  const img = new Image();
  img.src = url;
  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(
    `<style>body{margin:0;background:#000;display:flex;justify-content:center;align-items:center;height:100vh;}</style><img src="${url}" style="max-width:100%;max-height:100%;">`,
  );
  w.document.close();
}

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID：</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">台账编号：</div>
        <div class="detail-row-right">{{ detailObj.ledgerCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逾期标识：</div>
        <div class="detail-row-right">
          {{
            detailObj.overdueFlag === '1'
              ? '是'
              : detailObj.overdueFlag === '0'
                ? '否'
                : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">缴费截止时间：</div>
        <div class="detail-row-right">
          {{ detailObj.paymentDeadlineTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业ID：</div>
        <div class="detail-row-right">{{ detailObj.entId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业名称：</div>
        <div class="detail-row-right">{{ detailObj.entName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规类型ID：</div>
        <div class="detail-row-right">{{ detailObj.illegalTypeId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规等级ID：</div>
        <div class="detail-row-right">
          {{ detailObj.illegalLevelId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业整改记录ID：</div>
        <div class="detail-row-right">
          {{ detailObj.entRectifyRecordId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">执法ID：</div>
        <div class="detail-row-right">{{ detailObj.lawEnforceId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">执法复审台账编号：</div>
        <div class="detail-row-right">{{ detailObj.lawLedgerCode || '-' }}</div>
      </div>

      <!-- ====================== 原生 img 图片展示 ====================== -->
      <div class="detail-card-row" v-if="detailObj.evidenceUrl">
        <div class="detail-row-left">违规证据：</div>
        <div class="detail-row-right evidence-list">
          <div
            class="evidence-item"
            v-for="(item, index) in JSON.parse(detailObj.evidenceUrl) || []"
            :key="index"
            @click="previewImage(item.url)"
          >
            <img :src="item.url" class="evidence-img" />
            <div class="evidence-name">{{ item.name }}</div>
          </div>
          <span
            v-if="!detailObj.evidenceUrl || detailObj.evidenceUrl.length === 0"
          >
            -
          </span>
        </div>
      </div>
      <!-- ============================================================== -->

      <div class="detail-card-row">
        <div class="detail-row-left">草拟处罚金额(元)：</div>
        <div class="detail-row-right">
          {{ detailObj.draftPunishAmt || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处罚法律依据：</div>
        <div class="detail-row-right">{{ detailObj.legalBasis || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审状态：</div>
        <div class="detail-row-right">{{ detailObj.reviewStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审人：</div>
        <div class="detail-row-right">{{ detailObj.reviewBy || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">撤销原因ID：</div>
        <div class="detail-row-right">
          {{ detailObj.cancelReasonId || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">草拟时间：</div>
        <div class="detail-row-right">{{ detailObj.draftTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复审时间：</div>
        <div class="detail-row-right">{{ detailObj.reviewTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">撤销时间：</div>
        <div class="detail-row-right">{{ detailObj.cancelTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

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

// 证据图片样式（纯原生）
.evidence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.evidence-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.evidence-img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  object-fit: cover;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.evidence-name {
  font-size: 12px;
  color: #6b7280;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
}

.detail-card::-webkit-scrollbar {
  width: 6px;
}
.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
