#!/bin/bash

# Source files and destination root directory
SOURCE_FILES=("junqiLogic.js" "types/junqiBoard.js" "types/junqiGraph.js" "types/junqiNode.js")
DEST_ROOT_DIR="module"

# Clean destination directory
rm -rf "$DEST_ROOT_DIR"

# Create destination root directory if it doesn't exist
if [ ! -d "$DEST_ROOT_DIR" ]; then
  mkdir -p "$DEST_ROOT_DIR"
fi

# Process each source file
for SOURCE_FILE in "${SOURCE_FILES[@]}"; do
  # Generate the corresponding destination file path, preserving directory structure
  DEST_FILE="$DEST_ROOT_DIR/$(dirname "$SOURCE_FILE")/$(basename "$SOURCE_FILE" .js).mjs"
  
  # Create the destination subdirectory if it doesn't exist
  if [ ! -d "$(dirname "$DEST_FILE")" ]; then
    mkdir -p "$(dirname "$DEST_FILE")"
  fi

  # Check if the source file exists
  if [ ! -f "$SOURCE_FILE" ]; then
    echo "Source file $SOURCE_FILE does not exist."
    continue
  fi

  # Apply transformations and save to the destination file
  sed -e 's|module.exports = [^;]*;||' "$SOURCE_FILE" | \
  sed -e 's|class [^ ]*|export default &|' | \
  sed -e "s|const { node } = require('./types/junqiNode.js')|import { node } from './types/junqiNode.mjs'|" | \
  sed -e "s|const JunqiBoard = require('./types/junqiBoard')|import JunqiBoard from './types/junqiBoard.mjs'|" | \
  sed -e "s|const { node } = require('./junqiNode.js')|import { node } from './junqiNode.mjs'|" | \
  sed -e "s|const JunqiGraph = require('./junqiGraph.js')|import JunqiGraph from './junqiGraph.mjs'|" | \
  sed -e "s|const JunqiGraph = require('./types/junqiGraph')|import JunqiGraph from './types/junqiGraph.mjs'|" > "$DEST_FILE"

  # Indicate that the conversion is complete for this file
  echo "File $SOURCE_FILE converted and saved as $DEST_FILE"
done