const mongoose = require('mongoose');


/*

Field	Type	Required
-----   ----    --------
Title	String	TRUE
Version	String	
Artist	String	
ISRC	String	TRUE
P Line	String	
Aliases	Array	
Contract ID	Reference to Contract ID	

*/

const schema_track = new mongoose.Schema({ Title: {type: String, required: true}, 
    Version: String, Artist: String, ISRC: {type: String, required: true}, 
    P_Line: String, Aliases: Array, Contract: {type: mongoose.Schema.Types.ObjectId, ref: 'Contract'}});

const Track = mongoose.model('Track', schema_track);

const schema_contract = new mongoose.Schema({Name: {type: String, required: true}});
const Contract = mongoose.model('Contract', schema_contract);

//console.log('Track', Track);

//mongoose.connect('mongodb://localhost:27017/curvedb');

const conn = mongoose.connect('mongodb://localhost:27017/curvedb');
//console.log('post connect');

const save_track = async o_track => {

    if (o_track.Contract) {
        //console.log('o_track.Contract', o_track.Contract);
        const exists = await find_contract_by_name(o_track.Contract);
        //console.log('exists', exists);
        //throw 'stop';
        if (!exists) {
            throw 'Contract Not Found: ' + o_track.Contract
        }
        o_track.Contract = exists;
    }

    const mongo_track = new Track(o_track);
    // Does the contract exist?
    const res_save_track = await mongo_track.save();
    return res_save_track;
}

const find_contract_by_name = contract_name => Contract.exists({ Name: contract_name })

const save_contract = o_contract => {
    const mongo_contract = new Contract(o_contract);
    const res_save_contract = mongo_contract.save();
    return res_save_contract;
}

const wipe = async () => {
    await Track.deleteMany();
    await Contract.deleteMany();
    return true;
}

const close = () => mongoose.connection.close();

const count_contracts = () => Contract.countDocuments();
const count_tracks = () => Track.countDocuments();


module.exports = {
    save_track, save_contract, wipe, close, count_contracts, count_tracks
}

if (require.main === module) {

    (async() => {

        try {
            
            //console.log('conn', conn);

            console.log('Object.keys(Track)', Object.keys(Track));


            // Could create a new test / example track.

            const trackCount = await Track.count();
            console.log('trackCount', trackCount);

            await Track.deleteMany();

            /*
            Track.count({}, function( err, count){
                console.log( "Number of tracks:", count );
            });
            */

            const save_example_track = async() => {
                const egTrack = new Track({
                    Title: 'Eg Song',
                    Version: '0.0.11',
                    Artist: 'James V',
                    ISRC: '0000',
                    P_Line: '10',
                    Aliases: []
                })
        
                const res_save_track = await egTrack.save();
                console.log('track saved');
                console.log('res_save_track', res_save_track);
            }

            

            

            console.log('trackCount', await Track.count());

        } catch (error) {
            //handleError(error);
            console.log('error', error);


        }
    })();

}


/*
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.eyhty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

mongoose.connect('mongodb://localhost:27017/curvedb')
*/