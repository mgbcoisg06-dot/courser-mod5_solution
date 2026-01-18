// STEP 1: Wrap the entire contents of this file in an IIFE
// See Lecture 52, part 1
(function () {
  // STEP 0: Write an array of names that you would like to loop over.
  // NOTE: The assignment says to loop over names, but you can use any array of strings.
  var names = ["Yaakov", "John", "Jen", "Jason", "Paul", "Frank", "Larry", "Paula", "Laura", "Jim"];

  // STEP 6: Loop over the names array and say either 'Hello' or "Good Bye"
  // using either the helloSpeaker's or byeSpeaker's 'speak' method.
  // See Lecture 52, part 1
  // (Note, Step 7 will be done in the SpeakHello.js file.)
  for (var i = 0; i < names.length; i++) {

    // STEP 12: Call the 'speak' method on either the helloSpeaker's or byeSpeaker's
    // 'speak' method on every name in the names array.
    // See Lecture 52, part 1
    
    // Retrieve the first letter of the current name in the loop.
    // Use the string's 'charAt' function. Since we are using var to declare variables,
    // we'll need to use an IIFE to set the firstLetter variable correctly.
    var firstLetter = names[i].charAt(0).toLowerCase();

    // Compare the 'firstLetter' retrieved in STEP 11 to lower case
    // 'j'. If the same, call byeSpeaker's 'speak' method with the current name
    // in the loop. Otherwise, call helloSpeaker's 'speak' method with the current
    // name in the loop.
    if (firstLetter === 'j') {
      byeSpeaker.speak(names[i]);
    } else {
      helloSpeaker.speak(names[i]);
    }
  }
})();
