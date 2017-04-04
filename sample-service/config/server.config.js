"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configurations = {
    development: {
        port: 9641,
        graphQlEndpoint: "/graphql",
        graphiQlEndpoint: "/graphiql",
        envName: ""
    },
    test: {
        port: 9641,
        graphQlEndpoint: "/graphql",
        graphiQlEndpoint: "/graphiql",
        envName: ""
    },
    stage: {
        port: 9641,
        graphQlEndpoint: "/graphql",
        graphiQlEndpoint: "/graphiql",
        envName: ""
    },
    production: {
        port: 9641,
        graphQlEndpoint: "/graphql",
        graphiQlEndpoint: "/graphiql",
        envName: ""
    }
};
function loadConfiguration() {
    const env = process.env.NODE_ENV || "development";
    let conf = configurations[env];
    conf.envName = process.env.NODE_ENV || "development";
    return conf;
}
exports.ServerConfig = loadConfiguration();
//# sourceMappingURL=server.config.js.map