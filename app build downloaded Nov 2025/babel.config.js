module.exports = (api) => ({
  comments: false,
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    !api.env('development') && 'transform-remove-console',
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '@app': './app',
        },
      },
    ],
  ].filter((plugin) => plugin),
});