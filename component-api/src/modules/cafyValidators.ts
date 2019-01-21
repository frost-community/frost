import $, { StringContext } from 'cafy';
import { MongoProvider } from 'frost-component';

class ObjectIdContext extends StringContext {
	constructor() {
		super();
		this.push(str => MongoProvider.validateId(str));
	}
}

export {
	ObjectIdContext
};
