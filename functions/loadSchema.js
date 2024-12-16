const functions = require('firebase-functions');
const { db } = require('./firebaseAdmin');

exports.loadSchema = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  const userId = context.auth.uid;
  try {
    const docRef = db.collection("users").doc(userId).collection("instruct-schemas").doc("default");
    const docSnap = await docRef.get();
    if (!docSnap.exists) return { schema: [] };
    return { schema: docSnap.data().schema };
  } catch (error) {
    console.error("Error loading schema:", error);
    throw new functions.https.HttpsError("unknown", "Failed to load schema.");
  }
});
