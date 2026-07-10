# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# -------------------------------------------------------
# Capacitor / Cordova
# -------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }

# -------------------------------------------------------
# Firebase & Google
# -------------------------------------------------------
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
# Firebase KTX extensions are optional — suppress R8 missing-class warning
-dontwarn com.google.firebase.ktx.Firebase

# -------------------------------------------------------
# Capacitor Firebase Authentication plugin references
# optional Facebook SDK — not used in this project,
# so suppress the missing-class warnings from R8.
# -------------------------------------------------------
-dontwarn com.facebook.**
-keep class com.facebook.** { *; }

# -------------------------------------------------------
# Capacitor Push Notifications / capawesome plugins
# -------------------------------------------------------
-keep class io.capawesome.** { *; }

# -------------------------------------------------------
# RevenueCat Purchases SDK
# -------------------------------------------------------
-keep class com.revenuecat.purchases.** { *; }
-keep class com.revenuecat.purchases.google.** { *; }
-keepnames class com.revenuecat.purchases.** { *; }
-dontwarn com.revenuecat.purchases.**

# -------------------------------------------------------
# Keep JavaScript interface names intact (Capacitor WebView bridge)
# -------------------------------------------------------
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
