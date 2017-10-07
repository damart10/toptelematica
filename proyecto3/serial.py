#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
import math
from collections import Counter
from nltk.stem import SnowballStemmer
import random

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


def get_dis(text1, text2):
    if text1 in FILES_SIMILARITIES[text2]:
        return FILES_SIMILARITIES[text2][text1]
    else:
        return FILES_SIMILARITIES[text1][text2]


def collect_and_clean_text():
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


def get_clusters(centroids):
    clusters = {}
    for i in range(len(FILES_PATH)):
        closestDis = {'centroid': '', 'file': '', 'dis': 1.0}
        for j in range(len(centroids)):
            if(FILES_PATH[i] != centroids[j]):
                dis = get_dis(FILES_PATH[i], centroids[j])
                if(dis < closestDis['dis']):
                    closestDis['file'] = FILES_PATH[i]
                    closestDis['dis'] = dis
                    closestDis['centroid'] = centroids[j]
            else:
                closestDis['file'] = FILES_PATH[i]
                closestDis['dis'] = 0
                closestDis['centroid'] = centroids[j]

        if clusters.get(closestDis['centroid']) is not None:
            cluster = clusters[closestDis['centroid']]
            cluster.append({closestDis['file']: closestDis['dis']})
            clusters.update({closestDis['centroid']: cluster})
        else:
            cluster = [{closestDis['file']: closestDis['dis']}]
            clusters.update({closestDis['centroid']: cluster})

    return clusters


def get_cost_clusters(clusters):
    sum = 0
    for cluster in clusters:
        for i in range(len(clusters[cluster])):
            for d in clusters[cluster][i]:
                sum += float(clusters[cluster][i][d])
    return sum


def calculate_new_centroid(cluster_files):
    min = 10000
    centroid = ''
    for i in range(len(cluster_files)):
        sum = 0
        for j in range(len(cluster_files)):
            file1 = list(cluster_files[i].keys())[0]
            file2 = list(cluster_files[j].keys())[0]
            if file1 != file2:
                dis = get_dis(file1, file2)
            else:
                dis = 0
            sum += dis

        if sum < min:
            centroid = file1
            min = sum

    return centroid


def k_means(k, max_iter):
    initial_centroids = random.sample(FILES_PATH, k)
    clusters = get_clusters(initial_centroids)
    cost = get_cost_clusters(clusters)
    num_iter = 0
    new_cost = 0
    new_clusters = clusters
    while num_iter < max_iter:
        if cost > new_cost:
            clusters = new_clusters
            for i in clusters:
                new_centroids = []
                new_centroids.append(calculate_new_centroid(clusters[i]))
            new_clusters = get_clusters(new_centroids)
            new_cost = get_cost_clusters(new_clusters)
        else:
            return clusters

        num_iter += 1

    print('Si llegué aquí, fallé. :V')


if __name__ == "__main__":
    collect_and_clean_text()
    print(k_means(2, 20))
    # get_cost(clusters)
