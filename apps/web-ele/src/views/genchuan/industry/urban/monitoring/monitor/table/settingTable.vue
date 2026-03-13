<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElLoading, ElMessage } from 'element-plus';
import { $t } from '#/locales';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import IconButton from '#/components/common/IconButton.vue';

import { useFormSchema, useGridColumns } from './data';

const props = defineProps({
  // 接收父组件传递的数据
  dataList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'update-data']);

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

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

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === '新增') {
      // 为新增数据生成唯一 ID
      const newId = String(Date.now());
      obj.id = newId;
      // 设置默认值
      obj.tiltAngle = 0.0;
      obj.vibrationData = 0.0;
      obj.monitorStatus = '已停止';
      obj.syncDuration = 3;
      obj.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // 添加到数据源
      dataObj.apilist.unshift(obj);
    } else {
      dataObj.apilist = dataObj.apilist.map(item => {
        if (item.id === formData.value?.id) {
          return { ...item, ...obj };
        }
        return item;
      });
    }
    handleRefresh();
    formDrawerApi.close();
    // 发送更新后的数据给父组件
    emit('update-data', [...dataObj.apilist]);
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formApi.setState((prev) => {
    return {
      schema: useFormSchema(),
    };
  });
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

function handleEdit(row) {
  formApi.setState((prev) => {
    return {
      schema: useFormSchema().map((v) => {
        return {
          ...v,
        };
      }),
    };
  });
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
    // 发送更新后的数据给父组件
    emit('update-data', [...dataObj.apilist]);
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
  // 发送更新后的数据给父组件
  emit('update-data', [...dataObj.apilist]);
}

const checkedIds = ref([]);
const recordsList = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}

const dataObj = reactive({
  totalShow: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
});

const getTableData = async (pageObj) => {
  const page = pageObj.page;
  dataObj.total = dataObj.apilist.length;
  dataObj.list = dataObj.apilist.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
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

async function onSubmit() {
  gridApi.reload();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
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

const handleSerachShow = () => {
  drawerApi.open();
};

// 初始化时加载数据
onMounted(() => {
  // 使用父组件传递的数据
  if (props.dataList && props.dataList.length > 0) {
    dataObj.apilist = [...props.dataList];
    dataObj.total = dataObj.apilist.length;
  }
});
</script>

<template>
  <div class="park-lot-table-new config-monitor-content">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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
            content="关闭"
            icon-name="Close"
            @click="emit('close')"
          />
        </div>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
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
      <template #bottom>
        <div class="common-total"></div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.common-toolbar-tools {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  
  .icon-button {
    flex-shrink: 0;
  }
}

.config-monitor-content {
  padding: 20px;
  
  p {
    margin: 0;
    color: #666;
    text-align: center;
    line-height: 1.5;
  }
}
</style>
