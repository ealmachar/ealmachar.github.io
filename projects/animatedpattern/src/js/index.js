
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
		if(mobilecheck()){
			rx = 150;
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

		if(average.length < 10)
			average.push(b-a);
		else{
			var sum = 0;
			average.forEach((d)=>{sum += d});
//			console.log(sum/average.length);
			average = [];
		}
	

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

// http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};