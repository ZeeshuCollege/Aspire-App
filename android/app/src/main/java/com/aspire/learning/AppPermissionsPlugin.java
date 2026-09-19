package com.aspire.learning;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "AppPermissions",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        ),
        @Permission(
            alias = "camera",
            strings = { Manifest.permission.CAMERA }
        ),
        @Permission(
            alias = "microphone",
            strings = { Manifest.permission.RECORD_AUDIO }
        )
    }
)
public class AppPermissionsPlugin extends Plugin {

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33) { // Android 13+ (API 33+)
            int status = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS);
            if (status != PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("notifications", call, "notificationPermCallback");
                return;
            }
        }

        // For Android 12 and below, notification permission is granted upon installation
        JSObject ret = new JSObject();
        ret.put("granted", true);
        ret.put("status", "granted");
        call.resolve(ret);
    }

    @PermissionCallback
    private void notificationPermCallback(PluginCall call) {
        JSObject ret = new JSObject();
        boolean granted = true;
        if (Build.VERSION.SDK_INT >= 33) {
            granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
        }
        ret.put("granted", granted);
        ret.put("status", granted ? "granted" : "denied");
        call.resolve(ret);
    }

    @PluginMethod
    public void checkNotificationPermission(PluginCall call) {
        JSObject ret = new JSObject();
        if (Build.VERSION.SDK_INT >= 33) {
            int status = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS);
            boolean granted = status == PackageManager.PERMISSION_GRANTED;
            ret.put("granted", granted);
            ret.put("status", granted ? "granted" : "prompt");
        } else {
            ret.put("granted", true);
            ret.put("status", "granted");
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void requestCameraPermission(PluginCall call) {
        int status = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.CAMERA);
        if (status != PackageManager.PERMISSION_GRANTED) {
            requestPermissionForAlias("camera", call, "cameraPermCallback");
        } else {
            JSObject ret = new JSObject();
            ret.put("granted", true);
            ret.put("status", "granted");
            call.resolve(ret);
        }
    }

    @PermissionCallback
    private void cameraPermCallback(PluginCall call) {
        JSObject ret = new JSObject();
        boolean granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        ret.put("granted", granted);
        ret.put("status", granted ? "granted" : "denied");
        call.resolve(ret);
    }

    @PluginMethod
    public void requestMicrophonePermission(PluginCall call) {
        int status = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.RECORD_AUDIO);
        if (status != PackageManager.PERMISSION_GRANTED) {
            requestPermissionForAlias("microphone", call, "microphonePermCallback");
        } else {
            JSObject ret = new JSObject();
            ret.put("granted", true);
            ret.put("status", "granted");
            call.resolve(ret);
        }
    }

    @PermissionCallback
    private void microphonePermCallback(PluginCall call) {
        JSObject ret = new JSObject();
        boolean granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        ret.put("granted", granted);
        ret.put("status", granted ? "granted" : "denied");
        call.resolve(ret);
    }
}
