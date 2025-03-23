import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { createVariantService, deleteVariantService, retrieveVariantService, updateVariantService } from "../../services/variant/index.js";

// CREATE VARIANT CONTROLLER
export async function createVariantController(c: Context) {

    const body = await c.req.parseBody();

    const { product_id } = c.req.param();

    await createVariantService({product_id, variant_data: body });

    return c.json({message: "Successfully created variant", status: StatusCodes.CREATED});
}
// DELETE VARIANT CONTROLLER
export async function deleteVariantController(c: Context) {
    const {variant_id} = c.req.param();

    await deleteVariantService(variant_id);

    return c.json({message: "Successfully deleted variant", status: StatusCodes.ACCEPTED})
}
// RETRIEVE VARIANT CONTROLLER
export async function retrieveVariantController(c: Context) {
    const {variant_id} = c.req.param();

    await retrieveVariantService(variant_id);

    return c.json({message: "Successfully retrieve variant", status: StatusCodes.ACCEPTED})
}
// UPDATE VARIANT CONTROLLER
export async function updateVariantController(c: Context) {
    const body = await c.req.parseBody();

    const { variant_id } = c.req.param();

    await updateVariantService({variant_id, variant_data: body });

    return c.json({message: "Successfully updated variant", status: StatusCodes.ACCEPTED});
}

