import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'node:fs/promises'

export const handleImageUpload = async (filePath: string): Promise<string> => {
  cloudinary.config({
    cloud_name: 'recipefinder-mmu',
    api_key: '362424571374775',
    api_secret: 'Dhw06qEYnTBuhCo3Ixj4ZLN_7r4'
  });

  let url = "";

  await cloudinary.uploader.upload(filePath, async function (error, image) {
    console.log("uploading");

    if (error) {
      console.warn(error);
    }
    url = image?.url as string;
    try {
      await unlink(filePath);
      console.log("unlink success");
    } catch (err) {
      console.error("unlink failed");
    }
  });
  return url;
}