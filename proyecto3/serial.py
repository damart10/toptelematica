#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from collections import Counter

from nltk.stem import SnowballStemmer


if __name__ == "__main__":
    # Conseguir el path donde se encuentran los papers a analizar
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dir_papers = dir_path + '/articles'

    # Leyendo el archivo con stopwords
    # Necesario para limpiar los otros archivos
    stopwords = open('stopwords', 'r', encoding='latin-1').read().split()

    # Conseguir las direcciones de todos los artículos en la carpeta papers
    for root, dirs, filenames in os.walk(dir_papers):
        filenames = list(map(lambda x: dir_papers + '/' + x, filenames))
        for f in filenames:
            # Abrir archivo y conseguir contenido
            file = open(f, encoding='utf-8').read().split()
            stemmed_files.append(
                list(map(lambda w: SnowballStemmer('english').stem(w),
                         list(filter(lambda word: word not in stopwords, file)))))

            # counted_files = list(map(lambda f: Counter(f), stemmed_files))
