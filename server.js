const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

// 🔥 CORS BIEN CONFIGURADO
app.use(cors({
  origin: [
    "https://rad-marigold-6d95d7.netlify.app",
    "http://localhost:5500"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: "TU_ACCESS_TOKEN_REAL"
});

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.post("/crear-pago", async (req, res) => {
  try {
    const { simple = 0, completa = 0, combo = 0 } = req.body;

    const total =
      simple * 100 +
      completa * 150 +
      combo * 1550;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [{
          title: "Pedido Dúo Adonay",
          quantity: 1,
          unit_price: total
        }],
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

    res.json({ init_point: initPoint });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(process.env.PORT || 3000);
