import * as ex from "./couchbase";

let exeMod = new ex.couchbaseConn();

exeMod.exePython("sample.txt",100000,"DMDR","couchbase://localhost:8910");
exeMod.exeQuery("couchbase://localhost:8910","AK00","DMDR");
