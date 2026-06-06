# -*- coding: utf-8 -*-
import os
import fitz  # PyMuPDF

pdf_path = "POSTS/docs/DOC-RADICALS.pdf"
output_dir = "POSTS/images"

def main():
    if not os.path.exists(pdf_path):
        print(f"Error: PDF source file not found at {pdf_path}")
        return

    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Opening PDF file: {pdf_path}...")
    doc = fitz.open(pdf_path)
    print(f"Total pages in PDF: {len(doc)}")
    
    # 2.5 zoom factor gives a crisp high resolution (e.g. 595x842 standard points -> 1487x2105 pixels)
    zoom = 2.5
    mat = fitz.Matrix(zoom, zoom)
    
    # Page mapping: (page_index_0_based, output_filename)
    pages_to_extract = [
        (0, "DOC-RADICALS_cover_flat.png"),   # Page 1: Cover
        (2, "DOC-RADICALS_page3_flat.png"),   # Page 3: Radicals 1-2
        (6, "DOC-RADICALS_page7_flat.png")    # Page 7: Radicals 9-10
    ]
    
    for page_idx, filename in pages_to_extract:
        if page_idx < len(doc):
            print(f"Extracting Page {page_idx + 1} to {filename}...")
            page = doc.load_page(page_idx)
            pix = page.get_pixmap(matrix=mat)
            out_path = os.path.join(output_dir, filename)
            pix.save(out_path)
            print(f"  ✅ Saved: {out_path}")
        else:
            print(f"  ❌ Error: Page index {page_idx} is out of range for this PDF")
            
    print("All flat page screenshots extracted directly from PDF successfully!")

if __name__ == "__main__":
    main()
