import { v2 as cloudinary } from 'cloudinary';
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        };
        const album = albumModel(albumData);
        await album.save();
        res.status(201).json({
            message: "Album created successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add album"
        });
    }
}

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({});
        res.status(200).json({
            success: true,
            albums: allAlbums
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to list albums"
        });
    }
}

const removeAlbum = async (req, res) => {
    try {
    const deletedalbum= await albumModel.findByIdAndDelete(req.body.id);
    console.log("deleted album",deletedalbum)
        res.status(200).json({
            success: true,
            message: "Album deleted successfully"
        })
    }
     catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete album"
        });
    }
}

export { addAlbum, listAlbum, removeAlbum };