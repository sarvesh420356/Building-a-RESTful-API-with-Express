const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const serverPort = 3001;

let server_URL = "";
// window.location.origin.slice(0, -4) + serverPort + "/chillies/";

router.get("/", (req, res) => {
  console.log("Loading Homepage");
  res.render("changed", { data: "" });
});

router.post("/view", async function (req, res) {
  server_URL = `${req.protocol}://${
    req.get("host").slice(0, -4) + serverPort
  }/chillies/`;

  let response = await axios.get(server_URL);
  console.log("View status: " + response.status);

  res.render("changed", {
    status: response.status,
    data: JSON.stringify(response.data, 4),
  });
});

router.post("/add", async function (req, res) {
  server_URL = `${req.protocol}://${
    req.get("host").slice(0, -4) + serverPort
  }/chillies/`;

  let response = await axios.post(server_URL, req.body);

  console.log("Add status: " + response.status);
  res.render("changed", {
    status: response.status,
    data: "Added " + JSON.stringify(req.body),
  });
});

router.post("/update", async function (req, res) {
  server_URL = `${req.protocol}://${
    req.get("host").slice(0, -4) + serverPort
  }/chillies/${req.body.id}`;

  let response = await axios
    .put(server_URL, req.body)
    .then((response) => {
      console.log("Update status: " + response.status);
      res.render("changed", {
        status: response.status,
        data: "Updated " + JSON.stringify(req.body),
      });
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    });
});

router.post("/delete", async function (req, res) {
  server_URL = `${req.protocol}://${
    req.get("host").slice(0, -4) + serverPort
  }/chillies/${req.body.chId}`;

  let response = await axios
    .delete(server_URL)
    .then((response) => {
      console.log("Delete status: " + response.status);
      res.render("changed", {
        status: response.status,
        data: `Deleted chili ${req.body.chId}`,
      });
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    });
});

app.use("/", router);
app.listen(process.env.port || 3000, () => {
  console.log("listening on port 3000");
});

// app.get("/", function (req, res) {
//   res.sendFile("./index.html", { root: __dirname });
// });

// app.post("/view", async function (req, res) {
//   const data = await axios.get(server_URL).then((res) => {
//     console.log(`statusCode: ${res.status}`);
//   });
//   res.render(__dirname + "/views/layouts/main.html", { data: data });
//   // res.send();
// });

// app.post("/add", function (req, res) {
//   axios.post(server_URL, req.body).then((res) => {
//     console.log(`statusCode: ${res.status}`);
//   });
//   res.sendFile("./index.html", { root: __dirname });
// });

app.post("/update", function (req, res) {
  axios.post(server_URL, req.body).then((res) => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
  });
});

// app.listen(3000, () => {
//   console.log("listening on port 3000");
// });
