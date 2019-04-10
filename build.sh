# !/bin/sh

gitlab_version=11.9.6

#rm -rf app locale vendor patch.diff

rm -rf gitlabce
git clone https://gitlab.com/xhang/gitlab.git gitlabce

cd gitlabce

IGNORE_DIRS=':!qa :!spec :!features :!.gitignore :!.gitlab :!locale :!app/assets/ :!vendor/assets/'
git diff --diff-filter=d v${gitlab_version} v${gitlab_version}-zh -- . ${IGNORE_DIRS} > ../patch.diff

#git checkout v${gitlab_version}-zh

