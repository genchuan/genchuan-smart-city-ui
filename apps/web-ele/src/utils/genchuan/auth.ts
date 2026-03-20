import { useAccessStore } from '@vben/stores';

import { decryptData, encryptData } from '#/utils/encrypt';

const AccessTokenKey = 'ACCESS_TOKEN';
const RefreshTokenKey = 'REFRESH_TOKEN';

// 获取token
export const getAccessToken = () => {
  const accessStore = useAccessStore();
  return accessStore.accessToken;
};

// 刷新token
export const getRefreshToken = () => {
  const accessStore = useAccessStore();
  return accessStore.refreshToken;
};

// 设置token
export const setToken = (token: { accessToken: string; refreshToken: string }) => {
  const accessStore = useAccessStore();
  accessStore.setAccessToken(token.accessToken);
  accessStore.setRefreshToken(token.refreshToken);
};

// 删除token
export const removeToken = () => {
  const accessStore = useAccessStore();
  accessStore.setAccessToken(null);
  accessStore.setRefreshToken(null);
};

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};

// ========== 账号相关 ==========

export type LoginFormType = {
  tenantName: string;
  username: string;
  password: string;
  rememberMe: boolean;
};

const LoginFormKey = 'LOGIN_FORM';

export const getLoginForm = () => {
  const loginFormStr = localStorage.getItem(LoginFormKey);
  if (loginFormStr) {
    const loginForm: LoginFormType = JSON.parse(loginFormStr);
    loginForm.password = decryptData(loginForm.password);
    return loginForm;
  }
  return null;
};

export const setLoginForm = (loginForm: LoginFormType) => {
  const encryptedForm = {
    ...loginForm,
    password: encryptData(loginForm.password),
  };
  localStorage.setItem(LoginFormKey, JSON.stringify(encryptedForm));
};

export const removeLoginForm = () => {
  localStorage.removeItem(LoginFormKey);
};

// ========== 租户相关 ==========

const TenantIdKey = 'TENANT_ID';

export const getTenantId = () => {
  return localStorage.getItem(TenantIdKey);
};

export const setTenantId = (tenantId: string) => {
  localStorage.setItem(TenantIdKey, tenantId);
};
