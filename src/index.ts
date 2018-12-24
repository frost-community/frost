import { ComponentEngine } from 'frost-component';
import frostApi from 'frost-component-api';
import frostWeb from 'frost-component-webapp';

console.log('===========');
console.log('  * Frost  ');
console.log('===========');

const engine = new ComponentEngine({ httpPort: 8080 });

engine.use(frostApi());
engine.use(frostWeb());

engine.start()
.catch(err => {
	console.log(err);
});
