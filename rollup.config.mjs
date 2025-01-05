import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import cssnano from 'cssnano';
import postcss from 'rollup-plugin-postcss';

export default [
	{
		input: 'src/main.js',
		output: {
			file: 'build/index.js',
			format: 'umd',
			inlineDynamicImports: true,
			name: 'rollitup',
		},
		plugins: [
			postcss({
				extensions: ['.css', '.scss'],
				plugins: [cssnano({ preset: 'default' })],
				extract: true,
				modules: false,
			}),
			nodeResolve(),
			babel(
				{
					exclude: 'node_modules/**/*.js',
					presets: [['@babel/preset-react', { useBuiltIns: false }]],
					babelHelpers: 'inline',
				}
			),
			commonjs(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				preventAssignment: true,
			}),
			terser(),
		],
	},
	{
		input: 'src/index.js',
		output: {
			file: 'public/index.js',
			format: 'umd',
			inlineDynamicImports: true,
			name: 'rollitup',
		},
		plugins: [
			postcss({
				extensions: ['.css', '.scss'],
				plugins: [cssnano({ preset: 'default' })],
				extract: true,
				modules: false,
			}),
			nodeResolve(),
			babel(
				{
					exclude: 'node_modules/**/*.js',
					presets: [['@babel/preset-react', { useBuiltIns: false }]],
					babelHelpers: 'inline',
				}
			),
			commonjs(),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				preventAssignment: true,
			}),
			terser(),
		],
	}
];
