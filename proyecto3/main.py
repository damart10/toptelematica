#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
from collections import Counter

from mpi4py import MPI
from nltk.stem import SnowballStemmer


COMM = MPI.COMM_WORLD
RANK = COMM.Get_rank()
SIZE = COMM.Get_size()


def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return 1 - (float(numerator) / denominator)


def split_seq(seq, size):
    """
    Método para dividir la cantidad de archivos en la cantidad de procesadores
    que poseemos
    """
    newseq = []
    splitsize = 1.0 / size * len(seq)
    for i in range(size):
        newseq.append(seq[int(round(i * splitsize))
                      :int(round((i + 1) * splitsize))])
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
            filenames = list(map(lambda x: dict({
                'filepath': dir_papers + '/' + x,
                'filename': x}), filenames))

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
    counted_files = []
    cleaner = str.maketrans('', '', string.punctuation)
    for i, f in enumerate(filenames):
        # Abrir archivo y conseguir contenido
        file = open(f['filepath'], encoding='utf-8').read()
        file_text = file.translate(cleaner).lower().strip().split()
        cleaned_file = list(
            filter(lambda word: word not in stopwords, file_text))

        stemmed_file = list(
            map(lambda w: SnowballStemmer('english').stem(w),
                cleaned_file))

        counted_files.append(dict({
            'file': filenames[i]['filename'],
            'vector': Counter(stemmed_file)
        }))

    print('Llegué aquí al pre gather')
    print('Llegué aquí al gather')

    if RANK == 0:
        print('Entré a división')
        files = COMM.gather(counted_files, root=0)
        counted_files = [item for sublist in files for item in sublist]
        div_size = int(round(len(counted_files) / SIZE))
        for i in range(SIZE):
            COMM.send((i * div_size, (i + 1) * div_size), dest=i)
    else:
        print('Entré a recibir index')
        index = COMM.recv(source=0)
        print(index)

    files = COMM.bcast(counted_files, root=0)
    # counted_files = list(map(lambda f: Counter(f), stemmed_files))
    # print(counted_files)
