# NOTION MYMAPS PARSER

Script para parsear una base de datos de notion a un csv con el formato para importar en mymaps de google maps.
El fichero de entrada csv tiene que contar con dos columnas minimo, una Name, siendo la primera columna, y otra Direccion.

Name viene dada en el caso de uso propio por notion. 
Direccion es un campo adicional en la base de datos de notion.

Si la direccion viene vacia, se buscara automaticamente a partir del campo Direccion.

Tras esto, todos los csv de input pasaran al fichero output. De aqui, ya se pueden importar en mymaps.
