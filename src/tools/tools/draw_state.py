"""
Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
This file is part of Web-JunQi.
Licensed under the GPLv3 License.
"""

from colorama import Fore, Back, Style, init
import copy

init(autoreset=True)

PIECE_NAMES = {
    'l': "司", 'k': "军", 'j': "师", 'i': "旅", 'h': "团",
    'g': "营", 'f': "连", 'e': "排", 'd': "工", 'c': "雷",
    'b': "炸", 'a': "旗", '0': "空", '#': "  ",
}

def modify_state(coor, piece, print_out=True, use_idx=False, idx=0):
    global STATE
    if not use_idx:
        idx = board_coordinate_to_index([coor], print_out=False)[0]
    STATE = STATE[:idx] + piece + STATE[idx+1:]
    if print_out:
        print("State")
        draw_state(STATE+" 0 0 0")


def board_coordinate_to_index(coordinates, total_columns=5, print_out=True):
    indexs = []
    for coordinate in coordinates:
        if len(coordinate) != 2:
            continue
        column = coordinate[0].lower()  # 行的字母部分
        row = int(coordinate[1:])  # 列的数字部分
        row_index = ord(column) - ord('a')
        column_index = row - 1
        index = row_index * total_columns + column_index
        if print_out:
            print(index)
        indexs.append(index)
    return indexs

OPPO_COLOR = None
def det_color(board):
    global OPPO_COLOR
    OPPO_COLOR = Back.RED
    for i in range(60):
        if board[i].islower() and board[i] != 'a':
            OPPO_COLOR = Back.BLUE

def draw_state(board_str):
    global STATE
    try:
        board, current_player, half_moves, total_moves = board_str.split()
    except:
        board = board_str.split()[0]
        current_player, half_moves, total_moves = 0, 0, 0
    det_color(board)
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
            elif piece == "#":
                row_str += OPPO_COLOR + Fore.WHITE + f"|{PIECE_NAMES[piece.lower()]}|" + Style.RESET_ALL
            else:
                row_str += Back.BLACK + Fore.WHITE + f"|{PIECE_NAMES[piece]}|" + Style.RESET_ALL
        print(row_str)
        print("  +" + "---+" * 5)

    print(STATE)
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

def offset(user_input):
    global STATE
    STATE = '0' * 60
    if len(str(user_input)) == 30:
        color = 'r'
        for i in range(min(60, len(str(user_input)))):
            if str(user_input)[i].isupper():
                color = 'b'
                break
        for i in range(min(60, len(str(user_input)))):
            if color == 'b':
                modify_state(0, str(user_input)[i], False, True, (i+30))
            else:
                modify_state(0, str(user_input)[i], False, True, i)
        draw_state(STATE)
    else:
        draw_state(str(user_input))

import traceback
import readline
import random

if __name__ == "__main__":
    global STATE
    STATE = '0' * 60
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
            elif user_input.lower().split(" ")[0] in ["modify", "mod", "md", "m"]:
                coor = user_input.lower().split(" ")[1]
                piece = user_input.split(" ")[2]
                modify_state(coor, piece)
            elif user_input.lower().split(" ")[0] in ["swap","sw", "s"]:
                coor = [user_input.lower().split(" ")[1], user_input.lower().split(" ")[2]]
                idx = board_coordinate_to_index(coor, print_out=False)
                tmp_piece = STATE[idx[0]]
                modify_state(coor[0], STATE[idx[1]], False)
                modify_state(coor[1], tmp_piece)
            elif user_input.lower().split(" ")[0] in ["random_layout","rndl", "rl"]:
                init_layout = 'caccbbdddee0e0fff0ggh0h0iijjkl'
                tmp = list(init_layout.replace('0', ''))
                if len(user_input.lower().split(" ")) >= 2 and user_input.lower().split(" ")[-1] in ['exclusive', 'e']:
                    my_list = tmp
                    excluded_elements = {'0', 'c', 'a'}
                    to_shuffle = [(i, elem) for i, elem in enumerate(my_list) if elem not in excluded_elements]
                    indices, elements = zip(*to_shuffle) if to_shuffle else ([], [])
                    shuffled_elements = list(elements)
                    random.shuffle(shuffled_elements)
                    shuffled_list = my_list[:]
                    for idx, elem in zip(indices, shuffled_elements):
                        shuffled_list[idx] = elem
                    tmp = shuffled_list
                else:
                    random.shuffle(tmp)
                tmp.insert(11, 0)
                tmp.insert(13, 0)
                tmp.insert(17, 0)
                tmp.insert(21, 0)
                tmp.insert(23, 0)
                tmp_layout = ''.join(map(str, tmp))
                if len(user_input.lower().split(" ")) >= 2 and user_input.lower().split(" ")[1] == 'b':
                    tmp_layout = tmp_layout[::-1]
                    tmp_layout = tmp_layout.upper()
                print(f'Generated random layout: \n{tmp_layout}')
                offset(tmp_layout)
            else:
                offset(user_input)
            print("=============================================================================")
        except KeyboardInterrupt:
            print("\nProgram interrupted by user. Exiting...")
            break  # 用户按下 Ctrl+C，退出循环
        except Exception as e:
            print("An error occurred:")
            traceback.print_exc()  # 打印完整的错误堆栈信息

