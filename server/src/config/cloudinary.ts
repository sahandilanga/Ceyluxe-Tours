import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

type UploadResult = {
  publicId: string;
  secureUrl: string;
};

export function uploadTourImage(buffer: Buffer): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.CLOUDINARY_FOLDER}/tours`,
        resource_type: "image",
        transformation: [
          {
            width: 2200,
            height: 1500,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary did not return an upload"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
        });
      },
    );

    stream.end(buffer);
  });
}

export async function removeTourImage(publicId: string) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
}
