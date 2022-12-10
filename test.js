let output = [{"x":0,"y":-3.000000000000001},{"x":1,"y":-3.000000000000001},{"x":1,"y":-1.0000000000000009},{"x":5,"y":-1.0000000000000009},{"x":5,"y":-2.000000000000001},{"x":6,"y":-2.000000000000001},{"x":6,"y":0},{"x":12,"y":0},{"x":12,"y":2},{"x":11,"y":2},{"x":11,"y":1},{"x":7,"y":1.0000000000000004},{"x":7,"y":3.0000000000000004},{"x":9,"y":3},{"x":9,"y":2},{"x":10,"y":2},{"x":10,"y":4},{"x":4,"y":4.000000000000001},{"x":4,"y":7},{"x":2.0000000000000004,"y":7},{"x":2,"y":6},{"x":3,"y":6},{"x":2.999999999999999,"y":2.0000000000000004},{"x":0.9999999999999993,"y":2.000000000000001},{"x":1.0000000000000002,"y":5},{"x":-5,"y":5.000000000000002},{"x":-5,"y":3.0000000000000013},{"x":-4,"y":3.000000000000001},{"x":-3.9999999999999996,"y":4.000000000000002},{"x":4.440892098500626e-16,"y":4},{"x":0,"y":2.0000000000000004},{"x":-6,"y":2.000000000000001},{"x":-6.000000000000001,"y":-0.9999999999999991},{"x":-5.000000000000001,"y":-0.9999999999999993},{"x":-5,"y":1.0000000000000007},{"x":-1,"y":0.9999999999999997},{"x":-1.0000000000000002,"y":-3.3306690738754696e-16},{"x":0,"y":0}]
console.log(output);
let original = pointsToShape(output);
console.log(shapeToPoints(original));
console.log(original);

let somethingSomething = [{"x":8,"y":2},{"x":8,"y":0},{"x":14,"y":0},{"x":14,"y":3},{"x":13,"y":3},{"x":13,"y":1.0000000000000002},{"x":9,"y":1.0000000000000007},{"x":9,"y":2.000000000000001}]
let nextSomethingSomething = [{"x":8.000000000000002,"y":5},{"x":2.000000000000001,"y":5.000000000000001},{"x":2.000000000000001,"y":3.000000000000001},{"x":3.000000000000001,"y":3.000000000000001},{"x":3.0000000000000013,"y":4.000000000000001},{"x":4,"y":4},{"x":3.9999999999999996,"y":-2},{"x":5,"y":-2.000000000000001},{"x":5,"y":-4.000000000000001},{"x":1,"y":-4},{"x":1,"y":-3},{"x":0,"y":-3.000000000000001},{"x":1.2246467991473532e-16,"y":-5.000000000000001},{"x":-1.9999999999999993,"y":-1},{"x":-0.9999999999999993,"y":-1},{"x":-0.9999999999999992,"y":-2},{"x":1.0000000000000007,"y":-2},{"x":1.000000000000001,"y":4},{"x":-1.999999999999999,"y":4},{"x":-1.9999999999999991,"y":3},{"x":8.881784197001252e-16,"y":2.9999999999999996},{"x":6.661338147750939e-16,"y":-1},{"x":-0.9999999999999993,"y":-1.0000000000000002},{"x":-0.9999999999999991,"y":2},{"x":-6.999999999999999,"y":2.000000000000001},{"x":-6.999999999999999,"y":8.881784197001252e-16},{"x":-5.999999999999999,"y":6.661338147750939e-16},{"x":-5.999999999999999,"y":1.0000000000000009},{"x":-4.999999999999999,"y":1},{"x":-4.999999999999999,"y":0},{"x":-2.999999999999999,"y":-8.881784197001252e-16},{"x":-3,"y":-4.000000000000001},{"x":-3.9999999999999996,"y":-4.000000000000001},{"x":-3.9999999999999996,"y":-5.000000000000001},{"x":-1.9999999999999996,"y":-5},{"x":-1.9999999999999991,"y":-11},{"x":1.0000000000000009,"y":-11},{"x":1.0000000000000009,"y":-10},{"x":-0.9999999999999991,"y":-10},{"x":-0.9999999999999989,"y":-6},{"x":1.3322676295501878e-15,"y":-6},{"x":1.3322676295501878e-15,"y":-5},{"x":6,"y":-5.000000000000001},{"x":6,"y":-4.000000000000001},{"x":7,"y":-4.000000000000001},{"x":7,"y":-8},{"x":5,"y":-8},{"x":5,"y":-9},{"x":8,"y":-9},{"x":8,"y":-8},{"x":11,"y":-8},{"x":11,"y":-2},{"x":13,"y":-2},{"x":13,"y":-4},{"x":14,"y":-4},{"x":14,"y":-1},{"x":8,"y":-0.9999999999999993},{"x":8,"y":-2.999999999999999},{"x":6,"y":-3.000000000000001},{"x":6,"y":-2.000000000000001},{"x":7,"y":-2},{"x":7,"y":-1},{"x":5,"y":-0.9999999999999998},{"x":5,"y":3},{"x":6,"y":3},{"x":6,"y":4},{"x":7.000000000000002,"y":4},{"x":7.000000000000001,"y":2},{"x":8,"y":2},{"x":8,"y":0},{"x":14,"y":0},{"x":14,"y":3},{"x":13,"y":3},{"x":13,"y":1.0000000000000002},{"x":9,"y":1.0000000000000007},{"x":9,"y":2.000000000000001},{"x":8,"y":2},{"x":8,"y":3},{"x":11,"y":3},{"x":11,"y":9},{"x":9,"y":9},{"x":9,"y":8},{"x":10,"y":8},{"x":10,"y":4},{"x":7.999999999999999,"y":4}];

let height = 600;
let width = 600;
let offsetX = 0;
let offsetY = 0;
let scale = 20;

let shapes = [];
shapes.push(nextSomethingSomething);
shapes.push(somethingSomething);
// shapes.push(output);
// shapes.push(shapeToPoints(original));
// shapes.push(shapeToPoints(createNewPolygon(5, 3, 0, 1, 4)));
// shapes.push(shapeToPoints(createNewPolygon(6, 3, 90, -1, 0)));
// shapes.push(shapeToPoints(createNewPolygon(6, 0, 180, -1, 0)));
// shapes.push(shapeToPoints(createNewPolygon(6, 0, 180, -1, 0)));

function setup() {
    var myCanvas = createCanvas(height, width);
    myCanvas.parent("p5Canvas");
    pixelDensity(1);
    background('black');
    offsetX = width/2;
    offsetY = height/2;
}

function draw() {
    background('black');
    stroke('white');
    strokeWeight(2); 
    stroke('grey');
    line(0+offsetX, -99999999, 0+offsetX, 99999999);
    line(-99999999, offsetY, 99999999, offsetY);
    strokeWeight(3); 
    stroke('white');
    for (let j = 0; j < shapes.length; j++) {
        if (j == 0) {
            stroke('blue');
        } else {
            stroke('white');
        }
        for (let i = 0; i < shapes[j].length; i++) {
            point((shapes[j][i].x*scale)+offsetX, -(shapes[j][i].y*scale)+offsetY);
            line((shapes[j][i].x*scale)+offsetX, -(shapes[j][i].y*scale)+offsetY, (shapes[j][(i+1)%shapes[j].length].x*scale)+offsetX, -(shapes[j][(i+1)%shapes[j].length].y*scale)+offsetY);
        }
    }
}

function shapeToPoints(shape) {
    if (!(shape instanceof Polygon)) {
        if (Array.isArray(shape)) {
            return [...shape];
        } else {
            console.log("something has been inputted wrong to shapeToPoints");
            return null;
        }
    }
    let points = [];
    points.push(shape.start);
    // points.push(new Point(shape.start.x+shape.sides[0].length, shape.start.y));
    let angleSum = shape.angle;
    let prevX = 0;
    let prevY = 0;
    // let prevX = points[1].x;
    // let prevY = points[1].y;
    for (let i = 0; i < shape.sides.length-1; i++) {
        let currSide = shape.sides[i];
        let slopeX = Math.cos((180-(angleSum-(180*(i-1))))*Math.PI/180);
        let slopeY = Math.sin((180-(angleSum-(180*(i-1))))*Math.PI/180);
        let currX = currSide.length*slopeX+prevX
        let currY = currSide.length*slopeY+prevY
        prevX = currX;
        prevY = currY;
        angleSum += shape.sides[i+1].angle;
        points.push(new Point(currX+shape.start.x, currY+shape.start.y));
    }
    return points;
}

function createNewPolygon(startingX, startingY, angle, direction, startIndex) {
    let sides = [];
    let i = startIndex;
    if (direction == 1) {
        sides.push(original.sides[i]);
        // if forward
        i = (startIndex + 1)%original.sides.length;
        while (i != startIndex) {
            sides.push(original.sides[i]);
            i = (i + 1)%original.sides.length;
        }
    } else if (direction == -1) {
        for (let x = 0; x < original.sides.length; x++) {
            let i = startIndex - x;
            if (i < 0) {
                i += original.sides.length;
            }
            let currAngle = original.sides[((i + 1) % original.sides.length)].angle;
            sides.push(new Side(currAngle, original.sides[i].length));
        }
    }
    let newPolygon = new Polygon(new Point(startingX, startingY), angle, sides);
    return newPolygon;
}

function pointsToShape(points) {
    let result = [];
    for (let i = -1; i < points.length-1; i++) {
        let distance = Math.sqrt(Math.pow(points[(i+1)%points.length].x - points[(i+points.length)%points.length].x, 2) + Math.pow(points[(i+1)%points.length].y - points[(i+points.length)%points.length].y, 2));
        // distance from current point to next point
        let distance2 = Math.sqrt(Math.pow(points[(i+2)%points.length].x - points[(i+1)%points.length].x, 2) + Math.pow(points[(i+2)%points.length].y - points[(i+1)%points.length].y, 2));
        // distance from next point to its next point
        let a = [(points[(i+points.length)%points.length].x - points[(i+1)%points.length].x), (points[(i+points.length)%points.length].y - points[(i+1)%points.length].y)];
        // vector from current point to next point
        let b = [(points[(i+2)%points.length].x - points[(i+1)%points.length].x), (points[(i+2)%points.length].y - points[(i+1)%points.length].y)];
        // vector from next next point to next point
        let angle = Math.acos(dotProduct(a, b)/(distance * distance2))/Math.PI*180;
        // angle between the two lines is this formula
        if (clockwise([points[(i+points.length)%points.length], points[(i+1)%points.length], points[(i+2)%points.length]])) {
            
            angle = 360 - angle;
        }
        if (Math.abs(Math.round(angle)-angle) < 0.001) {
            angle = Math.round(angle);
        }
        if (Math.abs(Math.round(distance)-distance) < 0.001) {
            distance = Math.round(distance);
        }
        result.push(new Side(angle, distance2));
    }
    return new Polygon(new Point(points[0].x, points[0].y), 0, result);
}

function dotProduct(a,b){
    const result = a.reduce((acc, cur, index)=>{
      acc += (cur * b[index]);
      return acc;
    }, 0);
    return result;
  }

function clockwise(points) {
    let v1 = [points[1].x-points[0].x, points[1].y-points[0].y];
    let v2 = [points[1].x-points[2].x, points[1].y-points[2].y];
    let xp = v1[0]*v2[1] - v1[1]*v2[0];
    return xp > 0;
}