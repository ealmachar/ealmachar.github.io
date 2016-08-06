
var patternInit = function(){
	c = document.getElementById("patternCanvas");
	ctx = c.getContext("2d");
	doTheThing();
}

loadFunctions.push(patternInit)

var c;
var ctx;

var width = 1000;
var height = 600;

var dots;

function dot(x, y){
	ctx.beginPath();

	ctx.arc(x,y,2,0,2*Math.PI);

	ctx.fillStyle="#000000";
	ctx.fill();

	ctx.stroke();
};



function grid(){

	var x, xmax, xmin;
	var y, ymax, ymin;
	var numDots = 0;

	var spacing = 100;
	var border = 0;
	var outside = 100;
	var numXDots = Math.floor((width+outside*2)/spacing), numYDots = Math.floor((height+outside*2)/spacing);
	var xinterval, yinterval;
	
	dots = new Array(numXDots);

	for(var i = 0; i < numXDots; i++){
		dots[i] = new Array(numYDots);
	}

	for(var i = 0 - outside, u = 0; i < width + outside; i+=spacing, u++){

		for(var j = 0 - outside, v = 0; j < height + outside; j+=spacing, v++){
		
			xmax = i + spacing;
			xmin = xmax - spacing;
			xinterval = spacing-2*border;
			
			ymax = j + spacing;
			ymin = ymax - spacing;
			yinterval = spacing-2*border;
			
			x = Math.floor((Math.random() * (xinterval)) + (xmin));
			y = Math.floor((Math.random() * (yinterval)) + (ymin));

			dot(x,y);

			dots[u][v] = {
				x: x,
				y: y
			}
			numDots++;
		}
	}
}

function findNeighbors(){

	var neighborCheck = 3; // has to be odd and positive
	var neighborOffset = Math.floor(neighborCheck/2);
	var neighbors;
	var neighborsFound;
	
	var m, n;
	
	dots.forEach(function(subArray, i){
		subArray.forEach(function(item, j){
			neighbors = [];
			neighborsFound = 0;

			var u = v = w = 0;
			var leftCom = downCom = rightCom = upCom = false;
			
			while(w < neighborCheck*neighborCheck-1){

				m = i + u - neighborOffset;
				n = j + v - neighborOffset;

				if(typeof(dots[m]) !== "undefined"){
					if(typeof(dots[m][n]) !== "undefined" && (u != neighborOffset || v != neighborOffset)){
						neighbors.push({
							x: dots[m][n].x,
							y: dots[m][n].y
						});
						neighborsFound++;
					}
				}
				
				if(v < neighborCheck-1 && !leftCom){
					v++;
					if(v == neighborCheck-1)
						leftCom = true;
				}
				else if(u < neighborCheck-1 && !downCom){
					u++;
					if(u == neighborCheck-1)
						downCom = true;
				}
				else if(v > 0 && !rightCom){
					v--;
					if(v == 0)
						rightCom = true;
				}
				else if(u > 0 && !upCom){
					u--;
					if(u == 0)
						upCom = true;
				}
				
				w++;
			}

			item['neighbors'] = neighbors;
		});
	});
}

function drawPattern(){
	dots.forEach(function(subArray, i){
		subArray.forEach(function(item, j){
			item.neighbors.forEach(function(neighbor, k){
				drawTriangle(item, neighbor, item.neighbors[(k+1)%item.neighbors.length]);
			});
		});
	});
}

function drawTriangle (start, first, second){

	var red, green, blue;
	red = Math.floor(Math.random()*100+155);
	green = Math.floor(Math.random()*150);
	blue = Math.floor(Math.random()*100+50);

	var color = "rgb(" + red + "," + green + "," + blue + ")"
	
	ctx.fillStyle = color;

	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(first.x, first.y);
	ctx.lineTo(second.x, second.y);
	//ctx.closePath();
	ctx.fill();
	//ctx.stroke();
}

function tangent(){

	var x, xmax, xmin;
	var y, ymax, ymin;
	var center = width/2;

	var density = .2;

	var spacing = 20;
	var border = 8;
	var xinterval, yinterval;

	for(var i = 0; i < width; i+=spacing){

		for(var j = 0; j < height; j+=spacing){
		
			xmax = i + spacing;
			xmin = xmax - spacing;
			xinterval = spacing-2*border;
			
			ymin = ymax - spacing;
			ymax = j + spacing;
			yinterval = spacing-2*border;
			
			var offset = Math.random()*center;
			
			//x = Math.floor((Math.random() * (xinterval)) + (xmin));
			x = center + offset*Math.tan(Math.random()*360)*density;
			//y = Math.floor((Math.random() * (yinterval)) + (ymin));
			//y = Math.random()*height;
			
			var ycenter = height/2;
			var yoffset = Math.random()*height/2;
			
			y = ycenter + yoffset*Math.tan(Math.random()*360)*density;

			dot(x,y);
		}
	}
}



var doTheThing = function(){
	grid();
	findNeighbors();
	drawPattern();
};
