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
		update: function(){
			pattern.attributes.order = $scope.pattern.order*.01;
			pattern.attributes.density = $scope.pattern.density/50;
			pattern.update();
		}
	}
}]);