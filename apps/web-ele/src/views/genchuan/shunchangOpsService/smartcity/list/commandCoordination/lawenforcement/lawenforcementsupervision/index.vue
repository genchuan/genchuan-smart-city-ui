<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { confirm } from '@vben/common-ui';
import {
  LawEnforcementSupervisionApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/commandCoordination/lawenforcement/lawenforcementsupervision';
import download from '#/utils/genchuan/download';
import { dateFormatter, dateFormatter2 } from '#/utils/genchuan/formatTime';
import { ElMessage, ElCard, ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker, ElPagination, ElSpace, ElTag } from 'element-plus';
import { Icon } from '@iconify/vue';
import { $t } from '#/locales';

import LawEnforcementSupervisionForm from './LawEnforcementSupervisionForm.vue';

/** 执法监督 列表 */
defineOptions({ name: 'LawEnforcementSupervision' });

const loading = ref(true); // 列表的加载中
const list = ref([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  supervisionId: undefined,
  eventNumber: undefined,
  officials: undefined,
  createTime: [],
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data =
      await LawEnforcementSupervisionApi.getLawEnforcementSupervisionPage(
        queryParams,
      );
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await confirm('是否确认删除该执法监督数据？', '系统提示');
    // 发起删除
    await LawEnforcementSupervisionApi.deleteLawEnforcementSupervision(id);
    ElMessage.success('删除成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await confirm('是否确认导出所有执法监督数据？', '系统提示');
    // 发起导出
    exportLoading.value = true;
    const data =
      await LawEnforcementSupervisionApi.exportLawEnforcementSupervision(
        queryParams,
      );
    download.excel(data, '执法监督.xls');
  } catch {} finally {
    exportLoading.value = false;
  }
};

/** 初始化 */
onMounted(() => {
  getList();
});
</script>

<template>
  <div class="p-4">
    <!-- 搜索工作栏 -->
    <ElCard class="mb-4" shadow="never">
      <ElForm
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <ElFormItem label="监督编号" prop="supervisionId">
          <ElInput
            v-model="queryParams.supervisionId"
            placeholder="请输入监督编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="执法事件编号" prop="eventNumber">
          <ElInput
            v-model="queryParams.eventNumber"
            placeholder="请输入执法事件编号"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <ElFormItem label="执法人员" prop="officials">
          <ElInput
            v-model="queryParams.officials"
            placeholder="请输入执法人员"
            clearable
            @keyup.enter="handleQuery"
            style="width: 240px"
          />
        </ElFormItem>
        <!--<ElFormItem label="创建时间" prop="createTime">
          <ElDatePicker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            style="width: 220px"
          />
        </ElFormItem>-->
        <ElFormItem>
          <ElSpace>
            <ElButton type="primary" @click="handleQuery">
              <Icon icon="ep:search" style="margin-right: 4px" /> 搜索
            </ElButton>
            <ElButton @click="resetQuery">
              <Icon icon="ep:refresh" style="margin-right: 4px" /> 重置
            </ElButton>
            <ElButton
              type="success"
              @click="openForm('create')"
            >
              <Icon icon="ep:plus" style="margin-right: 4px" /> 新增
            </ElButton>
            <ElButton
              type="warning"
              @click="handleExport"
              :loading="exportLoading"
            >
              <Icon icon="ep:download" style="margin-right: 4px" /> 导出
            </ElButton>
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 列表 -->
    <ElCard shadow="never">
      <ElTable
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        style="width: 100%"
      >
        <ElTableColumn label="主键" align="center" prop="id" min-width="50" />
        <ElTableColumn label="监督编号" align="center" prop="supervisionId" min-width="140" />
        <ElTableColumn label="执法事件编号" align="center" prop="eventNumber" min-width="140" />
        <ElTableColumn label="执法人员" align="center" prop="officials" min-width="100" />
        <ElTableColumn label="监督人员" align="center" prop="personnel" min-width="100" />
        <ElTableColumn label="监督时间" align="center" prop="time" :formatter="dateFormatter2" min-width="120" />
        <ElTableColumn label="监督类型" align="center" min-width="150">
          <template #default="scope">
            <template v-if="scope.row.method === 'internal_recorder'">执法记录仪核查</template>
            <template v-else-if="scope.row.method === 'internal_replay'">执法过程回放</template>
            <template v-else-if="scope.row.method === 'internal_document'">执法文书审查</template>
            <template v-else-if="scope.row.method === 'internal_case_review'">执法案件评查</template>
            <template v-else-if="scope.row.method === 'internal_performance'">执法绩效考核</template>
            <template v-else-if="scope.row.method === 'external_complaint'">投诉举报核查</template>
            <template v-else-if="scope.row.method === 'external_satisfaction'">满意度调查</template>
            <template v-else-if="scope.row.method === 'external_information'">信息公开检查</template>
            <template v-else>{{ scope.row.method }}</template>
          </template>
        </ElTableColumn>
        <ElTableColumn label="监督证据" min-width="120" align="center">
          <template #default="scope">
            <template v-if="scope.row.integrityCollection === 'recorder_video'">执法记录仪视频</template>
            <template v-else-if="scope.row.integrityCollection === 'law_document'">执法文书</template>
            <template v-else-if="scope.row.integrityCollection === 'complaint_evidence'">投诉举报证据</template>
            <template v-else-if="scope.row.integrityCollection === 'satisfaction_survey'">满意度调查问卷</template>
            <template v-else-if="scope.row.integrityCollection === 'information_public'">信息公开材料</template>
            <template v-else-if="scope.row.integrityCollection === 'no_evidence'">无监督证据</template>
            <template v-else>{{ scope.row.integrityCollection }}</template>
          </template>
        </ElTableColumn>
        <ElTableColumn label="群众满意度" align="center" prop="satisfactionInvolved" min-width="120" />
        <ElTableColumn label="监督结果" align="center" min-width="120">
          <template #default="scope">
            <ElTag type="success" effect="light" v-if="scope.row.resultEvaluation === 'qualified'">合格</ElTag>
            <ElTag type="warning" effect="light" v-else-if="scope.row.resultEvaluation === 'minor_violation'">轻微违规</ElTag>
            <ElTag type="danger" effect="light" v-else-if="scope.row.resultEvaluation === 'serious_violation'">严重违规</ElTag>
            <ElTag type="info" effect="light" v-else-if="scope.row.resultEvaluation === 'rectified'">已完成整改</ElTag>
            <ElTag type="info" effect="light" v-else-if="scope.row.resultEvaluation === 'no_need_rectify'">无需整改</ElTag>
            <ElTag effect="light" v-else>{{ scope.row.resultEvaluation }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="监督问题描述" align="center" prop="violationDescription" min-width="150" />
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          min-width="180"
        />
        <ElTableColumn label="操作" align="center" fixed="right" min-width="120">
          <template #default="scope">
            <ElSpace>
              <ElButton
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
              >
                编辑
              </ElButton>
              <ElButton
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
              >
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <ElPagination
          :total="total"
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </ElCard>

    <!-- 表单弹窗：添加/修改 -->
    <LawEnforcementSupervisionForm ref="formRef" @success="getList" />
  </div>
</template>
