require("dotenv").config();

const { google } = require("googleapis");
const { compileTemplate, sendEmail } = require("./mailer");

const API_KEY = process.env.API_KEY;
const SHEET_ID = process.env.SHEET_ID;
const RANGE = process.env.RANGE;

async function getSheetData() {
  const sheets = google.sheets({ version: "v4", auth: API_KEY });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });
  return res.data.values;
}

(async () => {
  const data = await getSheetData();
  const templatePath = "./email-template.html";

  for (const row of data) {
    const [Name, Designation, Email] = row;

    if (!Email) continue;

    const html = compileTemplate(templatePath, { Name, Designation });

    try {
      await sendEmail(Email, "Excited to Connect", html);
      console.log(`✅ Email sent to ${Name} <${Email}>`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${Email}:`, err.message);
    }
  }
})();
