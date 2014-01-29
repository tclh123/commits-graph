#!/bin/bash

here="$(cd "${0%/*}"; pwd)"
root="${here%/*}"
FOLDER="demo"

cd "$root/$FOLDER"
exec gunicorn -b 0.0.0.0:8887 app:app
