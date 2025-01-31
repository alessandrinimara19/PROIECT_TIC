import db from "../database/firestore.js";
import AppError from "../utils/AppError.js";
import admin from "firebase-admin"
import { faker } from "@faker-js/faker"

const Timestamp = admin.firestore.Timestamp;

// Obține toate articolele
const getAllArticles = async (req, res, next) => {
  try {
    const articlesRef = db.collection("Articles");
    const snapshot = await articlesRef.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      throw new AppError("Nu există articole disponibile", 404);
    }

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      status: "success",
      results: articles.length,
      articles,
    });
  } catch (err) {
    next(err);
  }
};

// Obține un articol după ID
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    res.status(200).json({
      status: "success",
      article: { id: doc.id, ...doc.data() },
    });
  } catch (err) {
    next(err);
  }
};

// Creează un articol
const createArticle = async (req, res, next) => {
  try {
    const { title, content, authorId } = req.body;

    const newArticle = {
      authorId,
      title,
      content,
      createdAt: Timestamp.now(),
      comments: [],
      likes: [],
    };

    const articleRef = await db.collection("Articles").add(newArticle);

    res.status(201).json({
      status: "success",
      article: { id: articleRef.id, ...newArticle },
    });
  } catch (err) {
    next(err);
  }
};

// Actualizează un articol
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    await articleRef.update(updates);

    res.status(200).json({
      status: "success",
      message: "Articol actualizat cu succes",
    });
  } catch (err) {
    next(err);
  }
};

// Șterge un articol
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    await articleRef.delete();

    res.status(204).json({
      status: "success",
      message: "Articol șters cu succes",
    });
  } catch (err) {
    next(err);
  }
};

// Adaugă un comentariu la un articol
const addCommentToArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;

    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    const newComment = {
      commentId: faker.string.uuid(),
      userId,
      content,
      createdAt: Timestamp.now(),
    };

    const updatedComments = [...doc.data().comments, newComment];

    await articleRef.update({ comments: updatedComments });

    res.status(201).json({
      status: "success",
      comment: newComment,
    });
  } catch (err) {
    next(err);
  }
};

//sterge comentariu articol
const deleteCommentFromArticle = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;

    // referinta - documentul articolului
    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    //Preluare comentarii
    const comments = doc.data().comments;

    //Gaseste indexul comentariului de sters
    const commentIndex = comments.findIndex((comment) => comment.commentId === commentId);

    if (commentIndex === -1) {
      throw new AppError("Comentariul nu a fost găsit", 404);
    }

    //Stergere comment din vector de comentarii
    comments.splice(commentIndex, 1);

    //update articol cu noul array de comments
    await articleRef.update({ comments });

    res.status(200).json({
      status: "success",
      message: "Comentariul a fost șters cu succes",
    });
  } catch (err) {
    next(err);
  }
};

// Adaugă un like la un articol
const likeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    const currentLikes = doc.data().likes || 0;
    await articleRef.update({ likes: currentLikes + 1 });

    res.status(200).json({
      status: "success",
      likes: currentLikes + 1,
    });
  } catch (err) {
    next(err);
  }
};

// Sterge un like la un articol
const dislikeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const articleRef = db.collection("Articles").doc(id);
    const doc = await articleRef.get();

    if (!doc.exists) {
      throw new AppError("Articolul nu a fost găsit", 404);
    }

    const currentLikes = doc.data().likes || 0;
    if (currentLikes > 0) {
      await articleRef.update({ likes: currentLikes - 1 });
    }

    res.status(200).json({
      status: "success",
      likes: currentLikes - 1,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addCommentToArticle,
  deleteCommentFromArticle,
  likeArticle,
  dislikeArticle
}
