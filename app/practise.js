var XLSX = require("xlsx");

console.log('Object.keys(XLSX)', Object.keys(XLSX))

const res_rf = XLSX.readFile('../assigned/Track Import Test.xlsx');

console.log('res_rf', res_rf);

console.log('Object.keys(res_rf)', Object.keys(res_rf));

console.log('res_rf.Sheets', res_rf.Sheets);

console.log('Object.keys(res_rf.Sheets).length', Object.keys(res_rf.Sheets).length);

// Just Sheet1

const sheet1 = res_rf.Sheets.Sheet1;

console.log('sheet1', sheet1);

console.log('sheet1["!ref"]', sheet1["!ref"]);

const [firstCell, lastCell] = sheet1["!ref"].split(':');
console.log('[firstCell, lastCell]', [firstCell, lastCell]);

console.log('Object.keys(sheet1)', Object.keys(sheet1));

const cellNames = Object.keys(sheet1).filter(x => !x.startsWith('!'));
console.log('cellNames', cellNames);

const cells = [];

for (const cellName of cellNames) {
    const cell = sheet1[cellName];
    cell.name = cellName;

    if (cell.name.length > 2) {
        throw 'NYI';
    } else {
        const column = cellName.charAt(0);
        const row = cellName.charAt(1);

        console.log('column.charCodeAt(0)', column.charCodeAt(0));
        const i_column = column.charCodeAt(0) - 65;
        const i_row = parseInt(row);
        cell.position = [i_column, i_row];

        cells.push(cell);
    }

    
}

console.log('cells', cells);


