app.controller('mainBodyController', ['$scope', function($scope){
	
	$scope.tab = 'resume';
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		blank: 'src/html/blank.html'
	}
	
	$scope.$watch(
		'tab',
		function(){
			$scope.template = $scope.templates[$scope.tab];
		}
	)
	
	$scope.template = $scope.templates[$scope.tab];
}]);