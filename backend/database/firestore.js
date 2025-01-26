import admin from "firebase-admin";
import serviceAccount from "./proiect-tic-key.js";
import { getFirestore } from "firebase-admin/firestore";

//creare conexiune cu Firebase prin service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore(); // conexiune Firestore 

export default db;
