"""
Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
This file is part of Web-JunQi.
Licensed under the GPLv3 License.
"""

import subprocess
import traceback
import os

test_path = os.path.dirname(os.path.abspath(__file__))

str_true = "true\n"
str_false = "false\n"
r_tailing_state = " r 15 139"
b_tailing_state = " b 16 140"

# TODO: isLegalPlayer

datas = [
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + r_tailing_state, "b2c2", str_true], # 0
    ["000000000000000000000000000000000000000000000000000000d00000" + r_tailing_state, "k5b4", str_true], # 1
    ["000000000000000000000000000000000000000000000000000000d00000" + r_tailing_state, "k5a5", str_false], # 2
    ["000000000000000000000000000000000000000000000000000000d00000" + r_tailing_state, "k5j4", str_true], # 3
    ["000000000000000000000000000000000000000000000000000000d00000" + r_tailing_state, "k5l5", str_true], # 4
    ["000000000000000000000000000000000000000000000000000000d00000" + r_tailing_state, "k5l4", str_false], # 5
    ["000000000000000000000000000000000000000000000000l00000d00000" + r_tailing_state, "k5j4", str_false], # 6
    ["0acc0Ljc0e000000000000000000d000000B000000000GB000JK00DCACC0" + b_tailing_state, "k5f2", str_true], # 7
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + r_tailing_state, "k5f2", str_false],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + r_tailing_state, "h1a1", str_false],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + r_tailing_state, "f4g4", str_true],
    ["0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "f4g4", str_false],
    ["0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "b3b4", str_false],
    ["0acf0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "a4b4", str_false],
    ["0acf0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "b5b3", str_false],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + b_tailing_state, "g3b3", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + b_tailing_state, "b1b2", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + b_tailing_state, "b1a1", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + b_tailing_state, "b1g1", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "b1h1", str_false],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + r_tailing_state, "b1i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "b1h1", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "b1i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "j2h4", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "j2i1", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "j2i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "j2i3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "j2j3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "j2k3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "j2k2", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "k5g3", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "k5f3", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "k2j3", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + r_tailing_state, "k2k2", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + b_tailing_state, "k2k4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3h1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3h2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3h3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3h4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3i4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3j1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3j2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3j3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + r_tailing_state, "i3j4", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "i3h2", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "h1h2", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + b_tailing_state, "h2h1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + b_tailing_state, "h2i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "h2i3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "h2g3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + b_tailing_state, "h2g2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + b_tailing_state, "h2g1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4f1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4f2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4f5", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4e4", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4e3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4e5", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "f4b4", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + r_tailing_state, "h4h5", str_false],
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + r_tailing_state, "b2c2", str_true],
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + r_tailing_state, "c5d5", str_false],
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + r_tailing_state, "c5b5", str_false],
]

def test_isLegalAction():
    idx = 0
    answers = []
    results = []
    for data in datas:
        state = data[0]
        move = data[1]
        answer = data[2]
        result = subprocess.run(
            ['node', 'test_isLegalAction.js', state, move ],
            cwd=test_path,
            capture_output=True,
            text=True)
        result = result.stdout
        if result == answer:
            print(f"Case {idx} SUCCEED")
        else:
            print(f"Case {idx} FAILED - Result answer: {result[:-1]}, Expected anser: {answer[:-1]}")
            print(f"    - Input data:\n    - {data}")
        answers.append(answer)
        results.append(result)
        idx += 1
    assert results == answers

# test_isLegalAction()
