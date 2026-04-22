<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import BedDetailDrawer from './components/bedDetail.vue';
import {
  getMockList,
  getBedMgmtPage,
  createBedMgmt,
  assignBedMgmt,
  adjustBedMgmt,
  updateBedMgmt,
  exportBedMgmt,
  getBedMgmtDetail,
  getStudentOptions,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/bedMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useBedFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/dormMgmt/bedMgmt/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '未分配': 'warning',
    '已分配': 'success',
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
    building: '楼栋',
    roomNum: '房间号',
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

// ---------- 抽屉组件 ----------
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
const assignBedIds = ref([]);
const adjustBedId = ref(null);
const currentAdjustRow = ref(null);

// 批量分配弹窗相关
const batchAssignVisible = ref(false);
const batchAssignList = ref([]);

// 单行分配弹窗相关
const singleAssignVisible = ref(false);
const currentSingleBed = ref(null);
const selectedStudentId = ref(null);

// 单行调整弹窗相关
const adjustVisible = ref(false);
const currentAdjustBed = ref(null);
const newStudentId = ref(null);

// 获取学生列表
const studentOptions = ref([]);
const loadStudentOptions = async () => {
  const res = await getStudentOptions();
  studentOptions.value = res;
};
loadStudentOptions();

const getTableData = async ({page}) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getBedMgmtPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'building':
            itemValue = item.building;
            break;
          case 'roomNum':
            itemValue = item.roomNum;
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
    dataObj.total = res.total || filtered.length;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = getMockList();
    let filtered = mockData;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'building':
            itemValue = item.building;
            break;
          case 'roomNum':
            itemValue = item.roomNum;
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
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
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
      const data = await exportBedMgmt(searchParams.value);
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

// 新增床位
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  bedFormDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 编辑床位
function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  bedFormDrawerApi.open(); // 打开抽屉，数据填充由 onOpenChange 负责
}

// 批量分配
async function handleBatchAssign() {
  const unassignedRows = checkedRows.value.filter(row => row.status === '未分配');
  if (unassignedRows.length === 0) {
    ElMessage.warning('请选择状态为【未分配】的床位进行分配');
    return;
  }
  batchAssignList.value = unassignedRows.map(row => ({
    id: row.id,
    building: row.building,
    roomNum: row.roomNum,
    bedNum: row.bedNum,
    studentId: null,
  }));
  batchAssignVisible.value = true;
}

async function submitBatchAssign() {
  const missing = batchAssignList.value.filter(item => !item.studentId);
  if (missing.length) {
    ElMessage.warning('请为所有床位选择学生');
    return;
  }
  const loading = ElLoading.service({text: '分配中...'});
  try {
    const bedIds = batchAssignList.value.map(item => item.id);
    const studentIds = batchAssignList.value.map(item => item.studentId);
    const res = await assignBedMgmt({bedIds, studentIds});
    if (res && res !== false) {
      ElMessage.success('分配成功');
      batchAssignVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('分配失败');
    }
  } finally {
    loading.close();
  }
}

// 单行分配
async function handleAssign(row) {
  if (row.status !== '未分配') {
    ElMessage.warning('只有未分配的床位可以分配');
    return;
  }
  currentSingleBed.value = row;
  selectedStudentId.value = null;
  singleAssignVisible.value = true;
}

async function submitSingleAssign() {
  if (!selectedStudentId.value) {
    ElMessage.warning('请选择学生');
    return;
  }
  const loading = ElLoading.service({text: '分配中...'});
  try {
    const res = await assignBedMgmt({
      bedIds: [currentSingleBed.value.id],
      studentIds: [selectedStudentId.value],
    });
    if (res && res !== false) {
      ElMessage.success('分配成功');
      singleAssignVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('分配失败');
    }
  } finally {
    loading.close();
  }
}

// 单行调整
async function handleAdjust(row) {
  if (row.status !== '已分配') {
    ElMessage.warning('只有已分配的床位可以调整');
    return;
  }
  currentAdjustBed.value = row;
  newStudentId.value = null;
  adjustVisible.value = true;
}

async function submitAdjust() {
  if (!newStudentId.value) {
    ElMessage.warning('请选择新学生');
    return;
  }
  if (currentAdjustBed.value.studentId === newStudentId.value) {
    ElMessage.warning('新学生与原学生相同，无需调整');
    return;
  }
  const loading = ElLoading.service({text: '调整中...'});
  try {
    const res = await adjustBedMgmt({
      oldBedId: currentAdjustBed.value.id,
      newBedId: currentAdjustBed.value.id,
      studentId: newStudentId.value,
    });
    if (res && res !== false) {
      ElMessage.success('调整成功');
      adjustVisible.value = false;
      handleRefresh();
    } else {
      ElMessage.error('调整失败');
    }
  } finally {
    loading.close();
  }
}

// 新增/编辑表单（使用 useBedFormSchema）
const [BedForm, bedFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: async (values) => {
    const loading = ElLoading.service({text: isEditMode.value ? '保存中...' : '新增中...'});
    try {
      let res;
      if (isEditMode.value) {
        res = await updateBedMgmt({...values, id: currentEditId.value});
      } else {
        res = await createBedMgmt(values);
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
        bedFormDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(isEditMode.value ? '编辑失败' : '新增失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useBedFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: {content: '保存'},
});

// 修复的核心：在抽屉打开时重置表单并加载编辑数据
const [BedFormDrawer, bedFormDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => bedFormDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 每次打开前先重置表单（清空值 + 清除校验错误）
      await bedFormApi.resetForm();
      // 如果是编辑模式，则填充数据
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getBedMgmtDetail({id: currentEditId.value});
          await bedFormApi.setValues({
            building: detail.building,
            floor: detail.floor,
            roomNum: detail.roomNum,
            bedNum: detail.bedNum,
            status: detail.status,
            remark: detail.remark || '',
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          bedFormDrawerApi.close(); // 加载失败则关闭抽屉
        }
      } else {
        // 新增模式：设置默认状态为“未分配”
        await bedFormApi.setValues({ status: '未分配' });
      }
    }
  },
});

// 详情抽屉
const bedDetailDrawerRef = ref(null);

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  bedDetailDrawerRef.value.open();
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
    <BedDetailDrawer ref="bedDetailDrawerRef" :detail-obj="dataObj.detailObj"
                     @refresh="handleRefresh"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>

    <!-- 新增/编辑床位抽屉（使用 useVbenForm） -->
    <BedFormDrawer :title="isEditMode ? textObj.editText : textObj.addText">
      <BedForm/>
    </BedFormDrawer>

    <!-- 批量分配弹窗 -->
    <el-dialog v-model="batchAssignVisible" title="批量分配床位" width="600px">
      <el-table :data="batchAssignList" border>
        <el-table-column prop="building" label="楼栋"/>
        <el-table-column prop="roomNum" label="房间号"/>
        <el-table-column prop="bedNum" label="床位号"/>
        <el-table-column label="分配学生" width="200">
          <template #default="{ row }">
            <el-select v-model="row.studentId" filterable placeholder="请选择学生">
              <el-option
                v-for="stu in studentOptions"
                :key="stu.value"
                :label="stu.label"
                :value="stu.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="batchAssignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBatchAssign">确认分配</el-button>
      </template>
    </el-dialog>

    <!-- 单行分配弹窗 -->
    <el-dialog v-model="singleAssignVisible" title="分配床位" width="400px">
      <el-form label-width="80px">
        <el-form-item label="选择学生">
          <el-select
            v-model="selectedStudentId"
            filterable
            placeholder="请选择学生"
            style="width: 100%"
          >
            <el-option
              v-for="stu in studentOptions"
              :key="stu.value"
              :label="stu.label"
              :value="stu.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="singleAssignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSingleAssign">确认分配</el-button>
      </template>
    </el-dialog>

    <!-- 单行调整弹窗 -->
    <el-dialog v-model="adjustVisible" title="调整床位" width="400px">
      <el-form label-width="80px">
        <el-form-item label="新学生">
          <el-select
            v-model="newStudentId"
            filterable
            placeholder="请选择新学生"
            style="width: 100%"
          >
            <el-option
              v-for="stu in studentOptions"
              :key="stu.value"
              :label="stu.label"
              :value="stu.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdjust">确认调整</el-button>
      </template>
    </el-dialog>

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
          <IconButton content="分配" icon-name="User" @click="handleBatchAssign"/>
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
      <template #building="{ row }">
        <el-text @click="handleFilterTagClick('building', row.building)" type="primary"
                 style="cursor: pointer;">
          {{ row.building }}
        </el-text>
      </template>
      <template #roomNum="{ row }">
        <el-text @click="handleFilterTagClick('roomNum', row.roomNum)" type="primary"
                 style="cursor: pointer;">
          {{ row.roomNum }}
        </el-text>
      </template>
      <template #studentId="{ row }">
        <el-text v-if="row.studentId" @click="handleOpenDetail(row)" type="primary"
                 style="cursor: pointer;">
          {{ row.studentId }}
        </el-text>
        <span v-else>-</span>
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
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未分配'" content="分配" icon-name="User"
                      @click="handleAssign(row)"/>
          <IconButton v-if="row.status === '已分配'" content="调整" icon-name="Switch"
                      @click="handleAdjust(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
