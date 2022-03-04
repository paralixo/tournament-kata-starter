/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { app } from './app';
import { v4 as uuidv4 } from 'uuid';

import * as mongoose from "mongoose";
import {Tournament} from "./app/api/models/models";

const  mongoAtlasUri = "mongodb+srv://user:root@tournament.bo9w2.mongodb.net/my_tournament?retryWrites=true&w=majority";
try {
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  );

} catch (e) {
  console.log("could not connect");
}

const db = mongoose.connection;
db.on('error', console.error.bind(console,' Erreur lors de la connexion'))
db.once('open', function () {
  console.log("Connexion OK !")
})

Tournament.findById(uuidv4().objectId, function(err, tournament) {
  console.log(tournament)
  console.log(err)
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);


