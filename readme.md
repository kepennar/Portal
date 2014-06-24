#Angular portal [![build status](https://api.travis-ci.org/kepennar/Portal.svg)](https://travis-ci.org/kepennar/Portal)

![Screenshot](https://raw.githubusercontent.com/kepennar/Portal/master/doc/portal.png?raw=true "Screenshot")

## CORS problems

### Jenkins
A solution for CORS enabling:

Install [Jenkins-CORS plugin](https://github.com/jhinrichsen/cors-plugin).

### Other solution


Proxify behind Apache with CORS enabled

Example for Sonar :

```
NameVirtualHost *:80
<VirtualHost *:80>
    ProxyPreserveHost On
    
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods' '*'
   
    ProxyPass /sonar http://localhost:9000/sonar
    ProxyPassReverse /sonar http://localhost:9000/sonar

    ServerName localhost
</VirtualHost>
```
