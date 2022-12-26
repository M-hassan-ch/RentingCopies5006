import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Context from '../context/contractContext';
// import { convertToDate, } from "../utility/convertTime";

export default function RecordInfo() {

  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const { state } = useLocation();
  const { recId, tknId, name, desc, price, copies, imageUri, lender } = state;
  const [IsDisabled, setIsDisabled] = useState(false);
  const _navigate = useNavigate();

  async function borrowRecord() {
    const noOfCopies = parseInt(document.getElementById("copies").value);
    
    if (noOfCopies > 0 && noOfCopies <= copies) {
      try {
        setIsDisabled(true);

        const result = await contractFunction.borrowToken(recId, noOfCopies, `${parseFloat(price) * noOfCopies}`);
        
        if (result) {
          _navigate('/viewOnRentRecord');
        }
        else {
          setIsDisabled(false);
          alert('Borrow token transaction failed');
        }

      } catch (error) {
        alert('Error occured while borrowing record')
        setIsDisabled(false);
        console.log(error);
      }
    }
    else {
      alert('Invalid no. of copies');
    }
  }

  let refresh = async () => {
    if (context.contract) {
      if (lender == context.account.address) {
        _navigate('/marketplace');
      }
    }
  }

  useEffect(() => {
    let temp = async () => {
      await refresh();
    }
    temp();
  }, [context.account])


  return (

    <>
      <section className='container mt-md-5 '>
        <div className='row justify-content-center '>

          <div className="col-md-3 p-0 m-0">
            {imageUri &&
              <img src={`https://ipfs.io/ipfs/${imageUri}`} alt="Nft" height={'400'} width={'100%'} className='border border-primary rounded' />
            }
          </div>

          <div className='col-md-4 p-5 '>
            <div className="row ">
              <div className="col-12">
                <h3>Token Id: <small>{tknId}</small></h3>
                <h6>{desc}</h6>
                <h6>Available copies: {copies}</h6>
                <h6>Price per copy: {price} ETH</h6>
              </div>

              <div className="col-4 mt-md-3">
                <div className="form-group">
                  <input type="number" className="form-control" id="copies" placeholder="copies" min={'1'} max={copies} />
                </div>
              </div>

              <div className="col-4 mt-md-3">
                <div className="form-group">
                  <button className="btn btn-primary" onClick={() => borrowRecord()} disabled={IsDisabled}> Borrow </button>
                </div>
              </div>


            </div>
          </div>

        </div>

      </section>
    </>
  )
}
