#!/bin/bash

SOFT_DIR="$HOME/soft"

# JAVA INSTALLATION #

JAVA_FOLDER_NAME="jdk1.8.0_101"
JAVA_ARCH="jdk-8u101-linux-x64.tar.gz"

JAVA_EXTRACT_PATH="$SOFT_DIR/$JAVA_FOLDER_NAME"


cd /tmp

if [ -f "$JAVA_ARCH" ]; then
    echo "Java already downloaded. Skipping download"
else 
    wget "https://dl.dropboxusercontent.com/u/43832918/$JAVA_ARCH"
fi

if [ -d "$JAVA_EXTRACT_PATH" ]; then
    echo "Java already extracted. Skipping"    
else
    echo "Extracting Java..."
    mkdir -p $SOFT_DIR
    cd $SOFT_DIR
    tar -xvf /tmp/$JAVA_ARCH    
fi
    
echo "Linking Java..."
sudo ln -sfn ~/soft/$JAVA_FOLDER_NAME /opt/jdk
cd /tmp

if grep --quiet "export JAVA_HOME=" $HOME/.bashrc; then
    echo "JAVA_HOME already exists in bashrc"
else
    echo "export JAVA_HOME=\"/opt/jdk\"" >> ~/.bashrc	
fi  
if grep --quiet "export PATH=\"\$JAVA_HOME/bin" $HOME/.bashrc; then
    echo "Java PATH already exists in bashrc"
else
    echo "export PATH=\"\$JAVA_HOME/bin:\$PATH\"" >> ~/.bashrc	
fi  

# INTELLIJ INSTALLATION

cd /tmp

INTELLIJ_ARCH="ideaIC-2016.2.tar.gz"
INTELLIJ_DOWNLOAD_URL="https://download.jetbrains.com/idea/$INTELLIJ_ARCH"
INTELLIJ_FOLDER_NAME="idea-IC-162.1121.32"
INTELLIJ_EXTRACT_PATH="$SOFT_DIR/$INTELLIJ_FOLDER_NAME"

if [ -f "$INTELLIJ_ARCH" ]; then
    echo "Intellij already downloaded. Skipping download"
else 
    wget "$INTELLIJ_DOWNLOAD_URL"
fi

if [ -d "$INTELLIJ_EXTRACT_PATH" ]; then
    echo "Intellij already extracted. Skipping"    
else
    echo "Extracting Java..."
    mkdir -p $SOFT_DIR
    cd $SOFT_DIR
    tar -xvf /tmp/$INTELLIJ_ARCH    
fi

echo "Linking Intellij..."
sudo ln -sfn ~/soft/$INTELLIJ_FOLDER_NAME /opt/idea

echo "Installing Intellij desktop file"

rm -f jetbrains-idea-ce.desktop
cat >jetbrains-idea-ce.desktop <<EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=IntelliJ IDEA Community Edition
Icon=/opt/idea/bin/idea.png
Exec="/opt/idea/bin/idea.sh" %f
Comment=The Drive to Develop
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-idea-ce
EOL

desktop-file-install --dir=~/.local/share/applications jetbrains-idea-ce.desktop

# MAVEN Installation

cd /tmp

MAVEN_ARCH="apache-maven-3.3.9-bin.tar.gz"
MAVEN_DOWNLOAD_URL="http://apache.mirror.serveriai.lt/maven/maven-3/3.3.9/binaries/$MAVEN_ARCH"
MAVEN_FOLDER_NAME="apache-maven-3.3.9"
MAVEN_EXTRACT_PATH="$SOFT_DIR/$MAVEN_FOLDER_NAME"

if [ -f "$MAVEN_ARCH" ]; then
    echo "Maven already downloaded. Skipping download"
else 
    wget "$MAVEN_DOWNLOAD_URL"
fi

if [ -d "$MAVEN_EXTRACT_PATH" ]; then
    echo "Maven already extracted. Skipping"    
else
    echo "Extracting Java..."
    mkdir -p $SOFT_DIR
    cd $SOFT_DIR
    tar -xvf /tmp/$MAVEN_ARCH    
fi

echo "Linking Maven..."
sudo ln -sfn $MAVEN_EXTRACT_PATH /opt/maven
cd /tmp

if grep --quiet "export MAVEN_HOME=" $HOME/.bashrc; then
    echo "MAVEN_HOME already exists in bashrc"
else
    echo "export MAVEN_HOME=\"/opt/maven\"" >> ~/.bashrc	
fi  
if grep --quiet "export PATH=\"\$MAVEN_HOME/bin" $HOME/.bashrc; then
    echo "Maven PATH already exists in bashrc"
else
    echo "export PATH=\"\$MAVEN_HOME/bin:\$PATH\"" >> ~/.bashrc	
fi  

# Atom install

cd /tmp

ATOM_ARCH="atom.deb"
ATOM_DOWNLOAD_URL="https://atom.io/download/deb"
MAVEN_FOLDER_NAME="apache-maven-3.3.9"
MAVEN_EXTRACT_PATH="$SOFT_DIR/$MAVEN_FOLDER_NAME"

if [ -f "$ATOM_ARCH" ]; then
    echo "Atom already downloaded. Skipping download"
else 
    wget "$ATOM_DOWNLOAD_URL" -O $ATOM_ARCH
fi

sudo apt-get update  
sudo apt-get upgrade
sudo apt-get install -f 
sudo apt-get install git
sudo dpkg -i atom.deb
apm install linter
apm install linter-jshint
