#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
from collections import Counter

from nltk.stem import SnowballStemmer


if __name__ == "__main__":
    # Conseguir el path donde se encuentran los papers a analizar
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dir_papers = dir_path + '/articles'

    # Leyendo el archivo con stopwords
    # Necesario para limpiar los otros archivos
    stopwords = open('stopwords', 'r', encoding='latin-1').read().split()

    cleaner = str.maketrans('', '', string.punctuation)
    stemmed_files = []

    # Conseguir las direcciones de todos los artículos en la carpeta papers
    for root, dirs, filenames in os.walk(dir_papers):
        filenames = list(map(lambda x: dir_papers + '/' + x, filenames))
        for f in filenames:
            # Abrir archivo y conseguir contenido
            file = open(f, encoding='utf-8').read()
            file_text = file.translate(cleaner).lower().strip().split()
            cleaned_file = list(
                filter(lambda word: word not in stopwords, file_text))
            stemmed_files.append(
                list(map(lambda w: SnowballStemmer('english').stem(w),
                         cleaned_file)))

            # counted_files = list(map(lambda f: Counter(f), stemmed_files))

    print(stemmed_files)
