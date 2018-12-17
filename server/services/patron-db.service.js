var Datastore = require('nedb');  
var patrons = new Datastore({ filename: 'patrons.db', autoload: true });

function deletePatron(_id, callback){
    patrons.remove({_id}, callback);
}

function mergePatron(patron, callback){
    patron._id
        ? patrons.update({_id: patron._id}, { $set: patron}, {}, callback)
        : patrons.insert({...patron, dateOfCreation: new Date(), visits: []}, callback);        
}

function getAllPatrons(callback) {
    callback(patrons.getAllData());
}

function addVisitToPatron(patron, signature, callback){
    patron.visits = [...patron.visits, signature];
    mergePatron(patron, callback);
}

module.exports = {
    deletePatron, mergePatron, getAllPatrons, addVisitToPatron
};