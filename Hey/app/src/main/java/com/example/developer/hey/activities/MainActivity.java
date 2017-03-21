package com.example.developer.hey.activities;

import android.Manifest;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.example.developer.hey.R;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // Permission for SMS sending for high API level android devices
        ActivityCompat.requestPermissions(this,new String[]{Manifest.permission.SEND_SMS},1);
    }
}
