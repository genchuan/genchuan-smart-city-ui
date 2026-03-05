import { ref } from 'vue';

import { thingsBoardLogin } from '#/api/genchuan/thingsBoard';

/**
 * ThingsBoard 登录响应类型
 */
interface ThingsBoardLoginResponse {
  refreshToken: string;
  token: string;
}

/**
 * ThingsBoard 认证 composable
 * 用于管理 ThingsBoard 的登录状态和 token 刷新
 */
export function useThingsBoardAuth() {
  const isAuthenticating = ref(false);

  /**
   * 检查 ThingsBoard 登录状态并登录
   * 如果 token 不存在或已过期（超过2分钟），则重新登录
   */
  const ensureThingsBoardLogin = async (): Promise<boolean> => {
    const token = window.localStorage.getItem('thingsBoardJwt_token');
    const jwtTime = window.localStorage.getItem('thingsBoardJwt_time');

    // 如果 token 存在且未过期（2分钟内），直接返回成功
    if (token && jwtTime && Date.now() - Number(jwtTime) < 120_000) {
      return true;
    }

    // 需要重新登录
    isAuthenticating.value = true;
    try {
      const loginData = {
        username: import.meta.env.VITE_THINGS_BOARD_NAME,
        password: import.meta.env.VITE_THINGS_BOARD_PASSWORD,
      };
      const res = (await thingsBoardLogin(
        loginData,
      )) as unknown as ThingsBoardLoginResponse;
      window.localStorage.setItem('thingsBoardJwt_token', res.token);
      window.localStorage.setItem('thingsBoardRefresh_token', res.refreshToken);
      window.localStorage.setItem('thingsBoardJwt_time', Date.now().toString());
      return true;
    } catch (error) {
      console.error('ThingsBoard 登录失败:', error);
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  };

  /**
   * 强制重新登录 ThingsBoard
   */
  const reLogin = async (): Promise<boolean> => {
    // 清除旧的 token
    window.localStorage.removeItem('thingsBoardJwt_token');
    window.localStorage.removeItem('thingsBoardJwt_time');
    return ensureThingsBoardLogin();
  };

  /**
   * 获取当前 token
   */
  const getToken = (): null | string => {
    return window.localStorage.getItem('thingsBoardJwt_token');
  };

  /**
   * 检查是否已登录
   */
  const isLoggedIn = (): boolean => {
    const token = window.localStorage.getItem('thingsBoardJwt_token');
    const jwtTime = window.localStorage.getItem('thingsBoardJwt_time');
    return !!(token && jwtTime && Date.now() - Number(jwtTime) < 120_000);
  };

  return {
    ensureThingsBoardLogin,
    getToken,
    isAuthenticating,
    isLoggedIn,
    reLogin,
  };
}
