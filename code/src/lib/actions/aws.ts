import { 
    SignUpCommand, 
    CognitoIdentityProviderClient 
} from "@aws-sdk/client-cognito-identity-provider";

import { PUBLIC_USER_POOL_CLIENT_ID } from '$env/static/public';

export function signUp({ name, email, password }: 
    { name: string, email: string, password: string }) {
    const client = new CognitoIdentityProviderClient({});

    const command = new SignUpCommand({
        ClientId: PUBLIC_USER_POOL_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name }]
    });

    return client.send(command);
}