<script setup>
import {computed, reactive, ref, watch, nextTick} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {downloadFileFromBlobPart} from '@vben/utils';
import StudentDetailDrawer from './components/studentDetail.vue';
import {
  getStudentInfoPage,
  createStudentInfo,
  updateStudentInfo,
  deleteStudentInfo,
  deleteStudentInfoList,
  exportStudentInfo,
  getStudentInfoDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/studentInfo/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/studentInfo/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '在籍': 'success',
    '休学': 'warning',
    '退学': 'danger',
    '异动': 'info',
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

// 提取日期部分
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
    major: '专业',
    className: '班级',
    status: '学籍状态',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 原有变量 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
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

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({records}) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };

    const res = await getStudentInfoPage(params);

    let filtered = res.list;

    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter((item) => {
        let itemValue;
        switch (field) {
          case 'major':
            itemValue = item.major;
            break;
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

    ElMessage.error('获取学生列表失败，请检查网络或联系管理员');
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
      const data = await exportStudentInfo(searchParams.value);
      downloadFileFromBlobPart({fileName: '学生信息列表.xls', source: data});
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

async function handleBatchDelete() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条学生记录');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${checkedIds.value.length} 条学生记录？删除后不可恢复。`, '批量删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '删除中...'});
    try {
      const res = await deleteStudentInfoList({ids: checkedIds.value});
      if (res && res !== false) {
        ElMessage.success('批量删除成功');
        handleRefresh();
      } else {
        ElMessage.error('批量删除失败');
      }
    } finally {
      loading.close();
    }
  } catch {
    // 取消操作
  }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}

function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确认删除学生 ${row.name}（学号：${row.studentNo}）？删除后不可恢复。`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({text: '删除中...'});
    try {
      const res = await deleteStudentInfo({id: row.id});
      if (res && res !== false) {
        ElMessage.success('删除成功');
        handleRefresh();
      } else {
        ElMessage.error('删除失败');
      }
    } finally {
      loading.close();
    }
  } catch {
    // 取消操作
  }
}

// 新增/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    // 校验唯一性（模拟）
    if (!isEditMode.value) {
      const exist = dataObj.list.some(item => item.studentNo === values.studentNo || item.idCard === values.idCard);
      if (exist) {
        ElMessage.error('学号或身份证号已存在');
        return;
      }
    } else {
      const exist = dataObj.list.some(item => item.id !== currentEditId.value && (item.studentNo === values.studentNo || item.idCard === values.idCard));
      if (exist) {
        ElMessage.error('学号或身份证号已存在');
        return;
      }
    }
    const loading = ElLoading.service({text: isEditMode.value ? '更新中...' : '保存中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateStudentInfo({...values, id: currentEditId.value});
      } else {
        res = await createStudentInfo(values);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '新增成功');
        createDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '更新失败' : '新增失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      await createFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getStudentInfoDetail({id: currentEditId.value});
          await createFormApi.setValues({
            studentNo: detail.studentNo,
            name: detail.name,
            idCard: detail.idCard,
            grade: detail.grade,
            educationLevel: detail.educationLevel,
            studyForm: detail.studyForm,
            major: detail.major,
            className: detail.className,
            studentType: detail.studentType,
            status: detail.status,
            phone: detail.phone,
            parentPhone: detail.parentPhone,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      }
    }
  },
});

// 查看详情
const studentDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  studentDetailDrawerRef.value.open();
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

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({columns: gridColumns.value});
  gridApi.reload();
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
    <StudentDetailDrawer ref="studentDetailDrawerRef" :detail-obj="dataObj.detailObj"
                         @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <CreateDrawer :title="isEditMode ? '编辑学生信息' : '新增学生信息'">
      <CreateForm/>
    </CreateDrawer>
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
          <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton content="批量删除" icon-name="Delete" color="#F56C6C"
                      @click="handleBatchDelete"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>

      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{
            row.name
          }}
        </el-text>
      </template>
      <template #major="{ row }">
        <el-text @click="handleFilterTagClick('major', row.major)" type="primary"
                 style="cursor: pointer;">{{ row.major }}
        </el-text>
      </template>
      <template #className="{ row }">
        <el-text @click="handleFilterTagClick('className', row.className)" type="primary"
                 style="cursor: pointer;">{{ row.className }}
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
                 style="cursor: pointer;">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton content="删除" icon-name="Delete" color="#F56C6C" @click="handleDelete(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
