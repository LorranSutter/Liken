#!/bin/bash

unsetEnvVars() {
    echo ""
    echo ""
    echo "==================== START - Unset environment variables ==================== "

    PATH=$(getconf PATH)
    echo "Reset PATH"

    unset CORE_PEER_LOCALMSPID
    echo "Unset CORE_PEER_LOCALMSPID"

    unset FABRIC_CFG_PATH
    echo "Unset FABRIC_CFG_PATH"

    unset CORE_PEER_TLS_ENABLED
    echo "Unset CORE_PEER_TLS_ENABLED"

    unset CORE_PEER_TLS_ROOTCERT_FILE
    echo "Unset CORE_PEER_TLS_ROOTCERT_FILE"

    unset CORE_PEER_MSPCONFIGPATH
    echo "Unset CORE_PEER_MSPCONFIGPATH"

    unset CORE_PEER_ADDRESS
    echo "Unset CORE_PEER_ADDRESS"

    unset CC_PACKAGE_ID
    echo "Unset CC_PACKAGE_ID"

    echo "====================  END - Unset environment variables  ==================== "
    echo ""
    echo ""
}

setGlobalVars() {
    echo ""
    echo ""
    echo "==================== START - Set global environment variables ==================== "

    export PATH=${PWD}/../bin:$PATH
    echo "Set PATH as $PATH"

    export FABRIC_CFG_PATH=$PWD/../config/
    echo "Set FABRIC_CFG_PATH as $FABRIC_CFG_PATH"

    export CORE_PEER_TLS_ENABLED=true
    echo "Set CORE_PEER_TLS_ENABLED as $CORE_PEER_TLS_ENABLED"

    export TESTCHAIN_VERSION=$1
    echo "Set TESTCHAIN_VERSION as $TESTCHAIN_VERSION"

    echo "====================  END - Set global environment variables  ==================== "
    echo ""
    echo ""
}

envForOrg1() {
    echo ""
    echo ""
    echo "==================== START - Changing env variables to serve as org1 ===================="

    export CORE_PEER_LOCALMSPID="Org1MSP"
    echo "Set CORE_PEER_LOCALMSPID as $CORE_PEER_LOCALMSPID"

    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    echo "Set CORE_PEER_TLS_ROOTCERT_FILE as $CORE_PEER_TLS_ROOTCERT_FILE"

    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    echo "Set CORE_PEER_MSPCONFIGPATH as $CORE_PEER_MSPCONFIGPATH"

    export CORE_PEER_ADDRESS=localhost:7051
    echo "Set CORE_PEER_ADDRESS as $CORE_PEER_ADDRESS"

    echo "==================== END - Changing env variables to serve as org1 ===================="
    echo ""
    echo ""
}

envForOrg2() {

    echo ""
    echo ""
    echo "==================== START - Changing env variables to serve as org2 ===================="

    export CORE_PEER_LOCALMSPID="Org2MSP"
    echo "Set CORE_PEER_LOCALMSPID as $CORE_PEER_LOCALMSPID"

    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    echo "Set CORE_PEER_TLS_ROOTCERT_FILE as $CORE_PEER_TLS_ROOTCERT_FILE"

    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    echo "Set CORE_PEER_MSPCONFIGPATH as $CORE_PEER_MSPCONFIGPATH"

    export CORE_PEER_ADDRESS=localhost:9051
    echo "Set CORE_PEER_ADDRESS as $CORE_PEER_ADDRESS"

    echo "==================== END - Changing env variables to serve as org2 ===================="
    echo ""
    echo ""
}

package() {
    echo ""
    echo ""
    echo "==================== START - Packaging Testchain ==================== "

    peer lifecycle chaincode package testchain.tar.gz \
        --path ../chaincode/testchain/javascript/ \
        --lang node \
        --label testchain_${TESTCHAIN_VERSION}

    echo "====================  END - Packaging Testchain  ==================== "
    echo ""
    echo ""
}

installChaincode() {
    echo ""
    echo ""
    echo "==================== START - Installing chaincode on a node for $CORE_PEER_LOCALMSPID ==================== "

    peer lifecycle chaincode install testchain.tar.gz

    echo "==================== END - Installing chaincode on a node for $CORE_PEER_LOCALMSPID ==================== "
    echo ""
    echo ""
}

approve() {
    echo ""
    echo ""
    echo "==================== START - Approving in $CORE_PEER_LOCALMSPID peer ==================== "

    peer lifecycle chaincode approveformyorg \
        -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --channelID mychannel \
        --name testchain \
        --version ${TESTCHAIN_VERSION}.0 \
        --package-id $CC_PACKAGE_ID \
        --sequence ${TESTCHAIN_VERSION} --tls \
        --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

    echo "====================  END - Approving in $CORE_PEER_LOCALMSPID peer  ==================== "
    echo ""
    echo ""
}

checkCommitReadiness() {
    echo ""
    echo ""
    echo "==================== START - Checking commit readiness ==================== "

    peer lifecycle chaincode checkcommitreadiness \
        --channelID mychannel \
        --name testchain \
        --version ${TESTCHAIN_VERSION}.0 \
        --sequence ${TESTCHAIN_VERSION} \
        --tls \
        --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
        --output json

    echo "====================  END - Checking commit readiness  ==================== "
    echo ""
    echo ""
}

commit() {
    echo ""
    echo ""
    echo "==================== START - Commiting the contract to peers ==================== "

    peer lifecycle chaincode commit \
        -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --channelID mychannel \
        --name testchain \
        --version ${TESTCHAIN_VERSION}.0 \
        --sequence ${TESTCHAIN_VERSION} \
        --tls \
        --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
        --peerAddresses localhost:9051 \
        --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

    echo "====================  END - Commiting the contract to peers  ==================== "
    echo ""
    echo ""
}

queryCommitted() {
    echo ""
    echo ""
    echo "==================== START - Querying committed ==================== "

    peer lifecycle chaincode querycommitted \
        --channelID mychannel \
        --name testchain \
        --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

    echo "====================  END - Querying committed  ==================== "
    echo ""
    echo ""
}

invoke() {
    echo ""
    echo ""
    echo "==================== START - Invoking ==================== "

    peer chaincode invoke \
        -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls \
        --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
        -C mychannel \
        -n testchain \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
        --peerAddresses localhost:9051 \
        --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
        -c '{"function":"initLedger","Args":[]}'

    echo "====================  END - Invoking  ==================== "
    echo ""
    echo ""
}

printHelp() {
    echo "How to use"
    echo "1 - Call with -init flag and the version number as argument"
    echo "    At the end it will output the package id"
    echo "2 - Call with -invoke flag with package id as argument (only hash)"
}

initMethods() {
    echo ""
    echo ""
    echo "==================== START - Init Test Chain Network ==================== "

    unsetEnvVars
    setGlobalVars $1

    envForOrg1
    package
    installChaincode
    envForOrg2
    installChaincode

    peer lifecycle chaincode queryinstalled -O json

    echo "====================  END - Init Test Chain Network  ==================== "
    echo ""
    echo ""
}

invokeMethods() {
    echo ""
    echo ""
    echo "==================== START - Invoke Test Chain Network ==================== "

    export CC_PACKAGE_ID=testchain_${TESTCHAIN_VERSION}:$1

    envForOrg1
    approve
    envForOrg2
    approve

    checkCommitReadiness
    commit
    queryCommitted
    invoke

    echo "====================  END - Invoke Test Chain Network  ==================== "
    echo ""
    echo ""
}

# ./network.sh up -ca -s couchdb
# ./network.sh createChannel -c mychannel

# After invoke
# peer chaincode query -C mychannel -n testchain -c '{"Args":["helloWorld"]}'

# To update the test chain just pass a new version as argument to this script

while test $# -gt 0; do
    case "$1" in
    -h | --help)
        printHelp
        shift
        ;;
    -init)
        initMethods $2
        shift
        ;;
    -invoke)
        invokeMethods $2
        shift
        ;;
    esac
    shift
done
