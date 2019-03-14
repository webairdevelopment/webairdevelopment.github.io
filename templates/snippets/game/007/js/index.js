const options = ['👊', '✋', '✌️'];
const net = new brain.recurrent.LSTM();
const emoNet = new brain.NeuralNetwork();
const buffer = ['✌️', '👊', '✋', '✌️'];
let data = [buffer.slice()];
const domMyMove = document.getElementById('my-move');
const domCpuMove = document.getElementById('cpu-move');
const domOpts = document.getElementById('options');
const domResult = document.getElementById('result');
const myMoveOrig = domMyMove.innerHTML;
let cpuNextMove = calcNextMove();
const cpuWinLoss = [0.3, 0.3, 0.3];
const emo = {
	happy: '😊😋😌🤓😎😜',
	ecstatic: '🤪😍🤩🤣',
	upset: '😫😡😭😖😣😤',
	worried: '😟😨😕🤨'
};
emoNet.train([
	{input: [0,1,0,1], output: {worried: 1}},
	{input: [1,0,1,0], output: {worried: 1}},
	{input: [0,0,0,1], output: {worried: 0.6, happy: 0.8}},
	{input: [0,0,1,1], output: {worried: 0.3, happy: 1}},
	{input: [1,0,1,1], output: {happy: 1}},
	{input: [0,1,1,1], output: {happy: 0.5, ecstatic: 0.8}},
	{input: [1,1,1,1], output: {ecstatic: 1}},
	{input: [1,1,1,0], output: {worried: 1, happy: 0.5}},
	{input: [0,1,1,0], output: {worried: 1}},
	{input: [1,1,0,0], output: {worried: 1, upset: 0.2}},
	{input: [1,0,0,0], output: {worried: 0.2, upset: 1}},
	{input: [0,0,0,0], output: {upset: 1}},
	{input: [0,1,0,0], output: {upset: 1}},
]);

options.forEach(optId => {
	document.getElementById(optId).addEventListener('click', evt => {
		const myMoveIdx = options.indexOf(optId);
		const scoreValues = {
			[options[myMoveIdx]]: 0.3,         // tie
			[options[(myMoveIdx + 1) % 3]]: 1, // cpu wins
			[options[(myMoveIdx + 2) % 3]]: 0  // cpu loses
		};
		cpuWinLoss.push(scoreValues[cpuNextMove]);
		const cpuEmotions = [...emo[brain.likely(cpuWinLoss.slice(-4), emoNet)]]
			.filter(e => e != null);
		const cpuEmotion = cpuEmotions[Math.floor(Math.random() * cpuEmotions.length)];
		if (scoreValues[cpuNextMove] === 0) {
			domResult.innerHTML = '<div>YOU WON!</div>';
			domResult.className = 'win';
		} else if (scoreValues[cpuNextMove] === 1) {
			domResult.innerHTML = '<div>YOU LOSE!</div>';
			domResult.className = 'lose';
		} else {
			domResult.innerHTML = '<div>TIED!</div>';
			domResult.className = 'tie';
		}
		buffer.push(optId);
		data.push(buffer.slice(-4));
		data = data.slice(-13);
		domMyMove.innerHTML = optId;
		domCpuMove.innerHTML = cpuNextMove + cpuEmotion;
		domOpts.className += ' disabled';
		setTimeout(() => {
			cpuNextMove = calcNextMove();
			setTimeout(() => {
				domMyMove.innerHTML = myMoveOrig;
				domCpuMove.innerHTML = '🤛' + cpuEmotion;
				domOpts.className = '';
				domResult.className = '';
				const cpuScore = cpuWinLoss.reduce((t, s) => t + Math.floor(s), 0);
				const myScore = cpuWinLoss.reduce((t, s) => t + Math.floor(Math.abs(s - 1)), 0);
				domResult.innerHTML = `
					<div class="my-score">${myScore}</div>
					<div class="cpu-score">${cpuScore}</div>
				`;
			}, 1500);
		}, 16);
	});
});

function calcNextMove() {
	net.train(data, {iterations: 200, errorThresh: 0.025});
	const nextMove = net.run(buffer.slice(-3));
	const nextMoveIdx = options.indexOf(nextMove);
	const cpuMoveIdx = (nextMoveIdx + 1) % 3;
	return options[cpuMoveIdx];
}