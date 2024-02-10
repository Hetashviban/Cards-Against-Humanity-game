import User from "../models/User.js";
import fs from "fs";

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
            fs.copyFileSync(avatar.path, `avatars/${avatar.filename}`);
            fs.unlinkSync(avatar.path);
            user.avatar = avatar.filename;
        }

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
            fs.copyFileSync(avatar.path, `avatars/${avatar.filename}`);
            fs.unlinkSync(avatar.path);
            fs.unlinkSync(`avatars/${user.avatar}`);
            user.avatar = avatar.filename;
        }

        if (password) {
            user.setPassword(password);
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
        const filepath = `avatars/${user.avatar}`;

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await User.findByIdAndDelete(req.params.id);

        res.redirect("/users");
    } catch(error) {
        next(error);
    }
};