<!-- survey/index.vue -->
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import surveyDetail from './detail.vue';
import {
  getQuestionnairesByFilter,
  evalTaskList,
  issueTypeList,
  surveyStatusList,
  getGridColumnsByTab,
  getSearchSchemaByTab,
  createQuestionnaire,
  updateQuestionnaire,
  startQuestionnaire,
  finishQuestionnaire,
  extendEndTime,
  copyQuestionnaire,
  deleteQuestionnaire,
  relateToEvaluation
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false }
});
const emit = defineEmits(['arrow-change', 'data-change']);

// ==================== 数据定义 ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  currentPage: 1,
  pageSize: 10,
  list: [],
  total: 0
});

const checkedIds = ref([]);
const searchParams = ref({});
const activeName = ref('全部');
const detailRef = ref(null);

const tabsData = ref([
  { label: '全部' },
  { label: '未开始' },
  { label: '进行中' },
  { label: '已结束' }
]);

const createLabel = (item) => {
  let count = 0;
  const quests = getQuestionnairesByFilter(item.label === '全部' ? '全部' : item.label);
  count = quests.length;
  return `${item.label} (${count})`;
};

// 新增/编辑抽屉
const formDrawerVisible = ref(false);
const formData = ref({});
const isEdit = ref(false);
const formRef = ref(null);
const formLoading = ref(false);

// 问卷题目列表（动态）
const questions = ref([]);
const currentQuestion = ref({});
const questionDialogVisible = ref(false);

// 延长时间弹窗
const extendDialogVisible = ref(false);
const extendQuestId = ref('');
const newEndTime = ref('');

// 重新生成入口弹窗
const regenerateDialogVisible = ref(false);
const regenerateQuestId = ref('');

// ==================== 表格配置 ====================
const gridColumns = ref(getGridColumnsByTab('全部'));

const getTableData = (pageObj) => {
  const page = pageObj.page;
  let quests = getQuestionnairesByFilter(activeName.value, searchParams.value);
  quests.sort((a, b) => (b.create_time || '').localeCompare(a.create_time || ''));

  dataObj.total = quests.length;
  dataObj.list = quests.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) }
    },
    rowConfig: { keyField: 'questionnaire_id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true
    },
    showOverflow: true
  },
  gridEvents: {
    checkboxAll: ({ records }) => { checkedIds.value = records.map(item => item.questionnaire_id); },
    checkboxChange: ({ records }) => { checkedIds.value = records.map(item => item.questionnaire_id); }
  },
  showSearchForm: false
});

// ==================== 搜索抽屉 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); }
});

const searchSchema = computed(() => getSearchSchemaByTab(activeName.value));

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120
  },
  handleSubmit: (values) => {
    searchParams.value = values;
    drawerApi.close();
    handleRefresh();
  },
  layout: 'horizontal',
  schema: searchSchema.value,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

// ==================== 新增/编辑抽屉 ====================
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() {
    formDrawerVisible.value = false;
    formDrawerApi.close();
  },
  onConfirm: async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
      if (valid) {
        submitForm();
      }
    });
  }
});

const [QuestForm, questFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120
  },
  layout: 'horizontal',
  schema: [
    { fieldName: 'name', label: '问卷名称', component: 'Input', rules: 'required' },
    { fieldName: 'code', label: '问卷编码', component: 'Input', rules: 'required' },
    { fieldName: 'task_id', label: '关联评价任务', component: 'Select', componentProps: { options: evalTaskList.map(t => ({ label: t.name, value: t.task_id })) }, rules: 'required' },
    { fieldName: 'object_scope', label: '调查对象范围', component: 'Input', rules: 'required' },
    { fieldName: 'issue_type_id', label: '发放方式', component: 'Select', componentProps: { options: issueTypeList.map(i => ({ label: i.name, value: i.id })) }, rules: 'required' },
    { fieldName: 'start_time', label: '开始时间', component: 'DatePicker', componentProps: { type: 'datetime' }, rules: 'required' },
    { fieldName: 'end_time', label: '结束时间', component: 'DatePicker', componentProps: { type: 'datetime' }, rules: 'required' }
  ],
  showDefaultActions: false
});

const submitForm = () => {
  const values = questFormApi.form.values;
  if (questions.value.length === 0) {
    ElMessage.warning('请至少添加一道题目');
    return;
  }
  formLoading.value = true;
  try {
    if (isEdit.value) {
      updateQuestionnaire(formData.value.questionnaire_id, { ...values, questions: questions.value });
      ElMessage.success('编辑成功');
    } else {
      createQuestionnaire({ ...values, questions: questions.value });
      ElMessage.success('创建成功');
    }
    handleRefresh();
    emit('data-change');
    formDrawerVisible.value = false;
    formDrawerApi.close();
  } catch (error) {
    ElMessage.error('操作失败');
  } finally {
    formLoading.value = false;
  }
};

const openFormDrawer = (row = null) => {
  isEdit.value = !!row;
  if (row) {
    formData.value = row;
    questions.value = row.questions || [];
    questFormApi.setValues({
      name: row.name,
      code: row.code,
      task_id: row.task_id,
      object_scope: row.object_scope,
      issue_type_id: row.issue_type_id,
      start_time: row.start_time,
      end_time: row.end_time
    });
  } else {
    formData.value = {};
    questions.value = [];
    questFormApi.resetForm();
  }
  formDrawerVisible.value = true;
  formDrawerApi.open();
};

// 题目管理
const addQuestion = () => {
  currentQuestion.value = { question_type: 'radio', options: [] };
  questionDialogVisible.value = true;
};

const editQuestion = (index) => {
  currentQuestion.value = { ...questions.value[index], index };
  questionDialogVisible.value = true;
};

const deleteQuestion = (index) => {
  questions.value.splice(index, 1);
};

const saveQuestion = () => {
  if (!currentQuestion.value.title) {
    ElMessage.warning('请输入题目内容');
    return;
  }
  if (currentQuestion.value.question_type === 'score' && (currentQuestion.value.score === undefined || currentQuestion.value.score === '')) {
    ElMessage.warning('请输入分值');
    return;
  }
  if (currentQuestion.value.question_type !== 'score' && (!currentQuestion.value.options || currentQuestion.value.options.length === 0)) {
    ElMessage.warning('请至少添加一个选项');
    return;
  }
  if (currentQuestion.value.index !== undefined) {
    questions.value[currentQuestion.value.index] = { ...currentQuestion.value };
    delete currentQuestion.value.index;
  } else {
    questions.value.push({ ...currentQuestion.value });
  }
  questionDialogVisible.value = false;
  currentQuestion.value = {};
};

// 选项管理（简易）
const addOption = () => {
  if (!currentQuestion.value.options) currentQuestion.value.options = [];
  currentQuestion.value.options.push({ content: '', sort_no: currentQuestion.value.options.length + 1 });
};
const removeOption = (idx) => {
  currentQuestion.value.options.splice(idx, 1);
};

// ==================== 操作方法 ====================
function handleRefresh() {
  gridApi.query();
}

async function handleStart(row) {
  await confirm('确定启动该问卷吗？启动后将生成发放入口，不可修改题目和选项。');
  startQuestionnaire(row.questionnaire_id);
  ElMessage.success('问卷已启动');
  handleRefresh();
  emit('data-change');
}

async function handleFinish(row) {
  await confirm('确定结束该问卷吗？结束后将不再接收填写数据。');
  finishQuestionnaire(row.questionnaire_id);
  ElMessage.success('问卷已结束');
  handleRefresh();
  emit('data-change');
}

async function handleExtend(row) {
  extendQuestId.value = row.questionnaire_id;
  newEndTime.value = row.end_time;
  extendDialogVisible.value = true;
}

function submitExtend() {
  if (!newEndTime.value) {
    ElMessage.warning('请选择新的结束时间');
    return;
  }
  extendEndTime(extendQuestId.value, newEndTime.value);
  ElMessage.success('结束时间已延长');
  extendDialogVisible.value = false;
  handleRefresh();
  emit('data-change');
}

async function handleRegenerate(row) {
  regenerateQuestId.value = row.questionnaire_id;
  regenerateDialogVisible.value = true;
}

function submitRegenerate() {
  // 实际应调用后端重新生成链接/二维码
  ElMessage.success('问卷入口已重新生成');
  regenerateDialogVisible.value = false;
  handleRefresh();
}

async function handleCopy(row) {
  const newQuest = copyQuestionnaire(row);
  // 打开新增抽屉并填充
  openFormDrawer(newQuest);
}

async function handleDelete(row) {
  await confirm('确定删除该问卷吗？此操作不可恢复。');
  deleteQuestionnaire(row.questionnaire_id);
  ElMessage.success('已删除');
  handleRefresh();
  emit('data-change');
}

async function handleRelate(row) {
  if (row.data_relation_status === 'related') {
    ElMessage.warning('该问卷已关联评价数据');
    return;
  }
  await confirm('确定将问卷指标值同步至关联评价任务吗？');
  relateToEvaluation(row.questionnaire_id);
  ElMessage.success('数据已关联评价任务');
  handleRefresh();
  emit('data-change');
}

function handleExport() {
  const sheets = [{
    name: '问卷调查记录',
    data: dataObj.list.map(q => ({
      '问卷名称': q.name,
      '问卷编码': q.code,
      '关联评价任务': q.task_name,
      '调查对象范围': q.object_scope,
      '发放方式': q.issue_type_name,
      '起止时间': `${q.start_time} 至 ${q.end_time}`,
      '状态': q.status_name,
      '创建人': q.create_by_name,
      '创建时间': q.create_time,
      '填写人数': q.fill_count,
      '最终填写率': q.final_fill_rate ? q.final_fill_rate + '%' : '',
      '最终平均分': q.final_average_score || ''
    }))
  }];
  exportToExcel(sheets, '问卷调查记录', `问卷调查记录_${new Date().toLocaleDateString()}.xlsx`);
}

async function handleBatchExport() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  const selected = dataObj.list.filter(q => checkedIds.value.includes(q.questionnaire_id));
  // 实际应导出详细数据，这里仅示例
  ElMessage.success(`已选中 ${selected.length} 条记录，批量导出功能待实现`);
}

function handleViewDetail(row) {
  dataObj.detailObj = row;
  detailRef.value.open();
}

function handleFieldClick(fieldName, value, displayValue) {
  const newParams = { ...searchParams.value, [fieldName]: value };
  if (displayValue !== undefined) newParams[`${fieldName}_display`] = displayValue;
  searchParams.value = newParams;
  handleRefresh();
}

function handleClearField(fieldName) {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  delete newParams[`${fieldName}_display`];
  searchParams.value = newParams;
  handleRefresh();
}

function handleClick() {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
  gridApi.query();
}

function handleSerachShow() {
  drawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function arrowChange() {
  emit('arrow-change');
}

defineExpose({
  activeName
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 详情抽屉 -->
    <surveyDetail ref="detailRef" :detail-obj="dataObj.detailObj" />

    <!-- 搜索抽屉 -->
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 新增/编辑抽屉 -->
    <FormDrawer :title="isEdit ? '编辑问卷' : '新增问卷'" @confirm="submitForm">
      <QuestForm ref="formRef" />
      <div class="questions-section">
        <div class="section-header">
          <span>题目列表</span>
          <el-button type="primary" size="small" @click="addQuestion">添加题目</el-button>
        </div>
        <div v-if="questions.length === 0" class="empty-tip">暂无题目，请点击添加</div>
        <div v-for="(q, idx) in questions" :key="idx" class="question-item">
          <div class="question-info">
            <span class="question-type">{{ q.question_type === 'score' ? '打分题' : (q.question_type === 'radio' ? '单选题' : '多选题') }}</span>
            <span class="question-title">{{ q.title }}</span>
            <span v-if="q.score !== undefined" class="question-score">(分值: {{ q.score }})</span>
          </div>
          <div class="question-actions">
            <el-button link type="primary" @click="editQuestion(idx)">编辑</el-button>
            <el-button link type="danger" @click="deleteQuestion(idx)">删除</el-button>
          </div>
        </div>
      </div>
    </FormDrawer>

    <!-- 题目编辑弹窗 -->
    <el-dialog v-model="questionDialogVisible" :title="currentQuestion.index !== undefined ? '编辑题目' : '添加题目'" width="600px">
      <el-form :model="currentQuestion" label-width="100px">
        <el-form-item label="题目内容" required>
          <el-input v-model="currentQuestion.title" type="textarea" rows="2" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="题目类型" required>
          <el-select v-model="currentQuestion.question_type" placeholder="请选择">
            <el-option label="单选题" value="radio" />
            <el-option label="多选题" value="checkbox" />
            <el-option label="打分题" value="score" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentQuestion.question_type === 'score'" label="分值" required>
          <el-input-number v-model="currentQuestion.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item v-if="currentQuestion.question_type !== 'score'" label="选项" required>
          <div v-for="(opt, idx) in currentQuestion.options" :key="idx" class="option-item">
            <el-input v-model="opt.content" placeholder="选项内容" style="width: 80%" />
            <el-button link type="danger" @click="removeOption(idx)">删除</el-button>
          </div>
          <el-button type="primary" size="small" @click="addOption">添加选项</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="questionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveQuestion">保存</el-button>
      </template>
    </el-dialog>

    <!-- 延长时间弹窗 -->
    <el-dialog v-model="extendDialogVisible" title="延长结束时间" width="400px">
      <el-form label-width="120px">
        <el-form-item label="新的结束时间" required>
          <el-date-picker v-model="newEndTime" type="datetime" placeholder="请选择" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="extendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitExtend">确认</el-button>
      </template>
    </el-dialog>

    <!-- 重新生成入口弹窗 -->
    <el-dialog v-model="regenerateDialogVisible" title="重新生成问卷入口" width="400px">
      <p>重新生成后，原链接和二维码将失效，请谨慎操作。是否继续？</p>
      <template #footer>
        <el-button @click="regenerateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRegenerate">确认</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)" :name="item.label" />
            </el-tabs>
          </div>

          <!-- 钻取筛选标签 -->
          <el-tag v-if="searchParams.task_id" type="primary" closable @close="handleClearField('task_id')">
            任务：{{ evalTaskList.find(t => t.task_id === searchParams.task_id)?.name }}
          </el-tag>
          <el-tag v-if="searchParams.status" type="info" closable @close="handleClearField('status')">
            状态：{{ surveyStatusList.find(s => s.id === searchParams.status)?.name }}
          </el-tag>
          <el-tag v-if="searchParams.name" type="success" closable @close="handleClearField('name')">
            问卷名称：{{ searchParams.name }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="openFormDrawer()" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton v-if="activeName !== '全部'" content="批量导出" icon-name="FolderOpened" :disabled="isEmpty(checkedIds)" @click="handleBatchExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列渲染 -->
      <template #name="{ row }">
        <el-text @click="handleViewDetail(row)" class="common-align" type="primary">{{ row.name }}</el-text>
      </template>

      <template #code="{ row }">
        <el-text @click="handleFieldClick('code', row.code)" class="common-align" type="primary">{{ row.code }}</el-text>
      </template>

      <template #taskName="{ row }">
        <el-text @click="handleFieldClick('task_id', row.task_id, row.task_name)" class="common-align" type="primary">{{ row.task_name }}</el-text>
      </template>

      <template #status="{ row }">
        <el-text @click="handleFieldClick('status', row.status, row.status_name)" class="common-align" type="primary">{{ row.status_name }}</el-text>
      </template>

      <template #url="{ row }">
        <a v-if="row.url_qrcode" :href="row.url_qrcode" target="_blank" style="color: #409eff">可查看</a>
        <span v-else>-</span>
      </template>

      <template #preview="{ row }">
        <el-button link type="primary" @click="handleViewDetail(row)">可预览</el-button>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px">
          <IconButton content="详情" icon-name="View" @click="handleViewDetail(row)" />
          <IconButton v-if="row.status === 'not_started'" content="编辑" icon-name="edit" @click="openFormDrawer(row)" />
          <IconButton v-if="row.status === 'not_started'" content="启动" icon-name="VideoPlay" @click="handleStart(row)" />
          <IconButton v-if="row.status === 'in_progress'" content="延长时间" icon-name="Timer" @click="handleExtend(row)" />
          <IconButton v-if="row.status === 'in_progress'" content="结束" icon-name="VideoPause" @click="handleFinish(row)" />
          <IconButton v-if="row.status === 'in_progress'" content="查看实时结果" icon-name="TrendCharts" @click="handleViewDetail(row)" />
          <IconButton v-if="row.status === 'in_progress'" content="重新生成入口" icon-name="Refresh" @click="handleRegenerate(row)" />
          <IconButton content="复制问卷" icon-name="CopyDocument" @click="handleCopy(row)" />
          <IconButton v-if="row.status === 'not_started'" content="删除" icon-name="Delete" color="#F56C6C" @click="handleDelete(row)" />
          <IconButton v-if="row.status === 'finished'" content="关联评价数据" icon-name="Connection" @click="handleRelate(row)" />
          <IconButton v-if="row.status === 'finished'" content="导出原始数据" icon-name="download" @click="handleExport" />
          <IconButton v-if="row.status === 'finished'" content="导出统计报表" icon-name="DataAnalysis" @click="handleExport" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：问卷数量{{ dataObj.list.length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：问卷总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.questions-section {
  margin-top: 20px;
  padding: 16px;
  border-top: 1px solid #eee;
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .empty-tip {
    text-align: center;
    color: #999;
    padding: 20px;
  }
  .question-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 6px;
    margin-bottom: 8px;
    .question-info {
      flex: 1;
      .question-type {
        background: #e6f7ff;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-right: 8px;
      }
      .question-title {
        font-weight: 500;
      }
      .question-score {
        color: #666;
        margin-left: 8px;
      }
    }
    .question-actions {
      button {
        margin-left: 8px;
      }
    }
  }
}
.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
