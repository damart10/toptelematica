#! /usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
    export PATH="$HOME/anaconda3/bin:$PATH" 
    source activate $1
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    source activate $1
fi

case $2 in 
-par)
    mpiexec -np $3 python3 main.py
    ;;
-seq)
    python3 serial.py
    ;;
*)
    echo not execution specifie
    ;;
esac 
