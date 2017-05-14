
var nextCol;

var app = new _app;

window.onload = function(){
//	app.onload();
};

function _app(){
	this._engine = new engine(this);
	this._pattern = new pattern(this);
//	this._hlistener = new hlistener(this);
	
	var events = () => {
		$(window).resize(() => {
			this._pattern.resize();
//			this._hlistener.resize();
		})
	}
	
	this.onload = () => {
		events();
		
		this._engine.begin();
		
		this._pattern.resize(true);
//		this._pattern.pulse();
	};
	
	this.onload();
}

function pattern(app){
	var parent = d3.select('#canvas_container');
	
	var canvas = parent.append('canvas');
		
	var hiddenCanvas = parent.append('canvas')
		.style('opacity', '0')
		.on('mousemove', mousemove)
		.on('mouseleave', mouseleave);
	
	var ctx = canvas.node().getContext('2d');
	var hctx = hiddenCanvas.node().getContext('2d');
	
	var body = $('body');
	
	var height, width;
	var mousex, mousey;
	
	var rx, ry;
	
	var patternObj;
	var patternArr;
	
	var prevHex = null;
	var currentHex = null;
	
	var fluctuation = 0;
	
	function setDimensions(hack){
		
		/*
		reason for 'hack'
		
		For some reason, changing canvas dimensions, once
		after one iteration of RequestAnimationFrame
		will improve performance
		of canvas function: context.fill()
		by almost 2x
		*/
		
		
		var buffer = hack ? 1 : 0;
		height = parseInt( parent.style('height') ) * (1 - 0.0) + buffer;
		width = parseInt( parent.style('width') );

		canvas
			.attr('width', width)
			.attr('height', height);
			
		hiddenCanvas
			.attr('width', width)
			.attr('height', height);
		
		ctx.imageSmoothingEnabled = false;
		ctx.lineCap = 'square';
		
		hiddenCanvas.imageSmoothingEnabled = false;
	}
	
	function initPattern(){
		console.log(width);
		if(width < 500){
			
			rx = 100;
		}
		else{
			rx = 50;
		}
		ry = Math.cos(30 * Math.PI / 180) * rx;
		
		var rows = Math.ceil( height / ry ) + 1;
		var cols = Math.ceil( width / (rx - rx/4*1.1) ) + 1;
		
		nextCol = 1;
		patternObj = {};
		patternArr = [];
		
		for(var i = 0; i < cols; i++){
			
			patternArr.push([]);
			
			for(var j = 0; j < rows; j++){


				var hiddenColor = genColor();
				var hexObj = new hex(i, j, hiddenColor);

				patternArr[i].push(hexObj);
				patternObj[hiddenColor] = hexObj;
			}
		}
	}

	function hex(i, j, hcolor){
		var x, y;
		var color, r, g, b, a = 1;
		
		var delay = 200;

		this.selected = false;
		this.selectNeighborDelay = 0;
		this.intensity = 0;
		this.pulse = false;
		
		var phase = Math.random() * Math.PI * 2, flucMod = 0.15;
		
		x = i * (rx - rx/4*1.1);// + rx/2;
		y = j * ry + ry/2;
		y -= i % 2 == 1 ? ry/2 : 0;
		
		var check = _check.bind(this);
		
		color = initColor();
		
		function xweight(i){
			var min = -0.25;
			var max = 0.85;
			
			var interval = max - min;

			return 1 - (( j * ry / height ) * interval + min);
		}
		
		function randomCol(max){
			var variance = 0.2;
			return max + ( Math.random() * max * variance ) - ( max * variance ) / 2;
		}
		
		function _check(a){
			var color = a;
			if(this.intensity > 0){
				color += (255 - a) * this.intensity;
			}
			
			color += color * flucMod * Math.sin(fluctuation + phase);
			
			return Math.max( Math.min( Math.floor(color), 255 ), 0 );
		}
		
		
		function initColor(){
			r = randomCol(0) * xweight(i);
			g = randomCol(190) * xweight(i);
			b = randomCol(255) * xweight(i);

			return 'rgba(' + check(r) + ', ' + check(g) + ', ' + check(b) + ', ' + a + ')';
		}
		
		function draw(ctx, hidden){
			var rxhalf = rx/2;
			var ryhalf = ry/2;
			var ryquar = ry/4;
			
			var inner = 0.96;

			ctx.fillStyle = hidden ? hcolor : color;

			if(!hidden){
				rxhalf *= inner;
				ryhalf *= inner;
				ryquar *= inner;
			}

			ctx.beginPath();
			ctx.moveTo(x - ryquar, y - ryhalf);
			ctx.lineTo(x - rxhalf, y);
			ctx.lineTo(x - ryquar, y + ryhalf);
			ctx.lineTo(x + ryquar, y + ryhalf);
			ctx.lineTo(x + rxhalf, y);
			ctx.lineTo(x + ryquar, y - ryhalf);
			ctx.closePath();
			ctx.fill();
		}
		
		this.tick = function(ctx, hidden, time){
			
			time = isNaN(time) ? 0 : time;
			
			if(this.selected){
				this.intensity = 1;
				this.selectNeighborDelay = delay;
			}
			
			color = 'rgba(' + check(r) + ', ' + check(g) + ', ' + check(b) + ', ' + a + ')';
			
			if(this.intensity > 0 && !hidden){
				this.intensity -= time*0.002;
				this.intensity = Math.max(this.intensity, 0);
			}

			
			if(this.selectNeighborDelay > 0){
				this.selectNeighborDelay -= time;
				this.selectNeighborDelay = Math.max(this.selectNeighborDelay, 0);
				
				if(this.selectNeighborDelay == 0){
					
					if(Math.random() > 0.5 || this.intensity <= 0.5 || this.pulse){

						if(patternArr[i][j - 1]){
							patternArr[i][j - 1].intensity = 0.5;
							patternArr[i][j - 1].selectNeighborDelay = 200;
						}
						if(this.pulse){
							this.pulse = false;
						}
					}
				}
			}
			
			draw(ctx, hidden);
		}
	}
	
	function drawPattern(time){
		for(var hex in patternObj){
			patternObj[hex].tick(ctx, false, time);
			patternObj[hex].selected = false;
		}
	}
	
	function drawHiddenCanvas(){
		for(var hex in patternObj){
			patternObj[hex].tick(hctx, true);
		}
	}
		
	function mousemove(){

		mousex = d3.event.layerX || d3.event.offsetX;
		mousey = d3.event.layerY || d3.event.offsetY;

		var color = hctx.getImageData(mousex, mousey - body.scrollTop(), 1, 1).data;
		
		currentHex = patternObj['rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'];
		
		if(currentHex){
			currentHex.selected = true;
		}
	}
	
	function mouseleave(){
		if(currentHex){
			currentHex = null;
		}
	}
	
	this.pulse = function(){
		patternArr.forEach(function(d, i){
			d[d.length-1].selected = true;
			d[d.length-1].pulse = true;
		});
	}
	
	this.tick = function(time){
		ctx.clearRect(0, 0, width, height);
	
		if(currentHex){
			currentHex.selected = true;
		}
		
		fluctuation += 2 * Math.PI / 180;
		fluctuation %= Math.PI * 2;
		
		drawPattern(time);
	}
	
	this.resize = function(hack){
		setDimensions(hack);
		initPattern();
		drawHiddenCanvas();
	};
	
	
	(() => {
		this.resize();
	})();
}

function hlistener(app){
	var plate = $('#main-plate');
	var text = $('#main-text');
	var name = $('#main-name');
	var title = $('#main-title');
	var body = $('body');

	var top = parseInt(plate.css('top'));
	var sticky = false;

	$(window).scroll(function(){
		if(body.scrollTop() > top){
			//plate.addClass('plate-fixed');
			plate.css({
				position: 'fixed',
				top: 0,
				bottom: 'auto'
			});
			
			text.css({
				margin: '10px 50px'
			});
			
			name.css({
				marginTop: 0,
				marginBottom: 0,
				paddingBottom: 5,
				borderBottomWidth: 0
			});
			
			title.css({
				display: 'none'
			});
		}
		else{
			plate.attr('style', '');
			name.attr('style', '');
			title.attr('style', '');
		}
		
	});
	
	this.resize = function(){
		top = parseInt(plate.css('top'));
	}
}

function engine(app){
	var prev = 0;
	var a, b = 0;
	
	var average = [];
	
	var i = 1;
	
	function animate(time){
//		if(i > 0){
			requestAnimationFrame(animate);

//		}
		

		a = performance.now();
		app._pattern.tick(time - prev);
		b = performance.now();
//		console.log(b - a);
/*
		if(average.length < 10)
			average.push(b-a);
		else{
			var sum = 0;
			average.forEach((d)=>{sum += d});
			console.log(sum/average.length);
			average = [];
		}
	*/

//		console.log(time - prev);
		prev = time;
	}
	
	this.begin = function(){
		animate();
	}
}

// http://stackoverflow.com/a/15804183
function genColor(){ 

	var ret = [];
	
	if(nextCol < 16777215){ 
		ret.push(nextCol & 0xff); // R 
		ret.push((nextCol & 0xff00) >> 8); // G 
		ret.push((nextCol & 0xff0000) >> 16); // B
		nextCol += 100; 
	}

	var col = "rgb(" + ret.join(',') + ")";
	
	return col;
}