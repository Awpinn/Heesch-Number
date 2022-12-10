import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import javafx.util.Pair;

class Output {

    public static class newMergedShape {
        ArrayList<Point> finalPoints = new ArrayList<Point>();
        ArrayList<Line> newSegments = new ArrayList<Line>();
        ArrayList<Line> deletedSegments = new ArrayList<Line>();
    }

    public static class Point {
        double x;
        double y;

        public Point(double x, double y) {
            this.x = x;
            this.y = y;
        }

        public Point clone() {
            return new Point(this.x, this.y);
        }

        @Override
        public String toString() {
            return ("x: " + this.x + " y: " + this.y);
        }
    }

    public static class Line {
        Point p1;
        Point p2;

        public Line(Point p1, Point p2) {
            this.p1 = p1;
            this.p2 = p2;
        }

        public Line clone() {
            return new Line(this.p1, this.p2);
        }

        @Override
        public String toString() {
            return ("p1: " + this.p1.toString() + " p2: " + this.p2.toString());
        }
    }

    public static class Side {
        double angle;
        double length;

        public Side(double angle, double length) {
            this.angle = angle;
            this.length = length;
        }

        public Side clone() {
            return new Side(this.angle, this.length);
        }

        @Override
        public String toString() {
            return ("angle: " + this.angle + " length: " + this.length);
        }
    }

    public static class Polygon {
        Point start;
        double angle;
        Side[] sides;

        public Polygon(Point start, double angle, Side[] sides) {
            this.start = start;
            this.angle = angle;
            this.sides = sides;
        }

        public Polygon clone() {
            return new Polygon(start.clone(), this.angle, this.sides.clone());
        }

        @Override
        public String toString() {
            return ("start: " + this.start.toString() + " angle: " + this.angle +" sides: " + this.sides.toString());
        }
    }


    double scale = 20;
    boolean dragging = false;
    static double tolerance = 0.01;
    static Hashtable<Polygon, ArrayList<Point>> shapePoints = new Hashtable<Polygon, ArrayList<Point>>();
    static ArrayList<ArrayList<Point>> doStuffThing = new ArrayList<ArrayList<Point>>();

    public static boolean pointsSame(Point a, Point b) {
        return (Math.abs(a.x - b.x) < tolerance && Math.abs(a.y - b.y) < tolerance);
    }

    public static Point[] shapeToPoints(Point[] shape) {
        return shape;
    }

    public static Point[] shapeToPoints(Polygon shape) {
        ArrayList<Point> curShape = shapePoints.get(shape);
        if (curShape != null) {
            return curShape.toArray(new Point[curShape.size()]);
        }
        ArrayList<Point> points = new ArrayList<Point>();
        points.add(shape.start);
        // points.push(new Point(shape.start.x+shape.sides[0].length, shape.start.y));
        double angleSum = shape.angle;
        double prevX = 0;
        double prevY = 0;
        // let prevX = points[1].x;
        // let prevY = points[1].y;
        for (int i = 0; i < shape.sides.length-1; i++) {
            Side curSide = shape.sides[i];
            double slopeX = Math.cos((180-(angleSum-(180*(i-1))))*Math.PI/180);
            double slopeY = Math.sin((180-(angleSum-(180*(i-1))))*Math.PI/180);
            double curX = curSide.length*slopeX+prevX;
            double curY = curSide.length*slopeY+prevY;
            prevX = curX;
            prevY = curY;
            angleSum += shape.sides[i+1].angle;
            points.add(new Point(curX+shape.start.x, curY+shape.start.y));
        }
        Point[] output = points.toArray(new Point[points.size()]);
        shapePoints.put(shape, points);
        return output;
    }

    public static ArrayList<Line> toLines(Polygon polygon) {
        ArrayList<Line> lines = new ArrayList<Line>();
        Point[] x = shapeToPoints(polygon);
        for (int i = 0; i < x.length; i++) {
            lines.add(new Line(x[i], x[(i+1) % x.length]));
        }
        return lines;
    }

    public static ArrayList<Line> toLines(Point[] polygon) {
        Point[] x = polygon;
        ArrayList<Line> lines = new ArrayList<Line>();
        for (int i = 0; i < x.length; i++) {
            lines.add(new Line(x[i], x[(i+1) % x.length]));
        }
        return lines;
    }

    public static Boolean pointInPoints(Point p, Point[] Points) {
        for (int i = 0; i < Points.length; i++) {
            if (Math.abs(Points[i].x - p.x) < tolerance && Math.abs(Points[i].y - p.y) < tolerance) {
                return true;
            }
        }
        return false;
    }

    public static Boolean pointOnShape(Point p, Point[] Shape) {
        for (int i = 0; i < Shape.length; i++) {
            if (distToSegment(p, Shape[i], Shape[(i+1)%Shape.length]) < tolerance) {
                return true;
            }
        }
        return false;
    }

    public static double dotProduct(double[] a, double[]b){
        double product = 0;
 
        // Loop for calculate dot product
        for (int i = 0; i < a.length; i++)
            product = product + a[i] * b[i];
        return product;
    }

    public static Boolean clockwise(Point[] points) {
        double[] v1 = {points[1].x-points[0].x, points[1].y-points[0].y};
        double[] v2 = {points[1].x-points[2].x, points[1].y-points[2].y};
        double xp = v1[0]*v2[1] - v1[1]*v2[0];
        return xp > 0;
    }

    public static Polygon pointsToShape(Point[] points) {
        ArrayList<Side> result = new ArrayList<>();
        double initialAngle = 0;
        for (int i = -1; i < points.length-1; i++) {
            double distance = Math.sqrt(Math.pow(points[(i+1)%points.length].x - points[(i+points.length)%points.length].x, 2) + Math.pow(points[(i+1)%points.length].y - points[(i+points.length)%points.length].y, 2));
            // distance from current point to next point
            double distance2 = Math.sqrt(Math.pow(points[(i+2)%points.length].x - points[(i+1)%points.length].x, 2) + Math.pow(points[(i+2)%points.length].y - points[(i+1)%points.length].y, 2));
            // distance from next point to its next point
            double[] a = {(points[(i+points.length)%points.length].x - points[(i+1)%points.length].x), (points[(i+points.length)%points.length].y - points[(i+1)%points.length].y)};
            // vector from current point to next point
            double[] b = {(points[(i+2)%points.length].x - points[(i+1)%points.length].x), (points[(i+2)%points.length].y - points[(i+1)%points.length].y)};
            // vector from next next point to next point
            double angle = Math.acos(dotProduct(a, b)/(distance * distance2))/Math.PI*180;
            if (i == 0) {
                initialAngle = -Math.atan(a[1]/a[0])/Math.PI*180;
                if (Math.abs(Math.round(initialAngle)-initialAngle) < tolerance) {
                    initialAngle = Math.round(initialAngle);
                }
            }
            // angle between the two lines is this formula
            Point[] clock = {points[(i+points.length)%points.length], points[(i+1)%points.length], points[(i+2)%points.length]};
            if (clockwise(clock)) {            
                angle = 360 - angle;
            }
            if (Math.abs(Math.round(angle)-angle) < tolerance) {
                angle = Math.round(angle);
            }
            if (Math.abs(Math.round(distance)-distance) < tolerance) {
                distance = Math.round(distance);
            }
            result.add(new Side(angle, distance2));
        }
        return new Polygon(new Point(points[0].x, points[0].y), initialAngle, result.toArray(new Side[result.size()]));
    }

    public static newMergedShape mergePolygons(ArrayList<Point> p1, ArrayList<Point> p2, Point[] originalPoints) {
        // failing when there is a 
        Point[] p1Points = p1.toArray(new Point[p1.size()]);
        Point[] p2Points = p2.toArray(new Point[p2.size()]);
        newMergedShape finalShape = new newMergedShape();
        for (int i = 0; i < p1Points.length; i++) {
            for (int j = 0; j < p2Points.length; j++) {
                double distance = distToSegment(p1Points[i], p2Points[j], p2Points[(j+1)%p2Points.length]);
                if (distance < tolerance && !pointInPoints(p1Points[i], p2Points)) {
                    p2.add(j+1, p1Points[i]);
                    p2Points = p2.toArray(new Point[p2.size()]);
                    break;
                }
            }
        }
        for (int i = 0; i < p2Points.length; i++) {
            for (int j = 0; j < p1Points.length; j++) {
                double distance = distToSegment(p2Points[i], p1Points[j], p1Points[(j+1)%p1Points.length]);
                if (distance < tolerance && !pointInPoints(p2Points[i], p1Points)) {
                    // Then I know that one of the lines from p2Points[i] is part of a line on p1Points.
                    p1.add(j+1, p2Points[i]);
                    p1Points = p1.toArray(new Point[p1.size()]);
                    if (!pointOnShape(p1Points[j], p2Points)) {
                        finalShape.newSegments.add(new Line(p2Points[i], p1Points[j]));
                    } else if (!pointOnShape(p1Points[(j+1)%p1Points.length], p2Points)) {
                        finalShape.newSegments.add(new Line(p1Points[(j+1)%p1Points.length], p2Points[i]));
                    }
                    break;
                } else if (pointInPoints(p2Points[i], originalPoints)) {
                    if (pointInPoints(p2Points[(i+1)%p2Points.length], originalPoints)) {
                        finalShape.deletedSegments.add(new Line(p2Points[i], p2Points[(i+1)%p2Points.length]));
                    }
                    break;
                }
            }
        }
        Integer startP1 = null;
        Integer startP2 = null;
        Integer endP1 = null;
        Integer endP2 = null;
        int startingNum = 0;
        while (pointInPoints(p1Points[startingNum], p2Points)) {
            startingNum++;
        }
        for (int i = 0; i < p1Points.length; i++) {
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
                return null;
            }
        }
        for (int i = 0; i < p2Points.length; i++) {
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
        int i = (endP1 + 1) % p1Points.length;
        while (true) {
            finalShape.finalPoints.add(p1Points[i]);
            if (i == startP1) {
                break;
            }
            i = (i + 1) % p1Points.length;
        }
        i = (endP2 + 1) % p2Points.length;
        while (true) {
            finalShape.finalPoints.add(p2Points[i]);
            if (i == startP2) {
                break;
            }
            i = (i + 1) % p2Points.length;
        }
        return finalShape;
    }

    public static Polygon createNewPolygon(double startingX, double startingY, double angle, int direction, int startIndex, Polygon original) {
        ArrayList<Side> sides = new ArrayList<Side>();
        int i = startIndex;
        if (direction == 1) {
            sides.add(original.sides[i]);
            // if forward
            i = (startIndex + 1)%original.sides.length;
            while (i != startIndex) {
                sides.add(original.sides[i]);
                i = (i + 1)%original.sides.length;
            }
        } else if (direction == -1) {
            for (int x = 0; x < original.sides.length; x++) {
                i = startIndex - x;
                if (i < 0) {
                    i += original.sides.length;
                }
                double curAngle = original.sides[((i + 1) % original.sides.length)].angle;
                sides.add(new Side(curAngle, original.sides[i].length));
            }
        }
        Polygon newPolygon = new Polygon(new Point(startingX, startingY), angle, sides.toArray(new Side[sides.size()]));
        shapePoints.put(newPolygon, new ArrayList<Point>(Arrays.asList(shapeToPoints(newPolygon))));
        return newPolygon;
    }

    public static Point[] breakPoints(Point startPoint, Point endPoint, int n) {
        
        double x1 = startPoint.x;
        double x2 = endPoint.x;
        double y1 = startPoint.y;
        double y2 = endPoint.y;

        double dx = (x2 - x1) / n; 
        double dy = (y2 - y1) / n;

        ArrayList<Point> interiorPoints = new ArrayList<Point>();
        interiorPoints.add(startPoint);

        for (int i = 1; i < n; i++)
            interiorPoints.add(new Point(x1 + i*dx, y1 + i*dy));

        return interiorPoints.toArray(new Point[interiorPoints.size()]);
    }

    // this should take in two shapes with their angles and distances.

    public static boolean isValidShape(ArrayList<Point> original, ArrayList<Point> attempt) {
        Point[] oPoints = original.toArray(new Point[original.size()]);
        Point[] aPoints = attempt.toArray(new Point[attempt.size()]);
        for (int i = 0; i < aPoints.length; i++) {
            Point[] points = breakPoints(aPoints[i], aPoints[(i+1)%aPoints.length], 10);
            for (int x = 0; x < points.length; x++) {
                Boolean farEnough = true;
                for (int j = 0; j < oPoints.length; j++) {
                    double distance = distToSegment(points[x], oPoints[j], oPoints[(j+1)%oPoints.length]);
                    if (distance < tolerance) {
                        farEnough = false;
                        break;
                    }
                }
                if (farEnough) {
                    if (pointInPolygon(original, points[x])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public static boolean pointInPolygon (ArrayList<Point> inputPolygon, Point point) {
        Point [] polygon = inputPolygon.toArray(new Point[inputPolygon.size()]);
        //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
        boolean odd = false;
        //For each edge (In this case for each point of the polygon and the previous one)
        for (int i = 0, j = polygon.length - 1; i < polygon.length; i++) {
            //If a line from the point into infinity crosses this edge
            if (((polygon[i].y > point.y) != (polygon[j].y > point.y)) // One point needs to be above, one below our y coordinate
                // ...and the edge doesn't cross our Y coordinate before our x coordinate (but between our x coordinate and infinity)
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

    public static double sqr(double x) { return x * x; }
    public static double dist2(Point v, Point w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
    public static double distToSegmentSquared(Point p, Point v, Point w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, new Point(v.x + t * (w.x - v.x),
                        v.y + t * (w.y - v.y)));
    }
    public static double distToSegment(Point p, Point v, Point w) {  return Math.sqrt(distToSegmentSquared(p, v, w)); }

    public static ArrayList<Point[]> allPossibleShapes(ArrayList<Point> curShape, Line curSide, double angle, Polygon original) {
        ArrayList<Point[]> possible = new ArrayList<>();
        int inverted = 1;
        for (int i = 0; i < original.sides.length; i++) {
            Polygon newShape = createNewPolygon(curSide.p2.x, curSide.p2.y, angle, inverted, i, original);
            if (isValidShape(curShape, new ArrayList<Point>(Arrays.asList(shapeToPoints(newShape))))) {
                possible.add(shapeToPoints(newShape));
            }
        }
        inverted = -1;
        for (int i = 0; i < original.sides.length; i++) {
            Polygon newShape = createNewPolygon(curSide.p2.x, curSide.p2.y, angle, inverted, i, original);
            if (isValidShape(curShape, new ArrayList<Point>(Arrays.asList(shapeToPoints(newShape))))) {
                possible.add(shapeToPoints(newShape));
            }
        }
        return possible;
    }


    // for each side, try to place the shape in each possible way that is valid.
    // if it results in the 
    public static ArrayList<ArrayList<Point>> surroundShape(Polygon ogShape, ArrayList<Point> curShape, ArrayList<Line> remainingSides, Integer outputAll, Integer angle, ArrayList<Double> angles) {
        outputAll = outputAll != null ? outputAll : 0;
        angle = angle != null ? angle : 0;
        Point[] ogLines = shapeToPoints(ogShape);
        if (angles == null) {
            double angleSum = ogShape.angle+180;
            angles = new ArrayList<>();
            angles.add(angleSum);
            for (int i = 1; i < ogShape.sides.length; i++) {
                angleSum = (angleSum+(ogShape.sides[i].angle-180))%360;
                angles.add(angleSum);
            }
        }
        ArrayList<ArrayList<Point>> result = new ArrayList<>();
        Line curSide = remainingSides.get(0);
        Double curAngle = angles.get(0);
        ArrayList<Line> sides = new ArrayList<Line>(remainingSides);
        ArrayList<Double> remainingAngles = new ArrayList<Double>(angles);
        remainingAngles.remove(0);
        sides.remove(0);
        ArrayList<Point[]> possibilities = allPossibleShapes(curShape, curSide, curAngle, ogShape);
        for (int i = 0; i < possibilities.size(); i++) {
            ArrayList<Double> tempAngles = new ArrayList<Double>(remainingAngles);
            ArrayList<Line> tempSides = new ArrayList<Line>(sides);
            newMergedShape mergedShape = mergePolygons(curShape, new ArrayList<Point>(Arrays.asList(possibilities.get(i))), ogLines);
            if (mergedShape == null) {
                continue;
            }
            ArrayList<Point> newMerge = mergedShape.finalPoints;
            ArrayList<Line> newLines = mergedShape.newSegments;
            ArrayList<Line> deletedLines = mergedShape.deletedSegments;
            if (newMerge == null) {
                continue;
            }
            for (int j = 0; j < newLines.size(); j++) {
                if (distToSegment(newLines.get(j).p1, curSide.p1, curSide.p2) < tolerance && distToSegment(newLines.get(j).p2, curSide.p1, curSide.p2) < tolerance) {
                    tempSides.add(0, newLines.get(j));
                    tempAngles.add(0, curAngle);
                    continue;
                }
                for (int k = 0; k < tempSides.size(); k++) {
                    if (distToSegment(newLines.get(j).p1, tempSides.get(k).p1, tempSides.get(k).p2) < tolerance && distToSegment(newLines.get(j).p2, tempSides.get(k).p1, tempSides.get(k).p2) < tolerance) {
                        tempSides.remove(1);
                        tempSides.add(k, newLines.get(j));
                        tempAngles.add(k, tempAngles.get(k));
                        break;
                    }
                }
            }
            for (int j = 0; j < deletedLines.size(); j++) {
                Line curLine = deletedLines.get(j);
                if ((Math.abs(curLine.p1.x-curSide.p1.x) < tolerance && Math.abs(curLine.p1.y-curSide.p1.y) < tolerance
                    && Math.abs(curLine.p2.x-curSide.p2.x) < tolerance && Math.abs(curLine.p2.y-curSide.p2.y) < tolerance) ||
                    (Math.abs(curLine.p2.x-curSide.p1.x) < tolerance && Math.abs(curLine.p2.y-curSide.p1.y) < tolerance
                    && Math.abs(curLine.p1.x-curSide.p2.x) < tolerance && Math.abs(curLine.p1.y-curSide.p2.y) < tolerance)) {
                    continue;
                }
                for (int k = 0; k < tempSides.size(); k++) {
                    Line tempLine = deletedLines.get(j);
                    if ((Math.abs(curLine.p1.x-tempLine.p1.x) < tolerance && Math.abs(curLine.p1.y-tempLine.p1.y) < tolerance
                    && Math.abs(curLine.p2.x-tempLine.p2.x) < tolerance && Math.abs(curLine.p2.y-tempLine.p2.y) < tolerance) ||
                    (Math.abs(curLine.p2.x-tempLine.p1.x) < tolerance && Math.abs(curLine.p2.y-tempLine.p1.y) < tolerance
                    && Math.abs(curLine.p1.x-tempLine.p2.x) < tolerance && Math.abs(curLine.p1.y-tempLine.p2.y) < tolerance)) {
                        tempSides.remove(k);
                        tempAngles.remove(k);
                        break;
                    }
                }
            }
            if (tempSides.size() == 0) {
                if (outputAll != 0) {
                    result.add(new ArrayList<Point>(Arrays.asList(possibilities.get(i))));
                } else {
                    result.add(newMerge);
                }
            } else {
                ArrayList<ArrayList<Point>> allPossible = (surroundShape(ogShape, newMerge, tempSides, outputAll, angle+1, tempAngles));
                while (allPossible.size() > 0) {
                    if (outputAll != 0) {
                        ArrayList<Point> temp = new ArrayList<Point>(Arrays.asList(possibilities.get(i)));
                        ArrayList<Point> current = allPossible.remove(0);
                        for (int j = 0; j < current.size(); j++) {
                            temp.add(current.get(j));
                        }
                        result.add(temp);
                    } else {
                        result.add(allPossible.remove(0));
                    }
                }
            }
        }
        return result;
    }

    public static Pair<Integer, ArrayList<ArrayList<Point>>> run(Polygon ogShape, ArrayList<Point> curShape, int count) {
        ArrayList<ArrayList<Point>> result = surroundShape(ogShape, curShape, toLines(curShape.toArray(new Point[curShape.size()])), 0, 0, (ArrayList<Double>) null);
        System.out.println(result);
        System.out.println(result.size());
        ArrayList<ArrayList<Point>> maxArray = new ArrayList<>();
        if (count >= 5) {
            return new Pair<>(-1, null);
        }
        if (result.size() == 0) {
            maxArray.add(curShape);
            return new Pair<>(count, maxArray);
        } else {
            int maxCount = 0;
            for (int i = 0; i < result.size(); i++) {
                Pair<Integer, ArrayList<ArrayList<Point>>> curResult = run(pointsToShape(result.get(i).toArray(new Point[result.get(i).size()])), result.get(i), count+1);
                if (curResult.getKey() == -1) {
                    return new Pair<>(-1, null);
                }
                doStuffThing.addAll(curResult.getValue());
                if (curResult.getKey() > maxCount) {
                    maxCount = curResult.getKey();
                    maxArray.clear();
                    maxArray.addAll(curResult.getValue());
                } else if (curResult.getKey() == maxCount) {
                    maxArray.addAll(curResult.getValue());
                }
            }
            return new Pair<> (maxCount, maxArray);
        }
    }

    public static void main(String[] args) {
        double originalScale = 1;
        ArrayList<Polygon> polygons = new ArrayList<Polygon>();

        polygons.add(new Polygon(new Point(0, 0), 0, new Side[]{new Side(90, originalScale*Math.sqrt(3)+2*originalScale), new Side(60, 2*originalScale), new Side(150, 2*originalScale), new Side(90, 2*originalScale), new Side(150, originalScale)}));
        polygons.add(new Polygon(new Point(0, 0), 0, new Side[]{new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale)}));
        polygons.add(new Polygon(new Point(0, 0), 30, new Side[]{new Side(90, 6*originalScale), new Side(90, 3*originalScale), new Side(90, originalScale), new Side(90, 2*originalScale), new Side(270, 4*originalScale), new Side(270, originalScale), new Side(90, originalScale), new Side(90, 2*originalScale)})); 
        
        Polygon original = polygons.get(0);
        ArrayList<Point> points = new ArrayList<Point>(Arrays.asList(shapeToPoints(original)));
        System.out.println(run(original, points, 0));
    }
}