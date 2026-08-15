/**
 * Harbourly waitlist -> Google Sheets
 *
 * Setup:
 * 1. Open your NEW waitlist Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Delete any starter code, paste this whole file in.
 * 4. If your tab isn't named "Sheet1", update SHEET_NAME below.
 * 5. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the deployment URL (ends in /exec) — that's what the site's
 *    JS will fetch() to.
 * 7. Run once manually (select doPost, click Run) to grant permissions
 *    the first time — Google will ask you to authorize the script.
 *
 * The header row (Timestamp, Role, Games, Country, Name, Email, Reason)
 * is created automatically the first time a submission comes in, so you
 * don't need to type it yourself. If you want it there immediately,
 * just run setupHeaders() once from the Apps Script editor.
 */

var SHEET_NAME = 'Sheet1'; // change to match your tab's actual name
var HEADERS = ['Timestamp', 'Role', 'Games', 'Country', 'Name', 'Email', 'Reason'];

function doPost(e) {
  var sheet = getSheet_();
  ensureHeaders_(sheet);

  var data = parseRequest_(e);

  sheet.appendRow([
    new Date(),
    data.role || '',
    data.games || '',
    data.country || '',
    data.name || '',
    data.email || '',
    data.reason || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
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

function parseRequest_(e) {
  // The site will POST as a simple form request (mode:'no-cors'), which
  // Apps Script exposes via e.parameter. JSON is also supported here in
  // case a server-side proxy is added later.
  if (e.postData && e.postData.type === 'application/json') {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to e.parameter
    }
  }
  return e.parameter || {};
}
