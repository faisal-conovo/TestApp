const path = require("path");
const fs = require("fs");
const fastifyStatic = require("fastify-static");
const fastifyCompress = require("fastify-compress");
const Fastify = require("fastify");
const CorsPlugin = require("fastify-cors");
const multiPart = require("fastify-multipart");

const User = require("./Modules/User/route");
const Role = require("./Modules/Role/route");

async function buildApp() {
  const config = {
    bodyLimit: 10485760,
    logger: true,
  };

  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    config["https"] = {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/api.acelancing.com/privkey.pem"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/api.acelancing.com/cert.pem"
      ),
    };
  }
  const fastify = Fastify(config);
  fastify.register(CorsPlugin, {
    origin: (origin, cb) => {
      // if(/localhost/.test(origin)){
      //  Request from localhost will pass
      cb(null, true);
      return;
      // }
      // Generate an error on other origins, disabling access
      // cb(new Error("Not allowed"))
    },
  });
  fastify.register(multiPart);

  fastify.get("/", (req, res) => {
    res.status(200).send({
      message: "Welcome to Test App api",
    });
  });

  fastify.register(User, {
    prefix: "api/users",
  });
  fastify.register(Role, {
    prefix: "api/roles",
  });

  return fastify;
}

module.exports = buildApp;
