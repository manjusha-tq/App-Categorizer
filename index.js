// import express from "express";
// import bodyParser from "body-parser";
// import fetch from "node-fetch";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(bodyParser.json());

// const MONDAY_API_URL = "https://api.monday.com/v2";
// const API_TOKEN = process.env.MONDAY_API_TOKEN;

// // Health check
// app.get("/", (req, res) => {
//   res.send("✅ Task Categorizer app is running");
// });
// //------------------------------------------------------------------Manjusha
// app.post("/webhook", async (req, res) => {
//   try {
//     console.log("📩 Webhook payload:", JSON.stringify(req.body, null, 2));

//     const input =
//       req.body.payload?.inputFields ||
//       req.body.payload?.inboundFieldValues ||
//       {};

//     const { boardId, itemId, columnId } = input;

//     if (!boardId || !itemId || !columnId) {
//       console.error("❌ Missing fields in payload:", input);
//       return res.status(400).send({ error: "Missing boardId/itemId/columnId" });
//     }

//     // 🔎 1. Fetch item name
//     const getItemQuery = `
//       query {
//         items(ids: ${itemId}) {
//           name
//         }
//       }
//     `;
//     const getResponse = await fetch(MONDAY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: API_TOKEN,
//       },
//       body: JSON.stringify({ query: getItemQuery }),
//     });
//     const itemData = await getResponse.json();
//     const itemName = itemData.data.items[0].name;

//     // 🏷️ 2. Categorize
//     let taskType = "Uncategorized";
//     if (/bug/i.test(itemName)) taskType = "Bug";
//     else if (/feature/i.test(itemName)) taskType = "Feature Request";
//     else if (/urgent|priority/i.test(itemName)) taskType = "High Priority";
//     else if (/enhancement|repair|not working/i.test(itemName))
//       taskType = "Maintenance";

//     // 📝 3. Update monday column
//     // const mutation = `
//     //   mutation {
//     //     change_simple_column_value(
//     //       board_id: ${boardId},
//     //       item_id: ${itemId},
//     //       column_id: "${columnId}",
//     //       value: "${taskType}"
//     //     ) {
//     //       id
//     //     }
//     //   }
//     // `;

//     const mutation = `
//   mutation {
//     change_column_value(
//       board_id: ${boardId},
//       item_id: ${itemId},
//       column_id: "${columnId}",
//       value: "{ \\"label\\": \\"${taskType}\\" }"
//     ) {
//       id
//     }
//   }
// `;


//     const updateResponse = await fetch(MONDAY_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: API_TOKEN,
//       },
//       body: JSON.stringify({ query: mutation }),
//     });
//     const updateData = await updateResponse.json();

//     console.log("✅ Updated:", { boardId, itemId, columnId, taskType, updateData });

//     res.status(200).send({ success: true, taskType });
//   } catch (error) {
//     console.error("❌ Error handling webhook:", error);
//     res.status(500).send({ error: "Server error" });
//   }
// });


// //------------------------------------------------------------------Manjusha


// // Webhook handler
// // app.post("/webhook", async (req, res) => {
// //     try {
// //         const { event } = req.body;

// //         if (!event) {
// //             return res.status(400).send({ error: "Invalid payload" });
// //         }

// //         const itemId = event.pulseId;
// //         const boardId = event.boardId;
// //         // const itemName = event.pulseName || "";
// //         const columnId = event.config?.columnId;

// // //========================================================================================

// //         const getItemName = `
// //      query {  
// //       items(ids: ${itemId}) {   
// //         name  
// //         column_values {  
// //           id  
// //           value  
// //         }  
// //       }   
// //     }
// //     `;
// //         const get = await fetch("https://your-api-endpoint/graphql", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${YOUR_API_TOKEN}`
// //             },
// //             body: JSON.stringify({ query: getItemName })
// //         });
// //         const item = await get.json();

// //         const ItemName = item.data.items[0].name;
// // //========================================================================================
// //         if (!columnId) {
// //             console.warn("❌ No columnId in config, skipping");
// //             return res.status(200).send({ success: false, reason: "No columnId provided" });
// //         }

// //         // Categorize
// //         let taskType = "Uncategorized";
// //         if (/bug/i.test(itemName)) taskType = "Bug";
// //         else if (/feature/i.test(itemName)) taskType = "Feature Request";
// //         else if (/urgent|priority/i.test(itemName)) taskType = "High Priority";
// //         else if (/enhancement|repair|not working/i.test(itemName)) taskType = "Maintenance";

// //         // Mutation
// //         const query = `
// //       mutation {
// //         change_simple_column_value (
// //           board_id: ${boardId},
// //           item_id: ${itemId},
// //           column_id: "${columnId}",
// //           value: "${taskType}"
// //         ) {
// //           id
// //         }
// //       }
// //     `;

// //         const response = await fetch(MONDAY_API_URL, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: API_TOKEN,
// //             },
// //             body: JSON.stringify({ query }),
// //         });

// //         const data = await response.json();
// //         console.log("✅ Updated:", { boardId, itemId, columnId, taskType, data });

// //         res.status(200).send({ success: true, taskType });
// //     } catch (error) {
// //         console.error("❌ Error handling webhook:", error);
// //         res.status(500).send({ error: "Server error" });
// //     }
// // });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`));


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=///////////Deployment on render Code

// index.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_AUTH_AUTHORIZE = "https://auth.monday.com/oauth2/authorize";
const MONDAY_AUTH_TOKEN = "https://auth.monday.com/oauth2/token";

const CLIENT_ID = process.env.MONDAY_CLIENT_ID;
const CLIENT_SECRET = process.env.MONDAY_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || ""; // your public base URL

// Postgres client helper
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// ---------- Helper DB functions ----------
async function saveInstallation({ account_id, access_token, refresh_token, expires_at }) {
  const client = await pool.connect();
  try {
    // Upsert by account_id
    const res = await client.query(
      `INSERT INTO installations (account_id, access_token, refresh_token, expires_at)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (account_id) DO UPDATE
       SET access_token = EXCLUDED.access_token,
           refresh_token = EXCLUDED.refresh_token,
           expires_at = EXCLUDED.expires_at,
           updated_at = NOW()
       RETURNING id`,
      [account_id, access_token, refresh_token, expires_at]
    );
    return res.rows[0].id;
  } finally {
    client.release();
  }
}

async function mapBoardsToInstallation(boardIds = [], installationId) {
  if (!boardIds || boardIds.length === 0) return;
  const client = await pool.connect();
  try {
    const stmt = `INSERT INTO board_tokens (board_id, installation_id)
      VALUES ${boardIds.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(",")}
      ON CONFLICT (board_id) DO UPDATE SET installation_id = EXCLUDED.installation_id;`;
    // Build values: [board1, installationId, board2, installationId, ...]
    const vals = [];
    for (const b of boardIds) {
      vals.push(b, installationId);
    }
    await client.query(stmt, vals);
  } finally {
    client.release();
  }
}

async function getAccessTokenForBoard(boardId) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT i.access_token FROM installations i
       JOIN board_tokens b ON b.installation_id = i.id
       WHERE b.board_id = $1 LIMIT 1`,
      [boardId]
    );
    return res.rows[0]?.access_token || null;
  } finally {
    client.release();
  }
}

// ---------- OAuth endpoints ----------
app.get("/install", (req, res) => {
  // Redirect user to Monday authorization page to install app.
  // Scopes: adjust as necessary
  const scopes = encodeURIComponent("boards:read boards:write items:read items:write");
  const redirectUri = encodeURIComponent(`${BASE_URL}/oauth/callback`);
  const state = "security_token_" + Math.random().toString(36).slice(2); // optional: store state if needed
  const url = `${MONDAY_AUTH_AUTHORIZE}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${state}`;
  res.redirect(url);
});

app.get("/oauth/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing code");

    // Exchange code for token
    const body = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: `${BASE_URL}/oauth/callback`,
      grant_type: "authorization_code",
    };

    const tokenResp = await fetch(MONDAY_AUTH_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const tokenData = await tokenResp.json();
    // tokenData should include access_token, refresh_token, expires_in, account_id (depends on Monday response)
    console.log("OAuth token response:", tokenData);

    const access_token = tokenData.access_token;
    const refresh_token = tokenData.refresh_token;
    const expires_at = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null;
    const account_id = tokenData.account_id || tokenData.accountId || tokenData.team_id || tokenData.teamId || null;

    // Persist installation
    const installationId = await saveInstallation({ account_id, access_token, refresh_token, expires_at });

    // Fetch boards that this token can access, and map them
    // NOTE: be careful with very large accounts. This is a starting approach.
    const resp = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: access_token },
      body: JSON.stringify({ query: `query { boards { id } }` }),
    });
    const boardsData = await resp.json();
    const boards = boardsData?.data?.boards?.map((b) => b.id) || [];
    console.log("Boards fetched for installation:", boards.length);

    await mapBoardsToInstallation(boards, installationId);

    // Redirect the user back to Monday UX or a success page
    res.send("✅ App installed successfully. You can close this window.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// ---------- Health check ----------
app.get("/", (req, res) => res.send("✅ Task Categorizer is running"));

// ---------- Webhook handler ----------
app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Webhook payload:", JSON.stringify(req.body, null, 2));

    // There are a few shapes monday may send: payload.inputFields or payload.inboundFieldValues
    const input =
      req.body.payload?.inputFields ||
      req.body.payload?.inboundFieldValues ||
      req.body.inputFields ||
      req.body.event?.config ||
      req.body.event ||
      {};

    const boardId = input.boardId || input.board_id || input.board_id;
    const itemId = input.itemId || input.item_id || input.pulseId || input.item_id;
    const columnId = input.columnId || input.column_id;

    if (!boardId || !itemId || !columnId) {
      console.error("❌ Missing required fields. Full payload:", req.body);
      return res.status(400).send({ error: "Missing boardId/itemId/columnId" });
    }

    // Lookup the access token for this board
    const access_token = await getAccessTokenForBoard(boardId);
    if (!access_token) {
      console.error("❌ No access token for board:", boardId);
      return res.status(400).send({ error: "No token for board" });
    }

    // 1) fetch item name using the access_token
    const getItemQuery = `query { items(ids: ${itemId}) { name column_values { id value } } }`;
    const getResp = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: access_token },
      body: JSON.stringify({ query: getItemQuery }),
    });
    const getData = await getResp.json();
    const itemName = getData?.data?.items?.[0]?.name || "";

    // 2) categorization rules
    let taskType = "Uncategorized";
    if (/bug/i.test(itemName)) taskType = "Bug";
    else if (/feature/i.test(itemName)) taskType = "Feature Request";
    else if (/urgent|priority/i.test(itemName)) taskType = "High Priority";
    else if (/enhancement|repair|not working/i.test(itemName)) taskType = "Maintenance";

    // 3) update column - use change_column_value for status columns (JSON with label)
    const mutation = `
      mutation {
        change_column_value(
          board_id: ${boardId},
          item_id: ${itemId},
          column_id: "${columnId}",
          value: "{ \\"label\\": \\"${taskType}\\" }"
        ) {
          id
        }
      }
    `;
    const updateResp = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: access_token },
      body: JSON.stringify({ query: mutation }),
    });
    const updateData = await updateResp.json();
    console.log("✅ Updated:", { boardId, itemId, columnId, taskType, updateData });

    return res.status(200).send({ success: true, taskType });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).send({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`));
