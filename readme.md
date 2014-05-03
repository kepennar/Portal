#Angular portal

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
   
    ProxyPass /sonar http://localhost:9000/sonar
    ProxyPassReverse /sonar http://localhost:9000/sonar

    ServerName localhost
</VirtualHost>
```
