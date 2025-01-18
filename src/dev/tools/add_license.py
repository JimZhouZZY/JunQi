"""
Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
This file is part of Web-JunQi.
Licensed under the GPLv3 License.
"""

import os

# 许可证注释内容
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

# 支持的文件扩展名
file_extensions = license_comments.keys()

def add_license_to_file(file_path, license_comment):
    with open(file_path, 'r+', encoding='utf-8') as file:
        content = file.read()
        # 检查是否已经包含许可证
        if license_comment.strip() in content:
            print(f"License already exists in {file_path}. Skipping.")
            return
        # 插入许可证到文件开头
        file.seek(0)
        file.write(license_comment + content)
        print(f"Added license to {file_path}.")

def process_directory(directory):
    for root, _, files in os.walk(os.path.expanduser(directory)):
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in file_extensions:
                add_license_to_file(os.path.join(root, file), license_comments[ext])

# 项目目录
project_directory = "~/Code/JunQi/"
process_directory(project_directory)