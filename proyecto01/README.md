# Proyecto 1

## Planteamiento del proyecto.

## 1. Descripción

La plataforma “Dimi” es una “red social”, en la cual, los usuarios pueden subir fotografías, para así compartirlas con sus amigos y otros personas dentro de la aplicación. A su vez, le permite decidir a quién puede ver las imágenes que sube.}

## 2. Análisis
### 2.1 Requisitos Funcionales

* RF1: El sistema le permitirá al usuario registrarse.
* RF2: El sistema le permitirá al usuario ingresar a la plataforma.
* RF3: El sistema le permitirá al usuario modificar y eliminar su información dentro de la plataforma.
* RF4: El sistema permitirá al usuario publicar, modificar y eliminar sus fotografías de la plataforma.
* RF5: El sistema permitirá al usuario cambiar la privacidad de sus fotografías.
* RF6: El sistema permitirá al usuario compartir fotografías que se encuentren dentro de la plataforma.
* RF7: El sistema le permitirá al usuario buscar fotografías relacionadas a una palabra.

### 2.2 Tecnología de desarrollo y ejecución
| Sección | Tecnología |
| --- |:---:|
| LENGUAJE DE PROGRAMACIÓN | Javascript / NodeJS - Typescript|
| FRAMEWORK WEB - BACKEND | Express (NodeJS) | 
| FRAMEWORK WEB - FRONTEND | Angular (Typescript) | 
| WEB APP SERVER | Embebido (NodeJS) | 
| WEB SERVER | NGINX | 
| BASE DE DATOS | MongoDB | 

### 2.3 Ambientes de Desarrollo, Pruebas y Producción
#### 2.3.1 Desarrollo
| Sección | Tecnología |
| --- |:---:|
| SISTEMA OPERATIVO | Linux Ubuntu (17.04) |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) - Typescript(2.4) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| WEB SERVER | NGINX(1.12.1) | 
| BASE DE DATOS | MongoDB(3.2.11) | 
| EDITOR | Visual Studio Code(1.14.1) | 
| GIT | Git Bash(2.11.0) | 
| Pruebas | Postman(5.1.2) | 

#### 2.3.2 Pruebas en el DCA
| Sección | Tecnología |
| --- |:---:|
| SISTEMA OPERATIVO | Linux CentOS (7.1) |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) - Typescript(2.4) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| WEB SERVER | NGINX(1.12.1) | 
| BASE DE DATOS | MongoDB(2.6.11) | 
| GIT | Git Bash(2.11.0) | 

#### 2.3.3 Nube
| Sección | Tecnología |
| --- |:---:|
| PROVEEDOR | Heroku |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| BASE DE DATOS | MongoDB a través de mlab(6.12.17) |

# Instalación
Clonar el repositorio 
$ ``` git clone https://github.com/damart10/toptelematica```

Acceder a la carpeta llamada ```proyecto01``` y correr ```npm install```.
Acceder a la carpeta ```proyecto01/angular-src``` y correr ```npm install```.

# Ejecución
Si desea correr por aparte el front y el back, realizar lo siguiente:
* Estando dentro de la carpeta ```angular-src``` correr el comando ```ng serve```
* Estando dentro de la carpeta ```proyecto01``` correr el comando ```npm start```
* Acceder a ```http://localhost:42000/```

Si desea correr front y back desde NodeJS, realizar lo siguiente:
* Estando dentro de la carpeta ```angular-src``` correr el comando ```ng build```
* Estando dentro de la carpeta ```proyecto01``` poner a correr el servidor con el comando ```npm start``` 
* Acceder a ```http://localhost:3000/```

# 3. Diseño

# 3.1 Modelos
```javascript
User = {
  name: String,
  email: String,
  username: String,
  password: String,
  description: String
}

Image = {
  url: String,
  name: String,
  owner: Object,
  category: String,
  public: Boolean,
  sharedWith: Object[],
  description: String
} 
```
## 3.2 Servicios Web
Todas las direcciones que serán mencionadas a continuación van precedidas por ```/api```
### 3.2.1 Usuarios
```javascript
// Crear un usuario
Método: POST
URI: /users/
Datos Request: {name, email, username, password}
Datos Response: {ok: Boolean, message: String}

// Ingresar a la plataforma, el token regresado es necesario para otras funcionalidades
Método: POST
URI: /users/login
Datos Request: {username, password},
Datos Response: {ok: Boolean, token: String, user: Object}

// Buscar usuario por ID
Método: GET
URI: /users/:id
Datos Request: No aplica
Datos Response: {ok: Boolean, user: Object}

// Actualizar información del usuario
Método: PUT
URI: /users/:id
Datos Request: headers: {'Authorization': token}, body: {name, email, description}
Datos Response: {ok: Boolean, user: Object, message: String}}

// Eliminar un usuario
Método: DELETE
URI: /users/:id
Datos Request: headers: {'Authorization': token}
Datos Response: {ok: Boolean, message: String}
```
### 3.2.2 Imágenes
```javascript
// Crear una imagen
Método: POST
URI: /images/
Datos Request: {name, url, description, public}
Datos Response: {ok: Boolean, message: String}

// Traer todas las imágenes
Método: GET
URI: /images/
Datos Request: No aplica
Datos Response: {ok: Boolean, images: Object[]}

// Buscar imagen por ID
Método: GET
URI: /images/:id
Datos Request: No aplica
Datos Response: {ok: Boolean, image: Object}

// Buscar imágenes por palabra en el nombre
Método: GET
URI: /images/searchImage/:name
Datos Request: No aplica
Datos Response: {ok: Boolean, images: Object[]}

// Actualizar información de una imagen
Método: PUT
URI: /images/:id
Datos Request: headers: {'Authorization': token}, body: {name, description}
Datos Response: {ok: Boolean, image: Object, message: String}}

// Eliminar un imagen
Método: DELETE
URI: /images/:id
Datos Request: headers: {'Authorization': token}
Datos Response: {ok: Boolean, message: String}
```
# Proyecto 1

## Planteamiento del proyecto.

## 1. Descripción

La plataforma “Dimi” es una “red social”, en la cual, los usuarios pueden subir fotografías, para así compartirlas con sus amigos y otros personas dentro de la aplicación. A su vez, le permite decidir a quién puede ver las imágenes que sube.}

## 2. Análisis
### 2.1 Requisitos Funcionales

* RF1: El sistema le permitirá al usuario registrarse.
* RF2: El sistema le permitirá al usuario ingresar a la plataforma.
* RF3: El sistema le permitirá al usuario modificar y eliminar su información dentro de la plataforma.
* RF4: El sistema permitirá al usuario publicar, modificar y eliminar sus fotografías de la plataforma.
* RF5: El sistema permitirá al usuario cambiar la privacidad de sus fotografías.
* RF6: El sistema permitirá al usuario compartir fotografías que se encuentren dentro de la plataforma.
* RF7: El sistema le permitirá al usuario buscar fotografías relacionadas a una palabra.

### 2.2 Tecnología de desarrollo y ejecución
| Sección | Tecnología |
| --- |:---:|
| LENGUAJE DE PROGRAMACIÓN | Javascript / NodeJS - Typescript|
| FRAMEWORK WEB - BACKEND | Express (NodeJS) | 
| FRAMEWORK WEB - FRONTEND | Angular (Typescript) | 
| WEB APP SERVER | Embebido (NodeJS) | 
| WEB SERVER | NGINX | 
| BASE DE DATOS | MongoDB | 

### 2.3 Ambientes de Desarrollo, Pruebas y Producción
#### 2.3.1 Desarrollo
| Sección | Tecnología |
| --- |:---:|
| SISTEMA OPERATIVO | Linux Ubuntu (17.04) |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) - Typescript(2.4) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| WEB SERVER | NGINX(1.12.1) | 
| BASE DE DATOS | MongoDB(3.2.11) | 
| EDITOR | Visual Studio Code(1.14.1) | 
| GIT | Git Bash(2.11.0) | 
| Pruebas | Postman(5.1.2) | 

#### 2.3.2 Pruebas en el DCA
| Sección | Tecnología |
| --- |:---:|
| SISTEMA OPERATIVO | Linux CentOS (7.1) |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) - Typescript(2.4) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| WEB SERVER | NGINX(1.12.1) | 
| BASE DE DATOS | MongoDB(2.6.11) | 
| GIT | Git Bash(2.11.0) | 

#### 2.3.3 Nube
| Sección | Tecnología |
| --- |:---:|
| PROVEEDOR | Heroku |
| LENGUAJE DE PROGRAMACIÓN |Javascript/NodeJS(6.11.1) |
| FRAMEWORK WEB - BACKEND | Express (4.15.3) | 
| FRAMEWORK WEB - FRONTEND | Angular (4.3.1) | 
| WEB APP SERVER | Embebido ((NodeJS (6.11.1)) | 
| BASE DE DATOS | MongoDB a través de mlab(6.12.17) |

# 3. Diseño

# 3.1 Modelos
```javascript
User = {
  name: String,
  email: String,
  username: String,
  password: String,
  description: String
}

Image = {
  url: String,
  name: String,
  owner: Object,
  category: String,
  public: Boolean,
  sharedWith: Object[],
  description: String
} 
```
## 3.2 Servicios Web
Todas las direcciones que serán mencionadas a continuación van precedidas por ```/api```
### 3.2.1 Usuarios
```javascript
// Crear un usuario
Método: POST
URI: /users/
Datos Request: {name, email, username, password}
Datos Response: {ok: Boolean, message: String}

// Ingresar a la plataforma, el token regresado es necesario para otras funcionalidades
Método: POST
URI: /users/login
Datos Request: {username, password},
Datos Response: {ok: Boolean, token: String, user: Object}

// Buscar usuario por ID
Método: GET
URI: /users/:id
Datos Request: No aplica
Datos Response: {ok: Boolean, user: Object}

// Actualizar información del usuario
Método: PUT
URI: /users/:id
Datos Request: headers: {'Authorization': token}, body: {name, email, description}
Datos Response: {ok: Boolean, user: Object, message: String}}

// Eliminar un usuario
Método: DELETE
URI: /users/:id
Datos Request: headers: {'Authorization': token}
Datos Response: {ok: Boolean, message: String}
```
### 3.2.2 Imágenes
```javascript
// Crear una imagen
Método: POST
URI: /images/
Datos Request: {name, url, description, public}
Datos Response: {ok: Boolean, message: String}

// Traer todas las imágenes
Método: GET
URI: /images/
Datos Request: No aplica
Datos Response: {ok: Boolean, images: Object[]}

// Buscar imagen por ID
Método: GET
URI: /images/:id
Datos Request: No aplica
Datos Response: {ok: Boolean, image: Object}

// Buscar imágenes por palabra en el nombre
Método: GET
URI: /images/searchImage/:name
Datos Request: No aplica
Datos Response: {ok: Boolean, images: Object[]}

// Actualizar información de una imagen
Método: PUT
URI: /images/:id
Datos Request: headers: {'Authorization': token}, body: {name, description}
Datos Response: {ok: Boolean, image: Object, message: String}}

// Eliminar un imagen
Método: DELETE
URI: /images/:id
Datos Request: headers: {'Authorization': token}
Datos Response: {ok: Boolean, message: String}
```

# 4. Instalación
Clonar el repositorio 
``` 
git clone https://github.com/damart10/toptelematica
```

Acceder a la carpeta llamada ```proyecto01``` y correr ```npm install```.

Acceder a la carpeta ```proyecto01/angular-src``` y correr ```npm install```.

# 5. Ejecución
## 5.1 Desarrollo 
Una vez instalado, realizar lo siguiente:
* Estando dentro de la carpeta ```angular-src``` correr el comando ```ng serve```
* Estando dentro de la carpeta ```proyecto01``` correr el comando ```npm start```
* Acceder a ```http://localhost:42000/```

## 5.2 DCA
Instalar MongoDB y NGINX a través del manejador de paquetes de CentOS. Es necesario ser root
``` 
sudo yum -y install mongodb-server epel-release nginx
```

Habilitar el inicio automático de ambas aplicaciones con los comandos
```
sudo systemctl enable mongod
sudo systemctl enable nginx
```

Iniciar ambas con los comandos 
```
sudo systemctl start mongod
sudo systemctl start nginx
```
Abrir el puerto 80 en el firewall y recargarlo para que sea efectivo
```
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --reload
```

Crear un reverse proxy, el cual escuchará por el puerto ```80``` y redigirá todos los request que lleguen a través de ```http://10.131.137.221/dmarti25/``` hacia ```http://127.0.0.1:3000/```, el cual es el puerto donde se encuentra escuchando la aplicación de NodeJS. Para ello modificar el bloque ```server``` de la configuración de NGINX ubicada en ```/etc/nginx/nginx.conf/``` de la siguiente manera
```
server {
	listen 80;
	server_name 10.131.137.221;
	root /usr/share/nginx/html;

	location /dmarti25 {
		rewrite /dmarti25(.*) $1 break;

		proxy_http_version 1.1;
		proxy_set_header X-Real-Ip $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-NginX-Proxy true;
		proxy_set_header Host $http_host;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";

		proxy_pass http://127.0.0.1:3000;
	}
}
```
Instalar NVM (Node Version Manager) para no realizar una instalación global de Node. Instrucciones para la instalación aquí https://github.com/creationix/nvm#installation

Una vez instalado NVM, installar la versión de Node de la aplicación 
```
nvm install 6.11.1
```
Instalar el manejador de procesos que se encargará de ejecutar y autoiniciar la aplicación en el servidor
```
npm install -g pm2 
```
Preparar la aplicación para ser ejecutada. Ingresar a la carpeta ```proyecto01/angular-src/src/environments``` y modificar el archivo ```environment.ts``` de la siguiente manera
```
export const environment = {
  production: true,
  apiUrl: 'api/'
};
```
Volver a la carpeta ```angular-src``` y ejecutar el comando ```ng build```

Ingresar a la carpeta ```proyecto01``` y ejecutar el siguiente comando para iniciar la aplicación.
```
pm2 start app.js --name "dmarti25"
```
Hacer que ```pm2``` inicie con el sistema y que recuerde correr nuestra aplicación cuando inicie
```
sudo pm2 startup
pm2 save
```
Ingresar a ```http://10.131.137.221/dmarti25/``` y disfrutar de la aplicación.

### Notas finales
No fue posible usar los flags de ```angular-cli``` para hacer ```build``` de la aplicación con otro environment, ya que siempre realizaba el build con el environment default. Por ello, es necesario modificar el archivo ```environment.ts```