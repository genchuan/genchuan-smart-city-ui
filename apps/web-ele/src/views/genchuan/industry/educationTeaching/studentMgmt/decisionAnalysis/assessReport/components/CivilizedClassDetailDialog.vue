<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCivilizedClassDetailList } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'evaluateDate', title: '评比日期', minWidth: 120 },
  { field: 'score', title: '得分', minWidth: 100, sortable: true },
  { field: 'inspector', title: '评比人', minWidth: 100 },
  { field: 'items', title: '评比项目', minWidth: 150},
  {field: 'remark', title: '备注', minWidth: 150},
];

// 使用文件1中的接口，适配分页参数格式
const fetchData = async (params) => {
  // params 可能包含 { className, currentPage, pageSize }
  const pageNo = params.currentPage || 1;
  const pageSize = params.pageSize || 10;
  const res = await getCivilizedClassDetailList({
    className: currentRow.value.className,
    pageNo,
    pageSize,
  });
  if (res.code === 200) {
    return {
      list: res.data.list,
      total: res.data.total,
    };
  } else {
    console.error('获取文明班级明细失败', res.msg);
    return {list: [], total: 0};
  }
};

const dataObj = reactive({
  totalShow: true,   // 显示总数
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: {
      ajax: {
        query: async ({page}) => await fetchData({...page, className: currentRow.value.className}),
      },
    },
    rowConfig: {keyField: 'id'},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
  },
  showSearchForm: false,
});

// 使用 Drawer
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (row) => {
  currentRow.value = row;
  detailDrawerApi.open();
  // 打开后刷新表格数据
  await gridApi.query();
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer title="文明班级评比明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <div class="info-bar">班级：{{ currentRow.className }}</div>
      <Grid/>
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container {
  padding: 10px;
}

.info-bar {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
}
</style>
