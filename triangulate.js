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
    return ((y - y1) * (x2 - x1) - (x - x1) * (y2 - y1) > 0);
}

function triangulate(sortedArr){
    let Arr = [...sortedArr];
    let res = [];
    let lowerhull = [];
    let upperhull = [];

    // Add first triangle
    [res, upperhull, lowerhull] = addFirstTriangle(Arr, res);
    // Add rest of triangles
    for (let i = 0; i < Arr.length; i += 2){
        console.log(Arr[i], Arr[i+1]);
        let x = Arr[i];
        let y = Arr[i+1];
        console.log(upperhull, lowerhull);
        res, upperhull = addTriangle(upperhull, true, res, x, y);
        res, lowerhull = addTriangle(lowerhull, false, res, x, y);
        

    }
    console.log(lowerhull);
    console.log(upperhull);
    console.log(res);
}

function addTriangle(hull, pos, res, x, y){
    for (let j = hull.length-1; j >= 3; j -= 2){
        let x1 = hull[j-3];
        let y1 = hull[j-2];
        let x2 = hull[j-1];
        let y2 = hull[j];
        if (isAbove(x, y, x1, y1, x2, y2) == pos){
            let tripos = [x1, y1, x2, y2, x, y];
            let tri = new triangle(tripos);
            res.push(tri);
            hull.pop();
            hull.pop();
        }
    }
    hull.push(x);
    hull.push(y);
    return res, hull;
}

function addFirstTriangle(Arr, res){
    // Add first triangle
    let upperhull = [];
    let lowerhull = []

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
    return [res, upperhull, lowerhull];
}


triangulate([1, 2, 2, 1, 3, 2, 4, 5, 5, 1, 6, 3]);