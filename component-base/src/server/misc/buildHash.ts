import crypto from 'crypto';

export default function(text: string, algorithm?: string) {
	const sha256 = crypto.createHash(algorithm || 'sha256');
	sha256.update(text);

	return sha256.digest('hex');
}
