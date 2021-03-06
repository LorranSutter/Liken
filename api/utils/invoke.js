const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const orgNumber = process.argv[2];
const userName = process.argv[3];

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', `org${orgNumber}.example.com`, `connection-org${orgNumber}.json`);
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user "${userName}" does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('Liken');

        const conditionsData = {
            terms: 'Many many terms',
            conditions: 'Many many conditions',
            expirationDate: '2022-12-31'
        };

        // Submit the specified transaction.
        // const result = await contract.submitTransaction('registerModel', 'new model cool');
        // FOR SOME REASON IT MAY OR MAY NOT FAIL WHEN UPDATE SOMETHING WITH THE SAME MODEL
        // const result = await contract.submitTransaction('updateModel', 'MODEL1', 'updated model by apple');
        const result = await contract.submitTransaction('approve', 'MODEL2', 'microsoft', JSON.stringify(conditionsData));
        // const result = await contract.submitTransaction('remove', 'MODEL1', 'apple');
        console.log(result.toString());
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
