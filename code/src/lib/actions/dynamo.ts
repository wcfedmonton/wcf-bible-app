import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    PutCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

import { _AWS_ACCESS_KEY, _AWS_SECRET_KEY } from "$env/static/private";

const client = new DynamoDBClient({
    region: 'ca-central-1',
    credentials: {
        accessKeyId: _AWS_ACCESS_KEY,
        secretAccessKey: _AWS_SECRET_KEY
    }
});

/**
 * Writes an item to a DynamoDB table. If an item with the same key already
 * exists, it will be overwritten entirely.
 *
 * @param table - The name of the DynamoDB table.
 * @param item - The item to write, where each attribute is a DynamoDB-typed value map.
 */
export function putItem(table: string, item: Record<string, Record<string, string>>) {
    const command = new PutCommand({
        TableName: table,
        Item: item
    });

    client.send(command);
}

/**
 * Deletes an item from a DynamoDB table by its primary key.
 *
 * @param table - The name of the DynamoDB table.
 * @param key - The primary key of the item to delete.
 */
export function deleteItem(table: string, key: Record<string, string>) {
    const command = new DeleteCommand({
        TableName: table,
        Key: key
    });

    client.send(command)
}