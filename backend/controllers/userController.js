import db from "../database/firestore.js";
import AppError from "../utils/AppError.js";

// Obține toti userii
const getAllUsers = async (req, res, next) => {
  try {
    const usersRef = db.collection("Users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      throw new AppError("Nu există useri disponibili", 404);
    }

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      status: "success",
      results: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// // Obține detaliile profilului unui utilizator
const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userRef = db.collection("Users").doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
      return next(new AppError("Utilizatorul nu a fost găsit", 404));
    }

    res.status(200).json({
      status: "success",
      profile: user.data(),
    });
  } catch (err) {
    next(err);
  }
};

// // Obține articolele postate de un utilizator
// const getUserArticles = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const articlesRef = db.collection("Articles");
//     const snapshot = await articlesRef
//       .where("author.userId", "==", userId)
//       .orderBy("createdAt", "desc")
//       .get();

//     const userArticles = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.status(200).json({
//       status: "success",
//       results: userArticles.length,
//       articles: userArticles,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export {
  getUserDetails,
  // getUserArticles,
  getAllUsers
}