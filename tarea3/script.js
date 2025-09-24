function calcularDV(numero) {
  if (!/^\d+$/.test(numero)) return null;
  let suma = 0, mult = 2;
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += Number(numero[i]) * mult;
    mult = (mult === 7) ? 2 : mult + 1;
  }
  const resto = suma % 11;
  const dv = 11 - resto;
  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return String(dv);
}

function formatRut(cuerpo, dv) {
  let res = "";
  for (let i = cuerpo.length - 1, cnt = 0; i >= 0; i--, cnt++) {
    res = cuerpo[i] + res;
    if ((cnt + 1) % 3 === 0 && i !== 0) res = "." + res;
  }
  return res + "-" + dv;
}

function cleanRaw(raw) {
  return raw.replace(/[^0-9kK]/g, "").toUpperCase();
}

function processRut(raw) {
  const hasHyphen = raw.includes("-");
  const cleaned = cleanRaw(raw);
  if (cleaned.length < 2) return { ok: false, reason: "RUT demasiado corto" };

  if (hasHyphen || /[kK]$/.test(raw) || cleaned.length > 8) {
    const cuerpo = cleaned.slice(0, -1);
    const dvIngresado = cleaned.slice(-1);
    const dvCalc = calcularDV(cuerpo);
    if (dvCalc === null) return { ok: false, reason: "Cuerpo no numérico" };
    const formattedGiven = formatRut(cuerpo, dvIngresado);
    const formattedCorrect = formatRut(cuerpo, dvCalc);
    return { ok: true, cuerpo, dvIngresado, dvCalc, formattedGiven, formattedCorrect, valid: dvIngresado === dvCalc };
  } else {
    const cuerpo = cleaned;
    const dvCalc = calcularDV(cuerpo);
    if (dvCalc === null) return { ok: false, reason: "Cuerpo no numérico" };
    const formatted = formatRut(cuerpo, dvCalc);
    return { ok: true, cuerpo, dvCalc, formatted, autoAppended: true, valid: true };
  }
}

const form = document.getElementById("rutForm");
const input = document.getElementById("rut");
const resultado = document.getElementById("resultado");

function removeExistingCorrectButton() {
  const existing = resultado.querySelector(".btn-correct");
  if (existing) existing.remove();
}

function showSuccess(text) {
  resultado.innerHTML = `<span class="msg success">${text}</span>`;
}

function showErrorWithCorrect(res) {
  removeExistingCorrectButton();
  resultado.innerHTML = "
    <span class="msg error">
      DV incorrecto.
      DV correcto: <strong>${res.dvCalc}</strong>.
      RUT sugerido: <strong>${res.formattedCorrect}</strong>.
    </span>
  ";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-correct";
  btn.textContent = "Corregir";
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    input.value = res.formattedCorrect;
    input.focus();
    showSuccess("Campo corregido a ${res.formattedCorrect}");
  });
  resultado.appendChild(btn);
}

function autoFormat() {
  const raw = input.value.trim();
  if (!raw) {
    resultado.textContent = "";
    return;
  }
  const res = processRut(raw);
  if (!res.ok) {
    resultado.textContent = res.reason;
    return;
  }
  if (res.valid && res.autoAppended) {
    input.value = res.formatted;
    showSuccess("DV calculado y agregado: ${res.formatted}");
  } else if (res.valid) {
    input.value = res.formattedGiven || res.formatted;
    showSuccess("RUT válido: ${input.value}");
  } else {
    input.value = res.formattedGiven;
    showErrorWithCorrect(res);
  }
}

input.addEventListener("blur", autoFormat);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    autoFormat();
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  autoFormat();
});
