# javascript

```js
console.log(typeof "23");
```


JAVASCRIPT VS TYPESCRIPT

javascript vs typescrip

tipado, typscsipt es un superset de javascript que es fuuertemente tipado

react framework 

## Hay que instalar node

https://wiki.archlinux.org/title/Node.js


## tipos

- **boolean** [doc](https://www.w3schools.com/JS/js_booleans.asp)
- **null** - explicitamente
- **undefined** - default value of a valuie
- **number** - [float](https://www.w3schools.com/js/js_numbers.asp) ((-1)^S * (1.M) * 2^(E - Bias) )
- **bigint**  [64 bits](https://www.w3schools.com/js/js_bigint.asp)
- [**string**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- **[symbo1](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)**

Todo lo que no es un primitivo hereda objeto

hay wrapper con mayuscula 

cualquien empty object es true

que es JSON

https://en.wikipedia.org/wiki/JSON

https://es.wikipedia.org/wiki/Protocolo_de_transferencia_de_hipertexto

https://developer.mozilla.org/es/docs/Web/HTTP

por favor vean metodo get y post

https://www.youtube.com/watch?v=FknTw9bJsXM&t=248s

https://www.boot.dev/courses/learn-http-protocol-golang

## por favor aprenda curl


```bash 
curl -H 'Content-Type: application/json' \
      -d '{ "title":"foo","body":"bar", "id": 1}' \
      -X POST \
      https://example.com/posts


      ```


```bash
curl https://reqbin.com/echo
   -H "Cache-Control: must-revalidate"
   -H "Pragma: no-cache"
   -H "Expires: 0"
```
## in the name of the peace


```
> const a = true
undefined
> console.log(typeof a);
boolean
undefined
> 
```

```
> console.log(typeof Boolean(a));
boolean
undefined
> 
> 
> const name = 'Node.js User';
undefined
> 
(To exit, press Ctrl+C again or Ctrl+D or type .exit)
> console.log(typeof name);
string
undefined
> console.log(typeof String(name));
string
undefined

```
===


## [if](https://www.w3schools.com/js/js_if_else.asp)

```js
if (truthy)
{

}
else if (other thing)
{

}
```

## switch 

```js
switch(expression) {
  case x:
    /* CCommenbtariois*/
    // code block
    break;
  case y:
    // code block
    break;
  default:
    // code block
} 
```
## try catch

```js
 <p id="demo"></p>

<script>
try {
  adddlert("Welcome guest!");
}
catch(err) {
  document.getElementById("demo").innerHTML = err.message;
}
</script> 
```
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

## while and stuff 
```
while (i < 10) {
  text += "The number is " + i;
  i++;
}
```
https://www.w3schools.com/js/js_loop_while.asp

## operatorsa

castear !! 

&&

||

== 

vs


https://www.w3schools.com/Js/js_operators.asp


===


ternary

```
let age = 20;
let status = (age >= 18) ? "Adult" : "Minor";
console.log(status); // Output: Adult
```

https://www.w3schools.com/react/react_es6_ternary.asp

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator



## aca dice lo mismo que estamos haciendo

https://www.youtube.com/results?search_query=javascript+101


https://www.w3schools.com/js/

https://hsablonniere.github.io/markleft/prezas/javascript-101.html#1.0


https://www.youtube.com/watch?v=Ps8jOj7diA0&list=PL9D558D49CA734A02

https://es.wikipedia.org/wiki/Modelo_OSI

al fin algo dfe 15 min :) 


https://www.ascii-code.com/163


## installing react 

https://www.w3schools.com/react/react_getstarted.asp



------------
# Tarea

- Generar un formulario, que contenga un input texto que valide el formato del rut.
(generar un `pattern`)

- Use un placeholder para mostrar al usuario que formato debe ingresar
- Usando javascript deben calcular el digito verificador

### refs

- [tutorial a mano para el digito](https://validarutchile.cl/como-calcular-el-digito-verificador-del-rut-de-forma-manual-utilizando-el-algoritmo-del-modulo-11/)