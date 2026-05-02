const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

// 🔥 CORS (CLAVE)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 🔑 MERCADOPAGO
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-716390804184957-043000-78937a75a25afce1d3e72a5e1ed932b1-3361553504"
});

// 🧪 TEST
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API funcionando 🚀" });
});

// 💰 CREAR PAGO (IMPORTANTE: POST)
app.post("https://duoadonay.onrender.com/crear-pago", async (req, res) => {
  try {
    const { simple = 0, completa = 0, combo = 0 } = req.body;

    const total =
      simple * 100 +
      completa * 150 +
      combo * 1550;

    if (total <= 0) {
      return res.status(400).json({ error: "Total inválido" });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: "Pedido Dúo Adonay",
            quantity: 1,
            unit_price: total
          }
        ],
        back_urls: {
          success: "https://rad-marigold-6d95d7.netlify.app",
          failure: "https://rad-marigold-6d95d7.netlify.app",
          pending: "https://rad-marigold-6d95d7.netlify.app"
        },
        auto_return: "approved"
      }
    });

    const initPoint =
      result.init_point ||
      result.body?.init_point ||
      result.response?.init_point;

    if (!initPoint) {
      return res.status(500).json({ error: "No se generó link" });
    }

    res.json({ init_point: initPoint });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Error creando pago" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
