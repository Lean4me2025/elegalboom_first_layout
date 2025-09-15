eLegalBoom — Lean Intake Bundle
=================================

This bundle contains:
- web/index.html      → Master intake form (universal + doc-specific sections) with filing option
- web/success.html    → Thank-you page that shows the Order ID
- apps_script/Code.gs → Google Apps Script to capture submissions in Google Sheets
- README.txt          → This file

Quick Setup (≈ 5 minutes)
-------------------------
1) Create a Google Sheet named "eLegalBoom Orders" and add a tab "Requests".
   Copy the Sheet ID (the long string between /d/ and /edit in the URL).

2) Open script.google.com → New project → paste apps_script/Code.gs.
   Replace PASTE_YOUR_SHEET_ID_ONLY with your Sheet ID (ID only).
   Deploy → Manage deployments → Web app
     - Execute as: Me
     - Who has access: Anyone
     - Copy the Web App URL (must end with /exec).

3) Open web/index.html and set WEBHOOK_URL to your /exec URL.
   (Search for PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE and replace it.)

4) Deploy your site (GitHub/Vercel). Ensure both index.html and success.html are in the app root.

5) Test:
   - Open your site → fill the form → Submit.
   - You should be redirected to success.html showing the Order ID.
   - In Google Sheets → Requests tab, a new row should appear with all fields.

Notes
-----
- The form uses JSON POST for a smooth UX; the Apps Script handles both JSON and standard form posts.
- The schema is “wide” so all doc types land in one tab. Unused columns stay blank.
- New doc types are easy: add inputs in index.html and add corresponding columns to headers in Code.gs.
- Filing choice is stored in `filing_option` column (Customer_File vs eLegalBoom_File).

Troubleshooting
---------------
- If no row appears: check Apps Script Executions for errors; confirm the Sheet ID is correct and the tab is named “Requests”.
- If the Web App URL changes after a new deployment: update WEBHOOK_URL in index.html.

Lean Reminders
--------------
- Front-load information to kill back-office rework.
- One source of truth: the Requests sheet.
- Visual management: add a “status” column to track New → Drafting → QC → Delivered.
