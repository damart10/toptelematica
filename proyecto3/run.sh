#! /usr/bin/env bash

export PATH="$HOME/anaconda3/bin:$PATH" 
source activate myenv

case $1 in 
-par)
    mpiexec -np 4 python3 main.py
    ;;
-seq)
    python3 serial.py
    ;;
*)
    echo not execution specifie
    ;;
esac 
