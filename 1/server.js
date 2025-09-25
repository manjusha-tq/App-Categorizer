import fetch from "node-fetch";

const MONDAY_API_URL = "https://api.monday.com/v2";

/**
 * This function will run inside Monday's serverless environment
 * It will be triggered by your integration recipe webhook
 */
export default async function handler(req, res) {
  try {
    const { event } = req.body;

    if (!event) {
      return res.status(400).send({ error: "Invalid payload" });
    }

    const itemId = event.pulseId;
    const boardId = event.boardId;
    const columnId = event.config?.columnId;

    //========================================================================================
    // Get item details from Monday API
    const getItemNameQuery = `
      query {  
        items(ids: ${itemId}) {   
          name  
          column_values {  
            id  
            value  
          }  
        }   
      }
    `;

    const itemResponse = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization, // Uses the token from Monday runtime
      },
      body: JSON.stringify({ query: getItemNameQuery }),
    });

    const item = await itemResponse.json();
    const itemName = item.data.items[0]?.name || "";

    //========================================================================================
    if (!columnId) {
      console.warn("❌ No columnId in config, skipping");
      return res.status(200).send({ success: false, reason: "No columnId provided" });
    }

    // Categorize based on item name
    let taskType = "Uncategorized";
    if (/bug/i.test(itemName)) taskType = "Bug";
    else if (/feature/i.test(itemName)) taskType = "Feature Request";
    else if (/urgent|priority/i.test(itemName)) taskType = "High Priority";
    else if (/enhancement|repair|not working/i.test(itemName)) taskType = "Maintenance";

    // Mutation to update column value
    const mutation = `
      mutation {
        change_simple_column_value (
          board_id: ${boardId},
          item_id: ${itemId},
          column_id: "${columnId}",
          value: "${taskType}"
        ) {
          id
        }
      }
    `;

    const updateResponse = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization, // Use runtime token
      },
      body: JSON.stringify({ query: mutation }),
    });

    const updateData = await updateResponse.json();
    console.log("✅ Updated:", { boardId, itemId, columnId, taskType, updateData });

    return res.status(200).send({ success: true, taskType });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return res.status(500).send({ error: "Server error" });
  }
}
