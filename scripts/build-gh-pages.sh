#! /bin/bash

branch=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`

if [ $branch == 'master' ]
  then
    rm -rf dist
    npm run build
    message=`git log -1 --pretty=%B`
    git checkout gh-pages || exit 1
    find . ! -name 'node_modules' ! -name 'dist' ! -name '.*' -maxdepth 1 | xargs rm -rf
    cp -r dist/* .
    rm -rf dist
    git add .
    git commit -a -m "$message"
    git checkout master
fi
