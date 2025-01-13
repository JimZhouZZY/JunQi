import subprocess
import traceback

str_true = "true\n"
str_false = "false\n"
tailing_state = " r 30 149"

# TODO: isLegalPlayer

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
    # ["0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "f4g4", str_false],
    ["0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b3b4", str_false],
    # ["0acf0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "a4b4", str_false],
    # ["0acf0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b5b3", str_false],
    # ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "g3b3", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1b2", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1a1", str_true],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1g1", str_true],
    # ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1h1", str_false],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "b1h1", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "b1i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2h4", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i1", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2j3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2k3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2k2", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k5g3", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k5b3", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k2j3", str_false],
    # ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k2k2", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k2k4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3i1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3i4", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j1", str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j3", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j4", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "i3h2", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h1h2", str_false],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2h1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2i3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2g3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2g2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2g1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f1", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f2", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f5", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4e4", str_true],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4e3", str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4e5", str_false],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4b4", str_false],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h4h5", str_false],
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


