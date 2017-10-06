#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
import math
from collections import Counter
from nltk.stem import SnowballStemmer


def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator


def text_to_vector(text):
    words = WORD.findall(text)
    return Counter(words)


if __name__ == "__main__":
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
        filenames = list(map(lambda x: dir_papers + '/' + x, filenames))
        for f in filenames:
            # Abrir archivo y conseguir contenido
            file = open(f, encoding='utf-8').read()
            file_text = file.translate(cleaner).lower().strip().split()
            cleaned_file = list(
                filter(lambda word: word not in stopwords, file_text))

            stemmed_file = list(
                map(lambda w: SnowballStemmer('english').stem(w),
                    cleaned_file))

            counted_files.append(dict({
                'file': f,
                'vector': Counter(stemmed_file)
            }))

    files_similarities = []
    for i in range(len(counted_files)):
        for j in range(i + 1, len(counted_files)):
            similarity = get_cosine(
                counted_files[i]['vector'], counted_files[j]['vector'])
            files_similarities.append(dict({
                'file1': counted_files[i]['file'],
                'file2': counted_files[j]['file'],
                'similarity': similarity
            }))

    print(len(files_similarities))
    print(files_similarities)
