app
    .controller('homePageCtrl', function ($scope, $interval, $uibModal, $filter, toaster) {

        var selectedWeekDays = [];
        var alarmDataObj = {};
        $scope.time = "";
        $scope.ismeridian = true;
        $scope.alarmTime = new Date();
        $scope.isShown = false;
        $scope.allAlarms = [];
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

        $scope.clockTime = clockTime;
        $scope.onSetRecurring = onSetRecurring;
        $scope.setRecurringDay = setRecurringDay;
        $scope.openModal = openModal;
        $scope.closeModal = closeModal;
        $scope.saveAlarm = saveAlarm;
        $scope.closeAlarm = closeAlarm;
        $scope.deleteAlarm = deleteAlarm;

        /*
         * Method for get current date and time
         * */
        function clockTime() {
            $scope.time = Date.now();
            if (JSON.parse(window.localStorage.getItem('alarmList'))) {
                $scope.allAlarms.forEach(function (alarm, index) {
                    if (alarm.recurringDays.length > 0) {
                        $scope.$watch('$scope.time.getDay()', function() {
                            alarm.isShown = false;
                        });
                        alarm.recurringDays.forEach(function (day) {
                            switch (day) {
                                case 'Sunday':
                                    day = '1';
                                    break;
                                case 'Monday':
                                    day = "2";
                                    break;
                                case 'Tuesday':
                                    day = "3";
                                    break;
                                case 'Wednesday':
                                    day = "4";
                                    break;
                                case 'Thursday':
                                    day = "5";
                                    break;
                                case 'Friday':
                                    day = "6";
                                    break;
                                case 'Saturday':
                                    day = "7";
                            }

                            if ($filter('date')(alarm.time, 'HH:mm') == $filter('date')(Date.now($scope.time), 'HH:mm') && day === new Date().getDay()) {
                                $scope.showAlarm = true;
                                alarm.isShown = true;
                            }
                        });
                    } else {
                        if ($filter('date')(alarm.time, 'HH:mm') == $filter('date')(Date.now($scope.time), 'HH:mm') && $filter('date')(alarm.time, 'dd-MM-yy') == $filter('date')(new Date, 'dd-MM-yy')&& !alarm.isShown) {
                            $scope.showAlarm = true;
                            alarm.isShown = true;
                        }
                    }

                });
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

        $interval(clockTime, 1000);

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
            alarmDataObj = {
                time: $scope.alarmTime,
                recurringDays: selectedWeekDays,
                isShown : false
            };
            if (!JSON.parse(window.localStorage.getItem('alarmList')) || JSON.parse(window.localStorage.getItem('alarmList') == null)) {
                var alarmList = [];
                alarmList.push(alarmDataObj);
                console.log(alarmList, 'if');
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

        function deleteAlarm(index) {

            if (index > -1) {
                $scope.allAlarms.splice(index, 1);
            }
            window.localStorage.setItem("alarmList", JSON.stringify($scope.allAlarms));
            showToaster('success', 'Alarm', " alarm deleted successfully ");
        }

        function closeAlarm(){
            $scope.showAlarm = false;
        }

    })