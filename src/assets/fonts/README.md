# SF Pro Fonts Setup

This directory is for self-hosting SF Pro Display and SF Pro Text fonts.

## Getting SF Pro Fonts

SF Pro fonts are proprietary Apple fonts. To use them on the web:

1. **On macOS**: SF Pro fonts are installed by default. You can find them in:
   - `/System/Library/Fonts/Supplemental/` (SF Pro Display)
   - `/System/Library/Fonts/Supplemental/` (SF Pro Text)

2. **Convert to Web Formats**: You'll need to convert the fonts to WOFF2 and WOFF formats:
   - Use tools like [Transfonter](https://transfonter.org/) or [Font Squirrel](https://www.fontsquirrel.com/tools/webfont-generator)
   - Or use command-line tools like `woff2_compress` or `sfnt2woff`

3. **Required Font Files**:
   - `SF-Pro-Display-Regular.woff2` / `.woff`
   - `SF-Pro-Display-Medium.woff2` / `.woff`
   - `SF-Pro-Display-Semibold.woff2` / `.woff`
   - `SF-Pro-Display-Bold.woff2` / `.woff`
   - `SF-Pro-Text-Regular.woff2` / `.woff`
   - `SF-Pro-Text-Medium.woff2` / `.woff`
   - `SF-Pro-Text-Semibold.woff2` / `.woff`

4. **Enable Font Faces**: Once you have the font files:
   - Place them in this directory (`src/assets/fonts/`)
   - Uncomment the `@font-face` declarations in `src/style.css`

## Alternative: System Font Stack

If you don't have access to SF Pro font files, the current setup will:
- Use SF Pro Display/Text on macOS and iOS devices automatically (via system fonts)
- Fall back to system fonts on other platforms

This is the recommended approach as it:
- Works immediately without font files
- Uses native system fonts (better performance)
- Automatically uses SF Pro on Apple devices

## Font Usage

- **SF Pro Display**: Used for headings and large text (titles, headings)
- **SF Pro Text**: Used for body text and smaller text (paragraphs, labels, inputs)

The font stack prioritizes SF Pro Display and SF Pro Text, falling back to system fonts if not available.

