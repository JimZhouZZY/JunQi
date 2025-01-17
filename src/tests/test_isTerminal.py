import subprocess
import traceback
import os

test_path = os.path.dirname(os.path.abspath(__file__))

str_true = "true\n"
str_false = "false\n"
tailing_state = " r 30 149"

# TODO: isLegalPlayer

datas = [
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, str_false],
    ["000000000000000000000000000000000000000000000000000000d00000" + tailing_state, str_false],
    ["0acc0Ljc0e000000000000000000d000000B000000000GB000JK00DCACC0" + tailing_state, str_false],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, str_false],
    ["0acf0Ljc00000000000000000000e000D00B000000000GB000JK00DCACC0" + tailing_state, str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000000GB000JK00DCACC0" + tailing_state, str_false],
    ["0acf0Ljc00000000000000000000e000D00i000000f0000000JK00DCACC0" + tailing_state, str_false],
    ["0acf0Ljc00000000000000000000e000D00iK00000f0000000JK00DCACC0" + tailing_state, str_false],
    ["0acc0Ljc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, str_false],
    ["0Lcc00jc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, str_true],
    ["0Lca00jc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, str_false],
    ["0LcJ00jc0e0000000000000000000000000B000000000GB000JK000CACC0" + tailing_state, str_true],
    ["0acc00jc0e0000000000000000000000000B000000000GB000JK000CAlC0" + tailing_state, str_false],
    ["0acc00jc0e0000000000000000000000000B000000000GB000JK000Cl0C0" + tailing_state, str_true],
    ["0acc00jc0e0000000000000000000000000B000000000GB000JK000ClkA0" + tailing_state, str_false],
    ["0acc00jc0e0000000000000000000000000B000000000GB000JK000Clkg0" + tailing_state, str_true],
    ["0acc00jc0e000000000000000000000000000000000000000000000CAkg0" + tailing_state, str_true],
    ["0acc00jc0e000000000000000000000000000000000000000000000CEkA0" + tailing_state, str_true],
]

def test_isLegalAction():
    idx = 0
    answers = []
    results = []
    for data in datas:
        state = data[0]
        answer = data[1]
        result = subprocess.run(
            ['node', 'test_isLegalAction.js', state ],
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
