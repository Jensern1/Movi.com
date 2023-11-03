import { request } from "graphql-request";
import { graphql } from "../generated";
import { User } from "../interfaces";
import { useQuery } from "@tanstack/react-query";

/**
 * GraphQL query to find User by Email
 */
const UserByEmail_QUERY = graphql(`
  query UserByEmail($email: String!) {
    userByEmail(email: $email) {
      userID
      username
      password
      email
      library {
        libraryID
        userID
        name
        movies
      }
      favorites
    }
  }
`);

/**
 * GraphQL query to find User by unique ID
 */
const userByID_QUERY = graphql(`
  query UserByID($userID: ID!) {
    userByID(userID: $userID) {
      userID
      username
      password
      email
      library {
        libraryID
        userID
        name
        movies
      }
      favorites
    }
  }
`);

/**
 * Get a user by email.
 * @param {string} email
 * @returns {Promise<User>}
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  const { userByEmail } = await request(
    "http://localhost:4000/",
    UserByEmail_QUERY,
    {
      email,
    }
  );
  return userByEmail as User;
};

/**
 * Get a user by unique ID.
 * @param {string} userID
 * @returns {Promise<User>}
 */
export const getUserByID = async (userID: string): Promise<User> => {
  const { userByID } = await request("http://localhost:4000/", userByID_QUERY, {
    userID,
  });
  return userByID as User;
};

/**
 * React Query hook for user data by unique ID.
 * @param {string} userID
 * @returns {object}
 */
export const useUserQuery = (userID: string) => {
  return useQuery({
    queryKey: [userID],
    queryFn: () => getUserByID(userID),
  });
};
