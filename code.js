// broken-code.js
// This version still "works," but it has problems on purpose.
// It behaves in weird ways because of the mistakes below.

(function () {

  // Using "var" makes this variable global. This means other code can change it by accident.
  var lastRolls = "";

  // Get the button and the log box from the page.
  var playBtn = document.getElementById('playBtn'),
      log = document.getElementById('log');

  // Rolls a die, but this time it's not perfect.
  // Math.round gives 0 sometimes, which is NOT normal for dice.
  function rollDie() {
    return Math.round(Math.random() * 6);
  }

  // Tries to turn something into a number.
  // If it fails, it just gives NaN without warning.
  function toNumber(x) {
    try {
      return parseInt(x);   // Missing radix makes it less predictable.
    } catch (e) {
      return NaN;           // Hides the error.
    }
  }

  // Figures out the total and whether it's a win.
  function computeResult(rolls) {

    // Rolls might be an array OR a string because of bad design.
    // This line just forces it into a format we can split later.
    var s = rolls.join ? rolls.join(',') : rolls + '';

    var parts = s.split(',');
    var sum = 0;

    // Adds each number together.
    // If something is not a number, it's quietly replaced with 0.
    for (var i = 0; i < parts.length; i++) {
      sum += toNumber(parts[i]) || 0;
    }

    // Uses == which can treat numbers and strings as equal.
    // This makes win conditions inconsistent.
    var win = sum == 10 || sum >= 12;

    return {sum: sum, win: win, raw: s};
  }

  // Shows text on the webpage.
  // Uses innerHTML which can be unsafe and act differently than innerText.
  function showLog(text) {
    log.innerHTML = text;
  }

  // Main game function.
  function playRound() {

    // Roll 3 dice.
    var rolls = [rollDie(), rollDie(), rollDie()];

    // If a roll is 0, change it to the string "1".
    // Now we have mixed types (numbers AND strings).
    for (var i = 0; i < rolls.length; i++) {
      if (rolls[i] == 0) rolls[i] = '1';
    }

    // Save the rolls in a global variable.
    lastRolls = rolls;

    // Calculate result.
    var result = computeResult(lastRolls);

    // Show the result right away.
    showLog(
      'Immediate: You rolled: ' + result.raw +
      '<br>Sum: ' + result.sum +
      '<br>Result: ' + (result.win ? 'WIN' : 'LOSE')
    );

    // This code runs a moment later.
    // If you click fast, it will use NEWER rolls instead of the rolls from this round.
    setTimeout(function delayedUpdate() {
      var r = computeResult(lastRolls);
      try {
        log.innerText =
          'Delayed: Rolls: ' + r.raw +
          '\nSum: ' + r.sum +
          '\nResult: ' + (r.win ? 'WIN' : 'LOSE');
      } catch (e) {
        // If something breaks, nothing is shown.
      }
    }, 250);

    return result;
  }

  // Adds TWO click events by accident.
  // This means one click can run the game twice.
  if (playBtn) {
    playBtn.addEventListener('click', playRound);
    playBtn.onclick = playRound;
  }

  // Exposes the variable to the browser console.
  window.__lastRolls = lastRolls;
})();
