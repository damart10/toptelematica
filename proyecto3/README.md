# Clustering text python 
A clustering text implementation using cosine distance for text and k-means for clustering them 

## How to run
Using conda, create an environment and install all the dependencies manually:
```
- mpi4py 
- nltk
- scipy
- numpy
```
After that you can run

```
$ sh run.hs [env_name] -[par|seq] [number_of_cores]
```
Where: 
 * env_name is the name of the environment that you created
 * -par will run the parallel version and -seq the serial
 * number_of_cores is with how many cores you want to run the pararell version of the program, clearly with the searil version you're only use one processor 

 Finally you need to create a folder call articles in the root of the project and place there all documents you want to eval 

