import {ENV} from "../utils"
const {BASE_PATH, API_ROUTES} = ENV;

export class Auth {
    async signIn(data){
        const responee = await fetch (`${ENV.BASE_API}${API_ROUTES.SIGNIN}`, {
            method: "POST",
            headers: {
                "Content-Type": applications/json
            },
            body: JSON.stringify(data)
        })
        console.log(response);
    };
}

export const auth = new Auth()