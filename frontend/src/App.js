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
            <Route path="/" element={<React.Fragment>
              <CreateNft />
            </React.Fragment>}>
            </Route>
            <Route path="/mintNft" element={<React.Fragment>
              <CreateNft />
            </React.Fragment>}>
            </Route>
            <Route path="/markForRent" element={<React.Fragment>
              <MarkForRent />
            </React.Fragment>}>
            </Route>
            <Route path="/viewMarkedRecord" element={<React.Fragment>
              <MarkedRecord />
            </React.Fragment>}>
            </Route>
            <Route path="/viewOnRentRecord" element={<React.Fragment>
              <OnRentRecord />
            </React.Fragment>}>
            </Route>
            <Route path="/marketplace" element={<React.Fragment>
              <Marketplace />
            </React.Fragment>}>
            </Route>
            <Route path="/viewBorrowedRecord" element={<React.Fragment>
              <BorrowedRecord />
            </React.Fragment>}>
            </Route>
            <Route path="/record/info" element={<React.Fragment>
              <RecordInfo />
            </React.Fragment>}></Route>
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
