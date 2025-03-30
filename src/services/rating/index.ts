import { getAdminAccountData } from "../../data/account/index.js";
import { getUserOrderData } from "../../data/order/index.js";
import { getProductData } from "../../data/product/index.js";
import { createRatingProductData, createRatingProductImageData } from "../../data/rating/index.js";
import { getUserData } from "../../data/user/index.js";
import { getVariantData } from "../../data/variant/index.js";
import { BadRequestError } from "../../utils/error.js";
import { createFileService, validateFileService } from "../file/index.js";
import { sendNotificationService } from "../notification/index.js";

export async function createRatingService(payload: {variant_id: string, order_id: string, rating: any}){

    const {order_rating, order_rating_text} = payload.rating;

    if(!payload.variant_id) {
        throw new BadRequestError("Variant ID must be provided");
    }

    if(!payload.rating) {
        throw new BadRequestError("Rating must be provided");
    }

    if(payload.rating.order_rating > 5) {
        throw new BadRequestError("Rating must be less than 5");
    }

    if(payload.rating.order_rating < 1) {
        throw new BadRequestError("Rating must be greater than or equal to 1");
    }
    const variant = await getVariantData(payload.variant_id);

    if(!variant) {
      throw new BadRequestError("Variant not found");
    }

    const product = await getProductData(variant.product_id);

    if(!product) {
        throw new BadRequestError("Product not found");
    }

    const order = await getUserOrderData({order_id: payload.order_id });

    if(!order) {
        throw new BadRequestError("Order not found");
    }

    const user = await getUserData(order.user_id);

    if(!user) {
        throw new BadRequestError("User not found");
    }

  

    // CREATING RATING
    const createRating = await createRatingProductData({order_rating: order_rating, order_rating_text: order_rating_text, order_id: payload.order_id, user_id: user.user_id, product_id: variant.product_id, variant_id: variant.variant_id})
     
    if(!createRating) {
      throw new BadRequestError("Rating not created");
    }

    if (payload.rating.order_rating_image) {
        if (Array.isArray(payload.rating.order_rating_image)) {
          payload.rating.order_rating_image.forEach((file: File) => {
            if (!file) {
              throw new BadRequestError("Image not provided");
            }
          });
        }
     }
    
     await Promise.all(
        Object.keys(payload.rating)
          .filter((key) => key.startsWith("order_rating_image["))
          .map(async (key) => {
            const file = payload.rating[key];
    
            if (!file) {
              throw new BadRequestError(`File ${key} not provided`);
            }
    
            await validateFileService({ image: file });
    
            const uploadFile = await createFileService({
              image: file,
              folder_name: "rating",
            });
            if (!uploadFile) {
              throw new BadRequestError("Cannot upload file, please try again");
            }
    
            const imageRate = await createRatingProductImageData({
                rating_id: createRating.rating_id,
                media_path: uploadFile.url
            });
            
            if(!imageRate) {
                throw new BadRequestError("Failed to upload image, please try again");
            }

            return imageRate
          })
     );
     
     const admin_id = await getAdminAccountData();

     if(!admin_id) {
      throw new BadRequestError("Admin not found");
     }

     const notificationService = sendNotificationService({action: "RATING", user_name: user.user_name, user_sender_id: user.user_id, user_receiver_id: admin_id, product_name: product.product_name });

     if(!notificationService) {
      throw new BadRequestError ("Failed to send notification");
     }

     return createRating;
}