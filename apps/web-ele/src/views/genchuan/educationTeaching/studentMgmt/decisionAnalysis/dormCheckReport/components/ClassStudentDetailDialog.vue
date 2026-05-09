<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  { type: 'seq', width: 60, title: '序号' },
  { field: 'studentName', title: '学生姓名', minWidth: 120 },
  { field: 'studentNo', title: '学号', minWidth: 150 },
  { field: 'dormNo', title: '宿舍号', minWidth: 100 },
  { field: 'phone', title: '联系电话', minWidth: 130 },
];

// 生成全量模拟数据（共 35 条，用于分页演示）
const generateFullList = () => {
  const list = [];
  for (let i = 1; i <= 35; i++) {
    list.push({
      id: i,
      studentName: `学生${i}`,
      studentNo: `2024${String(i).padStart(3, '0')}`,
      dormNo: `${Math.floor(Math.random() * 500) + 100}`,
      phone: `138${String(Math.random() * 100000000).slice(0, 8)}`,
    });
  }
  return list;
};
const fullList = generateFullList();

const fetchData = async (params) => {
  console.log('请求班级学生明细:', params);
  const { currentPage, pageSize } = params;
  const start = (currentPage - 1) * pageSize;
  const list = fullList.slice(start, start + pageSize);
  return { list, total: fullList.length };
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
    proxyConfig: {
      ajax: {
        query: async ({page}) => {
          const res = await fetchData({
            className: currentRow.value.className,
            currentPage: page.currentPage,
            pageSize: page.pageSize
          });
          dataObj.total = res.total;
          dataObj.list = res.list;
          return res;
        },
      },
    },
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

const open = async (row) => {
  currentRow.value = row;
  detailDrawerApi.open();
  setTimeout(() => gridApi.query(), 100);
};

const close = () => detailDrawerApi.close();

defineExpose({open, close});
</script>

<template>
  <DetailDrawer title="班级学生明细" class="genchuan-detail-drawer">
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
