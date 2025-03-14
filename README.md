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

I created a "components" dir and created PitchyTuner.tsx to seperate the Pitchy logic from my main pages (I could also maybe even expand this to become a Modal later).

Glenn Reyes has a fantastic post on how to build a tuner using Pitchy which I used to learn my own implementation: https://glennreyes.com/posts/tuner. He used Tone.js as an audio handler and then Pitchy for the actual pitch detection. I decided not to use Tone.js since it is just another weighty package that allows for more complex audio processing, but for my purposes the Web Audio API would suffice.



