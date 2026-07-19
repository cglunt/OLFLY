#!/bin/sh
# Xcode Cloud: build the web app before the iOS archive step.
# Requires these environment variables set in the Xcode Cloud workflow
# (Settings > Environment): VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID,
# VITE_FIREBASE_APP_ID, VITE_REVENUECAT_IOS_KEY
set -e

brew install node@20
export PATH="$(brew --prefix node@20)/bin:$PATH"
node -v

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
