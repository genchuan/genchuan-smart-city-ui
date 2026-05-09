<script setup>
import {reactive, ref} from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {useVbenVxeGrid} from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  {type: 'seq', width: 60, title: '序号'},
  {field: 'date', title: '统计日期', minWidth: 120},
  {field: 'totalCount', title: '应到人数', minWidth: 100},
  {field: 'inDormCount', title: '实际在寝人数', minWidth: 120},
  {field: 'inDormRate', title: '在寝率(%)', minWidth: 100},
  {field: 'formula', title: '计算公式', minWidth: 200},
];

const generateFullList = () => {
  const list = [];
  for (let i = 1; i <= 31; i++) {
    const total = 30;
    const inDorm = Math.floor(Math.random() * 30);
    const rate = ((inDorm / total) * 100).toFixed(2);
    list.push({
      id: i,
      date: `2026-04-${String(i).padStart(2, '0')}`,
      totalCount: total,
      inDormCount: inDorm,
      inDormRate: rate,
      formula: `${inDorm} / ${total} * 100% = ${rate}%`,
    });
  }
  return list;
};
const fullList = generateFullList();

const fetchData = async (params) => {
  const {currentPage, pageSize} = params;
  const start = (currentPage - 1) * pageSize;
  const list = fullList.slice(start, start + pageSize);
  return {list, total: fullList.length};
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
  <DetailDrawer title="考勤率计算明细" class="genchuan-detail-drawer">
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
