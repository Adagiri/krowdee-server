import AWS from "aws-sdk";
import awsKeys from "./awsKeys.js";

const { accessKeyId, secretAccessKey } = awsKeys;

const S3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});


export const getSignedUrl = async(key) => {
    try {
        const url = await S3.getSignedUrl('putObject', {
            Bucket: "krowdee-prime-123",
            ContentType: "jpeg",
            Key: key
                })
            console.log(url)
            return url
    } catch (error) {
        throw error
    }
    // return url.url
}