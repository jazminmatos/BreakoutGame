class Shape {
    static allBricks = []
    
    constructor(xPos, yPos, name) {
        this.shapeElement = document.createElement("div");
        this.shapeElement.className = name;
        this.shapeElement.style.left = xPos;
        this.shapeElement.style.bottom = yPos;
    };

    putOnDom() {
        gameBoard.appendChild(this.shapeElement);
    };
    
    // O(n^2) --> not efficient
    static createBricks() { 
        // creates rows at a different height
        let y = 540;
        for (let i = 0; i < 8; i++) {
            let x = 40;
            // creates rows
            for (let j = 0; j < 8; j++) {
                let newX = x.toString() + "px";
                let newY = y.toString() + "px";
                const brick = new Shape(newX, newY, "brick");
                Shape.allBricks.push(brick)
                brick.putOnDom();
                x += 65;
            };
            y -= 30;
        };
    };
};
