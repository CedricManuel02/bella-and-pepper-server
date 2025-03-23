import { getShippingFeeData } from "../../data/shipping/index.js";
import { BadRequestError } from "../../utils/error.js";

export async function getShippingService(payload: {province_id: string}){

    if(!payload.province_id){
        throw new BadRequestError("Province ID not provided");
    }

    const shippingData = await getShippingFeeData({province_id: payload.province_id});

    if(!shippingData){
        throw new BadRequestError("Province not found");
    }

    return shippingData;
}