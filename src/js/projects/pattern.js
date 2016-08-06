

var pattern = {
	c: null,
	ctx: null,
	width: 1000,
	height: 600,
	dots: [],
	attributes: {
		order: 0,
		density: 1
	},
	init: function(){
		this.c = document.getElementById("patternCanvas");
		this.ctx = this.c.getContext("2d");
		console.log(this);
	},
	update: function(){
		doTheThing();
	}
}

loadFunctions.push(pattern.init.bind(pattern))
loadFunctions.push(pattern.update)


function dot(x, y){
	
	var ctx = pattern.ctx;

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

	var spacing = 100;//+Math.floor(25*pattern.attributes.density);
	var border = (spacing/2)*pattern.attributes.order;
	var outside = 100;
	var numXDots = Math.floor((pattern.width+outside*2)/spacing), numYDots = Math.floor((pattern.height+outside*2)/spacing);
	var xinterval, yinterval;
	
	pattern.dots = new Array(numXDots);

	for(var i = 0; i < numXDots; i++){
		pattern.dots[i] = new Array(numYDots);
	}

	for(var i = 0 - outside, u = 0; i < pattern.width + outside; i+=spacing, u++){

		for(var j = 0 - outside, v = 0; j < pattern.height + outside; j+=spacing, v++){
		
			xmax = i + spacing;
			xmin = xmax - spacing;
			xinterval = spacing-2*border;
			
			ymax = j + spacing;
			ymin = ymax - spacing;
			yinterval = spacing-2*border;
			
			x = Math.floor((Math.random() * (xinterval)) + (xmin));
			y = Math.floor((Math.random() * (yinterval)) + (ymin));

			dot(x,y);

			pattern.dots[u][v] = {
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
	
	var dots = pattern.dots;
	
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
	pattern.dots.forEach(function(subArray, i){
		subArray.forEach(function(item, j){
			item.neighbors.forEach(function(neighbor, k){
				drawTriangle(item, neighbor, item.neighbors[(k+1)%item.neighbors.length]);
			});
		});
	});
}

function drawTriangle (start, first, second){

	var ctx = pattern.ctx;

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
	var center = pattern.width/2;

	var density = .2;

	var spacing = 20;
	var border = 8;
	var xinterval, yinterval;

	for(var i = 0; i < pattern.width; i+=spacing){

		for(var j = 0; j < pattern.height; j+=spacing){
		
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
			//y = Math.random()*pattern.height;
			
			var ycenter = pattern.height/2;
			var yoffset = Math.random()*pattern.height/2;
			
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
