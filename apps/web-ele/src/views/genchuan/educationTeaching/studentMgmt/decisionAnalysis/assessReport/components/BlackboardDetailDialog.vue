<script setup>
import { reactive, ref, watch } from 'vue';
import {useVbenDrawer} from '@vben/common-ui';
import {useVbenVxeGrid} from '#/adapter/vxe-table';

const currentRow = ref({});

const columns = [
  {type: 'seq', width: 60, title: '序号'},
  {field: 'evaluateDate', title: '评比日期', minWidth: 120},
  {field: 'score', title: '得分', minWidth: 100, sortable: true},
  {field: 'inspector', title: '评比人', minWidth: 100},
  {field: 'theme', title: '主题', minWidth: 120},
  {field: 'comment', title: '点评', minWidth: 150},
];

const fetchData = async (params) => {
  console.log('请求黑板报明细:', params);
  // TODO: 替换为真实API
  // return requestClient.get('/studentmgmt/assess-report/blackboard-detail', { params });
  const mockList = [];
  for (let i = 1; i <= 4; i++) {
    mockList.push({
      id: i,
      evaluateDate: `2026-04-${i * 7}`,
      score: (Math.random() * 30).toFixed(1),
      inspector: ['美术老师', '德育处'][Math.floor(Math.random() * 2)],
      theme: ['安全主题', '环保主题', '节日主题'][Math.floor(Math.random() * 3)],
      comment: '内容丰富，版面美观',
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
    proxyConfig: {
      ajax: {
        query: async ({page}) =>
          await fetchData({className: currentRow.value.className, ...page}),
      },
    },
    rowConfig: {keyField: 'id'},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true},
  },
  showSearchForm: false,
});

// 使用 Drawer 替代 Modal
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,      // 非模态，支持同时打开多个
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel: () => detailDrawerApi.close(),
  // 可以添加 class 样式，但推荐在模板上添加
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
  <DetailDrawer title="黑板报评比明细" class="genchuan-detail-drawer">
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
