from colorama import Fore, Back, Style, init

init(autoreset=True)

PIECE_NAMES = {
    'l': "司", 'k': "军", 'j': "师", 'i': "旅", 'h': "团",
    'g': "营", 'f': "连", 'e': "排", 'd': "工", 'c': "雷",
    'b': "炸", 'a': "旗", '0': "空"
}

def draw_board(board_str):
    board, current_player, half_moves, total_moves = board_str.split()
    rows = [board[i:i+5] for i in range(0, 60, 5)]
    row_labels = 'abcdefghijkl'
    col_labels = '1  2  3  4  5'

    print("  | " + col_labels)
    print("  +" + "---+" * 5)

    for i, row in enumerate(rows):
        row_str = f"{row_labels[i]}｜"
        for piece in row:
            if piece.islower():
                row_str += Back.RED + Fore.WHITE + f"|{PIECE_NAMES[piece]}|" + Style.RESET_ALL
            elif piece.isupper():
                row_str += Back.BLUE + Fore.WHITE + f"|{PIECE_NAMES[piece.lower()]}|" + Style.RESET_ALL
            else:
                row_str += Back.BLACK + Fore.WHITE + f"|{PIECE_NAMES[piece]}|" + Style.RESET_ALL
        print(row_str)
        print("  +" + "---+" * 5)

    print(f"\nCurrent Player {'RED' if current_player == 'r' else 'BLUE'}")
    print(f"Semi Moves: {half_moves}")
    print(f"Total Moves: {total_moves}")

'''Example Usage'''
board_str = "0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 30 149"
draw_board(board_str)
