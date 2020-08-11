<div align="center">

<h2><i>Under development...</i></h2>

</div>

<div align="center" id="intro">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597037735/Liken/Logo.svg' height=200/>

</div>

<br/>

In the era where data is the new gold, organizations can have predictive advantages in the market if they have access to the right tools or to the right sources. On one hand we have machine learning and deep learning algorithms, which requires a great amount of data to get better results. On the other hand we have blockchain, which focus on the most relevant data in order to build a reliable environment.

This project combines these two cutting edge technologies. Since huge datasets are stored in data lakes, my intention is to use hyperledger fabric as a means to record only the artificial intelligence models and to control data access among organizations that are interested in these models.

<!-- The ledger would act as an access management system storing the proofs and permission by which a business can access and use the user’s data. -->

## Summary

- [Intro](#intro)
- [Flow Chart](#flow-chart)
- [Sequence Diagram](#sequence-diagram)
- [Resources](#book-resources)
- [Technologies](#computer-technologies)
<!-- - [Architecture](#architecture) -->
<!-- - [How to run](#runner-how-to-run) -->

<!-- ## Architecture

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1596662592/Liken/Liken_architecture.png' height=600/>

</div> -->

## Flow Chart

The following chart represents the flow of this MPV. You can check the full flow chart [here](FullSolution.md#flow-chart).

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597108351/Liken/Liken_Flow_Chart_v2.png' width=800/>

</div>

## Sequence Diagram

The following diagram represents the flow of this MPV. You can check the full sequence diagram [here](FullSolution.md#sequence-diagram).

<div align="center">

<img src='https://res.cloudinary.com/lorransutter/image/upload/v1597129372/Liken/Liken_Sequence_Diagram_MVP.svg'/>

</div>

<!-- <a href='https://res.cloudinary.com/lorransutter/image/upload/v1597129438/Liken/Liken_Sequence_Diagram_Full.svg'></a> -->

<!-- ## :runner: How to run

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

To run the application you will need to set your own configurations of _port_, _database_, _private key_ and _encryption key_. Create the following .env file in the indicated path and format with your customized configurations:

``` json
// ./.env

PORT_API=5000
PRIVATE_KEY="54AD766F231CCB0EA64156F1E5488"
ENCRYPTION_KEY="CoCKidLqlVuB8y1EYmKaye1UGoxtHmko1LmyqOHvVht="
MONGODB_URI_DEV="YOUR_DEV_MONGO_URI"
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

Client
* login: user01 / user02 / JonasKahnwald / MarthaNielsen / ClaudiaTiedemann / ElisabethDoppler / H.G.Tannhaus
* password: 123456

Financial Institution
* login: FI1 / FI2
* password: 123456 -->

# :book: Resources

- [Notion](https://www.notion.so/) - easy to use workspace
- [HLF SDK documentation](https://hyperledger.github.io/fabric-chaincode-node/release-1.4/api/index.html)
<!-- - [Private data - article](https://medium.com/@spsingh559/deep-dive-into-private-data-in-hyperledger-fabric-cf23931e8f96) -->

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
    <!-- - [Async](https://caolan.github.io/async/v3/) - library to perform asynchronous operations -->
    <!-- - [Express validator](https://express-validator.github.io/docs/) - middleware to validate data -->
    - [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - library to perform cryptography
    - [JWT.IO](https://jwt.io/) - JSON Web Tokens to allow, decode, verify and generate JWT
    - [Dotenv](https://www.npmjs.com/package/dotenv) - loads environment variables from a .env file
    - [Jest](https://jestjs.io/) - library for tests
    <!-- - [Moment.js](https://momentjs.com/) - parsing, validating, manipulating and displaying dates and times -->
    - [Nodemon](https://www.npmjs.com/package/nodemon) - monitor and restart server after changes
    <!-- - [Supertest](https://github.com/visionmedia/supertest) - HTTP assertions provider -->

3. Frontend

    - [Rimble](https://rimble.consensys.design/) - design system
    - [ReactJS](https://reactjs.org/) - frontend library
    - [React Navigation](https://reactnavigation.org/) - routing and navigation for react apps
    - [React router dom](https://www.npmjs.com/package/react-router-dom) - routing and navigation for react apps
    - [React-cookie](https://www.npmjs.com/package/react-cookie) - cookie interaction for React applications
    <!-- - [React dropzone](https://react-dropzone.js.org/) - create zone to drop files -->
    - [Axios](https://www.npmjs.com/package/axios) - HTTP requests
