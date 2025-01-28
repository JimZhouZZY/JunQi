# Representation Method of the Chessboard Used in This Project

### Standardized Two-Player Army Chessboard State String

This section is inspired by the FEN string used in chess. By connecting multiple strings, it can record the complete game, and the approach is as follows:

- The chessboard can be considered as a 10-row, 5-column list.
- Chess pieces can be represented by a character (char).
- Players can be represented by a character (char).
- With these, we can construct a string to represent any chessboard state.

Let's design it this way. In two-player army chess, there are two sides: we use red (represented by lowercase "red" letters) and blue (represented by uppercase "BLUE" letters):

|      Piece       | Character |     Piece      | Character |
| :--------------: | :-------: | :------------: | :-------: |
|    Commander     |   l (L)   | Platoon Leader |   f (F)   |
|     General      |   k (K)   |  Squad Leader  |   e (E)   |
| Division Leader  |   j (J)   |    Engineer    |   d (D)   |
|  Brigade Leader  |   i (I)   |      Mine      |   c (C)   |
| Regiment Leader  |   h (H)   |      Bomb      |   b (B)   |
| Battalion Leader |   g (G)   |   Army Chess   |   a (A)   |
|   Empty Space    |     0     |                |

With the above definitions, we can now construct a game state. By default, the red side is at the front of the string, followed by suffixes to record the current player, half-move count (number of turns since the last capture), and total move count, separated by spaces. For example:

`0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 30 149`

This represents a chessboard state where the red side is at a disadvantage, and it is the red side's turn. 30 half-moves (turns without a capture) have passed, and 149 total moves have been made. The chessboard, if drawn vertically, looks like this:
