(function () {
    'use strict';

    angular
        .module('app.sso')
        .component("joinOrganization", {
            templateUrl: "app/main/sso-auth/register-edu/join-organization/join-organization.html",
            controllerAs: "vm",
            controller: joinOrganizationController
        })

    /** @ngInject */
    function joinOrganizationController( $state, calculateTime, redirectFormFactory,  $stateParams) {
        var vm = this;
        vm.register = {};

        //=====================================================
        vm.changeOrganization = changeOrganization;
        vm.submit = submit;

        active();

        function active() {
            vm.register.code = $stateParams.tenant;
            getTenant().then(function (response) {
                getOrganization(response.id);
            })

        }

        function getTenant() {
            var api = "/api/services/app/registration/GetTenant";
            var option = {
                tenancyName: vm.register.code
            }
            return redirectFormFactory.resolve(api, option)
                .then(function (response) {
                    vm.register.tenantId = response.id;
                    return response;
                })
        }


        function getOrganization(tenantId) {
            var api = "api/services/app/organization/GetWithoutTenantAlls";
            var option = {
                "criterias": [
                    {
                        "propertyName": "TenantId",
                        "operation": "Equals",
                        "value": tenantId,
                    }
                ],
            }
            return redirectFormFactory.resolve(api, option)
                .then(function (response) {
                    vm.listOrganization = response;
                    return response;
                })
        }

        function changeOrganization(){
            var found = _.find(vm.listOrganization,{'id' : vm.register.organizationId});
            vm.listTitle = found.titles;
        }
        function submit(){
            var api = "api/services/app/registration/JoinTenant";
            return redirectFormFactory.resolve(api, vm.register)
            .then(function(response){
                $state.go('app.home');
            })
        }

    }
})();
