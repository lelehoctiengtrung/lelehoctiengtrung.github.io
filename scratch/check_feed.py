import urllib.request
import xml.etree.ElementTree as ET

url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCGQfqOTElLYJ1-1OEDQJ8Cw"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

print("Fetching YouTube Feed...")
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        xml_data = response.read()
        root = ET.fromstring(xml_data)
        
        ns = {
            'atom': 'http://www.w3.org/2005/Atom',
            'yt': 'http://www.youtube.com/xml/schemas/2015',
            'media': 'http://search.yahoo.com/mrss/'
        }
        
        for entry in root.findall('atom:entry', ns):
            video_id = entry.find('yt:videoId', ns).text
            title = entry.find('atom:title', ns).text
            
            media_group = entry.find('media:group', ns)
            desc = ""
            if media_group is not None:
                desc_el = media_group.find('media:description', ns)
                if desc_el is not None:
                    desc = desc_el.text
                    
            print(f"ID: {video_id}")
            print(f"Title: {title}")
            print(f"Desc: {desc}")
            print("-" * 50)
except Exception as e:
    print(f"Error: {e}")
