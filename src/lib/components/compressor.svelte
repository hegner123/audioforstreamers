<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Analyser from './analyser.svelte';
	import NextSong from './icons/nextSong.svelte';
	import PrevSong from './icons/prevSong.svelte';
	import Meter from './meter.svelte';

	const audioCtxReady = writable<boolean>(false);
	const playingValue = writable<boolean>(false);
	const ratioValue = writable<number>(4);
	const thresholdValue = writable<number>(-0);
	const attackValue = writable<number>(0);
	const releaseValue = writable<number>(0.25);
	const kneeValue = writable<number>(0);
	const outputValue = writable<number>(1);
	const volumeValue = writable<number>(0.5);
	const playingTime = writable<number>(0);
	const reductionValue = writable<number>(0);
	const nowPlaying = writable<string>('./audio/amen.wav');
	const nowPlayingDisplay = writable<string>('Amen');
	const sourceDuration = writable<string>('--:--');
	const songList = writable<string[]>(['./audio/amen.wav', './audio/Roboskater.mp3']);

	let ratioElement: HTMLInputElement;
	let thresholdElement: HTMLInputElement;
	let attackElement: HTMLInputElement;
	let releaseElement: HTMLInputElement;
	let kneeElement: HTMLInputElement;
	let outputElement: HTMLInputElement;
	let audioSource: HTMLAudioElement;
	let button: HTMLElement;
	let audioCtx: AudioContext;
	let source: any;
	let compressor: any;
	let gainN: any;
	let dataArray: any;
	let analyserCtx: any;
	let seekTrack: any;
	let seekBar: any;

	function handleRatioChange(event: Event) {
		const target = event.target as HTMLInputElement;
		ratioValue.set(Number(target.value));
	}
	function handleRatioInput(event: Event) {
		const target = event.target as HTMLInputElement;
		ratioValue.set(Number(target.value));
	}
	function handleThresholdChange(event: Event) {
		const target = event.target as HTMLInputElement;
		thresholdValue.set(Number(target.value));
	}
	function handleThresholdInput(event: Event) {
		const target = event.target as HTMLInputElement;
		thresholdValue.set(Number(target.value));
	}
	function handleAttackChange(event: Event) {
		const target = event.target as HTMLInputElement;
		attackValue.set(Number(target.value));
	}
	function handleAttackInput(event: Event) {
		const target = event.target as HTMLInputElement;
		attackValue.set(Number(target.value));
	}
	function handleReleaseChange(event: Event) {
		const target = event.target as HTMLInputElement;
		releaseValue.set(Number(target.value));
	}
	function handleReleaseInput(event: Event) {
		const target = event.target as HTMLInputElement;
		releaseValue.set(Number(target.value));
	}
	function handleKneeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		kneeValue.set(Number(target.value));
	}
	function handleKneeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		kneeValue.set(Number(target.value));
	}
	function handleOutputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		outputValue.set(Number(target.value));
	}
	function handleOutputInput(event: Event) {
		const target = event.target as HTMLInputElement;
		outputValue.set(Number(target.value));
	}
	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		volumeValue.set(Number(target.value));
	}
	function handleVolumeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		volumeValue.set(Number(target.value));
	}
	function handlePlayClick() {
		if ($audioCtxReady === false) {
			initializeAudioContext();
			audioCtxReady.set(true);
		}
		let frameRate;
		playingValue.set(Boolean(!$playingValue));

		if ($playingValue === true) {
			audioSource.play();
		} else {
			audioSource.pause();
			clearInterval(frameRate);
		}
	}

	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const secondsPart = Math.floor(seconds % 60);
		return `${minutes.toString().padStart(2, '0')}:${secondsPart.toString().padStart(2, '0')}`;
	}

	function updateTime() {
		playingTime.set(audioSource.currentTime);
		reductionValue.set(compressor.reduction);
		updateSeekBar();
	}

	function loadedData() {
		sourceDuration.set(formatTime(audioSource.duration));
	}

	function initializeAudioContext() {
		const AudioContext = window.AudioContext;
		audioCtx = new AudioContext();
		source = audioCtx.createMediaElementSource(audioSource);
		compressor = new DynamicsCompressorNode(audioCtx, {
			threshold: $thresholdValue,
			knee: $kneeValue,
			ratio: $ratioValue,
			attack: $attackValue,
			release: $releaseValue
		});
		gainN = newGainNode();

		thresholdValue.subscribe((v) => setCompressorThreshold(v));
		kneeValue.subscribe((v) => setCompressorKnee(v));
		ratioValue.subscribe((v) => setCompressorRatio(v));
		attackValue.subscribe((v) => setCompressorAttack(v));
		releaseValue.subscribe((v) => setCompressorRelease(v));
		outputValue.subscribe((v) => setOutputVolume(v));
		volumeValue.subscribe((v) => (audioSource.volume = v));

		function setCompressorThreshold(value: number) {
			compressor.threshold.setValueAtTime(value, audioCtx.currentTime);
		}
		function setCompressorKnee(value: number) {
			compressor.knee.setValueAtTime(value, audioCtx.currentTime);
		}
		function setCompressorRatio(value: number) {
			compressor.ratio.setValueAtTime(value, audioCtx.currentTime);
		}
		function setCompressorAttack(value: number) {
			compressor.attack.setValueAtTime(value, audioCtx.currentTime);
		}
		function setCompressorRelease(value: number) {
			compressor.release.setValueAtTime(value, audioCtx.currentTime);
		}
		function setOutputVolume(value: number) {
			gainN.gain.value = value;
		}

		audioSource.addEventListener('timeupdate', updateTime);
		loadedData();

		analyserCtx = audioCtx.createAnalyser();

		// Connect the source to be analysed
		source.connect(analyserCtx);
		source.connect(audioCtx.destination);
	}

	function newGainNode() {
		const gainNode = audioCtx.createGain();
		return gainNode;
	}

	function handleBypassClick() {
		if (source === null) return;
		const active = button.getAttribute('data-active');
		if (active === 'false') {
			button.setAttribute('data-active', 'true');
			button.classList.add('bypassed');

			source.disconnect(audioCtx.destination);
			source.disconnect(analyserCtx);
			source.connect(compressor);
			compressor.connect(gainN);
			gainN.connect(audioCtx.destination);
			gainN.connect(analyserCtx);
		} else if (active === 'true') {
			button.setAttribute('data-active', 'false');
			button.classList.remove('bypassed');

			source.disconnect(compressor);
			compressor.disconnect(gainN);
			gainN.disconnect(audioCtx.destination);
			gainN.disconnect(analyserCtx);
			source.connect(audioCtx.destination);
			source.connect(analyserCtx);
		}
	}
	function selectSong(song: string) {
		if ($sourceDuration !== '--:--') {
			nowPlaying.set(song);
			sourceDuration.set('--:--');
			playingValue.set(false);
		}
	}
	function updateMeta(e: any) {
		console.log(e.target.duration);
		sourceDuration.set(formatTime(e.target.duration));
	}

	function updateSeekBar() {
		const percentage = ($playingTime / audioSource.duration) * 100;
		seekBar.style.width = percentage + '%';
		seekTrack.setAttribute('aria-valuenow', percentage.toFixed(2));
	}

	function fetchStockAudio() {
		fetch('/audio')
			.then(async (res) => {
				const songs = await res.json();
				return songs;
			})
			.then((songs) => {
				console.log(songs);
				songList.set(songs);
			});
	}

	function formatFileName(fileName: string): string {
		// Remove three-letter extension if it exists
		const nameWithoutExtension = fileName.replace(/\.[a-zA-Z0-9]{3}$/, '');

		// Capitalize the first word
		const capitalized =
			nameWithoutExtension.charAt(0).toUpperCase() + nameWithoutExtension.slice(1);

		// Replace underscores with spaces
		const formattedName = capitalized.replace(/_/g, ' ');

		return formattedName;
	}

	function getCurrentSong() {
		return $songList.indexOf($nowPlaying);
	}

	function checkArrayNextV(v: number, arr: Array<string>) {
		if (arr[v + 1] === undefined) {
			return 0;
		} else {
			return v;
		}
	}
	function checkArrayPrevV(v: number, arr: Array<string>) {
		if (arr[v - 1] === undefined) {
			return arr.length - 1;
		} else {
			return v;
		}
	}

	function handleNextSong() {
		const current = getCurrentSong();
		const newIndex = checkArrayNextV(current, $songList);
		selectSong($songList[newIndex]);
	}

	function handlePrevSong() {
		const current = getCurrentSong();
		const newIndex = checkArrayPrevV(current, $songList);
		selectSong($songList[newIndex]);
	}

	onMount(() => {
		fetchStockAudio();
	});

	onDestroy(() => {
		audioCtxReady.set(false);
	});
</script>

<div class="demo">
	<div class="compressor">
		<button
			id="bypass"
			class="bypass-button"
			bind:this={button}
			on:click={() => handleBypassClick()}
			data-active="false"
		>
			Bypass
		</button>
		<label for="ratio">Ratio: {$ratioValue}</label>
		<input
			name="ratio"
			id="ratio"
			type="range"
			bind:this={ratioElement}
			min="1"
			max="20"
			value={$ratioValue}
			on:change={handleRatioChange}
			on:input={handleRatioInput}
		/>
		<label for="threshold">Threshold: {$thresholdValue}</label>
		<input
			name="threshold"
			id="threshold"
			type="range"
			bind:this={thresholdElement}
			min="-100"
			max="0"
			value={$thresholdValue}
			on:change={handleThresholdChange}
			on:input={handleThresholdInput}
		/>

		<label for="attack">Attack: {$attackValue}</label>
		<input
			name="attack"
			id="attack"
			type="range"
			bind:this={attackElement}
			min="0.01"
			max="1"
			step="0.01"
			value={$attackValue}
			on:change={handleAttackChange}
			on:input={handleAttackInput}
		/>
		<label for="release">Release: {$releaseValue}</label>
		<input
			name="release"
			id="release"
			type="range"
			bind:this={releaseElement}
			min="0.01"
			max="1"
			step="0.01"
			value={$releaseValue}
			on:change={handleReleaseChange}
			on:input={handleReleaseInput}
		/>
		<label for="kneee">Knee</label>
		<input
			name="knee"
			id="knee"
			type="range"
			bind:this={kneeElement}
			min="0"
			max="40"
			value={$kneeValue}
			on:change={handleKneeChange}
			on:input={handleKneeInput}
		/>
		<label for="output">Output</label>
		<input
			name="output"
			id="output"
			type="range"
			bind:this={outputElement}
			min="0"
			max="1"
			step="0.01"
			value={$outputValue}
			on:change={handleOutputChange}
			on:input={handleOutputInput}
		/>
	</div>
	<div class="player">
		<div class="player-controls">
			<div class="display">
				<h3>{$nowPlayingDisplay}</h3>
			</div>
			<div
				class="seek-track"
				id="seekTrack"
				role="slider"
				aria-label="Seek track"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow="0"
				bind:this={seekTrack}
			>
				<div class="seek-bar" id="seekBar" bind:this={seekBar}></div>
			</div>
			<div class="transport">
				<button class="transport-button" on:click={handlePrevSong}>
					<PrevSong />
				</button>
				<button class="transport-button" on:click={handlePlayClick}>
					{#if $playingValue}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<rect x="6" y="5" width="4" height="14" />
							<rect x="14" y="5" width="4" height="14" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<path d="M8 5v14l11-7z" />
						</svg>
					{/if}
				</button>
				<button class="transport-button"  on:click={handleNextSong}>
					<NextSong />
				</button>
			</div>
			<p class="time-display">{formatTime($playingTime)} / {$sourceDuration}</p>
			<div class="volume-control">
				<label for="volume">Volume</label>
				<input
					type="range"
					id="volume"
					name="volume"
					min="0"
					max="1"
					step="0.01"
					value={$volumeValue}
					on:change={handleVolumeChange}
					on:input={handleVolumeInput}
				/>
			</div>
		</div>
		{#if compressor !== undefined}
			<p>Reduction: {Math.round($reductionValue)}</p>
			<Meter input={$reductionValue} min={0} max={100} />
		{/if}
		<div class="canvas">
			<Analyser {dataArray} {analyserCtx} isPlaying={$playingValue} />
		</div>
		<div class="library">
			<!--File Upload-->
			<!--Track Library-->
			{#each $songList as song}
				<button class="track-item" on:click={(e) => selectSong(`./audio/${song}`)}
					>{formatFileName(song)}</button
				>
			{/each}
		</div>
	</div>
	<audio
		src={$nowPlaying}
		id="audio-input"
		bind:this={audioSource}
		on:loadedmetadata={(e) => {
			updateMeta(e);
		}}
		loop
	></audio>
</div>

<style>
	.demo {
		display: flex;
		justify-content: space-evenly;
	}
	.compressor {
		background: #333333;
		border-radius: 15px;
		display: grid;
		padding: 2rem;
		width: 300px;
	}
	.player {
		display: block;
		background: #333333;
		border-radius: 15px;
		padding: 2rem;
		width: 400px;
	}
	.player-controls {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		align-items: center;
	}
	.transport {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.transport-button {
		display: flex;
		background: #555;
		margin-right: 10px;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		height: 34px;
		width: 34px;
		border: none;
		cursor: pointer;
		grid-column-start: 1;
		grid-column-end: 2;
		box-shadow: 2px 2px 0 0 rgb(0, 0, 0);
	}
	.transport-button:hover {
		filter: brightness(0.9);
	}

	.time-display {
		margin-top: auto;
		margin-bottom: auto;
		grid-column-start: 2;
		grid-column-end: -1;
	}
	.bypass-button {
		background: #555;
		border-radius: 15px;
		border: none;
		box-shadow: 3px 3px 5px 0 #000;
		margin-bottom: 2rem;
	}
	.volume-control {
		grid-column-start: 1;
		grid-column-end: -1;
	}
	.library {
		display: grid;
		grid-template-columns: 1fr;
	}
	.track-item {
		grid-column: 1/-1;
		color: black;
		cursor: pointer;
	}
	.seek-track {
		flex: 1;
		margin: 0 10px;
		position: relative;
		height: 8px;
		grid-column: 1/-1;
		margin-bottom: 2rem;
		background-color: #ddd;
		cursor: pointer;
	}
	.seek-bar {
		height: 100%;
		background-color: #007bff;
		position: absolute;
		top: 0;
		left: 0;
	}
	.is-playing {
		filter: brightness(0.8);
	}
</style>
