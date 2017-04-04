const SwaggerExpress = require("swagger-express-mw");
const SwaggerUi = require("swagger-tools/middleware/swagger-ui");

import {graphiQLMiddleware, graphQLMiddleware} from "./api/graphql/middleware/graphQLMiddleware";

const express = require("express");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const logger = require("morgan");

const app = express();

const http = require("http");
const server = http.Server(app);

const debug = require("debug")("ndb:sample-service:server");

import {ServerConfig} from "./config/server.config"

const config = {
    appRoot: __dirname  // required config
};

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(compress());
app.use(methodOverride());

app.use(ServerConfig.graphQlEndpoint, graphQLMiddleware());

app.use(ServerConfig.graphiQlEndpoint, graphiQLMiddleware(ServerConfig));

SwaggerExpress.create(config, (err, swaggerExpress) => {
    if (err) {
        throw err;
    }

    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    const port = process.env.PORT || 9641;

    server.listen(port);
});
