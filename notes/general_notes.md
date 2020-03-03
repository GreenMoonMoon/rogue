- [Leveling and Skills](#leveling-and-skills)
- [BOTW and Interaction between Simulated Systems](#botw-and-interaction-between-simulated-systems)
- [Self-imposed limitation](#self-imposed-limitation)
- [Game loop](#game-loop)

# Leveling and Skills
Invest in skill before gathering the experience instead of choosing skill points once you level up. This system open up a different type of strategies (may or may not be a good thing).

# BOTW and Interaction between Simulated Systems
Like BOTW, multiple simulated system can interact together like building block enabling the player to devise unconventionnal or unaccounted for solutions to various problem. This can also enable emergent story and gameplay.

# Self-imposed limitation
Create the game with nothing but the content of the 1-bit tilesheet from kenney.
A locked 16 color palette.

# Game loop
Instead of a classic game loop that run as often as it can, let single out the critical event that should trigger an update like: movement, item consuptions? or other such event. Add a event listener that will update the game, call simulation and render the viewport on these event. (Let's try that)