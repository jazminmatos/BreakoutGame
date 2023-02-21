class Life {
    static lifeContainer = document.getElementById("life");
    static all = []; // maybe use this to keep track of the 5 lives???

    constructor() {
        this.lifeElement = document.createElement("div");
        this.lifeElement.className = "life";

        Life.all.push(this.lifeElement);
    }

    putOnDom() {
        Life.lifeContainer.appendChild(this.lifeElement); // should this be this.LifeElement instead?
    };
    
    static loseLife() {
        // lose life when ball touches bottom
        if (Life.all.length > 1) {
            Life.lifeContainer.removeChild(Life.all.shift());
        } else {
            Life.lifeContainer.removeChild(Life.all.shift());
            // Make gameOver screen disappear
            gameOver.style.display = "block";
            // Populate final score on game over screen
            finalScore.innerText = `Score: ${score}`;
            // freezes ball position
            ballCurrentXYPosition[1] = -1;
            // Reset game score
            score = -1;
            // will increment score to 0
            updateScore();
        };
    };

    static createFiveLives() {
        // create 5 lives
        let left = 75;
        for (let i = 0; i < 5; i++) {
            let leftString = left + "%";
            const heart = new Life();
            heart.lifeElement.style.left = leftString;
            // each life has an id between 0 and 4
            heart.lifeElement.id = i;
            heart.putOnDom();
            left += 5;
        };
    };
};
