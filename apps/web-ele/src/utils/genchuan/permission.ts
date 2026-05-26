import { useAccessStore } from '@vben/stores';
import type { Router } from 'vue-router';
import { ElMessage } from 'element-plus';

/**
 * 权限检查与升级跳转工具函数
 *
 * 用于在按钮点击事件中检查用户是否具有指定权限，
 * 如果没有权限，则提示用户并跳转到会员升级页面。
 *
 * @param permissionCode 权限码，如 'vehiclecharging:charging-lot:update'
 * @param router Vue Router 实例（必须在组件setup中通过useRouter()获取后传入）
 * @param options 配置选项
 * @returns boolean 是否有权限（true=有权限可继续执行，false=无权限已拦截）
 *
 * @example
 * // 在<script setup>中使用
 * import { useRouter } from 'vue-router';
 * import { checkPermissionAndUpgrade } from '#/utils/genchuan/permission';
 *
 * const router = useRouter();
 *
 * function handleEdit(row) {
 *   if (!checkPermissionAndUpgrade('vehiclecharging:charging-lot:update', router)) {
 *     return; // 无权限，已自动跳转升级页面
 *   }
 *   // 有权限，执行原有逻辑...
 * }
 */
export function checkPermissionAndUpgrade(
  permissionCode: string,
  router: Router,
  options?: {
    showMessage?: boolean;
    message?: string;
    upgradePath?: string;
  },
): boolean {
  const accessStore = useAccessStore();

  // 检查是否有该权限
  const hasPermission = accessStore.accessCodes.includes(permissionCode);

  if (!hasPermission) {
    // 无权限时的处理
    if (options?.showMessage !== false) {
      ElMessage.warning(
        options?.message ||
          '此功能需要升级会员才能使用，正在为您跳转到会员升级页面...',
      );
    }

    // 延迟跳转，让消息显示出来
    setTimeout(() => {
      router.push(options?.upgradePath || '/member/upgrade');
    }, 800);

    return false;
  }

  return true;
}

/**
 * 批量权限检查工具函数
 * 检查用户是否拥有多个权限中的任意一个
 *
 * @param permissionCodes 权限码数组
 * @param router Vue Router 实例
 * @param options 配置选项
 * @returns boolean 是否有任一权限
 */
export function checkAnyPermissionAndUpgrade(
  permissionCodes: string[],
  router: Router,
  options?: {
    showMessage?: boolean;
    message?: string;
    upgradePath?: string;
  },
): boolean {
  const accessStore = useAccessStore();

  // 检查是否有任意一个权限
  const hasAnyPermission = permissionCodes.some((code) =>
    accessStore.accessCodes.includes(code),
  );

  if (!hasAnyPermission) {
    if (options?.showMessage !== false) {
      ElMessage.warning(
        options?.message ||
          '您缺少必要的操作权限，请先升级会员以解锁功能。',
      );
    }

    setTimeout(() => {
      router.push(options?.upgradePath || '/member/upgrade');
    }, 800);

    return false;
  }

  return true;
}
