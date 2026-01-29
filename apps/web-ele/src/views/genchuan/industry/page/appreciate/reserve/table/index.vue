<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElIcon, ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import { dataList, textObj, useFormSchema, useGridColumns } from './data';

// 接收父组件属性
const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
});

// 向父组件派发事件（与参考代码一致，预留扩展）
const emit = defineEmits(['toggleChart']);

// 展开/收缩按钮自身状态（与参考代码一致）
const arrowShow = ref(false);

// 表单抽屉标题（新增/编辑区分）
const getTitle = computed(() => {
  return formData.value?.reservation_id ? textObj.editText : textObj.addText;
});

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    待核验: 'warning',
    已确认: 'success',
    已使用: 'primary',
    已取消: 'info',
    已过期: 'danger',
  };
  return typeMap[status] || 'default';
};

// 根据状态统计数量
const getCountByStatus = (status) => {
  return dataObj.list.filter((item) => item.status === status).length;
};

// 抽屉配置 - 搜索抽屉（与参考代码完全一致）
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

// 抽屉配置 - 详情抽屉（与参考代码完全一致）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});


// 新增/编辑表单数据绑定
const formData = ref();

// 表单配置 - 新增/编辑核心表单（与参考代码完全一致）
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

// 抽屉配置 - 新增/编辑表单抽屉（与参考代码一致，修正主键为reservation_id）
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 新增逻辑
    if (formDrawerApi.sharedData.payload.title === textObj.addText) {
      // 新增时补充唯一ID，模拟后端生成
      obj.reservation_id = `550e8400-e29b-41d4-a716-${Math.random().toString(16).slice(2, 10)}`;
      obj.create_time = new Date()
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        .replaceAll('/', '-');
      obj.update_time = obj.create_time;
      dataObj.apilist.push(obj);
    } else {
      // 编辑逻辑，修正主键为reservation_id
      dataObj.apilist.forEach((v, i) => {
        if (v.reservation_id === formData.value?.reservation_id) {
          obj.update_time = new Date()
            .toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            .replaceAll('/', '-');
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      // 编辑时回显数据，新增时重置表单
      if (formData.value?.reservation_id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格数据（与参考代码一致） */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格数据到Excel（与参考代码一致） */
async function handleExport() {
  exportToExcel(dataObj.apilist, textObj.excelName, textObj.excelAllName);
}

/** 打开新增抽屉（与参考代码一致） */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 打开编辑抽屉并回显数据（与参考代码一致） */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 单行删除操作（修正主键为reservation_id，匹配业务） */
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.reservation_no]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => v.reservation_id !== row.reservation_id,
    );
    ElMessage.success(
      $t('ui.actionMessage.deleteSuccess', [row.reservation_no]),
    );
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

/** 批量删除操作（修正主键为reservation_id，匹配业务） */
async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.reservation_id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

// 表格勾选的ID集合（修正为reservation_id，匹配业务）
const checkedIds = ref([]);
/** 表格行勾选事件（修正为reservation_id，匹配业务） */
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.reservation_id);
}

// 全局响应式数据（表格、分页、筛选、详情相关）- 与参考代码一致
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

/** 底部统计栏展开/收缩（与参考代码一致） */
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 筛选状态核心变量 - 完全匹配参考代码命名规范
const activeName = ref('全部'); // 状态筛选：全部/待核验/已确认/已使用/已取消/已过期
const filterArea = ref(''); // 区域筛选：停车场名称（蓝色primary标签）
const filterType = ref(''); // 类型筛选：泊位类型（绿色success标签）

/** 停车场名称筛选：点击筛选，再次点击取消（匹配参考代码方法名） */
const handleFilterByArea = (area) => {
  filterArea.value = filterArea.value === area ? '' : area;
  gridApi.query();
};

/** 泊位类型筛选：点击筛选，再次点击取消（匹配参考代码方法名） */
const handleFilterByType = (type) => {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
};

/** 取消停车场筛选（筛选标签关闭按钮，匹配参考代码方法名） */
const handleCancelAreaFilter = () => {
  filterArea.value = '';
  gridApi.query();
};

/** 取消泊位类型筛选（筛选标签关闭按钮，匹配参考代码方法名） */
const handleCancelTypeFilter = () => {
  filterType.value = '';
  gridApi.query();
};

/** 表格核心数据获取：三条件叠加筛选 + 分页 - 分步筛选，完全匹配参考代码逻辑 */
const getTableData = (pageObj) => {
  const page = pageObj.page;
  // 第一步：状态筛选（全部/待核验/已确认/已使用/已取消/已过期）
  let filteredList = dataObj.apilist.filter((v) => {
    return activeName.value === '全部' ? true : v.status === activeName.value;
  });
  // 第二步：叠加停车场名称筛选
  if (filterArea.value) {
    filteredList = filteredList.filter((v) => v.lot_id === filterArea.value);
  }
  // 第三步：叠加泊位类型筛选
  if (filterType.value) {
    filteredList = filteredList.filter(
      (v) => v.park_space === filterType.value,
    );
  }
  // 分页处理（与参考代码完全一致）
  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

// 表单配置 - 搜索表单（与参考代码完全一致）
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

/** 搜索表单提交（与参考代码一致） */
function onSubmit() {
  drawerApi.close();
}

// 表格配置 - VxeGrid核心表格（修正主键为reservation_id，其余与参考代码一致）
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'reservation_id', isHover: true }, // 修正业务主键
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

// 状态Tabs数据（匹配停车预约业务状态）
const tabsData = ref([
  { label: '全部' },
  { label: '待核验' },
  { label: '已确认' },
  { label: '已使用' },
  { label: '已取消' },
  { label: '已过期' },
]);

/** 生成状态Tabs标签（带数量统计）- 完全匹配参考代码逻辑 */
const createLabel = (item) => {
  let count = 0;
  count =
    item.label === '全部'
      ? dataObj.apilist.length
      : dataObj.apilist.filter((v) => v.status === item.label).length;
  return `${item.label}(${count})`;
};

/** 状态Tabs切换刷新表格（与参考代码一致） */
const handleClick = () => {
  gridApi.query();
};

/** 打开详情抽屉（与参考代码一致） */
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerApi.open();
};

/** 打开搜索抽屉（与参考代码一致） */
const handleSerachShow = () => {
  drawerApi.open();
};

/** 全屏切换（与参考代码一致） */
const handleFullShow = () => {
  screenfull.toggle();
};

/** 展开/收缩按钮点击：切换自身状态 + 向父组件派发事件（与参考代码完全一致） */
const arrowChange = () => {
  arrowShow.value = !arrowShow.value;
  emit('toggleChart');
};
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑表单抽屉（与参考代码一致） -->
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <!-- 数据详情抽屉（适配停车预约业务字段，样式与参考代码完全一致） -->
    <DetailDrawer :title="`${dataObj.detailObj.reservation_no}详情`">
      <div class="detail-card">
        <div
          class="detail-card-row"
          v-for="(value, key) in dataObj.detailObj"
          :key="key"
        >
          <div class="detail-row-left">
            {{
              key === 'reservation_id'
                ? '预约记录ID'
                : key === 'reservation_no'
                  ? '预约编号'
                  : key === 'user_id'
                    ? '用户ID'
                    : key === 'car_number'
                      ? '车牌号码'
                      : key === 'lot_id'
                        ? '停车场名称'
                        : key === 'space_id'
                          ? '车位ID'
                          : key === 'park_space'
                            ? '泊位类型'
                            : key === 'reserve_date'
                              ? '预约日期'
                              : key === 'start_time'
                                ? '开始时间'
                                : key === 'end_time'
                                  ? '结束时间'
                                  : key === 'status'
                                    ? '预约状态'
                                    : key === 'verify_time'
                                      ? '核验时间'
                                      : key === 'verify_by'
                                        ? '核验人'
                                        : key === 'cancel_time'
                                          ? '取消时间'
                                          : key === 'cancel_reason'
                                            ? '取消原因'
                                            : key === 'create_time'
                                              ? '创建时间'
                                              : key === 'update_time'
                                                ? '更新时间'
                                                : key === 'remark'
                                                  ? '备注'
                                                  : key
            }}:
          </div>
          <div class="detail-row-right">
            {{
              key === 'space_id' && !value
                ? '未分配'
                : key === 'verify_time' && !value
                  ? '未核验'
                  : key === 'verify_by' && !value
                    ? '未核验'
                    : key === 'cancel_time' && !value
                      ? '未取消'
                      : key === 'cancel_reason' && !value
                        ? '无'
                        : key === 'remark' && !value
                          ? '无'
                          : value
            }}
            <ElTag
              v-if="key === 'status'"
              :type="getStatusTagType(value)"
              size="small"
              style="margin-left: 8px"
            >
              {{ value }}
            </ElTag>
          </div>
        </div>
      </div>
    </DetailDrawer>

    <!-- 搜索表单抽屉（与参考代码一致） -->
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 核心表格 - 模板结构、样式、插槽完全匹配参考代码 -->
    <Grid>
      <!-- 表格标题栏：状态Tabs + 双维度筛选标签 - 完全匹配参考代码样式 -->
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center"
        >
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
          <!-- 停车场名称筛选标签：蓝色primary，仅筛选时显示（与参考代码样式完全一致） -->
          <ElTag
            v-if="filterArea"
            type="primary"
            closable
            @close="handleCancelAreaFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            停车场：{{ filterArea }}
          </ElTag>
          <!-- 泊位类型筛选标签：绿色success，仅筛选时显示（与参考代码样式完全一致） -->
          <ElTag
            v-if="filterType"
            type="success"
            closable
            @close="handleCancelTypeFilter"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            泊位类型：{{ filterType }}
          </ElTag>
        </div>
      </template>

      <!-- 表格工具栏：新增/导出/删除/搜索等按钮 - 完全匹配参考代码（含展开/收缩） -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="arrowShow ? '收缩' : '展开'"
            :icon-name="arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <!-- 表格列：停车场名称（点击筛选该停车场，蓝色可点击，匹配参考代码） -->
      <template #lot_id="{ row }">
        <el-text
          @click="handleFilterByArea(row.lot_id)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.lot_id }}
        </el-text>
      </template>

      <!-- 表格列：泊位类型（点击筛选同类型，蓝色可点击，匹配参考代码） -->
      <template #park_space="{ row }">
        <el-text
          @click="handleFilterByType(row.park_space)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.park_space }}
        </el-text>
      </template>

      <!-- 表格列：操作栏 - 完全匹配参考代码样式 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>

      <!-- 表格底部：统计信息展开/收缩 - 适配停车预约业务，样式与参考代码完全一致 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <ElIcon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </ElIcon>
          <ElIcon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </ElIcon>
          <span>
            本页统计：预约记录{{ dataObj.list.length }}条; 已使用:{{
              getCountByStatus('已使用')
            }}条; 已确认:{{ getCountByStatus('已确认') }}条
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
/* 整体容器（与参考代码一致） */
.park-lot-table-new {
  width: 100%;
  height: 100%;
}

/* 筛选项蓝色文字：悬浮下划线+指针，强化可点击提示 - 完全匹配参考代码 */
:deep(.el-text--primary) {
  cursor: pointer;
}

:deep(.el-text--primary):hover {
  text-decoration: underline;
  opacity: 0.9;
}

/* 表格标题栏：宽度100%，内边距优化 - 与参考代码一致 */
.tabel-tabs {
  width: 100%;
}

/* 详情卡片样式：间距、对齐优化 - 完全匹配参考代码 */
.detail-card {
  padding: 24px;
}

.detail-card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}

.detail-row-left {
  min-width: 120px;
  margin-right: 16px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  color: #303133;
}

/* 表格工具栏：按钮间距、自动换行 - 完全匹配参考代码 */
:deep(.common-toolbar-tools) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

/* 表格操作列：按钮间距 - 完全匹配参考代码 */
:deep(.table-toolbar-tools) {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* 底部统计栏：鼠标指针，提示可点击 - 完全匹配参考代码 */
.common-total {
  padding: 8px 0;
  cursor: pointer;
}

.common-total-bottom {
  padding: 0;
  color: #606266;
}

/* 状态标签间距优化（适配详情页） */
:deep(.el-tag) {
  margin: 0 4px;
}
</style>
