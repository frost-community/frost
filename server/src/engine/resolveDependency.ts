import { IComponent } from 'frost-core';

interface Edge {
	src: number;
	dest: number;
}

interface GraphNode {
	incomingCount: number;
	outgoingNodes: number[];
}

class Graph {
	nodes: GraphNode[];

	constructor(nodeCount: number, edges: Edge[]) {
		this.nodes = [];
		for (let i = 0; i < nodeCount; i++) {
			const node: GraphNode = {
				incomingCount: 0,
				outgoingNodes: []
			};
			this.nodes.push(node);
		}
		for (const edge of edges) {
			this.nodes[edge.src].outgoingNodes.push(edge.dest);
			this.nodes[edge.dest].incomingCount++;
		}
	}

	/**
	 * apply kahn's topological sort
	 * @returns the indexes of the sorted nodes
	*/
	sort(): number[] {
		const L: number[] = [];
		const S: number[] = [];

		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].incomingCount == 0) {
				S.push(i);
			}
		}

		while (S.length > 0) {
			const n = S[0];
			S.splice(0, 1);
			L.push(n);

			for (const m of this.nodes[n].outgoingNodes) {
				this.nodes[m].incomingCount--;
				if (this.nodes[m].incomingCount == 0) {
					S.push(m);
				}
			}
		}

		if (this.nodes.some(node => node.incomingCount != 0)) {
			throw new Error('failed to sort');
		}

		return L;
	}
}

export default function resolveDependency(components: IComponent[]): IComponent[] {
	const nameResolutionTable: {[x: string]: number} = { };
	for (let i = 0; i < components.length; i++) {
		nameResolutionTable[components[i].name] = i;
	}

	const edges: Edge[] = [];
	for (let mi = 0; mi < components.length; mi++) {
		for (const dependency of components[mi].dependencies) {
			const moduleIndex = nameResolutionTable[dependency];
			if (moduleIndex == undefined) {
				throw new Error(`component name "${dependency}" of dependency is unknown`);
			}
			edges.push({ src: mi, dest: moduleIndex });
		}
	}

	const graph = new Graph(components.length, edges);
	let sortedIndexes: number[];
	try {
		sortedIndexes = graph.sort().reverse();
	}
	catch (err) {
		throw new Error('dependency resolution is failed');
	}
	const sortedComponents = sortedIndexes.map(i => components[i]);

	return sortedComponents;
}
