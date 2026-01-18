// STEP 11: Wrap the entire contents of SpeakGoodBye.js inside of an IIFE
// See Lecture 52, part 2
(function (window) {
  // STEP 8: Create an object, called 'byeSpeaker' to which you will attach
  // the "speak" method and which you will expose to the global context
  // See Lecture 52, part 1
  // DO NOT attach the speakWord variable to the 'byeSpeaker' object.
  var byeSpeaker = {};

  // DO NOT attach the speakWord variable to the 'byeSpeaker' object.
  var speakWord = "Good Bye";

  // STEP 9: Rewrite the 'speak' function such that it is attached to the
  // byeSpeaker object instead of being a standalone function.
  // See Lecture 52, part 2
  byeSpeaker.speak = function(name) {
    console.log(speakWord + " " + name);
  };

  // STEP 10: Expose the 'byeSpeaker' object to the global scope. Name it
  // 'byeSpeaker' on the global scope as well.
  // See Lecture 52, part 2
  window.byeSpeaker = byeSpeaker;

})(window);
// (Note, Step 12 will be done in the script.js file.)
