import {
  base,
  node,
  perfectionist,
  prettier,
  typescript,
} from 'eslint-config-imperium';

export default [
  {
    ignores: ['dist/', '.devcontainer/', 'logs/'],
  },
  base,
  node,
  typescript,
  prettier,
  perfectionist,
];
