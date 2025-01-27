"""
Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
This file is part of Web-JunQi.
Licensed under the GPLv3 License.
"""

"""
 Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 This file is part of Web-JunQi.
 Licensed under the GPLv3 License.
"""

import os

license_comments = {
    '.py': '"""\nCopyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\nThis file is part of Web-JunQi.\nLicensed under the GPLv3 License.\n"""\n\n',
    '.js': '/*\n * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n * This file is part of Web-JunQi.\n * Licensed under the GPLv3 License.\n */\n\n',
    '.mjs': '/*\n * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n * This file is part of Web-JunQi.\n * Licensed under the GPLv3 License.\n */\n\n',
    '.sh': '#\n# Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n# This file is part of Web-JunQi.\n# Licensed under the GPLv3 License.\n#\n\n',
    '.css': '/*\n * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n * This file is part of Web-JunQi.\n * Licensed under the GPLv3 License.\n */\n\n',
    '.tsx': '/*\n * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n * This file is part of Web-JunQi.\n * Licensed under the GPLv3 License.\n */\n\n',
    '.jsx': '/*\n * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\n * This file is part of Web-JunQi.\n * Licensed under the GPLv3 License.\n */\n\n',
    '.html': '<!--\nCopyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)\nThis file is part of Web-JunQi.\nLicensed under the GPLv3 License.\n-->\n\n',
}

file_extensions = license_comments.keys()

# Add a list of directories to ignore
ignores = ['node_modules']

def add_license_to_file(file_path, license_comment):
    with open(file_path, 'r+', encoding='utf-8') as file:
        content = file.read()
        # Check if the file already contains the license header
        if license_comment.strip() in content:
            print(f"License already exists in {file_path}. Skipping.")
            return
        # Insert license header
        file.seek(0)
        file.write(license_comment + content)
        print(f"Added license to {file_path}.")

def process_directory(directory):
    for root, dirs, files in os.walk(os.path.expanduser(directory)):
        # Skip directories in the ignores list (e.g., 'node_modules')
        if any(ignore in root for ignore in ignores):
            continue

        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in file_extensions:
                add_license_to_file(os.path.join(root, file), license_comments[ext])

project_directory = "~/Code/JunQi/"
process_directory(project_directory)
