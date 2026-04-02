/**
 * 字典颜色类型映射工具
 * 用于将后端字典配置的颜色类型映射到 Element Plus Tag 组件支持的颜色类型
 *
 * 后端字典配置的颜色类型（来自 system/dict/data.ts 中的 colorOptions）：
 * - 基础类型：processing(主要)、success(成功)、default(默认)、warning(警告)、error(危险)
 * - 扩展类型：pink、red、orange、green、cyan、blue、purple
 *
 * Element Plus Tag 支持的颜色类型：
 * - danger、info、primary、success、warning
 */

/** 颜色类型映射表 - 后端颜色类型 -> Element Plus Tag 类型 */
const COLOR_TYPE_MAP = {
  // 基础映射
  danger: 'danger',
  error: 'danger',
  info: 'info',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  default: 'info',
  processing: 'primary',

  // 扩展颜色映射
  blue: 'primary',
  green: 'success',
  orange: 'warning',
  cyan: 'info',
  purple: 'primary',
  pink: 'danger',
  red: 'danger',
  yellow: 'warning',
};

/** Element Plus Tag 支持的有效颜色类型 */
const VALID_TAG_TYPES = ['danger', 'info', 'primary', 'success', 'warning'];

/**
 * 将后端字典颜色类型映射为 Element Plus Tag 支持的颜色类型
 * @param {string} colorType - 后端字典配置的颜色类型
 * @param {string} defaultType - 默认颜色类型（当映射失败时使用）
 * @returns {string} Element Plus Tag 支持的颜色类型
 *
 * @example
 * // 后端配置为 'cyan' -> 返回 'info'
 * getDictTagType('cyan') // 'info'
 *
 * // 后端配置为 'red' -> 返回 'danger'
 * getDictTagType('red') // 'danger'
 *
 * // 后端配置为 'success' -> 返回 'success'
 * getDictTagType('success') // 'success'
 */
export function getDictTagType(colorType, defaultType = 'primary') {
  if (!colorType) {
    return defaultType;
  }

  const normalizedType = String(colorType).toLowerCase().trim();

  // 如果在映射表中，使用映射后的值
  if (COLOR_TYPE_MAP[normalizedType]) {
    return COLOR_TYPE_MAP[normalizedType];
  }

  // 如果本身就是有效的 Tag 类型，直接返回
  if (VALID_TAG_TYPES.includes(normalizedType)) {
    return normalizedType;
  }

  // 默认返回 primary
  return defaultType;
}

/**
 * 根据字典对象获取 Tag 颜色类型
 * @param {object} dict - 字典对象，包含 colorType 属性
 * @param {string} defaultType - 默认颜色类型
 * @returns {string} Element Plus Tag 支持的颜色类型
 *
 * @example
 * const dict = { label: '未核实', value: '0', colorType: 'cyan' };
 * getDictTagTypeFromDict(dict) // 'info'
 */
export function getDictTagTypeFromDict(dict, defaultType = 'primary') {
  if (!dict || typeof dict !== 'object') {
    return defaultType;
  }
  return getDictTagType(dict.colorType, defaultType);
}

/**
 * 批量获取多个字典项的颜色类型（用于表格或列表）
 * @param {Array} dictList - 字典列表
 * @param {string} defaultType - 默认颜色类型
 * @returns {Array} 包含颜色类型的字典列表
 */
export function batchGetDictTagTypes(dictList, defaultType = 'primary') {
  if (!Array.isArray(dictList)) {
    return [];
  }

  return dictList.map((dict) => ({
    ...dict,
    tagType: getDictTagTypeFromDict(dict, defaultType),
  }));
}

/**
 * 获取颜色类型映射配置（用于需要显示颜色选项的场景）
 * @returns {object} 颜色类型映射配置
 */
export function getColorTypeMap() {
  return { ...COLOR_TYPE_MAP };
}

/**
 * 获取 Element Plus Tag 支持的有效颜色类型列表
 * @returns {Array} 有效颜色类型数组
 */
export function getValidTagTypes() {
  return [...VALID_TAG_TYPES];
}

/**
 * 检查颜色类型是否有效
 * @param {string} colorType - 颜色类型
 * @returns {boolean} 是否有效
 */
export function isValidTagType(colorType) {
  if (!colorType) return false;
  const normalizedType = String(colorType).toLowerCase().trim();
  return (
    VALID_TAG_TYPES.includes(normalizedType) || !!COLOR_TYPE_MAP[normalizedType]
  );
}

/**
 * 获取字典 Tag 显示配置（包含标签文本和颜色类型）
 * @param {object} dict - 字典对象
 * @param {string} defaultType - 默认颜色类型
 * @returns {object} { label: string, type: string }
 */
export function getDictTagConfig(dict, defaultType = 'primary') {
  if (!dict || typeof dict !== 'object') {
    return { label: '', type: defaultType };
  }

  return {
    label: dict.label || '',
    type: getDictTagType(dict.colorType, defaultType),
  };
}

export default {
  getDictTagType,
  getDictTagTypeFromDict,
  batchGetDictTagTypes,
  getColorTypeMap,
  getValidTagTypes,
  isValidTagType,
  getDictTagConfig,
};
