app.controller('mainBodyController', ['$scope', function($scope){
	
	$scope.tab = 'resume';
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		blank: 'src/html/blank.html'
	}
	
	$scope.template = $scope.templates[$scope.tab];
}]);