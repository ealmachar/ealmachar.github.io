var mobile = false;
if( mobilecheck() ){
	$('#mobilenote').css('display', 'block');
	$('#controls-play-button_container').css('display', 'block');
	mobile = true;
}

var sitesplash = new _app;

function _app(){
	var app = this;
	app._engine = new engine(app);
	app._splash = new splash(app);
	app._music = new music(app);

//	app._bars = new bars(app);
	
	var events = () => {
		$(window).resize(() => {
			app._splash.resize();
		})
		
		
		$('#controls-play-button').click(function(){
			var state = $(this).text();

			if(state == 'play_arrow'){
				$(this).text('pause');
				app._music.play();
			}
			else{
				$(this).text('play_arrow');
				app._music.pause();
			}
		});

		$('.controls-options-checkbox').change(function(){

			var setting = $(this).attr('value');

			if(setting == 'wiggle'){
				app._splash.setWiggle( $(this).prop('checked') );
			}
			else if(setting == 'jump'){
				app._splash.setJump( $(this).prop('checked') );
			}
			else if(setting == 'stretch'){
				app._splash.setStretch( $(this).prop('checked') );
			}
		});
		
		$('#controls-volume-button').click(function(){
			var state = $(this).text();
			
			if(state == 'volume_off'){
				$(this).text('volume_up');
				app._music.unmute();
			}
			else{
				$(this).text('volume_off');
				app._music.mute();
			}
		})
	}
	
	app.onload = () => {
		events();
		
		app._engine.begin();
		app._music.mute();
		
		if(!mobile){
			app._music.play();
		}
	};
	
	app.onload();
}

function splash(app){
	var parent = d3.select('#splash');
	
	var svg = parent.append('svg')
		.attr('width', '100%')
		.attr('height', '100%')
		//.style('display', 'none');
	
	var height, width;

	var firstng, lastng, firstntxt, lastntxt;
	var github, linkedin;
	
	var upperRect, lowerRect;
	var txtSpace = .1;
	
	var highBassMax = 1;
	var highBassMin = Infinity;
	
	var highHatMax = 1;
	var highHatMin = Infinity;
	
	var willWiggle = true;
	var willJump = true;
	var willStretch = true;
	
	function setDimensions(hack){

		height = parseInt( parent.style('height') );
		width = parseInt( parent.style('width') );
	}
	
	function initDefs(){
		var filter = svg.append('defs')
			.append('filter')
			.attr('id', 'svg_drop_shadows')
			.attr('width', 50)
			.attr('height', 50);
		/*
		filter.append('feOffset')
			.attr('result', 'offOut')
			.attr('in', 'SourceGraphic')
			.attr('dx', 5)
			.attr('dy', 5);
			
		filter.append('feGaussianBlur')
			.attr('result', 'blurOut')
			.attr('in', 'offOut')
			.attr('stdDeviation', '5')
			*/
			
		filter.append('feGaussianBlur')
			.attr('result', 'blur')
			.attr('in', 'SourceAlpha')
			.attr('stdDeviation', '1.7')
			
		filter.append('feOffset')
			.attr('result', 'offsetBlur')
			.attr('in', 'blur')
			.attr('dx', 5)
			.attr('dy', 5);

		filter.append('feFlood')
		.attr('flood-color', '#ffff88')
		.attr('flood-opacity', '1')
		.attr('result', 'offsetColor')
		
		filter.append('feComposite')
		.attr('in', 'offsetColor')
		.attr('in2', 'offsetBlur')
		.attr('operator', 'in')
		.attr('result', 'offsetBlur')
			
		filter.append('feBlend')
			.attr('in', 'SourceGraphic')
			.attr('in2', 'blurOut')
			.attr('mode', 'normal');
	}
	
	function initSplash(){

		var firstn = 'EDSON';
		var lastn = 'ALMACHAR';
		
		upperRect = svg.append('rect')
			.attr('class', 'region_color1')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', '100%')
			.attr('height', '50%');
			
		lowerRect = svg.append('rect')
			.attr('class', 'region_color2')
			.attr('x', 0)
			.attr('y', '50%')
			.attr('width', '100%')
			.attr('height', '50%');

		firstng = svg.append('g');
		
		firstntxt = firstng.append('text')
			.attr('class', 'region_color2 splash_text')
			.attr('text-anchor', 'middle');
		
		for(var i = 0; i < firstn.length; i++){
			firstntxt.append('tspan')
				.text(firstn[i])
				.attr('alignment-baseline', 'baseline');
			firstntxt.append('tspan')
				.text(' ')
				.attr('alignment-baseline', 'baseline');
		}
		
		firstntxt.selectAll('tspan')
			.attr('dx', function(d, i){
				var dx;
				if(i % 2 == 0){
					dx = 0;
				}
				else{
					dx = -1 * txtSpace;
				}
				return dx + 'em';
			})
		
		lastng = svg.append('g');
		
		lastntxt = lastng.append('text')
			.attr('class', 'region_color1 splash_text splash_text-down')
			.attr('text-anchor', 'middle');
			
		for(var i = 0; i < lastn.length; i++){
			lastntxt.append('tspan')
				.text(lastn[i])
				.attr('alignment-baseline', 'baseline');
			lastntxt.append('tspan')
				.text(' ')
				.attr('alignment-baseline', 'baseline');
		}
		
		lastntxt.selectAll('tspan')
			.attr('dx', function(d, i){
				var dx;
				if(i % 2 == 0){
					dx = 0;
				}
				else{
					dx = -1 * txtSpace;
				}
				return dx + 'em';
			})
		
		githubg = svg.append('g')
		
		github = githubg.append('image')
			.attr('class', 'region_color1 linkicon')
			.attr('xlink:href', 'src/images/github.svg')
			.attr('width', mobile ? '10vw' : '30px')
			.attr('height', mobile ? '10vw' : '30px')
			.on('click', () => document.getElementById('githublink').click());
		
		
		linkeding = svg.append('g')
		
		linkedin = linkeding.append('image')
			.attr('class', 'region_color1 linkicon')
			.attr('xlink:href', 'src/images/linkedin.svg')
			.attr('width', mobile ? '10vw' : '30px')
			.attr('height', mobile ? '10vw' : '30px')
			.on('click', () => document.getElementById('linkedinlink').click());
	}

	
	function placeText(){

		firstntxt
			.attr('x', width/2)
			.attr('y', height/2);
			
		lastntxt
			.attr('data-x', width/2)
			.attr('data-y', mobile ? 9*height/10 : 9.7*height/10);
		
		if(width > height){

			if(!mobile){
				github
					.attr('x', width - 100)
					.attr('y', height/2 - 35);
					
				linkedin
					.attr('x', width - 60)
					.attr('y', height/2 - 35);

			}
			else{

				var length = $(github.node()).width();
				
				github
					.attr('x', width - length - length/3)
					.attr('y', height/2 - length - length/8);

				linkedin
					.attr('x', width - length - length/3)
					.attr('y', height/2 - 2*length - 2*length/8);
			}
		}
		else{

			if(!mobile){
				github
					.attr('x', width - 40)
					.attr('y', height/2 - 35*2);
					
				linkedin
					.attr('x', width - 40)
					.attr('y', height/2 - 35);

			}
			else{

				var length = $(github.node()).width();
				
				github
					.attr('x', width - length - length/3)
					.attr('y', height/2 - length - length/8);

				linkedin
					.attr('x', width - length - length/3)
					.attr('y', height/2 - 2*length - 2*length/8);
			}
		}
	}
	
	function wiggle(bassMod){
		var rand;
		lastntxt.selectAll('tspan')
			.attr('dy', function(d, i){
				if(i % 2 == 0){
					rand = (Math.random()-0.5)*0.03*bassMod;
				}
				else{
					rand = -rand;
				}
					
				return rand + 'em';
			});
	}
	
	function jump(bassMod){

		var scale = 1 + (Math.random()*0.08) * bassMod;

		var x = lastntxt.attr('data-x')/scale;
		var y = lastntxt.attr('data-y')/scale;
		
		lastntxt
			.attr('transform',
				'scale(' + scale + ')' +
				'rotate(7 ' + x + ' ' + y + ')' +
				'translate(' + x + ' ' + y + ')'
			);
	}
	
	function stretch(hatMod){
		lastntxt.selectAll('tspan')
			.attr('dx', function(d, i){
				var dx;
				if(i % 2 == 0){
					dx = 0;
				}
				else{
					dx = -1 * txtSpace / (1 + hatMod * .8);
				}
				return dx + 'em';
			})
	}
	
	this.tick = function(frequencies){
		var bassMod, hadMod;
		
		if(frequencies){

			var highBassFreqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			
			var highBassSum = highBassFreqs.reduce((a, b) => a + frequencies[b], 0);
			
			var highBassAverage = highBassSum/highBassFreqs.length;

			highBassMax = highBassAverage > highBassMax ? highBassAverage : highBassMax;
			highBassMin = highBassAverage < highBassMin ? highBassAverage : highBassMin;
			
			bassMod = highBassAverage/(highBassMax - highBassMin);
			
			bassMod = Math.pow(bassMod, 3);


			
			hatMod = frequencies[400];
			
			highHatMax = hatMod > highHatMax ? hatMod : highHatMax;
			highHatMin = hatMod < highHatMin ? hatMod : highHatMin;
			
			hatMod = hatMod/(highHatMax - highHatMin);
			
			hatMod = Math.pow(hatMod, 3);
			
		}
		else{
			bassMod = 0;
			hatMod = 0;
		}
		
		wiggle(willWiggle == true ? bassMod : 0);
		jump(willJump == true ? bassMod : 0);
		stretch(willStretch == true ? hatMod : 0);
	}
	
	this.setWiggle = function(setting){
		willWiggle = setting;
	}
	
	this.setJump = function(setting){
		willJump = setting;
	}
	
	this.setStretch = function(setting){
		willStretch = setting;
	}
	
	this.resize = function(hack){
		setDimensions();
		placeText();
	};
	
	
	(() => {
		setDimensions();
		initDefs();
		initSplash();
		placeText();
	})();
}

function bars(app){
	var parent = d3.select('#splash');
	
	var svg = parent.append('svg')
		.attr('width', '100%')
		.attr('height', '100%')
//		.style('display', 'none');
	
	var height, width;

	height = parseInt( parent.style('height') );
	width = parseInt( parent.style('width') );
	
	var x = d3.scaleLinear().rangeRound([0, width]),
		y = d3.scaleLinear().rangeRound([height, 0]);

	x.domain([0, 1024]);
	y.domain([0, 280]);
	
	var g = svg.append("g")
	
	var xaxis = svg.append('g')
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	
	this.tick = function(data){
		x.domain([0, data.length]);
		xaxis.call(d3.axisBottom(x));
//		console.log(data);
		g.selectAll(".bar")
		.data(data)
		.enter().append("rect")
			.attr("class", "bar");
			
		g.selectAll(".bar")
			.attr("x", function(d, i) { return x(i); })
			.attr("y", function(d) { return y(d); })
			.attr("width", width/data.length *0.8)
			.attr("height", function(d) { return height - y(d); });
	}
}

function rand(low, high){
	return Math.random() * (high - low) + low;
}

// https://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
function music(app){
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var ctx = new AudioContext();
	var audio = document.getElementById('myAudio');
		
	var audioSrc = ctx.createMediaElementSource(audio);
	var gainNode = ctx.createGain();
	var analyser = ctx.createAnalyser();
	
	audio.volume = 0.1;
	audioSrc.connect(gainNode);
	gainNode.connect(ctx.destination);


	
	// we have to connect the MediaElementSource with the analyser 
	audioSrc.connect(analyser);
	
	// we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

	// frequencyBinCount tells you how many values you'll receive from the analyser
	var frequencyData = new Uint8Array(analyser.frequencyBinCount);
	
	if(mobile){
		//analyser.fftSize = 256;
	}
	
	analyser.smoothingTimeConstant = .5;

	this.play = function(){
		audio.play();
	}
	
	this.pause = function(){
		audio.pause();
	}
	
	this.isPaused = function(){
		return audio.paused;
	}
	
	this.mute = function(){
		gainNode.gain.value = 0;
	}
	
	this.unmute = function(){
		gainNode.gain.value = 1;
	}
	
	this.getFrequencies = function(){
		if(audio.paused != true){
			analyser.getByteFrequencyData(frequencyData);

			return frequencyData;
		}
	}
}

function engine(app){
	var prev = 0;
	var a, b = 0;
	
	var average = [];
	
	var i = 1;
	var acc = 0;
	var average = [];
	var limiter = mobile ? 16.6 : 33.3;
	
	function animate(time){
		requestAnimationFrame(animate);

		time = isNaN(time) ? 0 : time;
		acc += time - prev;
		/*
		average.push(acc);
		while(average.length > 20){
			average.shift();
		}
		console.log(average.reduce((a,b)=>a+b)/average.length);
		*/
		if(acc > limiter){
			var freqs;
			if(!app._music.isPaused()){
				freqs = app._music.getFrequencies();
				//app._bars.tick(freqs);
			}
			else{
				freqs = false;
			}
			app._splash.tick(freqs);
			acc = 0;
		}

		prev = time;
	}
	
	this.begin = function(){
		animate();
	}
}

// http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
