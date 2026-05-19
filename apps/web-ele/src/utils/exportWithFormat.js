import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

/**
 * 导出数据为Excel或PDF格式
 * @param {Array} data - 要导出的数据数组
 * @param {Array} columns - 列配置数组 [{field: 'id', title: '管控ID'}, ...]
 * @param {String} format - 导出格式 'excel' 或 'pdf'
 * @param {String} fileName - 文件名（不含扩展名）
 * @returns {Promise<String>} 返回下载链接或成功消息
 */
export const exportWithFormat = async (data, columns, format = 'excel', fileName = '导出数据') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('暂无可导出的数据');
    }

    // 过滤掉操作列和checkbox列，只保留数据列
    const dataColumns = columns.filter(col =>
      col.field && col.title && col.type !== 'checkbox' && col.title !== '操作'
    );

    if (format === 'excel') {
      return await exportToExcel(data, dataColumns, fileName);
    } else if (format === 'pdf') {
      return await exportToPDF(data, dataColumns, fileName);
    } else {
      throw new Error('不支持的导出格式');
    }
  } catch (error) {
    console.error('导出失败：', error);
    throw error;
  }
};

/**
 * 导出为Excel格式
 */
const exportToExcel = async (data, columns, fileName) => {
  // 构建表头
  const headers = columns.map(col => col.title);

  // 构建数据行
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.field];

      // 处理格式化函数
      if (col.formatter && typeof col.formatter === 'function') {
        const formatted = col.formatter({ cellValue: value, row: item });
        value = formatted?.cellValue || formatted || value;
      }

      // 处理布尔值
      if (typeof value === 'boolean') {
        value = value ? '是' : '否';
      }

      // 处理null/undefined
      if (value === null || value === undefined) {
        value = '-';
      }

      return value;
    });
  });

  // 合并表头和数据
  const wsData = [headers, ...rows];

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // 设置列宽
  const wscols = columns.map(() => ({ wch: 20 }));
  worksheet['!cols'] = wscols;

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表');

  // 导出文件
  const fullFileName = `${fileName}.xlsx`;
  XLSX.writeFile(workbook, fullFileName);

  return `${fullFileName} 导出成功`;
};

/**
 * 导出为PDF格式
 * 注意：由于jsPDF 4.2.1不支持中文，这里使用ASCII字符替代
 */
const exportToPDF = async (data, columns, fileName) => {
  // 创建PDF文档 (A4横向以容纳更多列)
  const doc = new jsPDF('landscape', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

  // 添加标题（使用ASCII）
  doc.setFontSize(16);
  doc.text('Fake Plate Control Data Export', 15, 15);

  // 构建表头（保留中文，但PDF中会显示为方框或乱码）
  const headers = columns.map((col) => col.title);

  // 构建数据行
  const rows = data.map((item) => {
    return columns.map((col) => {
      let value = item[col.field];

      // 处理格式化函数
      if (col.formatter && typeof col.formatter === 'function') {
        const formatted = col.formatter({ cellValue: value, row: item });
        value = formatted?.cellValue || formatted || value;
      }

      // 处理布尔值
      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }

      // 处理null/undefined
      if (value === null || value === undefined) {
        value = '-';
      }

      // 转换为字符串并限制长度
      const strValue = String(value);
      return strValue.length > 20 ? `${strValue.substring(0, 20)}...` : strValue;
    });
  });

  // 简单的表格绘制
  let startY = 25;
  const margin = 10;
  const usableWidth = pageWidth - 2 * margin;
  const colWidth = usableWidth / columns.length;
  const rowHeight = 6;

  // 绘制表头背景
  doc.setFillColor(66, 139, 202);
  doc.rect(margin, startY, usableWidth, rowHeight, 'F');

  // 绘制表头文字（尝试绘制中文，但可能显示为方框）
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  headers.forEach((header, index) => {
    const x = margin + index * colWidth + 1;
    const y = startY + 4;
    // 只取前8个字符
    const headerText = String(header).substring(0, 8);
    doc.text(headerText, x, y);
  });

  startY += rowHeight;

  // 绘制数据行
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7);

  rows.forEach((row, rowIndex) => {
    // 检查是否需要新页面
    if (startY + rowHeight > pageHeight - margin) {
      doc.addPage();
      startY = margin;
    }

    // 交替行颜色
    if (rowIndex % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, startY, usableWidth, rowHeight, 'F');
    }

    // 绘制单元格内容
    row.forEach((cell, colIndex) => {
      const x = margin + colIndex * colWidth + 1;
      const y = startY + 4;
      const cellText = String(cell).substring(0, 12);
      doc.text(cellText, x, y);
    });

    // 绘制行边框
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, startY, usableWidth, rowHeight, 'S');

    startY += rowHeight;
  });

  // 添加页脚说明
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Note: Chinese characters may not display correctly due to font limitations.',
    margin,
    pageHeight - 10,
  );

  // 保存PDF
  const fullFileName = `${fileName}.pdf`;
  doc.save(fullFileName);

  return `${fullFileName} 导出成功（注意：PDF中文显示可能不正确，建议使用Excel格式）`;
};
