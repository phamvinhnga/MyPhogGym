(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('app.utils', ['ui.router', 'app.abp.oauth'])
        .factory('utilsService', utilsService);

    /** @inject */
    function utilsService($log, $state, abpAuthService) {
        var colors = [];

        var service = {
            addItemToArray: addItemToArray,
            updateItemInArray: updateItemInArray,
            remoteItemFromArray: remoteItemFromArray,
            findIndexInArray: findIndexInArray,
            getParamsFromTableState: getParamsFromTableState,
            getParamsFromMdTable: getParamsFromMdTable,
            hasPermissionForState: hasPermissionForState,
            exactDateUTC: exactDateUTC,
            createInterval: createInterval
        };

        return service;

        /**
         * Add item to array of items
         * @param {Array} arr
         * @param {Object} obj
         */
        function addItemToArray(arr, obj) {
            arr.push(obj);
        }

        /**
         * Update item in array
         * @param {Array} arr
         * @param {Object} obj
         */
        function updateItemInArray(arr, obj) {
            var index = findIndexInArray(arr, obj.id);
            if (index > -1) _.assignIn(arr[index], obj);
        }

        /**
         * remove item from array
         * @param {Array} arr
         * @param {Object} obj
         */
        function remoteItemFromArray(arr, obj) {
            var index = findIndexInArray(arr, obj.id);
            if (index > -1) arr.splice(index, 1);
        }

        /**
         * find index in array of item by id
         * @param {Array} array
         * @param {Number} id
         */
        function findIndexInArray(array, id) {
            return _.findIndex(array, function (o) {
                return o.id === id;
            });
        };

        /**
         * get param for query from smart table
         * @param {type} tableState
         * @param {type} options
         * @returns {type}
         */
        function getParamsFromTableState(tableState, options) {
            if (!tableState) {
                return {};
            }

            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.

            var sortField = tableState.sort.predicate || options.sort;

            var sortDir = angular.isDefined(tableState.sort.reverse) ? (tableState.sort.reverse ? 'DESC' : 'ASC') : options.sortDir ? options.sortDir : 'DESC';

            var predicateObject = tableState.search.predicateObject;

            var criterias = [];
            if (predicateObject) {
                Object.keys(predicateObject).forEach(function (key) {
                    var value = predicateObject[key],
                        operator;

                    if (value instanceof Object) {
                        operator = value.operator || 'eq';
                        value = value.value || value;
                    } else {
                        operator = "startsWith";
                    }

                    criterias.push({
                        propertyName: key,
                        operationName: convertOperator(operator),
                        value: value
                    })
                });
            }

            return {
                //orderName: sortField,
                //orderDir: sortDir,
                sorting: sortField + ' ' + sortDir,
                skipCount: start,
                maxResultCount: number,
                criterias: criterias
            };
        }

        /**
         * convert short code to operator
         * @param {type} op
         * @returns {type}
         */
        function convertOperator(op) {
            return {
                eq: "Equals",
                neq: "NotEquals",
                lt: "LessThan",
                lte: "LessThanOrEqual",
                gt: "GreaterThan",
                gte: "GreaterThanOrEqual",
                startswith: "StartsWith",
                endswith: "EndsWith",
                contains: "Contains"
            }[op];
        }

        /**
         * get param from md table
         * @param {Object} options {maxResultCount, order, page, search}
         * @returns {type}
         */
        function getParamsFromMdTable(options) {
            var number = options.maxResultCount || 10;  // Number of entries showed per page.
            var start = (options.page - 1) * number;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

            var sortField = options.order;
            var sortDir = sortField.indexOf('-') === 0 ? 'DESC' : 'ASC';
            //santizie sort field
            if (sortField.indexOf('-') === 0) {
                sortField = sortField.substr(1);
            }

            var predicateObject = options.search;

            var criterias = [];
            if (angular.isObject(predicateObject)) {
                Object.keys(predicateObject).forEach(function (key) {
                    var value = predicateObject[key],
                        operator;

                    if (value instanceof Object) {
                        operator = value.operator || 'eq';
                        value = value.value || value;
                    } else {
                        operator = "startsWith";
                    }

                    criterias.push({
                        propertyName: key,
                        operationName: convertOperator(operator),
                        value: value
                    });
                });
            } else if (predicateObject) {
                // string search, add global search
                criterias.push({
                    propertyName: '$',
                    operationName: convertOperator('eq'),
                    value: predicateObject
                });
            }

            return {
                //orderName: sortField,
                //orderDir: sortDir,
                sorting: sortField ? sortField + ' ' + sortDir : null,
                skipCount: start,
                maxResultCount: number,
                criterias: criterias
            };
        }

        /**
         * get extact date from datepicker
         * @param {type} dateObj
         * @returns {type}
         */
        function exactDateUTC(dateObj) {
            var value = moment(dateObj);

            return moment.utc({ year: value.year(), month: value.month(), day: value.date() }).toDate();
        }

        /**
         * check permission to show/hide navigation
         * @param {Object} states
         * @param {Function} function to check permissions
         * @return {boolean}
         */
        function hasPermissionForState(states) {
            states = angular.isArray(states) ? states : [states];

            return function () {
                var isShow = _.some(states, function (stateName) {
                    var stateData = $state.get(stateName);

                    if (!stateData) {
                        return false;
                    }

                    var permissions = stateData.data && stateData.data.permissions;
                    if (permissions) {
                        return abpAuthService.hasPermissions(permissions);
                    }

                    return false;
                });

                return !isShow;
            }
        }

        /**
         * create list of intervals
         * TODO should base on user config
         * for first column
         * - when weekday in Mon,Tue,Wed ---> day -- Sun (in same week)
         * - when weekday after Wed --> day -- Sun (in next week)
         * for second column
         * - when day in 1 - 20 --> day -- last in same month
         * - when day other --> day -- last in next month
         * for thrid column
         * - begin with end day of column
         * @returns {type}
         */
        function createInterval() {
            var intervals = [];

            var startDate = moment();
            var endDate = moment();
            //first column
            if ([1, 2, 3].indexOf(endDate.day()) > -1) {
                endDate = endDate.endOf('isoweek');
            } else {
                endDate = endDate.add(1, 'week').endOf('isoweek');
            }
            startDate.locale('vi'); //TODO use config in global
            endDate.locale('vi'); //TODO use config in global
            intervals.push({
                startTitle: startDate.format("DD-MM ddd"),
                endTitle: endDate.format("DD-MM ddd"),
                startDate: startDate,
                endDate: endDate
            });

            //second column
            startDate = moment(endDate).add(1, 'day');
            endDate = moment(startDate);
            if (endDate.date() > 20) {
                endDate = endDate.add(1, 'month').endOf('month');
            } else {
                endDate = endDate.endOf('month');
            }
            startDate.locale('vi'); //TODO use config in global
            endDate.locale('vi'); //TODO use config in global
            intervals.push({
                startTitle: startDate.format("DD-MM ddd"),
                endTitle: endDate.format("DD-MM ddd"),
                startDate: startDate,
                endDate: endDate
            });

            //thrid column
            startDate = moment(endDate).add(1, 'day');
            endDate = moment().add('999', 'year');
            startDate.locale('vi'); //TODO use config in global
            intervals.push({
                startTitle: startDate.format("DD-MM ddd"),
                endTitle: '',
                startDate: startDate,
                endDate: endDate
            });

            return intervals;
        }
    }
})();