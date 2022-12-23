import React from 'react'

export default function Error(props) {
    return (
        <>
        <div class="alert alert-danger" role="alert">
         Error: {props.error}
        </div>
        </>
        )
    }
    