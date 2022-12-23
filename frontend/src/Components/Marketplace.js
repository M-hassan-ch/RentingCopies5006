import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';
import {convertToDate, } from "../utility/convertTime";

import axios from 'axios';

export default function Marketplace() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;
    const [IsDisabled, setIsDisabled] = useState(false)

    let refresh = async () => {
        if (context.contract) {
            console.log("Updating marketplace rec list........ ")
            contractFunction.getAllMarkedRecords().then((result) => {
                setRecords(result);
                setIsDisabled(false);
                console.log("Updated marketplace rec list")
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    useEffect(() => {
        let temp = async () => {
            await refresh();
        }
        temp();
    }, [context.account])

    async function borrowRecord(recId, price) {
        try {
            setIsDisabled(true);
            contractFunction.borrowToken(recId, price).then(async () => {
                await setTimeout(refresh, 3000);
            });
        } catch (error) {
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
                    <div>TokenId: {props.tknId}</div>
                    <div>Price: {props.price}</div>
                    <div>Expiration time: {convertToDate(props.endTime)}</div>

                    {extractUri(props.uri) &&
                        <div><img src={`https://ipfs.io/ipfs/${Uri}`} alt="Image" height={'200px'} width={'250px'} /></div>
                    }
                    <div>
                        <div><button className="btn btn-primary mt-4 px-4 py-2" type='button' onClick={() => borrowRecord(props.recId, props.price)} disabled={IsDisabled}><b>Borrow</b></button></div>
                    </div>
                </div>
                {!(isOdd((props.index) + 1)) && (<div className="w-100"></div>)}
            </>
        )
    }
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Marketplace Records</h1>

            <div className="container">
                <div className="row justify-content-evenly">
                    {Records && Records.map((obj, i) => {
                        return <Card key={i} index={i} uri={obj.uri} recId={obj.recordId} tknId={obj.token_id} copies={obj.copies} startTime={obj.startTime} endTime={obj.endTime} price={obj.price} />
                    })}
                </div>
            </div>
            <hr />
        </>
    )
}
