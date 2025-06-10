#!/bin/bash
cd /home/kavia/workspace/code-generation/polylingo-translator-28375-92d7c0ab/pollylingo_translator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

