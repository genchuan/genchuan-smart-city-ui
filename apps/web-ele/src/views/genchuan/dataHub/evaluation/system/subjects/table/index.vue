<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';
import SubjectDetailDrawer from './detail.vue';
import { subjectList, textObj, useFormSchema, useGridColumns, userList, subjectTypeList, statusList } from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 搜索参数
const searchParams = ref({});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  onConfirm() {
    const obj = formApi.form.values;
    // 根据联系人自动填充联系电话
    if (obj.contactId) {
      const user = userList.find(u => u.id === obj.contactId);
      if (user) {
        obj.contactPhone = user.phone;
      }
    }
    // 处理成员：根据memberIds生成memberNames和memberCount
    let memberNames = '';
    let memberCount = 0;
    if (obj.memberIds && obj.memberIds.length > 0) {
      const members = userList.filter(u => obj.memberIds.includes(u.id));
      memberNames = members.map(u => u.name).join('、');
      memberCount = members.length;
    }
    obj.memberNames = memberNames;
    obj.memberCount = memberCount;

    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增
      obj.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      obj.subjectTypeName = subjectTypeList.find(t => t.id === obj.subjectTypeId)?.name || '';
      obj.contactName = userList.find(u => u.id === obj.contactId)?.name || '';
      obj.statusName = statusList.find(s => s.id === obj.statusId)?.name || '';
      obj.createByName = '当前用户';
      obj.createTime = new Date().toLocaleString();
      obj.updateByName = '当前用户';
      obj.updateTime = obj.createTime;
      obj.changeLog = '新建主体';
      obj.useCount = 0;
      dataObj.apilist.push(obj);
      dataObj.currentPage = 1;
    } else {
      // 编辑
      const index = dataObj.apilist.findIndex(v => v.id === formData.value?.id);
      if (index !== -1) {
        const updated = { ...dataObj.apilist[index], ...obj };
        updated.subjectTypeName = subjectTypeList.find(t => t.id === obj.subjectTypeId)?.name || '';
        updated.contactName = userList.find(u => u.id === obj.contactId)?.name || '';
        updated.statusName = statusList.find(s => s.id === obj.statusId)?.name || '';
        updated.updateByName = '当前用户';
        updated.updateTime = new Date().toLocaleString();
        updated.changeLog = (updated.changeLog || '') + '；编辑更新';
        updated.memberNames = memberNames;
        updated.memberCount = memberCount;
        dataObj.apilist[index] = updated;
      }
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
        // 编辑时回显memberIds需要从memberNames反向解析？简单起见，memberIds不存储，暂时留空
        // 实际应根据成员关系表获取，这里简化：清空memberIds
        await formApi.setFieldValue('memberIds', []);
      } else {
        formApi.resetForm();
      }
      // 动态控制成员字段的禁用和必填
      const subjectTypeId = formData.value?.subjectTypeId || '1'; // 默认人工主体
      const isManual = subjectTypeId === '1'; // 人工主体
      formApi.updateSchema({
        fieldName: 'memberIds',
        componentProps: {
          disabled: !isManual,
        },
        rules: isManual ? 'required' : '',
      });
      // 监听主体类型变化
      const unwatch = watch(() => formApi.form.values.subjectTypeId, (newVal) => {
        const isManualNow = newVal === '1';
        formApi.updateSchema({
          fieldName: 'memberIds',
          componentProps: {
            disabled: !isManualNow,
          },
          rules: isManualNow ? 'required' : '',
        });
        // 如果不是人工主体，清空memberIds
        if (!isManualNow) {
          formApi.setFieldValue('memberIds', []);
        }
      });
      // 抽屉关闭时销毁监听
      if (!isOpen) {
        unwatch();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 批量导入（模拟） */
async function handleImport() {
  ElMessage.info('批量导入功能开发中');
}

/** 新增 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 停用 */
async function handleDisable(row) {
  if (row.statusName !== '启用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该评价主体吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '停用';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；停用操作';
    }
    ElMessage.success('已停用');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 启用 */
async function handleEnable(row) {
  if (row.statusName !== '停用') {
    ElMessage.warning(`当前状态为“${row.statusName}”，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该评价主体吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    const index = dataObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      dataObj.apilist[index].statusName = '启用';
      dataObj.apilist[index].changeLog = (dataObj.apilist[index].changeLog || '') + '；启用操作';
    }
    ElMessage.success('已启用');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更（根据当前tab和选中行状态校验） */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const allowedCurrentStatus = targetStatus === '启用' ? '停用' : '启用';
  const invalidRows = dataObj.apilist.filter(item => checkedIds.value.includes(item.id) && item.statusName !== allowedCurrentStatus);
  if (invalidRows.length > 0) {
    ElMessage.warning(`选中的行中包含状态不是“${allowedCurrentStatus}”的对象，无法批量${targetStatus}。`);
    return;
  }
  await confirm(`确定将选中的对象${targetStatus === '启用' ? '启用' : '停用'}吗？`);
  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    dataObj.apilist.forEach(item => {
      if (checkedIds.value.includes(item.id)) {
        item.statusName = targetStatus;
        item.changeLog = (item.changeLog || '') + `；批量${targetStatus}`;
      }
    });
    checkedIds.value = [];
    ElMessage.success(`批量${targetStatus}成功`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  subjectDetail: {}, // 用于详情抽屉
  total: subjectList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: subjectList(), // 使用subjectList
  list: [],
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取（按状态过滤 + 按搜索条件过滤 + 排序）
const getTableData = (pageObj) => {
  const page = pageObj.page;
  // 先按状态过滤
  let filtered = dataObj.apilist.filter(v => {
    if (activeName.value === '全部') return true;
    return v.statusName === activeName.value;
  });

  // 再按搜索条件过滤
  const params = searchParams.value;
  if (Object.keys(params).length > 0) {
    filtered = filtered.filter(item => {
      let match = true;
      if (params.name && !item.name.includes(params.name)) match = false;
      if (params.code && !item.code.includes(params.code)) match = false;
      if (params.subjectTypeId && item.subjectTypeId !== params.subjectTypeId) match = false;
      if (params.contactId && item.contactId !== params.contactId) match = false;
      if (params.contactPhone && !item.contactPhone.includes(params.contactPhone)) match = false;
      if (params.statusId && item.statusId !== params.statusId) match = false;
      // 成员筛选较复杂，暂不实现
      return match;
    });
  }

  // 排序：按创建时间降序
  filtered.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));

  dataObj.total = filtered.length;
  dataObj.list = filtered.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

// 搜索表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    // 移除校验规则，但保留字段
    delete v.rules;
    // 成员字段改为非必填且不禁用
    if (v.fieldName === 'memberIds') {
      v.componentProps = { ...v.componentProps, disabled: false };
    }
    // 联系电话可编辑？为了搜索方便，保留为输入框
    if (v.fieldName === 'contactPhone') {
      v.componentProps.disabled = false;
    }
    return { ...v };
  }),
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

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
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

const activeName = ref('全部');
const handleSubjectOpenDetail = (row) => {
  dataObj.subjectDetail = row;
  subjectDetailRef.value.open();
};

const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '停用' },
]);

const createLabel = (item) => {
  let count = 0;
  if (item.label === '全部') {
    count = dataObj.apilist.length;
  } else {
    count = dataObj.apilist.filter(v => v.statusName === item.label).length;
  }
  return `${item.label} (${count})`;
};

const handleClick = () => {
  gridApi.query();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const subjectDetailRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <SubjectDetailDrawer
      ref="subjectDetailRef"
      :detail-obj="dataObj.subjectDetail"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
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
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton v-if="activeName === '全部'" content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="批量导入" icon-name="upload" @click="handleImport" />
          <IconButton
            v-if="activeName !== '停用'"
            content="批量停用"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton
            v-if="activeName === '停用'"
            content="批量启用"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #name="{ row }">
        <el-text
          @click="handleSubjectOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleSubjectOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="停用" icon-name="delete" color="#F56C6C" @click="handleDisable(row)" />
          <IconButton content="启用" icon-name="check" color="#67C23A" @click="handleEnable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：主体数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.list.filter(v => v.statusName === '停用').length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：主体总数{{ dataObj.apilist.length }}，启用{{ dataObj.apilist.filter(v => v.statusName === '启用').length }}，停用{{ dataObj.apilist.filter(v => v.statusName === '停用').length }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
