app.controller('mainBodyController', ['$scope', 'patternService', function($scope, patternService){
	
	$scope.tab = 'resume';
	
	$scope.pattern = patternService.pattern;
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		pattern: 'src/html/pattern.html'
	}
	
	$scope.show = function(page){
		$scope.tab = page;
		$scope.template = $scope.templates[$scope.tab];
		console.log($scope.template);
	}
	
	$scope.loadPattern = function(){
		if($scope.tab == 'pattern'){
			console.log(patternService.pattern);
			patternService.pattern.init();
			patternService.pattern.update();
		}
	}
	
	$scope.template = $scope.templates[$scope.tab];
	
}]);

/*
app.controller('patternController', ['$scope', '$rootScope', function($scope, $rootScope){
	


	$rootScope.pattern = {
		c: null,
		ctx: null,
		width: 1000,
		height: 600,
		dots: [],
		attr: {
			order: {name: "Chaos/Order", value: .29, step: .01, min: 0, max: 1},
			density: {name: "Dense/Sparse", value: 0, step: .01, min: 0, max: 2},
			r: {name: "R", value: 241, step: 1, min: 0, max: 255},
			g: {name: "G", value: 115, step: 1, min: 0, max: 255},
			b: {name: "B", value: 61, step: 1, min: 0, max: 255},
			rgbVariance: {name: "RGB Variance", value: 20, step: 1, min: 0, max: 100},
			gradient: {name: "Gradient", value: 17, step: 1, min: 0, max: 100}
		},
		updatePass: true,
		init: function(){
			$scope.pattern.c = document.getElementById("patternCanvas");
			$scope.pattern.ctx = $scope.pattern.c.getContext("2d");

			setTimeout(function(){
				$scope.pattern.width = document.getElementById("pattern").offsetWidth;
				document.getElementById("patternCanvas").width = $scope.pattern.width;
				
				$scope.pattern.update();
			}.bind($scope.pattern), 500);
		},
		update: function(){	
					console.log("TEST");
			if($scope.pattern.updatePass){
			console.log("TEST2");

				$scope.doTheThing();

				$scope.pattern.updatePass = false;

				setTimeout(function(){
					$scope.pattern.updatePass = true;
				}, 100);
			}
		}
	}
	
	$scope.resizePass = true;

	var onResize = function(){
		window.addEventListener("resize", function(){
			if($scope.resizePass){
				$scope.resizePass = false
				$scope.pattern.width = document.getElementById("pattern").offsetWidth;
				document.getElementById("patternCanvas").width = $scope.pattern.width;
				$scope.pattern.update();
				setTimeout(function(){
					$scope.resizePass = true;
				}, 100);
			}
		});
	}

	loadFunctions.push($scope.pattern.init.bind(pattern))
	loadFunctions.push(onResize)

	$scope.dot = function(x, y){
		
		var ctx = $scope.pattern.ctx;

		ctx.beginPath();

		ctx.arc(x,y,2,0,2*Math.PI);

		ctx.fillStyle="#000000";
		ctx.fill();

		ctx.stroke();
	};



	$scope.grid = function(){
		var pattern = $scope.pattern;

		var x, xmax, xmin;
		var y, ymax, ymin;
		var numDots = 0;

		var spacing = 100+Math.floor(50*pattern.attr.density.value);
		var border = (spacing/2)*pattern.attr.order.value;
		var outside = spacing;
		var xinterval, yinterval;

		var pattern = $scope.pattern;
		
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

				$scope.dot(x,y);

				pattern.dots[u].push({
					x: x,
					y: y
				})
				numDots++;
			}
		}
	}

	$scope.findNeighbors = function(){

		var neighborCheck = 3; // has to be odd and positive
		var neighborOffset = Math.floor(neighborCheck/2);
		var neighbors;
		var neighborsFound;
		
		var m, n;
		
		var pattern = $scope.pattern;
		
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

	$scope.drawPattern = function(){
		$scope.pattern.dots.forEach(function(subArray, i){
			subArray.forEach(function(item, j){
				item.neighbors.forEach(function(neighbor, k){
					$scope.drawTriangle(item, neighbor, item.neighbors[(k+1)%item.neighbors.length]);
				});
			});
		});
	}

	$scope.drawTriangle = function(start, first, second){

		var pattern = $scope.pattern;
		
		var ctx = pattern.ctx;

		var red, green, blue;
		
		var rgb = pattern.attr;
		
		var applyGradient = $scope.applyGradient;
		var rgbValid = $scope.rgbValid;
		var rgbVar = $scope.pattern.attr.rgbVariance.value;

		red = rgb.r.value + Math.floor(Math.random()*rgbVar - rgbVar/2);
		green = rgb.g.value + Math.floor(Math.random()*rgbVar - rgbVar/2);
		blue = rgb.b.value + Math.floor(Math.random()*rgbVar - rgbVar/2);

		var gradVariance = Math.random()*rgbVar - rgbVar/2;
		
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

	$scope.rgbValid = function(color){
		color = color > 0 ? color : 0;
		color = color > 255? 255 : color;
		return Math.floor(color);
	}

	$scope.applyGradient = function(color, start){
		var g = $scope.pattern.attr.gradient.value/10;
		var x = 1-start/$scope.pattern.width;
		var result = color * (1/(g*g*x+1)) + (125 * (g*g*x)/100);
		return result;

	}

	$scope.doTheThing = function(){
		$scope.grid();
		$scope.findNeighbors();
		$scope.drawPattern();
	};
	
}]);
*/