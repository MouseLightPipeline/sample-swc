import {graphqlExpress, graphiqlExpress} from "graphql-server-express";
import {Request} from "express";
import {schema} from "./schema";
import {GraphQLServerContext} from "../serverContext";
import {GraphQLSchema} from "graphql";

export function graphQLMiddleware() {
    return graphqlExpress(graphqlRequestHandler);
}

export function graphiQLMiddleware(configuration) {
    return graphiqlExpress({endpointURL: configuration.graphQlEndpoint});
}

function graphqlRequestHandler(req: Request) {
    // Get the query, the same way express-graphql does it.
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
    const query = req.query.query || req.body.query;

    if (query && query.length > 3000) {
        // None of our app"s queries are this long.  Probably indicates someone trying to send an overly expensive query.
        throw new Error("Query too large.");
    }

    // Although most (all?) of the current context is global, Apollo recommends creating a per request context. Within
    // the GraphQLAppContext constructor we may choose to simply return the same contents so long as there is no need
    // for per-request context, but maintain the recommended pattern at this level.
    let appContext = new GraphQLServerContext();

    return {
        schema: schema as GraphQLSchema,
        context: appContext,
        rootValue: {}
    };
}
