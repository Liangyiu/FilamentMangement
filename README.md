# Requirements
- NodeJS
- JavaDevelopementKit
- Android Studio
- Android Device with Android 12 & USB-Debugging

# Used Packages
- [Eva Design](https://eva.design/)
- [UI-Kitten for React-Native](https://akveo.github.io/react-native-ui-kitten/docs/getting-started/what-is-ui-kitten#what-is-ui-kitten)
- [React Native NFC Manager](https://github.com/revtel/react-native-nfc-manager)
- [React Native Table Component](https://www.npmjs.com/package/react-native-table-component)

# Dev Environment Setup
1) Download & install [NodeJS](https://nodejs.org/en)
2) Download & install [Android Studio](https://developer.android.com/studio)
3) Open Android Studio and go to the SDK Manager
![sdk-manager](/documentation/screenshots/1_sdkmanager1.png)
4) Select `Android 12` in the SDK Manager and confirm with apply & ok
![sdkmanager2](/documentation/screenshots/1_sdkmanager2.png)
5) Clone the repository
6) Open a termin in the repository directory and execute `npm install` & `npm install react-native -g`
7) Now you should be ready to make changes to the source code. To be able to see the changes in the app you need an Android device with Android 12 or higher, NFC and USB-Debugging enabled. Connect the device to your PC and run the command `react-native run-android`. If you encounter an error along the lines of `required java sdk version not installed/found` continue with step 8.
8) ***(optional)*** If you get an error similar to the one described in step 7, you will need to installed the described java sdk version and add it to you PC's path environment




