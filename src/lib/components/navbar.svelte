<nav class="flex navbar">
	<div class="home-anchor">
		<a href="/" class="logo">AudioForStreamers</a>
	</div>
	<ul class="flex navigation">
		<li class="list-style-none">
			<a class="has-drop-down menu-item" href="/topics">Topics</a>
			<ul class="list-style-none drop-down">
				<li>
					<a class="menu-item" href="/compressor"> Compressor / Limiter </a>
				</li>
				<li>
					<a class="menu-item" href="/noisesuppressor"> Noise Suppressor </a>
				</li>
				<li>
					<a class="menu-item" href="/noisegate">Noise Gate</a>
				</li>
				<li>
					<a class="menu-item" href="/eq"> Eq </a>
				</li>
				<li>
					<a class="menu-item" href="/deesser"> DeEsser </a>
				</li>
			</ul>
		</li>
	</ul>
</nav>

<style lang="scss">
	$bg-color: #0d1117;
	$drop-down-bg: #262d38;
	.navigation {
		position: relative;
	}
	.logo,
	.menu-item {
		color: white;
		font-size: 1.5rem;
	}

	a.has-drop-down:hover + ul.drop-down {
		padding: 1rem;
		z-index: 1;
		li {
			display: block !important;
		}
	}

	ul.drop-down {
		display: inline-block;
		position: absolute;
		padding: 0;
		right: 0;
		top: 2rem;
		background: $drop-down-bg;
		width: max-content;
		li {
			width: 100%;
			display: none;
			a {
                display:block;
				width: 100%;
			}
		}

		&:hover {
			padding: 1rem;
			li {
				display: block;
			}
		}
	}
</style>
