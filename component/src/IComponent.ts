import ComponentApi from './componentApi/ComponentApi';
import ConsoleMenu from './ConsoleMenu';
import MongoProvider from './MongoProvider';

export default interface IComponent {
	name: string;
	init?: (initManager: { db: MongoProvider }) => Promise<{ setupMenu?: ConsoleMenu }> | { setupMenu?: ConsoleMenu };
	handler: (componentApi: ComponentApi) => void;
}
