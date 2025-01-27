```
src/logic
├── junqiLogic.js
└── types
    ├── junqiBoard.js
    ├── junqiGraph.js
    └── junqiNode.js
```
```
class JunqiLogic

- Description:
    Provide interface to initiallize junqi game and handle all the game logics.
- Args:
    jzn (String) - Jim-Zhou Notation of the game state to initialize with
- Variables:
    this.jzn (String) - Jim-Zhou Notation of current game state
    this.rows (Integer) - The number of rows of the game board, must be 12
    this.cols (Integer) - The number of columns of the game board, must be 12
    this.is_terminal (Boolean) - Wether the game is over (True for gameover)
    this.winner (String) - The winner of the game ('r' for Red, '0' for Draw,
                                                   'b' for blue)
    this.layout (Map[String]) - Map the player to their initial layout
- Methods:
    isLegalAction()
        Description:
            Check wether the inputed move is legal.
        Args:
            action (String) - String representation of move
        Returns:
            Boolean: True - The move is legal
                   Flase - The move is illegal
        Modifies:
           None
        Example:
          >>> isLegalAction("b2c2")
              True
          >>> isLegalAction("b2b3")
              False

    applyAction()
        Description:
            Apply action to the game and update jzn
        Args:
            action (String) - String representation of move
        Returns:
            None
        Modifies:
            this.jzn
        TODO:
            Check if the action is legal before going into the apply action logic

    isTerminal()
        Description:
            Check if the game is end
        Args:
            None
        Returns:
            Boolean: True - The game is over
                     False - The game is not over
        Modifies:
            this.is_terminal

    getWinner()
        Description:
            Get the winner of the game
        Args:
            None
        Returns:
            String: r - Red wins
                    0 - Draw
                    b - Blue wins
        Modifies:
            this.winner

    isLegalLayout()
        Description:
            Check wether the recieved layout is legal
        Args:
            layout (string) - Jim-Zhou Notation (shortened) of a players initial
                              layout. See the example.
        Returns:
            Boolean
        Modifies:
            None
        Example:
            >>> isLegalLayout('lalllllllll0l0lll0lll0l0lllllb')
                False

    applyLayout()
        Description:
            Apply a layout for a player
        Args:
            layout (string) - Jim-Zhou Notation (shortened) of a players initial
                              layout. Must be legal.
        Returns:
            None
        Modifies:
            this.jzn
            this.layout - this.layout.set('r', layout) // if the player is red else 'b'
        Note:
            The player information is contained in the inputed JZN string `layout`.
            (Red always have lowercase letter while Blue always has uppercase letters)

    getMaskedJzn()
        Description:
            Get masked JZN string for a player.
        Args:
            player (string) - The perspective('r' for red's side, 'b' for blue's side)
        Returns:
            masked_jzn (string): Masked JZN for the whole board. Use '#' to mask
                                 unknown digits
        Modifies:
            None
        Note:
            Generally, a player cannot see the type of opposite player's pieces.
            But please note that if the 司令(L/l) of the player dies, the opposite
            player can see the position of 军旗(A/a) of the player.
        Example: (See the pictures below)
            >>> getMaskedJzn('b')
                0a##0L##0#0000000000000000000000000B000000000GB000JK000CACC0 r 30 149
            >>> getMaskedJzn('r')
                0acc0#jc0e0000000000000000000000000#000000000##000##000####0 r 30 149
```
