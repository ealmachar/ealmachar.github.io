app.controller('mainBodyController', ['$scope', '$window', 'patternService', function($scope, $window, patternService){
	
	$scope.tab = 'resume';
	
	$scope.pattern = patternService.pattern;
	
	$scope.templates = {
		resume: 'src/html/resume.html',
		pattern: 'src/html/pattern.html'
	}
	
	$scope.show = function(page){
		$scope.tab = page;
		$scope.template = $scope.templates[$scope.tab];
	}
	/*
	$scope.loadPattern = function(){
		if($scope.tab == 'pattern'){
			patternService.pattern.init();
			patternService.pattern.update();
		}
	}*/

	$scope.template = $scope.templates[$scope.tab];

	var imageHeight = 1590;
	var body = document.body;
	

	$window.onscroll = function() {
		var referenceHeight = body.scrollHeight - window.innerHeight;
		var percentage = body.scrollTop/referenceHeight;
		var imageOffset = percentage * (imageHeight - window.innerHeight);
		body.style.backgroundPosition = "center -" + imageOffset + "px";
	};
	
}]);