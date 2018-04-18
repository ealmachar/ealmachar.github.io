(function(){

const app = new (class {
	
	constructor(){
		
		this.visualizations = [{
			url: 'traffic_bytes.json',
			init: trafficbytesViz,
			format: formatTrafficData,
			dom: 'traffic_bytes',
			app: this,
			viz: null,
			attr: {
				backgroundColor: '#8D8741',
				unselectColor: '#659DBD',
				selectColor: '#70C1B3',
				childselectColor: '#DAAD86',
			}
		},{
			url: 'time.json',
			init: timeViz,
			format: formatTimeData,
			dom: 'time',
			app: this,
			viz: null,
			attr: {
				colors: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'],
				lineSelectedWidth: 5,
				lineUnselectedWidth: 2
			}
		},{
			url: 'followed_by.json',
			init: followedViz,
			format: formatFollowedData,
			dom: 'followed',
			app: this,
			viz: null,
			attr: {
				successColor: "green",
				failColor: "red",
				selectOpacity: 1,
				deselectOpacity: 0.33
			}
		}];
		
		for(let viz of this.visualizations){
			this.initViz(viz);
		}
	}
	initViz(viz){
		retrieveJson(viz.url, viz.init, viz);
	}
})()


function trafficbytesViz(viz, data){
	return new (function(){

		var jsvg = $('#' + viz.dom);

		var width = jsvg.width(),
			height = jsvg.height();
		
		var canvas = d3.select(jsvg.get(0))
			.append('canvas')
			.classed('_canvas', true)
			.attr('width', width)
			.attr('height', height)
			.on('mousemove', mousemove)
			.on('mouseleave', mouseleave)
			.on('click', mouseclick)
			.on("contextmenu", rightclick);
			
		var context = canvas.node().getContext('2d');

		var hidden = d3.select(jsvg.get(0))
			.append('canvas')
			.classed('_canvas', true)
			.style('display', 'none')
			.attr('width', width)
			.attr('height', height);
			
		var hcontext = hidden.node().getContext('2d');
		
		var currentColor = null;
		var tooltip = d3.select('#tbtooltip');
		var freestate = true;
		var stateColor = null;

		var treemap = d3.treemap()
			.tile(d3.treemapResquarify)
			.size([width, height])
			.round(true)
			.paddingInner(1);
		
		var root = d3.hierarchy(data)
			.eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
			.sum(function(d){ return d.value })
			.sort(function(a, b){ return b.height - a.height || b.value - a.value; });
		
		treemap(root);

		root = root.leaves();
		
		root.forEach(function(d){
			data.colorKey[d.data.colorCode].d3obj = d;
			
			context.fillStyle = viz.attr.unselectColor;
			hcontext.fillStyle = 'rgb(' + d.data.colorCode + ')';
			
			context.fillRect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0);
			hcontext.fillRect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0);
		})
		
		function mousemove(){
			var mouseX = d3.event.layerX || d3.event.offsetX;
			var mouseY = d3.event.layerY || d3.event.offsety;
			
			var col = hcontext.getImageData(mouseX, mouseY, 1, 1).data.subarray(0, 3);

			col = col.join(',');

			let same = col == currentColor;
			
			updateTooltip(col, mouseX, mouseY, same);
			
			if(same) return;
			if(!freestate) return;

			if(currentColor)
				color(currentColor, false);
			
			color(col, true);

			currentColor = col;
		}
		
		function color(col, select){
			if(!data.colorKey[col]) return;
			
			var childIPs;
			let d = data.colorKey[col].d3obj;

			context.fillStyle = select ? viz.attr.selectColor : viz.attr.unselectColor;

			context.fillRect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0);

			context.fillStyle = select ? viz.attr.childselectColor : viz.attr.unselectColor;

			if(data.colorKey[col].destIPs)
				childIPs = data.colorKey[col].destIPs;
			else
				childIPs = data.colorKey[col].srcIPs;
			for(let child in childIPs){
				let childColor = childIPs[child].colorCode;
				
				let d = data.colorKey[childColor].d3obj;
				context.fillRect(d.x0, d.y0, d.x1 - d.x0, d.y1 - d.y0);
			}
		}
		
		function updateTooltip(col, x, y, same){
			if(!same) {
				let d = data.colorKey[col];
				if(!d) {
					tooltip.style('display', 'none');
					return
				}

				tooltip.select('#tbtooltip-ipname').text(d.name);
				tooltip.select('#tbtooltip-type').text(d.type);
				tooltip.select('#tbtooltip-value').text(d3.format(".5s")(d.value));
			}
			
			if(x > width/2){
				x -= $(tooltip.node()).outerWidth();
			}
			
			if(y > height/2){
				y -= $(tooltip.node()).outerHeight();
			}
			
			tooltip.style('display', 'initial')
				.style('transform', 'translate(' + x + 'px, ' + y+'px)');
		}
		
		function updateReference(col){
			let d = data.colorKey[col];
			let ref = d3.select('#tbtooltip-reference');

			if(!d || freestate){
				ref.style('display', 'none');
				return
			}
			
			ref.style('display', 'block');
			
			ref.select('#tbtooltip-ripname').text(d.name);
			ref.select('#tbtooltip-rtype').text(d.type);
			ref.select('#tbtooltip-rvalue').text(d3.format(".5s")(d.value));
		}
		
		function mouseclick(event){
			freestate = true;
			
			mousemove();

			freestate = false;
			
			updateReference(currentColor);
		}
		
		function mouseleave(){
			tooltip.style('display', 'none');
		}
		
		function rightclick(d, i) {
			d3.event.preventDefault();
			freestate = true;
			
			updateReference(null);
		}

		

		
		viz.viz = this;
	})()
}

function timeViz(viz, data){
	return new (function(){
		viz.viz = this;
		this.data = data;

		this.barViz = new timeBarViz(viz);
		this.lineViz = new timeLineViz(viz);
	})()
}

function timeBarViz(viz){
	
	var parent = $('#' + viz.dom);

	var data = viz.viz.data;
	
	var margin = {top: 20, right: 60, bottom: 30, left: 40};
	
	var outerWidth = parent.width()/2,
		outerHeight = parent.height();

	var svg = d3.select('#' + viz.dom)
		.append('svg')
		.attr('width', outerWidth)
		.attr('height', outerHeight);
		
		width = outerWidth - margin.left - margin.right,
		height = outerHeight - margin.top - margin.bottom;
		
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1)
		.align(0.1);
		
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var z = d3.scaleOrdinal()
		.range(viz.attr.colors);

	var stack = d3.stack()
		.keys(Object.keys(data[0]).slice(1))
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone);

	var series = stack(data);
	
	x.domain(data.map(function(d) { return d._time; }));
	y.domain([0, findMax(series)]);
	
	var serie = g.selectAll(".serie")
		.data( series )
		.enter().append("g")
		.attr("class", "serie")
		.attr("fill", function(d) { return z(d.key); });

	serie.selectAll("rect")
		.data(function(d) { return d; })
		.enter().append("rect")
		.attr("x", function(d) { return x(d.data._time); })
		.attr("y", function(d) { return y(d[1]); })
		.attr("height", function(d) { return y(d[0]) - y(d[1]); })
		.attr("width", x.bandwidth());
		
	var refbar = g.append('g')
		.append('rect')
		.style('fill', 'grey')
		.style('opacity', 0)
		.attr('x', 0)
		.attr('width', width)
		
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%I:%M %p")))

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).tickFormat(d3.format(".1s")));
		
	function findMax(data){
		var max = 0;
		for(let i of data){
			for(let j of i){
				if(j[1] > max){
					max = j[1];
				}
			}
		}
		return max;
	}
	
	function calcMidSize(a, b){
		return Math.abs(y(a) - y(b));
	}
	
	function calcMidLocation(el){
		var midsize = calcMidSize(el[0], el[1]);
		return midsize/2 + y(el[1]);
	}

	function findNearestBarValue(ip){
		var midheight = height/2;
		var min = Infinity;
		var index = null;

		var arr = (function(){
			for(let el of series){
				if(el.key == ip) return el;
			}
		})()
		
		if(!arr) return [null, null];

		for(let i = 0; i < arr.length; i++){
			let el = arr[i];
			var valmid = calcMidSize(el[1], el[0]);
			var dataY = Math.abs(valmid - midheight);

			if( dataY < min ){
				min = dataY; 
				index = i;
			}
		}
		return [index, arr];
	}
	
	this.selectBar = function(bar){
		var [index, arr] = findNearestBarValue(bar);
		
		if(index != null){		
			var valmidLoc = height/2;	//calcMidLocation(arr[index]);
			var offsets = [];
			
			for(let i = 0; i < arr.length; i++){
					offsets[i] = valmidLoc - calcMidLocation(arr[i])
			}
		}

		var t = d3.transition()
			.duration(2000);
		
		serie.selectAll("rect")
			.transition(d3.easeCubic(t))
			.attr("y", function(d, i) { return (index == null ? 0 : offsets[i]) + y(d[1]); })
			
		refbar
			.style('opacity', function(){ return index == null ? 0 : 0.2 })
			.attr('y', height/2 - 25)
			.attr('height', 50)
	}
	
	this.deselect = function(){
		
	}
}

function timeLineViz(viz){
	var parent = $('#' + viz.dom);

	var data = viz.viz.data;
	
	var margin = {top: 20, right: 60, bottom: 30, left: 40};
	
	var outerWidth = parent.width()/2,
		outerHeight = parent.height();

	var svg = d3.select('#' + viz.dom)
		.append('svg')
		.attr('width', outerWidth)
		.attr('height', outerHeight);
		
	var width = outerWidth - margin.left - margin.right,
		height = outerHeight - margin.top - margin.bottom;
		
	var currentLine = null;
	var currentTime = null;
		
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0])
		z = d3.scaleOrdinal(d3.schemeCategory10);
		
	var min = Infinity, max = 0;
	var lineData = Object.keys(data[0]).slice(1).map(function(id){
			return {
				id: id,
				values: data.map(function(d){
					return { data: parseInt(d[id]), time: d['_time'] }
				})
			}
		})

	var line = d3.line()
		.x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.data); });

	x.domain(d3.extent(data, function(d) { return d._time; }));

	y.domain([
		d3.min(lineData, function(c) { return d3.min(c.values, function(d) { return d.data; }); }),
		d3.max(lineData, function(c) { return d3.max(c.values, function(d) { return d.data; }); })
	]);
	
	z.domain(lineData.map(function(c) { return c.id; }));
	
	var rectWidth = (width + (width * (1 / data.length))) / ( data.length );

	var ips = g.selectAll(".ip")
		.data(lineData)
		.enter().append("g")
		.attr("class", "ip");

	ips.append('rect')
		.attr('data-time', function(d, i){ return i })
		.attr("x", function(d, i) { return x(d.values[i].time) - rectWidth / 2; })
		.attr("y", -margin.top)
		.attr("height", height+margin.top)
		.attr("width", function(){ return rectWidth })
		.attr('fill', 'grey')
		.style('opacity', 0)
		.on('mouseover', function(event){ $(this).css('opacity', 0.2) })
		.on('mouseleave', function(event){ $(this).css('opacity', 0) })
		.on('mousemove', mousemove);
		
	ips.append("path")
		.attr("class", "line")
		.attr('data-name', function(d){ return d.id; })
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); })
		.style("fill", 'none')
		.style("stroke", function(d, i){ return viz.attr.colors[i]})
		.style('stroke-width', viz.attr.lineUnselectedWidth)
		.style('pointer-events', 'none')
	
	var circle = g
		.append('g')
		.style('pointer-events', 'none');

	circle.append('circle').attr('r', 20)
		.style('opacity', 0)
		.style('fill', 'rgba(0, 0, 0, 0.2)');
		
	circle.append('circle')
		.attr('data-ctype', 'inner')
		.attr('r', 7)
		.style('opacity', 0);
	
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	var text = g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).tickFormat(d3.format(".1s")))
		
	text.append("text")
		.attr('data-legend', 'ylegend')
		.attr("y", '1em')
		.attr("x", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.attr('text-anchor', "start");
		
	text.append("text")
		.attr('data-legend', 'ylegend')
		.attr("y", '2em')
		.attr("x", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.attr('text-anchor', "start");
		
	function mousemove(event){
		var mouseX = d3.event.layerX || d3.event.offsetX;
		var mouseY = d3.event.layerY || d3.event.offsety;

		var time = d3.select(this).attr('data-time');

		var nearest = findNearest(time, mouseY);
		
		if(nearest != null && (nearest != currentLine || time != currentTime)){
			d3.select('[data-name="' + nearest + '"]').style('stroke-width', viz.attr.lineSelectedWidth);
			d3.select('[data-name="' + currentLine + '"]').style('stroke-width', viz.attr.lineUnselectedWidth)

			circle.selectAll('circle')
				.attr('cx', x(data[time]._time))
				.attr('cy', y(data[time][nearest]))
				.style('opacity', 0.9)
				
			circle.selectAll('[data-ctype="inner"]')
				.style('fill', d3.select('[data-name="' + nearest + '"]').style('stroke'))

			text.selectAll('[data-legend="ylegend"]')
				.text(function(d, i){ return ['IP: ' + nearest, 'Bytes: ' + d3.format(".5s")(data[time][nearest])][i] } );
				
			currentLine = nearest;
			currentTime = time;
			viz.viz.barViz.selectBar(nearest);
		}
		else if(nearest == null && currentLine != null){
			d3.select('[data-name="' + currentLine + '"]').style('stroke-width', viz.attr.lineUnselectedWidth)
			
			circle
				.selectAll('circle')
				.style('opacity', 0)
			
			currentLine = null;
			viz.viz.barViz.selectBar(null);
		}
	}
	
	function findNearest(time, mouseY){
		var min = Infinity;
		var ip = null;
		for(let el of lineData){
			var dataY = Math.abs(y(el.values[time].data) - mouseY + margin.top);
			if( dataY < min ){
				min = dataY; 
				ip = el.id;
			}
		}
		return min > 50 ? null : ip;
	}
}


function followedViz(viz, data){
	return new (function (){
		var parent = $('#' + viz.dom);

		var margin = {top: 20, right: 60, bottom: 30, left: 80};
		
		var outerWidth = parent.width(),
			outerHeight = parent.height();

		var svg = d3.select('#' + viz.dom)
			.append('svg')
			.attr('width', outerWidth)
			.attr('height', outerHeight);
			
		var width = outerWidth - margin.left - margin.right,
			height = outerHeight - margin.top - margin.bottom;

		var currentPoint = null;
		var tooltip = d3.select('#ftooltip');
		
		var pieWidth = 40;
			
		var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var x = d3.scaleTime().range([0, width - pieWidth]),
			y = d3.scaleBand()
				.rangeRound([height, 0])
				.padding(0.1)
				.align(0.1),
			z = d3.scaleLinear()
//			z = d3.scaleLog().base(Math.E)
				.range([3, 25]);
				
		y.domain(Object.keys(data));
		
		x.domain((function(){ 
			let set = [];
			var min = Infinity, max = 0;
			for(let arr in data){
				for(let el of data[arr]){
					min = el._time < min ? el._time : min;
					max = el._time > max ? el._time : max;
				}
			}
			return [min, max];
		})()).nice(d3.timeHour, 1);
		
		z.domain(((function(){ 
			let set = [];
			var min = Infinity, max = 0;
			for(let arr in data){
				for(let el of data[arr]){
					min = el.count < min ? el.count : min;
					max = el.count > max ? el.count : max;
				}
			}
			return [min, max];
		})()));

		g.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Sepal Width (cm)");

		g.append("g")
			.attr("class", "y axis")
			.call(d3.axisLeft(y))
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Sepal Length (cm)")
			
		g.selectAll(".dot")
			.data( (function(){ 
				let set = [];
				for(let arr in data) set = set.concat(data[arr]);
				return set;
			}))
		.enter().append("circle")
			.attr("class", "dot")
			.attr('data-sdottime', function(d){ return d._time.getTime() })
			.attr('data-sdotset', function(d){ return d['Authentication.user'] })
			.attr('data-sdottype', function(d){ return d['Authentication.action'] })
			.attr("r", function(d){ return z(d.count) })
			.attr("cx", function(d) { return x(d._time); })
			.attr("cy", function(d) { return y(d["Authentication.user"]) + y.bandwidth()/2; })
			.style("fill", function(d) { return d.count_success ? viz.attr.successColor : viz.attr.failColor })
			.style('opacity', viz.attr.deselectOpacity)
			.style('pointer-events', 'none');
		
		g.selectAll(".scattarBar")
			.data( (function(){ return Object.keys(data); }))
		.enter().append('rect')
			.attr('data-sbarid', function(d){ return d })
			.attr('y', function(d){ return y(d) })
			.attr('x', 0)
			.attr('height', y.bandwidth())
			.attr('width', width)
			.style('fill', 'grey')
			.style('opacity', 0)
			.on('mouseover', barmouseover)
			.on('mouseleave', barmouseleave)
			.on('mousemove', barmousemove);

		var totals = (function(){
			var set = {};
			for(let arr in data){
				let success = 0, fail = 0;
				for(let el of data[arr]){
					if(el.count_success){
						success += el.count;
					}
					else{
						fail += el.count;
					}
				}
				set[arr] = {
					data: [{type:'success', count: success}, {type:'fail', count: fail}]
				}
			}
			return set;
		})()

		var pie = d3.pie().sort(null).value(function(d) { return d.count; });
		var fpietooltip = d3.select('#fpietooltip');
	
		Object.keys(data).forEach(function(set, i){

			g.selectAll(".arc-" + set)
				.data(pie(totals[set].data))
				.enter().append("g")
				.attr("class", "arc")
				.attr('transform', 'translate(' + (width - pieWidth/2) + ',' + (y(set) + y.bandwidth()/2) + ')')
				.style('opacity', viz.attr.deselectOpacity)
			.append("path")
				.attr('data-pieset', set)
				.attr("d", d3.arc().outerRadius(pieWidth/2 - 4).innerRadius(0))
				.attr("fill", function(d, i) { return d.data.type == "success" ? viz.attr.successColor : viz.attr.failColor; })
				.on('mousemove', function(d){
					var mouseX = d3.event.pageX;
					var mouseY = d3.event.pageY;

					fpietooltip.style('display', 'initial')
						.style('transform', function(){
							return 'translate(' + (mouseX - $(this).outerWidth() + 20) + 'px,' + ( mouseY - ( $(this).outerHeight() + 20)) + 'px)';
						})

					var set = d3.select(this).attr('data-pieset');
						
					fpietooltip.select('#fpietooltip-user').text(set)
					fpietooltip.select('#fpietooltip-success').text(totals[set].data[0].count)
					fpietooltip.select('#fpietooltip-failure').text(totals[set].data[1].count)
					fpietooltip.select('#fpietooltip-ratio').text( (totals[set].data[0].count / totals[set].data[1].count).toPrecision(3))
				})
				.on('mouseleave', function(d){
					d3.select('#fpietooltip')
						.style('display', 'none')
				});
		})
		
		var borderx = x.range()[1];

		var border = g.append('line')
			.attr('y1', 20)
			.attr('y2', height - 20)
			.attr('x1', borderx)
			.attr('x2', borderx)
			.attr('stroke', 'grey')
			.style('pointer-events', 'none')
		
		g.append('line')
			.attr('y1', 20)
			.attr('y2', height - 20)
			.attr('x1', width)
			.attr('x2', width)
			.attr('stroke', 'grey')
			.style('pointer-events', 'none')
		
		var line = g.append('line')
			.attr('y1', 0)
			.attr('y2', height)
			.attr('stroke', 'grey')
			.style('pointer-events', 'none')
		
		g.on('mousemove', scatmousemove)
			.on('mouseover', scatmouseenter)
			.on('mouseout', scatmouseleave);
		
		function barmouseover(event){
			d3.select('[data-sbarid="' + event + '"]')
				.style('opacity', 0.3);
		}
		
		function barmouseleave(event){
			d3.select('[data-sbarid="' + event + '"]')
				.style('opacity', 0);
		}

		function barmousemove(event){
			var set = data[event];
			var mouseX = d3.event.layerX || d3.event.offsetX;
			var mouseY = d3.event.layerY || d3.event.offsetY;
			
			mouseX -= margin.left;
			
			var point = findNearest(mouseX, set);

			if(currentPoint != null){
				d3.select('[data-sdottime="' + currentPoint._time.getTime() + '"]' +
					'[data-sdotset="' + currentPoint["Authentication.user"] + '"]' +
					'[data-sdottype="' + currentPoint["Authentication.action"] + '"]')
					.style('opacity', viz.attr.deselectOpacity)
					.attr("r", function(d){ return z(d.count) });
			}
			
			if(point == null){
				tooltip.style('display', 'none');
				return
			}
			
			d3.select('[data-sdottime="' + point._time.getTime() + '"]' +
					'[data-sdotset="' + point["Authentication.user"] + '"]' +
					'[data-sdottype="' + point["Authentication.action"] + '"]')
				.style('opacity', viz.attr.selectOpacity)
				.attr("r", function(d){ return z(d.count)*2 });
			
			tooltip
				.style('display', 'initial')
				.style('transform', function() {
					var clip = d3.event.pageX > width*.9;
					
					return 'translate(' + ( d3.event.pageX + 20 - ( clip ? $(this).outerWidth() : 0)) + 'px, ' +
						( d3.event.pageY - ( clip ? $(this).outerHeight() + 20 : $(this).outerHeight() / 2 )) + 'px)'
				});
			
			let d = point._time.toString();
			let date = d.split(' GMT').slice(0, 1);
			
			d3.select('#ftooltip-action').text(point["Authentication.action"])
			d3.select('#ftooltip-user').text(point["Authentication.user"])
			d3.select('#ftooltip-time').text(date)
			d3.select('#ftooltip-count').text(point.count);
				
			currentPoint = point;
		}

		function scatmousemove(event){

			var mouseX = d3.event.layerX || d3.event.offsetX;
			
			mouseX -= margin.left;
			
			line.attr('x1', mouseX)
				.attr('x2', mouseX)
		}
		
		function scatmouseenter(){
//			line.style('display', 'none');
//			tooltip.style('display', 'none');
		}
		
		function scatmouseleave(){
//			line.style('display', 'initial');
//			tooltip.style('display', 'initial');
		}
		
		function findNearest(num, arr){

			if(arr.length == 0) return null;
			if(arr.length == 1) return arr[0];

			for(var i = 0; i < arr.length-1; i++){

				let here = x(arr[i]._time);
				let next = x(arr[i+1]._time);

				if(num < next){
					let result = Math.abs(num - here) <= Math.abs(num - next) ? arr[i] : arr[i+1];
					return Math.abs(num - x(result._time)) > 50 ? null : result;
				}
			}

			return Math.abs(num - x(arr[arr.length - 1]._time)) > 50 ? null : arr[arr.length - 1];
		}
	})()
}



function retrieveJson(url, callback, obj){

	$.ajax({
		dataType: "json",
		url: url,
		success: success,
		error: error
	})
	
	function success(data, status){
		data = obj.format(data);
		callback(obj, data);
	}
	
	function error(jqxhr, textStatus, error){
		console.log( textStatus );
		console.log( error );
	}
}


function formatFollowedData(data){

	var set = {};

	for(let el of data){
		el = el.result;

		let user = el['Authentication.user'];
		
		if(!set[user])
			set[user] = [];

		el._time = new Date(el._time);
		el.incident_count = parseInt(el.incident_count);
		el.count = parseInt(el.count);
		set[user].push(el);
	}

	for(let arr in set){
		set[arr].sort(function(a, b){
			return a._time <= b._time ? -1 : 1
		})
	}

	return set;
}

function formatTimeData(data){
	var set = [];
	
	for(let d of data){
		let el = {};
		
		for(let e in d.result){
			if(e == '_time'){
				var date = new Date(d.result[e]);
				el[e] = date;
			}
			else{
				el[e] = d.result[e];
			}
		}
		
		set.push(el);
	}

	return set;
}


function formatTrafficData(data){

	var set = {
		name: "root",
		children: [],
		colorKey: {}
	};
	
	set.children.src = {
				name: "src",
				children: []
			}
	set.children.dest = {
				name: "dest",
				children: []
			}
			
	set.children.push(set.children.src);
	set.children.push(set.children.dest);

	for(let i = 0; i < data.length; i++){
		var src = data[i]['result']['All_Traffic.src'];
		var dest = data[i]['result']['All_Traffic.dest'];

		var srcchild = set.children.src.children;
		var destchild = set.children.dest.children;

		if(!srcchild[src]){
			srcchild[src] = {
				name: data[i]['result']['All_Traffic.src'],
				value: 0,
				type: 'src',
				destIPs: {},
				colorCode: colors.new()
			};
			srcchild.push(srcchild[src]);
			set.colorKey[srcchild[src].colorCode] = srcchild[src];
		}
		
		srcchild[src].value += parseInt(data[i]['result']['sum_bytes']);
		
		if(!destchild[dest]){
			destchild[dest] = {
				name: data[i]['result']['All_Traffic.dest'],
				value: 0,
				type: 'dest',
				srcIPs: {},
				colorCode: colors.new()
			};
			destchild.push(destchild[dest]);
			set.colorKey[destchild[dest].colorCode] = destchild[dest];
		}
		
		destchild[dest].value += parseInt(data[i]['result']['sum_bytes']);
		
		srcchild[src].destIPs[dest] = destchild[dest];
		destchild[dest].srcIPs[src] = srcchild[src];
	}

	return set;
}

const colors = new (function(){

	var r = 0, g = 0, b = 0;
	var cycle = 0, inc = 10;
	
	this.new = function(){
		
		r++;
		
		if(r >= 256){
			r = 0;
			g++;
		}
		
		if(g >= 256){
			g = 0;
			b++;
		}
		
		if(b >= 256){
			return -1;
		}
		
		cycle %= 3;
		
		return r + ',' + g + ',' + b;
	}
})()

})();






















