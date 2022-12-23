import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';
import {convertToDate, } from "../utility/convertTime";
import axios from 'axios';

export default function BorrowedRecord() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    let refresh = async () => {
        if (context.contract) {
            console.log("Updating borrowed rec list........ ")
            contractFunction.getBorrowedRecords().then((result) => {
                setRecords(result);
                console.log("Updated borrowed rec list")
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    useEffect(() => {
        let temp = async () => {
            await refresh();
        }
        temp();
    }, [context.account]);


    function Card(props) {
        const [Uri, setUri] = useState(null);

        let extractUri = async (uri) => {
            let res = await axios.get(`https://ipfs.io/ipfs/${uri}`);
            if (res) {
                setUri(res.data.data);
            }
        }

        function isOdd(val) {
            return val % 3;
        }

        return (
            <>
                <div className="col-md-3 rounded shadow py-2 border border-primary">
                    <div>Record Id: {props.recId}</div>
                    <div>TokenId: {props.tknId}</div>
                    <div>Price: {props.price}</div>
                    <div>Expiration time: {convertToDate(props.endTime)}</div>

                    {extractUri(props.uri) &&
                        <div><img src={`https://ipfs.io/ipfs/${Uri}`} alt="Image" height={'200px'} width={'250px'} /></div>
                    }
                </div>
                {!(isOdd((props.index) + 1)) && (<div className="w-100"></div>)}
            </>
        )
    }
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Borrowed Records</h1>

            <div className="container">
                <div className="row justify-content-evenly">
                    {Records && Records.map((obj, i) => {
                        return <Card key={i} index = {i} uri={obj.uri} recId={obj.recordId} tknId={obj.token_id} copies={obj.copies} startTime={obj.startTime} endTime={obj.endTime} price={obj.price} />
                    })}
                </div>
            </div>
            <hr />
        </>
    )
}
