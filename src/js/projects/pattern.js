

var pattern = {
	c: null,
	ctx: null,
	width: 1000,
	height: 600,
	dots: [],
	attributes: {
		order: .29,
		density: 0,
		r: 241,
		g: 115,
		b: 61,
		rgbVariance: 20,
		gradient: 17
	},
	init: function(){
		this.c = document.getElementById("patternCanvas");
		this.ctx = pattern.c.getContext("2d");

		setTimeout(function(){
			this.width = document.getElementById("pattern").offsetWidth;
			document.getElementById("patternCanvas").width = this.width;
			
			this.update();
		}.bind(pattern), 500);
	},
	update: function(){
		doTheThing();
	}
}

var resizePass = true;

function onResize(){
	window.addEventListener("resize", function(){
		if(resizePass){
			resizePass = false
			pattern.width = document.getElementById("pattern").offsetWidth;
			document.getElementById("patternCanvas").width = pattern.width;
			pattern.update();
			setTimeout(function(){
				resizePass = true;
			}, 100);
		}
	});
}

		
//loadFunctions.push(pattern.init.bind(pattern))
//loadFunctions.push(pattern.update)
loadFunctions.push(onResize)


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

	var spacing = 100+Math.floor(50*pattern.attributes.density);
	var border = (spacing/2)*pattern.attributes.order;
	var outside = spacing;
	var xinterval, yinterval;

	pattern.dots = [];

	for(var i = 0 - outside, u = 0; i < pattern.width + outside; i+=spacing, u++){
		pattern.dots.push([]);

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

			pattern.dots[u].push({
				x: x,
				y: y
			})
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
	
	var rgb = pattern.attributes;

	red = rgb.r + Math.floor(Math.random()*rgb.rgbVariance - rgb.rgbVariance/2);
	green = rgb.g + Math.floor(Math.random()*rgb.rgbVariance - rgb.rgbVariance/2);
	blue = rgb.b + Math.floor(Math.random()*rgb.rgbVariance - rgb.rgbVariance/2);

	var gradVariance = Math.random()*rgb.rgbVariance - rgb.rgbVariance/2;
	
	var gradr = applyGradient(rgbValid(red), start.x) + gradVariance;
	var gradg = applyGradient(rgbValid(green), start.x) + gradVariance;
	var gradb = applyGradient(rgbValid(blue), start.x) + gradVariance;

	
	var color = "rgb(";
	color += rgbValid(gradr) + ",";
	color += rgbValid(gradg) + ",";
	color += rgbValid(gradb) + ")";

	ctx.fillStyle = color;

	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(first.x, first.y);
	ctx.lineTo(second.x, second.y);
	//ctx.closePath();
	ctx.fill();
	//ctx.stroke();
}

function rgbValid(color){
	color = color > 0 ? color : 0;
	color = color > 255? 255 : color;
	return Math.floor(color);
}

function applyGradient(color, start){
	var g = pattern.attributes.gradient/10;
	var x = 1-start/pattern.width;
	var result = color * (1/(g*g*x+1)) + (125 * (g*g*x)/100);
	return result;

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



function doTheThing(){
	grid();
	findNeighbors();
	drawPattern();
};
