
## MySQL DB setup

Connect to MySQL as root from terminal:

```
$ mysql -u root -p
```

Password: `root`

```
mysql> create database msi2016;
mysql> create user msi2016;
mysql> grant all on msi2016.* to 'msi2016'@'%' identified by 'msi2015';
```

Change msi2016 to your team name.

### MySQL workbench.

Open MySQL workbench and setup connection to newly created database.

## Git setup

Git is installed in all computer, but not configured.

To setup git properly follow those steps:

Precondition:
  - github.com account


1. Configure your git identity:

```
$ git config --global user.name "Zygimantas Gatelis"
$ git config --global user.email "zygis.gg@egmail.com"
```

2. Setup github

Generate ssh key:
```
$ ssh-keygen -t rsa -b 4096 -C "zygis.gg@gmail.com"
```

Copy your ssh key from terminal:
```
$ cat ~/.ssh/id_rsa.pub
```

Add copied key to github.com.
Use this [link](https://github.com/settings/keys)

3. Clone MSI-2016-JAVA project

```
$ git clone https://github.com/tieto-lt/MSI-2016-JAVA.git
```

This repo will be used for lectures.

Setup team repository:

!NOTE: this should be done only from 1 workstation

```
$ cp -R MSI-2016-JAVA/ your-team-name
$ cd your-team-name
$ git remote set-url origin git@github.com:tieto-lt/your-team-name.git
```

Rest students should clone app repository:

```
$ git clone git@github.com:tieto-lt/your-team-name.git
```

## Maven

Maven is build tool that automates common software development task.
We use it to compile and run our application.

Compile project:
```
$ cd your-team-name
$ mvn clean install
```
It will download dependencies, compile project and create jar file inside target catalog.

Running application:
```
$ mvn spring-boot:run
```

If it fails check `src/main/resources/application.properties` file. Check if MySQL database name is correct.

## Use IDE

Command line is not perfect for java development. Lets open our project in IntelliJ IDE.

`File -> New -> Project from existing source`

Then enable project automatic make, to rebuild project when code changed a.k.a. automatic leload.

Find `Make project automatically` option and enable it.

To run project from IDE find main class in project `Application.java`, right click it and select `run`.

Check that application is working:
http://localhost:8080
