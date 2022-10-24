const XLSX = require("xlsx");
const {obs} = require('fnl');

const read_sheet = () => obs((next, complete, error) => {
    const res_rf = XLSX.readFile('../assigned/Track Import Test.xlsx');

    // Just Sheet1

    const sheet1 = res_rf.Sheets.Sheet1;
    const [firstCell, lastCell] = sheet1["!ref"].split(':');

    const cellNames = Object.keys(sheet1).filter(x => !x.startsWith('!'));
    //console.log('cellNames', cellNames);

    const cells = [];
    let row = [], last_i_row = 0; 

    // But the unnamed cells...? Or cells with nothing in them...?

    for (const cellName of cellNames) {
        const cell = sheet1[cellName];
        cell.name = cellName;

        if (cell.name.length > 2) {
            throw 'NYI';
        } else {
            const s_column = cellName.charAt(0);
            const s_row = cellName.charAt(1);

            //console.log('column.charCodeAt(0)', s_column.charCodeAt(0));
            const i_column = s_column.charCodeAt(0) - 65;
            const i_row = parseInt(s_row) - 1;
            cell.position = [i_column, i_row];

            //console.log('cell', cell);

            cells.push(cell);
            //console.log('i_row', i_row);
            //console.log('last_i_row', last_i_row);
            if (i_row !== last_i_row) {
                next({'row': row});
                row = [cell];
            } else {
                row.push(cell);
            }
            last_i_row = i_row;
        }
    }
    next({'row': row});
    //complete({cells: cells});
    complete();
});
module.exports = read_sheet;

const practise = async() => {
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
            const i_row = parseInt(row) -1;
            cell.position = [i_column, i_row];

            cells.push(cell);
        }

        
    }

    //console.log('cells', cells);



}

