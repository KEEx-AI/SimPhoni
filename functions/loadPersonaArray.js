const functions = require('firebase-functions');
const { db } = require('./firebaseAdmin');

exports.loadPersonaArray = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  const userId = context.auth.uid;
  try {
    const docRef = db.collection("users").doc(userId).collection("persona-arrays").doc("default");
    const docSnap = await docRef.get();
    if (!docSnap.exists) return { personaArray: [] };
    return { personaArray: docSnap.data().personaArray };
  } catch (error) {
    console.error("Error loading persona array:", error);
    throw new functions.https.HttpsError("unknown", "Failed to load persona array.");
  }
});
