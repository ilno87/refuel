// netlify/functions/fetch-sheet.js
const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    // 🔐 Autenticazione con le variabili di ambiente di Netlify
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GCP_PROJECT_ID,
        private_key_id: process.env.GCP_PRIVATE_KEY_ID,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GCP_CLIENT_EMAIL,
        client_id: process.env.GCP_CLIENT_ID,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 📊 Legge il tab "Dati"
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Dati!A1:K", // cambia range se hai più/meno colonne
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.data.values),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // utile per il frontend
      },
    };
  } catch (err) {
    console.error("Errore fetch-sheet:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore server", details: err.message }),
    };
  }
};