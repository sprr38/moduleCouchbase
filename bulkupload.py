# This code is used to upload bulk record in couchbase server.
# For uploading, need a json file which contains the records.

#!/usr/bin/env python

# Need couchbase and CouchbaseTransientError package
import sys
from couchbase.bucket import Bucket
from couchbase.exceptions import CouchbaseTransientError
import json
import time

# These are four arguements as a Json file , No. of records for inserting and 
# connectionString to connect with couchbase server.

jsonfile=sys.argv[1]
noOfrecords=int(sys.argv[2])
connectionString=sys.argv[3]

cb = Bucket(connectionString)

BYTES_PER_BATCH = 1024 * 256  # 256K

start=time.time()

# Generate our data:
with open(jsonfile) as json_file:
  data = json.load(json_file)
all_data = {}
for x in xrange(noOfrecords):
    key = "unit__" + str(x)
    value = data[x]
    all_data[key] = value


batches = []
cur_batch = {}
cur_size = 0
batches.append(cur_batch)

for key, value in all_data.items():
    cur_batch[key] = value
    cur_size += len(key) + len(value) + 24
    if cur_size > BYTES_PER_BATCH:
        cur_batch = {}
        batches.append(cur_batch)
        cur_size = 0
# Total number of records are divided into several batches on the basis of BYTES_PER_BATCH = 1024 * 256 (256 KB)
print "Have {} batches".format(len(batches))
num_completed = 0
while batches:
    batch = batches[-1]
    try:
        cb.upsert_multi(batch)
        num_completed += len(batch)
        batches.pop()
    except CouchbaseTransientError as e:
        print e
