#
# Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
# This file is part of Web-JunQi.
# Licensed under the GPLv3 License.
#

#!/bin/bash

bash build_module.sh
cp -r module/* ../frontend/src/services/logic/
