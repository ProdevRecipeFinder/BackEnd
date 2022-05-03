import { v2 as cloudinary } from 'cloudinary';

export const handleImageUpload = async (imageWithMeta: string): Promise<string> => {
  cloudinary.config({
    cloud_name: 'recipefinder-mmu',
    api_key: '362424571374775',
    api_secret: 'Dhw06qEYnTBuhCo3Ixj4ZLN_7r4'
  });

  let url = "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg";

  await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageWithMeta}`, function (error, image) {
    console.log("uploading");

    if (error) {
      console.warn(error);
    }
    console.log(image?.url);
    url = image?.url as string
  })
  return url;
}

export const convertToBase64 = (data: string) => {
  return Buffer.from(data, "binary").toString("base64")
}