module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@mytypes': './src/types',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@config': './src/config',
          '@theme': './src/theme',
        },
      },
    ],
    // Must be listed last
    'react-native-reanimated/plugin',
  ],
};
