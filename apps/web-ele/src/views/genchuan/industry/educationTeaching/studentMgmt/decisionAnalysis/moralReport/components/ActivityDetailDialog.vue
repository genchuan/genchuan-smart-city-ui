<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMoralActivityPage } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';

// 本地模拟数据（确保至少有一条）
const mockActivities = [
  { id: 10, activityName: '学雷锋志愿服务', activityType: 'volunteer', hostDept: 1001, startTime: Date.now() - 86400000, endTime: Date.now() - 43200000, joinNum: 120, status: 'published', createTime: Date.now() - 86400000 },
  { id: 11, activityName: '诚信主题教育', activityType: 'theme', hostDept: 1002, startTime: Date.now() - 172800000, endTime: Date.now() - 86400000, joinNum: 85, status: 'published', createTime: Date.now() - 172800000 },
];

const columns = [
  {field: 'activityName', title: '活动名称', minWidth: 180},
  {field: 'activityType', title: '活动类型', minWidth: 120},
  {field: 'joinNum', title: '参与人数', minWidth: 120, sortable: true},
  {
    field: 'startTime',
    title: '开始时间',
    minWidth: 180,
    formatter: ({cellValue}) => cellValue ? new Date(cellValue).toLocaleString() : '-'
  },
  {
    field: 'endTime',
    title: '结束时间',
    minWidth: 180,
    formatter: ({cellValue}) => cellValue ? new Date(cellValue).toLocaleString() : '-'
  },
  {field: 'status', title: '状态', minWidth: 100},
  {
    field: 'createTime',
    title: '创建时间',
    minWidth: 180,
    formatter: ({cellValue}) => cellValue ? new Date(cellValue).toLocaleString() : '-'
  },
];

// 数据获取：优先使用真实接口，失败时使用本地模拟数据
const fetchData = async (pageParams) => {
  try {
    const res = await getMoralActivityPage({
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return {list: res.data.list, total: res.data.total};
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    const list = [...mockActivities];
    const total = list.length;
    const start = (pageParams.currentPage - 1) * pageParams.pageSize;
    const sliced = list.slice(start, start + pageParams.pageSize);
    return {list: sliced, total};
  }
};

const dataObj = reactive({totalShow: true, total: 0, currentPage: 1, pageSize: 10, loading: false});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    proxyConfig: {ajax: {query: async ({page}) => await fetchData(page)}},
    rowConfig: {keyField: 'id'},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
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

defineExpose({open});
</script>

<template>
  <DetailDrawer title="活动参与明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <Grid/>
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container {
  padding: 10px;
}
</style>
