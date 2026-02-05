/**
 * 手机号脱敏处理
 * @param {string|number} phone - 手机号
 * @returns {string} - 脱敏后的手机号
 */
export const maskPhone = (phone) => {
  if (!phone) return '';
  const strValue = String(phone);
  return strValue.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 身份证号脱敏处理
 * @param {string|number} idCard - 身份证号
 * @returns {string} - 脱敏后的身份证号
 */
export const maskIdCard = (idCard) => {
  if (!idCard) return '';
  const strValue = String(idCard);
  return strValue.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
};
