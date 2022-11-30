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


function isLeft(x, y, x1, y1, x2, y2){
    return (x1-x)*(y2-y) - (y1-y)*(x2-x) > 0;
    
}
function isRight(x, y, x1, y1, x2, y2){
    return (x1-x)*(y2-y) - (y1-y)*(x2-x) < 0;
}

function triangulate(sortedArr){
    let Arr = [...sortedArr];
    let res = [];
    let starthull =[...Arr.splice(0, 4)];
    let lowerhull = [...starthull];
    let upperhull = [...starthull];

    // Add rest of triangles
    console.log(upperhull, lowerhull);
    for (let i = 0; i < Arr.length; i += 2){
        let x = Arr[i];
        let y = Arr[i+1];
        res, upperhull = checkUpperhull(upperhull, res, x, y);
        res, lowerhull = checkLowerhull(lowerhull, res, x, y);
        

    }
    console.log(lowerhull);
    console.log(upperhull);
    console.log(res);
}

function checkUpperhull(hull, res, x, y){
    for (let j = hull.length-1; j >= 3; j -= 2){
        let x2 = hull[j-3];
        let y2 = hull[j-2];
        let x1 = hull[j-1];
        let y1 = hull[j];
        console.log("upperhull:")
        console.log(hull);
        console.log(x, y, x1, y1, x2, y2);
        console.log(isRight(x, y, x1, y1, x2, y2));
        console.log(isLeft(x, y, x1, y1, x2, y2));
        if (isRight(x, y, x1, y1, x2, y2)){
            console.log("right");
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

function checkLowerhull(hull, res, x, y){
    for(let j = hull.length-1; j >= 3; j -= 2){
        
        let x2 = hull[j-3];
        let y2 = hull[j-2];
        let x1 = hull[j-1];
        let y1 = hull[j];
        console.log("lowerhull:")
        console.log(hull);
        console.log(x, y, x1, y1, x2, y2);
        console.log(isRight(x, y, x1, y1, x2, y2));
        console.log(isLeft(x, y, x1, y1, x2, y2));
        if (isLeft(x, y, x1, y1, x2, y2)){
            console.log("left");
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


triangulate([10.954804420471191, 7.858973979949951, 90.52642059326172, 250.8202362060547, 127.46537780761719, 234.43533325195312, 465.07373046875, 508.99627685546875]);