import ComponentApi from "./componentApi/ComponentApi";
import ConsoleMenu from "./ConsoleMenu";

export default interface IComponent {
	name: string;
	handler: (componentApi: ComponentApi) => void;
	setupMenu?: ConsoleMenu;
}
