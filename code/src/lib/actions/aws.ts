import { 
    SignUpCommand, 
    CognitoIdentityProviderClient 
} from "@aws-sdk/client-cognito-identity-provider";

import crypto from "crypto";
import { USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET } from '$env/static/private';

export function signUp({ name, email, password }: 
    { name: string, email: string, password: string }) {
    const client = new CognitoIdentityProviderClient({ region: "ca-central-1" });
    const secretHash = computeSecretHash(email, USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET);

    const command = new SignUpCommand({
        ClientId: USER_POOL_CLIENT_ID,
        SecretHash: secretHash,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name }]
    });

    return client.send(command);
}

function computeSecretHash(username: string, clientId: string, clientSecret: string) {
    return crypto
        .createHmac("SHA256", clientSecret)
        .update(username + clientId)
        .digest("base64");
}