<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import CompareDetailDrawer from './components/compareDetail.vue';
import {
  getCompareMgmtPage,
  createCompareMgmt,
  updateCompareMgmt,
  scoreCompareMgmt,
  awardCompareMgmt,
  exportCompareMgmt,
  getCompareMgmtDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/compareMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCreateFormSchema,
  useEditFormSchema,
  useScoreFormSchema,
  useAwardFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/moralEdu/compareMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '打分中': 'warning',
    '已汇总': 'success',
  };
  return map[status] || 'info';
};

// 时间戳格式化
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 提取日期部分（用于筛选）
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean});
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] !== undefined) {
    const existing = tagFilters.value[field];
    if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
      delete tagFilters.value[field];
    } else if (!Array.isArray(existing) && existing === value) {
      delete tagFilters.value[field];
    } else {
      tagFilters.value[field] = value;
    }
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    className: '班级',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [ScoreDrawer, scoreDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => scoreDrawerApi.close(),
});

const [AwardDrawer, awardDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => awardDrawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const scoreIds = ref([]);
const awardIds = ref([]);

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getCompareMgmtPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'className':
            itemValue = item.className;
            break;
          case 'status':
            itemValue = item.status;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = res.total;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 分页接口已联调成功，出错时返回空数据
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取评比列表失败，请检查网络或联系管理员');
  } finally {
    dataObj.loading = false;
  }
  return dataObj;
};

function handleRefresh() {
  gridApi.reload();
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  gridApi.reload();
}

async function handleExport() {
  try {
    const loading = ElLoading.service({text: '正在导出...'});
    try {
      const data = await exportCompareMgmt(searchParams.value);
      downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 批量打分
async function handleBatchScore() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个评比记录');
    return;
  }
  const scoringRows = checkedRows.value.filter(row => row.status === '打分中');
  if (scoringRows.length === 0) {
    ElMessage.warning('请选择状态为【打分中】的记录进行打分');
    return;
  }
  scoreIds.value = scoringRows.map(row => row.id);
  scoreFormApi.resetForm();
  scoreDrawerApi.open();
}

// 批量授予
async function handleBatchAward() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个评比记录');
    return;
  }
  const finishedRows = checkedRows.value.filter(row => row.status === '已汇总');
  if (finishedRows.length === 0) {
    ElMessage.warning('请选择状态为【已汇总】的记录进行授予');
    return;
  }
  awardIds.value = finishedRows.map(row => row.id);
  awardFormApi.resetForm();
  awardDrawerApi.open();
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

function handleEdit(row) {
  if (row.status !== '打分中') {
    ElMessage.warning('只有打分中的记录可以编辑');
    return;
  }
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 单行打分
async function handleScore(row) {
  if (row.status !== '打分中') {
    ElMessage.warning('只有打分中的记录可以打分');
    return;
  }
  scoreIds.value = [row.id];
  scoreFormApi.resetForm();
  scoreDrawerApi.open();
}

// 单行授予
async function handleAward(row) {
  if (row.status !== '已汇总') {
    ElMessage.warning('只有已汇总的记录可以授予称号');
    return;
  }
  awardIds.value = [row.id];
  awardFormApi.resetForm();
  awardDrawerApi.open();
}

// 发起/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '发起中...'});
    try {
      let res;
      // 确保 totalScore 和 status 存在
      const submitData = {
        ...values,
        totalScore: values.totalScore !== undefined ? values.totalScore : 0,
        status: values.status || '打分中',
      };
      if (isEditMode.value) {
        res = await updateCompareMgmt({...submitData, id: currentEditId.value});
      } else {
        res = await createCompareMgmt(submitData);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '发起成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '发起失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: isEditMode.value ? useEditFormSchema() : useCreateFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await createFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getCompareMgmtDetail({id: currentEditId.value});
          await createFormApi.setValues({
            className: detail.className,
            cycle: detail.cycle,
            totalScore: detail.totalScore !== undefined ? detail.totalScore : 0,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认值
        await createFormApi.setValues({totalScore: 0, status: '打分中'});
      }
    }
  },
});

// 打分表单
const [ScoreForm, scoreFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '提交打分...'});
    try {
      const res = await scoreCompareMgmt({ids: scoreIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('打分成功，已自动汇总并计算排名');
        scoreDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('打分失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useScoreFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '提交'},
});

// 授予表单
const [AwardForm, awardFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '授予中...'});
    try {
      const res = await awardCompareMgmt({ids: awardIds.value, ...values});
      if (res && res !== false) {
        ElMessage.success('授予成功，已生成操行评定');
        awardDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('授予失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAwardFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认'},
});

// 查看详情
const compareDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  compareDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <CompareDetailDrawer ref="compareDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <CreateForm/>
    </CreateDrawer>
    <ScoreDrawer :title="textObj.scoreText">
      <ScoreForm/>
    </ScoreDrawer>
    <AwardDrawer :title="textObj.awardText">
      <AwardForm/>
    </AwardDrawer>
    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="发起" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="打分" icon-name="EditPen" @click="handleBatchScore"/>
          <IconButton content="授予" icon-name="Trophy" @click="handleBatchAward"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #className="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.className }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #awardTime="{ row }">
        <el-text>{{ formatTimestamp(row.awardTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '打分中'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '打分中'" content="打分" icon-name="EditPen"
                      @click="handleScore(row)"/>
          <IconButton v-if="row.status === '已汇总'" content="授予" icon-name="Trophy"
                      @click="handleAward(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
