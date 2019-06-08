refreshPlatforms=$1

if [ -z "$refreshPlatforms" ]; then
  echo 'Platforms directory is refreshed and re-downloaded by default. If you dont want to do this to make the build go faster, and you have not changed the cordova id in config.xml, you can pass "n" as the second argument and the platforms directory wont be re-installed'
  refreshPlatforms=true
fi

if [ "$refreshPlatforms" = "n" -o "$refreshPlatforms" = "no" -o "$refreshPlatforms" = "0" ]; then
  refreshPlatforms=false
  echo 'Platforms directory will not be refreshed'
else
  refreshPlatforms=true
fi

if [ ! -f ./angel.keystore ]; then
    echo "./angel.keystore needs to exist."
    exit
fi

if [[ -z "${ANDROID_STOREPASS}" ]]; then
  echo "ANDROID_STOREPASS needs to be set to the keystore password."
  exit
fi

# we have to totally regenerate the project files as well
if [ $refreshPlatforms == true ]; then
  echo "Refreshing the platforms directory..."
  cordova platform remove android
  cordova platform add android
  echo "Platforms directory refreshed."
else
  echo "Cached version of platforms/android directory has been retrieved successfully."
fi

ionic cordova build android --release
  jarsigner \
    -verbose \
    -sigalg SHA1withRSA \
    -digestalg SHA1 \
    -storepass $ANDROID_STOREPASS \
    -keystore angel.keystore \
    ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
    angel

mv ../platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk app-release-unsigned.apk
[ -f '.\Guardian.apk' ] && rm '.\Guardian.apk' || echo "Old APK Not found"
zipalign -v 4 app-release-unsigned.apk 'Guardian.apk'
rm ./app-release-unsigned.apk

echo "Run finish!!"
read -p "Press any key..."

#changeit
#keytool -genkey -v -keystore angel.keystore -alias angel -keyalg RSA -keysize 2048 -validity 10000
#keytool -list -printcert -jarfile .\Guardian.apk
#just in case
#adb uninstall com.corp.guardian
#java -jar pepk.jar --keystore=angel.keystore --alias=angel --output=angel.key --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a