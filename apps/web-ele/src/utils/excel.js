// 完整引入SheetJS（xlsx）
import * as XLSX from 'xlsx';

export const exportToExcel = (
  data,
  sheetName = '数据列表',
  fileName = '导出数据.xlsx',
) => {
  try {
    let wsData = [];

    // 处理单条数据（对象）
    if (typeof data === 'object' && !Array.isArray(data)) {
      wsData = [
        Object.keys(data), // 表头
        Object.values(data), // 数据行
      ];
    }
    // 处理多条数据（数组）
    else if (Array.isArray(data) && data.length > 0) {
      wsData = [
        Object.keys(data[0]), // 表头（取第一条数据的键）
        ...data.map((item) => Object.values(item)), // 所有数据行
      ];
    }
    // 空数据处理
    else {
      alert('暂无可导出的数据！');
      return;
    }

    // 1. 创建工作表（Array of Arrays 转 Sheet）
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // 可选：调整列宽（优化展示效果）
    const wscols = Object.keys(wsData[0]).map(() => ({ wch: 20 })); // 每列宽度20
    worksheet['!cols'] = wscols;

    // 2. 创建工作簿并添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 3. 导出并下载文件（SheetJS核心API）
    XLSX.writeFile(workbook, fileName);

    alert(`✅ ${fileName} 导出成功！`);
  } catch (error) {
    console.error('Excel导出失败：', error);
    alert('❌ 文件导出失败，请检查数据格式或查看控制台日志！');
  }
};
