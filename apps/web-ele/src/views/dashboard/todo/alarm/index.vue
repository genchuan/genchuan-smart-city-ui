<!-- index.vue - 预警管理主页面 -->
<script setup>
import { reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
// 引入预警详情抽屉组件
import AlarmDetailDrawer from '#/views/dashboard/todo/alarm/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);

// 将 activeName 的定义移到最前面
const activeName = ref('待处置');

// 预警数据对象
const alarmObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

// 表格数据获取
const getTableData = (pageObj) => {
  const page = pageObj.page;

  let filteredList = alarmObj.apilist;

  // 根据当前标签页筛选数据
  if (activeName.value === '待处置') {
    filteredList = alarmObj.apilist.filter(v => v.alarm_status === '待处置');
  } else if (activeName.value === '处置中') {
    filteredList = alarmObj.apilist.filter(v => v.alarm_status === '处置中');
  } else if (activeName.value === '已归档') {
    filteredList = alarmObj.apilist.filter(v => v.alarm_status === '已处理' || v.alarm_status === '已忽略');
  }

  alarmObj.total = filteredList.length;
  alarmObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  return alarmObj;
};

// 动态获取表格列 - 使用函数返回，避免在计算属性中引用 activeName
const getGridColumns = () => {
  return useGridColumns(activeName.value);
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(), // 使用函数获取初始列
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: alarmObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 监听activeName变化，重新设置表格列
watch(activeName, () => {
  // 重新设置列
  gridApi.setColumns(getGridColumns());
  // 重新查询数据
  gridApi.query();
});

// 抽屉和弹窗实例
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 处置弹窗
const [DealModal, dealModalApi] = useVbenModal({
  title: '处置预警',
  width: 500,
  showCancelButton: true,
  async onConfirm() {
    // 处置逻辑
    const selectedRecords = gridApi.getCheckboxRecords();
    if (selectedRecords.length === 0) {
      ElMessage.warning('请至少选择一条预警进行处置');
      return;
    }

    const loadingInstance = ElLoading.service({
      text: '正在处置预警...',
    });
    try {
      // 批量更新状态为处置中
      selectedRecords.forEach(record => {
        const index = alarmObj.apilist.findIndex(v => v.id === record.id);
        if (index !== -1) {
          alarmObj.apilist[index].alarm_status = '处置中';
          alarmObj.apilist[index].deal_start_time = new Date().toLocaleString('zh-CN');
          alarmObj.apilist[index].current_deal_status = '处置中';
          alarmObj.apilist[index].operation_log = '开始处置';
          alarmObj.apilist[index].update_time = new Date().toLocaleString('zh-CN');
        }
      });

      ElMessage.success('处置操作已提交');
      handleRefresh();
      dealModalApi.close();
    } finally {
      loadingInstance.close();
    }
  },
});

// 派单弹窗
const [AssignModal, assignModalApi] = useVbenModal({
  title: '派单处理',
  width: 500,
  showCancelButton: true,
  async onConfirm() {
    // 派单逻辑
    if (!assignFormData.value.responsible_person) {
      ElMessage.warning('请选择处置人');
      return;
    }

    const loadingInstance = ElLoading.service({
      text: '正在派单...',
    });
    try {
      const index = alarmObj.apilist.findIndex(v => v.id === currentRow.value.id);
      if (index !== -1) {
        alarmObj.apilist[index].responsible_person = assignFormData.value.responsible_person;
        alarmObj.apilist[index].operation_log = '派单处理';
        alarmObj.apilist[index].update_time = new Date().toLocaleString('zh-CN');
      }

      ElMessage.success('派单成功');
      handleRefresh();
      assignModalApi.close();
    } finally {
      loadingInstance.close();
    }
  },
});

// 忽略弹窗
const [IgnoreModal, ignoreModalApi] = useVbenModal({
  title: '忽略预警',
  width: 500,
  showCancelButton: true,
  async onConfirm() {
    // 忽略逻辑
    if (!ignoreReason.value) {
      ElMessage.warning('请填写忽略理由');
      return;
    }

    const loadingInstance = ElLoading.service({
      text: '正在提交忽略申请...',
    });
    try {
      const index = alarmObj.apilist.findIndex(v => v.id === currentRow.value.id);
      if (index !== -1) {
        alarmObj.apilist[index].alarm_status = '已忽略';
        alarmObj.apilist[index].deal_result = '已忽略';
        alarmObj.apilist[index].operation_log = '申请忽略';
        alarmObj.apilist[index].update_time = new Date().toLocaleString('zh-CN');
      }

      ElMessage.success('忽略申请已提交，等待审批');
      handleRefresh();
      ignoreModalApi.close();
    } finally {
      loadingInstance.close();
    }
  },
});

// 更新进度弹窗
const [UpdateModal, updateModalApi] = useVbenModal({
  title: '更新处置进度',
  width: 500,
  showCancelButton: true,
  async onConfirm() {
    // 更新进度逻辑
    if (!updateFormData.value.current_deal_status) {
      ElMessage.warning('请选择处置状态');
      return;
    }

    const loadingInstance = ElLoading.service({
      text: '正在更新进度...',
    });
    try {
      const index = alarmObj.apilist.findIndex(v => v.id === currentRow.value.id);
      if (index !== -1) {
        alarmObj.apilist[index].current_deal_status = updateFormData.value.current_deal_status;
        alarmObj.apilist[index].deal_progress = updateFormData.value.deal_progress || '0%';
        alarmObj.apilist[index].deal_log_summary = updateFormData.value.deal_log_summary || '';
        alarmObj.apilist[index].operation_log = '更新处置进度';
        alarmObj.apilist[index].update_time = new Date().toLocaleString('zh-CN');
      }

      ElMessage.success('进度更新成功');
      handleRefresh();
      updateModalApi.close();
    } finally {
      loadingInstance.close();
    }
  },
});

// 验证弹窗
const [VerifyModal, verifyModalApi] = useVbenModal({
  title: '验证处置结果',
  width: 500,
  showCancelButton: true,
  async onConfirm() {
    // 验证逻辑
    if (!verifyResult.value) {
      ElMessage.warning('请选择验证结果');
      return;
    }

    const loadingInstance = ElLoading.service({
      text: '正在验证...',
    });
    try {
      const index = alarmObj.apilist.findIndex(v => v.id === currentRow.value.id);
      if (index !== -1) {
        alarmObj.apilist[index].alarm_status = verifyResult.value === '已解决' ? '已处理' : '处置中';
        alarmObj.apilist[index].deal_result = verifyResult.value;
        alarmObj.apilist[index].finish_time = new Date().toLocaleString('zh-CN');
        alarmObj.apilist[index].operation_log = '验证完成';
        alarmObj.apilist[index].update_time = new Date().toLocaleString('zh-CN');

        // 计算处置时长
        if (alarmObj.apilist[index].deal_start_time) {
          const start = new Date(alarmObj.apilist[index].deal_start_time);
          const end = new Date();
          const duration = end - start;
          const days = Math.floor(duration / (1000 * 60 * 60 * 24));
          const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          alarmObj.apilist[index].deal_duration = `${days}天${hours}小时`;
        }
      }

      ElMessage.success('验证完成');
      handleRefresh();
      verifyModalApi.close();
    } finally {
      loadingInstance.close();
    }
  },
});

const formData = ref({});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(alarmObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 创建预警 */
function handleCreate() {
  // 实现创建预警逻辑
  ElMessage.info('创建预警功能开发中');
}

/** 批量处置 */
function handleBatchDeal() {
  dealModalApi.open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.alarm_id]),
  });
  try {
    alarmObj.apilist = alarmObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.alarm_id]));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    alarmObj.apilist = alarmObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

// 当前操作的行
const currentRow = ref({});

// 表单数据
const assignFormData = ref({
  responsible_person: '',
  assign_remark: ''
});

const updateFormData = ref({
  current_deal_status: '',
  deal_progress: '',
  deal_log_summary: ''
});

const ignoreReason = ref('');
const verifyResult = ref('');

// 处置人选项
const responsiblePersons = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '孙八', value: '孙八' },
];

// 处置状态选项
const dealStatusOptions = [
  { label: '处置中', value: '处置中' },
  { label: '待协同', value: '待协同' },
  { label: '待验证', value: '待验证' },
];

// 验证结果选项
const verifyOptions = [
  { label: '已解决', value: '已解决' },
  { label: '未解决', value: '未解决' },
];

const changeTotalShow = () => {
  alarmObj.totalShow = !alarmObj.totalShow;
};

// 搜索表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return {
      ...v,
    };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

function onSubmit() {
  drawerApi.close();
  gridApi.query();
}

// 打开详情
const handleOpenDetail = (row) => {
  alarmObj.detailObj = row;
  alarmDetailDrawerRef.value.open();
};

// 处置操作
const handleDeal = (row) => {
  currentRow.value = row;
  dealModalApi.open();
};

// 派单操作
const handleAssign = (row) => {
  currentRow.value = row;
  assignFormData.value = {
    responsible_person: '',
    assign_remark: ''
  };
  assignModalApi.open();
};

// 忽略操作
const handleIgnore = (row) => {
  currentRow.value = row;
  ignoreReason.value = '';
  ignoreModalApi.open();
};

// 更新进度操作
const handleUpdate = (row) => {
  currentRow.value = row;
  updateFormData.value = {
    current_deal_status: row.current_deal_status || '',
    deal_progress: row.deal_progress || '',
    deal_log_summary: row.deal_log_summary || ''
  };
  updateModalApi.open();
};

// 验证操作
const handleVerify = (row) => {
  currentRow.value = row;
  verifyResult.value = '';
  verifyModalApi.open();
};

// 详情操作（已归档）
const handleDetail = (row) => {
  alarmObj.detailObj = row;
  alarmDetailDrawerRef.value.open();
};

// 下载操作
const handleDownload = (row) => {
  ElMessage.info(`下载 ${row.alarm_id} 的相关文件`);
};

// 复盘操作
const handleReview = (row) => {
  currentRow.value = row;
  ElMessage.info(`复盘 ${row.alarm_id}`);
};

const tabsData = ref([
  { label: '待处置' },
  { label: '处置中' },
  { label: '已归档' },
]);

// 创建标签页名称
const createLabel = (item) => {
  let count = 0;
  if (item.label === '待处置') {
    count = alarmObj.apilist.filter((v) => v.alarm_status === '待处置').length;
  } else if (item.label === '处置中') {
    count = alarmObj.apilist.filter((v) => v.alarm_status === '处置中').length;
  } else if (item.label === '已归档') {
    count = alarmObj.apilist.filter((v) => v.alarm_status === '已处理' || v.alarm_status === '已忽略').length;
  }
  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSearchShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const arrowChange = () => {
  emit('arrow-change');
};

// 定义组件ref
const alarmDetailDrawerRef = ref(null);
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 处置弹窗 -->
    <DealModal>
      <div class="deal-form">
        <el-form label-width="100px">
          <el-form-item label="处置措施" required>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入处置措施（必填）"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="上传凭证">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="3"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </DealModal>

    <!-- 派单弹窗 -->
    <AssignModal>
      <div class="assign-form">
        <el-form :model="assignFormData" label-width="100px">
          <el-form-item label="处置人" required>
            <el-select
              v-model="assignFormData.responsible_person"
              placeholder="请选择处置人"
              style="width: 100%"
            >
              <el-option
                v-for="person in responsiblePersons"
                :key="person.value"
                :label="person.label"
                :value="person.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="派单说明">
            <el-input
              v-model="assignFormData.assign_remark"
              type="textarea"
              :rows="3"
              placeholder="请输入派单说明（可选）"
            />
          </el-form-item>
        </el-form>
      </div>
    </AssignModal>

    <!-- 忽略弹窗 -->
    <IgnoreModal>
      <div class="ignore-form">
        <el-form label-width="100px">
          <el-form-item label="忽略理由" required>
            <el-input
              v-model="ignoreReason"
              type="textarea"
              :rows="4"
              placeholder="请输入忽略理由（必填）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </IgnoreModal>

    <!-- 更新进度弹窗 -->
    <UpdateModal>
      <div class="update-form">
        <el-form :model="updateFormData" label-width="100px">
          <el-form-item label="处置状态" required>
            <el-select
              v-model="updateFormData.current_deal_status"
              placeholder="请选择处置状态"
              style="width: 100%"
            >
              <el-option
                v-for="status in dealStatusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处置进度">
            <el-input
              v-model="updateFormData.deal_progress"
              placeholder="请输入处置进度（如：60%）"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="进展说明">
            <el-input
              v-model="updateFormData.deal_log_summary"
              type="textarea"
              :rows="3"
              placeholder="请输入进展说明（可选）"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </UpdateModal>

    <!-- 验证弹窗 -->
    <VerifyModal>
      <div class="verify-form">
        <el-form label-width="100px">
          <el-form-item label="验证结果" required>
            <el-select
              v-model="verifyResult"
              placeholder="请选择验证结果"
              style="width: 100%"
            >
              <el-option
                v-for="result in verifyOptions"
                :key="result.value"
                :label="result.label"
                :value="result.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="验证凭证">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="3"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入验证备注（可选）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </VerifyModal>

    <!-- 详情抽屉 -->
    <AlarmDetailDrawer
      ref="alarmDetailDrawerRef"
      :detail-obj="alarmObj.detailObj"
    />

    <!-- 搜索抽屉 -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 主表格 -->
    <Grid>
      <!-- 标签页 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            v-if="activeName === '待处置'"
            content="批量处置"
            icon-name="operation"
            @click="handleBatchDeal"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 预警ID列插槽 -->
      <template #alarm_id="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.alarm_id }}
        </el-text>
      </template>

      <!-- 预警等级列插槽 -->
      <template #alarm_level="{ row }">
        <el-tag
          :type="row.alarm_level === '紧急' ? 'danger' :
                 row.alarm_level === '高' ? 'warning' :
                 row.alarm_level === '中' ? 'primary' : 'info'"
          size="small"
          :effect="row.alarm_level === '紧急' ? 'dark' : 'plain'"
        >
          {{ row.alarm_level }}
        </el-tag>
      </template>

      <!-- 关联对象列插槽 -->
      <template #related_object="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.related_object }}
        </el-text>
      </template>

      <!-- 处置状态列插槽 -->
      <template #deal_status="{ row }">
        <el-tag
          :type="row.current_deal_status === '处置中' ? 'primary' :
                 row.current_deal_status === '待协同' ? 'warning' :
                 row.current_deal_status === '待验证' ? 'info' : 'success'"
          size="small"
        >
          {{ row.current_deal_status }}
        </el-tag>
      </template>

      <!-- 关联工单列插槽 -->
      <template #workorder="{ row }">
        <el-text
          v-if="row.related_workorder"
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.related_workorder }}
        </el-text>
        <span v-else>-</span>
      </template>

      <!-- 处置进度列插槽 -->
      <template #progress="{ row }">
        <div v-if="row.deal_progress && row.deal_progress !== '待处置'">
          <el-progress
            :percentage="parseInt(row.deal_progress)"
            :show-text="false"
            :stroke-width="6"
          />
          <span style="font-size: 12px;">{{ row.deal_progress }}</span>
        </div>
        <span v-else>{{ row.deal_progress || '-' }}</span>
      </template>

      <!-- 处置结果列插槽 -->
      <template #deal_result="{ row }">
        <el-tag
          :type="row.deal_result === '已解决' ? 'success' :
                 row.deal_result === '未解决' ? 'warning' :
                 row.deal_result === '已忽略' ? 'info' : 'primary'"
          size="small"
        >
          {{ row.deal_result || '-' }}
        </el-tag>
      </template>

      <!-- 待处置状态操作按钮 - 使用 IconButton -->
      <template #actions_waiting="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="处置"
            icon-name="operation"
            @click="handleDeal(row)"
          />
          <IconButton
            content="派单"
            icon-name="send"
            @click="handleAssign(row)"
          />
          <IconButton
            content="忽略"
            icon-name="close"
            color="#E6A23C"
            @click="handleIgnore(row)"
          />
        </div>
      </template>

      <!-- 处置中状态操作按钮 - 使用 IconButton -->
      <template #actions_handling="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="更新"
            icon-name="edit"
            @click="handleUpdate(row)"
          />
          <IconButton
            content="备注"
            icon-name="document"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="验证"
            icon-name="check"
            color="#13ce66"
            @click="handleVerify(row)"
          />
        </div>
      </template>

      <!-- 已归档状态操作按钮 - 使用 IconButton -->
      <template #actions_archived="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleDetail(row)"
          />
          <IconButton
            content="下载"
            icon-name="download"
            @click="handleDownload(row)"
          />
          <IconButton
            content="复盘"
            icon-name="refresh"
            color="#E6A23C"
            @click="handleReview(row)"
          />
        </div>
      </template>

      <!-- 底部统计信息 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!alarmObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="alarmObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 本页统计：
            <template v-if="activeName === '待处置'">
              待处置预警数: {{ alarmObj.list.length }};
              紧急等级: {{ alarmObj.list.filter(v => v.alarm_level === '紧急').length }};
              高等级: {{ alarmObj.list.filter(v => v.alarm_level === '高').length }};
            </template>
            <template v-else-if="activeName === '处置中'">
              处置中预警数: {{ alarmObj.list.length }};
              各类型分布: 设备预警 {{ alarmObj.list.filter(v => v.alarm_type === '设备预警').length }},
              安全预警 {{ alarmObj.list.filter(v => v.alarm_type === '安全预警').length }};
            </template>
            <template v-else>
              已归档预警数: {{ alarmObj.list.length }};
              已处理: {{ alarmObj.list.filter(v => v.alarm_status === '已处理').length }};
              已忽略: {{ alarmObj.list.filter(v => v.alarm_status === '已忽略').length }};
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="alarmObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
