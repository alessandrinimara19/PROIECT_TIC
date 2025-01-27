import AppError from "../utils/AppError.js"
import db from "../database/firestore.js"
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker"

//Generare si stocare useri fake avand nume, prenume, email, parola (criptata cu bcrypt) si imagine de profil
const createFakeUsers = async (req, res, next) => {
    try {
        let { noUsers } = req.body;
        if (!noUsers) {
            throw new AppError("Number of fake users is required!", 400);
        }
        for (let i = 0; i < noUsers; i++) {
            let name = faker.person.firstName();
            let surname = faker.person.lastName();
            let email = faker.internet.email();
            let password = await bcrypt.hash(faker.internet.password(), 10);
            let profilePicture = faker.image.avatar();
            const user = {
                name,
                surname,
                email,
                password,
                profilePicture
            };
            await db.collection("Users").add(user);
        }
        res.status(201).json({
            status: "success",
            message: "Users created",
        });
    } catch (err) {
        next(err);
    }
};

//Generare si stocare articole fake avand titlu, continut, data la care a fost creat, 
// id ul autorului (luat random din userii existenti),
// lista de comentarii (titlu, continut, data la care a fost creat si id-ul autorului - luat random din cei existenti)
// like-uri: lista de userId (cei ce a dat like - luati random din cei existenti)
const createFakeArticles = async (req, res, next) => {
    try {
        const { noArticles } = req.body;
        if (!noArticles) {
            throw new AppError("Number of fake articles is required!", 400);
        }

        //Extragere UserID din firestore (document id)
        const usersSnapshot = await db.collection("Users").get();
        const userIds = usersSnapshot.docs.map(doc => doc.id); // vector de UserId

        if (userIds.length === 0) {
            throw new AppError("No users found in the database to associate with articles!", 400);
        }

        //Generare si adaugare articole cu faker
        for (let i = 0; i < noArticles; i++) {
            const title = faker.lorem.lines(1);
            const content = faker.lorem.paragraphs({ min: 10, max: 20 });
            const createdAt = faker.date.between({
                from: new Date(new Date().setFullYear(new Date().getFullYear() - 10)), //O data random din ultimii 10 ani
                to: new Date(), //pana in prezent
            });

            //Selectez un user id random pentru a il folosi ca autor
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

            // Generare articole fake
            const comments = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
                commentId: faker.string.uuid(),
                userId: userIds[Math.floor(Math.random() * userIds.length)],
                content: faker.lorem.sentence(),
                createdAt: faker.date.between({
                    from: createdAt, //data comentariului trebuie sa fie dupa data la care a fost creat articolul
                    to: new Date(),
                }),
            }));

            // Generare like-uri fake (fara duplicate deci userId unic pentru fiecare)
            const likeCount = faker.number.int({ min: 1, max: Math.min(10, userIds.length) });
            const usedUserIds = new Set(); // Fara duplicate -> Set
            const likes = [];

            while (likes.length < likeCount) {
                const userId = userIds[Math.floor(Math.random() * userIds.length)];
                if (!usedUserIds.has(userId)) {
                    likes.push({ userId });
                    usedUserIds.add(userId);
                }
            }

            // Construire obiect/articol
            const article = {
                title,
                content,
                authorId: randomUserId,
                createdAt,
                comments,
                likes,
            };

            // Adaugare articol in Firestore
            await db.collection("Articles").add(article);
        }

        res.status(201).json({
            status: "success",
            message: `${noArticles} articles created successfully.`,
        });
    } catch (err) {
        next(err);
    }
};

export {
    createFakeUsers,
    createFakeArticles
}