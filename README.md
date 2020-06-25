# Comparativa de performance
## Problema
Queremos mergear dos arrays, en los que los elementos pueden tener el mismo id, por ejemplo:
```js
const arr1 = [{id: 1, name: 'madrid'}, {id: 2, name: 'barcelona'}];
const arr2 = [{id: 2, color: 'blue'}, {id: 4, color: 'red'}];
```
y que el resultado de este sea la unión de estos array haciendo un merge a los objetos con el mismo id:
```js
const result = [{id: 1, name: 'madrid'}, {id: 2, name: 'barcelona', color: 'blue'}, {id: 4, color: 'red'}]
```

Contamos con la particularidad de que los elementos vendrán ordenados de manera ascendente por su id.

## Solución
Se proponen tres soluciones a este problema 

### Primera solución
```js
function mergeForward(arr1, arr2) {
  const result = [];

  while (arr1.length && arr2.length) {
    const id1 = arr1[0].id;
    const id2 = arr2[0].id;

    if (id1 === id2) {
      result.push(Object.assign(arr1.shift(), arr2.shift()));
    } else if (id1 < id2) {
      result.push(arr1.shift());
    } else if (id2 < id1) {
      result.push(arr2.shift());
    }

    if (!arr1.length || !arr2.length) {
      Array.prototype.push.apply(result, arr1.length ? arr1 : arr2);
      // Arrays has to be emptied
    }
  }

  return result;
}
```

En esta primera solución recorremos el array en orden natural y seguimos estos pasamos.
1. Observamos si el id de estos elementos coinciden, si es así fusionamos los dos elementos.
2. Si el id de los elementos no coincide, identificamos cual es el menor de ellos y lo llevamos al array resultante.
3. Siempre que incorporamos un elementos al array resultante este se elimina de su array original
4. Por último, si alguno de los arrays ya se ha recorrido en su totalidad, el array que aún no hemos completado se va a mover todo su contenido restante al array resultante. Para hacer este paso tenemos la opción utiliza haciendo uso del push o hacer uso del método concat, viendo este [artículo](https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki) la implementación realizada en javascript de estos métodos hace que el push sea una opción mucho más óptima.

En este caso, aparentemente la complejidad del algoritmo sería O(n + m) (bucle *while*), aunque no es del todo cierto ya que no se van a recorrer todos los elementos de los dos arrays pero dentro del *while* encontramos métodos que pueden añadir complejidad como:
- **push** (complejidad O(1))
- **Object.assign** (complejidad O(n) según el [polyfill de MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign#Polyfill) y que sólo vamos a añadir un objeto al target)
- **splice** (complejidad O(n) según se sugiere este usuario de [stackoverflow](https://stackoverflow.com/a/5175958))

#### Actualizacion #1
En lugar de hacer uso de splice para recoger quitar del array original los elementos que introducimos se utiliza el método **shift** la velocidad del algoritmo mejora visiblemente, obteniendo los siguientes resultados con la prueba de benchmark:
```
splice() x 774,942 ops/sec ±0.29% (92 runs sampled)
unshift() x 1,717,379 ops/sec ±1.32% (87 runs sampled)
```

### Segunda solución
```js
function mergeBackward(arr1, arr2) {
  const result = [];

  while (arr1.length && arr2.length) {
    const lastIndex1 = arr1.length - 1;
    const lastIndex2 = arr2.length - 1;

    if (arr1[lastIndex1].id === arr2[lastIndex2].id) {
      result.unshift(Object.assign(arr1.pop(), arr2.pop()));
    } else if (arr1[lastIndex1].id > arr2[lastIndex2].id) {
      result.unshift(arr1.pop());
    } else if (arr2[lastIndex2].id > arr1[lastIndex1].id) {
      result.unshift(arr2.pop());
    }

    if (!arr1.length || !arr2.length) {
      Array.prototype.unshift.apply(result, arr1.length ? arr1 : arr2);
      // Arrays has to be emptied
    }
  }

  return result;
}
```

Para esta segunda solución, se propone algoritmo similar al primero, pero recorriendo el array a la inversa.

En este caso, los métodos que aparecen que pueden añadir complejidad son:
- **unshift** (complejidad O(1)) pero como se puede ver [aqui](https://jsperf.com/js-unshift-vs-push/1) este método es bastante más lento que el push.
- **Object.assign** (complejidad O(n) según el [polyfill de MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign#Polyfill) y que sólo vamos a añadir un objeto al target)

#### Actualizacion #1
En lugar de disminuir el tamaño del array cambiando la longitud del array, se puede hacer uso del método pop y se puede observar como la velocidad del algoritmo mejora visiblemente, obteniendo los siguientes resultados con la prueba de benchmark:
```
change array.length x 488,297 ops/sec ±0.23% (98 runs sampled)
pop() x 1,161,589 ops/sec ±1.20% (92 runs sampled)
```

### Tercera solución
```js
function mergeWithCursor(arr1, arr2) {
  const result = [];
  let arr1Index = 0,
    arr2Index = 0;

  while (arr1Index < arr1.length && arr2Index < arr2.length) {
    if (arr1[arr1Index].id === arr2[arr2Index].id) {
      result.push(Object.assign(arr1[arr1Index], arr2[arr2Index]));
      arr1[arr1Index] = null;
      arr2[arr2Index] = null;
      arr1Index++;
      arr2Index++;
    } else if (arr1[arr1Index].id < arr2[arr2Index].id) {
      result.push(arr1[arr1Index]);
      arr1[arr1Index] = null;
      arr1Index++;
    } else if (arr2[arr2Index].id < arr1[arr1Index].id) {
      result.push(arr2[arr2Index]);
      arr2[arr2Index] = null;
      arr2Index++;
    }

    if (arr1Index >= arr1.length || arr2Index >= arr2.length) {
      Array.prototype.push.apply(result, arr1Index < arr1.length ? arr1.splice(arr1Index) : arr2.splice(arr2Index));
      // Arrays has to be emptied
    }
  }

  return result;
}
```

Las soluciones antes dadas pretendían tener en memoria siempre el menor número de datos posibles, pero habría otra forma de afrontar el problema que sería mantener en memoría al menos la capacidad completa de los arrays de entrada.

En este caso, los métodos que aparecen que pueden añadir complejidad son:
- **push** (complejidad O(1)).
- **Object.assign** (complejidad O(n) según el [polyfill de MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign#Polyfill) y que sólo vamos a añadir un objeto al target)
- **splice** pero en este caso sólo se ejecutará una vez, al final de proceso para pasar los datos que quedan cuando uno de los dos arrays se ha recorrido al completo.

## Conclusiones
Si ejecutamos el comando npm run perf, podemos ver una comparativa  del rendimiento de estos algoritmos, en el caso de mi PC el resultado obtenido es: 

#### Actualización #1
```
merge with forward x 1,717,379 ops/sec ±1.32% (87 runs sampled)
merge with backward x 1,161,589 ops/sec ±1.20% (92 runs sampled)
merge without free memory x 2,353,080 ops/sec ±0.56% (92 runs sampled)

Fastest is: merge without free memory
```

Igual que en la primera aproximación, si requerimos velocidad y no debemos de tener en cuenta el uso de memoria la elección debería de ser el tercer algoritmo, en caso de que nos importe el uso de memoria la mejor elección sería utlizar el primer algoritmo. Aunque en este caso la diferencia en la velocidad del algoritmo es mucho más reducida.

#### Original
```
merge with forward x 774,942 ops/sec ±0.29% (92 runs sampled)
merge with backward x 488,297 ops/sec ±0.23% (98 runs sampled)
merge without free memory x 2,574,607 ops/sec ±0.29% (93 runs sampled)

Fastest is: merge without free memory
```

Por tanto, parece que el tercer algoritmo sería el más apropiado de usar si requerimos velocidad y no debemos de tener en cuenta el uso de memoria, en caso de que nos importe el uso de memoria la mejor elección sería utlizar el primer algoritmo