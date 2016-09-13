import * as express from "express";
import * as request from "request";

let app = express();

app.get("/",  (req: express.Request, res: express.Response) => {
    res.send(200, "Hello World!");
});

app.use("/service/sample",  (req: express.Request, res: express.Response) => {
    let url = "http://localhost:9641" + req.url;
    req.pipe(request(url)).pipe(res);
});

app.use("/service/tracing",  (req: express.Request, res: express.Response) => {
    let url = "http://localhost:9651" + req.url;
    req.pipe(request(url)).pipe(res);
});

app.listen(8080, () => {
});
