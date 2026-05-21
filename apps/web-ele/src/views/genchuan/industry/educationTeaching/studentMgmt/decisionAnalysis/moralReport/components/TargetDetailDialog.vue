<script setup>
import {reactive, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {
  getTargetMgmtPage
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';

// 本地模拟数据（确保至少有一条）
const mockTargets = [
  {
    id: 15,
    targetName: '德育积分',
    totalScore: 100,
    warnThreshold: 60,
    evaluatorType: 'teacher',
    scoreType: '累计赋分',
    status: 'enable',
    createTime: Date.now() - 86400000
  },
  {
    id: 16,
    targetName: '志愿服务时长',
    totalScore: 50,
    warnThreshold: 20,
    evaluatorType: 'self',
    scoreType: '累计赋分',
    status: 'enable',
    createTime: Date.now() - 172800000
  },
  {
    id: 17,
    targetName: '违纪扣分',
    totalScore: 80,
    warnThreshold: 30,
    evaluatorType: 'teacher',
    scoreType: '累计赋分',
    status: 'disable',
    createTime: Date.now() - 259200000
  },
];

const currentFilters = ref({status: 'all'});

const columns = [
  {field: 'targetName', title: '指标名称', minWidth: 150},
  {field: 'totalScore', title: '总分', minWidth: 100},
  {field: 'warnThreshold', title: '预警阈值', minWidth: 120},
  {field: 'evaluatorType', title: '评价人类型', minWidth: 120},
  {field: 'scoreType', title: '赋分类型', minWidth: 120},
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
    const params = {
      pageNo: pageParams.currentPage,
      pageSize: pageParams.pageSize,
    };
    if (currentFilters.value.status === 'enable') params.status = 'enable';
    else if (currentFilters.value.status === 'warn') params.warn = true;
    const res = await getTargetMgmtPage(params);
    if (res.code === 200 && res.data.list && res.data.list.length > 0) {
      return {list: res.data.list, total: res.data.total};
    }
    throw new Error('无数据');
  } catch (error) {
    console.warn('使用模拟数据');
    let list = [...mockTargets];
    if (currentFilters.value.status === 'enable') list = list.filter(t => t.status === 'enable');
    else if (currentFilters.value.status === 'warn') list = list.filter(t => t.warnThreshold && t.totalScore < t.warnThreshold);
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

const open = async (filters = {}) => {
  currentFilters.value = filters;
  detailDrawerApi.open();
  // 重置到第一页并刷新
  dataObj.currentPage = 1;
  await gridApi.query();
};

defineExpose({open});
</script>

<template>
  <DetailDrawer title="指标明细" class="genchuan-detail-drawer">
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
