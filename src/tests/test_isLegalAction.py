import subprocess
def test_isLegalAction():
    result = subprocess.run(['node', 'script.js'], capture_output=True, text=True)
    print(result.stdout)

    assert result.stdout == 'true'


