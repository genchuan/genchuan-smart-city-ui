<!-- survey/detail.vue -->
<script setup>
import { computed, defineProps, toRefs, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { issueTypeList, surveyStatusList } from './data';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' }
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  return title.value || (detailObj.value?.name ? `${detailObj.value.name}详情` : '问卷详情');
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); }
});

// 模拟填写数据明细
const fillDetails = ref([
  { user: '用户1', submit_time: '2025-10-15 10:20:00', answers: [{ q: '您对所在网格的环境卫生满意吗？', a: '8分' }, { q: '您认为网格管理需要改进的方面有哪些？', a: '环境卫生,公共设施' }] },
  { user: '用户2', submit_time: '2025-10-16 14:30:00', answers: [{ q: '您对所在网格的环境卫生满意吗？', a: '9分' }, { q: '您认为网格管理需要改进的方面有哪些？', a: '治安管理' }] }
]);

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close()
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-scroll-container">
      <div class="detail-card">
        <h3 class="detail-card-title">基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">问卷名称：</div>
          <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">问卷编码：</div>
          <div class="detail-row-right">{{ detailObj.code || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联评价任务：</div>
          <div class="detail-row-right">{{ detailObj.task_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">调查对象范围：</div>
          <div class="detail-row-right">{{ detailObj.object_scope || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">发放方式：</div>
          <div class="detail-row-right">{{ issueTypeList.find(i => i.id === detailObj.issue_type_id)?.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">起止时间：</div>
          <div class="detail-row-right">{{ detailObj.start_time }} 至 {{ detailObj.end_time }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">{{ surveyStatusList.find(s => s.id === detailObj.status)?.name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建人：</div>
          <div class="detail-row-right">{{ detailObj.create_by_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ detailObj.create_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">填写人数：</div>
          <div class="detail-row-right">{{ detailObj.fill_count || 0 }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.fill_rate !== undefined">
          <div class="detail-row-left">填写率：</div>
          <div class="detail-row-right">{{ detailObj.fill_rate }}%</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.average_score !== undefined">
          <div class="detail-row-left">平均分：</div>
          <div class="detail-row-right">{{ detailObj.average_score }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.final_fill_rate !== undefined">
          <div class="detail-row-left">最终填写率：</div>
          <div class="detail-row-right">{{ detailObj.final_fill_rate }}%</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.final_average_score !== undefined">
          <div class="detail-row-left">最终平均分：</div>
          <div class="detail-row-right">{{ detailObj.final_average_score }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.index_value !== undefined">
          <div class="detail-row-left">指标值映射结果：</div>
          <div class="detail-row-right">{{ detailObj.index_value }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据关联状态：</div>
          <div class="detail-row-right">{{ detailObj.data_relation_status === 'related' ? '已关联评价' : '未关联评价' }}</div>
        </div>
        <div class="detail-card-row" v-if="detailObj.url_qrcode">
          <div class="detail-row-left">问卷链接/二维码：</div>
          <div class="detail-row-right"><a :href="detailObj.url_qrcode" target="_blank">{{ detailObj.url_qrcode }}</a></div>
        </div>
      </div>

      <div class="detail-card">
        <h3 class="detail-card-title">题目设计</h3>
        <div v-for="(q, idx) in detailObj.questions" :key="idx" class="question-preview">
          <div class="question-title">{{ idx+1 }}. {{ q.title }}
            <span v-if="q.question_type === 'score'">（分值：{{ q.score }}）</span>
            <span v-else>（{{ q.question_type === 'radio' ? '单选' : '多选' }}）</span>
          </div>
          <div v-if="q.options" class="options">
            <div v-for="opt in q.options" :key="opt.option_id">{{ opt.content }}</div>
          </div>
        </div>
      </div>

      <div class="detail-card" v-if="detailObj.status !== 'not_started'">
        <h3 class="detail-card-title">填写明细</h3>
        <el-table :data="fillDetails" border size="small">
          <el-table-column prop="user" label="填写人" width="120" />
          <el-table-column prop="submit_time" label="提交时间" width="160" />
          <el-table-column label="答案">
            <template #default="{ row }">
              <div v-for="(ans, idx) in row.answers" :key="idx">
                <strong>{{ ans.q }}</strong>：{{ ans.a }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px;
}
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.detail-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2f3d;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.detail-row-left {
  width: 140px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
.question-preview {
  margin-bottom: 16px;
  .question-title {
    font-weight: 500;
    margin-bottom: 8px;
  }
  .options {
    padding-left: 20px;
    color: #666;
  }
}
</style>
