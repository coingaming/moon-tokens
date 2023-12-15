# Moon Design System Tokens

[![Version](https://img.shields.io/pub/v/moon_tokens.svg)](https://pub.dev/packages/moon_tokens) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org) 

Moon Design System Tokens. Currently only has YOLO brand colors which have been automated
from Figma to code. More tokens to come in future (TBD). 

## Usage

```dart
final lightTheme = ThemeData.light().copyWith(
  extensions: <ThemeExtension<dynamic>>[
    MoonTheme(tokens: lightTokens).copyWith(      
        colors: sbLightColors, // or your relevant brand color token variable
    ),
  ],
);
```