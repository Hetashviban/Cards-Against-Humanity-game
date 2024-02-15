import multer from "multer";
import crypto from 'crypto';
import { Router } from "express";
import {index, show, add, edit, create, update, remove} from '../controllers/UsersController.js'

// Create an instance of the Express Router
const router = Router();

// Configure Multer for file uploads
const tempStorageLocation = "temp"; // Temporary storage of images until they are uploaded to the final location 

// Create a storage engine for Multer that defines how and where files should be stored
const storage = multer.diskStorage({
    // Destination function specifies where to store uploaded files
    destination: (_, __, callback) => {
        // In this case, files will be stored in a "temp" directory
        callback(null, tempStorageLocation);
    },
    
    // Filename function defines how uploaded files should be named
    filename: (_, file, callback) => {
        // Generate a unique filename for each uploaded file to prevent conflicts
        // Here, we combine a random hexadecimal key with the original filename
        const filename = `${generateRandomHexKey()}-${file.originalname}`;
        callback(null, filename);
    },
});

// Create a Multer instance with the defined storage engine
const upload = multer({storage});

// Define routes and associate them with controller actions
// These routes are used for user management and access control

router.get("/", index)
router.get("/new", add)
router.get("/:id", show)
router.get("/:id/edit", edit)
router.post("/:id", upload.single("avatar"), create);
router.post("/:id", (req, _, next) => {
    req.method = "put";
    next();
})
router.put("/:id", upload.single("avatar"), update)
router.delete("/:id", remove)

function generateRandomHexKey() {
    return crypto.randomBytes(4).toString("hex");
}

export default router;