import Navbar from './components/Navbar';
import CreateNft from './components/CreateNft';
import Marketplace from './components/Marketplace';
import MarkForRent from './components/MarkForRent';
import MarkedRecord from './components/MarkedRecord';
import BorrowedRecord from './components/BorrowedRecord';
import OnRentRecord from './components/OnRentRecord';
import RecordInfo from './components/RecordInfo';
import React from 'react';
import { ContractState } from './context/contractState';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
      <ContractState>
        <BrowserRouter>

          <Navbar />

          <Routes>
            <Route path="/" element={<CreateNft /> }/>

            <Route path="/mintNft" element={  <CreateNft /> }/>

            <Route path="/markForRent" element={<MarkForRent />}/>

            <Route path="/viewMarkedRecord" element={  <MarkedRecord/> }/>

            <Route path="/viewOnRentRecord" element={    <OnRentRecord /> }/>

            <Route path="/marketplace" element={ <Marketplace /> }/>

            <Route path="/viewBorrowedRecord" element={   <BorrowedRecord /> }/>

            <Route path="/record/info" element={    <RecordInfo /> }/>

          </Routes>
        </BrowserRouter>


        {/* <MarkedRecord></MarkedRecord>
        <BorrowedRecord></BorrowedRecord>
        <MarkForRent></MarkForRent>
        <CreateNft />
        <ViewMyNft /> */}
      </ContractState>
    </>
  );
}

export default App;
