#!/bin/bash

SOFT_DIR="$HOME/soft"

cd /tmp

INTELLIJ_ARCH="ideaIC-2016.2.1.tar.gz"
INTELLIJ_DOWNLOAD_URL="https://download.jetbrains.com/idea/$INTELLIJ_ARCH"
INTELLIJ_FOLDER_NAME="idea-IC-162.1447.26"
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

desktop-file-install --dir=$HOME/.local/share/applications jetbrains-idea-ce.desktop

