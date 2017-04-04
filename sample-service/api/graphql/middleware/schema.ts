import {makeExecutableSchema} from "graphql-tools";

import typeDefinitions from "../typeDefinitions";
import resolvers from "../serverResolvers";

let executableSchema = makeExecutableSchema({
    typeDefs: typeDefinitions,
    resolvers: resolvers,
    resolverValidationOptions: {
        requireResolversForNonScalar: false
    }
});

export {executableSchema as schema};
