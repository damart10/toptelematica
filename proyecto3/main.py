#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from collections import Counter

from mpi4py import MPI
from nltk.stem import SnowballStemmer


COMM = MPI.COMM_WORLD
RANK = COMM.Get_rank()
SIZE = COMM.Get_size()


def split_seq(seq, size):
    """
    Método para dividir la cantidad de archivos en la cantidad de procesadores
    que poseemos
    """
    newseq = []
    splitsize = 1.0 / size * len(seq)
    for i in range(size):
        newseq.append(seq[int(round(i * splitsize)):int(round((i + 1) * splitsize))])
    return newseq


if __name__ == "__main__":
    if RANK == 0:
        # Conseguir el path donde se encuentran los papers a analizar
        dir_path = os.path.dirname(os.path.realpath(__file__))
        dir_papers = dir_path + '/articles'

        # Leyendo el archivo con stopwords
        # Necesario para limpiar los otros archivos
        stopwords = open('stopwords', 'r', encoding='latin-1').read().split()

        # Conseguir las direcciones de todos los artículos en la carpeta papers
        for root, dirs, filenames in os.walk(dir_papers):
            filenames = list(map(lambda x: dir_papers + '/' + x, filenames))

        # Repartir estos archivos en cantidades "iguales" para cada procesador
        split_files = split_seq(filenames, SIZE)

    else:
        # Si no estamos en "master", inicializar en 0
        # Necesario para hacer bcast y scatter
        split_files = None
        stopwords = None

    # Enviar a cada nodo sus archivos a procesar
    filenames = COMM.scatter(split_files, root=0)
    # Enviar a todos los nodos los stopwords a utilizar
    stopwords = COMM.bcast(stopwords, root=0)

    # Este código será ejecutado en cada uno de los procesadores
    stemmed_files = []

    # Iterar sobre cada uno de los archivos
    for f in filenames:
        # Abrir archivo y conseguir contenido
        file = open(f, encoding='utf-8').read().split()

        stemmed_files.append(
            list(map(lambda w: SnowballStemmer('english').stem(w),
                     list(filter(lambda word: word not in stopwords, file)))))

    print('Rank:', RANK, len(stemmed_files))
    # counted_files = list(map(lambda f: Counter(f), stemmed_files))
    # print(counted_files)
