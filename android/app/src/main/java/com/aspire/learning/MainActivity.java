package com.aspire.learning;

import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.view.Window;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AppPermissionsPlugin.class);
        super.onCreate(savedInstanceState);

        try {
            Window window = getWindow();
            window.setStatusBarColor(Color.WHITE);
            window.setNavigationBarColor(Color.WHITE);
            WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
            if (controller != null) {
                controller.setAppearanceLightStatusBars(true);
                controller.setAppearanceLightNavigationBars(true);
            }

            View contentView = findViewById(android.R.id.content);
            if (contentView != null) {
                contentView.setBackgroundColor(Color.WHITE);
                ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, insets) -> {
                    int statusBarInset = Math.max(
                        insets.getInsets(WindowInsetsCompat.Type.statusBars()).top,
                        insets.getInsets(WindowInsetsCompat.Type.displayCutout()).top
                    );
                    int imeInset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom;
                    int navBarInset = Math.max(
                        insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom,
                        insets.getInsets(WindowInsetsCompat.Type.systemBars()).bottom
                    );
                    int bottomInset = Math.max(navBarInset, imeInset);
                    v.setPadding(0, statusBarInset, 0, bottomInset);
                    return insets;
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
