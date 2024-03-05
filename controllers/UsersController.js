import User from "../models/User.js";
import fs from "fs";

const permanentStorage = "avatars";
const sleep = async (lengthInMS) => {
    await new Promise(resolve => setTimeout(resolve, lengthInMS));
};

// Helpers
async function findAndVerifyUser(req) {
    const user = await User.findById(req.params.id);

    if (!user) {
        req.status = 404;
        throw new Error("User does not exist");
    }

    return user;
}

function getStrongParams(req) {
    if (req.file) {
        req.body.avatar = req.file;
    }

    const { id, firstName, lastName, nickname, email, avatar, password } = req.body;

    return { id, firstName, lastName, nickname, email, avatar, password };
}

export const index = async (req, res, next) => {
    try {
        const users = await User.find();

        res.render("users/index", {
            title: "List of Users",
            users
        });
    } catch(error) {
        next(error);
    }
};

export const show = async (req, res, next) => {
    try {
        const user = await findAndVerifyUser(req);

        res.render("users/show", {
            user,
            title: "User View"
        });
    } catch(error) {
        next(error);
    }
};

export const add = async (req, res, next) => {
    try {
        res.render("users/add", {
            title: "New User"
        });
    } catch(error) {
        next(error);
    }
};

export const edit = async (req, res, next) => {
    try {
        const user = await findAndVerifyUser(req);

        res.render("users/edit", {
            user,
            title: "Edit User"
        });
    } catch(error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const { firstName, lastName, nickname, email, password, avatar } = getStrongParams(req);
        const user = new User({ firstName, lastName, nickname, email });

        const validationErrors = user.validateSync();

        if (validationErrors) {
            if (avatar && fs.existsSync(avatar.path)) {
                fs.unlinkSync(avatar.path);
            }

            const message = Object.values(validationErrors.errors).map(error => error.message);

            res.status(400);

            throw new Error(message.join("\n"));
        }

        if (avatar && fs.existsSync(avatar.path)) {
            fs.copyFileSync(avatar.path, `${permanentStorage}/${avatar.filename}`);
            await sleep(500); // Give the file system some time to write the image before we set it on the user object
            fs.unlinkSync(avatar.path);
            user.avatar = avatar.filename;
        }

        //This register function is built in the mongoose and passcode i.e a plugin gives us a registration function 
        //This registration function will be responsible for taking the password, and converting it to a hash, adding a salt key for extra protection and storing that information in the database
        await User.register(user, password);

        res.redirect("/users");
    } catch(error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { firstName, lastName, nickname, email, password, avatar } = getStrongParams(req);
        const user = await findAndVerifyUser(req);

        user.firstName = firstName;
        user.lastName = lastName;
        user.nickname = nickname;
        user.email = email;

        const validationErrors = user.validateSync();

        if (validationErrors) {
            if (avatar && fs.existsSync(avatar.path)) {
                fs.unlinkSync(avatar.path);
            }

            const message = Object.values(validationErrors.errors).map(error => error.message);

            res.status(400);

            throw new Error(message.join("\n"));
        }

        if (avatar && fs.existsSync(avatar.path)) {
            fs.copyFileSync(avatar.path, `${permanentStorage}/${avatar.filename}`);
            await sleep(500); 
            fs.unlinkSync(avatar.path);
            fs.unlinkSync(`${permanentStorage}/${user.avatar}`);
            user.avatar = avatar.filename;
        }

        if (password) {
            user.setPassword(password);
            //Set password function is a passport method that is provided to the user model i.e responsible for updating the password, fixing the hash, regening the salt and then we save that information
        }

        user.save();

        res.redirect("/users");
    } catch(error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const user = await findAndVerifyUser(req);
        const filepath = `${permanentStorage}/${user.avatar}`;

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await User.findByIdAndDelete(req.params.id);

        res.redirect("/users");
    } catch(error) {
        next(error);
    }
};