import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Hàm xuất dữ liệu thành file Excel và tải xuống tự động.
 * @param {Array} headers - Mảng tiêu đề các cột, ví dụ: ["Mã sinh viên", "Họ tên", "Ngày sinh", ...]
 * @param {Array} data - Mảng dữ liệu, mỗi phần tử là mảng con chứa dữ liệu của một dòng.
 * @param {string} fileName - Tên file xuất, mặc định là "export.xlsx"
 */
export default function exportToExcel(headers, data, fileName = "export.xlsx") {
    console.log(headers);
    console.log(data);
  // Kết hợp tiêu đề và dữ liệu thành 1 mảng 2 chiều (AOA)
  const worksheetData = [headers, ...data];

  // Tạo worksheet từ mảng 2 chiều
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Tạo workbook mới và append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất workbook thành dạng buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Tạo Blob từ buffer
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Tải file xuống tự động
  saveAs(dataBlob, fileName);
}
