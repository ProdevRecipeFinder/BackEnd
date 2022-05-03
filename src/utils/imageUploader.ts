import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'node:fs/promises'

export const handleImageUpload = async (rootPath: string, fileName: string): Promise<string> => {
  cloudinary.config({
    cloud_name: 'recipefinder-mmu',
    api_key: '362424571374775',
    api_secret: 'Dhw06qEYnTBuhCo3Ixj4ZLN_7r4'
  });

  let url = "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg";

  const filePath = rootPath + '/' + fileName;

  await cloudinary.uploader.upload(filePath, async function (error, image) {
    console.log("uploading");

    if (error) {
      console.warn(error);
    }
    console.log(image?.url);
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