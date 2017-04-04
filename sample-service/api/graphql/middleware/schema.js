"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const typeDefinitions_1 = require("../typeDefinitions");
const serverResolvers_1 = require("../serverResolvers");
let executableSchema = graphql_tools_1.makeExecutableSchema({
    typeDefs: typeDefinitions_1.default,
    resolvers: serverResolvers_1.default,
    resolverValidationOptions: {
        requireResolversForNonScalar: false
    }
});
exports.schema = executableSchema;
//# sourceMappingURL=schema.js.map