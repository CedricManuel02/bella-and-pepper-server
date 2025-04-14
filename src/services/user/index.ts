import { getAccountByEmailData } from "../../data/account/index.js";
import { getUserData } from "../../data/user/index.js";
import type { TAccountUserID, TAccountEmail } from "../../types/account.types.js";
import { BadRequestError } from "../../utils/error.js";

// SERVICE FOR CHECKING IF THE USER IS EXISTING
export async function isUserExistingService({user_id}: TAccountUserID) {
  try {
    const user = await getUserData(user_id);

    if(!user) throw new BadRequestError("User not found");

    return user;
  } catch (error) {
    console.error("Something went wrong while fetching user existing service:", error);
    throw new BadRequestError("Something went wrong while fetching user existing service");
  }
}

// SERVICE FOR CHECKING IF THE USER IS EXISTING USING EMAIL
export async function isUserExistingByEmailService({user_email}: TAccountEmail) {
  try {
    const user = await getAccountByEmailData({user_email});

    if(!user) throw new BadRequestError("User not found");

    return user;
  } catch (error) {
    console.error("Something went wrong while fetching user existing service:", error);
    throw new BadRequestError("Something went wrong while fetching user existing service");
  }
}
