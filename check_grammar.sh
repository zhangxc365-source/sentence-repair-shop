#!/bin/bash
grep -rh "grammar:" src/data | sed 's/.*grammar: "\(.*\)".*/\1/' | sort | uniq -c
