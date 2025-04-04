document.addEventListener("DOMContentLoaded", function () {
    function playGame(playerChoice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        let resultText = "";

        // Ensure sound plays on user interaction
        playSound(playerChoice);

        // Animate hands moving up
        document.getElementById('user-hand').style.transform = 'translateY(-20px)';
        document.getElementById('computer-hand').style.transform = 'translateY(-20px)';

        setTimeout(() => {
            // Update hand emojis
            document.getElementById('user-hand').innerText = getEmoji(playerChoice);
            document.getElementById('computer-hand').innerText = getEmoji(computerChoice);

            // Reset hand position
            document.getElementById('user-hand').style.transform = 'translateY(0)';
            document.getElementById('computer-hand').style.transform = 'translateY(0)';

            // Determine winner
            if (playerChoice === computerChoice) {
                resultText = "It's a Draw!";
            } else if (
                (playerChoice === 'rock' && computerChoice === 'scissors') ||
                (playerChoice === 'paper' && computerChoice === 'rock') ||
                (playerChoice === 'scissors' && computerChoice === 'paper')
            ) {
                resultText = "You Win! 🎉";
            } else {
                resultText = "You Lose! 😢";
            }

            // Display results
            document.getElementById('choices-display').innerText = `You chose: ${playerChoice} | Computer chose: ${computerChoice}`;
            document.getElementById('result').innerText = resultText;
            document.getElementById('restart').style.display = 'block';
        }, 500);
    }

    function getEmoji(choice) {
        switch (choice) {
            case 'rock': return '✊';
            case 'paper': return '✋';
            case 'scissors': return '✌';
            default: return '❓'; // Fallback
        }
    }

    function playSound(choice) {
        let audio = new Audio(`./${choice}.mp3`); // Ensure files are in the same folder
        audio.volume = 0.8; // Set volume
        audio.play().catch(error => console.log("Sound Play Error:", error)); // Catch errors
    }

    function restartGame() {
        document.getElementById('choices-display').innerText = "";
        document.getElementById('result').innerText = "";
        document.getElementById('user-hand').innerText = '✊';
        document.getElementById('computer-hand').innerText = '✊';
        document.getElementById('restart').style.display = 'none';
    }

    // Attach functions globally so they can be used in HTML
    window.playGame = playGame;
    window.restartGame = restartGame;
});
