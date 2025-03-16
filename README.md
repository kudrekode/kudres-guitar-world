# Kudre's Guitar World

This is a personal project that was developed to improve my react/typescript skills as well as provide a platform for guitar players to have all the essential tools to practice and learn guitar.

I started by outlining the initial objectives I wanted to achieve:
1. Welcome page with some instructions and enter button
2. Guitar tuner
3. Metronome to practice to 
4. Midi drum creator to practice to with spectrum analyser for cool design purposes
5. Guitar chords and tablature theory

## Methodology:

### 1) Guitar Tuner:
The two node packages I found to be the most popular as of 2025 for pitch detection are Pitchfinder https://www.npmjs.com/package/pitchfinder and Pitchy https://www.npmjs.com/package/pitchy. I chose to use Pitchy since it is a pure ES module, so aligns with modern React common practices.

Glenn Reyes has a fantastic post on how to build a tuner using Pitchy which I used to learn my own implementation: https://glennreyes.com/posts/tuner. He used Tone.js as an audio handler and then Pitchy for the actual pitch detection. I decided not to use Tone.js since it is just another weighty package that allows for more complex audio processing, but for my purposes the Web Audio API would suffice.

The main file /components/tuner/PitchyTuner uses my services/AudioService to initialise the Web Audio API (allowing mic access and analysing the input frequencies) and calculates the dominant frequency input using the startPitchDetection() function.
Specifically the function fills an input buffer into a normalized float value which Pitchy can then confirm dominant frequencies (hence notes). Pitchy also has a method to calculate clarity values (we set to > 0.8 with > 50hz) which helps reduce the algorithms likelihood to be detecting background noise pitches.

Once we had the pitch detection algorithm we could manually map out different guitar tunings - this allowed for this programs ability to accomidate for most guitat tunings.

### 2) Metronome:
I decided to use the package "use-sound" since, it seemed perfect for basic playing audio files using react hooks. If I wanted to expand to more complex features I could use this in conjunction with the Web Audio API however, initially this didn't seem needed.
My plan was to import two audio files, click 1 and click 2 and play the corresponding click depending on the BPM and time signature selected.


