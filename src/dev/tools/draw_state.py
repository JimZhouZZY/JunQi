from colorama import Fore, Back, Style, init
import copy

init(autoreset=True)

PIECE_NAMES = {
    'l': "司", 'k': "军", 'j': "师", 'i': "旅", 'h': "团",
    'g': "营", 'f': "连", 'e': "排", 'd': "工", 'c': "雷",
    'b': "炸", 'a': "旗", '0': "空"
}

STATE = ''

def modify_state(coor, piece):
    global STATE
    print("State")
    idx = board_coordinate_to_index([coor])[0]
    STATE = STATE[:idx] + piece + STATE[idx+1:]
    draw_state(STATE+" 0 0 0")


def board_coordinate_to_index(coordinates, total_columns=5):
    indexs = []
    for coordinate in coordinates:
        if len(coordinate) != 2:
            continue
        column = coordinate[0].lower()  # 行的字母部分
        row = int(coordinate[1:])  # 列的数字部分
        row_index = ord(column) - ord('a')
        column_index = row - 1
        index = row_index * total_columns + column_index
        print(index)
        indexs.append(index)
    return indexs

def draw_state(board_str):
    global STATE
    board, current_player, half_moves, total_moves = board_str.split()
    STATE = copy.deepcopy(str(board))
    if len(board) != 60:
        print("Invalid string length!")
        return
    rows = [board[i:i+5] for i in range(0, 60, 5)]
    row_labels = 'abcdefghijkl'
    col_labels = '1   2   3   4   5'

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

logo = r'''|
 |     _______  .______          ___   ____    __    ____
 |    |       \ |   _  \        /   \  \   \  /  \  /   /
 |    |  .--.  ||  |_)  |      /  ^  \  \   \/    \/   /
 |    |  |  |  ||      /      /  /_\  \  \            /
 |    |  '--'  ||  |\  \----./  _____  \  \    /\    /
 |    |_______/ | _| `._____/__/     \__\  \__/  \__/
 |
 |         _______.___________.    ___   .___________. _______
 |        /       |           |   /   \  |           ||   ____|
 |       |   (----`---|  |----`  /  ^  \ `---|  |----`|  |__
 |        \   \       |  |      /  /_\  \    |  |     |   __|
 |    .----)   |      |  |     /  _____  \   |  |     |  |____
 |    |_______/       |__|    /__/     \__\  |__|     |_______|
 |
 |                                                      Jim Zhou, Jan 11, 2025'''

def welcome():
    import os
    os.system("clear")
    print("=============================================================================")
    print(logo)
    print("=============================================================================")
    print("#  ")
    print("#    Welcome to junqi print borad!")
    print("# ")
    print("----------------------------------------------------------------------------")
    print("Example usage: \n")
    print("Input: 0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 30 149 \n")
    print("Output: ")
    state_str = "0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0 r 30 149"
    draw_state(state_str)
    print("----------------------------------------------------------------------------")

import traceback
import readline
if __name__ == "__main__":
    welcome()
    while True:
        try:
            print("=============================================================================")
            user_input = input("Input: ")
            print("Output: ")
            if user_input.lower() == "exit":
                print("Goodbye!")
                break
            elif ((user_input.lower().split(" ")[0] == "idx" or user_input.lower().split(" ")[0] == "index")):
                board_coordinate_to_index(user_input.lower().split(" "))
            elif user_input.lower().split(" ")[0] == "mod":
                coor = user_input.lower().split(" ")[1]
                piece = user_input.split(" ")[2]
                modify_state(coor, piece)
            else:
                draw_state(str(user_input))
            print("=============================================================================")
        except KeyboardInterrupt:
            print("\nProgram interrupted by user. Exiting...")
            break  # 用户按下 Ctrl+C，退出循环
        except Exception as e:
            print("An error occurred:")
            traceback.print_exc()  # 打印完整的错误堆栈信息

