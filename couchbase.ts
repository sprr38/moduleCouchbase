'use strict'

/**
 * This module is used for bulkupload of Json data into couchBase server.
 * and can be used in query from the couchbase server.
 * There are a Python code dependency to run this module that needs "Bucket" and "CouchbaseTransientError" package
 * which takes arguement as a json file, Number of records for inserting and connection string(couchbase://127.0.0.1:8091)
 * 
 */

declare function require(name:string);

const couchBase = require('couchbase');
const pythonShell = require('python-shell');

export class couchbaseConn{

connectionString:String;

// constructor (conn:String){
//     this.connectionString=conn
// }

// to do query from the given table applying some condition
  exeQuery(connectionString:String,id:String,table:String){

    var cluster = new couchBase.Cluster(connectionString);
    var  querys:any='SELECT *  FROM ' + table + ' WHERE STATE_ID__C="' + id +'" LIMIT 20';
    var n1Query:String = couchBase.N1qlQuery.fromString(querys);
    var bucket = cluster.openBucket(table);
    bucket.query(querys, function(err, res) {
            if (err) {
                console.log('query failed', err);
                return {};
            }
            return res;
        });
    
  }
//to execute python file which upload bulk data into couchbase server

  exePython(inputFile:any, noOfRecords:number, table:any,connectionString:any)
  {
      var cluster = new couchBase.Cluster(connectionString);
    //  var fileP ='bulkupload.py';
        var options:any = {
            args:[inputFile,noOfRecords, connectionString + '/' + table]
        };
  //   return   pythonShell.run(fileP,options);
     pythonShell.run('bulkupload.py',options, function (err,res) {
            if (err) throw err;

            return res;
        });
  }

}


        
  


   

        
        
        

