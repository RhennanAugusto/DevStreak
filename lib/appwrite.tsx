import { Account, Client, Databases } from "react-native-appwrite";

// lê envs
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!;


export const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT)
  .setPlatform(PLATFORM);

export const account = new Account(client);
export const databases = new Databases(client);

// exports extras para chamadas REST (logout com JWT)
export const APPWRITE_ENDPOINT = ENDPOINT;
export const APPWRITE_PROJECT_ID = PROJECT;

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABITS_TABLE =  process.env.EXPO_PUBLIC_TABLE_HABITS_ID!;

export interface RealTimeResponse {
    events:  string[];
    payload: any;
  }