# Getting Started with Create React App
This project was bootstrapped with [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html).
## Available Scripts
In the project directory, you can run:
### `npm i`
Run this command to install all the dependencies. You have to run `npm i` in current directory as well as in `.\frontend`. 
### `npm start`
Runs `npm start` in `./frontend` to start the project.\
Open [http://localhost:3000](http://localhost:3000). 
The page will reload automatically if you make changes in the code.\
Errors will be displayed in the browser's console.

# Directories
### Project Folder Structure
`./frontend/contracts`: Contains all the smart contracts files.\
`./frontend/test`: Contains all the test scripts of smart contract.\
`./frontend/scripts` : Contains the deployement scripts of smart contracts.\
`./frontend/src/Components` : Contains the JSX components.\
`./frontend/src/artifacts` : Contains the artifacts(abi) of smart contracts that generated through [`Hardhat`](https://hardhat.org/hardhat-runner/docs/guides/project-setup).\
`./frontend/src/utility` : Contains the files of utility functions.\
`./frontend/src/context` : Contains the files managing all the state variables related to the smart contract.

### Configuration files
**`./frontend/harhat.config.js`** contains all the deployement details (network, artifacts directory settings) of smart contract. 
