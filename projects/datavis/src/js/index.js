var googleMap;
var startCoord = {lat: 37.7749, lng: -122.4194};
var stations;
var numStations;
var currentStation;
var currentDay = 0;

var margin = {top: 20, right: 20, bottom: 30, left: 50};

var barGraph, lineGraph, hourBarGraph;

var blue = "rgba(100, 100, 255, 1)"
var orange = "rgba(255, 165, 0, 1)"

var selectionTableOpacity = 0.8;

function init(){
	currentStation = stations[2];
	
	populateMap();
	barGraph = barGraph();
	lineGraph = lineGraph()
	hourBarGraph = hourBarGraph();
	selectionTable();
	events();
}

function barGraph(){
	var svg = d3.select("#visrightupleft-up").append('svg');
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().rangeRound([height, 0]);

	var dataStart;
	var dataEnd;
	var max;

	var domain = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
	x.domain(domain);
	
	var xaxis = g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		
	var yaxis = g.append("g")
		.attr("class", "axis axis--y")
		
	dataStart = currentStation.whistorystart;
	dataEnd = currentStation.whistoryend;
	
	y.domain([0, 1]);
	
	g.selectAll(".wbarStart")
		.data(dataStart)
		.enter().append("rect")
		.attr("class", "wbarStart")
		.style("fill", function(d) { return blue });
		
	g.selectAll(".wbarEnd")
		.data(dataEnd)
		.enter().append("rect")
		.attr("class", "wbarEnd")
		.style("fill", function(d) { return orange });
	
	/*
	function resize(){
		width = parseInt($('#svgGraph').css('width')) - margin.left - margin.right;
		height = parseInt($('#svgGraph').css('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);
		
		g.selectAll(".bar")
				.attr("height", function(d) { return height - y(d[1]); })
	}*/
	
	function update(){
		
		if(currentStation){
		
			dataStart = currentStation.whistorystart;
			dataEnd = currentStation.whistoryend;
			
			max = 0;
			
			dataStart.forEach(function(d, i){
				max = d > max ? d : max;
			});
			
			dataEnd.forEach(function(d, i){
				max = d > max ? d : max;
			});
			
			y.domain([0, max]);
		
			xaxis.call(d3.axisBottom(x));/*
				.append("text")
				.attr("fill", "#000")
				.attr("y", 9)
				.attr("x", 50)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.text("Frequency:");*/

			yaxis.call(d3.axisLeft(y).ticks(5));/*
				.append("text")
				.attr("fill", "#000")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.text("# of Frequencies");*/


			g.selectAll(".wbarStart")
				.data(dataStart)
				.attr("x", function(d, i) { return x(domain[i]); })
				.attr("y", function(d) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
				
			g.selectAll(".wbarEnd")
				.data(dataEnd)
				.attr("x", function(d, i) { return x(domain[i]) + x.bandwidth()/2; })
				.attr("y", function(d, i) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
		}
	}
	
	update();
	
	return {
		update: update
	}
}

function hourBarGraph(){
	var svg = d3.select("#visrightupleft-down").append('svg');
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().rangeRound([height, 0]);

	var dataStart;
	var dataEnd;
	var max;

	var domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	x.domain(domain);
	
	var xaxis = g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		
	var yaxis = g.append("g")
		.attr("class", "axis axis--y")
		
	dataStart = currentStation.dhistorystart[currentDay];
	dataEnd = currentStation.dhistoryend[currentDay];
	
	y.domain([0, 1]);
	
	g.selectAll(".wbarStart")
		.data(dataStart)
		.enter().append("rect")
		.attr("class", "wbarStart")
		.style("fill", function(d) { return blue });
		
	g.selectAll(".wbarEnd")
		.data(dataEnd)
		.enter().append("rect")
		.attr("class", "wbarEnd")
		.style("fill", function(d) { return orange });
	
	/*
	function resize(){
		width = parseInt($('#svgGraph').css('width')) - margin.left - margin.right;
		height = parseInt($('#svgGraph').css('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);
		
		g.selectAll(".bar")
				.attr("height", function(d) { return height - y(d[1]); })
	}*/
	
	function update(){
		
		if(currentStation){
		
			dataStart = currentStation.dhistorystart[currentDay];
			dataEnd = currentStation.dhistoryend[currentDay]
			
			max = 0;
			
			dataStart.forEach(function(d, i){
				max = d > max ? d : max;
			});
			
			dataEnd.forEach(function(d, i){
				max = d > max ? d : max;
			});
			
			y.domain([0, max]);
		
			xaxis.call(d3.axisBottom(x));/*
				.append("text")
				.attr("fill", "#000")
				.attr("y", 9)
				.attr("x", 50)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.text("Frequency:");*/

			yaxis.call(d3.axisLeft(y).ticks(5));/*
				.append("text")
				.attr("fill", "#000")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.text("# of Frequencies");*/


			g.selectAll(".wbarStart")
				.data(dataStart)
				.attr("x", function(d, i) { return x(domain[i]); })
				.attr("y", function(d) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
				
			g.selectAll(".wbarEnd")
				.data(dataEnd)
				.attr("x", function(d, i) { return x(domain[i]) + x.bandwidth()/2; })
				.attr("y", function(d, i) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
		}
	}
	
	update();
	
	return {
		update: update
	}
}

function selectionTable(){
	var margin = {top: 10, right: 20, bottom: 30, left: 20};
	
	var blue = "rgb(100, 100, 255)";
	var orange = "rgb(255, 165, 0)";
	
	var svg = d3.select("#visrightup-right")
		.append('svg')
		.style('height', '600%');
		
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleLinear().rangeRound([0, width]);
	var y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

	var dataStart = [];
	var dataEnd = [];
	var domain = [];
	
	stations.forEach(function(d){
		if(d.stationId >= 0){
			var sum = d.startFreq + d.endFreq;
			dataStart.unshift(d.startFreq/sum);
			dataEnd.unshift(d.endFreq/sum);
			domain.unshift(d.stationId);
		}
	});
	
	x.domain([0, 1]);
	y.domain(domain);
	
	/*g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
		.append("text")
		.attr("fill", "#000")
		.attr("y", 9)
		.attr("x", 50)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency:");*/

	/*g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).ticks(numStations));
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("# of Frequencies");*/

	g.append('line')
		.attr('x1', x(.5))
		.attr('y1', y(domain[0]))
		.attr('x2', x(.5))
		.attr('y2', y(domain[domain.length - 1]))
		.style('stroke', 'rgba(0,0,0, 0.5)')
		.style('stroke-width', 1);

	g.selectAll(".sbarStart")
		.data(dataStart)
		.enter().append("rect")
		.attr("class", "sbarStart")
		.attr("data-stationId", function(d, i){ return domain[i] })
		.attr("x", 0)
		.attr("y", function(d, i) { return y(domain[i]); })
		.attr("width", function(d) { return x(d); })
		.attr("height", function(d) { return y.bandwidth(); })
		.style("fill", function(d) { return blue })
		.style("opacity", selectionTableOpacity);
		
	g.selectAll(".sbarEnd")
		.data(dataEnd)
		.enter().append("rect")
		.attr("class", "sbarEnd")
		.attr("data-stationId", function(d, i){ return domain[i] })
		.attr("x", function(d, i){ return x(dataStart[i]) })
		.attr("y", function(d, i) { return y(domain[i]); })
		.attr("width", function(d) { return x(d); })
		.attr("height", function(d) { return y.bandwidth(); })
		.style("fill", function(d) { return orange })
		.style("opacity", selectionTableOpacity);

	domain.forEach(function(el, index){
		g.append("text")
			.attr("fill", "#FFF")
			.attr("x", 10)
			.attr("y", y(domain[index]) + 7)
			.attr("dy", "0.71em")
			.style('font-family', '\'Roboto\', Verdana')
			.style('pointer-events', 'none')
			.text(stations[domain[index]].stationId + ': ' + stations[domain[index]].name);
	})
	
	
	/*
	function resize(){
		width = parseInt($('#svgGraph').css('width')) - margin.left - margin.right;
		height = parseInt($('#svgGraph').css('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);
		
		g.selectAll(".bar")
				.attr("height", function(d) { return height - y(d[1]); })
	}*/
}

function lineGraph(){
	var svg = d3.select("#visright-down").append('svg');
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var graph = g.append('g');

	var x = d3.scaleLinear()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);


	x.domain([0, 365]);
	
	var max = 0;
			
	currentStation.yhistorystart.forEach(function(d, i){
		max = d > max ? d : max;
	});
	
	currentStation.yhistoryend.forEach(function(d, i){
		max = d > max ? d : max;
	});
	
	y.domain([0, max]);

	var lines = [];

	/*
	var clip = svg.append("defs").append("clipPath")
		.attr("id", "lineclip")
		.append("rect")
		.attr("width", width - margin.right)
		.attr("height", height + margin.bottom);

	graph.attr("clip-path", "url(#lineclip)");
*/


	var line1 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });

	var path1 = graph.append("path")
		.datum(currentStation.yhistorystart)
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", blue)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1)
		.attr("d", line1);
		
	var line2 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });

	var path2 = graph.append("path")
		.datum(currentStation.yhistoryend)
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", orange)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1)
		.attr("d", line2);
		

	function update(){
		max = 0;
			
		currentStation.yhistorystart.forEach(function(d, i){
			max = d > max ? d : max;
		});
		
		currentStation.yhistoryend.forEach(function(d, i){
			max = d > max ? d : max;
		});
		
		y.domain([0, max]);
		
		yAxis.call(d3.axisLeft(y));
		
		line1 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		line2 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		path1.datum(currentStation.yhistorystart).attr("d", line1);
		path2.datum(currentStation.yhistoryend).attr("d", line2);
	}

		
	var yAxis = g.append("g")
		.call(d3.axisLeft(y));/*
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Voltage");*/

	var xAxis = g.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")");
		
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
		update: update
	};
}





function updateGraphs(){
	barGraph.update();
	lineGraph.update();
	hourBarGraph.update();
}


function events(){
	$('.sbarStart, .sbarEnd').mouseenter(function(){
		var station = $(this).attr('data-stationId');
		$('.sbarStart[data-stationId=' + station + '], .sbarEnd[data-stationId=' + station + ']').css('opacity', 1);
		currentStation = stations[station];
		updateGraphs();
	});
	
	$('.sbarStart, .sbarEnd').mouseleave(function(){
		var station = $(this).attr('data-stationId');
		$('.sbarStart[data-stationId=' + station + '], .sbarEnd[data-stationId=' + station + ']').css('opacity', selectionTableOpacity);
	});
	
	$('.sbarStart, .sbarEnd').click(function(){
		var station = $(this).attr('data-stationId');
		currentStation = stations[station];
		updateGraphs();
	})
}


function initMap() {
	
	var mapProperties = {
		center:new google.maps.LatLng(startCoord.lat, startCoord.lng ),
		zoom:12,
	};
	
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProperties);
	googleMap = map;
	
	loadData();
}



function populateMap(){

	if(googleMap !== undefined){
		var scale = 2000000;
		stations.forEach(function(obj){
	
			if(obj.stationId >= 0){
				var width = 0.001;
				var depth = width/2;
				var height = obj.startFreq / scale;
				var height2 = obj.endFreq / scale;
				
				var lat = obj.latitude;
				var lng = obj.longitude;
				
				var bttmLt = new google.maps.LatLng(lat + depth, lng - width);
				var bttmCtr = new google.maps.LatLng(lat, lng);
				var bttmRt = new google.maps.LatLng(lat + depth, lng + width);
				
				var upprLt = new google.maps.LatLng(lat + depth + height, lng - width);
				var upprCtr = new google.maps.LatLng(lat + height, lng);
				var upprRt = new google.maps.LatLng(lat + depth + height, lng + width);
				
				var bar1 = new google.maps.Polygon({
					path: [bttmCtr, bttmRt, upprRt, upprCtr, upprLt, bttmLt, bttmCtr],
					strokeColor: "#0000FF",
					strokeOpacity: 0.5,
					strokeWeight: 0,
					fillColor: "#0000FF",
					fillOpacity: 0.5
				});
				bar1.setMap(googleMap);

				
				bttmLt = new google.maps.LatLng(lat + height + depth, lng - width);
				bttmCtr = new google.maps.LatLng(lat + height , lng);
				bttmRt = new google.maps.LatLng(lat + height + depth, lng + width);
				
				upprLt = new google.maps.LatLng(lat + depth + height2, lng - width);
				upprCtr = new google.maps.LatLng(lat + height2, lng);
				upprRt = new google.maps.LatLng(lat + depth + height2, lng + width);
				
				
				var bar2 = new google.maps.Polygon({
					path: [bttmCtr, bttmRt, upprRt, upprCtr, upprLt, bttmLt, bttmCtr],
					strokeColor: "#FF8800",
					strokeOpacity: 0.5,
					strokeWeight: 0,
					fillColor: "#FF8800",
					fillOpacity: 0.5
				});
				bar2.setMap(googleMap);
			}
		});
	}
	else{
		console.log('Google map not set');
	}
}



function loadData(){
	$.getJSON("bikedata.json", function(data){
		
		var arr = [];
		var i = 0;
		
		numStations = data.length;
		
		while(data.length > 0 && i < 100){

			if(data[0].stationId == i){
				arr.push(data.shift());
			}
			else{
				arr.push({stationId: -1});
			}
			i++;
		}
		
		stations = arr;
		
		init();
	})
	.fail(function(e, error) {
		console.log( "error: " + error);
	});
}