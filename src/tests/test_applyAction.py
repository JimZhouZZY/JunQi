import subprocess
import traceback
import os

test_path = os.path.dirname(os.path.abspath(__file__))

str_true = "true\n"
str_false = "false\n"
tailing_state = " r 30 149\n"
res_tailing_state = " b 31 150\n"
# TODO: isLegalPlayer

datas = [
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, "b2c2", "0acc0L0c0e0j00000000000000000000000B000000000GB000JK000CACC0" + res_tailing_state],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5b4", "00000000d000000000000000000000000000000000000000000000000000" + res_tailing_state],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5j4", "000000000000000000000000000000000000000000000000d00000000000" + res_tailing_state],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, "k5l5", "00000000000000000000000000000000000000000000000000000000000d" + res_tailing_state],
    ["0acc0Ljc0e000000000000000000d000000B000000000GB000JK00DCACC0" + tailing_state, "k5f2", "0acc0Ljc0e0000000000000000D0d000000B000000000GB000JK000CACC0" + res_tailing_state],
    ["0acc0Ljc0e000000000000000000d000D00B000000000GB000JK00DCACC0" + tailing_state, "f4g4", "0acc0Ljc0e0000000000000000000000Dd0B000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "g3b3", "0acf0LjD00000000000000000000e000000B000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1b2", "0acf00Lc00000000000000000000e000D00B000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1a1", "Lacf00jc00000000000000000000e000D00B000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, "b1g1", "0acf00jc00000000000000000000e0L0D00B000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "b1h1", "0acf00jc00000000000000000000e000D00L000000000GB000JK00DCACC0" + res_tailing_state],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i1", "0acf0Ljc00000000000000000000e000D00i0000B0000G0000JK00DCACC0" + res_tailing_state],
    # ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i2", str_true],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2i3", "0acf0Ljc00000000000000000000e000D00i000000B00G0000JK00DCACC0" + res_tailing_state],
    # ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "j2j3", str_true],
    ["0acf0Ljc00l00000000000000000e000D00i000000000G0000JKB0DCACC0" + tailing_state, "b1c1", "0acf00jc00000000000000000000e000D00i000000000G0000JKB0DCACC0" + res_tailing_state],
    # ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, "k2k4", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h3", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3h4", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3i2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3i4", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j3", str_true],
    # ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, "i3j4", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2h1", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2i2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2g2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "h2g1", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f1", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f2", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4f5", str_true],
    # ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, "f4e4", str_true],
]

def test_applyAction():
    idx = 0
    answers = []
    results = []
    for data in datas:
        state = data[0]
        move = data[1]
        # TODO: More strict check on tailing elements
        answer = data[2].split(" ")[0]
        result = subprocess.run(
            ['node', '../tests/test_applyAction.js', state, move ],
            cwd=test_path,
            capture_output=True,
            text=True)
        result = result.stdout.split(" ")[0]
        if result == answer:
            print(f"Case {idx} SUCCEED")
        else:
            print(f"Case {idx} FAILED - Result answer: {result}, Expected anser: {answer}")
            print(f"    - Input data:\n    - {data}")
        answers.append(answer)
        results.append(result)
        idx += 1
    assert results == answers

# test_applyAction()
