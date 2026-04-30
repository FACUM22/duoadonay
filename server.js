const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SERVER_KEY = "TU_SERVER_KEY_FIREBASE";

app.get("/enviar", async (req, res) => {
  try {
    const response = await fetch("https://duo-adonay-default-rtdb.firebaseio.com/tokens.json");
    const data = await response.json();

    const tokens = Object.values(data || {}).map(t => t.token);

    for (let token of tokens) {
      await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Authorization": "key=" + SERVER_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title: "🍔 Dúo Adonay",
            body: "No te olvides de hacer tu pedido para mañana 🔥"
          }
        })
      });
    }

    res.send("Notificaciones enviadas");
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo");
});