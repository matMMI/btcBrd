#!/bin/bash
git add .
read -p "Message du commit: " message
git commit -m "$message"
git push