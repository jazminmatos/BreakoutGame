# Reminders

- Refactor, refactor, refactor
- Are there any 'let's that can be 'const' instead?
- Don't forget your semicolons!

# More Ideas to Implement & Thoughts on How to Implement Them

- Powerups

  - create a powerup class
  - instances initialized with powerupElement (creates a div, adds a class name, provides arguments for desired styling)
    - Wider paddle powerup
      - function: makes it appear behind random brick
      - function: when ball collides w/ powerup parameters, paddle.shapeElement.style.width changes to be longer
        - This would trigger a setInterval. When time runs out, paddle reverts back to original shape
    - Ball phaser powerup (ball goes through bricks & makes them disappear)
      - function: makes it appear behind random brick
      - create variable: let ballPhaser = false
      - change brickDisappearsAndScore
        - when ballPhaser === false, ball direction changes when hitting bricks
        - when ballPhaser === true, i.e. when ball collides w/ this powerup, ball direction does NOT change when hitting bricks (but still makes bricks disappear)
      - powerup triggers a setInterval. When time runs out, ballPhaser = false
    - Shoot lasers from the paddle
      - function: makes it appear behind random brick
      - Once ball collides w/ powerUp, now have access to an eventListener that listens for spacebar
        - whenever spacebar is pressed a 'laser' (line) moves out of the middle of the paddle and onto a brick
          - function: allows 'laser' to move across y-axis
          - function: laser/brick collision - whenever laser collides w/ brick, brick disappears
          - setInterval/clearInterval so that it doesn't last forever

- Difficulty

  - Once player starts game, they can choose between 3 difficulties (easy, medium, hard). Based on their decision, ballTimer changes to 7, 5, and 2 respectively
    - After Start Game button is clicked, 3 buttons appear: easy, medium, hard
    - Can implement eventListeners on each, which will appropriate milliseconds using a variable
      - let time = 7 (or 5, or 2)
    - ballTimer = setTimeout(moveBall, time)

- Hi-Score: keep track of the first few # of hi-scores
  - Might be useful to turn score into a class in order to add this extra functionality
  - Create a div in HTML to contain ALL hi-score info
    - get element & save onto variable
    - Manipulate innerHTML of container to update hi-scores if score is larger than any scores on the hi-score list
  - Issue: Because there is no backend server, wouldn't be able to compare w/ other players OR compare against yourself if you refresh the page
    - W/out a backend, would only work if you DON'T refresh the page

# Improve code in project

- Create more efficient algorithm for creating bricks so that it's not a nested for loop
- Establish classes w/ inheritance:
  - ball class, brick class, paddle class, and life class could inherit from shape class
    - shape class would have putOnDom() method that would require two inputs: the parent container & the child you want to append to it
- Clean up the change of directions in the collision methods by multiplying by -1 instead of calculating the absolute value and giving it a negative sign
