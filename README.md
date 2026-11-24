# First Credit Union

Online banking and operations console for **First Credit Union De' Creditos** (First Credit Union). Members sign in to E-Banking to review balances, move money, and update contact details. Officers use the admin desk to change member records and post balance adjustments.

This is a normal Node.js / Next.js app. It runs on **Windows**, macOS, and Linux. No database server is required. Member records are stored in `data/bank.json` on the machine that runs the app.

Private repo: [https://cursor.com/codebase/imisi-adenuga/bank-ops](https://cursor.com/codebase/imisi-adenuga/bank-ops)

## Open on Windows

You need [Node.js LTS](https://nodejs.org) (20 or newer). The installer adds `node` and `npm` to PATH. Restart Cursor or your terminal after installing.

### Option A — folder already on your PC

1. Open the project folder in File Explorer or Cursor (**File → Open Folder**).
2. Double-click `START-WINDOWS.bat`.
3. The first run installs packages, then opens [http://127.0.0.1:43147](http://127.0.0.1:43147).

Or in PowerShell, from inside the project folder:

```powershell
.\setup-windows.ps1
```

If PowerShell blocks the script:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
.\setup-windows.ps1
```

### Option B — get the repo onto this PC

From the repo page, use **Open in Cursor**. That clones `imisi-adenuga/bank-ops` and opens it. Then run `START-WINDOWS.bat`.

To clone with Git for Windows, open the repo page, copy the clone URL shown there, then in PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\Documents\bank-ops"
cd "$env:USERPROFILE\Documents"
git clone <paste-the-clone-url> bank-ops
```

You can also clone in WSL with the [Origin CLI](https://cursor.com/docs/origin/cli).

### Option C — zip

Extract the project zip into `Documents\bank-ops`. If Cursor says it failed to checkout the branch because the folder is not a git repository, double-click `INIT-GIT-WINDOWS.bat` first. Then open that folder in Cursor and run `START-WINDOWS.bat`.

## Officer sign-in

The first store only includes the operations officer. Members are added from the admin desk or the public application form.

| Portal | Email | Password |
| --- | --- | --- |
| Operations console | `admin@First Credit Unionridgeudc.org` | `SRFF7A6062!Admin` |

## What you can do

**Members**

- Open Checking and Ridge Savings online
- Review balances, account numbers, and activity
- Transfer between their own accounts or to another member by account number
- Update phone, address, and password

**Officers**

- Search and open any membership
- Edit name, email, phone, address, date of birth, and status
- Credit, debit, or set an exact account balance
- Freeze or close individual accounts
- Open additional checking, savings, or business accounts
- Reset a member password
- Create a new member from the desk

## In-app notifications

Every posted transaction — transfers, deposits, balance adjustments, refunds, loan proceeds, and voids — creates a notification automatically:

- **Members** see it in the E-Banking notification bell and on the Messages page, with the amount, account, new balance, and a link to the account or receipt.
- **Officers** see the same posting in the operations console bell, linked to the member's record.
- **Toasts** pop up for new notifications across tabs and for transactions posted by the other role (checked every few seconds while the app is open).
- Notices are marked read from the bell or Messages page. The notification history lives in `data/bank.json` alongside the ledger (capped at the most recent 300).

## Install as a phone app (iPhone and Android)

The app is installable as a PWA. Open the site over HTTPS (or on `localhost`) in Safari on iOS or Chrome on Android, then use **Share → Add to Home Screen** (iPhone) or **Install app** (Android). It launches in standalone mode without browser controls.

- Manifest: `src/app/manifest.ts`; icons are in `public/icon-*.png` and `public/apple-touch-icon.png`.
- Offline-safe app shell registration: `public/sw.js`, registered by `src/components/pwa-register.tsx`.
- The site URL and icon can be changed in the manifest and metadata in `src/app/layout.tsx`.

## Session timeout and officer controls

- Both portals sign a user out automatically after **5 minutes of inactivity** (`src/components/idle-session.tsx`). Activity in any open tab keeps the session alive; the sign-in screen explains the timeout.
- In the operations console, open a member's **Ledger** tab to edit a posting's date, description, counterparty, amount, and status, or void it. Existing notification records are updated to match corrections.
- Under **Preferences → Admin sign-in**, an officer can change their username (sign-in email) and optionally their password after entering the current password.
- **Mobile deposit** now has a camera capture control: on a phone, **Snap a photo of your check** opens the rear camera; on a computer it opens a file picker. The photo is saved with the deposit, previewed on the receipt, and viewable by the member and operations staff (`/api/deposit-photo/[depositId]`).
- In the member desk **Accounts** tab, click the **Opened** date to change when an account was opened. This also updates the statement periods available to the member.

## If Cursor says “not a git repository”

The folder you opened has the source files but no `.git` directory (common after extracting a zip). Close that window, run `INIT-GIT-WINDOWS.bat` in the extracted folder, then **File → Open Folder** on the same folder.

## Notes

This is a local demonstration system. Do not store real customer credentials here. Set `SESSION_SECRET` in `.env.local` if you deploy it beyond this machine.
