import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer, { folder, publicId }) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId || undefined,
                overwrite: true,
                resource_type: "image",
                transformation: [{ width: 512, height: 512, crop: "limit" }]
            },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });
};

export default uploadBufferToCloudinary;
