/*
g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.select(".domain")
	.remove();
*/

var min, max;
		min = max = scatterData[0][0];
			
		scatterData.forEach(function(element, index){
			var num = element[0];
			min = num < min ? num : min;
			max = num > max ? num : max;
		});
		
		console.log(min + ' ' + max);

/*
	
var reset;
var doneTransitions = 0;
var transitionDuration = 500;
	

	reset = false;
	lines.forEach(function(line){
		
		function animate(){
		
			line.data.push(line.src[index]);

			line
				.path.attr('d', line.line)
				.attr('transform', null)
				.transition()
				.duration(transitionDuration)
				.ease(d3.easeLinear)
				.attr('transform', 'translate(' + x(-1) + ')')
				.transition()
				.duration(transitionDuration)
				.ease(d3.easeLinear)
				.on('start', function(d, i){
					if(i == 0){
						console.log('animating');
						index = reset ? 0 : index + 1;
					}
					animate();
				});
			
			line.data.shift();
			if(typeof line.src[index + 1] == 'undefined'){
				reset = true;
			}
			

		}
		animate();
	});
	

*/
	
	
	
/*
var tickAccumulator = 0;
var tickStart = performance.now();
var tickEnd = 0;
var shiftGraph = false;
function animate(){
	tickEnd = performance.now() - tickStart;
	tickAccumulator += tickEnd;
	tickStart = performance.now();
	
//	console.log(tickAccumulator);

	if(tickAccumulator > 1000){
		tickAccumulator %= 1000;
		shiftGraph = true;
	}
	
	var reset = false;
	lines.forEach(function(line){
		
		if(shiftGraph){
			line.data.push(line.src[index]);
		}
		if(shiftGraph){
			line.data.shift();
			line.path.attr('d', line.line)
		}

		

			line.path.attr('transform', 'translate(' + x(-(tickAccumulator/1000)) + ')');
			
		
		
		if(typeof line.src[index + 1] == 'undefined'){
			reset = true;
		}
	});
	if(shiftGraph){
		index = reset ? 0 : index + 1;
		shiftGraph = false;
	}
	
	requestAnimationFrame(animate);
}

animate();
	
*/

/*
setInterval(function(){
	var reset = false;
	lines.forEach(function(line){
		line.data.push(line.src[index]);

		line
			.path.attr('d', line.line)
			.attr('transform', null)
			.transition()
			.attr('transform', 'translate(' + x(-1) + ')');
		
		line.data.shift();
		if(typeof line.src[index + 1] == 'undefined'){
			reset = true;
		}
	});
	index = reset ? 0 : index + 1;
}, 100)
*/