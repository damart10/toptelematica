# Clustering text python 
A clustering text implementation using cosine distance for text and k-means for clustering them 

## How to run
Using conda, create an environment and install all the dependencies manually:
```
$ conda create -n env_name python=3.6 anaconda
$ source activate env_name
```
And then: 
```
$ pip install mpi4py
```
After that you can run

```
$ sh run.hs -[par|seq] [number_of_cores]
```
Where: 
 * -par will run the parallel version and -seq the serial
 * number_of_cores is with how many cores you want to run the pararell version of the program, clearly with the searil version you're only use one processor 

 Finally you need to create a folder call articles in the root of the project and place there all documents you want to eval 

