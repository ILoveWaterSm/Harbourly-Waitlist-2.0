/**
 * Harbourly waitlist -> Google Sheets
 *
 * Setup:
 * 1. Open your waitlist Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Delete any starter code, paste this whole file in.
 * 4. If your tab isn't named "Sheet1", update SHEET_NAME below.
 * 5. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL (ends in /exec) — that's the WAITLIST_SHEETS_URL
 *    env var the Vercel serverless function (api/waitlist.js) calls.
 * 7. Run once manually (select doPost, click Run) to grant permissions
 *    the first time — Google will ask you to authorize the script.
 *
 * This script is called server-to-server from the Vercel function, not
 * directly from the browser, so ordinary JSON POST/GET requests work fine
 * (no CORS workarounds needed on this side).
 *
 * The header row (Timestamp, Role, Games, Country, Name, Email, Reason)
 * is created automatically the first time a submission comes in. Run
 * setupHeaders() once from the editor if you want it there immediately.
 */

var SHEET_NAME = 'New Waitlist'; // must match your tab's actual name exactly
var HEADERS = ['Timestamp', 'Role', 'Games', 'Country', 'Name', 'Email', 'Reason'];
var EMAIL_COL = 6; // column F — must match Email's position in HEADERS above

// GET ?email=... -> { exists: true|false }  (used for a live duplicate check)
function doGet(e) {
  var email = ((e.parameter && e.parameter.email) || '').trim().toLowerCase();
  return jsonOut_({ exists: email ? emailExists_(email) : false });
}

// POST -> appends a row, unless the email is already on the sheet
function doPost(e) {
  var sheet = getSheet_();
  ensureHeaders_(sheet);

  var data = parseRequest_(e);
  var email = (data.email || '').trim();

  if (email && emailExists_(email.toLowerCase())) {
    return jsonOut_({ result: 'duplicate' });
  }

  sheet.appendRow([
    new Date(),
    data.role || '',
    data.games || '',
    data.country || '',
    data.name || '',
    email,
    data.reason || ''
  ]);

  return jsonOut_({ result: 'success' });
}

// Run this manually once from the editor if you want the header row
// in place before your first real submission.
function setupHeaders() {
  ensureHeaders_(getSheet_());
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.getSheets()[0];
  return sheet;
}

function ensureHeaders_(sheet) {
  var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var hasHeaders = firstRow.some(function (cell) { return cell !== ''; });
  if (!hasHeaders) {
    var range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setValues([HEADERS]);
    range.setFontWeight('bold');
  }
}

function emailExists_(emailLower) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var values = sheet.getRange(2, EMAIL_COL, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === emailLower) return true;
  }
  return false;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseRequest_(e) {
  if (e.postData && e.postData.type === 'application/json') {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to e.parameter
    }
  }
  return e.parameter || {};
}
