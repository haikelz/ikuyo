export const typeDefs = `
  scalar Date
  
  type Guestbook {
    id: ID!
    created_at: Date!
    email: String!
    username: String!
    message: String!
  }
  
  type GetGuestbookResponse {
    statusCode: Int!
    message: String!
    data: [Guestbook!]!
  }
  
  type Query {
    getGuestbook: GetGuestbookResponse!
  }
`;

export const getGuestbookQuery = `
  query {
    getGuestbook {
      statusCode
      message
      data {
        id
        created_at
        username
        message
      }
    }
  }
`;
