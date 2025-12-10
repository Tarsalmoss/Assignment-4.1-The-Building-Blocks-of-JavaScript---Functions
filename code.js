/* code.js
   External JS for game.html
   Implements the playCraps() function called by the form's onsubmit attribute.
   Contains another function that takes a parameter (greetPlayer) as required.
*/

/* 
  greetPlayer(name)
  - parameter: name (string) from the form input
  - builds a greeting message and writes it to the page using .textContent
  - demonstrates a function that accepts a parameter and outputs results
*/
function greetPlayer(name) {
  // find the output element where we will place the greeting
  var outputEl = document.getElementById('output');
  // simple validation: if name is blank, show a validation message using textContent
  if (!name || name.trim() === '') {
    // use textContent to display a validation message (NO alert)
    outputEl.textContent = 'Please enter a display name to play Quarks Casino.';
    // stop further processing in caller if invoked directly
    return false;
  }
  // sanitize and trim the name for display (basic)
  var safeName = name.trim();
  // write a friendly greeting using textContent for clarity
  outputEl.textContent = 'Welcome to Quarks Casino, ' + safeName + ' — good luck!';
  // return the sanitized name for potential caller use
  return safeName;
}

/*
  playCraps(form)
  - Called when the HTML form is submitted (onsubmit="return playCraps(this)")
  - Implements the Craps rules:
      * Generate 2 random numbers between 1 and 6 (dice)
      * Output each die and the sum to the page
      * If sum === 7 or sum === 11 -> "CRAPS – you lose!"
      * Else if die1 === die2 and die1 % 2 === 0 -> "You won!"
      * Else -> "You pushed!"
  - Also performs simple validation on wager and uses greetPlayer(name) to output greeting.
  - Returns false to prevent the page from reloading (keeps experience smooth).
*/
function playCraps(form) {
  // get references to form fields (player name and wager)
  var nameInput = form.playerName; // input element for player name
  var wagerInput = form.wager;     // input element for wager

  // get DOM elements that will display results
  var outputEl = document.getElementById('output');       // primary message area
  var diceResultsEl = document.getElementById('diceResults'); // dice numeric area

  // Validate wager: must be a positive number; show validation messages with innerHTML/textContent
  var wagerValue = Number(wagerInput.value); // convert wager string to number
  if (isNaN(wagerValue) || wagerValue <= 0) {
    // Show validation message using innerHTML (requirement: use innerHTML/textContent for validation)
    outputEl.innerHTML = '<strong>Validation:</strong> Your wager must be a number greater than 0.';
    // return false to prevent form submission / page reload and stop processing
    return false;
  }

  // Call greetPlayer with the provided name; greetPlayer will handle empty-name validation itself.
  var playerName = greetPlayer(nameInput.value);
  if (playerName === false) {
    // greetPlayer already set a message; stop processing
    return false;
  }

  // UX: Show the wager accepted message (use innerHTML to include some markup)
  outputEl.innerHTML = 'Welcome <strong>' + escapeHtml(playerName) + '</strong>! Wager accepted: <em>' + wagerValue + ' credits</em>. Rolling dice...';

  // Generate die1 and die2 as integers 1..6
  var die1 = rollDie(); // random integer 1..6
  var die2 = rollDie(); // random integer 1..6

  // Calculate sum of the dice
  var sum = die1 + die2;

  // Output dice numeric results using .innerHTML (nice formatting)
  diceResultsEl.innerHTML = '<span class="dice">Die 1: ' + die1 + ' &nbsp;&nbsp; Die 2: ' + die2 + ' &nbsp;&nbsp; Sum: ' + sum + '</span>';

  // Determine outcome according to provided rules
  var message = ''; // message to display in outputEl

  // If sum = 7 or sum = 11 -> CRAPS (you lose)
  if (sum === 7 || sum === 11) {
    message = '<strong>CRAPS — you lose!</strong> Better luck at the next quantum flip.';
  }
  // Else if die1 == die2 and die1 % 2 == 0 -> even doubles => You won!
  else if (die1 === die2 && (die1 % 2) === 0) {
    message = '<strong>You won!</strong> Even doubles are lucky at Quarks Casino.';
  }
  // Else -> You pushed!
  else {
    message = '<strong>You pushed!</strong> Neither win nor lose — safe for now.';
  }

  // Append result message to the existing welcoming text using innerHTML
  outputEl.innerHTML += '<br><br>' + message;

  // OPTIONAL: adjust the page a bit for flair (no alerts, only DOM updates)
  // Add a small suggestion based on outcome
  if (message.indexOf('You won') !== -1) {
    outputEl.innerHTML += '<br><span class="small">Payout: ' + (wagerValue * 2) + ' credits (demo payout).</span>';
  } else if (message.indexOf('CRAPS') !== -1) {
    outputEl.innerHTML += '<br><span class="small">Wager lost: ' + wagerValue + ' credits.</span>';
  } else {
    outputEl.innerHTML += '<br><span class="small">No change to your wager — try again.</span>';
  }

  // Return false to prevent the form from performing a full HTTP submit (and reload)
  return false;
}

/*
  rollDie()
  - Helper function to return a random integer between 1 and 6 (inclusive)
  - Encapsulates Math.random logic
*/
function rollDie() {
  // Math.random() returns [0,1). Multiply by 6 -> [0,6). Floor -> 0..5. Add 1 -> 1..6
  return Math.floor(Math.random() * 6) + 1;
}

/*
  escapeHtml(str)
  - Small helper to escape characters used in HTML to avoid injection when building innerHTML
  - Not strictly required for this assignment but good practice
*/
function escapeHtml(str) {
  // If null/undefined, convert to empty string
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
