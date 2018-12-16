import { ComponentEngine } from 'frost-component';
import frostApi from 'frost-component-api';
import frostWeb from 'frost-component-webapp';

console.log('===========');
console.log('  * Frost  ');
console.log('===========');

const engine = new ComponentEngine();

engine.use(frostApi());
engine.use(frostWeb());

engine.start();
