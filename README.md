<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597037735/Liken/Logo.svg' height=200/>

</div>

</br>

<p align="center">
   Blockchain solution for sharing AI models among organizations, using Hyperledger Fabric, Node.js and ReactJS. Presented as Capstone Project for the <a href='https://www.georgebrown.ca/programs/blockchain-development-program-t175/'>Blockchain Development</a> program from <a href='https://www.georgebrown.ca'>George Brown College</a>.   
</p>

<p align="center">
   You can check out the slides used in the final presentation here: <a href='https://docs.google.com/presentation/d/1PPZ9GaLhyMMlVsDvoo3Ye-qA5rD40s_PqcJY--EsNaU/edit?usp=sharing'>Final Presentation</a>.
</p>

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597466877/Liken/Liken_demo.gif'/>

</div>

## :page_with_curl: Summary

- [Introduction](#-introduction)
- [Why Liken?](#thinking-why-liken)
- [Architecture](#bricks-architecture)
- [Flow Chart](#ocean-flow-chart)
- [Sequence Diagram](#film_strip-sequence-diagram)
- [Timeline](#rocket-timeline)
- [Ledger information](#chains-ledger-information)
- [API information](#fishing_pole_and_fish-api-information)
- [How to run](#runner-how-to-run)
- [Resources](#book-resources-and-tools-hammer)
- [Technologies](#computer-technologies)

## 🧐 Introduction

In the chart below (source: <a href="https://www.pcmag.com/news/the-big-data-market-is-set-to-skyrocket-by-2022">pcmag</a>) you can see the big data growth along the last years until 2019 and a growth projection for 274 billion dollars in 2022.

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597470077/Liken/BigData_market_growth.svg'/>

</div>

</br>

In the era where data is the new gold, organizations can have predictive advantages in the market if they have access to the right tools or to the right sources. On one hand we have machine learning and deep learning algorithms, which requires a great amount of data to get better results. On the other hand we have blockchain, which focuses on the most relevant data in order to build a reliable environment.

## :thinking: Why Liken?

:herb: The original word, [Lichen](https://en.wikipedia.org/wiki/Lichen), is a mutually beneficial relationship of algae or bacteria and fungi.

:deciduous_tree: Finding Lichen on the trees is a good sign that the environment is healthy and it is ok to breathe that air.

:bulb: **Liken** will provide a save environment where every organization that joins will benefit sharing their data and AI models under terms and conditions.

## :bricks: Architecture

This project combines these two cutting edge technologies. Since huge datasets are stored in data lakes, my intention is to use hyperledger fabric as a means to record only the artificial intelligence models and to control data access among organizations that are interested in these models. The ledger would act as an access management system storing the permission by which a business can access and use the organization's data.

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597477615/Liken/Architecture.svg'/>

</div>

## :ocean: Flow Chart

The following chart represents the flow of this MPV. You can check the flow chart of the full solution [here](FullSolution.md#flow-chart).

Every organization that joins the network will be able to interact with the ledger through the user interface. Both registration of a new model and access to public model data can easily be requested through the interface. However, transactions that can interact with sensitive information from other network participants, such as updating and approval management, requires another level of security. In these cases, both server authentications and chaincode verifications are employed.

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597108351/Liken/Liken_Flow_Chart_v2.png' width=800/>

</div>

## :film_strip: Sequence Diagram

The following diagram represents the flow of this MPV. You can check the full sequence diagram [here](FullSolution.md#sequence-diagram).

1. Organizations are able to safely register their AI models in the ledger.
2. Organizations can also approve other organizations to update their registered models.
    - In HLF, a composite key is created to relate the model key to the organization. Also, the terms, conditions and expiration date are stored in the ledger along this composite key.
3. The allowed organizations can see and update the models, which will increase the speed of improvement of the shared models.

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597129372/Liken/Liken_Sequence_Diagram_MVP.svg'/>

</div>

## :rocket: Timeline

This is the timeline implementation and future goals for this project:

1. The current code is a full blockchain-based implementation: Hyperledger Fabric, Node.js and ReactJS, which allows simple AI model sharing among organizations in the network.
2. After new refinements form this prototype, we will be able to deploy a MVP, where organizations will be able to share their AI models safely.
3. Finally, we want to provide integrations with datalakes and [IPFS](https://ipfs.io/).
    - IPFS is a distributed file system. Adopting this approach we will reach more decentralization and reliability.
    - Having the datasets and models stored in IPFS, only the file reference will be stored in the ledger, preventing overloading.
4. As a first great goal, we want to introduce [homomorphic encryption](https://en.wikipedia.org/wiki/Homomorphic_encryption) (HE). 
    - HE will allow organizations to perform operations on encrypted private data without disclosing information, adding a new layer of security and privacy.

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597459592/Liken/Timeline.svg'/>

</div>

## :chains: Ledger Information

### Data stored in the ledger

#### Model Data

| Parameter          | Type     | Description                                          |
|-                   |-         |-                                                     |
| `owner`            | `string` | Organization who published first and owns the model. |
| `modelObject`      | `buffer` | Buffer format of the model file.                     |
| `modelName`        | `string` | Name of the model.                                   |
| `modelDescription` | `string` | Description of the model.                            |
| `publicationDate`  | `Date`   | Last time when the model was updated.                |
| `whoPublishedLast` | `string` | Who was the organization who last updated the model. |

#### Loan information

| Parameter        | Type     | Description                                                        |
|-                 |-         |-                                                                   |
| `modelKey`       | `string` | CouchDB key used to query the model data.                          |
| `terms`          | `buffer` | Terms of the model loan.                                           |
| `conditions`     | `string` | Conditions of the model loan.                                      |
| `expirationDate` | `Date`   | Deadline by which the borrowing organization can update the model. |
| `user`           | `string` | Organization who borrowed the model.                               |

### Chaincode functions

| Function | Visibility | Parameters | Action | Returns |
|-|:-:|-|-|-|
| `initLedger` | public | `array of objects` initialData  | Populates the ledger with initialData parameter. Can be called only once. |  |
| `registerModel` | public | `object` modelData | Stringifies model parameter. Saves the model in the ledger. | `bool` success or fail |
| `approve` | public | `string` modelKey, `string` user | Allows users to update models. Creates composite key. | `bool` success or fail |
| `remove` | public | `string` modelKey, `string` user | Removes user allowance. Deletes composite key. | `bool` success or fail |
| `updateModel` | public | `string` modelKey, `object` modelUpdate | Checks if the caller is allowed to update the model. Update model. | `bool` success or fail |
| `queryAllModelsByOwner` | public |  | Verifies if caller is owner of any registered model. Returns a list of models. | `array of objects` models |
| `queryAllModelsByApprovedUser` | public |  | Returns a list of models approved for caller | `array of objects` models |
| `isOwner` | private | `string` modelKey | Verifies if caller is the model owner | `bool` |
| `isApproved` | private | `string` modelKey | Verifies if user is owner or allowed to update model | `bool` |
| `getCallerId` | private |  | Extracts the CA Id. | `string` Id |
| `getModelsByCaller` | private |  | Returns a list of models approved by the caller. | `array of objects` models |
| `getRelationsArray` | private | `Iterator` relationsResultIterator | Iterates a composite key iterator. | `array of strings` model keys |

## :fishing_pole_and_fish: API information

|End Point                          |Method|Params                                      | HLF function                 |Returns                  |
|:---                               |:---: | :---                                       | :---                         |             :---        |
|`\org\index`                       | GET  |-                                           |      -                       |list of organizations    |
|`\org\login`                       | POST |login; passowrd                             |      -                       |JWT; credentials         |
|`\org\registerModel`               | POST |credentials; name; description; model object|`registerModel`               |status message; model key|
|`\org\getModelData`                | GET  |modelKey; credentials                       |`getModelData`                |public model data        |
|`\org\getFullModelData`            | GET  |modelKey; credentials                       |`getFullModelData`            |full model data          |
|`\org\approve`                     | POST |modelKey; credentials; org; terms           |`approve`                     |status message           |
|`\org\remove`                      | POST |modelKey; credentials;                      |`remove`                      |status message           |
|`\org\queryAllModelsByOwner`       | GET  |credentials;                                |`queryAllModelsByOwner`       |list of models           |
|`\org\queryAllModelsByApprovedUser`| GET  |credentials;                                |`queryAllModelsByApprovedUser`|list of models           |
|`\org\updateModel`                 | PUT  |credentials; name; description; model object|`updateModel`                 |status message           |

## :runner: How to run

This project was developed using a [Google Cloud Platform](https://cloud.google.com/) virtual machine, so every step must be performed in a VM CLI under a _sudo -s_ command.

Start your VM and save the highlighted External IP:

<p align="center">
   <img src="https://res.cloudinary.com/lorransutter/image/upload/v1594076924/eKYC/VM.png"/>
</p>

You must have [Fabric samples](https://github.com/hyperledger/fabric-samples) to run this project. You will clone this project inside fabric-samples folder so as to this can use the files from bin and config folders.

Here you can see the folder structure and the main files mentioned in this section:

```
📦fabric-samples
 ┣ 📂bin
 ┣ 📂config
 ┗ 📂Liken
   ┣ 📂api
   ┣ 📂chaincode
   ┣ 📂frontend
      ┗ 📂src
         ┗ 📂service
            ┗ 📜baseURL.json
   ┣ 📂test-network
   ┣ 📜.env
   ┣ 📜networkDown.sh
   ┗ 📜setUp.sh
```

Open your terminal in the fabric-samples folder and clone the project.

``` sh
# Clone this repo
git clone https://github.com/LorranSutter/Liken.git

# Go to the project folder
cd Liken
```

To run the application you will need to set your own configurations of _port_, _database_, _private key_ and _encryption key_. Create the following .env file in the indicated path and format with your customized configurations. You can use .env.sample and rename it to .env:

``` json
// ./.env

PORT_API=5000
PRIVATE_KEY="54AD766F231CCB0EA64156F1E5488"
ENCRYPTION_KEY="CoCKidLqlVuB8y1EYmKaye1UGoxtHmko1LmyqOHvVht="
MONGODB_URI_DEV="YOUR_MONGO_URI"
```

Now you will need two opened terminals to run the project. One for the API and another one for the frontend.

API will run on http://35.193.245.108:5000/

Frontend will run on http://35.193.245.108:3000/

``` sh

## In the first terminal ##

# Go to the chaincode folder
cd chaincode

# Install dependencies
npm install

# Go to the API application
cd ../api

# Install dependencies
npm install
```

``` sh
## In the second terminal ##

# Go to the frontend application
cd frontend

# Install dependencies
npm install
```

In order to connect frontend to the API, you will have to provide the base URL of the API in the following file:

```sh
## In the second terminal ##

# Go to the baseURL.json file
cd src/service/baseURL.json

{
    "baseURL": "http://35.193.245.108:5000"
}
```

Now you can start the network and perform all necessary set up running the following magic script:

``` sh
## In the first terminal ##

# Go to the root
cd ..

# Run the set up script
./setUp.sh
```

Run the API application:

``` sh
## In the first terminal ##

# Go to the API application
cd api

# Run API application
npm run start

# Or to use nodemon
npm run dev
```

Finally run the frontend application:

``` sh
## In the second terminal ##

# Run the project
npm start
```

If you want to stop the network and delete all artifacts created, just run the next magic script below:

``` sh
## In the first terminal ##

# Go to the root
cd ..

# Run the script
./networkDown.sh
```

#### Login credentials

Organization
* login: apple / microsoft
* password: strongpassword

# :book: Resources and Tools :hammer:

- [Notion](https://www.notion.so/) - easy to use workspace
- [Insomnia](https://insomnia.rest/) - API explorer
- [HLF SDK documentation](https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/index.html)
- [IPFS](https://ipfs.io/) - InterPlanetary File System
- [Google Cloud Platform](https://cloud.google.com/) - cloud computing services from Google

# :computer: Technologies

1. Hyperledger

    - [Fabric samples](https://github.com/hyperledger/fabric-samples) - get started samples for Hyperledger Fabric
    - [Fabric contract API](https://www.npmjs.com/package/fabric-contract-api) - contract interface to implement smart contracts
    - [Fabric CA Client](https://www.npmjs.com/package/fabric-ca-client) - SDK for Node.js to interact with HLF CA
    - [Fabric Network](https://www.npmjs.com/package/fabric-network) - SDK for Node.js to interact with HLF

2. Backend

    - [Node.js](https://nodejs.org/en/) - executes JS scripts in server side
    - [Express.js](http://expressjs.com/) - web application framework
    - [ESlint](https://eslint.org/) - pluggable JS linter
    - [Express.js](http://expressjs.com/) - web application framework
    - [MongoDB](https://www.mongodb.com/) - NoSQL database
    - [Mongoose](https://mongoosejs.com/) - object data modeling (ODM) library for MongoDB and Node.js
    - [Async](https://caolan.github.io/async/v3/) - library to perform asynchronous operations
    - [Express validator](https://express-validator.github.io/docs/) - middleware to validate data
    - [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - library to perform cryptography
    - [JWT.IO](https://jwt.io/) - JSON Web Tokens to allow, decode, verify and generate JWT
    - [Dotenv](https://www.npmjs.com/package/dotenv) - loads environment variables from a .env file
    - [Jest](https://jestjs.io/) - library for tests
    - [Nodemon](https://www.npmjs.com/package/nodemon) - monitor and restart server after changes

3. Frontend

    - [Rimble](https://rimble.consensys.design/) - design system
    - [ReactJS](https://reactjs.org/) - frontend library
    - [React Navigation](https://reactnavigation.org/) - routing and navigation for react apps
    - [React router dom](https://www.npmjs.com/package/react-router-dom) - routing and navigation for react apps
    - [React cookie](https://www.npmjs.com/package/react-cookie) - cookie interaction for React applications
    - [React Icons](https://www.npmjs.com/package/react-icons) - icons library
    - [React dropzone](https://react-dropzone.js.org/) - create zone to drop files
    - [React collapsed](https://www.npmjs.com/package/react-collapsed) - a custom hook for creating expand/collapse components
    - [Axios](https://www.npmjs.com/package/axios) - HTTP requests

## :cookie: Credits

- [Encryption/Decryption code using cipher](https://github.com/zishon89us/node-cheat/blob/master/stackoverflow_answers/crypto-create-cipheriv.js#L2)