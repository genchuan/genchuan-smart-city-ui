<script setup>
import {reactive, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import DormCompareDetailDrawer from './components/dormCompareDetail.vue';
import {
  getDormComparePage,
  createDormCompare,
  scoreDormCompare,
  summaryDormCompare,
  pushDormCompare,
  updateDormCompare,
  exportDormCompare,
  getDormCompareDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCompare/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useEditFormSchema,
  useAddFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCompare/form.js';

const getStatusType = (status) => {
  const map = {'打分中': 'warning', '已汇总': 'success'};
  return map[status] || 'info';
};

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
  const map = {dormNum: '宿舍号', status: '状态', creator: '创建人', createTime: '创建时间'};
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close()
});
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => editDrawerApi.close()
});
const [AddDrawer, addDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => addDrawerApi.close()
});

const dataObj = reactive({
  totalShow: false, detailObj: {}, total: 0, currentPage: 1, pageSize: 10, list: [], loading: false,
});
const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const currentEditId = ref(null);
const scoreIds = ref([]);
const scoreDialogVisible = ref(false);
const batchScoreValue = ref(null);

async function handleBatchScore() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个评比记录');
  const scoringRows = checkedRows.value.filter(row => row.status === '打分中');
  if (scoringRows.length === 0) return ElMessage.warning('请选择状态为【打分中】的记录进行打分');
  scoreIds.value = scoringRows.map(row => row.id);
  batchScoreValue.value = null;
  scoreDialogVisible.value = true;
}

async function submitBatchScore() {
  if (batchScoreValue.value === null || batchScoreValue.value === '') {
    return ElMessage.warning('请输入得分');
  }
  const loading = ElLoading.service({text: '打分中...'});
  try {
    const scoreData = scoreIds.value.map(id => ({
      id: id,
      score: batchScoreValue.value
    }));
    const res = await scoreDormCompare(scoreData);
    if (res && res !== false) {
      ElMessage.success('打分成功');
      scoreDialogVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('打分失败');
    }
  } catch (error) {
    console.error('打分失败:', error);
    ElMessage.error(error?.message || '打分失败');
  } finally {
    loading.close();
  }
}

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getDormComparePage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'dormNum':
            itemValue = item.dormNum;
            break;
          case 'status':
            itemValue = item.status;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            itemValue = item.createTime
              ? getDateFromTimestamp(item.createTime)
              : '';
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

    // ✅ 关键修复点：使用前端筛选后的长度
    dataObj.total = filtered.length;
    dataObj.list = filtered;

    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);

    dataObj.total = 0;
    dataObj.list = [];

    ElMessage.error('获取宿舍评比列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
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
  const loading = ElLoading.service({text: '正在导出...'});
  try {
    const data = await exportDormCompare(searchParams.value);
    downloadFileFromBlobPart({fileName: `${textObj.excelName}.xls`, source: data});
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
}

async function handleBatchSummary() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个评比记录');
  const scoringRows = checkedRows.value.filter(row => row.status === '打分中');
  if (scoringRows.length === 0) return ElMessage.warning('请选择状态为【打分中】的记录进行汇总');

  await ElMessageBox.confirm(`确认汇总选中的 ${scoringRows.length} 个宿舍评比？汇总后将自动计算排名。`, '批量汇总确认', {
    confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',
  });

  const loading = ElLoading.service({ text: '汇总中...' });
  try {
    const ids = scoringRows.map(row => row.id);
    const sumTime = Date.now();
    const res = await summaryDormCompare({ ids, sumTime: String(sumTime) });
    if (res && res !== false) {
      ElMessage.success('批量汇总成功');
      handleRefresh();
    } else {
      ElMessage.error(res?.msg || '批量汇总失败');
    }
  } catch (error) {
    console.error('汇总失败:', error);
    ElMessage.error(error?.message || '批量汇总失败');
  } finally {
    loading.close();
  }
}

async function handleBatchPush() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个评比记录');
  const summarizedRows = checkedRows.value.filter(row => row.status === '已汇总');
  if (summarizedRows.length === 0) return ElMessage.warning('请选择状态为【已汇总】的记录进行推送');

  await ElMessageBox.confirm(`确认推送选中的 ${summarizedRows.length} 个宿舍评比结果？推送后学生家长可见。`, '批量推送确认', {
    confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',
  });

  const loading = ElLoading.service({ text: '推送中...' });
  try {
    const ids = summarizedRows.map(row => row.id);
    const pushTime = Date.now();
    const res = await pushDormCompare({ ids, pushTime: String(pushTime) });
    if (res && res !== false) {
      ElMessage.success('批量推送成功');
      handleRefresh();
    }
  } catch (error) {
    console.error('推送失败:', error);
  } finally {
    loading.close();
  }
}

async function handleEdit(row) {
  if (row.status !== '打分中') return ElMessage.warning('只有打分中的记录可以编辑');
  currentEditId.value = row.id;
  try {
    const detail = await getDormCompareDetail({id: row.id});
    editFormApi.setValues({
      dormNum: detail.dormNum,
      cycle: detail.cycle,
      score: detail.score,
      status: detail.status,
      remark: detail.remark,
    });
    editDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败，请检查网络或联系管理员');
  }
}

async function handlePush(row) {
  if (row.status !== '已汇总') return ElMessage.warning('只有已汇总的记录可以推送');
  await ElMessageBox.confirm(`确认推送宿舍 ${row.dormNum} 的评比结果？`, '推送确认', {
    confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',
  });
  const loading = ElLoading.service({ text: '推送中...' });
  try {
    const pushTime = Date.now();
    const res = await pushDormCompare({ ids: [row.id], pushTime: String(pushTime) });
    if (res && res !== false) {
      ElMessage.success('推送成功');
      handleRefresh();
    }
  } catch (error) {
    console.error('推送失败:', error);
  } finally {
    loading.close();
  }
}

// 新增记录 - 修复点：安全重置表单
async function handleAdd() {
  if (addFormApi) {
    if (typeof addFormApi.resetForm === 'function') addFormApi.resetForm();
    else if (typeof addFormApi.resetValues === 'function') addFormApi.resetValues();
  }
  addDrawerApi.open();
}

const [EditForm, editFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '更新中...'});
    try {
      const res = await updateDormCompare({...values, id: currentEditId.value});
      if (res && res !== false) {
        ElMessage.success('更新成功');
        editDrawerApi.close();
        handleRefresh();
      } else ElMessage.error('更新失败');
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useEditFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

const [AddForm, addFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '创建中...'});
    try {
      const res = await createDormCompare(values);
      if (res && res !== false) {
        ElMessage.success('新增成功');
        addDrawerApi.close();
        handleRefresh();
      } else ElMessage.error('新增失败');
    } catch (error) {
      console.error('新增失败:', error);
      ElMessage.error(error?.message || '新增失败');
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAddFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确定'},
});

const dormCompareDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  dormCompareDetailDrawerRef.value.open();
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
    <DormCompareDetailDrawer ref="dormCompareDetailDrawerRef" :detail-obj="dataObj.detailObj"
                             @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <EditDrawer :title="textObj.editText">
      <EditForm/>
    </EditDrawer>
    <AddDrawer title="新增评比">
      <AddForm/>
    </AddDrawer>

    <el-dialog v-model="scoreDialogVisible" title="批量打分" width="400px">
      <el-form label-width="80px">
        <el-form-item label="得分">
          <el-input-number v-model="batchScoreValue" :min="0" :max="100" :precision="2" :step="1"
                           placeholder="请输入得分" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scoreDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBatchScore">确认</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <ElTag v-for="(value, field) in tagFilters" :key="field" type="success" closable
               @close="removeFilterTag(field)"
               style="height:32px; margin:4px 8px 4px 0; line-height:32px">
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleAdd"/>
          <IconButton content="打分" icon-name="EditPen" @click="handleBatchScore"/>
          <IconButton content="汇总" icon-name="Check" @click="handleBatchSummary"/>
          <IconButton content="推送" icon-name="Promotion" @click="handleBatchPush"/>
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

      <template #dormNum="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor:pointer">
          {{ row.dormNum }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor:pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor:pointer">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor:pointer">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #sumTime="{ row }">
        <el-text>{{ formatTimestamp(row.sumTime) }}</el-text>
      </template>
      <template #pushTime="{ row }">
        <el-text>{{ formatTimestamp(row.pushTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '打分中'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '已汇总'" content="推送" icon-name="Promotion"
                      @click="handlePush(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
