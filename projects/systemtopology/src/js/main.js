// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !this.isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

(function topology(){
	var svg = d3.select('svg')
		.attr('width', 1920)
		.attr('height', 1200);
		
	var svgPaths;
	
	var components = {};
	var paths = {};
	var pathIndex = 0;
	
	var target = null;
	var targetClass = null;
	var targetx = targety = null;
	
	var color = 255;
	var color2 = 220;
	
	var buttonSrokeWidth = 2.5;
	var buttonRadius = 13;


	// shadows behind components
	function filters(){
		var filter = svg.append('defs')
		.append('filter')
			.attr('id', 'filter1')
			.attr('width', '200%')
			.attr('height', '200%');
		
		filter.append('feOffset')
			.attr('result', 'offOut')
			.attr('in', 'SourceAlpha')
			.attr('dx', 2)
			.attr('dy', 2);
		
		filter.append('feGaussianBlur')
			.attr('result', 'blurOut')
			.attr('in', 'offOut')
			.attr('stdDeviation', 3);
		
		filter.append('feBlend')
			.attr('in', 'SourceGraphic')
			.attr('in2', 'blurOut')
			.attr('mode', 'normal');

	}
	
	
	
	function createRoundComponent(x, y, label, imagePath){
		var radius = 80;
		var topPadding = 5;
		var leftPadding = 10 + buttonRadius;
		var id = 'component' + Object.keys(components).length;
		
		var g = svg.append('svg')
			.attr('id', id)
			.attr('x', x)
			.attr('y', y);
			
		g.append('circle')
			.attr('class', 'circleComponent')
			.attr('r', radius)
			.attr('cx', radius + leftPadding)
			.attr('cy', radius + topPadding)
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)')
			.attr('filter', 'url(#filter1)');
		
		g.append('circle')
			.attr('class', 'circle')
			.attr('id', id + '_circlel' + 1)
			.attr('cx', 0 + leftPadding)
			.attr('cy', radius + topPadding)
			.attr('r', buttonRadius)
			.style('stroke-width', buttonSrokeWidth)
			.style('stroke', 'rgba(' + color2 + ', ' + color2 + ', ' + color2 + ', 1)')
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');
			
		g.append('circle')
			.attr('class', 'circle')
			.attr('id', id + '_circler' + 1)
			.attr('cx', radius*2 + leftPadding)
			.attr('cy', radius + topPadding)
			.attr('r', buttonRadius)
			.style('stroke-width', buttonSrokeWidth)
			.style('stroke', 'rgba(' + color2 + ', ' + color2 + ', ' + color2 + ', 1)')
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');
		
		
			
			
		var text1 = g.append('text')
			.attr('x', radius + leftPadding)
			.attr('y', radius + topPadding + 20)
			.attr('font-family', '\'Roboto\', Verdana')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'middle')
			.style('pointer-events', 'none');
		
		var text2;
		var labelArray;
		var line1, line2;
		var left, right;
		var end = false;
		var spaceAt;
		
		// text wrap for 2 lines
		if(label.length >= 14){
			labelArray = label.split(' ');
			if(labelArray.length > 1){
				
				text2 = g.append('text')
						.attr('x', radius + leftPadding)
						.attr('y', radius + topPadding + 20)
						.attr('font-family', '\'Roboto\', Verdana')
						.attr('font-weight', 'bold')
						.attr('text-anchor', 'middle')
						.style('pointer-events', 'none')
						.style('transform', 'translate(0, 1.2em)');
				
				if(labelArray.length == 2){
					text1.text(labelArray[0]);
					text2.text(labelArray[1]);
					
				}
				else{
					line1 = '';
					line2 = '';
					
					for(var i = Math.round(label.length/2); !end; i--){
						left = label.charAt(i - 1);
						right = label.charAt(i + 1);
						
						
						if(left == '' || right == ''){
							end = true;
						}
						else if(left == ' '){
							spaceAt = i - 1;
							end = true;
						}
						else if(right == ' '){
							spaceAt = i + 1;
							end = true;
						}

					}
					
					labelArray.forEach(function(str){
						if(line1.length < spaceAt){
							line1 += ' ' + str;
						}
						else{
							line2 += ' ' + str;
						}
					});
					
					text1.text(line1);
					text2.text(line2);
				}
			}
			else{
				text1.text(label);
			}
		}
		else{
			text1.text(label);
		}

			
			
			
		g.append('image')
//			.attr('class', 'circleComponent')
			.attr('x', radius/1.1)
			.attr('y', radius/4)
//			.attr('x', radius*1.3)
//			.attr('y', radius/1.5)
			.attr('height', radius*.8)
			.attr('width', radius*.8)
//			.style('transform', 'translate(-' + 50 +'%, -' + 50 + '%)')
			.style('pointer-events', 'none')
			.attr('xlink:href', imagePath)
		
		components[id] = {
			g: g,
			paths: {}
		};
	}
	
	function createRectComponent(x, y, label){
		var width = 200;
		var height = 120;
		var rectOffset = 5;
		var id = 'component' + Object.keys(components).length;
		var topPadding = 5;
		var leftPadding = buttonRadius + buttonSrokeWidth;


		
		
		
		var g = svg.append('svg')
			.attr('id', id)
			.attr('x', x)
			.attr('y', y);

		g.append('rect')
			.attr('class', 'rect')
			.attr('x', 2*rectOffset + leftPadding)
			.attr('y', 2*rectOffset + topPadding)
			.attr('width', width)
			.attr('height', height)
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)')
			.attr('filter', 'url(#filter1)');
			
		g.append('rect')
			.attr('class', 'rect')
			.attr('x', 1*rectOffset + leftPadding)
			.attr('y', 1*rectOffset + topPadding)
			.attr('width', width)
			.attr('height', height)
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)')
			.attr('filter', 'url(#filter1)');

		g.append('rect')
			.attr('class', 'rect')
			.attr('x', 0 + leftPadding)
			.attr('y', 0 + topPadding)
			.attr('width', width)
			.attr('height', height)
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)')
			.attr('filter', 'url(#filter1)');
			
		g.append('rect')
			.attr('class', 'rect')
			.attr('x', 0 + leftPadding)
			.attr('y', 0 + topPadding)
			.attr('width', width)
			.attr('height', 5)
			.style('fill', 'rgba(' + 0 + ', ' + 200 + ', ' + 0 + ', 1)');
			
		g.append('circle')
			.attr('class', 'circle')
			.attr('id', id + '_circlel' + 1)
			.attr('cx', 0 + leftPadding)
			.attr('cy', height/2 + topPadding)
			.attr('r', buttonRadius)
			.style('stroke-width', buttonSrokeWidth)
			.style('stroke', 'rgba(' + color2 + ', ' + color2 + ', ' + color2 + ', 1)')
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');

		g.append('circle')
			.attr('class', 'circle')
			.attr('id', id + '_circler' + 1)
			.attr('cx', width + leftPadding)
			.attr('cy', height*(1/4) + topPadding)
			.attr('r', buttonRadius)
			.style('stroke-width', buttonSrokeWidth)
			.style('stroke', 'rgba(' + color2 + ', ' + color2 + ', ' + color2 + ', 1)')
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');
		
		g.append('text')
			.attr('x',  width + leftPadding)
			.attr('y', height*(1/4) + topPadding + 4)
			.attr('font-family', '\'Roboto\', Verdana')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'middle')
			.attr('font-size', '14')
			.style('pointer-events', 'none')
			.text('H');
		
		g.append('circle')
			.attr('class', 'circle')
			.attr('id', id + '_circler' + 2)
			.attr('cx', width + leftPadding)
			.attr('cy', height*(3/4) + topPadding)
			.attr('r', buttonRadius)
			.style('stroke-width', buttonSrokeWidth)
			.style('stroke', 'rgba(' + color2 + ', ' + color2 + ', ' + color2 + ', 1)')
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');
			
		g.append('text')
			.attr('x',  width + leftPadding)
			.attr('y', height*(3/4) + topPadding + 4)
			.attr('font-family', '\'Roboto\', Verdana')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'middle')
			.attr('font-size', '14')
			.attr('fill', 'rgba(' + 200 + ', ' + 0 + ', ' + 0 + ', 1)')
			.style('pointer-events', 'none')
			.text('E');
		
		var gear = {
			radius: 15,
			innerRadius: 25,
			numSpokes: 6,
			spokeLength: 6,
			spokeWidthAngle: 22,
			spokeSlant: 10,
			startingAngle: 30,
			width: width + leftPadding*2,
			height: height + topPadding*2 - 40
		}
		
		g.append('path')
			.attr('class', 'gear')
			.style('fill', 'rgba(' + 0 + ', ' + 200 + ', ' + 0 + ', 1)')
			.attr('d', makeGear(gear));
		
		g.append('circle')
			.attr('class', 'gear')
			.attr('cx', gear.width / 2)
			.attr('cy', gear.height / 2)
			.attr('r', 7)
			.style('fill', 'rgba(' + color + ', ' + color + ', ' + color + ', 1)');
			
		g.append('text')
			.attr('x', (width + leftPadding*2) / 2)
			.attr('y', (height + topPadding*2) / 2 + height/4)
			.attr('font-family', '\'Roboto\', Verdana')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'middle')
			.style('pointer-events', 'none')
			.text(label);
		
		components[id] = {
			g: g,
			paths: {}
		};
	}
	
	function createPath(start){

		var x = parseInt(start.attr('cx')) + parseInt(start.parent().attr('x'));
		var y = parseInt(start.attr('cy')) + parseInt(start.parent().attr('y'));

		id = 'path' + pathIndex;
		
		var path = svgPaths.append('path')
			.attr('id', id)
			.attr('class', 'path')
			.attr('stroke', 'rgba(200, 200, 200 , 1)')
			.attr('stroke-width', 7)
			.attr('fill', 'none')
			.style('pointer-events', 'none');

		var currentPath = {
			id: id,
			path: path,
			from: start,
			to: 'cursor'
		};

		paths[id] = currentPath;
		
		var component = start.parent().attr('id');

		components[component].paths[id] = currentPath;
		
		pathIndex++;
		
		return currentPath;
	}
	
	function calculatePath(path, mouse){
		var d = ''
		var dx, dy;
		
		var from = path.from;
		var to = path.to;
		
		var idLeftOfPath = from.attr('id').split('_')[1].charAt(6);
		var idRightOfPath = to == 'cursor' ? null : to.attr('id').split('_')[1].charAt(6);
		
		var x = parseInt(from.attr('cx')) + parseInt(from.parent().attr('x'));
		var y = parseInt(from.attr('cy')) + parseInt(from.parent().attr('y'));
		
		if(path.to == "cursor"){
			dx = mouse.pageX - x;
			dy = mouse.pageY - y;
		}
		else{
			dx = parseInt(to.attr('cx')) + parseInt(to.parent().attr('x')) - x;
			dy = parseInt(to.attr('cy')) + parseInt(to.parent().attr('y')) - y;
		}
		
		//var posDx = Math.max(Math.abs(dx), 500);

		var posDx;
		
		if(isEdge){
			posDx = Math.abs(dx);
		}
		else{
			posDx = Math.abs(path.path.node().getTotalLength()/2);
		}
		
		var bCurve1 = posDx/1.5;
		var bCurve2 = dx - posDx/1.5;

		bCurve1 *= idLeftOfPath == 'r' ? 1 : -1;
		bCurve2 += (idRightOfPath == 'l' || idRightOfPath == null) ? 0 : posDx;

		d += 'M ' + x + ' ' + y;
		d += ' c ' + bCurve1 + ' 0 ' + bCurve2 + ' ' + dy + ' ' + dx + ' ' + dy;
		
		path.path.attr('d', d);
	}
	
	function resolvePath(path, end, redraw){
		path.to = $('#' + $(end).attr('id'));
		var component = $(end).parent().attr('id');
		
		components[component].paths[path.id] = path;
		
		calculatePath(path, null);
		
		// redraw for non-user path drawing
		if(redraw){
			calculatePath(path, null);
		}
		
		path.path.style('pointer-events', 'auto');
	}
	
	function removePath(path){
		console.log(path);
	}
	
	function eventListeners(){
		var move = false;
		document.addEventListener('contextmenu', function(ev) {
			ev.preventDefault();
			return false;
		}, false);

		document.addEventListener("mousedown", function(event){

			var mouseOver = $(event.target);
			
			// prepare component dragging
			if(mouseOver.hasClass('rect') || mouseOver.hasClass('gear') || mouseOver.hasClass('circleComponent')) {
				target = mouseOver.parent();
				targetClass = 'component';

				targetx = parseInt(target.attr('x'));
				targety = parseInt(target.attr('y'));

			}
		}, false);

		document.addEventListener("mouseup", function(event){
			
			// resolve component dragging
			if(targetClass == 'component'){
				target = null;
				targetClass = null;
			}
		}, false);
		
		document.addEventListener("mousemove", function(event){

			if(isChrome && event.which == 1 ||
				((isEdge || isFirefox) && event.buttons == 1)){

				// on mouse down, before mouse up, drag components around
				if(targetClass == 'component'){
					var x, y;
					
					targetx += event.movementX;
					targety += event.movementY;
					
					x = Math.round(targetx/20)*20;
					y = Math.round(targety/20)*20;
					
					target.attr('x', x);
					target.attr('y', y);

					for(var path in components[target.attr('id')].paths){
						calculatePath(components[target.attr('id')].paths[path], null);
					}
				}
			}
			else if(isChrome && event.which == 3 ||
					((isEdge || isFirefox) && event.buttons == 2)){

			}
			
			if(targetClass == 'path'){
				calculatePath(target, event);
			}
		}, false);
		
		document.addEventListener("click", function(event){
			
			// create path on button click
			if(targetClass != 'path' && $(event.target).hasClass('circle')){
				target = createPath($(event.target));
				targetClass = 'path';
			}
			else if(targetClass == 'path'){
				
				// resolve and attach path to second component
				if($(event.target).hasClass('circle')){
					resolvePath(target, $(event.target), false);
					
					target = null;
					targetClass = null;
				}
				
				// delete path if click is not on circle in component
				else{
					
					var component = target.from.attr('id').split('_')[0];
					delete components[component].paths[target.id];
					
					target.path.remove();
					
					target = null;
					targetClass = null;
				}
			}
			else if(targetClass == null){
				
				// detach right side of path from component, reattach to cursor
				if($(event.target).hasClass('path')){

					target = paths[$(event.target).attr('id')];
					targetClass = 'path';
					var component = target.to.attr('id').split('_')[0];
					delete components[component].paths[target.id];
					
					target.to = 'cursor';
					target.path.style('pointer-events', 'none');
				}
				else if($(event.target).hasClass('toolbar_button')){
					var id = $(event.target).attr('id');
					if(id == 'add_square'){
						var text = $('#square_text').val();
						
						if(text == ''){
							alert('The component must have text.');
						}
						else{
							$('#square_text').val('');
							createRectComponent(100, 100, text);
						}
					}
					else if(id == 'add_round'){
						var text = $('#round_text').val();
						
						if(text == ''){
							alert('The component must have text.');
						}
						else{
							$('#round_text').val('');
							createRoundComponent(100, 100, text);
						}
					}
				}
			}
		});
	}
	
	function createBackground(){
		var width = svg.attr('width');
		var height = svg.attr('height');
		
		var spacing = 20;
		var d;
		var color = 'rgba(245, 245, 245, 1)';
		
		g = svg.append('g');
		
		for(var i = spacing; i < width; i += spacing){
			
			d = 'M ' + i + ' 0 l 0 ' + height;
			
			g.append('path')
				.attr('stroke', color)
				.attr('stroke-width', 2)
				.attr('fill', 'none')
				.attr('d', d);
		}
		
		for(var j = spacing; j < height; j += spacing){
			
			d = 'M 0 ' + j + ' l ' + width + ' 0';
			
			g.append('path')
				.attr('stroke', color)
				.attr('stroke-width', 2)
				.attr('fill', 'none')
				.attr('d', d);
		}
	}
	
	
	function initPaths(){
		var path;
		path = createPath($('#component5_circler1'));
		resolvePath(path, $('#component0_circlel1'), true);
		
		path = createPath($('#component6_circler1'));
		resolvePath(path, $('#component1_circlel1'), true);
		
		path = createPath($('#component7_circler1'));
		resolvePath(path, $('#component2_circlel1'), true);
		
		path = createPath($('#component8_circler1'));
		resolvePath(path, $('#component3_circlel1'), true);
		
		path = createPath($('#component9_circler1'));
		resolvePath(path, $('#component4_circlel1'), true);
		
		path = createPath($('#component3_circler1'));
		resolvePath(path, $('#component10_circlel1'), true);
		
		path = createPath($('#component4_circler1'));
		resolvePath(path, $('#component10_circlel1'), true);
		
		path = createPath($('#component10_circler1'));
		resolvePath(path, $('#component11_circlel1'), true);
		
		path = createPath($('#component11_circler1'));
		resolvePath(path, $('#component12_circlel1'), true);
		
		path = createPath($('#component0_circler1'));
		resolvePath(path, $('#component12_circlel1'), true);
		
		path = createPath($('#component1_circler1'));
		resolvePath(path, $('#component12_circlel1'), true);
		
		path = createPath($('#component2_circler1'));
		resolvePath(path, $('#component12_circlel1'), true);
	}
	
	function init(){
		filters();
		
		createBackground();
		
		svgPaths = svg.append('svg')
		.attr('id', 'paths');
		
		eventListeners();
		
		createRectComponent(360, 40, 'Social Feeds Dataflows');
		createRectComponent(360, 220, 'Sales Force Data');
		createRectComponent(360, 400, 'EDW replication flows');
		createRectComponent(360, 580, 'Mobile App Collections');
		createRectComponent(360, 760, 'Web Logs Collection');
		
		createRoundComponent(60, 20, 'Social Feeds', 'src/images/twitter.png');
		createRoundComponent(60, 200, 'Sales Force', 'src/images/f.png');
		createRoundComponent(60, 380, 'Production EDW', 'src/images/cake.png');
		createRoundComponent(60, 560, 'Mobile App Interactions', 'src/images/phone.png');
		createRoundComponent(60, 740, 'Web Logs', 'src/images/paper.png');
		
		createRoundComponent(680, 600, 'Kafka Cluster', 'src/images/cluster.png');
		
		createRectComponent(920, 500, 'User Interaction Streams');
		
		createRoundComponent(1280, 300, 'Hadoop FS', 'src/images/elephant.png');
	
		initPaths();
	}
	
	init();
	
})()

function makeGear(properties){
	
	var gearNum = properties.gearNum || null;
	var radius = properties.radius || 15;
	var innerRadius = properties.innerRadius || 20;
	var numSpokes = properties.numSpokes || 6;
	var spokeLength = properties.spokeLength || 8;
	var spokeWidthAngle = properties.spokeWidthAngle || 22;
	var spokeSlant = properties.spokeSlant || 10;
	var startingAngle = properties.startingAngle || 30;
	
	var height = properties.height || 20;
	var width = properties.width || 20;
	
	var fill = 'white';

	var centerx = width / 2;
	var centery = height / 2;

	var toRads = function( num ){ return num * Math.PI / 180;}
	
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
/*
	$('#spoke' + gearNum)
	.attr('d', d)
	.css({
		fill: fill,
		stroke: 'grey',
		strokeWidth: 2
	});*/

	if(innerRadius > 0){
		/*
		$('#circle' + gearNum)
		.attr({
			r: innerRadius,
			cx: centerx,
			cy: centery})
		.css({
			fill: fill,
			stroke: 'grey',
			strokeWidth: 2
			});*/
	}
	
	return d;
}


$('#close').click(function(){
//	$('#instructions').remove();
	$('#instructions').css({
		opacity: 0,
		height: 0
	});
});