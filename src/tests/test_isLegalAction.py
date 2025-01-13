import subprocess
import traceback

str_true = "true\n"
str_false = "false\n"
tailing_state = " r 30 149"

datas = [
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, "b2c2", str_true],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5b4", str_true],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5a5", str_false],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5j4", str_true],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5l5", str_true],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5l4", str_false],
    ["000000000000000000000000000000000000000000000000l00000d00000" + tailing_state, "k5j4", str_false],
    ["0acc0Ljc0e000000000000000000d000000B000000000GB000JK00DCACC0" + tailing_state, "k5f2", str_true],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + tailing_state, "k5f2", str_false],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + tailing_state, "h1a1", str_false],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + tailing_state, "f4g4", str_true],
    ["0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "f4g4", str_false],
]

def test_isLegalAction():
    idx = 0
    for data in datas:
        state = data[0]
        move = data[1]
        answer = data[2]
        result = subprocess.run(['node', 'test_isLegalAction.js', state, move ], capture_output=True, text=True)
        if result.stdout == answer:
            print(f"Case {idx} SUCCEED")
        else:
            print(f"Case {idx} FAILED - Result answer: {result.stdout[:-1]}, Expected anser: {answer[:-1]}")
            print(f"    - Input data:\n    - {data}")
        assert (result.stdout == answer)
        idx += 1


