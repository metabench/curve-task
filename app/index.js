const {injest, close, save_track, save_contract, wipe, count_contracts, count_tracks} = require('./injest');

module.exports = {injest, close};

if (require.main === module) {
    (async() => {
        const obs_injest = injest();
        const errors = [];
        obs_injest.on('next', data => {
            console.log('data', data);
            const {type, name, value, line} = data;
            if (type === 'event') {

                if (name === 'error') {
                    errors.push([value, line]);
                }

            }
        });

        obs_injest.on('complete', async() => {
            console.log('errors', errors);

            console.log('count_contracts', await count_contracts());
            console.log('count_tracks', await count_tracks());



            close();
        });
    })();
}



