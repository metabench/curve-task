const assert = require('assert');

const {injest, close, count_contracts, count_tracks} = require('../index');

/*
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

it('should be asynchronous', function(done) {
    setTimeout(function() {
        done();
    }, 500);
});
*/

let num_tests_running = 0;
const complete = () => {
    
    close();
}

it('should only provide event objects on next', function(done) {
    num_tests_running++;
    const obs_injest = injest();
    

    obs_injest.on('next', data => {
        const {type, name} = data;
        //console.log('name', name);
        assert.equal(type, 'event');
    });
    obs_injest.on('complete', () => {
        num_tests_running--;
        done();
        setTimeout(() => {if (num_tests_running === 0) complete();}, 0);
        
    })

    
});



it('should save a contract', function(done) {
    num_tests_running++;
    const obs_injest = injest();
    let had_save_contract = false;

    obs_injest.on('next', data => {
        const {type, name} = data;
        if (name === 'save_contract') {
            had_save_contract = true;
        }
    });
    obs_injest.on('complete', () => {
        assert.equal(had_save_contract, true);
        num_tests_running--;
        done();
        setTimeout(() => {if (num_tests_running === 0) complete();}, 0);
    });

    
});

it('should save a track', function(done) {
    num_tests_running++;
    const obs_injest = injest();
    let had_save_track = false;

    obs_injest.on('next', data => {
        const {type, name} = data;
        if (name === 'save_track') {
            had_save_track = true;
        }
    });
    obs_injest.on('complete', () => {
        assert.equal(had_save_track, true);
        num_tests_running--;
        done();
        setTimeout(() => {if (num_tests_running === 0) complete();}, 0);
    });

    
});


it('should have an error event', function(done) {
    num_tests_running++;
    const obs_injest = injest();
    let had_error = false;

    obs_injest.on('next', data => {
        const {type, name} = data;
        if (name === 'error') {
            had_error = true;
        }
    });
    obs_injest.on('complete', () => {
        assert.equal(had_error, true);
        num_tests_running--;
        done();
        setTimeout(() => {if (num_tests_running === 0) complete();}, 0);
    });

    
});