

var app = new _app;

function _app(){
	this._engine = new engine(this);
	this._splash = new splash(this);

	
	var events = () => {
		$(window).resize(() => {
			this._splash.resize();
		})
	}
	
	this.onload = () => {
		events();
		
		this._engine.begin();
	};
	
	this.onload();
}

function splash(app){
	var parent = d3.select('#splash');
	
	var svg = parent.append('svg')
		.attr('width', '100%')
		.attr('height', '100%');
	
	var height, width;
	
	var top = [], bot = [];
	
	var left, midleft, midright, right;
	var nameg, titleg, nametxt, titletxt;
	var github, linkedin;
	var region = 0;
	
	function setDimensions(hack){

		height = parseInt( parent.style('height') );
		width = parseInt( parent.style('width') );
		
		top[0] = width * .07;
		top[1] = width * .1;
		top[2] = width * .25;
		
		bot[0] = width * .75;
		bot[1] = width * .9;
		bot[2] = width * .93;
	}
	
	function initDefs(){
		svg.append('defs')
			.append('filter')
			.attr('id', 'feoffset')
			.attr('width', 50)
			.attr('height', 50)
			.append('feOffset')
			.attr('in', 'SourceGraphic')
	}
	
	function initSplash(){
		var name = 'Edson_Almachar';
		var title = 'Frontend_Web_Developer';
		
		left = svg.append('path')
			.attr('class', 'region_color1')
			.on('mouseenter', select1)
			.on('mouseleave', selectnone);
		
		midleft = svg.append('path')
			.attr('class', 'region_color2')
			.on('mouseenter', select1)
			.on('mouseleave', selectnone);
		
		midright = svg.append('path')
			.attr('class', 'region_color1')
			.on('mouseenter', select2)
			.on('mouseleave', selectnone);
		
		right = svg.append('path')
			.attr('class', 'region_color2')
			.on('mouseenter', select2)
			.on('mouseleave', selectnone);
			
		nameg = svg.append('g');
		
		nametxt = nameg.append('text')
			.attr('class', 'region_color1')
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('font-family', 'Rubik Mono One')
			.style('pointer-events', 'none');
		
		for(var i = 0; i < name.length; i++){
			nametxt.append('tspan')
				.text(name[i]);
			nametxt.append('tspan')
				.text(' ');
		}
		
		nametxt.selectAll('tspan')
			.attr('dx', function(d, i){
				var dx;
				if(i % 2 == 0){
					dx = 0;
				}
				else{
					dx = -1*.8;
				}
				return dx + 'em';
			})
		
		titleg = svg.append('g');
		
		titletxt = titleg.append('text')
			.attr('class', 'region_color2')
			.attr('text-anchor', 'middle')
			.style('font-size', '24px')
			.style('font-family', 'Rubik Mono One')
			.style('pointer-events', 'none');
			
		for(var i = 0; i < title.length; i++){
			titletxt.append('tspan')
				.text(title[i]);
			titletxt.append('tspan')
				.text(' ');

		}
		
		titletxt.selectAll('tspan')
			.attr('dx', function(d, i){
				var dx;
				if(i % 2 == 0){
					dx = 0;
				}
				else{
					dx = -1*.8;
				}
				return dx + 'em';
			})
		
		githubg = svg.append('g')
		
		github = githubg.append('image')
			.attr('class', 'region_color1')
			.attr('xlink:href', 'src/images/github.svg')
			.attr('width', 30)
			.attr('height', 30)
			.on('click', () => document.getElementById('githublink').click())
			.style('cursor', 'pointer');
		
		
		linkeding = svg.append('g')
		
		linkedin = linkeding.append('image')
			.attr('class', 'region_color1')
			.attr('xlink:href', 'src/images/linkedin.svg')
			.attr('width', 30)
			.attr('height', 30)
			.on('click', () => document.getElementById('linkedinlink').click())
			.style('cursor', 'pointer');
	}
	
	function drawLines(){
		
		left.attr('d', () => {
			return 'M' + 0 + ' ' + 0 +
				'L' + 0 + ' ' + height +
				'L' + bot[0] + ' ' + height +
				'L' + top[0] + ' ' + 0;
		})
		midleft.attr('d', () => {
			return 'M' + top[0] + ' ' + 0 +
				'L' + bot[0] + ' ' + height +
				'L' + bot[1] + ' ' + height +
				'L' + top[1] + ' ' + 0;
		})
		
		midright.attr('d', () => {
			return 'M' + top[1] + ' ' + 0 +
				'L' + bot[1] + ' ' + height +
				'L' + bot[2] + ' ' + height +
				'L' + top[2] + ' ' + 0
		})
		
		right.attr('d', () => {
			return 'M' + top[2] + ' ' + 0 +
				'L' + bot[2] + ' ' + height +
				'L' + width + ' ' + height +
				'L' + width + ' ' + 0
		})
	}
	
	function placetext(){
		var nameangle = Math.atan2(height, bot[2] - top[2]) * 180 / Math.PI;
		var titleangle = Math.atan2(height, bot[0] - top[0]) * 180 / Math.PI;
		var namex = (bot[2]-top[2])/2 + top[2] + 10;
		var namey = height/2;
		
		var titlex = (bot[0]-top[0])/2 + top[0];// - 35;
		var titley = height/2;
		
		var gitx = (bot[2]-top[2])*3/4 + top[2];
		var gity = height*3/4;
		
		nametxt
			.attr('x', namex)
			.attr('y', namey);
			
		titletxt
			.attr('x', titlex)
			.attr('y', titley);
			
		nameg
			.attr('transform', 'rotate(' + nameangle + ' ' + namex + ',' + namey + ')');
			
		titleg
			.attr('transform', 'rotate(' + titleangle + ' ' + titlex + ',' + titley + ') translate(0, 25)');
		
		github
			.attr('x', gitx)
			.attr('y', gity - 35);
		
		github
			.attr('transform', 'rotate(' + nameangle + ' ' + gitx + ',' + gity + ')')
			.attr('data-transform', 'rotate(' + nameangle + ' ' + gitx + ',' + gity + ')');
			
		linkedin
			.attr('x', gitx + 40)
			.attr('y', gity - 35);
			
		linkedin
			.attr('transform', 'rotate(' + nameangle + ' ' + gitx + ',' + gity + ')')
			.attr('data-transform', 'rotate(' + nameangle + ' ' + gitx + ',' + gity + ')');
	}

	
	function select1(){
		region = 1;
	}
	
	function select2(){
		region = 2;
	}
	
	function selectnone(){
		if(region == 1){
			resettxt(titletxt);
		}
		else if(region == 2){
			resettxt(nametxt);
			reseticons();
		}
		region = 0;
	}
	
	function wiggle(text, region){
		var rand;
		text.selectAll('tspan')
			.attr('dy', function(d, i){
				if(i % 2 == 0){
					rand = Math.random()*0.5;
					if(region == 2)
						rand *= -1;
				}
				else{
					rand = -rand;
				}
					
				return rand + 'em';
			});
	}
	
	function wiggleicons(){
		var githuboffset = Math.random()*5;
		var linkedinoffset = Math.random()*5;
		
		github
			.attr('transform', github.attr('data-transform') + 'translate(0 ' + -githuboffset + ')');
			
		linkedin
			.attr('transform', linkedin.attr('data-transform') + 'translate(0 ' + -linkedinoffset + ')');
	}
	
	function resettxt(text){
		text.selectAll('tspan')
			.attr('dy', 0);
	}
	
	function reseticons(){
		github
			.attr('transform', github.attr('data-transform'));
			
		linkedin
			.attr('transform', linkedin.attr('data-transform'));
	}
	
	this.tick = function(){
		if(region == 1){
			wiggle(titletxt, 1);
		}
		else if(region == 2){
			wiggle(nametxt, 2);
			wiggleicons();
		}
	}
	
	this.resize = function(hack){
		setDimensions();
		drawLines();
		placetext();
	};
	
	
	(() => {
		setDimensions();
		initDefs();
		initSplash();
		drawLines();
		placetext();
	})();
}

function rand(low, high){
	return Math.random() * (high - low) + low;
}

function engine(app){
	var prev = 0;
	var a, b = 0;
	
	var average = [];
	
	var i = 1;
	var acc = 0;
	
	function animate(time){
		requestAnimationFrame(animate);

		time = isNaN(time) ? 0 : time;
		acc += time - prev;

		if(acc > 60){
			app._splash.tick(time - prev);
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
};
