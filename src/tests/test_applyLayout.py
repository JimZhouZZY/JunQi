import subprocess
import traceback
import os

test_path = os.path.dirname(os.path.abspath(__file__))

str_true = "true\n"
str_false = "false\n"
tailing_state = " r 0 0\n"
res_tailing_state = " r 0 0\n"
# TODO: isLegalPlayer

datas = [
    ["000000000000000000000000000000000000000000000000000000000000" + tailing_state, "baccbcdddee0e0fff0ggh0h0iijjkl", "baccbcdddee0e0fff0ggh0h0iijjkl000000000000000000000000000000" + res_tailing_state],
    ["baccbcdddee0e0fff0ggh0h0iijjkl000000000000000000000000000000" + tailing_state, "JDFLGK0G0HDI0FHF0J0BEEEBDIACCC", "baccbcdddee0e0fff0ggh0h0iijjklJDFLGK0G0HDI0FHF0J0BEEEBDIACCC" + res_tailing_state],
]

def test_applyLayout():
    idx = 0
    answers = []
    results = []
    for data in datas:
        state = data[0].replace("\n", "")
        layout = data[1]
        # TODO: More strict check on tailing elements
        answer = data[2].split(" ")[0]
        result = subprocess.run(
            ['node', 'test_applyLayout.js', state, layout ],
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

# test_applyLayout()
