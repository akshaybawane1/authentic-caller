const express = require("express");
require("dotenv").config();
const sequelize = require("./Helpers/db_init");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;
const AuthRoutes = require("./Routes/AuthRoutes");
const GlobalContactRoutes = require("./Routes/GlobalContactRoutes");

//Parse request body and convert it to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Allow cross origin requests
app.use(cors());

//swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Authentic Caller API with Swagger",
      version: "1.0.0",
      description: "Authentic Caller API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url: `http://0.0.0.0:3000`, // server url here
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./Routes/*.js"],
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
//serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res, next) => {
  res.send("Authentic caller is running.");
});

//Funnel request through matching endpoints
app.use("/auth", AuthRoutes);
app.use("/global", GlobalContactRoutes);

//Error handling middleware
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    if (res.headerSent) {
      return next(err);
    }
    res.status(err.code || 500);
    res.json({ error: err.message || "Something went wrong." });
  }
});

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Authentic caller is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
