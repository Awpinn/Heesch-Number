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