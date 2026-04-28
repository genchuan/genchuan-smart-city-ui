<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { downloadFileFromBlobPart } from '@vben/utils';
import AlarmDetailDrawer from './components/alarmDetail.vue';
import PileDetailDrawer from './components/pileDetail.vue';
import {
  dataList,
  getPileAlarmPage,
  dispatchPileAlarm,
  handlePileAlarm,
  closePileAlarm,
  remarkPileAlarm,
  exportPileAlarm,
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/pileAlarm/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/pileAlarm/form.js';

// 辅助函数：状态标签类型
const getStatusType = (status) => {
  const map = {
    '未派单': 'warning',
    '已派单': 'primary',
    '处置中': 'success',
    '已销单': 'info',
  };
  return map[status] || 'info';
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// 放在辅助函数定义区域（例如在 getStatusType 函数后面）
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 提取日期部分（用于筛选）
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ---------- 标签筛选（支持数组多值） ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  // 如果当前已有相同字段的筛选
  if (tagFilters.value[field] !== undefined) {
    const existing = tagFilters.value[field];
    // 如果新值等于旧值，则删除该筛选
    if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
      delete tagFilters.value[field];
    } else if (!Array.isArray(existing) && existing === value) {
      delete tagFilters.value[field];
    } else {
      // 否则替换为新值（单值或数组）
      tagFilters.value[field] = value;
    }
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

// 清除所有筛选
function clearFilters() {
  tagFilters.value = {};
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    station: '所属场站',
    faultType: '故障类型',
    alarmLevel: '告警等级',
    alarmTime: '告警时间',
    handleUser: '处理人员',
    alarmStatus: '告警状态',
    disposeTime: '处置时间',
    operator: '操作人',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 原有变量 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  pileDetail: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (params.alarmTime && Array.isArray(params.alarmTime) && params.alarmTime.length === 2) {
      params.alarmTimeStart = params.alarmTime[0];
      params.alarmTimeEnd = params.alarmTime[1];
      delete params.alarmTime;
    }
    const res = await getPileAlarmPage(params);
    // 直接使用返回的数据，不再判断 res.code
    let filtered = res.list.filter(v => activeName.value === '全部' || v.alarmStatus === activeName.value);
    // 应用标签筛选（支持数组多值）
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'station': itemValue = item.stationName; break;
          case 'faultType': itemValue = item.faultType; break;
          case 'alarmLevel': itemValue = item.alarmLevel; break;
          case 'alarmTime':
            const alarmDate = item.alarmTime ? item.alarmTime.split(' ')[0] : '';
            itemValue = alarmDate;
            break;
          case 'handleUser': itemValue = item.handleUserName || item.handleUser; break;
          case 'alarmStatus': itemValue = item.alarmStatus; break;
          case 'disposeTime':
            const disposeDate = item.disposeTime ? item.disposeTime.split(' ')[0] : '';
            itemValue = disposeDate;
            break;
          case 'operator': itemValue = item.createBy || '-'; break;
          default: itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    // ✅ 修改点1：使用后端返回的总记录数
    dataObj.total = res.total;
    // ✅ 修改点2：直接使用当前页数据（res.list 已经是当前页数据，不需要再 slice）
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = dataList();
    let filtered = mockData.filter(v => activeName.value === '全部' || v.alarmStatus === activeName.value);
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'station': itemValue = item.stationName; break;
          case 'faultType': itemValue = item.faultType; break;
          case 'alarmLevel': itemValue = item.alarmLevel; break;
          case 'alarmTime':
            const alarmDate = item.alarmTime ? item.alarmTime.split(' ')[0] : '';
            itemValue = alarmDate;
            break;
          case 'handleUser': itemValue = item.handleUserName || item.handleUser; break;
          case 'alarmStatus': itemValue = item.alarmStatus; break;
          case 'disposeTime':
            const disposeDate = item.disposeTime ? item.disposeTime.split(' ')[0] : '';
            itemValue = disposeDate;
            break;
          case 'operator': itemValue = 'admin'; break;
          default: itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = filtered.length;
    // 模拟数据时仍需要前端分页
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  } finally {
    dataObj.loading = false;
  }
  return dataObj;
};

function handleRefresh() { gridApi.reload(); }

async function handleExport() {
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportPileAlarm();
      downloadFileFromBlobPart({ fileName: '充电桩告警列表.xls', source: data });
      ElMessage.success('导出成功');
    } finally { loading.close(); }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

async function handleBatchDispatch() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条告警记录'); return; }
  const selectedRows = checkedRows.value.filter(row => row.alarmStatus === '未派单');

  try {
    const { value: handler } = await ElMessageBox.prompt('请输入处理人员', '派单', {
      confirmButtonText: '确认', cancelButtonText: '取消', inputPlaceholder: '请输入处理人员姓名',
    });
    if (handler) {
      const loading = ElLoading.service({ text: '派单中...' });
      try {
        const promises = selectedRows.map(row => dispatchPileAlarm({ id: row.id, handleUserId: handler }));
        const results = await Promise.all(promises);
        const allSuccess = results.every(res => res === true);
        if (allSuccess) {
          selectedRows.forEach(row => { row.alarmStatus = '已派单'; row.handleUser = handler; row.handleUser = handler; row.handleUserName = handler; });
          ElMessage.success('派单成功'); handleRefresh();
        } else { ElMessage.error('部分派单失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

async function handleBatchDispose() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条告警记录'); return; }
  const selectedRows = checkedRows.value.filter(row => row.alarmStatus === '已派单');

  try {
    const { value: measure } = await ElMessageBox.prompt('请输入处置措施', '处置', {
      confirmButtonText: '确认', cancelButtonText: '取消', inputPlaceholder: '请输入处置措施',
    });
    if (measure) {
      const loading = ElLoading.service({ text: '处置中...' });
      try {
        const promises = selectedRows.map(row => handlePileAlarm({ id: row.id, disposeMeasure: measure }));
        const results = await Promise.all(promises);
        const allSuccess = results.every(res => res === true);
        if (allSuccess) {
          const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\//g, '-');
          selectedRows.forEach(row => { row.alarmStatus = '处置中'; row.disposeMeasure = measure; row.disposeTime = now; });
          ElMessage.success('处置成功'); handleRefresh();
        } else { ElMessage.error('部分处置失败'); }
      } finally { loading.close(); }
    }
  } catch {}
}

async function handleBatchClose() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一条告警记录'); return; }
  const selectedRows = checkedRows.value.filter(row => row.alarmStatus === '处置中');

  try {
    await ElMessageBox.confirm('确认销单？销单后告警状态将变为"已销单"，且需确认设备已恢复正常。', '销单确认', {
      confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',
    });
    const loading = ElLoading.service({ text: '销单中...' });
    try {
      const promises = selectedRows.map(row => closePileAlarm({ id: row.id }));
      const results = await Promise.all(promises);
      const allSuccess = results.every(res => res === true);
      if (allSuccess) {
        const now = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\//g, '-');
        selectedRows.forEach(row => { row.alarmStatus = '已销单'; row.disposeTime = now; });
        ElMessage.success('销单成功'); handleRefresh();
      } else { ElMessage.error('部分销单失败'); }
    } finally { loading.close(); }
  } catch {}
}

async function handleRowDispatch(row) {
  try {
    const { value: handler } = await ElMessageBox.prompt('请输入处理人员', '派单', {
      confirmButtonText: '确认', cancelButtonText: '取消', inputValue: row.handleUser || '',
    });
    if (handler) {
      const loading = ElLoading.service({ text: '派单中...' });
      try {
        const res = await dispatchPileAlarm({ id: row.id, handleUserId: handler });
        if (res === true) {
          row.alarmStatus = '已派单'; row.handleUser = handler; row.handleUser = handler; row.handleUserName = handler;
          ElMessage.success('派单成功'); handleRefresh();
        } else {
          ElMessage.error('派单失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {
  }
}

async function handleRowDispose(row) {
  try {
    const {value: measure} = await ElMessageBox.prompt('请输入处置措施', '处置', {
      confirmButtonText: '确认', cancelButtonText: '取消', inputValue: row.disposeMeasure || '',
    });
    if (measure) {
      const loading = ElLoading.service({text: '处置中...'});
      try {
        const res = await handlePileAlarm({id: row.id, disposeMeasure: measure});
        if (res === true) {
          row.alarmStatus = '处置中';
          row.disposeMeasure = measure;
          row.disposeTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(/\//g, '-');
          ElMessage.success('处置成功');
          handleRefresh();
        } else {
          ElMessage.error('处置失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {
  }
}

async function handleRowClose(row) {
  try {
    await ElMessageBox.confirm('确认销单？销单后告警状态将变为"已销单"。', '销单确认', {
      confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning',
    });
    const loading = ElLoading.service({text: '销单中...'});
    try {
      const res = await closePileAlarm({id: row.id});
      if (res === true) {
        row.alarmStatus = '已销单';
        row.disposeTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-');
        ElMessage.success('销单成功');
        handleRefresh();
      } else {
        ElMessage.error('销单失败');
      }
    } finally {
      loading.close();
    }
  } catch {
  }
}

async function handleRowRemark(row) {
  try {
    const {value: remark} = await ElMessageBox.prompt('请输入备注', '备注', {
      confirmButtonText: '确认', cancelButtonText: '取消', inputValue: row.remark || '',
    });
    if (remark !== null) {
      const loading = ElLoading.service({text: '保存备注中...'});
      try {
        const res = await remarkPileAlarm({id: row.id, remark});
        if (res === true) {
          row.remark = remark;
          ElMessage.success('备注添加成功');
          handleRefresh();
        } else {
          ElMessage.error('备注添加失败');
        }
      } finally {
        loading.close();
      }
    }
  } catch {
  }
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: (values) => {
    searchParams.value = {...values};
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({columns: gridColumns.value});
  gridApi.reload();
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const alarmDetailDrawerRef = ref(null);
const pileDetailDrawerRef = ref(null);

const handleOpenAlarmDetail = (row) => {
  dataObj.detailObj = row;
  alarmDetailDrawerRef.value.open();
};

const handleOpenPileDetail = (row) => {
  dataObj.pileDetail = {
    pileCode: row.pileCode,
    pileName: row.pileName,
    stationId: row.stationId,
    stationName: row.stationName
  };
  pileDetailDrawerRef.value.open();
};

const handleFilterDisposeTime = (row) => {
  if (row.disposeTime) {
    const disposeDate = row.disposeTime.split(' ')[0];
    handleFilterTagClick('disposeTime', disposeDate);
  }
};

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({handleFilterTagClick, clearFilters});
</script>

<template>
  <div class="park-lot-table-new">
    <AlarmDetailDrawer ref="alarmDetailDrawerRef" :detail-obj="dataObj.detailObj"/>
    <PileDetailDrawer ref="pileDetailDrawerRef" :detail-obj="dataObj.pileDetail"/>
    <Drawer title="搜索">
      <QueryForm/>
    </Drawer>
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" v-if="false"></div>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="批量派单" icon-name="User" @click="handleBatchDispatch"/>
          <IconButton content="批量处置" icon-name="Finished" @click="handleBatchDispose"/>
          <IconButton content="批量销单" icon-name="EditPen" color="#F56C6C"
                      @click="handleBatchClose"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart"
                      @click="toggleChart"/>
        </div>
      </template>
      <template #alarmCode="{ row }">
        <el-text @click="handleOpenAlarmDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.alarmCode }}
        </el-text>
      </template>
      <template #pileCode="{ row }">
        <el-text @click="handleOpenPileDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.pileName }}
        </el-text>
      </template>
      <template #station="{ row }">
        <el-text @click="handleFilterTagClick('station', row.stationName)" type="primary"
                 style="cursor: pointer;">{{ row.stationName }}
        </el-text>
      </template>
      <template #faultType="{ row }">
        <el-text @click="handleFilterTagClick('faultType', row.faultType)" type="primary"
                 style="cursor: pointer;">{{ row.faultType }}
        </el-text>
      </template>
      <template #alarmLevel="{ row }">
        <el-tag :type="row.alarmLevel === '一级' ? 'danger' : row.alarmLevel === '二级' ? 'warning' : 'info'"
                @click="handleFilterTagClick('alarmLevel', row.alarmLevel)"
                style="cursor: pointer;">{{ row.alarmLevel }}
        </el-tag>
      </template>
      <template #alarmTime="{ row }">
        <el-text @click="handleFilterTagClick('alarmTime', getDateFromTimestamp(row.alarmTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.alarmTime) }}
        </el-text>
      </template>
      <template #manager="{ row }">
        <el-text @click="handleFilterTagClick('handleUser', row.handleUserName || row.handleUser)" type="primary"
                 style="cursor: pointer;">{{ row.handleUserName || row.handleUser || '-' }}
        </el-text>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="getStatusType(row.alarmStatus)"
                @click="handleFilterTagClick('alarmStatus', row.alarmStatus)"
                style="cursor: pointer;">{{ row.alarmStatus }}
        </el-tag>
      </template>
      <template #disposeTime="{ row }">
        <el-text @click="handleFilterDisposeTime(row)" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.disposeTime) }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenAlarmDetail(row)"/>
          <IconButton content="备注" icon-name="edit" @click="handleRowRemark(row)"/>
          <IconButton v-if="row.alarmStatus === '未派单'" content="派单" icon-name="User"
                      @click="handleRowDispatch(row)"/>
          <IconButton v-if="row.alarmStatus === '已派单'" content="处置" icon-name="Finished"
                      @click="handleRowDispose(row)"/>
          <IconButton v-if="row.alarmStatus === '处置中'" content="销单" icon-name="EditPen"
                      color="#F56C6C" @click="handleRowClose(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
