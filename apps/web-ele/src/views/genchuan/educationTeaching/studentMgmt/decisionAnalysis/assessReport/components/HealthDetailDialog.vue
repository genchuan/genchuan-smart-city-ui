<script setup>
import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'date', title: '评分日期', minWidth: 120 },
  { field: 'score', title: '卫生得分', minWidth: 100, sortable: true },
  { field: 'inspector', title: '检查人', minWidth: 100 },
  { field: 'remark', title: '备注', minWidth: 150 },
];

// 获取卫生明细（模拟数据）
const fetchData = async (params) => {
  // TODO: 替换为真实API
  // return requestClient.get('/studentmgmt/assess-report/health-detail', { params });
  console.log('请求卫生明细:', params);
  const mockList = [];
  for (let i = 1; i <= 7; i++) {
    mockList.push({
      id: i,
      date: `2026-04-${String(i).padStart(2, '0')}`,
      score: (Math.random() * 30).toFixed(1),
      inspector: ['张老师', '李老师', '王老师'][Math.floor(Math.random() * 3)],
      remark: i % 2 === 0 ? '地面干净' : '桌椅整齐',
    });
  }
  return {list: mockList, total: mockList.length};
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({page}) => {
          const res = await fetchData({
            className: currentRow.value.className,
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          });
          dataObj.value = res;
          return res;
        },
      },
    },
    rowConfig: {keyField: 'id'},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
    showOverflow: true,
  },
  showSearchForm: false,
});

// 使用 Drawer 替代 Modal
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,      // 非模态，支持同时打开多个
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel: () => detailDrawerApi.close(),
});

const open = async (row) => {
  currentRow.value = row;
  detailDrawerApi.open();
  setTimeout(() => gridApi.query(), 100);
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer title="卫生考评明细" class="genchuan-detail-drawer">
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
