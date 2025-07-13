import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;

        // Check if files exist
        if (!req.files || !req.files.audio || !req.files.audio[0] || !req.files.image || !req.files.image[0]) {
            return res.status(400).json({
                success: false,
                message: "Audio or image file is missing"
            });
        }

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        // Upload files to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        // Calculate duration
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
        };

        // Save song to database
        const song = new songModel(songData);
        await song.save();

        res.status(200).json({
            success: true,
            message: "Song added successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message + " - Error occurred",
        });
    }
};


const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.status(200).json({
            success: true,
            songs: allSongs
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message + " - Error occurred"
        });
    }
}

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.status(200).json({
            success: true,
            message: "Song removed successfully"
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message + " Error occured"
        })
    }
}


export { addSong, listSong, removeSong }