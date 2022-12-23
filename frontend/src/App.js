import Navbar from './Components/Navbar';
import CreateNft from './Components/CreateNft';
import Marketplace from './Components/Marketplace';
import MarkForRent from './Components/MarkForRent';
import MarkedRecord from './Components/MarkedRecord';
import BorrowedRecord from './Components/BorrowedRecord';
import OnRentRecord from './Components/OnRentRecord';
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
              <MarkForRent/>
            </React.Fragment>}>
            </Route>

            <Route path="/viewMarkedRecord" element={<React.Fragment>
              <MarkedRecord></MarkedRecord>
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
              <BorrowedRecord></BorrowedRecord>
            </React.Fragment>}>
            </Route>

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
