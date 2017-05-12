describe('testing App', function () {

    beforeEach(module('alarm'));

    var controller;

    beforeEach(inject(function ($controller) {
        controller = $controller;
    }));
    describe('deleteAlarm', function () {
        it(' it should delete data from alam list', function () {
            var $scope = {};
            var index = 1;
            var controllers = controller('homePageCtrl', {$scope: $scope});

            $scope.allAlarms = [
            {
                isDue : true,
                isShown:false,
                recurringDays : [2,3,4,7],
                time : "2017-05-11T14:10:48.559Z"
            },
            {
                isDue : true,
                isShown:false,
                recurringDays : [],
                time : "2017-05-11T14:10:48.559Z"
            }
        ];
           var allAlarmsResult = [
                {
                    isDue : true,
                    isShown:false,
                    recurringDays : [2,3,4,7],
                    time : "2017-05-11T14:10:48.559Z"
                }
            ];
        if (index > -1) {
            $scope.allAlarms.splice(index, 1);
        }
            expect($scope.allAlarms ).toEqual([
                {
                    isDue : true,
                    isShown:false,
                    recurringDays : [2,3,4,7],
                    time : "2017-05-11T14:10:48.559Z"
                }
            ]);

        });

    })

});