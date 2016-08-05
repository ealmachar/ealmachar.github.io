app.controller('mainBodyController', ['$scope', function($scope){
	$scope.templates = [
		{ name: 'resume', url: 'src/html/resume.html'},
		{ name: 'blank', url: 'src/html/blank.html'}
	]
	
	$scope.template = $scope.templates[0];
}]);