<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElImage, ElLink } from 'element-plus'; // 引入图片和链接组件

import { formatTimestamp } from '#/utils'; // 引入时间格式化工具

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

// 处理文件链接列表（解析siteDataUrlListStr）
const fileList = computed(() => {
  const str = detailObj.value?.siteDataUrlListStr || '[]';
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
});

// 进度状态中文映射
const processStatusMap = {
  PENDING: '待处置',
  ON_SITE_REPAIR: '现场修补',
  CRACK_CLEANING: '裂缝清理',
  COMPLETED: '已完成',
};

// 优先级/风险等级映射
const levelMap = {
  1: '低',
  2: '中',
  3: '高',
};

// 超时标识映射
const overTimeFlagMap = {
  0: '未超时',
  1: '已超时',
};

// 计算属性处理标题
const drawerTitle = computed(() => {
  const orderNo = detailObj.value?.orderNo || '道路工单';
  return title.value || `${orderNo}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel() {
    detailDrawerApi.close();
  },
});

// 对外暴露方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息区域 -->
      <div class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">工单ID</div>
          <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">工单编号</div>
          <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">所属设施类型</div>
          <div class="detail-row-right">
            {{ detailObj.facilityType || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联设施ID</div>
          <div class="detail-row-right">{{ detailObj.facilityId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联设施名称</div>
          <div class="detail-row-right">
            {{ detailObj.facilityName || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联预警ID</div>
          <div class="detail-row-right">{{ detailObj.warnId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联预警编号</div>
          <div class="detail-row-right">{{ detailObj.warnNo || '-' }}</div>
        </div>
      </div>

      <!-- 派单信息区域 -->
      <div class="detail-section">
        <div class="section-title">派单信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">指派运维员ID</div>
          <div class="detail-row-right">
            {{ detailObj.assignStaffId || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">指派运维员名称</div>
          <div class="detail-row-right">
            {{ detailObj.assignStaffName || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">工单类型</div>
          <div class="detail-row-right">{{ detailObj.orderType || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">业务类型</div>
          <div class="detail-row-right">{{ detailObj.bizType || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置时限(小时)</div>
          <div class="detail-row-right">{{ detailObj.dealLimit || '-' }}</div>
        </div>
      </div>

      <!-- 时间信息区域 -->
      <div class="detail-section">
        <div class="section-title">时间信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">剩余时间(小时)</div>
          <div class="detail-row-right">{{ detailObj.remainTime || 0 }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">超时标识</div>
          <div class="detail-row-right">
            {{ overTimeFlagMap[detailObj.overTimeFlag] || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">抵达现场时间</div>
          <div class="detail-row-right">
            {{
              detailObj.arriveTime
                ? formatTimestamp(detailObj.arriveTime)
                : '未抵达'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">提醒时间</div>
          <div class="detail-row-right">
            {{
              detailObj.remindTime
                ? formatTimestamp(detailObj.remindTime)
                : '未设置'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">完成时间</div>
          <div class="detail-row-right">
            {{
              detailObj.completeTime
                ? formatTimestamp(detailObj.completeTime)
                : '未完成'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间</div>
          <div class="detail-row-right">
            {{
              detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-'
            }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">更新时间</div>
          <div class="detail-row-right">
            {{
              detailObj.updateTime ? formatTimestamp(detailObj.updateTime) : '-'
            }}
          </div>
        </div>
      </div>

      <!-- 处置信息区域 -->
      <div class="detail-section">
        <div class="section-title">处置信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">优先级等级</div>
          <div class="detail-row-right">
            {{ levelMap[detailObj.priorityLevel] || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">风险等级</div>
          <div class="detail-row-right">
            {{ levelMap[detailObj.riskLevel] || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置进度</div>
          <div class="detail-row-right">
            {{ processStatusMap[detailObj.processStatus] || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">进度说明</div>
          <div class="detail-row-right">{{ detailObj.processDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处置内容</div>
          <div class="detail-row-right">
            {{ detailObj.dealContent || '未填写' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">督办意见</div>
          <div class="detail-row-right">
            {{ detailObj.superviseOpinion || '无' }}
          </div>
        </div>
      </div>

      <!-- 上传资料区域 -->
      <div class="detail-section">
        <div class="section-title">上传资料</div>
        <div class="detail-card-row">
          <div class="detail-row-left">资料说明</div>
          <div class="detail-row-right">{{ detailObj.fileDesc || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">处理后的指标值</div>
          <div class="detail-row-right">
            {{ detailObj.afterIndexValue || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">现场检测文件</div>
          <div class="detail-row-right">
            <div v-if="fileList.length === 0" class="file-item">无上传文件</div>
            <div v-else class="file-list">
              <div
                v-for="(file, index) in fileList"
                :key="index"
                class="file-item"
              >
                <!-- 图片文件预览 -->
                <div v-if="file.type === 'image'" class="image-file">
                  <ElImage
                    :src="file.url"
                    :preview-src-list="[file.url]"
                    fit="cover"
                    style="width: 80px; height: 80px; cursor: zoom-in"
                    preview-teleported
                  />
                  <span class="file-name">{{ file.name }}</span>
                </div>
                <!-- 其他文件链接 -->
                <div v-else class="other-file">
                  <ElLink :href="file.url" target="_blank" type="primary">
                    {{ file.name }}
                  </ElLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 130px;
  }

  .detail-card {
    min-height: 520px;
    max-height: 70vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 700px;
  max-height: 85vh;
  padding: 24px;
  background-color: #f9fafb;
  border-radius: 8px;
}

// 区域标题
.detail-section {
  margin-bottom: 20px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

// 每行布局
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

// 左侧标签
.detail-row-left {
  flex-shrink: 0;
  width: 150px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #606266;
}

// 右侧内容
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 20px;
  color: #303133;
  word-break: break-all;
}

// 文件列表样式
.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  width: fit-content;
}

.image-file {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-name {
  font-size: 13px;
  color: #303133;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-file {
  font-size: 13px;
}

// 滚动条优化
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
