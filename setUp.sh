#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e
# clean out any old identites in the wallets
rm -rf api/wallet/*

# launch network; create channel and join peer to channel
pushd ./test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn Liken -ccp ../chaincode/javascript/ -ccl javascript -ccv 1 -cci initLedger
popd

pushd ./api/utils
node enrollAdmin.js 1 admin1
node enrollAdmin.js 2 admin2
node registerUser.js 1 admin1 microsoft
node registerUser.js 2 admin2 apple
# node invoke.js 2 apple
# node invoke.js 1 microsoft
# node query.js 1 microsoft
# node query.js 2 apple
node populate.js
popd