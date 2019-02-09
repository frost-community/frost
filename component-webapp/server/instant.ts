import express from 'express';

const app = express();
app.use(express.static('built/frontend'));

app.listen(3000, () => {
	console.log('started listening on: port 3000');
});
