from html.parser import HTMLParser

class TagInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = {}

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get('class', '')
        if cls:
            self.tags[tag] = self.tags.get(tag, set())
            self.tags[tag].add(cls)

def main():
    file_path = "/Users/hanario/.gemini/antigravity/brain/7333c671-7bce-417f-bd42-11db42e4ead4/.system_generated/steps/4234/content.md"
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    inspector = TagInspector()
    inspector.feed(html_content)
    
    for tag, classes in inspector.tags.items():
        print(f"Tag: {tag}")
        for cls in sorted(list(classes))[:10]:
            print(f"  Class: {cls}")

if __name__ == "__main__":
    main()
