# Third-Party SDK & Dependency Audit: ASPIRE Learning Centre

**Application Name:** ASPIRE Learning Centre  
**Package ID:** `com.aspire.learning`  
**Audit Date:** October 11, 2026  
**Auditor:** Antigravity Legal & Compliance Specialist  

---

## 1. Executive Summary
This document audits all third-party software development kits (SDKs), npm dependencies, external APIs, and client-side libraries used across the ASPIRE Learning Centre mobile and web platform.

The audit confirms:
- **Zero Advertising SDKs:** No Google AdMob, Unity Ads, Meta Audience Network, AppLovin, or IronSource libraries are present.
- **Zero Commercial Trackers:** No third-party behavioral analytics, cross-app tracking beacons, or fingerprinting libraries are present.
- **Minimal System Footprint:** System permissions and native bridges are strictly restricted to core educational needs (Notifications, optional Camera for user avatar).

---

## 2. Dependency Audit Ledger

| Dependency / SDK | Package / Provider | Purpose in Application | Data Processed | Transmission Security | License | Compliance Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **@capacitor/core & @capacitor/android** | Ionic / Drifty Co. | Android runtime container and native bridge | Device OS version, system window insets | Local device only | MIT License | **PASS** |
| **@capacitor/app** | Ionic / Drifty Co. | Handles Android hardware back button and app state (pause/resume) | App lifecycle state | Local device only | MIT License | **PASS** |
| **@capacitor/browser** | Ionic / Drifty Co. | Secure in-app browser view for external educational links | URLs opened | TLS 1.3 / HTTPS | MIT License | **PASS** |
| **@supabase/supabase-js** | Supabase Inc. | Cloud database connectivity, authentication, and realtime notice broadcasts | Student profile, roll number, course, attendance logs, marks, fees | TLS 1.3 (HTTPS + WSS) to AWS SOC-2 certified infrastructure | MIT License | **PASS** |
| **lucide-react** | Lucide Project | Clean vector iconography for mobile UI | None (Pure SVG components) | Zero network calls | ISC License | **PASS** |
| **jspdf & jspdf-autotable** | Parall-AX & Simon Steyskal | Generates offline student fee receipts and attendance PDF reports | Student name, fee amount, course (rendered into local PDF blob) | 100% Client-side in-memory; zero external transmission | MIT License | **PASS** |
| **canvas-confetti** | Kiril Vatev | Visual celebration animation upon student test completion | None (Mathematical canvas physics) | Zero network calls | ISC License | **PASS** |
| **Meta Graph API (WhatsApp Business)** | Meta Platforms, Inc. | Dispatches one-time verification passwords (OTPs) for parent/student password recovery | Destination phone number, 6-digit numeric OTP | TLS 1.3 / HTTPS to `graph.facebook.com` | Meta Cloud API Terms | **PASS** |

---

## 3. Data Protection Safeguards
1. **Secret Key Isolation:** The client bundle contains exclusively the public anonymous Supabase key (`anon`). Administrative `service_role` keys are strictly prohibited from client builds.
2. **Database Row Level Security (RLS):** Student fee records and profiles are protected with PostgreSQL RLS policies in Supabase, preventing cross-user unauthorized access.
3. **No Unencrypted Traffic:** Android Network Security Config enforces HTTPS / TLS 1.3 for all external API endpoints.
