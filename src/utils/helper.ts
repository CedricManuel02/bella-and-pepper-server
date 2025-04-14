import { PRIVATE_KEY_PEM, PUBLIC_KEY_PEM } from "../constant/constant.js";
import { getOrder } from "../data/order/index.js";
import * as jose from "jose";
import { BadRequestError } from "./error.js";
import { deleteFileService, formatFileService } from "../services/file/index.js";

// Helper function to generate a random string of a given length.
function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
// Helper function to genereate unique Order Number
export async function generateUniqueOrderNumber(): Promise<string> {
  let order_number = "";
  let exists = true;

  while (exists) {
    order_number = `${Date.now().toString(36)}-${generateRandomString(4)}`;

    exists = await getOrder({ order_number });
  }
  return order_number;
}
// ENCRYPT JWT TO JWE
export async function EncryptJWTToJWE(token: string) {
  try {
    const publicKey = await jose.importSPKI(PUBLIC_KEY_PEM, "RSA-OAEP-256");

    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(token))
      .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
      .encrypt(publicKey);

    if (!jwe) throw new BadRequestError("Failed to generate JWE token");

    return jwe;
  } catch (error) {
    console.error("Something went wrong while encrypting JWT to JWE:", error);
    throw new BadRequestError("Something went wrong while decrypting JWE to Token");
  }
}
// DECRYPT JWE TO JWT
export async function DecryptJWEToJWT(jwe: string) {
  try {
    const privateKey = await jose.importPKCS8(PRIVATE_KEY_PEM, "RSA-OAEP-256");

    const { plaintext } = await jose.compactDecrypt(jwe, privateKey);

    const decodedPayload = new TextDecoder().decode(plaintext);

    const payloadBase64Url = decodedPayload.split(".")[1];

    const padding = "=".repeat((4 - (payloadBase64Url.length % 4)) % 4);

    const payloadBase64 = payloadBase64Url + padding;

    const payloadJson = JSON.parse(atob(payloadBase64));

    return { user_email: payloadJson.sub[0], date: payloadJson.sub[1], tokenExpiry: payloadJson.exp };
  } catch (error) {
    console.error("Something went wrong while decrypting JWE to JWT:", error);
    throw new BadRequestError("Something went wrong while decrypting JWE to JWT");
  }
}
// DELETING IMAGE IN CLOUDINARY
export async function DeleteCloudinaryImage({image, folder_name }: {image: string; folder_name: string }) {
  try {
     const fileName = await formatFileService({ image: image });

    const deleteFile = await deleteFileService({
      filename: fileName,
      folder_name,
    });

    if (!deleteFile) throw new BadRequestError("Failed to delete image from cloudinary, please try again");

    return deleteFile;
  } catch (error) {
    console.error("Something went wrong while deleting your image in cloudinary:", error);
    throw new BadRequestError("Something went wrong while deleting your image in cloudinary");
  }
}
