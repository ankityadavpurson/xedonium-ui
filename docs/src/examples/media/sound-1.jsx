import { Sound } from 'xedonium'

// Beethoven, Moonlight Sonata (3rd movement), and the 1820 Stieler portrait, from Wikimedia Commons
export default function Demo() {
	return (
		<div className="max-w-md">
			<Sound
				title="Moonlight Sonata, 3rd movement"
				artist="Ludwig van Beethoven"
				art="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/250px-Beethoven.jpg"
				artAlt="Portrait of Ludwig van Beethoven"
				src="https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d4/Beethoven_Moonlight_3rd_movement.ogg/Beethoven_Moonlight_3rd_movement.ogg.mp3"
			/>
		</div>
	)
}
