'use strict';
exports.__esModule = true;
var couchBase = require('couchbase');
var pythonShell = require('python-shell');
var couchbaseConn = (function () {
    function couchbaseConn() {
    }
    // constructor (conn:String){
    //     this.connectionString=conn
    // }
    // to do query from the given table applying some condition
    couchbaseConn.prototype.exeQuery = function (connectionString, id, table) {
        var cluster = new couchBase.Cluster(connectionString);
        var querys = 'SELECT *  FROM ' + table + ' WHERE STATE_ID__C="' + id + '" LIMIT 20';
        var n1Query = couchBase.N1qlQuery.fromString(querys);
        var bucket = cluster.openBucket(table);
        bucket.query(querys, function (err, res) {
            if (err) {
                console.log('query failed', err);
                return {};
            }
            return res;
        });
    };
    //to execute python file which upload bulk data into couchbase server
    couchbaseConn.prototype.exePython = function (inputFile, noOfRecords, table, connectionString) {
        var cluster = new couchBase.Cluster(connectionString);
        //  var fileP ='bulkupload.py';
        var options = {
            args: [inputFile, noOfRecords, connectionString + '/' + table]
        };
        //   return   pythonShell.run(fileP,options);
        pythonShell.run('bulkupload.py', options, function (err, res) {
            if (err)
                throw err;
            return res;
        });
    };
    return couchbaseConn;
}());
exports.couchbaseConn = couchbaseConn;
//to call method
var c = new couchbaseConn();
c.exePython('input', 10000, "DMDR", "couchbase://localhost:8910");
c.exeQuery("couchbase://localhost:8910", "AK00", "DMDR");
