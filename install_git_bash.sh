#!/bin/bash

cd $HOME
git clone https://github.com/magicmonty/bash-git-prompt.git .bash-git-prompt --depth=1

if grep --quiet "GIT_PROMPT_ONLY_IN_REPO=1" $HOME/.bashrc; then
    echo "GIT PROMPT already in bashrc"
else
    echo "source ~/.bash-git-prompt/gitprompt.sh" >> ~/.bashrc	
    echo "GIT_PROMPT_ONLY_IN_REPO=1" >> ~/.bashrc
    echo "GIT_PS1_SHOWDIRTYSTATE=true" >> ~/.bashrc
fi  
