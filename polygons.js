let polygons = [];
let originalScale = 1;

polygons.push(new Polygon(new Point(0, 0), 0, [new Side(90, originalScale*Math.sqrt(3)+2*originalScale), new Side(60, 2*originalScale), new Side(150, 2*originalScale), new Side(90, 2*originalScale), new Side(150, originalScale)]));
polygons.push(new Polygon(new Point(0, 0), 0, [new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale), new Side(90, originalScale)]));
polygons.push(new Polygon(new Point(0, 0), 30, [new Side(90, 6*originalScale), new Side(90, 3*originalScale), new Side(90, originalScale), new Side(90, 2*originalScale), new Side(270, 4*originalScale), new Side(270, originalScale), new Side(90, originalScale), new Side(90, 2*originalScale)]));