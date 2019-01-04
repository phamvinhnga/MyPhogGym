var App = App || {};
(function () {

    var appLocalizationSource = abp.localization.getSource('MyPhogGym');
    App.localize = function () {
        return appLocalizationSource.apply(this, arguments);
    };

})(App);