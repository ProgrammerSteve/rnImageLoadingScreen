module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', 
      [
        'module-resolver',
        {
          alias: {
            '@/assets': './src/assets', // Adjust this based on your folder structure
          },
        },
      ],
    ],
  };
};
