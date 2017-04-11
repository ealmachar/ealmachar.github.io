var googleMap;
var startCoord = {lat: 37.7899, lng: -122.4034};
var startZoom = 15;
var stations;
var numStations;
var currentStation;
var currentDay = 2;

var transitionDuration = 50;
var transitionEase = d3.easeLinear;

var margin = {top: 20, right: 20, bottom: 30, left: 50};

var lineGraphDomain;
var barGraph, lineGraph, hourBarGraph, selectinTable;

var blue = "rgba(100, 100, 255, 1)";
var orange = "rgba(255, 165, 0, 1)";
var green = "rgba(50, 200, 50, 1)";

var selectionTableOpacity = 0.8;

function init(){
	currentStation = stations[2];
	
	populateMap();
	barGraph = barGraph();
	lineGraph = lineGraph()
	hourBarGraph = hourBarGraph();
	selectinTable = selectionTable();
	events();
	initPanel();
	updatePanel();
	updatewheader('#visrightupleft-downheader span[data-day=' + currentDay + ']');
	googleMap.setCenter({lat: currentStation.latitude, lng: currentStation.longitude});
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
		.call(d3.axisLeft(y).ticks(5))
		.attr("class", "axis axis--y");

	var txtyOffset = 1.2;
	var valueOffset = 10;
	
	var panel = yaxis.append('g');
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", -.5 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("[ activity / weekday ] throughout year");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*1 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.attr('id', 'wbar-checkout')
		.attr("fill", blue)
		.text("---");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*2 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.attr('id', 'wbar-checkin')
		.attr("fill", orange)
		.text("---");
		
	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr('x', margin.left)
		.attr('y', margin.top)
		.attr("width", width )
		.attr("height", height)
		.style('fill', 'rgba(0,0,0,0)')
		.on("mouseover", function() { focus.style("display", null);})
		.on("mouseout", function() {
			focus.style("display", "none");
			d3.select('#wbar-checkout').text(" ---");
			d3.select('#wbar-checkin').text(" ---");
		})
		.on("mousemove", mousemove);
		
	var focus = svg.append("g")
		.attr("class", "focus")
		.style('pointer-events', 'none')
		.style("display", "none");

	var fline = focus.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height)
		.style('stroke', 'rgba(0,0,0, 0.1)')
		.style('stroke-width', x.bandwidth());
		
	var wbarCheckout = $('#wbar-checkout');
	var wbarCheckin = $('#wbar-checkin');
		
	function mousemove() {
		var x0 = d3.mouse(this)[0] - margin.left;
		
		x0 = Math.floor((x0 / width) * domain.length);
		
		focus.attr("transform", "translate(" + (x(domain[x0]) + margin.left + x.bandwidth()/2) + "," + margin.top + ")");
		
		wbarCheckout.text(currentStation.whistorystart[x0]);
		wbarCheckin.text(currentStation.whistoryend[x0]);
	}
	
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
		
			xaxis.call(d3.axisBottom(x));

			yaxis.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.call(d3.axisLeft(y).ticks(5));

			g.selectAll(".wbarStart")
				.data(dataStart)
				.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.attr("x", function(d, i) { return x(domain[i]); })
				.attr("y", function(d) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
				
			g.selectAll(".wbarEnd")
				.data(dataEnd)
				.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.attr("x", function(d, i) { return x(domain[i]) + x.bandwidth()/2; })
				.attr("y", function(d, i) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
		}
	}
	
	function resize(){
		width = parseInt(svg.style('width')) - margin.left - margin.right;
		height = parseInt(svg.style('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(domain);
		y = d3.scaleLinear().rangeRound([height, 0]).domain([0, max]);
		
		xaxis.call(d3.axisBottom(x))
			.attr("transform", "translate(0," + height + ")");
		
		yaxis.call(d3.axisLeft(y).ticks(5));
		
		overlay.attr("width", width )
			.attr("height", height);
		
		fline.attr("y2", height)
			.style('stroke-width', x.bandwidth());
		
		g.selectAll(".wbarStart")
			.attr("x", function(d, i) { return x(domain[i]); })
			.attr("y", function(d) { return y(d); })
			.attr("width", x.bandwidth()/2)
			.attr("height", function(d) { return height - y(d); });
			
		g.selectAll(".wbarEnd")
			.attr("x", function(d, i) { return x(domain[i]) + x.bandwidth()/2; })
			.attr("y", function(d, i) { return y(d); })
			.attr("width", x.bandwidth()/2)
			.attr("height", function(d) { return height - y(d); });
	}
	
	update();
	
	return {
		update: update,
		resize: resize
	}
}

function hourBarGraph(){
	var svg = d3.select("#visrightupleft-downgraph").append('svg');
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var xPadding = 0.1;
	var xPaddingOuter = 0;
	
	var yTicks = 5;
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(xPadding).paddingOuter(xPaddingOuter);
	var y = d3.scaleLinear().rangeRound([height, 0]);

	var dataStart;
	var dataEnd;
	var max;

	var xDomain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	var yDomain = [0, 1];
	
	x.domain(xDomain);
	y.domain(yDomain);
	
	var xaxis = g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")");
		
	var yaxis = g.append("g")
		.attr("class", "axis axis--y")
		
	var txtyOffset = 1.2;
	var valueOffset = 10;
	
	var panel = yaxis.append('g');
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", -.5 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("[ activity / hour ] throughout year");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*1 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.attr('id', 'hbar-checkout')
		.attr("fill", blue)
		.text("---");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*2 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.attr('id', 'hbar-checkin')
		.attr("fill", orange)
		.text("---");
	
	var overlayWidth = x(xDomain[xDomain.length-1]) - x(xDomain[0]) + x.bandwidth();
	
	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr('x', function(){ return x(0) + margin.left; })
		.attr('y', margin.top)
		.attr("width", overlayWidth)
		.attr("height", height)
		.style('fill', 'rgba(0,0,0,0)')
		.on("mouseover", function() { focus.style("display", null);})
		.on("mouseout", function() {
			focus.style("display", "none");
			d3.select('#hbar-checkout').text(" ---");
			d3.select('#hbar-checkin').text(" ---");
		})
		.on("mousemove", mousemove);
		
	var focus = svg.append("g")
		.attr("class", "focus")
		.style('pointer-events', 'none')
		.style("display", "none");

	var fline = focus.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height)
		.style('stroke', 'rgba(0,0,0, 0.1)')
		.style('stroke-width', x.bandwidth());
		
	var hbarCheckout = $('#hbar-checkout');
	var hbarCheckin = $('#hbar-checkin');
		
	function mousemove() {
		var x0 = d3.mouse(this)[0] - x(xDomain[0]) - margin.left;
		
		x0 = Math.floor((x0 / overlayWidth) * xDomain.length);
		
		focus.attr("transform", "translate(" + (x(x0) + margin.left + x.bandwidth()/2) + "," + margin.top + ")");
		
		hbarCheckout.text(currentStation.dhistorystart[currentDay][x0]);
		hbarCheckin.text(currentStation.dhistoryend[currentDay][x0]);
	}
		
	dataStart = currentStation.dhistorystart[currentDay];
	dataEnd = currentStation.dhistoryend[currentDay];
	
	
	
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
			
			yDomain = [0, max];
			y.domain(yDomain);
		
			xaxis.call(d3.axisBottom(x));

			yaxis.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.call(d3.axisLeft(y)
				.ticks(yTicks));

			g.selectAll(".wbarStart")
				.data(dataStart)
				.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.attr("x", function(d, i) { return x(xDomain[i]); })
				.attr("y", function(d) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
				
			g.selectAll(".wbarEnd")
				.data(dataEnd)
				.transition()
				.duration(transitionDuration)
				.ease(transitionEase)
				.attr("x", function(d, i) { return x(xDomain[i]) + x.bandwidth()/2; })
				.attr("y", function(d, i) { return y(d); })
				.attr("width", x.bandwidth()/2)
				.attr("height", function(d) { return height - y(d); });
		}
	}
	
	function resize(){
		width = parseInt(svg.style('width')) - margin.left - margin.right;
		height = parseInt(svg.style('height')) - margin.top - margin.bottom;
		
		x = d3.scaleBand()
			.rangeRound([0, width])
			.padding(xPadding)
			.paddingOuter(xPaddingOuter)
			.domain(xDomain);
			
		xaxis.call(d3.axisBottom(x))
			.attr("transform", "translate(0," + height + ")");
			
		y = d3.scaleLinear()
			.rangeRound([height, 0])
			.domain(yDomain);
			
		yaxis.call(d3.axisLeft(y).ticks(yTicks));
		
		overlayWidth = x(xDomain[xDomain.length-1]) - x(xDomain[0]) + x.bandwidth();
		
		overlay
			.attr('x', function(){ return x(0) + margin.left; })
			.attr("width", overlayWidth)
			.attr("height", height);
		
		fline.attr("y2", height)
			.style('stroke-width', x.bandwidth());
		
		g.selectAll(".wbarStart")
			.attr("x", function(d, i) { return x(xDomain[i]); })
			.attr("y", function(d) { return y(d); })
			.attr("width", x.bandwidth()/2)
			.attr("height", function(d) { return height - y(d); });
			
		g.selectAll(".wbarEnd")
			.attr("x", function(d, i) { return x(xDomain[i]) + x.bandwidth()/2; })
			.attr("y", function(d, i) { return y(d); })
			.attr("width", x.bandwidth()/2)
			.attr("height", function(d) { return height - y(d); });
	}
	
	update();
	
	return {
		update: update,
		resize: resize
	}
}

function selectionTable(){
	var margin = {top: 0, right: 20, bottom: 0, left: 20};
	
	var blue = "rgb(100, 100, 255)";
	var orange = "rgb(255, 165, 0)";
	
	var svg = d3.select("#visrightupright-up")
		.append('svg')
		.style('height', '2600px');
		
	var width = parseInt(svg.style('width')) - margin.left - margin.right;
	var height = parseInt(svg.style('height')) - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var totalBarWidth = 3;
	
	var x = d3.scaleLinear().rangeRound([0, width]);
	var y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

	var dataStart = [];
	var dataEnd = [];
	var domain = [];
	
	var max = 0;
	
	stations.forEach(function(d){
		if(d.stationId >= 0){
			var sum = d.startFreq + d.endFreq;
			dataStart.unshift(d.startFreq/sum);
			dataEnd.unshift(d.endFreq/sum);
			domain.unshift(d.stationId);
			
			max = sum > max ? sum : max;
		}
	});
	
	x.domain([0, 1]);
	y.domain(domain);

	var line = g.append('line')
		.attr('x1', x(.5))
		.attr('y1', y(domain[0]))
		.attr('x2', x(.5))
		.attr('y2', y(domain[domain.length - 1]))
		.style('stroke', 'rgba(0,0,0, 0.5)')
		.style('stroke-width', 1);

	g.selectAll(".sbarStart")
		.data(dataStart)
		.enter().append("rect")
		.attr("class", "sbarStart selectrect")
		.attr("data-stationId", function(d, i){ return domain[i] })
		.attr("x", 0)
		.attr("y", function(d, i) { return y(domain[i]); })
		.attr("width", function(d) { return x(d); })
		.attr("height", function(d) { return y.bandwidth() - totalBarWidth; })
		.style("fill", function(d) { return blue })
		.style("opacity", selectionTableOpacity)
		.style("cursor", "pointer");
		
	g.selectAll(".sbarEnd")
		.data(dataEnd)
		.enter().append("rect")
		.attr("class", "sbarEnd selectrect")
		.attr("data-stationId", function(d, i){ return domain[i] })
		.attr("x", function(d, i){ return x(dataStart[i]) })
		.attr("y", function(d, i) { return y(domain[i]); })
		.attr("width", function(d) { return x(d); })
		.attr("height", function(d) { return y.bandwidth() - totalBarWidth; })
		.style("fill", function(d) { return orange })
		.style("opacity", selectionTableOpacity)
		.style("cursor", "pointer");
		
	g.selectAll(".sbarTotal")
		.data(domain)
		.enter().append("rect")
		.attr("class", "sbarTotal selectrect")
		.attr("data-stationId", function(d, i){ return d })
		.attr("x", 0)
		.attr("y", function(d, i) { return y(domain[i]) + y.bandwidth() - totalBarWidth; })
		.attr("width", function(d, i) { return x((stations[d].startFreq + stations[d].endFreq) / max); })
		.attr("height", totalBarWidth)
		.style("fill", function(d) { return green })

	domain.forEach(function(el, index){
		g.append("text")
			.attr("fill", "#FFF")
			.attr("x", 10)
			.attr("y", y(domain[index]) + 9)
			.attr("dy", "0.71em")
			.style('font-family', '\'Roboto\', Verdana')
			.style('pointer-events', 'none')
			.text(stations[domain[index]].stationId + ': ' + stations[domain[index]].name);
	})
	

	function resize(){
		width = parseInt(svg.style('width')) - margin.left - margin.right;
		height = parseInt(svg.style('height')) - margin.top - margin.bottom;
		
		x = d3.scaleLinear().rangeRound([0, width]).domain([0, 1]);
		y = d3.scaleBand().rangeRound([height, 0]).padding(0.1).domain(domain);
		
		line.attr('x1', x(.5))
			.attr('y1', y(domain[0]))
			.attr('x2', x(.5))
			.attr('y2', y(domain[domain.length - 1]));
		
		g.selectAll(".sbarStart")

			.attr("y", function(d, i) { return y(domain[i]); })
			.attr("width", function(d) { return x(d); })
			.attr("height", function(d) { return y.bandwidth() - totalBarWidth; });
			
		g.selectAll(".sbarEnd")
			.attr("x", function(d, i){ return x(dataStart[i]) })
			.attr("y", function(d, i) { return y(domain[i]); })
			.attr("width", function(d) { return x(d); })
			.attr("height", function(d) { return y.bandwidth() - totalBarWidth; });
			
		g.selectAll(".sbarTotal")
			.attr("y", function(d, i) { return y(domain[i]) + y.bandwidth() - totalBarWidth; })
			.attr("width", function(d, i) { return x((stations[d].startFreq + stations[d].endFreq) / max); });
	}
	
	return {
		resize: resize
	}
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

	var max = 0;
	var maxMod = 1.3;

	currentStation.yhistorystart.forEach(function(d, i){
		max = d > max ? d : max;
	});
	
	currentStation.yhistoryend.forEach(function(d, i){
		max = d > max ? d : max;
	});
	
	var min = 0;
	
	y.domain([min, max*maxMod]);
	x.domain([0, 365]);
	
	var yAxis = g.append("g")
		.call(d3.axisLeft(y));
		
	
	var xAxis = g.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")");

	var lines = [];


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
		
	
		
	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr('x', margin.left)
		.attr('y', margin.top)
		.attr("width", width)
		.attr("height", height)
		.style('fill', 'rgba(0,0,0,0)')
		.on("mouseover", function() { focus.style("display", null); d3.select('#panel-linehover').style("display", "block"); })
		.on("mouseout", function() {
			focus.style("display", "none");
			d3.select('#panel-date').text(" ---");
			d3.select('#panel-checkout').text(" ---");
			d3.select('#panel-checkin').text(" ---");
		})
		.on("mousemove", mousemove);
		
	d3.select('#panel-linehover').style("display", "block");
	d3.select('#panel-date').text(" ---");
	d3.select('#panel-checkout').text(" ---");
	d3.select('#panel-checkin').text(" ---");
		
	var focus = svg.append("g")
		.attr("class", "focus")
		.style('pointer-events', 'none')
		.style("display", "none");

	var fline = focus.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", height)
		.style('stroke', 'rgba(0,0,0, 0.5)')
		.style('stroke-width', 1);
		
	var ocircle = focus.append('circle')
		.attr('r', 5)
		.style('fill', orange)
		
	var bcircle = focus.append('circle')
		.attr('r', 5)
		.style('fill', blue)
		
	var oline = focus.append('line')
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width)
		.attr("y2", 0)
		.style('stroke', orange)
		.style('stroke-width', 1)
		.style('opacity', 0.6);
		
	var bline = focus.append('line')
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width)
		.attr("y2", 0)
		.style('stroke', blue)
		.style('stroke-width', 1)
		.style('opacity', 0.6);

	var panelCheckout;
	var panelCheckin;
	var panelDate;
		
	function mousemove() {
		var x0 = Math.floor(x.invert(d3.mouse(this)[0] - margin.left));
		focus.attr("transform", "translate(" + (x(x0) + margin.left) + "," + margin.top + ")");
		ocircle.attr('cy', y(currentStation.yhistoryend[x0]));
		bcircle.attr('cy', y(currentStation.yhistorystart[x0]));
		
		oline.attr('y1', y(currentStation.yhistoryend[x0]))
		.attr('y2', y(currentStation.yhistoryend[x0]))
		.attr('x1', -x(x0))
		.attr('x2', -x(x0) + width);
		
		bline.attr('y1', y(currentStation.yhistorystart[x0]))
		.attr('y2', y(currentStation.yhistorystart[x0]))
		.attr('x1', -x(x0))
		.attr('x2', -x(x0) + width);
		
		panelCheckout.text(' ' + currentStation.yhistorystart[x0]);
		panelCheckin.text(' ' + currentStation.yhistoryend[x0]);
		panelDate.text(lineGraphDomain[x0] + ' : ' + parseDate(lineGraphDomain[x0]));
	}

	function update(){
		max = 0;
			
		currentStation.yhistorystart.forEach(function(d, i){
			max = d > max ? d : max;
		});
		
		currentStation.yhistoryend.forEach(function(d, i){
			max = d > max ? d : max;
		});
		
		y.domain([min, max*maxMod]);
		
		yAxis.transition()
			.duration(transitionDuration)
			.ease(transitionEase).call(d3.axisLeft(y));
		
		line1 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		line2 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		path1.datum(currentStation.yhistorystart).attr("d", line1);
		path2.datum(currentStation.yhistoryend).attr("d", line2);
	}

		

	
	var txtyOffset = 1.2;
	var valueOffset = 10;
	
	var panel = yAxis.append('g');
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", 0 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("[ Total activity / day ] throughout year");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("Day: ")
	.append("tspan")
		.attr('id', 'panel-date')
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr('x', valueOffset + 'em')
		.text("---");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*2 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("Checkout: ")
	.append("tspan")
		.attr('id', 'panel-checkout')
		.attr("fill", blue)
		.attr('x', valueOffset + 'em')
		.text("---");
		
	panel.append("text")
		.attr("fill", "rgba(0, 0, 0, 0.8")
		.attr("dy", txtyOffset*3 + "em")
		.attr("dx", "1em")
		.attr("text-anchor", "start")
		.text("Checkin: ")
	.append("tspan")
		.attr('id', 'panel-checkin')
		.attr("fill", orange)
		.attr('x',  valueOffset + 'em')
		.text("---");
	
	function resize(){		

		width = parseInt(svg.style('width')) - margin.left - margin.right;
		height = parseInt(svg.style('height')) - margin.top - margin.bottom;

		x = d3.scaleLinear()
			.rangeRound([0, width])
			.domain([0, 365]);

		y = d3.scaleLinear()
			.rangeRound([height, 0])
			.domain([min, max*maxMod]);
		
		yAxis.call(d3.axisLeft(y));
		xAxis.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")");
		
		overlay.attr("width", width)
		.attr("height", height);
		
		line1 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		line2 = d3.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d); });
		
		path1.datum(currentStation.yhistorystart).attr("d", line1);
		path2.datum(currentStation.yhistoryend).attr("d", line2);
	}
	
	panelCheckout = $('#panel-checkout');
	panelCheckin = $('#panel-checkin');
	panelDate = $('#panel-date');
	
	return {
		lines: lines,
		resize: resize,
		update: update
	};
}

var panelName;


function initPanel(){
	panelName = $('#panel-name');
	panelId = $('#panel-id');
	panelArea = $('#panel-area');
	panelTotal = $('#panel-activity-total');
	panelStart = $('#panel-activity-start');
	panelEnd = $('#panel-activity-end');
	panelDocks = $('#panel-docks');
	panelInstall = $('#panel-installation');
}

function updatePanel(){
	
	panelName.text('Name: ' + currentStation.name);
	panelId.text('ID: ' + currentStation.stationId);
	panelArea.text('Area: ' + currentStation.area);
	panelTotal.text(currentStation.startFreq + currentStation.endFreq);
	panelStart.text(currentStation.startFreq);
	panelEnd.text(currentStation.endFreq);
	panelDocks.text('Docks: ' + currentStation.docks);
	panelInstall.text('Installed: ' + currentStation.installation);
}

function updatewheader(event){
	
	$('#visrightupleft-downheader span[data-day=' + currentDay + ']').css({
		'background-color': 'white',
		'color': 'rgba(0, 0, 0, 0.8)'
	});
	
	var wday = $(event).attr('data-day')
	$(event).css({
		'background-color': 'grey',
		'color': 'rgba(255, 255, 255, 1)'
	});
	currentDay = wday;
	
	hourBarGraph.update();
}

function updateGraphs(){
	barGraph.update();
	lineGraph.update();
	hourBarGraph.update();
	updatePanel();
}

function resize(){
	lineGraph.resize();
	hourBarGraph.resize();
	barGraph.resize();
	selectinTable.resize();
}


function events(){
	$('.selectrect').mouseenter(function(){
		var station = $(this).attr('data-stationId');
		$('.sbarStart[data-stationId=' + station + '], .sbarEnd[data-stationId=' + station + ']').css('opacity', 1);
		currentStation = stations[station];
		if(currentStation.latitude != '' && currentStation.longitude != ''){
			googleMap.setCenter({lat: currentStation.latitude, lng: currentStation.longitude});
		}
		updateGraphs();
	});
	
	$('.selectrect').mouseleave(function(){
		var station = $(this).attr('data-stationId');
		$('.sbarStart[data-stationId=' + station + '], .sbarEnd[data-stationId=' + station + ']').css('opacity', selectionTableOpacity);
	});
	
	$('.selectrect').click(function(){
		var station = $(this).attr('data-stationId');
		currentStation = stations[station];
		if(currentStation.latitude != '' && currentStation.longitude != ''){
			googleMap.setCenter({lat: currentStation.latitude, lng: currentStation.longitude});
		}
		updateGraphs();
	})
	
	$('#visrightupleft-downheader span').mouseenter(function(){
		updatewheader(this);
	});
	
	$( window ).resize(function() {
		resize();
	});
}


function initMap() {
	
	var mapProperties = {
		zoom: startZoom,
	};
	
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProperties);
	googleMap = map;
	
	loadData();
}



function populateMap(){

	if(googleMap !== undefined){
		var scale = 2000000;
		stations.forEach(function(obj){
	
			if(obj.stationId >= 0 && obj.latitude != '' && obj.longitude != ''){
				var width = 0.001;
				var depth = width/2;
				var height = obj.startFreq / scale;
				var height2 = obj.endFreq / scale;
				
				var lat = obj.latitude;
				var lng = obj.longitude;
				
				var radius = 0.001;
				
				var circle = paintCircle(lat, lng, radius, obj.startFreq, obj.endFreq);
				
				var circle1 = new google.maps.Polygon({
					path: circle.start,
					strokeColor: "#0000FF",
					strokeOpacity: 0.5,
					strokeWeight: 0,
					fillColor: "#0000FF",
					fillOpacity: 0.5
				});
				circle1.setMap(googleMap);
				
				google.maps.event.addListener(circle1, 'mouseover', function(event) {
//					console.log(event);
				});
				
				var circle2 = new google.maps.Polygon({
					path: circle.end,
					strokeColor: "#FF8800",
					strokeOpacity: 0.5,
					strokeWeight: 0,
					fillColor: "#FF8800",
					fillOpacity: 0.5
				});
				circle2.setMap(googleMap);
			}
		});
	}
	else{
		console.log('Google map not set');
	}
}

function paintCircle(lat, lng, r, start, end){
	var result = {
		start: [],
		end: []
	};
	var segments = 24;
	var segx, segy;
	
	var offset = Math.PI*2 / 4;
	
	var stopAngle = ( start / (start + end) ) * Math.PI*2;
	var stop = false;
	
	result.start.push(new google.maps.LatLng(lat, lng));
	
	for(var i = 0; i < segments && !stop; i++){
		segy = lat + Math.sin( i * (Math.PI*2/segments) + offset) * r;
		segx = lng + Math.cos( i * (Math.PI*2/segments) + offset) * r;
		
		result.start.push(new google.maps.LatLng(segy, segx));

		if( (i + 1) * Math.PI*2/segments > stopAngle ){
			segy = lat + Math.sin( stopAngle + offset) * r;
			segx = lng + Math.cos( stopAngle + offset) * r;
			
			result.start.push(new google.maps.LatLng(segy, segx));
			
			stop = true;
		}
	}
	
	result.end.push(new google.maps.LatLng(lat, lng));
	
	result.end.push(new google.maps.LatLng(segy, segx));
	
	for(i += 1; i <= segments; i++){
		segy = lat + Math.sin( i * (Math.PI*2/segments) + offset) * r;
		segx = lng + Math.cos( i * (Math.PI*2/segments) + offset) * r;
		
		result.end.push(new google.maps.LatLng(segy, segx));
	}
	
	return result;
}


function loadData(){
	$.getJSON("bikedata.json", function(data){
		
		var arr = [];
		var i = 0;

		lineGraphDomain = data.domain;
		data = data.data;
		
		numStations = data.length;

		while(data.length > 0 && i < 100){

			if(data[0].stationId == i){
				var nodata = "---";
				data[0].name = data[0].name == "" ? nodata : data[0].name;
				data[0].area = data[0].area == "" ? nodata : data[0].area;
				data[0].installation = data[0].installation == "" ? nodata : data[0].installation;
				data[0].docks = data[0].docks == 0 ? nodata : data[0].docks;
				
				arr.push(data.shift());
			}
			else{
				arr.push({stationId: -1});
			}
			i++;
		}
		
		stations = arr;
		
		stations.forEach(function(d, i){
			if(d.stationId > -1){
				var arr = stations.slice(i+1, stations.length);
				arr.forEach(function(e){
					if(e.stationId > -1){

						if(d.latitude == e.latitude &&
						d.longitude == e.longitude
						&& d.longitude != ''){
//							console.log(d.stationId + ' ' + e.stationId)
						}
					}
				})
			}
		})
		
		init();
	})
	.fail(function(e, error) {
		console.log( "error: " + error);
	});
}



function parseDate(date){
	var day = new Date();
	
	var weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	
	day.setTime(Date.parse(date));
	return weekday[day.getDay()];
}









