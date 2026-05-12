<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDormHealthDetailList } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/dormCompareReport/data.js';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'checkDate', title: '检查日期', minWidth: 120 },
  { field: 'score', title: '卫生得分', minWidth: 100, sortable: true },
  { field: 'inspector', title: '检查人', minWidth: 100 },
  { field: 'remark', title: '备注', minWidth: 150 },
];

// 使用文件1的接口（动态生成模拟数据，保证任何宿舍号都有数据）
const fetchData = async (params) => {
  // params 结构: { page: { currentPage, pageSize } }
  const pageNo = params.page?.currentPage || 1;
  const pageSize = params.page?.pageSize || 10;
  const res = await getDormHealthDetailList({
    dormNo: currentRow.value.dormNo,
    pageNo,
    pageSize,
  });
  if (res.code === 200) {
    return {
      list: res.data.list,
      total: res.data.total,
    };
  } else {
    console.error('获取宿舍卫生明细失败', res.msg);
    return { list: [], total: 0 };
  }
};

// 分页配置（保持与您原代码一致的 reactive 对象，但开启 totalShow）
const dataObj = reactive({
  totalShow: true,    // 改为 true，显示总条数
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({page}) => await fetchData({page}),
      },
    },
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
    showOverflow: true,
  },
  showSearchForm: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => drawerApi.close(),
});

const open = async (row) => {
  if (!row) return;
  currentRow.value = row;
  drawerApi.open();
  await gridApi.query();  // 确保数据刷新
};

const close = () => drawerApi.close();

defineExpose({open, close});
</script>

<template>
  <Drawer title="宿舍卫生评比明细" class="genchuan-detail-drawer">
    <div class="detail-container">
      <div class="info-bar">宿舍号：{{ currentRow.dormNo }}</div>
      <Grid/>
    </div>
  </Drawer>
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
