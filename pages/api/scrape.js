import { db, saveLead } from "../../utils/firestore"; // ✅ Only one import
import "dotenv/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const lead = {
      name: "BusinessTest",
      email: "Business@email.com",
      site: "https://business.com",
    };

    const leadId = await saveLead(lead);

    if (leadId) {
      return res.status(200).json({ success: true, leadId });
    } else {
      return res.status(500).json({ error: "Error when saving lead" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
