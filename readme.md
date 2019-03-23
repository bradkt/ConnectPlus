"startcli": "node node_modules/react-native/local-cli/cli.js start",
"start": "react-native run-android",

The devices bluetooth needs to be on to use BT service it seems.

##MAC
Press Cmd+R to reload 'Cmd+D or shake for dev menu

##Android
To get started
follow directions here:

##Basically:
Have AVD running & run react-native run-android in console

'Double tap R on your keyboard to reload,\n' +
'Shake or press menu button for dev menu',

##Run:
react-native log-android
to have console.log working

##List devices attached
(https://facebook.github.io/react-native/docs/running-on-device)
\$ adb devices
example output:
emulator-5554 offline # Google emulator
14ed2fcc device # Physical device

for release build
/c/Program Files/Java/jdk1.8.0_201/bin

An accelerometer is a sensor which measures the tilting motion and orientation of a mobile phone.
