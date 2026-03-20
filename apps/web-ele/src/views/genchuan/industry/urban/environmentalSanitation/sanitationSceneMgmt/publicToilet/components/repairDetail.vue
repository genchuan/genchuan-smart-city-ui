<script setup>
import {computed, defineProps, toRefs} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElImage} from 'element-plus';

const props = defineProps({
  detailObj: {type: Object, required: true, default: () => ({})},
  title: {type: String, default: ''},
});

const {detailObj, title} = toRefs(props);

const drawerTitle = computed(() => {
  const id = detailObj.value?.repairId || '维修';
  return title.value || `${id}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});

// 如果 detailObj 中已有 photoUrlList，直接使用；否则解析 photoUrl 字段
const photoList = computed(() => {
  const obj = detailObj.value;
  if (obj?.photoUrlList) return obj.photoUrlList;
  if (!obj?.photoUrl) return [];

  // 兼容旧数据：尝试解析 JSON 数组或逗号分隔
  if (Array.isArray(obj.photoUrl)) return obj.photoUrl;
  if (typeof obj.photoUrl === 'string') {
    try {
      const parsed = JSON.parse(obj.photoUrl);
      if (Array.isArray(parsed)) return parsed;
    } catch {
    }
    if (obj.photoUrl.includes(',')) {
      return obj.photoUrl.split(',').map(url => url.trim());
    }
    return [obj.photoUrl];
  }
  return [];
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">🔧 维修信息</div>
      <div class="detail-row"><span class="label">维修编号：</span>{{ detailObj.repairId || '-' }}
      </div>
      <div class="detail-row"><span class="label">关联公厕：</span>{{ detailObj.toiletName || '-' }}
      </div>
      <div class="detail-row"><span class="label">设施类型：</span>{{
          detailObj.facilityName || '-'
        }}
      </div>
      <div class="detail-row"><span class="label">损坏情况：</span>{{ detailObj.damageDesc || '-' }}
      </div>
      <div class="detail-row"><span class="label">上报人员：</span>{{ detailObj.reportName || '-' }}
      </div>
      <div class="detail-row"><span class="label">上报时间：</span>{{ detailObj.reportTime || '-' }}
      </div>

      <div class="detail-row" v-if="photoList.length">
        <span class="label">现场照片：</span>
        <div class="photo-list">
          <el-image
            v-for="(url, index) in photoList"
            :key="index"
            :src="url"
            :preview-src-list="photoList"
            fit="cover"
            style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px; cursor: pointer;"
            :preview-teleported="true"
          />
        </div>
      </div>

      <div class="detail-section">⚙️ 维修进度</div>
      <div class="detail-row"><span class="label">维修人员：</span>{{ detailObj.repairName || '-' }}
      </div>
      <div class="detail-row"><span class="label">维修状态：</span>{{
          detailObj.repairStatus || '-'
        }}
      </div>
      <div class="detail-row"><span
        class="label">预计完成时间：</span>{{ detailObj.expectedCompleteTime || '-' }}
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}
      </div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
  }
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
