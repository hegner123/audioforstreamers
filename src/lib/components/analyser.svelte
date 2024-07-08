<script lang="ts">
	import { writable } from 'svelte/store';
	const WIDTH = writable<number>(0);
	const HEIGHT = writable<number>(0);
	export let dataArray: any = undefined;
	export let analyserCtx: AnalyserNode | undefined = undefined;
	export let isPlaying: boolean = false;
	let canvas: HTMLCanvasElement | undefined = undefined;
	let bufferLength: any = undefined;
	let canvasCtx: any = undefined;
	let drawVisual: any = undefined;

	$: {
		if (isPlaying) {
			handleCanvas();
	    }
	}

	function handleCanvas() {
		if (canvas === undefined) return;
		if (analyserCtx === undefined) return;
        analyserCtx.fftSize = 4096
		canvasCtx = canvas.getContext('2d');
		bufferLength = analyserCtx.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		analyserCtx.getByteTimeDomainData(dataArray);
        analyserCtx.maxDecibels = 0
		WIDTH.set(canvas.width);
		HEIGHT.set(canvas.height);

		function draw() {
			if (analyserCtx === undefined) return;
			bufferLength = analyserCtx.frequencyBinCount;

			dataArray = new Uint8Array(bufferLength);

			canvasCtx.clearRect(0, 0, $WIDTH, $HEIGHT);

			drawVisual = requestAnimationFrame(draw);

			analyserCtx.getByteFrequencyData(dataArray);

			canvasCtx.fillStyle = 'rgba(0, 0, 0,0)';
			canvasCtx.fillRect(0, 0, $WIDTH, $HEIGHT);

			const barWidth = ($WIDTH / bufferLength) * 2.5;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const barHeight = dataArray[i];

				canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
				canvasCtx.fillRect(x, $HEIGHT - barHeight / 2, barWidth, barHeight / 2);

				x += barWidth + 1;
			}
		}
			draw();
	
	}
</script>

<canvas id="analyser" bind:this={canvas}></canvas>
