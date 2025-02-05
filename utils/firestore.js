import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function saveLead(lead) {
  try {
    const docRef = await addDoc(collection(db, "leads"), lead);
    console.log("Lead saved sucessfully:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error when saving lead:", error);
    return null;
  }
}
