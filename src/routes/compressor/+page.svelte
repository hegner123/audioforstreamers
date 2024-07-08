<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import Compressor from '$lib/components/compressor.svelte';
</script>

<Navbar />
<div class="typora-export-content">
	<div class="write">
		<section>
			<h2>Compressors</h2>
			<Compressor />
			<div>
				<h3>Overview</h3>
				<h4>General Purpose</h4>
				<p>To reduce the dynamic range of an audio signal and to shape the signals envelope.</p>
				<h5>When to use</h5>
				<ul>
					<li>
						<p>
							When the speaker has times when they are very quiet and other times when they are very
							loud. A compressor is a good choice to reduce the range between the quietest and the
							loudest sounds.
						</p>
					</li>
				</ul>

				<ol>
					<li>
						<p>
							<strong>Ratio:</strong> The amount by which the compressor will reduce the output signal
							when compared to the input signal.
						</p>
						<ol>
							<li>
								<p>
									<strong>Usage Example:</strong> If you find yourself needing to adjusting your mic
									level in stream often a compressor can help even out the volume.
								</p>
							</li>
							<li></li>
							<p>
								<strong>Technical Explanation:</strong> With a 6:1 ratio when the input signal is over
								the threshold by 6db the output will only increase by 1db.
							</p>
						</ol>
					</li>
				</ol>
			</div>
		</section>
	</div>
</div>
