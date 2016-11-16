#! /bin/sh

# Modified from: https://jonathan.porta.codes/2015/04/17/automatically-build-your-unity3d-project-in-the-cloud-using-travisci-for-free/

# Example install script for Unity3D project. See the entire example: https://github.com/JonathanPorta/ci-build

project="ci-build"

LOGDATE=$(date +%Y-%m-%dT%H:%M:%S%z)
LOGFILE=$(pwd)/unity-build-$LOGDATE.log
echo "Attempting to build $project for Windows"
/Applications/Unity/Unity.app/Contents/MacOS/Unity \
  -batchmode \
  -nographics \
  -silent-crashes \
  -logFile $LOGFILE \
  -projectPath $(pwd) \
  -buildWindowsPlayer "$(pwd)/Build/windows/$project.exe" \
  -quit
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

echo 'Logs after Windows build'
cat $LOGFILE

echo "Attempting to build $project for OS X"
/Applications/Unity/Unity.app/Contents/MacOS/Unity \
  -batchmode \
  -nographics \
  -silent-crashes \
  -logFile $LOGFILE \
  -projectPath $(pwd) \
  -buildOSXUniversalPlayer "$(pwd)/Build/osx/$project.app" \
  -quit
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

echo 'Logs after OS X build'
cat $LOGFILE

echo "Attempting to build $project for Linux"
/Applications/Unity/Unity.app/Contents/MacOS/Unity \
  -batchmode \
  -nographics \
  -silent-crashes \
  -logFile $LOGFILE \
  -projectPath $(pwd) \
  -buildLinuxUniversalPlayer "$(pwd)/Build/linux/$project.exe" \
  -quit
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

echo 'Logs after Linux build'
cat $LOGFILE
