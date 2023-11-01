import { request } from "graphql-request";
import { graphql } from "../generated";
import { User } from "../interfaces";

/**
 * GraphQL query to authenticate a user.
 */
const CREATE_USER = graphql(`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      email
      favorites
      library {
        libraryID
        userID
        name
        movies
      }
      password
      userID
      username
    }
  }
`);

export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  const endpoint = "http://localhost:4000/";
  const variables = {
    username,
    email,
    password,
  };
  const data = await request(endpoint, CREATE_USER, variables);
  return data.createUser;
};
