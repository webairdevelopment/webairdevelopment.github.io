window.onload = function () {
  playing = false;
  Tone.Transport.bpm.value = 60;
  Tone.Transport.loopStart = 0;

  /*
                                 * Melody
                                 */
  var mainMelody = new Tone.Synth({
    volume: -15,
    oscillator: {
      type: "amtriangle",
      harmonicity: 0.5,
      modulationType: "square" },

    envelope: {
      attackCurve: "exponential",
      attack: 0.1,
      decay: 0.5,
      sustain: 0.5,
      release: 2 },

    portamento: 0.02 }).
  chain(Tone.Master);

  var mainMelodyPart = new Tone.Sequence(
  function (time, note) {
    mainMelody.triggerAttackRelease(note, "0:0:1", time);
  },
  [
  "Bb3", // bar 1
  [[null, null], ["Bb3", "A3"]],
  "Bb3",
  [[null, null], ["Bb3", "A3"]],
  [["Bb3"], [null, "C4"]], // bar 2
  [["C4"], [null, "Eb4"]],
  "Eb4",
  [null, ["D4", "Bb3"]],
  [["C4"], [null, "A3"]], // bar 3
  [["F3"], ["D4", "Bb3"]],
  "C4",
  [[null], ["F4", "Bb3"]],
  [["Eb4"], [null, "D4"]], // bar 4, 6 beats
  [["D4"], [null, "C4"]],
  "C4",
  null,
  "Bb3",
  [["A3"], ["Bb4", "A4"]],
  "Bb4", // bar 5
  [[null, null], ["Bb4", "A4"]],
  "Bb4",
  [[null, null], ["Bb4", "A4"]],
  [["Bb4"], [null, "C5"]], // bar 6
  [["C5"], [null, "Eb5"]],
  "Eb5",
  [null, ["D5", "Bb4"]],
  [["C5"], [null, "A4"]], // bar 7
  [["F4"], ["D5", "Bb4"]],
  "C5",
  [[null], ["F5", "Bb4"]],
  [["Eb5"], [null, "D5"]], // bar 8
  [["D5"], [null, "C5"]],
  "C5",
  [null, ["Bb5", "A5"]],
  ["Bb5", "F5"], // bar 9
  ["Eb5", ["Bb5", "A5"]],
  ["Bb5", "F5"],
  ["Eb5", ["Bb5", "A5"]],
  [["A5", "Bb5"], null], // bar 10
  ["F5", "Bb4"],
  "Ab5",
  [null, ["Bb5", "A5"]]]);



  /*
                            * Bass Melody
                            */
  var bassMelody = new Tone.MonoSynth({
    volume: -20,
    oscillator: {
      type: "square" },

    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8 },

    filterEnvelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.1,
      release: 0.8,
      baseFrequency: 200,
      octaves: 4 } }).

  toMaster();

  var bassMelodyPart = new Tone.Sequence(
  function (time, note) {
    bassMelody.triggerAttackRelease(note, "0:1", time);
  },
  [
  "Bb1", // bar 1
  null,
  "Eb1",
  null,
  "Bb1", //  bar 2
  null,
  "Bb1",
  ["Bb1", "Bb1"],
  "F1", // bar 3
  ["F1", "Bb1"],
  "F1",
  [null, "D1"],
  ["Eb1", [null, "F1"]], // bar 4, 6 beats
  ["F1", [null, "F1"]],
  "F1",
  "F1",
  [null, ["F1"]],
  [null, ["F1"]],
  "Bb1", // bar 5
  "Bb1",
  "Eb1",
  "Eb1",
  "Bb1", // bar 6
  ["Bb1", [null, "F2"]],
  "Bb1",
  ["Bb1", "Bb1"],
  "F1", // bar 7
  ["F2", "F2"],
  "F1",
  ["F1", "D1"],
  ["G1", [null, "F1"]], // bar 8
  ["F1", [null, "F1"]],
  "F1",
  "F1",
  "Bb1", // bar 9
  ["Eb1", "Eb1"],
  "Bb1",
  ["Eb1", "Eb1"],
  "Bb1", // bar 10
  "Bb2",
  ["Eb1", "Eb1"],
  ["Eb1", "F1"]]);



  /*
                    * Play Controls
                    */
  document.
  getElementsByTagName("body")[0].
  addEventListener("click", function () {
    if (!playing) {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
      playing = true;
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      mainMelodyPart.start();
      bassMelodyPart.start();
    } else {
      playing = false;
      Tone.Transport.stop();
      playing = false;
    }
  });
};