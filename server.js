const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 RUTA PRINCIPAL (evita el error "/")
app.get("/", (req, res) => {
  res.send("Servidor Dúo Adonay funcionando 🚀");
});

// 💳 CREAR PAGO (SIMULADO / LISTO PARA MERCADO PAGO)
app.post("/crear-pago", (req, res) => {
  const { nombre, telefono, direccion, simple, completa, combo } = req.body;

  const total =
    (simple || 0) * 100 +
    (completa || 0) * 150 +
    (combo || 0) * 1550;

  console.log("Pedido recibido:", {
    nombre,
    telefono,
    direccion,
    simple,
    completa,
    combo,
    total
  });

  // 🔥 LINK DE PAGO (PUEDES REEMPLAZAR POR MERCADO PAGO REAL)
  const fakePaymentLink = "https://www.mercadopago.com.uy/";

  res.json({
    init_point: fakePaymentLink,
    mensaje: "Pago generado correctamente",
    total
  });
});

// 🔥 IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
