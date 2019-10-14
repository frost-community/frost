import inputLine from './inputLine';

export default async function(str: string) {
	return (await inputLine(str)).toLowerCase().indexOf('y') === 0;
}
