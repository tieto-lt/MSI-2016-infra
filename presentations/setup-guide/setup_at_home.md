## Guide to setup MSI infra at home

### Install mysql

```
$ sudo apt-get install mysql-server
```

During installation select user `root` password `root`

### Install mysql-workbench

```
$ sudo add-apt-repository ppa:olivier-berten/misc
$ sudo apt-get update
$ sudo apt-get install mysql-workbench
```

Run it from terminal:

```
$ mysql-workbench
```

### Setup mysql

as described here https://github.com/tieto-lt/MSI-2016-infra/blob/master/presentations/setup-guide/setup-guide.md
in  MySQL DB section


## Install java mvn Intellij

Download setup script and run it with command:


```
$ curl https://raw.githubusercontent.com/tieto-lt/MSI-2016-infra/master/setup_env_java.sh | sh
```

Verify if it worked:

```
$ java -version
```

Should show java version

```
$ mvn -version
```

Should show maven version

Run Intellij from command line

```
$ ./soft/idea-IC-162.1121.32/bin/idea.sh
```
