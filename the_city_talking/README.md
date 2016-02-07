# Installation

Devrait s'installer automatiquement lors du lancement de server.js dans la racine 

## Comment build

$ npm install
$ webpack

## Comment dev

$ npm install

Dans deux lignes de commande différentes :

### Ligne de commande server

$ cd ..
$ node server.js

### Ligne de commande client

$ node_modules/.bin/webpack --colors --progress --watch

ou si webpack est installé en global (via npm install -g webpack)

$ webpack --colors --progress --watch

(Pour reconstruire le js/scss automatiquement à chaque changement)

# Informations complémentaires
