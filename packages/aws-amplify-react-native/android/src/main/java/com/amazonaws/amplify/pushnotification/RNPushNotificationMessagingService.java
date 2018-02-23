package com.amazonaws.amplify.pushnotification;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import java.util.Map;
import java.util.List;
import java.util.Random;

import org.json.JSONObject;
import org.json.JSONException;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

import com.amazonaws.amplify.pushnotification.modules.RNPushNotificationJsDelivery;
import com.amazonaws.amplify.pushnotification.modules.RNPushNotificationHelper;
import com.amazonaws.amplify.pushnotification.modules.RNPushNotificationCommon;

public class RNPushNotificationMessagingService extends FirebaseMessagingService {
    private static final String LOG_TAG = "RNPushNotificationMessagingService";

    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.i(LOG_TAG, "Message From: " + remoteMessage.getFrom());
        
        ReactInstanceManager mReactInstanceManager = ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
        ReactContext context = mReactInstanceManager.getCurrentReactContext();

        // send the message to device emitter
        RNPushNotificationJsDelivery jsDelivery = new RNPushNotificationJsDelivery((ReactApplicationContext) context);
        Bundle bundle = convertMessageToBundle(remoteMessage);
        jsDelivery.emitNotificationReceived(bundle);

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.i(LOG_TAG, "Message data payload: " + remoteMessage.getData());
            sendNotification((ReactApplicationContext) context, bundle.getBundle("data"));
        }

        return;
    }

    // send out the notification bubble
    private void sendNotification(ReactApplicationContext context, Bundle bundle) {
        Boolean isForeground = isApplicationInForeground();

        // If notification ID is not provided by the user for push notification, generate one at random
        if (bundle.getString("id") == null) {
            Random randomNumberGenerator = new Random(System.currentTimeMillis());
            bundle.putString("id", String.valueOf(randomNumberGenerator.nextInt()));
        }

        bundle.putBoolean("foreground", isForeground);
        bundle.putBoolean("userInteraction", false);

        Log.i(LOG_TAG, "sendNotification: " + bundle);

        if (!isForeground) {
            Application applicationContext = (Application) context.getApplicationContext();
            RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);
            pushNotificationHelper.sendToNotificationCentre(bundle);
        }
        
    }

    // whether the app is in foreground
    private boolean isApplicationInForeground() {
        ActivityManager activityManager = (ActivityManager) this.getSystemService(ACTIVITY_SERVICE);
        List<RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
        if (processInfos != null) {
            for (RunningAppProcessInfo processInfo : processInfos) {
                if (processInfo.processName.equals(getApplication().getPackageName())) {
                    if (processInfo.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        for (String d : processInfo.pkgList) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // convert message object to bundle
    private Bundle convertMessageToBundle(RemoteMessage message) {
        Bundle bundle = new Bundle();
        bundle.putString("collapseKey", message.getCollapseKey());
        bundle.putString("sender", message.getFrom());
        bundle.putString("messageId", message.getMessageId());
        bundle.putString("messageType", message.getMessageType());
        bundle.putLong("sentTime", message.getSentTime());
        bundle.putString("destination", message.getTo());
        bundle.putInt("ttl", message.getTtl());
        bundle.putBundle("data", convertDataToBundle(message));

        return bundle;
    }
    
    // convert data map to bundle
    private Bundle convertDataToBundle(RemoteMessage message) {
        Map<String, String> data = message.getData();

        Bundle bundle = new Bundle();
        for (Map.Entry<String, String> entry : data.entrySet()) {
            bundle.putString(entry.getKey(), entry.getValue());
        }
        return bundle;
    }

}
