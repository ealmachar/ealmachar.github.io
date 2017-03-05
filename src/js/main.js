



var gear1 = {
	gearNum: '1',
	radius: 30,
	innerRadius: 10,
	numSpokes: 6,
	spokeLength: 10,
	spokeWidthAngle: 15,
	spokeSlant: 15,
	startingAngle: 0
}

var gear2 = {
	gearNum: '2',
	radius: 40,
	innerRadius: 20,
	numSpokes: 7,
	spokeLength: 10,
	spokeWidthAngle: 15,
	spokeSlant: 15,
	startingAngle: 30
}

var gear3 = {
	gearNum: '3',
	radius: 50,
	innerRadius: 20,
	numSpokes: 12,
	spokeLength: 10,
	spokeWidthAngle: 9,
	spokeSlant: 5,
	startingAngle: 40
}

var gear4 = {
	gearNum: '4',
	radius: 15,
	innerRadius: 0,
	numSpokes: 5,
	spokeLength: 10,
	spokeWidthAngle: 20,
	spokeSlant: 5,
	startingAngle: 60
}

var gear5 = {
	gearNum: '5',
	radius: 400,
	innerRadius: 0,
	numSpokes: 10,
	spokeLength: 50,
	spokeWidthAngle: 10,
	spokeSlant: 15,
	startingAngle: 15
}

// keep track of three wires in center to animate them
var wires = {};

// store strokedashoffsets of wires in center
var strokeDashoffsets = {};

var background = $('#d1back');

function init(){
	$('.project').mouseenter(function(){
		$(this).addClass('show');
		$(this).find('.projectText').addClass('show');
	})
	.mouseleave(function(){
		$(this).removeClass('show');
		$(this).find('.projectText').removeClass('show');
	});
	
	$('.project').mouseenter(function(){
		$(this).find('path').each(function(){
			this.style.strokeDashoffset = '0';
		});
	});

	$('.project').mouseleave(function(){
		$(this).find('path').each(function(){
			var num = $(this).attr('class').charAt(5);
			this.style.strokeDashoffset = strokeDashoffsets['w' + num];
		});
	});

	makeGear(gear1);
	makeGear(gear2);
	makeGear(gear3);
	makeGear(gear4);
	makeGear(gear5);

	makeProjectWire('1');
	makeProjectWire('2');
	makeProjectWire('3');
	makeProjectWire('4');

	makeBackground();

	makeWire('1', true);
	makeWire('2', true);
	makeWire('3', true);

	animate();
}



function animate(){
	for(var wire in wires){
		if(wire == 'wire2'){
			wires[wire].progress -= 1;
			wires[wire].progress = wires[wire].progress < -wires[wire].length ? wires[wire].length : wires[wire].progress;
			wires[wire].obj.style.strokeDashoffset = wires[wire].progress;
		}
		else if(wire == 'wire3'){
			wires[wire].progress += toRads(2);
			wires[wire].progress %= Math.PI*2;
			wires[wire].obj.style.strokeDashoffset = Math.sin(wires[wire].progress) * wires[wire].length;
		}
	}
	requestAnimationFrame(animate);
}


function makeGear(properties){
	
	var gearNum = properties.gearNum || null;
	var radius = properties.radius || 40;
	var innerRadius = properties.innerRadius || 20;
	var numSpokes = properties.numSpokes || 7;
	var spokeLength = properties.spokeLength || 10;
	var spokeWidthAngle = properties.spokeWidthAngle || 15;
	var spokeSlant = properties.spokeSlant || 15;
	var startingAngle = properties.startingAngle || 0;
	
	
	if(gearNum == null)
		return
	
	var fill = 'white';//'rgba(183, 65, 14, .3)';

	var centerx = parseInt($('#knob' + gearNum).css('width')) / 2;
	var centery = parseInt($('#knob' + gearNum).css('height')) / 2;

	var angle = toRads(startingAngle);

	spokeWidthAngle = toRads(spokeWidthAngle);
	spokeSlant = toRads(spokeSlant);
	
	

	var angleBetweenSpokes = toRads(360) / numSpokes;

	var spoke1startx, spoke1starty, spoke1endx, spoke1endy;
	var spoke2startx, spoke2starty, spoke2endx, spoke2endy;

	var m, l1, as1, l2, ag1;

	var d = '';


	spoke1startx = centerx + Math.cos(angle - spokeWidthAngle) * radius;
	spoke1starty = centery + Math.sin(angle - spokeWidthAngle) * radius;


	m = 'M ' + spoke1startx + ' ' + spoke1starty;
	d += m;


	for(var i = 0; i < numSpokes; i++){
		
		spoke1endx = spoke1startx + Math.cos(spokeSlant + angle) * spokeLength;
		spoke1endy = spoke1starty + Math.sin(spokeSlant + angle) * spokeLength;

		spoke2startx = centerx + Math.cos(angle + spokeWidthAngle) * radius;
		spoke2starty = centery + Math.sin(angle + spokeWidthAngle) * radius;

		spoke2endx = spoke2startx + Math.cos(-spokeSlant + angle) * spokeLength;
		spoke2endy = spoke2starty + Math.sin(-spokeSlant + angle) * spokeLength;


		l1 = ' L ' + spoke1endx + ' ' + spoke1endy;

		as1 = ' A ' + radius + ' ' + radius + ' ' + ' 0 0 1 ' + spoke2endx + ' ' + spoke2endy;

		l2 = ' L ' + spoke2startx + ' ' + spoke2starty;

		angle += angleBetweenSpokes;
		
		spoke1startx = centerx + Math.cos(angle - spokeWidthAngle) * radius;
		spoke1starty = centery + Math.sin(angle - spokeWidthAngle) * radius;

		ag1 = ' A ' + radius + ' ' + radius + ' ' + ' 0 0 1 ' + spoke1startx + ' ' + spoke1starty;

		
		d += l1 + as1 + l2;
		d += ag1	
	}

	$('#spoke' + gearNum).attr({d: d, fill: fill});

	if(innerRadius > 0){
		var innercircle = $('#circle' + gearNum)
		innercircle.attr('r', innerRadius);
		innercircle.attr('cx', centerx);
		innercircle.attr('cy', centery);
	}
}




function makeWire(wireNum, init){

	if(!wireNum)
		return;
	
	var y, x;
	var height;
	
	var d, m, l1, l2;
	
	var arcRadius = 20;
	
	
	
	var x2 = parseInt($('#wire' + wireNum).parent().css('width')) /15 + 10;
	
	height = parseInt($('#wire' + wireNum).parent().css('height'))/2.5;
	
	if(wireNum == '1'){
		y = 40;
		x = parseInt($('#wire' + wireNum).parent().css('width')) * (1 - 1/5);

		height += 20;
		
		d = '';

		m = 'M ' + x + ' ' + y;
		
		l1 = ' L ' + x2 + ' ' + y;
		
		a = ' a ' + arcRadius + ' ' + arcRadius + ' 0 0 0 ' + -arcRadius + ' ' + arcRadius;
		
		l2 = ' l ' + 0 + ' ' + height;
		
		d = m + l1 + a + l2;
	}
	else if(wireNum == '2'){
		y = 80;
		
		height += 20;
		x2 += -15;

		d = '';

		m = 'M ' + x2 + ' ' + y;
		
		l2 = ' l ' + 0 + ' ' + height;
		
		d = m + l2;
	}
	else if(wireNum == '3'){
		y = 60;
		
		height += 0;
		x2 += -25;

		d = '';

		m = 'M ' + x2 + ' ' + y;
		
		l2 = ' l ' + 0 + ' ' + height;
		
		d = m + l2;
	}
	
	$('#wire' + wireNum).attr('d', d);
	
	if(wireNum != '1' && init){
		var obj = $('#wire' + wireNum).get(0);

		var length;
		var key = 'wire' + wireNum;

		length = obj.getTotalLength();

		if(wireNum == '2')
			length *= .8;
		else if(wireNum == '3')
			length *= .2;
		
		obj.style.strokeDasharray = length + ' ' + length;
		obj.style.strokeDashoffset = length;
		
		wires[key] = {};
		wires[key].length = length;
		wires[key].obj = obj;
		
		if(wireNum == '1')
			wires[key].progress = length;
		else
			wires[key].progress = 0;


		obj.getBoundingClientRect();
	}
}






function makeBackground(){
	var path;

	var numPaths = 50;
	
	var parent = $('#d1back');
	
	var width = parseInt(parent.css('width'));
	var height = parseInt(parent.css('height'));

	var lineHeight;
	
	var lineColor = 'grey';
	var backgroundColor = parent.css('backgroundColor') || 'white';
	var lineWidth = 2;
	
	var step = width / (numPaths+1);

	var cpu1x, cpu1y, cpu1width, cpu1height;
	var cpu2x, cpu2y, cpu2width, cpu2height;
	var bar1x, bar1y, bar1width, bar1height;
	var bar2x, bar2y, bar2width, bar2height;
	
	var cpuwidth = Math.min(width*.15, 180);
	
	// bottom left square
	cpu1width = cpu1height = cpuwidth;
	cpu1x = cpu1width*.5;
	cpu1y = height - 300;
	
	// upper right square
	cpu2width = cpu2height = cpuwidth;
	cpu2x = width - cpu2width - cpu2width*.3;
	cpu2y = 100;
	
	// bottom right bar
	bar1width = cpu1width*3;
	bar1height = 25;
	bar1x = width/2;
	bar1y = height - bar1height*2;
	
	// upper middle bar
	bar2width = (cpu2x - cpu2width) - (cpu1x + cpu1width);
	bar2height = 25;
	bar2x = cpu1x + cpu1width;
	bar2y = bar2height*2.5;
	
	var xAngle = Math.cos(toRads(45));
	var yAngle = Math.sin(toRads(45));
	
	var svg = '';
	var d, m, l, l2;
	
	var toggle1 = toggle2 = toggle3 = true;
	
	svg += '<svg id="d1backsvg">';
	
	var i = i2 = i3 = i4 = i5 = i6 = i7 = 0;
	
	for(; step*(i + 1) < cpu2x + cpu2width; i++){
	
		d = '';
		l = '';
		
		// wires left of cpu1
		if(step*(i + 1) < cpu1x){
			m = 'M ' + step*(i + 1) + ' ' + 0;
			
			lineHeight = height * 0.3 + step*(i + 1);
			l = ' l ' + 0 + ' ' + lineHeight;
			
			l += ' l ' + -lineHeight + ' ' + lineHeight;
		}
		
		// wires within cpu1's width
		else if(step*(i + 1) > cpu1x && step*(i + 1) < (cpu1x + cpu1width)){
			if(toggle3){
				for(var h = i, j = 0; step*(h + 1) < (cpu1x + cpu1width); h++, j++);
				i6 = cpu1x + cpu1width/2 - (((j-1)/2)*step/2);
				i7 = j - 1;
				toggle3 = false;

			}

			m = 'M ' + (i6 + (step/2)*i7) + ' ' + 0;
			i7--;
			
			l = ' l ' + 0 + ' ' + height;
		}
		
		//wires in between cpu1 and cpu2
		else if(step*(i + 1) > (cpu1x + cpu1width) && step*(i + 1) < cpu2x){
			
			// wires within the top bar's width
			if(step*(i + 1) > bar2x && step*(i + 1) < (bar2x + bar2width)){
				m = 'M ' + step*(i + 1) + ' ' + bar2y;
				l = ' l ' + 0 + ' ' + (-bar2y*3);
			}
			
			// wires between top bar and cpu2 (feeding into cpu2's left side)
			else if(step*(i + 1) > (cpu2x - cpu2width)){
				
				if(toggle2){
					for(var h = i, j = 0; step*(h + 1) < cpu2x; h++, j++);
					i4 = step*(i+1) + cpu2width/5;
					i2 = j-1;
					lineHeight = cpu2y + cpu2height/2 - (((j-1)/2)*step/2);
					toggle2 = false;
				}
				i5++;
				m = 'M ' + (i4 + step/2 * i5) + ' ' + 0;

				l = ' l ' + 0 + ' ' + (lineHeight + (step/2)*i2);
				i2--;
				l += ' l ' + (i4 + step/2 * i5) + ' ' + 0;

			}
		}
		
		// wires within cpu2's width
		else if(step*(i + 1) > cpu2x){
			if(toggle1){
				for(var h = i, j = 0; step*(h + 1) < cpu2x + cpu2width; h++, j++);
				i2 = cpu2x + cpu2width/2 - (((j-1)/2)*step/2);
				i3 = j - 1;
				toggle1 = false;
			}
			
			m = 'M ' + (i2 + (step/2)*i3)  + ' ' + 0;
			i3--;
			
			l = ' l ' + 0 + ' ' + (cpu2y + cpu2height*2 + (step/2)*i3);
			l += ' L ' + (bar1x + bar1width - step*(j-i3)) + ' ' + (cpu2y + cpu2height*2 + (step/2)*i3);
			l += ' L ' + (bar1x + bar1width - step*(j-i3)) + ' ' + bar1y;
		}
		
		
	
		d += m + l;
	
		svg += '<path id="backwirex' + i + '" d="' + d + '" fill="none" stroke="' + lineColor + '" stroke-width="' + lineWidth + '"></path>';
	}
	
	i2 = 0;
	toggle = true;
	var numypaths = 0;
	
	// wires going horizontal through cpu1
	for(var i = 0; step*(i + 1) < cpu1height; i++){
		
		d = '';
		
		if(toggle){
			
			for(var j = 0; step*(j + 1) < cpu1height; j++);
			i3 = cpu1y + cpu1height/2 - (((j-1)/2)*step/2);
			i2 = j -1;
			toggle = false
		}
		

		
		m = 'M ' + 0 + ' ' + (i3 + (step/2)*i2);
		i2--;
		
		l = ' l ' + (bar1x + step*(i + 1)) + ' ' + 0;
		
		l2 = ' L ' + (bar1x + step*(i + 1)) + ' ' + bar1y;
		
		d += m + l + l2;
		
		svg += '<path id="backwirey' + i + '" d="' + d + '" fill="none" stroke="' + lineColor + '" stroke-width="' + lineWidth + '"></path>';
		numypaths++;
	}
	

	var start, duration;
	for(i = 0; i < numPaths; i += 3){
		
		start = Math.random()*3 + 1;
		duration = Math.random()*10 + 5;
		
		svg += '<circle id="circlex' + i + '" r="5" cx="0" cy="0" fill="' + lineColor + '" />'

		svg += '<animateMotion ' +
			   'xlink:href="#circlex' + i + '"' +
			   'dur="' + duration + 's"' +
			   'begin="' + start + 's"' +
			   'fill="freeze"' +
			   'repeatCount="indefinite">' +
		'<mpath xlink:href="#backwirex' + i + '" />' +
		'</animateMotion>' 
	}
	
	for(i = 0; i < numypaths; i += 3){
		
		start = Math.random()*3 + 1;
		duration = Math.random()*10 + 5;

		svg += '<circle id="circley' + i + '" r="5" cx="0" cy="0" fill="' + lineColor + '" />'

		svg += '<animateMotion ' +
			   'xlink:href="#circley' + i + '"' +
			   'dur="' + duration + 's"' +
			   'begin="' + start + 's"' +
			   'fill="freeze"' +
			   'repeatCount="indefinite">' +
		'<mpath xlink:href="#backwirey' + i + '" />' +
		'</animateMotion>' 
	}
	
	svg += '<rect x="' + cpu1x + '" y="' + cpu1y + '" width="' + cpu1width + '" height="' + cpu1height + '"' +
		' fill="' + backgroundColor + '" stroke-width="' + lineWidth + '" stroke="' + lineColor + '" />'
	
	svg += '<rect x="' + cpu2x + '" y="' + cpu2y + '" width="' + cpu2width + '" height="' + cpu2height + '"' +
		' fill="' + backgroundColor + '" stroke-width="' + lineWidth + '" stroke="' + lineColor + '" />'
	
	svg += '<rect x="' + bar1x + '" y="' + bar1y + '" width="' + bar1width + '" height="' + bar1height + '"' +
		' fill="' + backgroundColor + '" stroke-width="' + lineWidth + '" stroke="' + lineColor + '" />'
	
	svg += '<rect x="' + bar2x + '" y="' + bar2y + '" width="' + bar2width + '" height="' + bar2height + '"' +
		' fill="' + backgroundColor + '" stroke-width="' + lineWidth + '" stroke="' + lineColor + '" />'

	svg += '</svg>'
	
	parent.empty();
	parent.append(svg);
}



// wires that "cling" onto the project image links
function makeProjectWire(wireNum){
	
	if(wireNum == null)
		return;
	
	var m, d, l1;
	
	var width = parseInt($('.pwire' + wireNum).parent().css('width'));
	var height = parseInt($('.pwire' + wireNum).parent().css('height'));
	
	var leftPadding, topOffset, topLineLength, up, curve, slantLineOffset;
	
	if(wireNum == '1'){
		leftPadding = 70;
		slantLineOffset = 20;
		topOffset = 0;
		topLineLength = -width/2.5;
		up = 1;
		curve = [1, 0, 0];
	}
	else if(wireNum == '2'){
		leftPadding = 90;
		slantLineOffset = 20;
		topOffset = -10;
		topLineLength = -width/6;
		up = 1;
		curve = [1, 0, 0];
	}
	else if(wireNum == '3'){
		leftPadding = 80;
		slantLineOffset = 30;
		topOffset = 10;
		topLineLength = -width/2.5;
		up = -1;
		curve = [0, 1, 1];
	}
	else if(wireNum == '4'){
		leftPadding = 90;
		slantLineOffset = 30;
		topOffset = 20;
		topLineLength = -width/5;
		up = -1;
		curve = [0, 1, 1];
	}

	var radius = 10;
	
	var arcEndOffsetx = Math.cos(toRads(-30)) * radius;
	var arcEndOffsety = Math.sin(toRads(-30)) * radius;
	
	var slantLineLength = (height/2) - slantLineOffset;
	var lineSlantx = Math.cos(toRads(60)) * slantLineLength;
	var lineSlanty = Math.sin(toRads(60)) * slantLineLength;
	

	
	d = '';
	
	m = 'M ' + width + ' ' + (height/2 + topOffset);
	
	l1 = ' l ' + (-width/2 + leftPadding) + ' ' + 0;
	
	a1 = ' a ' + radius + ' ' + radius + ' 0 0 ' + curve[0] + ' ' + -arcEndOffsetx + ' ' + (-arcEndOffsety - radius) * up;
	
	l2 = ' l ' + -lineSlantx + ' ' + -lineSlanty * up;
	
	a2 = ' a ' + radius + ' ' + radius + ' 0 0 ' + curve[1] + ' ' + -arcEndOffsetx + ' ' + (-arcEndOffsety - radius) * up;
	
	l3 = ' l ' + topLineLength + ' ' + 0;
	
	a3 = ' a ' + radius + ' ' + radius + ' 0 0 ' + curve[2] + ' ' + -arcEndOffsetx + ' ' + (arcEndOffsety + radius) * up;
	
	l4 = ' l ' + -lineSlantx*.4 + ' ' + lineSlanty*.4 * up;
	
	d += m + l1 + a1 + l2 + a2 + l3 + a3 + l4;

	$('.pwire' + wireNum).attr('d', d).each(function(i){
		var length;
		var key = 'w' + wireNum;
		
		length = this.getTotalLength();

		this.style.strokeDasharray = length + ' ' + length;
		this.style.strokeDashoffset = length;
		
		if(i == 0){
			strokeDashoffsets[key] = length;
		}

		this.getBoundingClientRect();

		this.style.transition = 'stroke-dashoffset 0.25s linear';
	});
}





window.onresize = function(){

	makeWire('1', false);
	makeWire('2', false);
	makeWire('3', false);
	
	makeBackground();
}



window.onscroll = function(){
	//background.css('transform', 'translateY(' + document.body.scrollTop*.8 + 'px)');
}


function toRads(num){
	return num * Math.PI / 180;
}


init();

