<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const currentConfig = ref({
  title: '',
  apiUrl: null,
  extraParams: {},
});

const columns = ref([]);
const loading = ref(false);
const gridKey = ref(0);

// 根据数据动态生成列配置
const generateColumns = (data) => {
  if (!data || data.length === 0) return [];
  const firstRow = data[0];
  const excludeKeys = ['id', 'createTime', 'updateTime', 'reserve1', 'reserve2'];
  return Object.keys(firstRow)
    .filter(key => !excludeKeys.includes(key))
    .map(key => ({
      field: key,
      title: key,
      minWidth: 120,
      sortable: true,
      formatter: ({cellValue}) => {
        if (cellValue === null || cellValue === undefined) return '-';
        if (typeof cellValue === 'number') return cellValue;
        if (typeof cellValue === 'object') return JSON.stringify(cellValue);
        return cellValue;
      },
    }));
};

const fetchData = async (pageParams) => {
  const {apiUrl, extraParams} = currentConfig.value;
  if (!apiUrl || typeof apiUrl !== 'function') return {list: [], total: 0};
  loading.value = true;
  try {
    const res = await apiUrl({
      ...extraParams,
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data) {
      const {list, total} = res.data;
      if (list && list.length > 0 && columns.value.length === 0) {
        columns.value = generateColumns(list);
      }
      return {list: list || [], total: total || 0};
    }
    return {list: [], total: 0};
  } catch (error) {
    console.error('明细数据获取失败', error);
    return {list: [], total: 0};
  } finally {
    loading.value = false;
  }
};

const dataObj = reactive({
  totalShow: true,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: {
      ajax: {query: async ({page}) => await fetchData(page)},
    },
    rowConfig: {keyField: 'id'},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
    loadingConfig: {text: '加载中...'},
    showOverflow: true,
  },
  showSearchForm: false,
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (config) => {
  columns.value = [];
  gridKey.value++;
  currentConfig.value = {
    title: config.title || '明细列表',
    apiUrl: config.apiUrl,
    extraParams: config.extraParams || {},
  };
  detailDrawerApi.open();
  await nextTick();
  await gridApi.query();
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer :title="currentConfig.title" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid :key="gridKey" v-loading="loading"/>
      <div v-if="!loading && gridApi.getTableData?.list?.length === 0"
           style="text-align: center; padding: 20px; color: #909399;">
        暂无数据
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container {
  padding: 10px;
}
</style>
