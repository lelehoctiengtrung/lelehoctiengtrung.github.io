import urllib.request
import re
import html

video_ids = [
    "ycoBAmSHaIk", "GRCVyX1NVKc", "DrGtgLX5B38", "yPB0kkFBfDA", "LRSlWafLcdc",
    "gcdxpViyblE", "q_9fy1F5vbE", "jMB51QqslDU", "OqhxB504-u8", "tSqPD1uCg2Y",
    "BxC4vGPwt6s", "lwiZmQ04gWI", "E9XS8J52fjo", "K-vukz9rtow", "ebPSABEdUMI",
    "A0VwRz8IGno", "Xxzo0rprdQc", "IppkMx_ep6g", "2QZ4Sw0hrUI", "Kp1j5TqeI38",
    "hizk3Fro9JQ", "s1WhwmGbo_s", "5i27wCursTA", "Mx6Svocgil4", "DBvjz-UjKcs",
    "lg4m_lqlQac", "eDap3fEhWrA", "55PH0e1jm2w", "2JoOBSlNib4", "IpskgDTghTI",
    "ys2Qxpz9cPM", "Pkj1cLfuhGg", "dxyWVUi7YdQ", "aUMowaLuS3Y", "S4v2kkTVGHk",
    "yVobRj4s42M", "sK3g_j5PN3A", "GTXKMZugW-M", "EXHGG43gVlk", "cJ7U9Olpx7U"
]

print("Fetching titles...")
for vid in video_ids:
    try:
        url = f"https://www.youtube.com/watch?v={vid}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            html_content = response.read().decode('utf-8', errors='ignore')
            title_match = re.search(r"<title>(.*?)</title>", html_content)
            if title_match:
                title = title_match.group(1)
                title = title.replace(" - YouTube", "")
                title = html.unescape(title)
                print(f"{vid} | {title}")
            else:
                print(f"{vid} | Title not found")
    except Exception as e:
        print(f"{vid} | Error: {e}")
