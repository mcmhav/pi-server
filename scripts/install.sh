#!/usr/bin/env bash

print() {
  if [ "$verbose" == "true" ]; then
      printf "[INFO] %s \n" "$1"
  fi
}

pullOrClone() {
  print "pullingOrCloning"
  if [ ! -d "packages" ]; then
    mkdir packages
  fi
  cd packages || exit

  while IFS='' read -r line || [[ -n "$line" ]]; do
    print "Text read from file: $line"
    if [ ! -d "$line" ]; then
      git clone git@github.com:mcmhav/$line.git &> /dev/null
    else
      cd $line || exit
      git pull &> /dev/null
      cd ..
    fi
  done < "$file"

  cd ..
}

# commitsSinceLastTag() {
#   printf "╔════════════════════════════════\n"
#   printf "║ Comits ahead last release\n"
#   printf "╠════════════════════════════════\n"
#   while IFS='' read -r line || [[ -n "$line" ]]; do
#     print "Text read from file: $line"
#     cd $line || exit
#     unReleased=$(git rev-list  `git rev-list --tags --no-walk --max-count=1`..HEAD --count)
#     if [ "$unReleased" -gt "0" ]; then
#       printf "║ %24s: \e[1;35m%s\e[0m\n" $line $unReleased;
#     else
#       printf "║ %24s: \e[1;32m%s\e[0m\n" $line $unReleased;
#     fi
#     cd ..
#   done < "$file"
#   printf "╚════════════════════════════════\n"
# }

installs() {
  pullOrClone
}

usage() {
  echo "lol"
}

file="../config/repos"

verbose="";

while [ "$1" != "" ]; do
  case $1 in
    -f | --full )
      installs
      exit
      ;;
    -v | --verbose )
      verbose="true"
      ;;
    -h | --help )
      usage
      exit
      ;;
    * )
      usage
      exit 1
  esac
  shift
done
