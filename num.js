class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    clone() {
        return new Line(this.p1, this.p2);
    }
}

class Side {
    constructor(angle, length) {
        this.angle = angle;
        this.length = length;
    }
    clone() {
        return new Side(this.angle, this.length);
    }
}

class Polygon {
    constructor(start, angle, sides) {
        this.start = start;
        this.angle = angle;
        this.sides = sides;
    }
    clone() {
        return new Polygon(this.start.clone(), this.angle, this.sides.clone());
    }
}

var worker = new Worker("")

let polygons = [];
let originalScale = 1;

polygons.push(new Polygon(new Point(0, 0), 0, [new Side(90, originalScale*Math.sqrt(3)+2*originalScale), new Side(60, 2*originalScale), new Side(150, 2*originalScale), new Side(90, 2*originalScale), new Side(150, originalScale)]));
polygons.push(new Polygon(new Point(0, 0), 0, [new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale)]));
polygons.push(new Polygon(new Point(0, 0), 30, [new Side(90, 6*originalScale), new Side(90, 3*originalScale), new Side(90, originalScale), new Side(90, 2*originalScale), new Side(270, 4*originalScale), new Side(270, originalScale), new Side(90, originalScale), new Side(90, 2*originalScale)]));

let globalAngle = 60;
let prevGlobalAngle = 0;

let height = 600;
let width = 600
let scale = 20;
let dragging = false;
let mouseXOffset = 0;
let mouseYOffset = 0;
let tolerance = 0.01;
const shapePoints = new Map();
const angleCosValues = new Map();
const angleSinValues = new Map();
let original = polygons[2];
shapePoints.set(original, shapeToPoints(original));
let points = shapePoints.get(original);
let lines = toLines(original);
console.log(lines);
let minWidth = 999999999;  
let maxWidth = -999999999;
let minHeight = 999999999;
let maxHeight = -999999999;
let previouslyVisited = [];
let dict = {};
dict[0] = [[1, 0], [0, 1]];
dict[45] = [[Math.sqrt(2)/2, -Math.sqrt(2)/2], [Math.sqrt(2)/2, Math.sqrt(2)/2]];
dict[90] = [[0, -1], [1, 0]];
dict[135] = [[-Math.sqrt(2)/2, -Math.sqrt(2)/2], [Math.sqrt(2)/2, -Math.sqrt(2)/2]];
let shapes = [];
shapes.push(points);
let allValid = [];
let startingIndex = 0;
let go = true;
let rotating = false;
let dostuffthing = [];
let started = true;

function pointsSame(a, b) {
    return (Math.abs(a.x - b.x) < tolerance && Math.abs(a.y - b.y) < tolerance);
}

function testIfShapeValid(array) {
    for (let i = 0; i < array.length; i++) {
        let currArray = array[0];
        let nextArray = shapeToPoints(pointsToShape(currArray));
        if (currArray.length != nextArray.length) {
            console.log("array lengths vary", currArray.length, nextArray.length);
            return false;
        }
        for (let j = 0; j < currArray.length; j++) {
            if (!pointsSame(currArray[j], nextArray[j])) {
                console.log("points differ after conversion");
                return false;
            }
        }
    }
    return true;
}

function setup() {
    var myCanvas = createCanvas(height, width);
    myCanvas.parent("p5Canvas");
    pixelDensity(1);
    if (rotating) {
        frameRate(1);
    }
    // noLoop();
    background('black');
    offsetX = width/2;
    offsetY = height/2;
}

function draw() {
    let invalid = [];
    background('black');
    stroke('white');
    strokeWeight(2); 
    stroke('grey');
    line(0+offsetX, -99999999, 0+offsetX, 99999999);
    line(-99999999, offsetY, 99999999, offsetY);
    strokeWeight(3); 
    stroke('white');
    while (shapes.length > 1) {
        shapes.pop();
    }
    if (allValid.length > 0) {
        for (let x = 0; x < allValid[startingIndex].length; x++) {
            shapes.push(allValid[startingIndex][x]);
        }
        if (rotating) {
            startingIndex = (startingIndex + 1) % allValid.length;
        }
        shapes.push(allValid[startingIndex]);
    }

    if (dostuffthing.length > 0) {
        shapes.push(dostuffthing[startingIndex]);
        if (rotating) {
            startingIndex = (startingIndex + 1) % dostuffthing.length;
        }
    }

    

    let i = 2;
    let angleSum = original.angle+180;
    let angles = [angleSum];
    stroke('grey');
    for (let j = 0; j < invalid.length; j++) {
        for (let i = 0; i < invalid[j].length; i++) {
            point((invalid[j][i].x*scale)+offsetX, -(invalid[j][i].y*scale)+offsetY);
            line((invalid[j][i].x*scale)+offsetX, -(invalid[j][i].y*scale)+offsetY, (invalid[j][(i+1)%invalid[j].length].x*scale)+offsetX, -(invalid[j][(i+1)%invalid[j].length].y*scale)+offsetY);
        }
    }
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
    if (dragging) {
        update();
    }
    // startingIndex++;

    if (started) {
        if (!go) {
            // dostuffthing = tempDebug(original, original, toLines(original));
            dostuffthing = surroundShape(original, original, toLines(original));
            console.log(testIfShapeValid(dostuffthing));
            console.log(dostuffthing);
        }
        if (go) {
            let finalResult = run();
            console.log("actually finished");
            if (finalResult != false) {
                allValid = finalResult[1];
                console.log(finalResult);
            }
        }
        started = false;
    }
}


function shapeToPoints(shape) {
    let currShape = shapePoints.get(shape);
    if (currShape != null) {
        return [...currShape];
    }
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
    shapePoints.set(shape, points);
    return points;
}

function toLines(polygon) {
    let x = polygon;
    let lines = [];
    if (x instanceof Polygon) {
        x = shapeToPoints(polygon);
    }
    for (let i = 0; i < x.length; i++) {
        lines.push(new Line(x[i], x[(i+1) % x.length]));
    }
    return lines;
}

function pointInPoints(p, Points) {
    for (let i = 0; i < Points.length; i++) {
        if (Math.abs(Points[i].x - p.x) < tolerance && Math.abs(Points[i].y - p.y) < tolerance) {
            return true;
        }
    }
    return false;
}

function pointOnShape(p, Shape) {
    for (let i = 0; i < Shape.length; i++) {
        if (distToSegment(p, Shape[i], Shape[(i+1)%Shape.length]) < tolerance) {
            return true;
        }
    }
    return false;
}

function isValidMerge(p1, p2) {
    let p1Points = shapeToPoints(p1);
    let p2Points = shapeToPoints(p2);
    for (let i = 0; i < p1Points.length; i++) {
        for (let j = 0; j < p2Points.length; j++) {
            let distance = distToSegment(p1Points[i], p2Points[j], p2Points[(j+1)%p2Points.length])
            if (distance < tolerance && !pointInPoints(p1Points[i], p2Points)) {
                p2Points.splice(j+1, 0, p1Points[i]);
                break;
            }
        }
    }
    for (let i = 0; i < p2Points.length; i++) {
        for (let j = 0; j < p1Points.length; j++) {
            let distance = distToSegment(p2Points[i], p1Points[j], p1Points[(j+1)%p1Points.length])
            if (distance < tolerance && !pointInPoints(p2Points[i], p1Points)) {
                p1Points.splice(j+1, 0, p2Points[i]);
                break;
            }
        }
    }
    let startP1 = null;
    let startP2 = null;
    let endP1 = null;
    let endP2 = null;
    let startingNum = 0;
    while (pointInPoints(p1Points[startingNum], p2Points)) {
        startingNum++;
    }
    for (let i = 0; i < p1Points.length; i++) {
        if (startP1 == null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points)) {
            startP1 = (startingNum + i)%p1Points.length;
        }
        if (startP1 != null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points) && !pointInPoints(p1Points[(startingNum+i+1)%p1Points.length], p2Points)) {
            endP1 = (startingNum + i)%p1Points.length;
        } else if (endP1 != null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points)) {
            return false;
        }
    }
    startingNum = 0;
    while (pointInPoints(p2Points[startingNum], p1Points)) {
        startingNum++;
    }
    for (let i = 0; i < p2Points.length; i++) {
        if (startP2 == null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points)) {
            startP2 = (startingNum + i)%p2Points.length;
        }        
        if (startP2 != null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points) && !pointInPoints(p2Points[(startingNum+i+1)%p2Points.length], p1Points)) {
            endP2 = (startingNum + i)%p2Points.length;
        } else if (endP2 != null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points)) {
            return false;
        }
    }
    return true;
}

function dotProduct(a,b){
    const result = a.reduce((acc, cur, index)=>{
      acc += (cur * b[index]);
      return acc;
    }, 0);
    return result;
  }

function clockwise(points) {
    let A = points[1].x*points[0].y + points[2].x*points[1].y + points[0].x+points[2].y;
    let B = points[0].x*points[1].y + points[1].x*points[2].y + points[2].x+points[0].y;
    return A > B;
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

function pointsToShape(points) {
    let result = [];
    let initialAngle = 0;
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
        if (i == 0) {
            initialAngle = -Math.atan(a[1]/a[0])/Math.PI*180;
            if (Math.abs(Math.round(initialAngle)-initialAngle) < tolerance) {
                initialAngle = Math.round(initialAngle);
            }
        }
        // angle between the two lines is this formula
        if (clockwise([points[(i+points.length)%points.length], points[(i+1)%points.length], points[(i+2)%points.length]])) {            
            angle = 360 - angle;
        }
        if (Math.abs(Math.round(angle)-angle) < tolerance) {
            angle = Math.round(angle);
        }
        if (Math.abs(Math.round(distance)-distance) < tolerance) {
            distance = Math.round(distance);
        }
        result.push(new Side(angle, distance2));
    }
    console.log(initialAngle);
    return new Polygon(new Point(points[0].x, points[0].y), initialAngle, result);
}

function mergePolygons(p1, p2, originalPoints) {
    // failing when there is a 
    let p1Points = shapeToPoints(p1);
    let p2Points = shapeToPoints(p2);
    let final = [];
    let newSegments = [];
    let deletedSegments = [];
    for (let i = 0; i < p1Points.length; i++) {
        for (let j = 0; j < p2Points.length; j++) {
            let distance = distToSegment(p1Points[i], p2Points[j], p2Points[(j+1)%p2Points.length])
            if (distance < tolerance && !pointInPoints(p1Points[i], p2Points)) {
                p2Points.splice(j+1, 0, p1Points[i]);
                break;
            }
        }
    }
    for (let i = 0; i < p2Points.length; i++) {
        for (let j = 0; j < p1Points.length; j++) {
            let distance = distToSegment(p2Points[i], p1Points[j], p1Points[(j+1)%p1Points.length])
            if (distance < tolerance && !pointInPoints(p2Points[i], p1Points)) {
                // Then I know that one of the lines from p2Points[i] is part of a line on p1Points.
                p1Points.splice(j+1, 0, p2Points[i]);
                if (!pointOnShape(p1Points[j], p2Points)) {
                    newSegments.push(new Line(p2Points[i], p1Points[j]));
                    // deletedSegments.push(new Line(p1Points[(j+1)%p1Points.length], p2Points[i]))
                } else if (!pointOnShape(p1Points[(j+1)%p1Points.length], p2Points)) {
                    newSegments.push(new Line(p1Points[(j+1)%p1Points.length], p2Points[i]));
                    // deletedSegments.push(new Line(p2Points[i], p1Points[j]));
                }
                break;
            } else if (pointInPoints(p2Points[i], originalPoints)) {
                // console.log(originalPoints);
                if (pointInPoints(p2Points[(i+1)%p2Points.length], originalPoints)) {
                    deletedSegments.push(new Line(p2Points[i], p2Points[(i+1)%p2Points.length]));
                    // console.log(JSON.stringify(deletedSegments));
                }
                break;
            }
        }
    }
    let startP1 = null;
    let startP2 = null;
    let endP1 = null;
    let endP2 = null;
    let startingNum = 0;
    while (pointInPoints(p1Points[startingNum], p2Points)) {
        startingNum++;
    }
    for (let i = 0; i < p1Points.length; i++) {
        if (startP1 == null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points)) {
            startP1 = (startingNum + i)%p1Points.length;
        }
        if (startP1 != null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points) && !pointInPoints(p1Points[(startingNum+i+1)%p1Points.length], p2Points)) {
            endP1 = (startingNum + i)%p1Points.length;
        } else if (endP1 != null && pointInPoints(p1Points[(startingNum + i)%p1Points.length], p2Points)) {
            return null;
        }
    }
    startingNum = 0;
    // console.log(p2Points, p1Points);
    while (pointInPoints(p2Points[startingNum], p1Points)) {
        startingNum++;
        // not sure if this is being handled correctly if i am being honest
        if (startingNum == p2Points.length) {
            // return [p1Points, newSegments, deletedSegments];
            // return [p1Points, [], []];
            console.log("something ain't right");
            console.log(JSON.stringify(p2Points), JSON.stringify(p1Points));
            return;
        }
    }
    for (let i = 0; i < p2Points.length; i++) {
        if (startP2 == null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points)) {
            startP2 = (startingNum + i)%p2Points.length;
        }        
        if (startP2 != null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points) && !pointInPoints(p2Points[(startingNum+i+1)%p2Points.length], p1Points)) {
            endP2 = (startingNum + i)%p2Points.length;
        } else if (endP2 != null && pointInPoints(p2Points[(startingNum + i)%p2Points.length], p1Points)) {
            return null;
        }
    }
    if (startP1 == null || startP2 == null || endP1 == null || endP2 == null) {
        return null;
    }
    let i = (endP1 + 1) % p1Points.length;
    while (1) {
        final.push(p1Points[i]);
        if (i == startP1) {
            break;
        }
        i = (i + 1) % p1Points.length;
    }
    i = (endP2 + 1) % p2Points.length;
    while (1) {
        final.push(p2Points[i]);
        if (i == startP2) {
            break;
        }
        i = (i + 1) % p2Points.length;
    }
    return [final, newSegments, deletedSegments];
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
    shapePoints.set(newPolygon, shapeToPoints(newPolygon));
    return newPolygon;
}


function midpoint(pointa, pointb) {
    return new Point((pointa.x + pointb.x)/2, (pointa.y + pointb.y)/2);
}

function breakPoints(startPoint, endPoint, n) {
    
    let {x: x1, y: y1} = startPoint;
    let {x: x2, y: y2} = endPoint;

    let dx = (x2 - x1) / n; 
    let dy = (y2 - y1) / n;

    let interiorPoints = [];

    for (let i = 1; i < n; i++)
        interiorPoints.push({x: x1 + i*dx, y: y1 + i*dy});

    return [startPoint, ...interiorPoints];
}

// this should take in two shapes with their angles and distances.

function isValidShape(original, attempt) {
    let oPoints = shapeToPoints(original);
    let aPoints = shapeToPoints(attempt);
    for (let i = 0; i < aPoints.length; i++) {
        let points = breakPoints(aPoints[i], aPoints[(i+1)%aPoints.length], 10);
        for (let x = 0; x < points.length; x++) {
            let farEnough = true;
            for (let j = 0; j < oPoints.length; j++) {
                let distance = distToSegment(points[x], oPoints[j], oPoints[(j+1)%oPoints.length])
                if (distance < tolerance) {
                    farEnough = false;
                    break;
                }
            }
            if (farEnough) {
                if (pointInPolygon(oPoints, points[x])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function pointInPolygon (polygon, point) {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        //If a line from the point into infinity crosses this edge
        if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) // One point needs to be above, one below our y coordinate
            // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
            && (point.x + tolerance < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x))
            && (point.x - tolerance < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x))) {
            // Invert odd
            odd = !odd;
        }
        j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
};

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function allPossibleShapes(currShape, currSide, angle) {
    let possible = [];
    let inverted = 1;
    for (let i = 0; i < original.sides.length; i++) {
        let newShape;
        newShape = createNewPolygon(currSide.p2.x, currSide.p2.y, angle, inverted, i);
        if (isValidShape(currShape, newShape)) {
            possible.push(shapeToPoints(newShape));
        }
    }
    inverted = -1;
    for (let i = 0; i < original.sides.length; i++) {
        let newShape;
        newShape = createNewPolygon(currSide.p2.x, currSide.p2.y, angle, inverted, i);
        if (isValidShape(currShape, newShape)) {
            possible.push(shapeToPoints(newShape));
        }
    }
    return possible;
}


// for each side, try to place the shape in each possible way that is valid.
// if it results in the 
function surroundShape(ogShape, currShape, remainingSides, outputAll = 0, angle=0, angles=null) {
    let ogLines = shapeToPoints(ogShape);
    if (angles == null) {
        let angleSum = ogShape.angle+180;
        angles = [angleSum];
        for (let i = 1; i < ogShape.sides.length; i++) {
            angleSum = (angleSum+(ogShape.sides[i].angle-180))%360;
            angles.push(angleSum)
        }
    }
    let result = [];
    let currSide = remainingSides[0];
    let currAngle = angles[0];
    let sides = [...remainingSides];
    let remainingAngles = [...angles];
    remainingAngles.shift();
    sides.shift();
    let possibilities = allPossibleShapes(currShape, currSide, currAngle);
    for (let i = 0; i < possibilities.length; i++) {
        let tempAngles = [...remainingAngles];
        let tempSides = [...sides];
        let mergedShape = mergePolygons(currShape, possibilities[i], ogLines)
        if (mergedShape == null) {
            continue;
        }
        let newMerge = mergedShape[0];
        let newLines = mergedShape[1];
        let deletedLines = mergedShape[2];
        if (newMerge == null) {
            continue;
        }
        for (let j = 0; j < newLines.length; j++) {
            if (distToSegment(newLines[j].p1, currSide.p1, currSide.p2) < tolerance && distToSegment(newLines[j].p2, currSide.p1, currSide.p2) < tolerance) {
                tempSides.splice(0, 0, newLines[j]);
                tempAngles.splice(0, 0, currAngle);
                continue;
            }
            for (let k = 0; k < tempSides.length; k++) {
                if (distToSegment(newLines[j].p1, tempSides[k].p1, tempSides[k].p2) < tolerance && distToSegment(newLines[j].p2, tempSides[k].p1, tempSides[k].p2) < tolerance) {
                    tempSides.splice(k, 1);
                    tempSides.splice(k, 0, newLines[j]);
                    tempAngles.splice(k, 0, tempAngles[k]);
                    break;
                }
            }
        }
        for (let j = 0; j < deletedLines.length; j++) {
            // let asleidfjawskefj = false;
            if ((Math.abs(deletedLines[j].p1.x-currSide.p1.x) < tolerance && Math.abs(deletedLines[j].p1.y-currSide.p1.y) < tolerance
                && Math.abs(deletedLines[j].p2.x-currSide.p2.x) < tolerance && Math.abs(deletedLines[j].p2.y-currSide.p2.y) < tolerance) ||
                (Math.abs(deletedLines[j].p2.x-currSide.p1.x) < tolerance && Math.abs(deletedLines[j].p2.y-currSide.p1.y) < tolerance
                && Math.abs(deletedLines[j].p1.x-currSide.p2.x) < tolerance && Math.abs(deletedLines[j].p1.y-currSide.p2.y) < tolerance)) {
                // asleidfjawskefj = true;
                continue;
            }
            for (let k = 0; k < tempSides.length; k++) {
                if ((Math.abs(deletedLines[j].p1.x-tempSides[k].p1.x) < tolerance && Math.abs(deletedLines[j].p1.y-tempSides[k].p1.y) < tolerance
                && Math.abs(deletedLines[j].p2.x-tempSides[k].p2.x) < tolerance && Math.abs(deletedLines[j].p2.y-tempSides[k].p2.y) < tolerance) ||
                (Math.abs(deletedLines[j].p2.x-tempSides[k].p1.x) < tolerance && Math.abs(deletedLines[j].p2.y-tempSides[k].p1.y) < tolerance
                && Math.abs(deletedLines[j].p1.x-tempSides[k].p2.x) < tolerance && Math.abs(deletedLines[j].p1.y-tempSides[k].p2.y) < tolerance)) {
                    tempSides.splice(k, 1);
                    tempAngles.splice(k, 1);
                    break;
                }
            }
            // if (!asleidfjawskefj) {
            //     return;
            // }
        }
        if (tempSides.length == 0) {
            if (outputAll) {
                result.push([possibilities[i]]);
            } else {
                result.push(newMerge);
            }
        } else {
            let allPossible = surroundShape(ogShape, newMerge, tempSides, outputAll, angle+1, tempAngles);
            while (allPossible.length > 0) {
                if (outputAll) {
                    let temp = [possibilities[i]];
                    let current = allPossible.pop();
                    for (let j = 0; j < current.length; j++) {
                        temp.push(current[j]);
                    }
                    result.push(temp);
                } else {
                    result.push(allPossible.pop());
                }
            }
        }
    }
    return result;
}

function run(ogShape = original, currShape = points, count = 0) {
    let result = surroundShape(ogShape, currShape, toLines(currShape));
    if (count >= 5) {
        return false;
    }
    if (result.length == 0) {
        console.log("finished");
        return [count, currShape];
    } else {
        let maxCount = 0;
        let maxArray = [];
        for (let i = 0; i < result.length; i++) {
            console.log(i, pointsToShape(result[i]), result[i], count+1)
            let currResult = run(pointsToShape(result[i]), result[i], count+1);
            if (currResult == false) {
                return false;
            }
            dostuffthing.push(currResult[1]);
            if (currResult[0] > maxCount) {
                maxCount = currResult[0];
                maxArray = [currResult[1]];
            } else if (currResult[0] == maxCount) {
                maxArray.push(currResult[1]);
            }
        }
        return[maxCount, maxArray];
    }
}

function tempDebug (ogShape, currShape, remainingSides, outputAll = 0, angle=0) {
    let angleSum = ogShape.angle+180;
    let angles = [angleSum];
    for (let i = 1; i < ogShape.sides.length; i++) {
        angleSum = (angleSum+(ogShape.sides[i].angle-180))%360;
        angles.push(angleSum)
    }
    let result = [];
    let currSide = remainingSides[0];
    let sides = [...remainingSides];
    sides.shift();
    let possibilities = allPossibleShapes(currShape, currSide, angles[angle]);
    for (let i = 0; i < possibilities.length; i++) {
        let tempSides = [...sides];
        let mergedShape = mergePolygons(currShape, possibilities[i], shapeToPoints(ogShape))
        let newMerge = mergedShape[0];
        result.push([possibilities[i], newMerge]);
    }
    return result;
}