<script setup>import { ref, watch } from 'vue';
import { ElDialog, ElMessage } from 'element-plus';
import { getPlateIdentifyPage } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import { formatTimestamp } from '#/utils';
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    plateNo: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['update:visible']);
const plateDetailData = ref({});
const loading = ref(false);
const handleClose = () => {
    emit('update:visible', false);
};
const fetchPlateDetail = async () => {
    if (!props.plateNo)
        return;
    loading.value = true;
    try {
        const res = await getPlateIdentifyPage({ plateNo: props.plateNo });
        if (res.list && Array.isArray(res.list)) {
            const plate = res.list.find(item => item.plateNo === props.plateNo);
            if (plate) {
                const formattedPlate = {
                    ...plate,
                    createTime: formatTimestamp(plate.createTime),
                    updateTime: formatTimestamp(plate.updateTime)
                };
                plateDetailData.value = formattedPlate;
            }
            else {
                plateDetailData.value = null;
                ElMessage.info('暂无车牌数据');
            }
        }
        else {
            plateDetailData.value = null;
            ElMessage.info('暂无车牌数据');
        }
    }
    catch (error) {
        console.error('获取车牌详情失败:', error);
        ElMessage.error('获取车牌详情失败');
        plateDetailData.value = null;
    }
    finally {
        loading.value = false;
    }
};
watch(() => props.visible, (val) => {
  if (val) {
    fetchPlateDetail();
  }
});
</script>

<template>
    <ElDialog :model-value="visible" title="车牌详情" width="800px" append-to-body
        @update:model-value="emit('update:visible', $event)" @close="handleClose">
        <div v-if="loading" class="loading-container">
            <span>加载中...</span>
        </div>
        <div v-else-if="plateDetailData" class="plate-detail-container">
            <div class="detail-row">
                <span class="detail-label">主键ID:</span>
                <span class="detail-value">{{ plateDetailData.id }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">车牌:</span>
                <span class="detail-value">{{ plateDetailData.plateNo }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">车牌颜色:</span>
                <span class="detail-value">{{ plateDetailData.plateColor }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">置信度:</span>
                <span class="detail-value">{{ plateDetailData.confidence }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">图片URL:</span>
                <span class="detail-value">{{ plateDetailData.imageUrl }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">识别状态:</span>
                <span class="detail-value">{{ plateDetailData.status }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">场站名称:</span>
                <span class="detail-value">{{ plateDetailData.stationName }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">备注:</span>
                <span class="detail-value">{{ plateDetailData.remark }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">创建者:</span>
                <span class="detail-value">{{ plateDetailData.creator }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">更新者:</span>
                <span class="detail-value">{{ plateDetailData.updater }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ plateDetailData.createTime }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">更新时间:</span>
                <span class="detail-value">{{ plateDetailData.updateTime }}</span>
            </div>
        </div>
        <div v-else class="no-data">
            暂无车牌数据
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </template>
    </ElDialog>
</template>

<style scoped>
.plate-detail-container {
    padding: 16px;
}

.detail-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    width: 100px;
    font-weight: 500;
    color: #606266;
    font-size: 14px;
    flex-shrink: 0;
}

.detail-value {
    flex: 1;
    color: #303133;
    font-size: 14px;
    word-break: break-all;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
}

.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: #909399;
    font-size: 14px;
}

.dialog-footer {
    text-align: right;
}
</style>