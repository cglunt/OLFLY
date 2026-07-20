#!/bin/sh
# Xcode Cloud: build the web app before the iOS archive step.
# Requires these environment variables set in the Xcode Cloud workflow
# (Settings > Environment): VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID,
# VITE_FIREBASE_APP_ID, VITE_REVENUECAT_IOS_KEY
set -ex

# No Package.resolved is committed for this project; let Xcode resolve
# Swift package versions automatically instead of failing the build.
defaults write com.apple.dt.Xcode IDEDisableAutomaticPackageResolution -bool NO
defaults write com.apple.dt.Xcode IDEPackageOnlyUseVersionsFromResolvedFile -bool NO

brew install node
node -v
npm -v

cd "$CI_PRIMARY_REPOSITORY_PATH"

cat > .env <<EOF
VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
VITE_REVENUECAT_IOS_KEY=$VITE_REVENUECAT_IOS_KEY
EOF

npm ci
npm run build
npx cap sync ios
