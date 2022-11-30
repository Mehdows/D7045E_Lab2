"use strict";

const  vertexShaderSource =
       "attribute vec2 a_coords;\n" +
       "attribute vec3 a_color;\n" +
       "varying vec3 v_color;\n" +
       "uniform float u_pointsize;\n" +
       "uniform float u_width;\n" +
       "uniform float u_height;\n" +
       "void main() {\n" +
       "   float x = -1.0 + 2.0*(a_coords.x / u_width);\n" +
       "   float y = 1.0 - 2.0*(a_coords.y / u_height);\n" +
       "   gl_Position = vec4(x, y, 0.0, 1.0);\n" +
       "   v_color = a_color;\n" +
       "   gl_PointSize = u_pointsize;\n" +
       "}\n";

const  fragmentShaderSource =
       "precision mediump float;\n" +
       "varying vec3 v_color;\n" +
       "void main() {\n" +
       "   float distanceFromCenter = distance( gl_PointCoord, vec2(0.5,0.5) );\n" +
       "   if ( distanceFromCenter >= 0.5 ) {\n" +
       "       discard;  // don't draw this pixel!\n" +
       "   }\n" +
       "   gl_FragColor = vec4(v_color, 1.0);\n" +
       "}\n";

let  canvas;  // The canvas where WebGL draws.
let  gl;  // The WebGL graphics context.

let  uniformWidth;   // Location of uniform named "u_width"
let  uniformHeight;  // Location of uniform named "u_height"
let  uniformPointsize;   // Location of uniform named "u_pointsize" 

let  attributeCoords;  // Location of the attribute named "a_coords".
let  bufferCoords;     // A vertex buffer object to hold the values for coords.

let  attributeColor;   // Location of the attribute named "a_color".
let  bufferColor;     // A vertex buffer object to hold the values for color.

let  animating = false;  // is the animation running?


const MAX_SETSIZE = 100;
const POINT_SIZE = 10;
/* Data for the points, including their coordinates, velocities and colors.
   The values for the arrays are created during initialization.  The random
   colors are used when the user selects colored rather than red points.
   The positions of the points are updated for each frame of the animation. */


const  pointCoords = new Float32Array( 2*MAX_SETSIZE );
const  pointRandomColors = new Float32Array( 3*MAX_SETSIZE );


function createPointData() { // called during initialization to fill the arrays with data.
    
    for (let i = 0; i < MAX_SETSIZE; i++) {
        let x, y;
        while (true) {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
            [x, y] = fixDotCloseToBorder(x, y);
            let end = true;
            for (let j = i-1; j >= 0; j--){
                let x_j = pointCoords[2*j];
                let y_j = pointCoords[2*j+1];
                if (isdotsOverlapping(x, y, x_j, y_j, POINT_SIZE, POINT_SIZE)){
                    end = false;
                }
            }
            if (end || i == 0) {
                break;
            }   
        }
        pointCoords[2*i] = x;  // x-coordinate of point
        pointCoords[2*i+1] = y;  // y-coordinate of point
    }
    for (let i = 0; i < 3 * MAX_SETSIZE; i++) {
           // The array contains color components, with three numbers per vertex.
           // The color components are just random numbers in the range zero to 1.
        pointRandomColors[i] = Math.random();
    }


}
function fixDotCloseToBorder(x, y){
    if (x < POINT_SIZE/2){
        x += POINT_SIZE/2;
    }
    if (x > canvas.width - POINT_SIZE/2){
        x -= POINT_SIZE/2;
    }
    if (y < POINT_SIZE/2){
        y += POINT_SIZE/2;
    }
    if (y > canvas.height - POINT_SIZE/2){
        y -= POINT_SIZE/2;
    }
    return [x, y];
}
function isdotsOverlapping(x1, y1, x2, y2, r1, r2){
    if (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) < (r1 + r2)/2){
        return true;
    }
    return false;
}

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
function fixVerticeSoup(Arr){
    let res = [];
    for (let i = 0; i < Arr.length; i++){
        //res = res.concat(Arr[i].);
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
class triangle{
    constructor(pos){
        this.position = pos;
        this.pointers = [];
        this.color = [0, 0, 0];
    }
    setColor(color){
        this.color = color;
    }
    getColor(){
        return this.color;
    }
    setAdjecent(pointer){
        this.pointers.push(pointer);
    }
    getAdjecent(){
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

    for (let i = 0; i < Arr.length; i += 2){
        let x = Arr[i];
        let y = Arr[i+1];
        res, upperhull = checkUpperhull(upperhull, res, x, y);
        res, lowerhull = checkLowerhull(lowerhull, res, x, y);
        

    }
    return res;
}

function checkUpperhull(hull, res, x, y){
    for (let j = hull.length-1; j >= 3; j -= 2){
        let x2 = hull[j-3];
        let y2 = hull[j-2];
        let x1 = hull[j-1];
        let y1 = hull[j];
        if (isRight(x, y, x1, y1, x2, y2)){
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

        if (isLeft(x, y, x1, y1, x2, y2)){
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


/**
 *  Draws the content of the canvas, in this case, one primitive ot
 *  type gl.POINTS, which represents all of the disks in the image.
 */
function draw() {


    gl.clearColor(0.5,0.5,0.5,1);  // specify the color to be used for clearing
    gl.clear(gl.COLOR_BUFFER_BIT);  // clear the canvas (to black)
    
    /* Get options from the user interface. */

    let setSize = document.getElementById("setSize").value;
    let color = document.getElementById("colorChoice").value;
    
    let inArr = [... pointCoords.slice(0, 2*setSize)];
    let res = mergeSort(inArr);
    let sortedPointCoords = new Float32Array(res);
    let triangleList = triangulate(sortedPointCoords);
    let triangleCoords = new Float32Array(trianglesToList(triangleList));

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.bufferData(gl.ARRAY_BUFFER, triangleCoords, gl.STREAM_DRAW);
    gl.vertexAttribPointer(attributeCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeCoords); 
    gl.disableVertexAttribArray(attributeColor);

    switch (color) {
        case "same":
            gl.vertexAttrib3f(attributeColor, 1, 0, 0);
            drawTriangle(triangleCoords);
            break;
        case "distance":
            distanceColoring(triangleList, sortedPointCoords);
            break;
        case "4_coloring":
            color4(triangleList);
            break;
    }
    gl.vertexAttrib3f(attributeColor, 0, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, triangleCoords, gl.STREAM_DRAW);

    /* Set up values for the "coords" attribute, giving point's positions */
    
    gl.uniform1f( uniformPointsize, POINT_SIZE);
    gl.bufferData(gl.ARRAY_BUFFER, sortedPointCoords, gl.STREAM_DRAW);
    gl.drawArrays(gl.POINTS, 0, setSize);
    

    gl.bufferData(gl.ARRAY_BUFFER, triangleCoords, gl.STREAM_DRAW);
    //gl.vertexAttribPointer(attributeCoords, 2, gl.FLOAT, false, 0, 0);
    drawTriangleLine(triangleCoords);

    
    


}

function drawTriangleLine(arr){
    for(let i = 0; i < arr.length/2; i += 3){	
        gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}
function drawTriangle(arr){
    for(let i = 0; i < arr.length/2; i += 3){	
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
}

function trianglesToList(triangles){
    let res = [];
    for(let i = 0; i < triangles.length; i++){
        let tri = triangles[i].getPosition();
        res = res.concat(tri);
    }
    return res;
}

function distanceColoring(triangles, point){
    let len = point.length;
    let p = Math.floor(Math.random() * len/2 ) * 2;
    let x = point[p];
    let y = point[p+1];
    let width = canvas.width;
    let height = canvas.height;
    let longestDist = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    let trianglesPos = getTrianglesPos(triangles);
    for(let i = 0; i < triangles.length; i += 1){
        let triangleX = trianglesPos[i*2];
        let triangleY = trianglesPos[i*2+1];
        let dist = Math.sqrt(Math.pow(triangleX - x, 2) + Math.pow(triangleY - y, 2));
        let color = 1 - (dist / longestDist);
        gl.vertexAttrib3f(attributeColor, color, color, color);
        gl.drawArrays(gl.TRIANGLES, i*3, 3);
    }
}


function getTrianglesPos(triangle){
    let res = [];
    for(let i = 0; i < triangle.length; i++){
        let tri = triangle[i].getPosition();
        let centerX = (tri[0] + tri[2] + tri[4]) / 3;
        let centerY = (tri[1] + tri[3] + tri[5]) / 3;
        res.push(centerX);
        res.push(centerY);
    }
    return res
}

function setAdjecentTriangles(triangleList){
    for(let i = 0; i < triangleList.length; i++){
        let tri = triangleList[i];
        let triPos = tri.getPosition();
        for(let j = 0; j < triangleList.length; j++){
            let tri2 = triangleList[j];
            let tri2Pos = tri2.getPosition();
            if(tri == tri2){
                continue;
            }
            let count = 0;
            
            for(let k = 0; k < 6; k += 2){
                for(let l = 0; l < 6; l += 2){
                    if(triPos[k] == tri2Pos[l] && triPos[k+1] == tri2Pos[l+1]){
                        count += 1;
                    }
                }
            }
            if(count == 2){
                tri.setAdjecent(tri2);
            }
        }
        //triangleList[i] = tri;
    }
    return triangleList;
}

function color4(triangleList){
    triangleList = setAdjecentTriangles(triangleList);
    for(let i = 0; i < triangleList.length; i++){
        let colorList = [[1,0,0], [0,1,0], [0,0,1], [1,1,0]];
        let tri = triangleList[i];
        let len = tri.getAdjecent().length;
        for (let j = 0; j < len; j++){
            let adj = tri.getAdjecent()[j];
            let color = adj.getColor();
            let index = 0;
            let included = false;
            [index, included] = includes(colorList, color);
            if(included){
                colorList.splice(index, 1);
            }
            
        }
        let randomindex = Math.floor(Math.random() * colorList.length);
        tri.setColor(colorList[randomindex]);
    }
    paintTriangles(triangleList);
}

function includes(list, itemlist){
    for(let i = 0; i < list.length; i++){
        let item = list[i];
        if(item[0] == itemlist[0] && item[1] == itemlist[1] && item[2] == itemlist[2]){
            return [i,true];
        }
    }
    return [-1,false];
}

function paintTriangles(triangles){
    for(let i = 0; i < triangles.length; i++){
        let tri = triangles[i];
        let color = tri.getColor();
        gl.vertexAttrib3f(attributeColor, color[0], color[1], color[2]);
        gl.drawArrays(gl.TRIANGLES, i*3, 3);
    }
}

/**
 * Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
   let  vsh = gl.createShader( gl.VERTEX_SHADER );
   gl.shaderSource( vsh, vertexShaderSource );
   gl.compileShader( vsh );
   if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
      throw new Error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
   }
   let  fsh = gl.createShader( gl.FRAGMENT_SHADER );
   gl.shaderSource( fsh, fragmentShaderSource );
   gl.compileShader( fsh );
   if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
      throw new Error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
   }
   let  prog = gl.createProgram();
   gl.attachShader( prog, vsh );
   gl.attachShader( prog, fsh );
   gl.linkProgram( prog );
   if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
      throw new Error("Link error in program:  " + gl.getProgramInfoLog(prog));
   }
   return prog;
}

/**
 * Initialize the WebGL graphics context
 */
function initGL() {
    let  prog = createProgram( gl, vertexShaderSource, fragmentShaderSource );
    gl.useProgram(prog);
    attributeCoords = gl.getAttribLocation(prog, "a_coords");
    bufferCoords = gl.createBuffer();
    attributeColor = gl.getAttribLocation(prog, "a_color");
    bufferColor = gl.createBuffer();
    uniformHeight = gl.getUniformLocation(prog, "u_height");
    uniformWidth = gl.getUniformLocation(prog, "u_width");
    gl.uniform1f(uniformHeight, canvas.height);
    gl.uniform1f(uniformWidth, canvas.width);
    uniformPointsize = gl.getUniformLocation(prog, "u_pointsize");
    createPointData();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, pointRandomColors, gl.STREAM_DRAW);
    gl.vertexAttribPointer(attributeColor, 3, gl.FLOAT, false, 0, 0);
}


/**
 * Initialize the program.  This function is called after the page has been loaded.
 */
function init() {
    try {
        canvas = document.getElementById("webglcanvas");
        let  options = {  // no need for alpha channel or depth buffer in this program
            alpha: false,
            depth: false
        };
        gl = canvas.getContext("webgl", options);
              // (Note: this page would work with "webgl2", with no further modification.)
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
    try {
        initGL();  // initialize the WebGL graphics context
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context: " + e + "</p>";
        return;
    }
    document.getElementById("setSize").onchange = function() {
        //createPointData();
        draw();
    };
    document.getElementById("colorChoice").onchange = function() {
        draw();
    };
    //createPointData();
    draw();
}


window.onload = init;  // Arrange for init() to be called after page has loaded.
