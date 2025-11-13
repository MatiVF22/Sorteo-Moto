const form = document.getElementById("form-compra");
const cantidadInput = form.elements["cantidad"];
const totalSpan = document.getElementById("total");

const PRECIO_NUMERO = 5000;
const BACKEND_URL = "https://tu-backend.com"; // <-- CAMBIAR POR TU DOMINIO / URL DEL SERVER

function actualizarTotal() {
  const cantidad = parseInt(cantidadInput.value || "1", 10);
  const total = PRECIO_NUMERO * Math.max(cantidad, 1);
  totalSpan.textContent = `$${total.toLocaleString("es-AR")}`;
}

cantidadInput.addEventListener("input", actualizarTotal);
actualizarTotal();

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const datos = {
    nombre: form.elements["nombre"].value,
    email: form.elements["email"].value,
    telefono: form.elements["telefono"].value,
    cantidad: parseInt(form.elements["cantidad"].value, 10),
  };

  try {
    // opcional: desactivar botón mientras se procesa
    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Redirigiendo a Mercado Pago...";

    const resp = await fetch(`${BACKEND_URL}/crear-preferencia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!resp.ok) {
      throw new Error("Error en el servidor");
    }

    const data = await resp.json();

    if (data.init_point) {
      window.location.href = data.init_point; // redirige a Mercado Pago
    } else {
      throw new Error("No se recibió init_point");
    }
  } catch (err) {
    console.error(err);
    alert("Hubo un problema al iniciar el pago. Por favor, intentá de nuevo.");
  } finally {
    const btn = form.querySelector("button[type='submit']");
    btn.disabled = false;
    btn.textContent = "Pagar con Mercado Pago";
  }
});
