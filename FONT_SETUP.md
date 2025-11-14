# Inter Font Setup Instructions

## Step 1: Download Inter Font Files

1. Visit Google Fonts: https://fonts.google.com/specimen/Inter
2. Click "Download family" to download the Inter font
3. Extract the ZIP file
4. **IMPORTANT**: Navigate to the `/static` folder in the extracted files
5. You'll need these **static** font files (NOT the variable fonts):
   - `Inter-Regular.ttf` (or `Inter_18pt-Regular.ttf`)
   - `Inter-Medium.ttf` (or `Inter_18pt-Medium.ttf`)
   - `Inter-SemiBold.ttf` (or `Inter_18pt-SemiBold.ttf`)
   - `Inter-Bold.ttf` (or `Inter_18pt-Bold.ttf`)

**Note**: Variable font files (`Inter-VariableFont_*.ttf`) will NOT work with React Native.

## Step 2: Add Font Files to Project

1. **Remove the existing variable font files**:
   ```bash
   cd src/assets/fonts/
   rm Inter-*.ttf
   ```

2. Copy the 4 **static** font files to: `src/assets/fonts/`
3. Rename them if needed to match these names:
   - `Inter-Regular.ttf`
   - `Inter-Medium.ttf`
   - `Inter-SemiBold.ttf`
   - `Inter-Bold.ttf`

4. Your directory should look like:
   ```
   src/assets/fonts/
   ├── Inter-Regular.ttf
   ├── Inter-Medium.ttf
   ├── Inter-SemiBold.ttf
   └── Inter-Bold.ttf
   ```

## Step 3: Update Font Constants

Edit `src/constants/fonts.ts` and update it to:
```typescript
export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};
```

## Step 4: Link Fonts to Native Projects

Run this command in the project root (already done):
```bash
npx react-native-asset
```

## Step 5: Rebuild the App

### For iOS:
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### For Android:
```bash
npx react-native run-android
```

## Step 5: Use Fonts in Your Code

Import the FONTS constant:
```typescript
import {FONTS} from '../constants/fonts';
```

Then use in StyleSheet:
```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,  // For regular weight
    fontFamily: FONTS.medium,   // For medium weight
    fontFamily: FONTS.semiBold, // For semi-bold weight
    fontFamily: FONTS.bold,     // For bold weight
  },
});
```

## Mapping Font Weights

Replace:
- `fontWeight: '400'` or `'normal'` → `fontFamily: FONTS.regular`
- `fontWeight: '500'` → `fontFamily: FONTS.medium`
- `fontWeight: '600'` → `fontFamily: FONTS.semiBold`
- `fontWeight: '700'` or `'bold'` → `fontFamily: FONTS.bold`

Remove the `fontWeight` property when using the specific font family.
