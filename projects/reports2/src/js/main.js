var margin = {top: 20, right: 10, bottom: 30, left: 50};

var xDomain = 100;
var yRange = 95;

var start = 100;

var index = 0;

var transitionDuration = 500;

var freqArray = [];
var targetFreq = null;

function lineGraph(){
	var svg = d3.select("#svgLine");
	var width = parseInt($('#svgLine').css('width')) - margin.left - margin.right;
	var height = parseInt($('#svgLine').css('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var graph = g.append('g');

	var x = d3.scaleLinear()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);


	x.domain([0, xDomain]);
	y.domain([0, yRange]);

	var lines = [];

	
	var clip = svg.append("defs").append("clipPath")
		.attr("id", "lineclip")
		.append("rect")
		.attr("width", width - margin.right)
		.attr("height", height + margin.bottom);

	graph.attr("clip-path", "url(#lineclip)");


	function addLine(lineValue){

		if(!data.values[lineValue]){
			console.log('Line value: ' + lineValue + ' does not exist')
			return;
		}

		var lineData = data.values[lineValue].slice(0, start);

		var line = d3.line()
			.x(function(d, i) { return x(i); })
			.y(function(d, i) { return y(d); });



		var path = graph.append("path")
			.datum(lineData)
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "white")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("d", line)
			.attr("dfre", freqArray[lineValue] )
			.attr("dval", lineValue);

		lines.push({
			number: lineValue,
			src: data.values[lineValue],
			data: lineData,
			path: path,
			line: line
		});
	}

	addLine(5);
	addLine(6);
	index += start;



		
	var yAxis = g.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Voltage");

	var reset;
	var doneTransitions = 0;
		
	function animate(scatterAnimate){
		reset = false;
		lines.forEach(function(line){
			line.data.push(line.src[index]);

			line
				.path.attr('d', line.line)
				.attr('transform', null)
				.transition()
				.duration(transitionDuration)
				.ease(d3.easeLinear)
				.attr('transform', 'translate(' + x(-1) + ')')
				.on('end', function(){
					doneTransitions++;
					if(doneTransitions == lines.length){
						doneTransitions = 0;
						scatterAnimate();
						animate(scatterAnimate);
					}
				});
			
			line.data.shift();
			if(typeof line.src[index + 1] == 'undefined'){
				reset = true;
			}
		});
		index = reset ? 0 : index + 1;
	}
	
	function resize(){		
		width = parseInt($('#svgLine').css('width')) - margin.left - margin.right;
		height = parseInt($('#svgLine').css('height')) - margin.top - margin.bottom;

		x = d3.scaleLinear()
			.rangeRound([0, width]);

		y = d3.scaleLinear()
			.rangeRound([height, 0]);
			
		x.domain([0, xDomain]);
		y.domain([0, yRange]);
		
		yAxis.call(d3.axisLeft(y));
		
		clip.attr("width", width - margin.right)
		.attr("height", height + margin.bottom)
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Voltage");;
	}
	
	return {
		lines: lines,
		animate: animate,
		resize: resize
	};
}



function scatterPlot(){
	var svg = d3.select("#svgPlot");
	var width = parseInt($('#svgPlot').css('width')) - margin.left - margin.right;
	var height = parseInt($('#svgPlot').css('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var graph = g.append('g');
	
	svg.append("defs").append("clipPath")
		.attr("id", "plotclip")
		.append("rect")
		.attr("width", width - margin.right)
		.attr("height", height + margin.bottom);
	
	graph.attr("clip-path", "url(#lineclip)");
	
	var x = d3.scaleLinear()
		.range([0, width]);

	var y = d3.scaleLinear()
		.range([height, 0]);

		
	x.domain([1, xDomain+1]);
	y.domain([0, data.values.length]);
	
	g.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Neuron ID")

	
	var scatterData = [];
	
	for(var i = 0; i < start; i++){
		for(var j = 0; j < data.values.length; j++){
			if(data.values[j][i] > 80){
				scatterData.push([i, j]);
			}
		}
	}
	
	var plot = graph.selectAll(".dot")
		.data(scatterData);
		
	plot.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d, i) { return x(d[0]); })
		.attr("cy", function(d, i) { return y(d[1]); })
		.style("fill", function(d) { return "white" })
		.attr("dfre", function(d){ return freqArray[d[1]] } )
		.attr("dval", function(d){ return d[1] });


	
	function animate(){
		
		var upper, lower;
		var top, bottom;
		var max = data.values[0].length;
		
		top = index;
		bottom = index - start;
		

		if(index == 0){
			scatterData.forEach(function(d){
				d[0] -= max;
			});
		}
		
		
		for(var i = 0; scatterData[i][0] < bottom || scatterData[i][0] > top; i++){
		}


		scatterData = scatterData.slice(i, scatterData.length);

		
		for(var j = 0; j < data.values.length; j++){
			if(data.values[j][index] > 80){
				scatterData.push([index, j]);
			}
		}
		
		plot = graph.selectAll(".dot")
			.data(scatterData);

		
		
		
		x.domain([index - start, index]);

		plot.exit()
			.remove();
		
		plot.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 3)
			.attr("cx", function(d, i) { return x(d[0]); })
			.attr("cy", function(d, i) { return y(d[1]); })
			.style("fill", function(d) { return "white" })
			.attr("dfre", function(d){ return freqArray[d[1]] } )
			.attr("dval", function(d){ return d[1] });
		
		plot.attr("cx", function(d, i) { return x(d[0]); })
			.attr("cy", function(d, i) { return y(d[1]); })
			.attr("dfre", function(d){ return freqArray[d[1]] } )
			//.attr("class", function(d){var red = freqArray[d[1]] == targetFreq? "red" : ''; return 'dot ' + red});
			.style("fill", function(d) { return freqArray[d[1]] == targetFreq ? "red" : "white" });
		
		
		x.domain([index - start +1, index +1]);
		
		
		
		plot.transition()
			.duration(transitionDuration)
			.ease(d3.easeLinear)
			.attr("cx", function(d, i) { return x(d[0]); });
	}
	
	function resize(){
	}
	
	return {
		animate: animate,
		resize: resize
	}
}

function barGraph(){
	var svg = d3.select("#svgGraph");
	var width = parseInt($('#svgGraph').css('width')) - margin.left - margin.right;
	var height = parseInt($('#svgGraph').css('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);
	
	var frequency = {};
	for(var i = 0; i < data.values.length; i++){
		var freq = 0;
		for(var j = 0; j < data.values[i].length; j++){
			if(data.values[i][j] > 80){
				freq++;
			}
		}
		
		freqArray.push(freq);
		
		var prop = freq.toString();
		
		if(frequency.hasOwnProperty(prop)){
			frequency[prop].val++;
		}
		else{
			frequency[prop] = {};
			frequency[prop].name = prop;
			frequency[prop].val = 1;
		}
	}

	
	
	x.domain(Object.keys(frequency));
	y.domain([
		0, (function(){
			var max = 0;
			for(var key in frequency){
				max = frequency[key].val > max ? frequency[key].val : max
			};
			return max;
		})()
	]);

	var temp = [];
	for(var key in frequency){
		temp.push([frequency[key].name, frequency[key].val])
	}
	
	frequency = temp;
	
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("fill", "#000")
		.attr("y", 9)
		.attr("x", 50)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency:");

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).ticks(10))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("# of Frequencies");


	g.selectAll(".bar")
		.data(frequency, function(d){return d.val})
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d[0]) + x.bandwidth()/4; })
		.attr("y", function(d) { return y(d[1]) - 1; })
		.attr("width", x.bandwidth()/2)
		.attr("height", function(d) { return height - y(d[1]); })
		.style("fill", function(d) { return "white" })
		.attr("dfre", function(d) { return d[0] });
	
	function resize(){
		width = parseInt($('#svgGraph').css('width')) - margin.left - margin.right;
		height = parseInt($('#svgGraph').css('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);
		
		g.selectAll(".bar")
				.attr("height", function(d) { return height - y(d[1]); })
	}
	
	return {
		resize: resize
	}
}

function events(){
	$('.bar').mouseenter(function(){
		var freq = $(this).attr('dfre');
		targetFreq = freq;

		$('.bar[dfre=' + freq + '], .dot[dfre=' + freq + ']').css('fill', 'red')
		$('.line[dfre=' + freq + ']').css('stroke', 'red');
	});	
	
	$('.bar').mouseleave(function(){
		
		$('.bar[dfre=' + targetFreq + '], .dot[dfre=' + targetFreq + ']').css('fill', 'white');
		$('.line[dfre=' + targetFreq + ']').css('stroke', 'white');
		targetFreq = null;
	});
}



var barGraph = barGraph();
var scatterPlot = scatterPlot();
var lineGraph = lineGraph();

events();

lineGraph.animate(scatterPlot.animate);
	
window.onresize = function(){
	/*
	barGraph.resize();
	scatterPlot.resize();
	lineGraph.resize();*/
}
