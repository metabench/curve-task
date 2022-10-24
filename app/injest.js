const read_sheet = require('./read_sheet');
const {each} = require('lang-mini');
const {obs} = require('fnl');

const {save_track, save_contract, wipe, close, count_contracts, count_tracks} = require('./db');

//const injest = async() => {
const injest = () => obs((next, complete, error) => {

    (async() => {
        let read_complete = false;
        await wipe();
        next({
            type: 'event',
            'name': 'wipe'
        });
        const res_save_contract = await save_contract({Name: 'Contract 1'});
        next({
            type: 'event',
            'name': 'save_contract',
            'value': res_save_contract
        });
        const obs_read_sheet = read_sheet();
        let i_row = 0;
        let rows_processing = 0;
        //const errors = [];

        obs_read_sheet.on('next', async data => {
            //console.log('data', data);

            // then can use some specific lines of data.
            const {row} = data;

            if (row) {
                //console.log('row', row);

                const o_row = {};
                each(row, cell => {
                    //console.log('cell', cell);
                    o_row[cell.position[0]] = cell;
                })
                //console.log('o_row', o_row);

                //const [i_column, i_row] = row.position;

                if (i_row >= 2) {
                    // Information can be contained in these rows.
                    rows_processing++;

                    // depending on the column, it will have different fields.

                    const Cell_ID = o_row[0] || {};
                    const Cell_Title = o_row[1] || {};
                    const Cell_Version = o_row[2] || {};
                    const Cell_Artist = o_row[3] || {};
                    const Cell_ISRC = o_row[4] || {};
                    const Cell_P_Line = o_row[5] || {};
                    const Cell_Aliases = o_row[6] || {};
                    const Cell_Contract = o_row[7] || {};

                    const id = Cell_ID.v;
                    const title = Cell_Title.v;
                    const version = Cell_Version.v;
                    const artist = Cell_Artist.v;
                    const isrc = Cell_ISRC.v;
                    const p_line = Cell_P_Line.v;
                    const contract = Cell_Contract.v;

                    const aliases = (() => {
                        if (Cell_Aliases.v.length > 0) {
                            return Cell_Aliases.v.split(' ;').join(';').split('; ').join(';').split(';');
                        } else {
                            return [];
                        }
                        

                    })();

                    //console.log('aliases', aliases);

                    const o_track = {
                        Title: title,
                        Version: version,
                        Artist: artist,
                        ISRC: isrc,
                        P_Line: p_line,
                        Aliases: aliases,
                        Contract: contract
                    }

                    // Then do db.save_track
                    //console.log('o_track', o_track);

                    try {
                        const res_save_track = await save_track(o_track);

                        next({
                            type: 'event',
                            'name': 'save_track',
                            'value': res_save_track
                        });
                        //console.log('res_save_track', res_save_track);
                    } catch (err) {
                        //console.log('err', err);
                        //errors.push([err, i_row + 1]);
                        next({
                            type: 'event',
                            'name': 'error',
                            'value': err,
                            'line': i_row + 1
                        });
                    }
                    rows_processing--;
                    if (rows_processing === 0) {
                        complete();
                    }

                    //if (read_complete) {
                    //    complete();
                    //}
                }
                i_row++;
            } else {
                throw 'Expected row data';
            }
        });

        // Really need to wait for all of the save events to be complete.
        obs_read_sheet.on('complete', () => {
            read_complete = true;

            // then when are all the rows complete?


            // May still be waiting for a save. Should do this a better way that waits until the save is complete rather than 100ms.
            //setTimeout(() => {
                //console.log('errors', errors);

                //mongoose.connection.close();
                //close();
            //    complete();
            //}, 100);
            
        })
    })();

});

module.exports = {injest, close, save_track, save_contract, wipe, count_contracts, count_tracks};