#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
import math
from collections import Counter
from nltk.stem import SnowballStemmer


FILES_SIMILARITIES = dict()
FILES_PATH = list()


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


def getDis(text1, text2):
    if(text2 in FILES_SIMILARITIES[text1]):
        return FILES_SIMILARITIES[text1][text2]
    else:
        return FILES_SIMILARITIES[text2][text1]


def collectAndCleanText():
    # Conseguir el path donde se encuentran los papers a analizar
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dir_papers = dir_path + '/articles'

    # Leyendo el archivo con stopwords
    # Necesario para limpiar los otros archivos
    stopwords = open('stopwords', 'r', encoding='latin-1').read().split()

    cleaner = str.maketrans('', '', string.punctuation)
    counted_files = []

    # Conseguir las direcciones de todos los artículos en la carpeta papers
    for root, dirs, filenames in os.walk(dir_papers):
        global FILES_PATH
        FILES_PATH += filenames
        file_paths = list(map(lambda x: dir_papers + '/' + x, filenames))
        for i, f in enumerate(file_paths):
            # Abrir archivo y conseguir contenido
            file = open(f, encoding='utf-8').read()
            file_text = file.translate(cleaner).lower().strip().split()
            cleaned_file = list(
                filter(lambda word: word not in stopwords, file_text))

            stemmed_file = list(
                map(lambda w: SnowballStemmer('english').stem(w),
                    cleaned_file))

            counted_files.append(dict({
                'file': filenames[i],
                'vector': Counter(stemmed_file)
            }))

    for i in range(len(counted_files)):
        distances = {}
        for j in range(i + 1, len(counted_files)):
            similarity = get_cosine(
                counted_files[i]['vector'], counted_files[j]['vector'])
            distances.update({counted_files[j]['file']: similarity})

        global FILES_SIMILARITIES
        FILES_SIMILARITIES.update({counted_files[i]['file']: distances})


if __name__ == "__main__":
    collectAndCleanText()
    print(len(FILES_SIMILARITIES))
    print(FILES_SIMILARITIES)
    print(FILES_PATH)
