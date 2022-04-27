require("dotenv").config();

const buildApp = require("./fastify");
const env = require("./configs");
const db = require("./utils/db");
const { bootStrap } = require("./bootstrap");

// Port
const port = env.PORT || 5000;

// Run the server!
const start = async () => {
  const fastify = await buildApp();

  try {
    await db();
    await bootStrap();
    console.log(process.env.NODE_ENV, "hello", port);
    if (process.env.NODE_ENV == "production") {
      await fastify.listen(port, "0.0.0.0");
    } else {
      await fastify.listen(port);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
