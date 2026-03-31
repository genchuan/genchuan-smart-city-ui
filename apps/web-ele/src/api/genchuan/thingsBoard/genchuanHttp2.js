import axios from 'axios';

// process.env.NODE_ENV === "development" ? '/api' : `${window.location.origin}/api`
const baseURL =
  import.meta.env.VITE_USER_NODE_ENV === 'development'
    ? '/thingsBoard-api'
    : `${import.meta.env.VITE_THINGS_BOARD_URL}`;
const http = axios.create({
  // 设置超时时间
  timeout: 30_000,
  // baseURL: '/thingsBoard-api'
  baseURL,
});

// 简单的混淆函数（避免明文显示）
const SHIFT_KEY = 3;

function obfuscate(str) {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) + SHIFT_KEY))
    .join('');
}

function deobfuscate(str) {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) - SHIFT_KEY))
    .join('');
}

function encryptData(data) {
  return btoa(obfuscate(data));
}

function decryptData(encryptedData) {
  try {
    return deobfuscate(atob(encryptedData));
  } catch {
    return '';
  }
}

function getEncryptedThingsBoardCredentials() {
  const username = import.meta.env.VITE_THINGS_BOARD_NAME || '';
  const password = import.meta.env.VITE_THINGS_BOARD_PASSWORD || '';

  return {
    username: encryptData(username),
    password: encryptData(password),
  };
}

function decryptThingsBoardCredentials(credentials) {
  return {
    username: decryptData(credentials.username),
    password: decryptData(credentials.password),
  };
}

// 添加请求拦截器  解决刷新token 和芋道配合没有token的时候，拦截器中自动登录
http.interceptors.request.use(
  async (config) => {
    if (window.localStorage.getItem('thingsBoardJwt_token')) {
      const timestamp = Date.now();
      const jwt_time = window.localStorage.getItem('thingsBoardJwt_time');
      if (timestamp - jwt_time > 72_000) {
        await refreshToken();
        config.headers.Authorization = `Bearer ${window.localStorage.getItem('thingsBoardJwt_token')}`;
      } else {
        config.headers.Authorization = `Bearer ${window.localStorage.getItem('thingsBoardJwt_token')}`;
      }
    } else {
      await loginToken();
      config.headers.Authorization = `Bearer ${window.localStorage.getItem('thingsBoardJwt_token')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// thingBoard 刷新token
const refreshToken = async () => {
  await axios
    .post(`${baseURL}/api/auth/token`, {
      refreshToken: window.localStorage.getItem('thingsBoardRefresh_token'),
    })
    .then((thingsBoardRes) => {
      window.localStorage.setItem(
        'thingsBoardJwt_token',
        thingsBoardRes.data.token,
      );
      window.localStorage.setItem(
        'thingsBoardRefresh_token',
        thingsBoardRes.data.refreshToken,
      );
      window.localStorage.setItem('thingsBoardJwt_time', Date.now().toString());
    })
    .catch(async (error) => {
      await loginToken();
      console.error('thingBoard刷新token失败:', error);
    });
};

// thingBoard 登录（使用加密凭据，避免明文传输）
const loginToken = async () => {
  const encryptedCreds = getEncryptedThingsBoardCredentials();
  const decryptedCreds = decryptThingsBoardCredentials(encryptedCreds);

  await axios
    .post(`${baseURL}/api/auth/login`, {
      username: decryptedCreds.username,
      password: decryptedCreds.password,
    })
    .then((thingsBoardRes) => {
      window.localStorage.setItem(
        'thingsBoardJwt_token',
        thingsBoardRes.data.token,
      );
      window.localStorage.setItem(
        'thingsBoardRefresh_token',
        thingsBoardRes.data.refreshToken,
      );
      window.localStorage.setItem('thingsBoardJwt_time', Date.now().toString());
    })
    .catch((error) => {
      console.log('thingBoard登录失败');
      console.error('Error:', error);
    });
};

http.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
