app.controller('mainBodyController', ['$scope', function($scope){
	
	$scope.tab = 'resume';
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		pattern: 'src/html/pattern.html'
	}
	
	$scope.show = function(page){
		$scope.tab = page;
		$scope.template = $scope.templates[$scope.tab];
	}
	
	$scope.mainLoaded = function(){
		if($scope.tab == 'pattern'){
			pattern.init();
			pattern.update();
		}
	}
	
	$scope.template = $scope.templates[$scope.tab];
	
	$scope.pattern = {
		order: pattern.attributes.order,
		density: pattern.attributes.density,
		r: pattern.attributes.r,
		g: pattern.attributes.g,
		b: pattern.attributes.b,
		rgbVariance: pattern.attributes.rgbVariance,
		gradient: pattern.attributes.gradient,
		updatePass: true,
		update: function(){
			if($scope.pattern.updatePass){
//				var t0 = performance.now();

				pattern.attributes.order = $scope.pattern.order*.01;

				pattern.attributes.density = $scope.pattern.density/50;
				
				pattern.attributes.r = $scope.pattern.r;
				pattern.attributes.g = $scope.pattern.g;
				pattern.attributes.b = $scope.pattern.b;
				pattern.attributes.rgbVariance = $scope.pattern.rgbVariance;
				pattern.attributes.gradient = $scope.pattern.gradient;
				
				pattern.update();
//				var t1 = performance.now();
//				console.log((t1 - t0) + " milliseconds.")
				$scope.pattern.updatePass = false;
				setTimeout(function(){
					$scope.pattern.updatePass = true;
				}, 100);
			}
		}
	}
}]);
