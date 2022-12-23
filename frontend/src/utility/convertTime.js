
function convertToTimestamp(time){
    var datum = Date.parse(time);
    return datum/1000;
    // console.log(datum/1000);
    // console.log(Math.floor(Date.now() / 1000))
}

function convertToDate(timestamp){
    var date = Date(timestamp * 1000);
    return date;
}
export {convertToTimestamp, convertToDate};