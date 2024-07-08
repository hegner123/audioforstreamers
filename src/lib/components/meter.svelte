<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const WIDTH = writable<number>(0);
	const HEIGHT = writable<number>(0);

	let canvas: HTMLCanvasElement;
	let drawVisual: any;

	export let input: any;
	export let min: number;
	export let max: number;

	function draw() {
		let canvasCtx = canvas.getContext('2d');
		let barHeight = Math.abs(Math.round(input));
		let barWidth = $WIDTH;
		if (canvasCtx === null) return;
        console.log(barHeight)

		drawVisual = requestAnimationFrame(draw);


        canvasCtx.clearRect(0, 0, $WIDTH, $HEIGHT);
		let x = 0;

		canvasCtx.fillStyle = 'rgb(255,255,255)';
		canvasCtx.fillRect(x, barHeight, barWidth, 0);
	}
	onMount(() => {
		WIDTH.set(canvas.width);
		canvas.height = max;
			draw();
	});
</script>

<canvas id="meter" bind:this={canvas}></canvas>
