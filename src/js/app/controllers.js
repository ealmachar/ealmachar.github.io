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
		order: 0,
		density: 50,
		updatePass: true,
		update: function(type){
			if($scope.pattern.updatePass){
//				var t0 = performance.now();
				if(type == 'order')
					pattern.attributes.order = $scope.pattern.order*.01;
				if(type == 'density')
					pattern.attributes.density = $scope.pattern.density/50;
				
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