<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
// import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import DetailDrawer from '#/components/common/DetailDrawer.vue';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

// 引入认证管理抽屉组件
import AuthManagementDrawer from '../components/AuthManagementDrawer.vue';
import {
  carDetailFields,
  carInfoData,
  dataList,
  getUserDetailFields,
  textObj,
  useFormSchema,
  useGridColumns,
  useGridFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    default: '全部',
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
});
const formData = ref();
const getTitle = computed(() => {
  // 根据不同用户类型检查对应的ID字段
  const hasId =
    (props.userType === '个人' && formData.value?.user_id) ||
    (props.userType === '企业' && formData.value?.enterprise_id) ||
    (props.userType === '政府' && formData.value?.gov_user_id);
  return hasId ? textObj.editText : textObj.addText;
});
const [Drawer, drawerApi] = useVbenDrawer({
  footer: false,
  mask: false,
  modal: false,
  width: '35%',
  position: 'right',
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 直接使用userType初始化schema
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: '140',
  },
  layout: 'horizontal',
  schema: useFormSchema(props.userType),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  mask: false,
  modal: false,
  width: '40%',
  position: 'right',
  appendToMain: true,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    // 根据formData判断是新增还是编辑
    const hasId =
      (props.userType === '个人' && formData.value?.user_id) ||
      (props.userType === '企业' && formData.value?.enterprise_id) ||
      (props.userType === '政府' && formData.value?.gov_user_id);

    if (hasId) {
      // 编辑用户
      dataObj.apilist.forEach((v, i) => {
        if (
          (props.userType === '个人' &&
            v.user_id === formData.value?.user_id) ||
          (props.userType === '企业' &&
            v.enterprise_id === formData.value?.enterprise_id) ||
          (props.userType === '政府' &&
            v.gov_user_id === formData.value?.gov_user_id)
        ) {
          dataObj.apilist[i] = {
            ...v,
            ...obj,
            update_time: new Date().toLocaleString('zh-CN'),
          };
        }
      });
    } else {
      // 新增用户
      dataObj.apilist.push({
        ...obj,
        create_time: new Date().toLocaleString('zh-CN'),
        update_time: new Date().toLocaleString('zh-CN'),
      });
    }
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 获取数据，保存到formData中用于后续操作
      const drawerData = formDrawerApi.getData();
      formData.value = drawerData;

      // 检查是否是编辑模式
      const isEditMode =
        drawerData.user_id ||
        drawerData.enterprise_id ||
        drawerData.gov_user_id;

      if (isEditMode) {
        // 编辑模式：设置表单值
        await formApi.setValues(drawerData);
      } else {
        // 新增模式：重置表单
        formApi.resetForm();
      }

      // 确保formData更新
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  },
});
const [searchDrawer] = useVbenDrawer({
  mask: false,
  modal: false,
  width: '30%',
  position: 'right',
  appendToMain: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  const excelName =
    props.userType === '个人'
      ? '个人用户列表'
      : props.userType === '企业'
        ? '企业用户列表'
        : '政府用户列表';
  const excelAllName = `${excelName}.xlsx`;
  exportToExcel(dataObj.apilist, excelName, excelAllName);
}

/** 创建用户 */
function handleCreate() {
  // 1. 重置表单
  formApi.resetForm();
  // 2. 设置抽屉标题并打开
  formDrawerApi.setState({ title: textObj.addText }).setData({}).open();
}

/** 编辑用户 */
function handleEdit(row) {
  // 1. 设置抽屉标题
  formDrawerApi.setState({ title: textObj.editText });
  // 2. 设置数据
  formDrawerApi.setData(row);
  // 3. 打开抽屉
  formDrawerApi.open();
}

/** 确认禁用用户 */
async function confirmDisable(row) {
  try {
    await ElMessageBox.confirm(
      `确定要禁用用户"${row.user_name || row.enterprise_name}"吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    // 用户确认后执行禁用操作
    await handleDisable(row);
  } catch {
    // 用户取消操作，不执行任何操作
  }
}

async function handleDisable(row) {
  const loadingInstance = ElLoading.service({
    text: `正在禁用用户"${row.user_name || row.enterprise_name}"...`,
  });
  try {
    const index = dataObj.apilist.findIndex(
      (v) =>
        (props.userType === '个人' && v.user_id === row.user_id) ||
        (props.userType === '企业' && v.enterprise_id === row.enterprise_id) ||
        (props.userType === '政府' && v.gov_user_id === row.gov_user_id),
    );
    if (index !== -1) {
      dataObj.apilist[index].account_status = '禁用';
      ElMessage.success(
        `用户"${row.user_name || row.enterprise_name}"禁用成功`,
      );
      handleRefresh();
    }
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
    dataObj.apilist = dataObj.apilist.filter(
      (v) =>
        !checkedIds.value.includes(
          props.userType === '个人'
            ? v.user_id
            : props.userType === '企业'
              ? v.enterprise_id
              : v.gov_user_id,
        ),
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
  checkedIds.value = records.map((item) =>
    props.userType === '个人'
      ? item.user_id
      : props.userType === '企业'
        ? item.enterprise_id
        : item.gov_user_id,
  );
}

const dataObj = reactive({
  totalShow: false,
  total: dataList(props.userType).length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(props.userType),
  list: [],
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const filteredList = dataObj.apilist
    .map((v) => v)
    .filter((v) => {
      if (activeStatus.value === '全部') {
        return true;
      }
      // 根据用户类型选择不同的状态字段进行过滤
      return props.userType === '政府'
        ? v.online_status === activeStatus.value
        : v.cert_status === activeStatus.value;
    })
    .filter((v) => {
      // 搜索条件过滤
      for (const key in searchParams.value) {
        if (searchParams.value[key]) {
          const searchValue = searchParams.value[key].toString().toLowerCase();
          const itemValue = v[key]?.toString().toLowerCase() || '';
          if (!itemValue.includes(searchValue)) {
            return false;
          }
        }
      }
      return true;
    });

  const total = filteredList.length;
  const list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );

  // 更新dataObj以保持同步
  dataObj.total = total;
  dataObj.list = list;

  return {
    list,
    total,
  };
};

const searchParams = ref({});

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: useGridFormSchema(props.userType),
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

// 搜索表单查询
function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  gridApi.query();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(props.userType),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField:
        props.userType === '个人'
          ? 'user_id'
          : props.userType === '企业'
            ? 'enterprise_id'
            : 'gov_user_id',
      isHover: true,
    },
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

// 根据用户类型获取状态标签
const getStatusTabs = () => {
  switch (props.userType) {
    case '个人': {
      return [
        { label: '全部', value: '全部' },
        { label: '未认证', value: '未认证' },
        { label: '待审核', value: '待审核' },
        { label: '已认证', value: '已认证' },
        { label: '认证失败', value: '认证失败' },
      ];
    }
    case '企业': {
      return [
        { label: '全部', value: '全部' },
        { label: '未认证', value: '未认证' },
        { label: '待审核', value: '待审核' },
        { label: '已认证', value: '已认证' },
        { label: '认证失败', value: '认证失败' },
      ];
    }
    case '政府': {
      return [
        { label: '全部', value: '全部' },
        { label: '在线', value: '在线' },
        { label: '离线', value: '离线' },
      ];
    }
    default: {
      return [];
    }
  }
};

// 状态标签页
const activeStatus = ref('全部');
const statusTabs = computed(() => getStatusTabs());

const handleStatusChange = () => {
  gridApi.query();
};

// 生成带数字角标的标签
const createLabel = (item) => {
  let count = 0;

  // 根据用户类型选择不同的状态字段
  const statusField =
    props.userType === '政府' ? 'online_status' : 'cert_status';

  count =
    item.value === '全部'
      ? dataObj.apilist.length
      : dataObj.apilist.filter((v) => v[statusField] === item.value).length;

  return `${item.label}(${count})`;
};

const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};

const selectedDetailUser = ref(null);
const detailFields = computed(() => getUserDetailFields(props.userType));

const detailDrawerRef = ref(null);

const handleDetailClose = () => {
  selectedDetailUser.value = null;
};

// 车辆信息相关
const selectedCars = ref([]);
const carDetailDrawerRef = ref(null);

// 处理绑定车牌点击事件
const handleCarNumbersClick = (row) => {
  // 过滤出当前用户的所有车辆信息
  const userCars = carInfoData.filter((car) => {
    // 根据用户类型匹配不同的user_id
    if (props.userType === '个人') {
      return car.user_id === row.user_id;
    }
    // 企业和政府用户暂时使用模拟数据
    return true;
  });

  // 进一步过滤出当前显示的车牌号码对应的车辆信息
  const carNumbers = Array.isArray(row.car_numbers)
    ? row.car_numbers
    : [row.car_numbers];
  selectedCars.value = userCars.filter((car) =>
    carNumbers.includes(car.car_number),
  );

  // 打开抽屉
  if (carDetailDrawerRef.value) {
    carDetailDrawerRef.value.open();
  }
};

// 处理车辆详情抽屉关闭事件
const handleCarDetailClose = () => {
  selectedCars.value = [];
};

const selectedUser = ref(null);
const isAuthDrawerVisible = ref(false);

const handleUserDetail = (row) => {
  selectedDetailUser.value = row;
  if (detailDrawerRef.value) {
    detailDrawerRef.value.open();
  }
};

const handleAuthManage = (row = {}) => {
  selectedUser.value = row;
  isAuthDrawerVisible.value = true;
};

// 处理认证成功事件
const handleAuthSuccess = ({ user, newCertStatus }) => {
  const index = dataObj.apilist.findIndex(
    (item) =>
      (props.userType === '个人' && item.user_id === user.user_id) ||
      (props.userType === '企业' &&
        item.enterprise_id === user.enterprise_id) ||
      (props.userType === '政府' && item.gov_user_id === user.gov_user_id),
  );
  if (index !== -1) {
    // 更新用户数据
    dataObj.apilist[index] = {
      ...dataObj.apilist[index],
      cert_status: newCertStatus,
      update_time: new Date().toLocaleString('zh-CN'),
    };
  }
  handleRefresh();
};

// 关闭认证抽屉
const handleAuthDrawerClose = () => {
  isAuthDrawerVisible.value = false;
  selectedUser.value = null;
};
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer>
      <Form />
    </FormDrawer>

    <!-- 用户详情抽屉 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :title="
        selectedDetailUser?.user_name ||
        selectedDetailUser?.enterprise_name ||
        '用户详情'
      "
      :data="selectedDetailUser"
      :fields="detailFields"
      @close="handleDetailClose"
      @confirm="handleDetailClose"
    />

    <!-- 车辆详情抽屉 -->
    <DetailDrawer
      ref="carDetailDrawerRef"
      title="车辆信息"
      :data="selectedCars"
      :fields="carDetailFields"
      @close="handleCarDetailClose"
      @confirm="handleCarDetailClose"
    />

    <!-- 认证管理抽屉组件 -->
    <AuthManagementDrawer
      v-model:visible="isAuthDrawerVisible"
      :selected-user="selectedUser"
      :user-type="props.userType"
      :data-list="dataObj.apilist"
      @close="handleAuthDrawerClose"
      @success="handleAuthSuccess"
    />
    <!-- <NewFormModel @success="handleRefresh" /> -->
    <searchDrawer title="搜索栏设置" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <!-- 三级状态 -->
      <template #table-title>
        <div class="tabel-title-container">
          <div v-if="props.secondShow" class="tabel-tabs-container">
            <!-- 状态标签页 -->
            <el-tabs
              v-model="activeStatus"
              class="demo-tabs auth-status-tabs"
              @tab-change="handleStatusChange"
            >
              <el-tab-pane
                v-for="item in statusTabs"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.value"
              />
            </el-tabs>
          </div>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量删除"
            icon-name="delete"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="用户认证"
            icon-name="FolderChecked"
            @click="handleAuthManage"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <!-- 认证状态插槽 -->
      <template #certStatus="{ row }">
        <el-tag
          :type="
            row.cert_status === '已认证'
              ? 'success'
              : row.cert_status === '待审核'
                ? 'warning'
                : row.cert_status === '认证失败'
                  ? 'danger'
                  : 'info'
          "
        >
          {{ row.cert_status }}
        </el-tag>
      </template>
      <!-- 账号状态插槽 -->
      <template #accountStatus="{ row }">
        <el-tag
          :type="
            row.account_status === '正常'
              ? 'success'
              : row.account_status === '禁用'
                ? 'danger'
                : row.account_status === '冻结'
                  ? 'warning'
                  : 'info'
          "
        >
          {{ row.account_status }}
        </el-tag>
      </template>
      <!-- 代付规则状态插槽 -->
      <template #proxyStatus="{ row }">
        <el-tag
          :type="
            row.proxy_status === '启用'
              ? 'success'
              : row.proxy_status === '禁用'
                ? 'danger'
                : 'info'
          "
        >
          {{ row.proxy_status }}
        </el-tag>
      </template>
      <!-- 在线状态插槽 -->
      <template #onlineStatus="{ row }">
        <el-tag :type="row.online_status === '在线' ? 'success' : 'info'">
          {{ row.online_status }}
        </el-tag>
      </template>
      <template #userName="{ row }">
        <el-text
          @click="handleUserDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.user_name }}
        </el-text>
      </template>
      <template #enterpriseName="{ row }">
        <el-text
          @click="handleUserDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.enterprise_name }}
        </el-text>
      </template>
      <!-- 绑定车牌插槽 -->
      <template #carNumbers="{ row }">
        <el-text
          v-if="row.car_numbers && row.car_numbers.length > 0"
          @click="handleCarNumbersClick(row)"
          class="common-align"
          type="primary"
        >
          {{
            Array.isArray(row.car_numbers)
              ? row.car_numbers.join(', ')
              : row.car_numbers
          }}
        </el-text>
        <span v-else>
          {{
            Array.isArray(row.car_numbers)
              ? row.car_numbers.join(', ')
              : row.car_numbers || '-'
          }}
        </span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="Document"
            @click="handleUserDetail(row)"
          />
          <IconButton
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="禁用"
            icon-name="Remove"
            :disabled="row.account_status !== '正常'"
            @click="confirmDisable(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <span>
            <template v-if="props.userType === '个人'">
              本页统计：用户数量{{ dataObj.list.length }};认证通过:{{
                dataObj.list.filter((item) => item.cert_status === '已认证')
                  .length
              }};待审核:{{
                dataObj.list.filter((item) => item.cert_status === '待审核')
                  .length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常')
                  .length
              }}
            </template>
            <template v-else-if="props.userType === '企业'">
              本页统计：企业数量{{ dataObj.list.length }};认证通过:{{
                dataObj.list.filter((item) => item.cert_status === '已认证')
                  .length
              }};待审核:{{
                dataObj.list.filter((item) => item.cert_status === '待审核')
                  .length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常')
                  .length
              }}
            </template>
            <template v-else-if="props.userType === '政府'">
              本页统计：用户数量{{ dataObj.list.length }};在线:{{
                dataObj.list.filter((item) => item.online_status === '在线')
                  .length
              }};离线:{{
                dataObj.list.filter((item) => item.online_status === '离线')
                  .length
              }};正常账号:{{
                dataObj.list.filter((item) => item.account_status === '正常')
                  .length
              }}
            </template>
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span> 全部统计：{{ dataObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.tabel-title-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 0;
}

.tabel-tabs-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-type-tabs {
  margin-bottom: 0;
}

.auth-status-tabs {
  margin-bottom: 0;
}

.merchant-detail h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.related-users-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-item {
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.user-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.user-item-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.user-item-index {
  margin-right: 8px;
  font-weight: bold;
  color: #409eff;
}

.user-item-name {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.user-item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.5;
}

.detail-label {
  width: 100px;
  margin-right: 16px;
  font-weight: 500;
  color: #606266;
  text-align: right;
}

.detail-value {
  flex: 1;
  color: #303133;
}

.empty-list {
  padding: 40px 0;
  color: #909399;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
}

.relateField {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.relateField:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.auth-management h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.auth-management h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.auth-management h5 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
}

.auth-steps {
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f2f5;
}

.main-auth-steps {
  padding: 20px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}

.main-auth-steps h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.auth-step-content {
  padding: 0;
}

.auth-type-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-type-option {
  padding: 12px 16px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.auth-type-option:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 8%);
}

.auth-type-option.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.auth-type-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
}

.auth-type-icon {
  margin-right: 4px;
  font-size: 16px;
  color: #409eff;
}

.auth-type-label {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.auth-type-description {
  margin-bottom: 6px;
  margin-left: 34px;
  font-size: 13px;
  color: #606266;
}

.auth-type-required {
  margin: 0;
  margin-left: 34px;
  font-size: 12px;
  color: #e6a23c;
}

.auth-description {
  margin-top: 20px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 6px;
}

.auth-description-list {
  padding: 0;
  margin: 8px 0 0;
  color: #606266;
  list-style-type: none;
}

.auth-description-list li {
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.mt-4 {
  margin-top: 16px;
}

.mt-3 {
  margin-top: 12px;
}

.text-muted {
  margin-bottom: 16px;
  font-size: 14px;
  color: #909399;
}

.text-warning {
  color: #e6a23c;
}

.bg-info-light {
  background-color: #ecf5ff;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 8px;
}

.w-60 {
  width: 240px;
}

.w-full {
  width: 100%;
}

/* 移除步骤指示器的默认图标 */
:deep(.el-step__icon.is-text) {
  color: #fff;
  background-color: #e4e7ed;
}

:deep(.el-step__icon.is-text.is-success) {
  background-color: #67c23a;
}

:deep(.el-step__icon.is-text.is-active) {
  background-color: #409eff;
}

/* 调整步骤标题样式 */
:deep(.el-step__title) {
  font-size: 14px;
  color: #909399;
}

:deep(.el-step__title.is-success) {
  color: #67c23a;
}

:deep(.el-step__title.is-active) {
  font-weight: bold;
  color: #303133;
}

/* 调整步骤线样式 */
:deep(.el-step__line) {
  background-color: #e4e7ed;
}

:deep(.el-step__line.is-success) {
  background-color: #67c23a;
}
</style>
