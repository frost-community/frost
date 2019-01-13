import $ from 'cafy';
import { MongoProvider } from 'frost-component';

const ObjectIdValidator = $.str.pipe(str => MongoProvider.validateId(str));
const NullableObjectIdValidator = $.str.nullable.pipe(str => MongoProvider.validateId(str));

export {
	ObjectIdValidator,
	NullableObjectIdValidator
};
