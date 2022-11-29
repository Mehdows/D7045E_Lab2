function triangulate(sortedArr){
    let vertices = [];
    vertices.push([sortedArr.slice(0,3)]);
    for (let i = 2; i < sortedArr.length; i += 2){
        let x = sortedArr[i];
        let y = sortedArr[i+1];
        let j = vertices.length - 1;
        while (j >= 0){
            if (vertices[j][0] < x && vertices[j][2] > x){
                vertices.push([vertices[j][0], vertices[j][1], x, y, vertices[j][2], vertices[j][3]]);
                vertices.splice(j, 1);
                j = vertices.length - 1;
            } else {
                j--;
            }
        }
    }
    let res = new Float32Array(vertices.length);
    return res;
}