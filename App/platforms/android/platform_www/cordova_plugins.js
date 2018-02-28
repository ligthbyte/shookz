cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-datepicker.DatePicker",
        "file": "plugins/cordova-plugin-datepicker/www/android/DatePicker.js",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-nativegeocoder.NativeGeocoder",
        "file": "plugins/cordova-plugin-nativegeocoder/www/NativeGeocoder.js",
        "pluginId": "cordova-plugin-nativegeocoder",
        "clobbers": [
            "nativegeocoder"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.geolocation",
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "id": "cordova-plugin-geolocation.PositionError",
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "pluginId": "cordova-plugin-geolocation",
        "runs": true
    },
    {
        "id": "cordova-open-native-settings.Settings",
        "file": "plugins/cordova-open-native-settings/www/settings.js",
        "pluginId": "cordova-open-native-settings",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-browsersync": "0.1.7",
    "cordova-plugin-datepicker": "0.9.2",
    "cordova-plugin-device": "2.0.1",
    "cordova-plugin-nativegeocoder": "3.1.1",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-geolocation": "2.4.3",
    "cordova-open-native-settings": "1.4.1"
};
// BOTTOM OF METADATA
});