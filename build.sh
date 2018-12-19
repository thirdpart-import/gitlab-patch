# !/bin/sh

gitlab_version=11.5.4

#rm -rf app locale vendor patch.diff

rm -rf gitlabce
git clone https://gitlab.com/xhang/gitlab.git gitlabce

cd gitlabce

git diff v${gitlab_version} v${gitlab_version}-zh > ../patch.diff

#git checkout v${gitlab_version}-zh

