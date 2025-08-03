// track the searches made by a user

import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION_ID!;
const SAVED_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(`https://cloud.appwrite.io/v1`)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const database = new Databases(client);

export const updateTrendingMovies = async (movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.equal("movie_id", movie.id)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        ID.unique(),
        {
          title: movie.title,
          movie_id: movie.id,
          count: 1,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const toggleSaveMovie = async (
  movie: Movie | MovieDetails,
  userId: string
) => {
  try {
    const result = await database.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!,
      [Query.equal("movie_id", movie.id), Query.equal("userId", userId)]
    );
    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        result.documents[0].$id
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        ID.unique(),
        {
          title: movie.title,
          poster_path: movie.poster_path,
          movie_id: movie.id,
          userId,
        }
      );
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSavedMovies = async (userId: string) => {
  try {
    const results = await database.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!,
      [Query.equal("userId", userId)]
    );

    return results.documents as unknown as SavedMovie[];
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
