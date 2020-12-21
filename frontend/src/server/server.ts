require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import ReactServer from "react-dom/server";
import { createTemplate } from "./basePage";
import { createModel } from "../features/applicationModel";
import { resolveInitialState } from "./resolvers/initialStateResolver";
import request from "request-promise";
import bodyParser from "body-parser";
const config = require("../configs/clientConfig.json");

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.static("dist"));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

server.get("/", async (req, res) => {
  const initialState = await resolveInitialState(req.cookies.token, req.path);
  const appP = createModel(initialState);
  console.log(initialState);
  appP.first().onValue((container) => {
    const body = ReactServer.renderToString(container);
    res.send(
      createTemplate({
        title: "Minuuttijuoma",
        body,
        initialState: JSON.stringify(initialState),
      })
    );
  });
});

server.get("/admin", authorizeAdminView, async (req, res) => {
  const initialState = await resolveInitialState(req.cookies.token, req.path);
  const appP = createModel(initialState);
  console.log(initialState);
  appP.first().onValue((container) => {
    const body = ReactServer.renderToString(container);
    res.send(
      createTemplate({
        title: "Minuuttijuoma",
        body,
        initialState: JSON.stringify(initialState),
      })
    );
  });
});

server.post("/api/users", (req, res) => {
  const body = req.body;
  request
    .post(config.apiEntrypoint + "/api/users", {
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    })
    .then(JSON.parse)
    .then((result) => {
      res.cookie("token", result.token, {
        domain: "192.168.1.251",
        path: "/",
        maxAge: 1000 * 60 * 60 * 60 * 100,
      });
      res.redirect("/");
    })
    .catch((e) => {
      console.error("Error creating user " + e.message);
      res.redirect("/");
    });
});

function authorizeAdminView(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authStr = req.get("authorization");
  if (!authStr) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Node"');
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const decodedAuthStr = new Buffer(authStr.split(" ")[1], "base64").toString(
    "utf8"
  );
  const [username, password] = decodedAuthStr.split(":");
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Node"');
    res.status(401).json({ error: "Unauthorized" });
  }
}

server.listen(PORT, () => console.log("Listening on port", PORT));
