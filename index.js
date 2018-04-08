"use strict";

import express from "express";
const dotenv = require("dotenv").config();
import path from "path";
import { MongoClient } from "mongodb";
import typeDefs from "./typeDefs";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import { makeExecutableSchema } from "graphql-tools";
import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import bodyParser from "body-parser";
import session from "express-session";

const PORT = process.env.PORT;
const app = express();

const mongoUser = process.env.DBUSER;
const mongoPass = process.env.DBPASSWORD;
const url = `mongodb://${mongoUser}:${mongoPass}@ds237669.mlab.com:37669/data-one`;
const dbName = "data-one";

app.use(express.static(path.join(__dirname, "client/build")));
app.use(
  session({
    secret: "funandgames",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const start = async () => {
  const client = await MongoClient.connect(url);
  const db = await client.db(dbName);
  const Users = await db.collection("users");

  /*

  const resolvers = {
    Query: {},
    Mutation: {}
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  app.use("/graphql", express.json(), graphqlExpress({ schema }));
  app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  */

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLEID,
        clientSecret: process.env.GOOGLESECRET,
        callbackURL: "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
        Users.findAndModify(
          { googleId: profile.id },
          [],
          {
            $setOnInsert: {
              googleId: profile.id,
              displayName: profile.displayName,
              profilePic: profile._json.image.url
            }
          },
          {
            upsert: true,
            new: true
          },
          (err, user) => {
            return cb(err, user.value);
          }
        );
      }
    )
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/loginCheck", (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.send(null);
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.json({ message: "success" });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/", "index.html"));
  });

  app.listen(PORT);
  console.log("Now listening on port", PORT);
};

start().catch(err => {
  console.log(err);
});
