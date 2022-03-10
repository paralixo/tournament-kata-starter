import * as mongoose from "mongoose"

const  mongoAtlasUri = "mongodb+srv://user:root@tournament.bo9w2.mongodb.net/my_tournament?retryWrites=true&w=majority";

export function initDatabaseConnection() {
  try {
    mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Mongoose is connected to the database")
    );

  } catch (e) {
    console.log("Could not connect to mongo database with mongoose");
  }

  const db = mongoose.connection;
  db.on('error', console.error.bind(console,'An error occured while trying to access database'))
  db.once('open', function () {
    console.log("Database successfully opened !")
  })
}
