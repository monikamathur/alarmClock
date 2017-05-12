app
    .controller('homePageCtrl',[ '$scope', '$interval', '$uibModal', '$filter', 'toaster', '$timeout' ,  function ($scope, $interval, $uibModal, $filter, toaster, $timeout) {

        var selectedWeekDays = [];
        var alarmDataObj = {};

        $scope.alarmTime = new Date();
        $scope.allAlarms = [];
        $scope.currentAlarm = {};
        $scope.isShown = false;
        $scope.showAlarm = false;
        $scope.time = "";
        $scope.weekdays = {
            isMon: 'Monday',
            isTue: 'Tuesday',
            isWed: 'Wednesday',
            isThr: 'Thrusday',
            isFri: 'Friday',
            isSat: 'Saturday',
            isSun: 'Sunday'
        };
        if (JSON.parse(window.localStorage.getItem('alarmList'))) {
            $scope.allAlarms = JSON.parse(window.localStorage.getItem('alarmList'));
        }

        console.log($scope.allAlarms);

        $scope.clockTime = clockTime;
        $scope.closeModal = closeModal;
        $scope.closeAlarm = closeAlarm;
        $scope.deleteAlarm = deleteAlarm;
        $scope.getDayName = getDayName;
        $scope.onInIt = onInIt;
        $scope.onSetRecurring = onSetRecurring;
        $scope.openModal = openModal;
        $scope.setRecurringDay = setRecurringDay;
        $scope.saveAlarm = saveAlarm;

        function onInIt(){
            checkAllDueAlarm();
            $interval(clockTime, 1000);
        }

        /*
         * Method for get current date and time
         * */
        function clockTime() {
            $scope.time = Date.now();
            // check if alarm list is empty
            if (JSON.parse(window.localStorage.getItem('alarmList'))) {
                $scope.allAlarms.forEach(function (alarm, index) {
                    // check if recurring array is empty
                    if (alarm.recurringDays.length > 0) {
                        $scope.$watch('$scope.time.getDay()', function () {
                            alarm.isShown = false;
                        });
                        alarm.recurringDays.forEach(function (day) {
                            // check when current time is matches with alarm time if alarm object has recurring days array
                            if ($filter('date')(alarm.time, 'HH:mm') == $filter('date')(Date.now($scope.time), 'HH:mm') && day === new Date().getDay()) {
                                $scope.showAlarm = true;
                                alarm.isShown = true;
                                $scope.currentAlarm = alarm;
                            }
                        });
                    } else {
                        // check when current time is matches with alarm time and alarm object has empty recurring days array
                        if ($filter('date')(alarm.time, 'HH:mm') == $filter('date')(Date.now($scope.time), 'HH:mm') && $filter('date')(alarm.time, 'dd-MM-yy') == $filter('date')(new Date(), 'dd-MM-yy') && !alarm.isShown) {
                            $scope.showAlarm = true;
                            alarm.isShown = true;
                            $scope.currentAlarm = alarm;
                        }
                    }

                });
            }
            // condition for close alarm in 25 seconds
            if ($scope.showAlarm) {
                $timeout(function () {
                    $scope.showAlarm = false;
                }, 25000);
            }
        }

        /*
         * method for reset weekdayss array when unchecked
         * */
        function onSetRecurring(isRecurring) {
            if (!isRecurring)
                selectedWeekDays = [];
        }

        /*
         *  method for set recurring days for alarm
         * */
        function setRecurringDay(key, value) {
            if (key) {
                selectedWeekDays.push(value);
            } else {
                var index = selectedWeekDays.indexOf(value);
                if (index > -1) {
                    selectedWeekDays.splice(index, 1);
                }
            }
        }

        /*
         * Method for show toast
         * */
        function showToaster(type, title, message) {
            toaster.pop(type, title, message);

        };

        /*
         * Method for open set alarm modal
         * */
        function openModal() {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                scope: $scope
            });
        }

        /*
         * Method for close set alarm modal
         * */
        function closeModal() {
            $scope.modalInstance.dismiss();//$scope.modalInstance.close() also works I think
            var selectedWeekDays = [];
        };

        /*
         * Method for save alarm
         * */
        function saveAlarm() {
            var dayArray = [];
            selectedWeekDays.forEach(function (day) {
                switch (day) {
                    case 'Sunday':
                        dayArray.push(1);
                        break;
                    case 'Monday':
                        dayArray.push(2);
                        break;
                    case 'Tuesday':
                        dayArray.push(3);
                        break;
                    case 'Wednesday':
                        dayArray.push(4);
                        break;
                    case 'Thursday':
                        dayArray.push(5);
                        break;
                    case 'Friday':
                        dayArray.push(6);
                        break;
                    case 'Saturday':
                        dayArray.push(7);
                        break;
                }
            })


            alarmDataObj = {
                time: $scope.alarmTime,
                recurringDays: dayArray,
                isShown: false,
                isDue: true
            };

            if (!JSON.parse(window.localStorage.getItem('alarmList')) || JSON.parse(window.localStorage.getItem('alarmList') == null)) {
                var alarmList = [];
                alarmList.push(alarmDataObj);
                window.localStorage.setItem("alarmList", JSON.stringify(alarmList));
            } else {
                alarmList = window.localStorage.getItem('alarmList');
                alarmList = JSON.parse(alarmList);
                alarmList.push(alarmDataObj);
                window.localStorage.setItem("alarmList", JSON.stringify(alarmList));
            }
            $scope.allAlarms = [];
            $scope.allAlarms = JSON.parse(window.localStorage.getItem('alarmList'));

            showToaster('success', 'Alarm', " alarm successfully set ");
            closeModal();
        }

        /*
         * Method for delete alarm
         * ]*/
        function deleteAlarm(index) {

            if (index > -1) {
                $scope.allAlarms.splice(index, 1);
            }
            window.localStorage.setItem("alarmList", JSON.stringify($scope.allAlarms));
            showToaster('success', 'Alarm', " alarm deleted successfully ");
        }

        /*
         * method for close alarm
         * */
        function closeAlarm(alarmObj) {
            var index = $scope.allAlarms.indexOf(alarmObj);
            $scope.allAlarms[index].isDue = false;
            window.localStorage.setItem("alarmList", JSON.stringify($scope.allAlarms));
            $scope.showAlarm = false;
        }

        /*
         * method for check all alarm
         * */
        function checkAllDueAlarm() {
            var currentDate = new Date();
            $scope.allAlarms.forEach(function (alarmObj) {
                if (new Date(alarmObj.time).getTime() < currentDate.getTime() && alarmObj.isDue) {
                    var message = $filter('date')(alarmObj.time, 'dd-MM-yy HH:mm') + " Due";
                    toaster.pop({
                        type: 'info',
                        title: 'Pending Alarm',
                        body: message,
                        timeout: 15000
                    });

                }
            });
        }

        function getDayName(day){
            switch (day) {
                case 1:
                    return 'Sun';
                case 2:
                    return 'Mon';
                case 3:
                    return 'Tue';
                case 4:
                    return 'Wed';
                case 5:
                    return 'Thu';
                case 6:
                    return 'Fri';
                case 7:
                    return 'Sat';
            }
        }


    }]);