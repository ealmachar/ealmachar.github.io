




(function myreact(){
	var data = [
		{
			title: 'Man made satellites',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/satellitevis-canvas/index.html',
			image: 'src/images/9.jpg'
		},
		{
			title: 'Iris flower data set',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/flowervis/index.html',
			image: 'src/images/10.jpg'
		},
		{
			title: 'Bay area bike station activity',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/datavis/index.html',
			image: 'src/images/8.jpg'
		},
		{
			title: 'N-body solarsystem simulation',
			des: ['WebGL: THREEjs'],
			link: 'http://ealmachar.github.io/projects/solarsystem/index.html',
			image: 'src/images/2.jpg'
		},
		{
			title: 'Topological system mapper',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/systemtopology/index.html',
			image: 'src/images/7.jpg'
		},
		{
			title: 'Radial svg menu',
			des: ['SVG'],
			link: 'http://ealmachar.github.io/projects/svg-site/index.html',
			image: 'src/images/1.jpg'
		},
		{
			title: 'Reports2',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/reports2/index.html',
			image: 'src/images/5.jpg'
		},
		{
			title: 'Linegraph3d',
			des: ['WebGL: THREEjs'],
			link: 'http://ealmachar.github.io/projects/linegraph3d/index.html',
			image: 'src/images/6.jpg'
		},
		{
			title: 'Reports',
			des: ['SVG: D3js'],
			link: 'http://ealmachar.github.io/projects/reports/reports.html',
			image: 'src/images/3.jpg'
		},
		{
			title: 'Pattern',
			des: ['Canvas'],
			link: 'http://ealmachar.github.io/projects/pattern/index.html',
			image: 'src/images/4.jpg'
		},
	]
	
	const e = React.createElement;
	
	class Project extends React.Component{

		render(){
			var body = data.map(function(d){
				return e('Project', {
					'className' : 'pblock',
					'onClick' : () => d.a.click()
					},
					[
						e('div', { className: 'projectTextConainter' }, [
							e('div', { className: 'ptitle'}, d.title),
							e('div', { className: 'pdes'}, d.des.map(function(d){
								return e('div', null, d)
							}))
						]),
						e('div', {
							className: 'projectImage',
							style: { backgroundImage: 'url("' + d.image + '")' }
						}, null),
						e('a', {
							href: d.link,
							target: '_blank',
							ref: (a) => d.a = a
						}, null)
					]
				);
			});
			
			return e('div', null, body)
		}
	}

	ReactDOM.render(
		e(Project, null, null),
		document.getElementById('projects')
	);
})()


