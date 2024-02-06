const mongoose = require("mongoose");
const connect = mongoose.connect(
  "mongodb+srv://hieuminh091304:130904@finalexamcluster.xnygitq.mongodb.net/login?retryWrites=true&w=majority"
);

connect
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch((e) => {
    console.log("Database connected Failed", e);
    process.exit(1);
  });

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = new mongoose.model("users", loginSchema);

module.exports = collection;
