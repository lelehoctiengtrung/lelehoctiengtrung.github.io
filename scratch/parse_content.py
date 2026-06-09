import re
import html
from html.parser import HTMLParser

class Chinese4KidsParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.recording = False
        self.content_parts = []
        self.depth = 0
        self.in_script_or_style = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag in ['script', 'style']:
            self.in_script_or_style = True
            return

        # Start recording when we find the article content or body
        # Specifically, check for entry-content
        if attrs_dict.get('class') and 'entry-content' in attrs_dict.get('class'):
            self.recording = True
            self.depth = 1
            return

        if self.recording:
            self.depth += 1
            if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                self.content_parts.append(f"\n\n{'#' * int(tag[1])} ")
            elif tag == 'p':
                self.content_parts.append("\n\n")
            elif tag == 'li':
                self.content_parts.append("\n- ")
            elif tag == 'tr':
                self.content_parts.append("\n")
            elif tag in ['td', 'th']:
                self.content_parts.append(" | ")

    def handle_endtag(self, tag):
        if tag in ['script', 'style']:
            self.in_script_or_style = False
            return

        if self.recording:
            self.depth -= 1
            if self.depth == 0:
                self.recording = False
            if tag == 'tr':
                self.content_parts.append(" |")

    def handle_data(self, data):
        if self.in_script_or_style:
            return
        if self.recording:
            text = data.strip()
            if text:
                # Keep Chinese characters and other text
                self.content_parts.append(text)

def main():
    file_path = "/Users/hanario/.gemini/antigravity/brain/7333c671-7bce-417f-bd42-11db42e4ead4/.system_generated/steps/4234/content.md"
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    parser = Chinese4KidsParser()
    parser.feed(html_content)
    
    extracted_text = "".join(parser.content_parts)
    # Clean up multiple newlines
    extracted_text = re.sub(r'\n{3,}', '\n\n', extracted_text)
    
    out_path = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow/scratch/extracted_content.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)
        
    print(f"Extracted {len(extracted_text)} characters and saved to {out_path}")

if __name__ == "__main__":
    main()
