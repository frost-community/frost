import ComponentApi from "./componentApi/ComponentApi";

export default interface IComponent {
	name: string;
	handler: (componentApi: ComponentApi) => void;
}
