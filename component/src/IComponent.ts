import { MongoProvider, ConsoleMenu } from 'frost-core';
import ComponentApi from './componentApi/ComponentApi';

export default interface IComponent {
	name: string;
	init?: (initManager: { db: MongoProvider }) => Promise<{ setupMenu?: ConsoleMenu }> | { setupMenu?: ConsoleMenu };
	handler: (componentApi: ComponentApi) => void;
}
