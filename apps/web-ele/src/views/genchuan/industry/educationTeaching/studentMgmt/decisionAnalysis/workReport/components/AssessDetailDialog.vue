<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAssessMgmtPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/workReport/data.js';

// 本地模拟数据
const mockAssess = [
  { id: 8, className: '计算机2201班', assessType: '文明班级', cycle: '月', score: 94.8, rankNo: 1, createTime: Date.now() - 259200000 },
  { id: 9, className: '护理2401班', assessType: '卫生', cycle: '周', score: 92.0, rankNo: 2, createTime: Date.now() - 345600000 },
];

const props = defineProps({
  row: { type: Object, default: () => ({}) },
});

const columns = [
  { field: 'className', title: '班级', minWidth: 150 },
  { field: 'assessType', title: '考评类型', minWidth: 120 },
  { field: 'cycle', title: '周期', minWidth: 100 },
  { field: 'score', title: '得分', minWidth: 100, sortable: true },
  { field: 'rankNo', title: '排名', minWidth: 100, sortable: true },
  { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-' },
];

const fetchData = async (pageParams) => {
  try {
    const res = await getAssessMgmtPage({
      className: props.row.className,
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return { list: res.data.list, total: res.data.total };
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    let list = [...mockAssess];
    if (props.row.className) list = list.filter(a => a.className === props.row.className);
    const total = list.length;
    const start = (pageParams.currentPage - 1) * pageParams.pageSize;
    const sliced = list.slice(start, start + pageParams.pageSize);
    return { list: sliced, total };
  }
};

const dataObj = reactive({ totalShow: true, total: 0, currentPage: 1, pageSize: 10, loading: false });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: { ajax: { query: async ({ page }) => await fetchData(page) } },
    rowConfig: { keyField: 'id' },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true },
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

const open = () => {
  detailDrawerApi.open();
  dataObj.currentPage = 1;
  gridApi.query();
};

defineExpose({ open });
</script>

<template>
  <DetailDrawer title="考评明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid />
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container { padding: 10px; }
</style>
