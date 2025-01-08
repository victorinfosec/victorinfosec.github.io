# Cheatsheet Image
## 1. File To identify the type of file you are dealing with: 
```bash 
type filename
```

## 2. Strings

Display strings within the file:

```bash
strings -n 7 -t x filename.png
```

- `-n 7`: Displays strings of 7 or more characters.
- `-t x`: Shows their position in hexadecimal format.

---

## 3. Exif

Check the image's metadata. Use a tool like **Jeffrey's Image Metadata Viewer** for detailed analysis.

---

## 4. Binwalk

Inspect the image for hidden embedded files:

```bash
binwalk -Me filename.png
```

- `-Me`: Extracts files recursively.

---

## 5. pngcheck

Verify optional chunks or check for corruption in PNG files:

```bash
pngcheck -vtp7f filename.png
```

- `-v`: Verbose mode.
- `-t` and `7`: Display `tEXt` chunks.
- `-p`: Show optional chunk contents.
- `-f`: Continue after major errors.

### Related Write-ups

- PlaidCTF 2015
- SECCON Quals 2015

---

## 6. Explore Colour & Bit Planes

Hidden images can be located within bit planes. Upload the file to an analysis site and:

1. Explore options like Full Red, Inverse, or LSB.
2. Browse bit planes for unusual patterns.
3. If static appears, extract it via the "Extract Files/Data" menu.

### Related Write-ups

- MicroCTF 2017
- CSAW Quals 2016
- ASIS Cyber Security Contest Quals 2014
- Cybersocks Regional 2016

---

## 7. Extract LSB Data

To extract static patterns in bit planes:

1. Navigate to the "Extract Files/Data" page.
2. Select the relevant bits for extraction.

---

## 8. Check RGB Values

Data can hide in RGB(A) values:

1. Upload the image to a viewer.
2. Inspect RGBA values and convert them to text.
3. Analyze individual R, G, B, or A values for patterns.

### Related Write-ups

- MMA-CTF-2015

---

## 9. Found a Password? (Or Not)

If a password is present, use **steghide**:

```bash
steghide extract -sf filename.png
```

- Note: Steghide might work without a password.

Other tools:

- OpenStego
- Stegpy
- Outguess
- jphide

### Related Write-ups

- Pragyan CTF 2017
- Xiomara 2019
- CSAW Quals 2015
- BlackAlps Y-NOT-CTF (JFK Challenge)

---

## 10. Browse Colour Palette

For type 3 PNG files:

1. Randomize the color palette using an online tool to reveal hidden data.
2. Browse individual colors or palette indexes for strings.

### Related Write-ups

- Plain CTF 2014

---

## 11. Pixel Value Differencing (PVD/MPVD)

Rarely, data may be hidden using **Pixel Value Differencing** (PVD). This involves adjusting pixel pair differences to encode information.

A detailed paper on PVD is available [here](#).

### Related Write-ups

- TJCTF 2019
- MMA-CTF 2015
