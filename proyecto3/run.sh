#! /usr/bin/env bash

case $1 in 
-par)
    mpiexec -np $2 python main.py
    ;;
-seq)
    python serial.py
    ;;
*)
    echo not execution specifie
    ;;
esac 
