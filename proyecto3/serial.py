#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
import math
from collections import Counter
from nltk.stem import SnowballStemmer


files_similarities = {}

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
    if(text2 in files_similarities[text1]):
        return files_similarities[text1][text2]
    else:
        return files_similarities[text2][text1]


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

        files_similarities.update({counted_files[i]['file']: distances})

    print(len(files_similarities))
    print(files_similarities)