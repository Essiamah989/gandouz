const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../docs/liste des prduits.xls');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log("Headers:", data[0]);
console.log("First row:", data[1]);
