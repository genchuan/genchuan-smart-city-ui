<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMorningExerciseDetailList } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'date', title: '评分日期', minWidth: 120 },
  { field: 'score', title: '早操得分', minWidth: 100, sortable: true },
  { field: 'inspector', title: '检查人', minWidth: 100 },
  { field: 'attendanceRate', title: '出勤率', minWidth: 100 },
];

// 使用文件1中的接口
const fetchData = async (params) => {
  // params 格式: { page: { currentPage, pageSize } }
  const pageNo = params.page?.currentPage || 1;
  const pageSize = params.page?.pageSize || 10;
  const res = await getMorningExerciseDetailList({
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
    console.error('获取早操明细失败', res.msg);
    return {list: [], total: 0};
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: {
      ajax: {
        query: async ({page}) => await fetchData({page}),
      },
    },
    rowConfig: {keyField: 'id'},
    pagerConfig: {
      totalShow: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    toolbarConfig: {refresh: true},
  },
  showSearchForm: false,
});

// 使用 Drawer
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (row) => {
  currentRow.value = row;
  detailDrawerApi.open();
  await gridApi.query(); // 确保数据刷新
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer title="早操考评明细" class="genchuan-detail-drawer">
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
