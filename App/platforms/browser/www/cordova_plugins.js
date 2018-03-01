cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-open-native-settings/www/settings.js",
        "id": "cordova-open-native-settings.Settings",
        "pluginId": "cordova-open-native-settings",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-open-native-settings": "1.4.1",
    "cordova-plugin-browsersync": "0.1.7",
    "cordova.plugins.diagnostic": "3.9.2"
}
// BOTTOM OF METADATA
});