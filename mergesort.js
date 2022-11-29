class triangle{
    constructor(pos){
        this.position = pos;
        this.pointers = [];
    }
    addPointer(pointer){
        this.pointers.push(pointer);
    }
    getPointers(){
        return this.pointers;
    }
    getPosition(){
        return this.position;
    }
}


function isAbove(x, y, x1, y1, x2, y2){
    return (y - y1) * (x2 - x1) - (x - x1) * (y2 - y1) > 0;
}

function triangulate(sortedArr){
    let Arr = [...sortedArr];
    let res = [];
    let lowerhull = [];
    let upperhull = [];
    // Add first triangle
    upperhull = upperhull.concat(Arr.slice(0, 2));
    if (Arr[1] < upperhull[1]){
        upperhull = upperhull.concat(Arr.slice(2, 4));
    } else {
        lowerhull = lowerhull.concat(Arr.slice(2, 4));
    }
    let splice = Arr.slice(4, 6);
    upperhull = upperhull.concat(splice);
    lowerhull = lowerhull.concat(splice);
    tri = new triangle(Arr.splice(0, 6))
    res.push(tri);
    // Add rest of triangles
    for (let i = 0; i < Arr.length; i += 2){
        //console.log(res[i])
        x1 = res[i].getPosition()[4];
        y1 = res[i].getPosition()[5];
        for (let j = 0; j < upperhull.length-2; j += 2){
            x2 = upperhull[j];
            y2 = upperhull[j+1];
            x3 = upperhull[j+2];
            y3 = upperhull[j+3];
            if (!isAbove()){
                tri = new triangle(x1, y1, x2, y2, x3, y3);
                res.push(tri);
                upperhull.splice(j, j+3);
            }
        }
        for (let j = 0; j < lowerhull.length-2; j += 2){
            x2 = lowerhull[j];
            y2 = lowerhull[j+1];
            x3 = lowerhull[j+2];
            y3 = lowerhull[j+3];
            if (isAbove()){
                tri = new triangle(x1, y1, x2, y2, x3, y3);
                res.push(tri);
                lowerhull.splice(j, j+3);
            }
        }
    }
    console.log(Arr);
    console.log(upperhull);
    console.log(lowerhull);
    console.log(res);
}

triangulate([1, 2, 2, 1, 3, 2, 4, 5, 5, 1]);