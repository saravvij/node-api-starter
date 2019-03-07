#!/bin/bash

YELLOW='\033[1;33m'
GREEN='\033[1;32m'
LCYAN='\033[1;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Style Formatting Configuration... ${NC}"

echo -e "1/5 ${LCYAN}Local ESLint & Prettier Installation... ${NC}"
yarn add --dev eslint prettier

echo -e "2/5 ${YELLOW}Airbnb Configuration Installation... ${NC}"
yarn add --dev eslint-config-airbnb

echo -e "3/5 ${LCYAN}Disabling ESLint Formatting... ${NC}"
yarn add --dev eslint-config-prettier eslint-plugin-prettier

echo -e "4/5 ${YELLOW}Creating ESLint JSON... ${NC}"
touch .eslintrc.json

echo '{
  "extends": ["airbnb", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  }
}' >> .eslintrc.json

echo -e "5/5 ${YELLOW}Creating Custom Prettier Config... ${NC}"
touch .prettierrc

echo '{
  "printWidth": 100,
  "singleQuote": true
}' >> .prettierrc

echo -e "${GREEN}Done! ${NC}"