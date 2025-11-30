import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

export default [
  {
    ignores: [
      'dist/',
      '.devcontainer/',
      'db/',
      'pgadmin/',
      'logs/',
      'src/generated/',
    ],
  },
  base,
  node,
  typescript,
  prettier,
  perfectionist,
];
