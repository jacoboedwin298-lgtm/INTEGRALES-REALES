/* =========================
DARK MODE
========================= */

const darkBtn =
document.getElementById('darkBtn');

darkBtn.addEventListener('click',()=>{

document.body.classList.toggle('dark');

if(document.body.classList.contains('dark')){

localStorage.setItem(
'modoOscuro',
'true'
);

darkBtn.innerHTML='☀️';

}else{

localStorage.setItem(
'modoOscuro',
'false'
);

darkBtn.innerHTML='🌙';
}

});

/* CARGAR */

window.addEventListener('load',()=>{

if(localStorage.getItem('modoOscuro')==='true'){

document.body.classList.add('dark');

darkBtn.innerHTML='☀️';
}

});

/* =========================
PONER EJEMPLOS
========================= */

function poner(valor){

document.getElementById(
'integralInput'
).value=valor;

}

/* =========================
LIMPIAR
========================= */

function limpiarTodo(){

document.getElementById(
'integralInput'
).value='';

document.getElementById(
'integralMostrada'
).innerHTML='Esperando integral...';

document.getElementById(
'metodoDetectado'
).innerHTML='Esperando método...';

document.getElementById(
'explicacionPedagogica'
).innerHTML='Aquí aparecerá la explicación...';

document.getElementById(
'procedimiento'
).innerHTML='Aquí aparecerán los pasos...';

document.getElementById(
'resultadoFinal'
).innerHTML='Esperando resultado...';

}

/* =========================
VALIDAR
========================= */

function validarEntrada(exp){

if(exp.trim()===''){

return '⚠️ La integral está vacía';
}

let abiertos =
(exp.match(/\(/g)||[]).length;

let cerrados =
(exp.match(/\)/g)||[]).length;

if(abiertos!==cerrados){

return '⚠️ Faltan paréntesis';
}

return null;

}

/* =========================
DETECTAR METODO
========================= */

function detectarMetodo(exp){

if(
exp.includes('sin') ||
exp.includes('cos') ||
exp.includes('tan')
){

return '📐 Integral trigonométrica';
}

if(exp.includes('e^')){

return '⚡ Integral exponencial';
}

if(exp==='1/x'){

return '📘 Integral logarítmica';
}

if(exp.includes('*')){

return '✋ Integración por partes';
}

if(exp.includes('/')){

return '🧩 Fracciones parciales';
}

return '➕ Integración algebraica';

}

/* =========================
RESOLVER
========================= */

function resolverIntegral(){

const input =
document.getElementById(
'integralInput'
).value.trim();

const error =
validarEntrada(input);

if(error){

alert(error);

return;
}

let metodo =
detectarMetodo(input);

let resultado='';

try{

resultado =
nerdamer
.integrate(input,'x')
.toString();

}catch(e){

try{

resultado =
Algebrite
.integral(input)
.toString();

}catch(err){

resultado =
'No se pudo resolver';
}

}

mostrarResultados(
input,
metodo,
resultado
);

}

/* =========================
MOSTRAR RESULTADOS
========================= */

function mostrarResultados(
input,
metodo,
resultado
){

document.getElementById(
'integralMostrada'
).innerHTML=`

<div class="math-box">

\\[
\\int ${input}dx
\\]

</div>

`;

document.getElementById(
'metodoDetectado'
).innerHTML=metodo;

document.getElementById(
'explicacionPedagogica'
).innerHTML=`
La aplicación detectó automáticamente el método más adecuado para resolver esta integral.
`;

document.getElementById(
'procedimiento'
).innerHTML=
generarPasosPolinomio(input);

document.getElementById(
'resultadoFinal'
).innerHTML=`

<div class="resultado-box">

\\[
\\int ${input}dx=
${resultado}+C
\\]

</div>

`;

MathJax.typesetPromise();

}

/* =========================
GENERAR PASOS
========================= */

function generarPasosPolinomio(expresion){

let limpio =
expresion.replace(/-/g,'+-');

let partes =
limpio.split('+');

let html='';

let paso=1;

partes.forEach((termino)=>{

if(termino.trim()==='') return;

/* POTENCIAS */

if(termino.includes('x^')){

let separar =
termino.split('x^');

let coef =
separar[0];

let potencia =
parseFloat(separar[1]);

if(coef==='' || coef==='+'){

coef=1;
}

if(coef==='-'){

coef=-1;
}

coef=parseFloat(coef);

let nuevaPotencia =
potencia + 1;

let nuevoCoef =
coef / nuevaPotencia;

html += `

<div class="paso-card">

<h3>
Paso ${paso}
</h3>

<p>
Integramos:
</p>

<div class="math-box">

\\[
\\int ${termino}dx
\\]

</div>

<p>
Usamos la regla:
</p>

<div class="math-box">

\\[
\\int x^n dx=
\\frac{x^{n+1}}{n+1}
\\]

</div>

<p>
Resultado:
</p>

<div class="resultado-box">

\\[
${nuevoCoef}x^
{${nuevaPotencia}}
\\]

</div>

</div>

`;

}

/* LINEALES */

else if(termino.includes('x')){

let coef =
termino.replace('x','');

if(coef==='') coef=1;

if(coef==='-') coef=-1;

coef=parseFloat(coef);

html += `

<div class="paso-card">

<h3>
Paso ${paso}
</h3>

<p>
Aplicamos:
</p>

<div class="math-box">

\\[
\\int xdx=
\\frac{x^2}{2}
\\]

</div>

<div class="resultado-box">

\\[
${coef/2}x^2
\\]

</div>

</div>

`;

}

/* CONSTANTES */

else{

html += `

<div class="paso-card">

<h3>
Paso ${paso}
</h3>

<p>
Integramos constante:
</p>

<div class="resultado-box">

\\[
${termino}x
\\]

</div>

</div>

`;

}

paso++;

});

return html;

}

