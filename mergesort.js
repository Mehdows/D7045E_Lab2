
function addY(){
    for (let i = 0; i < pointCoords.length; i += 2){
        pointCoords[i] = pointCoords[i] + pointCoords[i+1]*0.01;
    }
}

function removeY(){
    for (let i = 0; i < pointCoords.length; i += 2){
        pointCoords[i] = pointCoords[i] - pointCoords[i+1]*0.01;
    }
}


function mergeSort(arr){
    if(arr.length == 2){
        return arr;
    }
    let middle = arr.length/2;
    if (arr.length/2 % 2 == 1){
        middle = arr.length/2 + 1;
    }
    
    var left = arr.slice(0, middle);
    var right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(right, left){
    let result = [];
    while (right.length > 1 && left.length > 1){
        if (right[0] < left[0]){
            result.push(right.shift());
            result.push(right.shift());
        } else {
            result.push(left.shift());
            result.push(left.shift());
        }
    }
    while (right.length > 1){
        result.push(right.shift());
        result.push(right.shift());
    }
    while (left.length > 1){
        result.push(left.shift());
        result.push(left.shift());
    }
    return result;
}