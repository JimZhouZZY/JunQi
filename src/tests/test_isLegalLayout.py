import subprocess
import traceback
import os

test_path = os.path.dirname(os.path.abspath(__file__))

str_true = "true\n"
str_false = "false\n"
tailing_state = "000000000000000000000000000000000000000000000000000000000000 r 0 0"

# TODO: isLegalPlayer

datas = [
    [tailing_state, "", str_false],
    [tailing_state, "", str_false],
]

def test_isLegalLayout():
    idx = 0
    answers = []
    results = []
    for data in datas:
        state = data[0]
        layout = data[1]
        answer = data[2]
        result = subprocess.run(
            ['node', 'test_isLegalLayout.js', state, layout ],
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

# test_isLegalLayout()
