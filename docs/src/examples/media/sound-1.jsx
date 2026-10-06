import { Sound } from 'xedonium'

// Beethoven, Moonlight Sonata (3rd movement), from Wikimedia Commons (CC BY-SA 2.0 DE)
export default function Demo() {
	return (
		<div className="max-w-md">
			<Sound
				title="Moonlight Sonata, 3rd movement"
				artist="Ludwig van Beethoven"
				src="https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d4/Beethoven_Moonlight_3rd_movement.ogg/Beethoven_Moonlight_3rd_movement.ogg.mp3"
			/>
		</div>
	)
}
