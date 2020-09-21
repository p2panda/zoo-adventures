import 'core-js/stable';
import 'regenerator-runtime/runtime';

type pandaName = string;

console.log('super webpack');
console.log('gooooood job!');

function sayHelloToPanda(name: pandaName) {
  console.log(`Hello, ${name}!`);
}

sayHelloToPanda('Bubu');
