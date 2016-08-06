app.controller('mainBodyController', ['$scope', function($scope){
	
	$scope.tab = 'resume';
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		blank: 'src/html/pattern.html'
	}
	
	$scope.$show = function(page){
		$scope.tab = page;
		
		if(page == 'pattern'){
			patternInit();
		}
	}
	
	$scope.template = $scope.templates[$scope.tab];
}]);