import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import {convertToDate, } from "../utility/convertTime";
import Context from '../context/contractContext';

export default function MarkedRecord() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    let refresh = async () => {
        if (context.contract) {
            console.log("Updating marked rec list........ ")
            contractFunction.getMarkedRecords().then((result) => {
                setRecords(result);
                console.log("Updated marked rec list")
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
    }, [context.account])

    async function removeRecord(recId) {
        try {
            contractFunction.removeRecord(recId).then(async () => {
                await setTimeout(refresh, 3000);
            });

        } catch (error) {
            alert("Error while removing the records");
            console.log("Error while removing the records");
            console.log(error);
        }
    }
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
                    {props.status != '' ? <div style={{ color: 'red' }}>{props.status}</div> : <div style={{ color: 'green' }}>Valid</div>}
                    <div>Record Id: {props.recId}</div>
                    <div>TokenId: {props.tknId}</div>
                    <div>Copies: {props.copies}</div>
                    <div>Price: {props.price}</div>
                    <div>Expiration time: {convertToDate(props.endTime)}</div>
                    {extractUri(props.uri) &&
                        <div><img src={`https://ipfs.io/ipfs/${Uri}`} alt="Image" height={'200px'} width={'250px'} /></div>
                    }

                    <div><button className="btn btn-danger mt-4 px-4 py-2" type='button' onClick={() => removeRecord(props.recId)}><b>Remove</b></button></div>
                </div>

                {!(isOdd((props.index) + 1)) && (<div className="w-100"></div>)}

            </>
        )
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Marked Record</h1>

            <div className="container">
                <div className="row justify-content-evenly">
                    {Records && Records.map((obj, i) => {
                        return <Card key={i} index = {i} frozen={obj.frozen} status={obj.status} recId={obj.recordId} tknId={obj.token_id} copies={obj.copies} startTime={obj.startTime} endTime={obj.endTime} price={obj.price} uri={obj.uri} />
                    })}
                </div>
            </div>
            <hr />
        </>
    )
}
