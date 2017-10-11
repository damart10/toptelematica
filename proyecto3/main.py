#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import string
import math
from collections import Counter

from mpi4py import MPI
from nltk.stem import SnowballStemmer


COMM = MPI.COMM_WORLD
RANK = COMM.Get_rank()
SIZE = COMM.Get_size()

FILES_SIMILARITIES = dict()
FILES_PATH = dict()


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


def split_seq(seq, size):
    """
    Método para dividir la cantidad de archivos en la cantidad de procesadores
    que poseemos """
    newseq = []
    splitsize = 1.0 / size * len(seq)
    for i in range(size):
        newseq.append(seq[int(round(i * splitsize))
                      :int(round((i + 1) * splitsize))])
    return newseq


def collect_and_clean_text():
    if RANK == 0:
        # Conseguir el path donde se encuentran los papers a analizar
        dir_path = os.path.dirname(os.path.realpath(__file__))
        dir_papers = dir_path + '/articles'

        # Leyendo el archivo con stopwords
        # Necesario para limpiar los otros archivos
        stopwords = open('stopwords', 'r', encoding='latin-1').read().split()

        # Conseguir las direcciones de todos los artículos en la carpeta papers
        for root, dirs, filenames in os.walk(dir_papers):
            global FILES_PATH
            FILES_PATH += filenames

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

    files = COMM.gather(counted_files, root=0)

    if RANK == 0:
        counted_files = [item for sublist in files for item in sublist]
        splitsize = 1.0 / SIZE * len(counted_files)
        for i in range(SIZE):
            indexStart = int(round(i * splitsize))
            indexTop = int(round((i + 1) * splitsize))
            COMM.send((indexStart, indexTop), dest=i)

    index = COMM.recv(source=0)
    files = COMM.bcast(counted_files, root=0)

    files_similarities = dict()
    for i in range(index[0], index[1]):
        distances = {}
        for j in range(i + 1, len(files)):
            similarity = get_cosine(files[i]['vector'], files[j]['vector'])
            distances.update({files[j]['file']: similarity})
        files_similarities.update({files[i]['file']: distances})

    list_all_files_similarites = COMM.gather(files_similarities, root=0)
    if RANK == 0:
        all_files_similarites = {}
        for d in list_all_files_similarites:
            all_files_similarites.update(d)
        return all_files_similarites


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
    if RANK == 0:
        filepaths = list()
        dir_path = os.path.dirname(os.path.realpath(__file__))
        dir_papers = dir_path + '/articles'
        for root, dirs, filenames in os.walk(dir_papers):
            filepaths += filenames

        initial_centroids = random.sample(filepaths, k)
        clusters = get_clusters(initial_centroids)
        cost = get_cost_clusters()
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
    all_files_similarites = collect_and_clean_text()
    global FILES_SIMILARITIES
    FILES_SIMILARITIES.update(all_files_similarites)
    all_files_similarites = COMM.bcast(all_files_similarites, root=0)
