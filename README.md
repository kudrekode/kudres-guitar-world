ONGOING PROJECT NOT YET DEPLOYED OR BY ANY MEANS FINISHED -- PUBLIC FOR PORTFOLIO

# Kudre's Guitar World

This is a personal project that was developed to improve my react/typescript skills as well as provide a platform for guitar players to have all the essential tools to practice and learn guitar.

I started by outlining the initial objectives I wanted to achieve:
1. Welcome page with some instructions and enter button
2. Guitar tuner
3. Metronome to practice to 
4. Guitar chord calculator
5. Midi drum creator to practice to with spectrum analyser for cool design purposes
6. Guitar chords and tablature theory
7. Design implementation
8. Deploying and SEO

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

Implementing a custom BPM is simple as we can divide 60,000 by a user input BPM number to get the corresponding millisecond value and use this as an interval between playing each metronome clikc. The more tricky part is to implement custom time signatures. 

The most common time signature is 4/4 meaning there are 4 beats in a bar. This is important as a metronome has 2 click sounds, one marking the beat and one marking the bar. So with 4/4 we would have one bar click and three beat clicks (making 4 in total). However, alternative time signatures include things such as 6/8 in which rather than just 6 beats within 8 bars, it means there are triplet tpye patterns within the bar. T
Thus, we can calculate rhythms with 8ths like this:

    if (ts.value === 8) {
    return (60000 / bpm) * (3 / (ts.beats / 2));
    }

Once we had all the rules of how to calculate intervals between beats and when to play a bar click sound, the missing pieces were a user controlled UI and an appealing animation to represent the data.
UseRef is a great React hook for time based intervals since we can store values that don't change during a re-render of the virtual DOM. In other words, we can store use defined intervals within useRefs and then update UI using animationframeRef to dynamically change UI but keep metronome loops playing.

### 3) Guitar Chord Calculator:
The next section I wanted to create was a guitar chord calculator inspired by Oolimo: https://www.oolimo.com/en/guitar-chords/analyze I have used this website countless times to work out waht guitar chord is being played. It consists of a fretboard UI in which you select what notes you are playing and it tells you what that chord is or likely is.

I decided to use Moonwave99/Fretboard.js since it had a method to interact with a fretboard (selecting notes) as well as inbuilt functions for rendering sounds, and showing theory which could be useful later to other parts of the project (to limit needing lots of different packages).

I followed fairly closesly the documentation which had a very simple method to create and a call a fretboard object ( = new Fretboard) and then there are built in methods for mouse events in which you can click frets, save the position of that fret and keep in the render. Since we had everything inside a functional component, the key was to have the render within useRefs so that we could keep the state of the renders even when other elements were re-rendering.

The only really custom part I added was the ability to change the tunings of the guitar (this was straightforward since Fretboard.js took different tunings as a parameter for first note of each string). 
I used Tonal.js which has a detect() method to detect all possible chords from given note inputs:

    const detected = Chord.detect(notes);
    return detected[0];
With this we are able to return the first detected chord.

## 4) Midi Drum Pattern Looper:
This section I was most excited to endevour on but knew it was likely going to be the most challenging. My goal was to create:
- Sequencer (looper) that the user can start and stop playing the audio with
- User controlled time signature and BPM (which would affect sequencer logic and length)
- Drums that conform to the BPM and time sign 
- Instruments that randomly play in user defined key (i.e., user can add or remove instruments like bass that play in the key they have chosen)

I decided to use Tone.js and their sequencer methods. Scribble seemed to be an alternative for Midi file creation with great methods for time signature rules and patterns however, this would have to be used in conjunction with something like Tone.js in order to use an Audio Context in the web view (rather than a DAW solely). 

The Tone.js sequencer method is easy to set up. Using Tone.Transport() you can start and stop sequences that loop automatically. You can specify the number of quarter notes and how many beats a sequence lasts. This was ideal as I imported the time signature controls and BPM controls from the Metronome, refactored slightly and then used these controls with a typescript switch() loop to process the intervals of what samples are played on what beats. This allowed for custom time signatures. 

Realising that incorporating real time key instruments to accompany these drum patterns was an insanely complex job, I decided to leave this for a future patch and instead focus on the next features to get the product ready for deployment.

