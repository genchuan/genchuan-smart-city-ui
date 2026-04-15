<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BpmModelApi, ModelCategoryInfo } from '#/api/bpm/model';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useAccess } from '@vben/access';
import { confirm, EllipsisText, useVbenModal } from '@vben/common-ui';
import { BpmModelFormType } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';
import { useUserStore } from '@vben/stores';
import { cloneDeep, formatDateTime, isEqual } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import { useSortable } from '@vueuse/integrations/useSortable';
import {
  ElButton,
  ElCard,
  ElDropdown,
  ElLoading,
  ElMessage,
  ElTag,
  ElTooltip,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCategory } from '#/api/bpm/category';
import {
  cleanModel,
  deleteModel,
  deployModel,
  updateModelSortBatch,
  updateModelState,
} from '#/api/bpm/model';
import { $t } from '#/locales';

import CategoryRenameForm from '../../category/modules/rename-form.vue';
import FormCreateDetail from '../../form/modules/detail.vue';
import { useGridColumns } from '../data';

const props = defineProps<{
  categoryInfo: ModelCategoryInfo;
  isCategorySorting: boolean;
  isFirst?: boolean;
}>();

const emit = defineEmits(['success']);

const [CategoryRenameModal, categoryRenameModalApi] = useVbenModal({
  connectedComponent: CategoryRenameForm,
  destroyOnClose: true,
});

const [FormCreateDetailModal, formCreateDetailModalApi] = useVbenModal({
  connectedComponent: FormCreateDetail,
  destroyOnClose: true,
});

const router = useRouter();
const userId = useUserStore().userInfo?.id;

const isModelSorting = ref(false);
const originalData = ref<BpmModelApi.Model[]>([]);
const modelList = ref<BpmModelApi.Model[]>([]);
const isExpand = ref(props.isFirst); // 控制模型列表展开/收起

const sortableInstance = ref<any>(null);

const { hasAccessByCodes } = useAccess();
const hasPermiUpdate = computed(() => hasAccessByCodes(['bpm:model:update']));
const hasPermiDelete = computed(() => hasAccessByCodes(['bpm:model:delete']));
const hasPermiDeploy = computed(() => hasAccessByCodes(['bpm:model:deploy']));

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    data: modelList.value,
    keepSource: true,
    pagerConfig: { enabled: false },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { enabled: false },
  } as VxeTableGridOptions,
});

/** 监听外部传入的模型列表，同步到 modelList 并更新表格 */
watch(
  () => props.categoryInfo.modelList,
  (newList) => {
    if (!newList) return;
    modelList.value = cloneDeep(newList);
    gridApi.setGridOptions({ data: modelList.value });
  },
  { immediate: true, deep: true },
);

/** 处理模型的排序 */
function handleModelSort() {
  if (props.categoryInfo.modelList && props.categoryInfo.modelList.length > 0) {
    originalData.value = cloneDeep(props.categoryInfo.modelList);
    modelList.value = cloneDeep(props.categoryInfo.modelList);
  }
  gridApi.setGridOptions({ data: modelList.value });
  isExpand.value = true;
  isModelSorting.value = true;

  if (sortableInstance.value) {
    sortableInstance.value.option('disabled', false);
  } else {
    sortableInstance.value = useSortable(
      `.category-${props.categoryInfo.id} .vxe-table .vxe-table--body-wrapper:not(.fixed-right--wrapper) .vxe-table--body tbody`,
      modelList.value,
      {
        draggable: '.vxe-body--row',
        animation: 150,
        handle: '.drag-handle',
        disabled: false,
        onEnd: ({ newDraggableIndex, oldDraggableIndex }) => {
          if (oldDraggableIndex !== newDraggableIndex) {
            modelList.value.splice(
              newDraggableIndex ?? 0,
              0,
              modelList.value.splice(oldDraggableIndex ?? 0, 1)[0]!,
            );
          }
        },
      },
    );
  }
}

/** 提交模型排序 */
async function handleModelSortSubmit() {
  if (!modelList.value || modelList.value.length === 0) {
    ElMessage.error('排序数据异常，请重试');
    return;
  }
  const loadingInstance = ElLoading.service({ text: '正在保存排序...' });
  try {
    const ids = modelList.value.map((item) => item.id);
    await updateModelSortBatch(ids);
    isModelSorting.value = false;
    ElMessage.success('排序模型成功');
    emit('success');
  } catch (error) {
    console.error('排序保存失败', error);
  } finally {
    loadingInstance.close();
  }
}

/** 取消模型排序 */
function handleModelSortCancel() {
  if (originalData.value && originalData.value.length > 0) {
    modelList.value = cloneDeep(originalData.value);
    gridApi.setGridOptions({ data: modelList.value });
  }
  if (sortableInstance.value) {
    sortableInstance.value.option('disabled', true);
  }
  isModelSorting.value = false;
}

/** 分类操作命令 */
function handleCommand(command: string) {
  if (command === 'renameCategory') {
    categoryRenameModalApi.setData(props.categoryInfo).open();
  } else if (command === 'deleteCategory') {
    handleDeleteCategory();
  }
}

/** 删除分类 */
async function handleDeleteCategory() {
  if (props.categoryInfo.modelList.length > 0) {
    ElMessage.warning('该分类下仍有流程定义,不允许删除');
    return;
  }
  await confirm({
    beforeClose: async ({ isConfirm }) => {
      if (!isConfirm) return;
      const loadingInstance = ElLoading.service({
        text: `正在删除分类: "${props.categoryInfo.name}"...`,
      });
      try {
        await deleteCategory(props.categoryInfo.id);
      } finally {
        loadingInstance.close();
      }
      return true;
    },
    content: `确定要删除[${props.categoryInfo.name}]吗？`,
    icon: 'question',
  });
  ElMessage.success($t('ui.actionMessage.deleteSuccess', [props.categoryInfo.name]));
  emit('success');
}

/** 查看表单详情 */
async function handleFormDetail(row: any) {
  if (row.formType === BpmModelFormType.NORMAL) {
    formCreateDetailModalApi.setData({ id: row.formId }).open();
  } else {
    await router.push({ path: row.formCustomCreatePath });
  }
}

/** 是否为流程管理员 */
function isManagerUser(row: any) {
  return row.managerUserIds && row.managerUserIds.includes(userId);
}

/** 模型操作（修改/复制） */
async function modelOperation(type: string, id: number) {
  await router.push({ name: 'BpmModelUpdate', params: { id, type } });
}

/** 发布流程 */
async function handleDeploy(row: any) {
  await confirm({
    beforeClose: async ({ isConfirm }) => {
      if (!isConfirm) return;
      const loadingInstance = ElLoading.service({ text: `正在发布流程: "${row.name}"...` });
      try {
        await deployModel(row.id);
      } finally {
        loadingInstance.close();
      }
      return true;
    },
    content: `确认要发布[${row.name}]流程吗？`,
    icon: 'question',
  });
  ElMessage.success(`发布[${row.name}]流程成功`);
  emit('success');
}

/** 更多操作 */
function handleModelCommand(command: string, row: any) {
  switch (command) {
    case 'handleChangeState':
      handleChangeState(row);
      break;
    case 'handleClean':
      handleClean(row);
      break;
    case 'handleCopy':
      modelOperation('copy', row.id);
      break;
    case 'handleDefinitionList':
      handleDefinitionList(row);
      break;
    case 'handleDelete':
      handleDelete(row);
      break;
    case 'handleReport':
      handleReport(row);
      break;
  }
}

/** 启用/停用流程 */
async function handleChangeState(row: any) {
  const state = row.processDefinition.suspensionState;
  const newState = state === 1 ? 2 : 1;
  const statusState = state === 1 ? '停用' : '启用';
  await confirm({
    beforeClose: async ({ isConfirm }) => {
      if (!isConfirm) return;
      const loadingInstance = ElLoading.service({ text: `正在${statusState}流程: "${row.name}"...` });
      try {
        await updateModelState(row.id, newState);
      } finally {
        loadingInstance.close();
      }
      return true;
    },
    content: `确认要${statusState}流程: "${row.name}" 吗？`,
    icon: 'question',
  });
  ElMessage.success(`${statusState} 流程: "${row.name}" 成功`);
  emit('success');
}

/** 清理流程 */
async function handleClean(row: any) {
  await confirm({
    beforeClose: async ({ isConfirm }) => {
      if (!isConfirm) return;
      const loadingInstance = ElLoading.service({ text: `正在清理流程: "${row.name}"...` });
      try {
        await cleanModel(row.id);
      } finally {
        loadingInstance.close();
      }
      return true;
    },
    content: `确认要清理流程: "${row.name}" 吗？`,
    icon: 'question',
  });
  ElMessage.success(`清理流程: "${row.name}" 成功`);
  emit('success');
}

/** 删除流程 */
async function handleDelete(row: any) {
  await confirm({
    beforeClose: async ({ isConfirm }) => {
      if (!isConfirm) return;
      const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.deleting', [row.name]) });
      try {
        await deleteModel(row.id);
      } finally {
        loadingInstance.close();
      }
      return true;
    },
    content: `确认要删除流程: "${row.name}" 吗？`,
    icon: 'question',
  });
  ElMessage.success(`删除流程: "${row.name}" 成功`);
  emit('success');
}

/** 跳转历史版本列表 */
function handleDefinitionList(row: any) {
  router.push({ name: 'BpmProcessDefinition', query: { key: row.key } });
}

/** 跳转报表 */
function handleReport(row: any) {
  router.push({
    name: 'BpmProcessInstanceReport',
    query: {
      processDefinitionId: row.processDefinition.id,
      processDefinitionKey: row.key,
    },
  });
}

/** 重命名成功回调 */
function handleRenameSuccess() {
  emit('success');
}
</script>

<template>
  <div>
    <ElCard body-style="padding: 0" shadow="hover" class="category-draggable-model mb-5 rounded-lg transition-all duration-300 ease-in-out">
      <!-- 分类头部 -->
      <div class="flex h-12 items-center">
        <div class="flex items-center">
          <ElTooltip v-if="isCategorySorting" content="拖动排序">
            <IconifyIcon icon="ic:round-drag-indicator" class="drag-handle ml-2.5 cursor-move text-2xl text-gray-500" />
          </ElTooltip>
          <div class="ml-4 mr-2 text-lg font-medium">{{ categoryInfo.name }}</div>
          <div class="text-gray-500">({{ categoryInfo.modelList?.length || 0 }})</div>
        </div>

        <div class="flex flex-1 items-center" v-show="!isCategorySorting">
          <!-- 展开/收起箭头 -->
          <div
            v-if="categoryInfo.modelList.length > 0"
            class="ml-3 flex cursor-pointer items-center transition-transform duration-300"
            :class="isExpand ? 'rotate-180' : 'rotate-0'"
            @click="isExpand = !isExpand"
          >
            <IconifyIcon icon="lucide:chevron-down" class="text-3xl text-gray-400" />
          </div>

          <div class="ml-auto flex items-center" :class="isModelSorting ? 'mr-4' : 'mr-8'">
            <template v-if="!isModelSorting">
              <ElButton
                v-if="categoryInfo.modelList.length > 0"
                link
                size="small"
                class="flex items-center text-sm"
                @click.stop="handleModelSort"
              >
                <IconifyIcon icon="lucide:align-start-vertical" class="mr-1" />
                排序
              </ElButton>
              <ElDropdown placement="bottom" trigger="click">
                <ElButton link size="small" class="flex items-center text-sm">
                  <IconifyIcon icon="lucide:settings" class="mr-1" />
                  分类
                </ElButton>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleCommand('renameCategory')">重命名</el-dropdown-item>
                    <el-dropdown-item @click="handleCommand('deleteCategory')">删除分类</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </ElDropdown>
            </template>
            <template v-else>
              <ElButton @click.stop="handleModelSortCancel" class="mr-2">取消</ElButton>
              <ElButton type="primary" @click.stop="handleModelSortSubmit">保存排序</ElButton>
            </template>
          </div>
        </div>
      </div>

      <!-- 模型列表（使用 v-show 控制展开/收起） -->
      <div v-show="isExpand" :class="`category-${categoryInfo.id}`">
        <div v-if="modelList && modelList.length > 0" class="px-4 pb-4 overflow-x-auto">
          <Grid>
            <!-- 流程名称（含拖拽手柄） -->
            <template #name="{ row }">
              <div class="flex items-center overflow-hidden">
                <ElTooltip v-if="isModelSorting" content="拖动排序" placement="left">
                  <IconifyIcon icon="ic:round-drag-indicator" class="drag-handle mr-2.5 flex-shrink-0 cursor-move text-2xl text-gray-500" />
                </ElTooltip>
                <div
                  v-if="!row.icon"
                  class="mr-2.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-blue-500 text-white"
                >
                  <span class="text-xs">{{ row.name.substring(0, 2) }}</span>
                </div>
                <img v-else :src="row.icon" class="mr-2.5 h-9 w-9 flex-shrink-0 rounded" alt="图标" />
                <div class="min-w-0 overflow-hidden">
                  <EllipsisText :tooltip-when-ellipsis="true">{{ row.name }}</EllipsisText>
                </div>
              </div>
            </template>

            <!-- 可见范围 -->
            <template #startUserIds="{ row }">
              <span v-if="!row.startUsers?.length && !row.startDepts?.length">全部可见</span>
              <span v-else-if="row.startUsers?.length === 1">{{ row.startUsers[0].nickname }}</span>
              <span v-else-if="row.startDepts?.length === 1">{{ row.startDepts[0].name }}</span>
              <span v-else-if="row.startDepts?.length > 1">
                <ElTooltip placement="top" :content="row.startDepts.map((dept: any) => dept.name).join('、')">
                  {{ row.startDepts[0].name }}等 {{ row.startDepts.length }} 个部门可见
                </ElTooltip>
              </span>
              <span v-else-if="row.startUsers?.length > 1">
                <ElTooltip placement="top" :content="row.startUsers.map((user: any) => user.nickname).join('、')">
                  {{ row.startUsers[0].nickname }}等 {{ row.startUsers.length }} 人可见
                </ElTooltip>
              </span>
            </template>

            <!-- 表单信息 -->
            <template #formInfo="{ row }">
              <ElButton v-if="row.formType === BpmModelFormType.NORMAL" link @click="handleFormDetail(row)">
                {{ row.formName }}
              </ElButton>
              <ElButton v-else-if="row.formType === BpmModelFormType.CUSTOM" link @click="handleFormDetail(row)">
                {{ row.formCustomCreatePath }}
              </ElButton>
              <span v-else>暂无表单</span>
            </template>

            <!-- 部署时间 / 版本 / 状态 -->
            <template #deploymentTime="{ row }">
              <div class="flex items-center justify-center">
                <span v-if="row.processDefinition" class="w-36">
                  {{ formatDateTime(row.processDefinition.deploymentTime) }}
                </span>
                <ElTag v-if="row.processDefinition"> v{{ row.processDefinition.version }} </ElTag>
                <ElTag v-else type="warning">未部署</ElTag>
                <ElTag v-if="row.processDefinition?.suspensionState === 2" type="warning" class="ml-2.5">已停用</ElTag>
              </div>
            </template>

            <!-- 操作按钮 -->
            <template #actions="{ row }">
              <div class="flex items-center justify-center space-x-2">
                <ElButton link size="small" @click="modelOperation('update', row.id)" :disabled="!isManagerUser(row) && !hasPermiUpdate">
                  修改
                </ElButton>
                <ElButton link size="small" @click="handleDeploy(row)" :disabled="!isManagerUser(row) && !hasPermiDeploy">
                  发布
                </ElButton>
                <ElDropdown placement="bottom-end" trigger="click">
                  <ElButton link size="small">更多</ElButton>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleModelCommand('handleCopy', row)">复制</el-dropdown-item>
                      <el-dropdown-item @click="handleModelCommand('handleDefinitionList', row)">历史</el-dropdown-item>
                      <el-dropdown-item @click="handleModelCommand('handleReport', row)" :disabled="!isManagerUser(row)">
                        报表
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="row.processDefinition"
                        @click="handleModelCommand('handleChangeState', row)"
                        :disabled="!isManagerUser(row)"
                      >
                        {{ row.processDefinition.suspensionState === 1 ? '停用' : '启用' }}
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleModelCommand('handleClean', row)" :disabled="!isManagerUser(row)">
                        清理
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleModelCommand('handleDelete', row)" :disabled="!isManagerUser(row) && !hasPermiDelete">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </ElDropdown>
              </div>
            </template>
          </Grid>
        </div>
        <div v-else class="p-4 text-center text-gray-400">暂无流程模型</div>
      </div>
    </ElCard>

    <CategoryRenameModal @success="handleRenameSuccess" />
    <FormCreateDetailModal />
  </div>
</template>
