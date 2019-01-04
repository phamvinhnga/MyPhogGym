(function () {
    'use strict';

    angular
        .module('app.core')
        .provider('msNavigationService', msNavigationServiceProvider);

    /** @ngInject */
    function msNavigationServiceProvider() {
        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        // Navigation array
        var navigation = [];

        var service = this;

        // Methods
        service.saveItem = saveItem;
        service.deleteItem = deleteItem;
        service.sortByWeight = sortByWeight;

        //////////

        /**
         * Create or update the navigation item
         *
         * @param path
         * @param item
         */
        function saveItem(path, item) {
            if (!angular.isString(path)) {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            var parts = path.split('.');

            // Generate the object id from the parts
            var id = parts[parts.length - 1];

            // Get the parent item from the parts
            var parent = _findOrCreateParent(parts);

            // Decide if we are going to update or create
            var updateItem = false;

            for (var i = 0; i < parent.length; i++) {
                if (parent[i]._id === id) {
                    updateItem = parent[i];

                    break;
                }
            }

            // Update
            if (updateItem) {
                angular.extend(updateItem, item);

                // Add proper ui-sref
                updateItem.uisref = _getUiSref(updateItem);
            }
            // Create
            else {
                // Create an empty children array in the item
                item.children = [];

                // Add the default weight if not provided or if it's not a number
                if (angular.isUndefined(item.weight) || !angular.isNumber(item.weight)) {
                    item.weight = 1;
                }

                // Add the item id
                item._id = id;

                // Add the item path
                item._path = path;

                // Add proper ui-sref
                item.uisref = _getUiSref(item);

                // Push the item into the array
                parent.push(item);
            }
        }

        /**
         * Delete navigation item
         *
         * @param path
         */
        function deleteItem(path) {
            if (!angular.isString(path)) {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            // Locate the item by using given path
            var item = navigation,
                parts = path.split('.');

            for (var p = 0; p < parts.length; p++) {
                var id = parts[p];

                for (var i = 0; i < item.length; i++) {
                    if (item[i]._id === id) {
                        // If we have a matching path,
                        // we have found our object:
                        // remove it.
                        if (item[i]._path === path) {
                            item.splice(i, 1);
                            return true;
                        }

                        // Otherwise grab the children of
                        // the current item and continue
                        item = item[i].children;
                        break;
                    }
                }
            }

            return false;
        }

        /**
         * Sort the navigation items by their weights
         *
         * @param parent
         */
        function sortByWeight(parent) {
            // If parent not provided, sort the root items
            if (!parent) {
                parent = navigation;
                parent.sort(_byWeight);
            }

            // Sort the children
            for (var i = 0; i < parent.length; i++) {
                var children = parent[i].children;

                if (children.length > 1) {
                    children.sort(_byWeight);
                }

                if (children.length > 0) {
                    sortByWeight(children);
                }
            }
        }

        /* ----------------- */
        /* Private Functions */
        /* ----------------- */

        /**
         * Find or create parent
         *
         * @param parts
         * @returns {Array|Boolean}
         * @private
         */
        function _findOrCreateParent(parts) {
            // Store the main navigation
            var parent = navigation;

            // If it's going to be a root item
            // return the navigation itself
            if (parts.length === 1) {
                return parent;
            }

            // Remove the last element from the parts as
            // we don't need that to figure out the parent
            parts.pop();

            // Find and return the parent
            for (var i = 0; i < parts.length; i++) {
                var _id = parts[i],
                    createParent = true;

                for (var p = 0; p < parent.length; p++) {
                    if (parent[p]._id === _id) {
                        parent = parent[p].children;
                        createParent = false;

                        break;
                    }
                }

                // If there is no parent found, create one, push
                // it into the current parent and assign it as a
                // new parent
                if (createParent) {
                    var item = {
                        _id: _id,
                        _path: parts.join('.'),
                        title: _id,
                        weight: 1,
                        children: []
                    };

                    parent.push(item);
                    parent = item.children;
                }
            }

            return parent;
        }

        /**
         * Sort by weight
         *
         * @param x
         * @param y
         * @returns {number}
         * @private
         */
        function _byWeight(x, y) {
            return parseInt(x.weight) - parseInt(y.weight);
        }

        /**
         * Setup the ui-sref using state & state parameters
         *
         * @param item
         * @returns {string}
         * @private
         */
        function _getUiSref(item) {
            var uisref = '';

            if (angular.isDefined(item.state)) {
                uisref = item.state;

                if (angular.isDefined(item.stateParams) && angular.isObject(item.stateParams)) {
                    uisref = uisref + '(' + angular.toJson(item.stateParams) + ')';
                }
            }

            return uisref;
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */

        this.$get = function () {
            var activeItem = null,
                navigationScope = null,
                folded = null,
                foldedOpen = null;

            var service = {
                saveItem: saveItem,
                deleteItem: deleteItem,
                sort: sortByWeight,
                clearNavigation: clearNavigation,
                setActiveItem: setActiveItem,
                getActiveItem: getActiveItem,
                getNavigation: getNavigation,
                getFlatNavigation: getFlatNavigation,
                setNavigationScope: setNavigationScope,
                setFolded: setFolded,
                getFolded: getFolded,
                setFoldedOpen: setFoldedOpen,
                getFoldedOpen: getFoldedOpen,
                toggleFolded: toggleFolded
            };

            return service;

            //////////

            /**
             * Clear the entire navigation
             */
            function clearNavigation() {
                // Clear the navigation array
                navigation = [];

                // Clear the vm.navigation from main controller
                if (navigationScope) {
                    navigationScope.vm.navigation = navigation;
                }
            }

            /**
             * Set active item
             *
             * @param node
             * @param scope
             */
            function setActiveItem(node, scope) {
                activeItem = {
                    node: node,
                    scope: scope
                };
            }

            /**
             * Return active item
             */
            function getActiveItem() {
                return activeItem;
            }

            /**
             * Return navigation array
             *
             * @param root
             * @returns Array
             */
            function getNavigation(root) {
                if (root) {
                    for (var i = 0; i < navigation.length; i++) {
                        if (navigation[i]._id === root) {
                            return [navigation[i]];
                        }
                    }

                    return null;
                }

                return navigation;
            }

            /**
             * Return flat navigation array
             *
             * @param root
             * @returns Array
             */
            function getFlatNavigation(root) {
                // Get the correct navigation array
                var navigation = getNavigation(root);

                // Flatten the navigation object
                return _flattenNavigation(navigation);
            }

            /**
             * Store navigation's scope for later use
             *
             * @param scope
             */
            function setNavigationScope(scope) {
                navigationScope = scope;
            }

            /**
             * Set folded status
             *
             * @param status
             */
            function setFolded(status) {
                folded = status;
            }

            /**
             * Return folded status
             *
             * @returns {*}
             */
            function getFolded() {
                return folded;
            }

            /**
             * Set folded open status
             *
             * @param status
             */
            function setFoldedOpen(status) {
                foldedOpen = status;
            }

            /**
             * Return folded open status
             *
             * @returns {*}
             */
            function getFoldedOpen() {
                return foldedOpen;
            }

            /**
             * Toggle fold on stored navigation's scope
             */
            function toggleFolded() {
                navigationScope.toggleFolded();
            }

            /**
             * Flatten the given navigation
             *
             * @param navigation
             * @private
             */
            function _flattenNavigation(navigation) {
                var flatNav = [];

                for (var x = 0; x < navigation.length; x++) {
                    // Copy and clear the children of the
                    // navigation that we want to push
                    var navToPush = angular.copy(navigation[x]);
                    navToPush.children = [];

                    // Push the item
                    flatNav.push(navToPush);

                    // If there are child items in this navigation,
                    // do some nested function magic
                    if (navigation[x].children.length > 0) {
                        flatNav = flatNav.concat(_flattenNavigation(navigation[x].children));
                    }
                }

                return flatNav;
            }
        };
    }
})();