#!/bin/bash

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

cp jetbrains-idea-ce.desktop $HOME/.local/share/applications
