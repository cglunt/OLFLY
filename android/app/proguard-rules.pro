# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ─── Capacitor ────────────────────────────────────────────────────────────────
# Capacitor uses reflection to invoke @PluginMethod handlers; keep all plugin
# classes and their public methods or @JavascriptInterface bridges break at runtime.
-keep public class com.getcapacitor.** { *; }
-keep public class com.getcapacitor.plugin.** { *; }
-keepclassmembers public class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.PluginMethod <methods>;
}
-keepattributes JavascriptInterface
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ─── Capacitor plugins (this app) ─────────────────────────────────────────────
-keep public class io.capawesome.capacitorjs.plugins.firebase.** { *; }
-keep public class com.capacitorjs.plugins.pushnotifications.** { *; }

# ─── Firebase / Google Play Services ──────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.libraries.identity.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ─── WebView (preserve any JS interface methods) ──────────────────────────────
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}

# ─── Crash reports ────────────────────────────────────────────────────────────
# Preserve line numbers so Play Console crash traces are useful.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
