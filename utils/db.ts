import { MongoClient, Db } from 'mongodb';

let cachedDb: Db;

export async function connectToDatabase(): Promise<{ db: Db }> {
  if (cachedDb) {
    return { db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MongoDB URI or DB name is not defined in environment variables.');
  }

  const client = await MongoClient.connect(uri, {
  });

  cachedDb = client.db();

  return { db: cachedDb };
}
