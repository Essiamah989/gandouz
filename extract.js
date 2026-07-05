const xlsx = require('xlsx');
const wb = xlsx.readFile('../docs/liste des prduits.xls');
const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
console.log(JSON.stringify(data, null, 2));
