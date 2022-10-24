const {injest, close} = require('./injest');

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

        obs_injest.on('complete', () => {
            console.log('errors', errors);
            close();
        });
    })();
}



