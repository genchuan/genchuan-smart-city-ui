<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import DormAssignDetailDrawer from './components/dormAssignDetail.vue';
import {
  getDormAssignPage,
  assignDormAssign,
  adjustDormAssign,
  updateDormAssign,
  exportDormAssign,
  getDormAssignDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/dormAssign/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useAssignFormSchema,
  useAdjustFormSchema,
  useEditFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/enrollMgmt/dormAssign/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// 标签筛选
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
    dormNum: '宿舍号',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    studentId: '学号',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// 抽屉组件
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [AssignDrawer, assignDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => assignDrawerApi.close(),
});

const [AdjustDrawer, adjustDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => adjustDrawerApi.close(),
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => editDrawerApi.close(),
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
const currentEditId = ref(null);
const batchIds = ref([]);      // 批量操作选中的ID列表

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

const getStatusType = (status) => {
  const map = {
    '未分配': 'warning',
    '已分配': 'success',
  };
  return map[status] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getDormAssignPage(params);

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
          case 'studentId':
            itemValue = item.studentId;
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

    ElMessage.error('获取宿舍分配记录失败，请检查网络或联系管理员');
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
  try {
    const loading = ElLoading.service({text: '正在导出...'});
    try {
      const data = await exportDormAssign(searchParams.value);
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

// 批量分配
function handleBatchAssign() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个分配记录');
    return;
  }
  const unassignedRows = checkedRows.value.filter(row => row.status === '未分配');
  if (unassignedRows.length === 0) {
    ElMessage.warning('请选择状态为【未分配】的记录进行分配');
    return;
  }
  batchIds.value = unassignedRows.map(row => row.id);
  assignFormApi.resetForm();
  assignDrawerApi.open();
}

// 批量调整
function handleBatchAdjust() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个分配记录');
    return;
  }
  const assignedRows = checkedRows.value.filter(row => row.status === '已分配');
  if (assignedRows.length === 0) {
    ElMessage.warning('请选择状态为【已分配】的记录进行调整');
    return;
  }
  batchIds.value = assignedRows.map(row => row.id);
  adjustFormApi.resetForm();
  adjustDrawerApi.open();
}

// 单行分配
async function handleAssign(row) {
  if (row.status !== '未分配') {
    ElMessage.warning('只有未分配状态的记录可以分配');
    return;
  }
  batchIds.value = [row.id];
  assignFormApi.resetForm();
  assignDrawerApi.open();
}

// 单行调整
async function handleAdjust(row) {
  if (row.status !== '已分配') {
    ElMessage.warning('只有已分配状态的记录可以调整');
    return;
  }
  batchIds.value = [row.id];
  adjustFormApi.resetForm();
  adjustDrawerApi.open();
}

// 分配表单提交
const [AssignForm, assignFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '分配中...'});
    try {
      // 生成床位ID数组（起始床位号 + 索引）
      const bedStartNum = values.bedStartNum;
      const newBedIds = batchIds.value.map((_, idx) => bedStartNum + idx);
      const dormId = values.dormNum; // 模拟数据中 dormId 使用 dormNum 字符串（实际应转换，这里简化）
      const res = await assignDormAssign({
        ids: batchIds.value,
        dormId: dormId,
        bedIds: newBedIds,
        ruleContent: values.ruleContent || '智能分配',
        assignTime: Date.now(),
      });
      if (res && res !== false) {
        ElMessage.success('分配成功');
        assignDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('分配失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAssignFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认分配'},
});

// 调整表单提交
const [AdjustForm, adjustFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '调整中...'});
    try {
      const bedStartNum = values.newBedStartNum;
      const newBedIds = batchIds.value.map((_, idx) => bedStartNum + idx);
      const newDormId = values.newDormNum; // 简化，实际应为宿舍ID
      const res = await adjustDormAssign({
        ids: batchIds.value,
        newDormId: newDormId,
        newBedIds: newBedIds,
        adjustTime: Date.now(),
        remark: values.remark,
      });
      if (res && res !== false) {
        ElMessage.success('调整成功');
        adjustDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('调整失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAdjustFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '确认调整'},
});

// 编辑
async function handleEdit(row) {
  currentEditId.value = row.id;
  try {
    const detail = await getDormAssignDetail({id: row.id});
    editFormApi.setValues({
      studentId: detail.studentId,
      dormNum: detail.dormNum,
      bedId: detail.bedId,
      status: detail.status,     // 补充状态赋值
      remark: detail.remark,
    });
    editDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败，请检查网络或联系管理员');
  }
}

// 编辑表单
const [EditForm, editFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: '保存中...'});
    try {
      // 确保 status 字段被传递
      const res = await updateDormAssign({...values, id: currentEditId.value});
      if (res && res !== false) {
        ElMessage.success('编辑成功');
        editDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('编辑失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useEditFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 详情抽屉
const dormAssignDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  dormAssignDetailDrawerRef.value.open();
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

defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <DormAssignDetailDrawer ref="dormAssignDetailDrawerRef" :detail-obj="dataObj.detailObj"
                            @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <AssignDrawer title="分配宿舍床位">
      <AssignForm/>
    </AssignDrawer>
    <AdjustDrawer title="调整宿舍床位">
      <AdjustForm/>
    </AdjustDrawer>
    <EditDrawer title="编辑分配信息">
      <EditForm/>
    </EditDrawer>
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
          <IconButton :content="textObj.assignText" icon-name="User" @click="handleBatchAssign"/>
          <IconButton :content="textObj.adjustText" icon-name="EditPen" @click="handleBatchAdjust"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
        </div>
      </template>

      <!-- 钻取列 -->
      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
      </template>
      <template #dormNum="{ row }">
        <el-text @click="handleFilterTagClick('dormNum', row.dormNum)" type="primary"
                 style="cursor: pointer;">
          {{ row.dormNum || '-' }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #finishRate="{ row }">
        <el-text>{{ row.finishRate }}%</el-text>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #assignTime="{ row }">
        <el-text>{{ formatTimestamp(row.assignTime) }}</el-text>
      </template>
      <template #adjustTime="{ row }">
        <el-text>{{ formatTimestamp(row.adjustTime) }}</el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未分配'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未分配'" content="分配" icon-name="User"
                      @click="handleAssign(row)"/>
          <IconButton v-if="row.status === '已分配'" content="调整" icon-name="EditPen"
                      @click="handleAdjust(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
