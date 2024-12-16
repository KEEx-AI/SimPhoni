const functions = require('firebase-functions');
const { db } = require('./firebaseAdmin');

exports.saveSchema = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  const { schema } = data;
  const userId = context.auth.uid;

  if (!Array.isArray(schema)) {
    throw new functions.https.HttpsError("invalid-argument", "schema must be an array.");
  }

  try {
    await db.collection("users").doc(userId).collection("instruct-schemas").doc("default")
      .set({ schema }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving schema:", error);
    throw new functions.https.HttpsError("unknown", "Failed to save schema.");
  }
});
