import {IConfiguration} from "./configuration";

interface IServerConfig {
    port: number;
    graphQlEndpoint: string;
    graphiQlEndpoint: string;
    envName: string;
}

const configurations: IConfiguration<IServerConfig> = {
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


export const ServerConfig = loadConfiguration();
