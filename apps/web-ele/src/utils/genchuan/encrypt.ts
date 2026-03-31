/**
 * 简单的加密工具函数
 * 使用 Base64 + 字符位移混淆，避免明文显示密码
 * 注意：这只是前端混淆，不是真正的安全加密
 */

const SHIFT_KEY = 3;

/**
 * 混淆字符串（简单的字符位移）
 */
function obfuscate(str: string): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) + SHIFT_KEY))
    .join('');
}

/**
 * 还原混淆的字符串
 */
function deobfuscate(str: string): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) - SHIFT_KEY))
    .join('');
}

/**
 * 加密数据（Base64 + 混淆）
 */
export function encryptData(data: string): string {
  const obfuscated = obfuscate(data);
  return btoa(obfuscated);
}

/**
 * 解密数据
 */
export function decryptData(encryptedData: string): string {
  try {
    const obfuscated = atob(encryptedData);
    return deobfuscate(obfuscated);
  } catch {
    return '';
  }
}

/**
 * 获取加密后的 ThingsBoard 凭据
 * 返回加密后的用户名和密码
 */
export function getEncryptedThingsBoardCredentials(): {
  password: string;
  username: string;
} {
  const username = import.meta.env.VITE_THINGS_BOARD_NAME || '';
  const password = import.meta.env.VITE_THINGS_BOARD_PASSWORD || '';

  return {
    username: encryptData(username),
    password: encryptData(password),
  };
}

/**
 * 解密 ThingsBoard 凭据
 */
export function decryptThingsBoardCredentials(credentials: {
  password: string;
  username: string;
}): {
  password: string;
  username: string;
} {
  return {
    username: decryptData(credentials.username),
    password: decryptData(credentials.password),
  };
}
