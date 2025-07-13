export default {
  '*.md': ['prettier --cache --ignore-unknown --write'],
  '*.vue': [
    'prettier --write',
    'eslint --cache --fix',
    'stylelint --fix --allow-empty-input',
  ],
  '*.{scss,less,styl,html,vue,css}': [
    'prettier --cache --ignore-unknown --write',
    'stylelint --fix --allow-empty-input',
  ],
  'package.json': ['prettier --cache --write'],
  '{!**/file-viewer/**, !**/vditor/**, *.{js,jsx,ts,tsx}}': [
    'prettier --cache --ignore-unknown  --write',
    'eslint --cache --fix',
  ],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'prettier --cache --write--parser json',
  ],
};
