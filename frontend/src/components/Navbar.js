import React from 'react'
import { Link } from 'react-router-dom'
import Context from '../context/contractContext';
import { useContext } from 'react';

export default function Navbar() {
  const context = useContext(Context);
  
  function LoginBtn(){
    return (
      <div >
        <button className={`ms-5 btn btn-primary py-2`} onClick={context.connectWallet}>Connect Wallet</button>
      </div>
    )
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Rentable5006</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" aria-current="page" to="./mintNft">Mint</Link>
              <Link className="nav-link" to="./markForRent">Mark For Rent</Link>
              <Link className="nav-link" to="./viewMarkedRecord">View Marked Records</Link>
              <Link className="nav-link" to="./viewOnRentRecord">View OnRent Records</Link>
              <Link className="nav-link" to="./viewBorrowedRecord">View Borrowed Records</Link>
              <Link className="nav-link" to="./marketplace">Marketplace</Link>
              {!(context.account?.address) && (LoginBtn())}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
