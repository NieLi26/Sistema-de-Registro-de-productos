# Sistema de Registro de productos
El sistema se ha desarrollado usando tecnologias como PHP, PotgreSQL, HTML5, JS y CSS3 en frontend. 


## Instrucciones para ejecutar el sitio web
- Inicie los módulos Apache con el controlador **XAMPP**.
- Habilitar postgresql en XAMPP:
    1) En el panel de XAMPP, haz clic en Config → PHP (php.ini) junto a Apache.
    2) Busca y descomenta las siguientes líneas (elimina el ; al inicio):
        * extension=pgsql
        * extension=pdo_pgsql
    3) Guarda los cambios.

- Inicie su motor de bd potgresql y cree su bd con los siguientes datos:
    * user = postgresql
    * password = postgresql
    * host = localhost
    * port = 5432
    * db_name = prueba_desis
- Use el archivo **insert.sql** en la carpeta llamada **sql** en la raiz del proyecto para crear las tablas base.
- Abra la carpeta htdocs en la carpeta XAMPP. Cree una carpeta lladama **prueba-desis**, detro de ahi copie todo el contenido de este directorio raiz.
- Abra el navegador, escriba en la url *localhost:<puerto_apache>/prueba-desis*, presione enter  y debe ver la página de index del sitio web.
