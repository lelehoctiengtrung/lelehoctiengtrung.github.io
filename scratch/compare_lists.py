import re

with open("media.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find ALL_VIDEOS block
start_pattern = "const ALL_VIDEOS = ["
start_idx = content.find(start_pattern)
end_idx = content.find("];", start_idx)
videos_array_str = content[start_idx + len(start_pattern) : end_idx]

obj_pattern = r"\{[^{}]*\}"
objs = re.findall(obj_pattern, videos_array_str)

media_js_vids = []
for o in objs:
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        v_title = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        if v_category == "Lê Lê kể chữ":
            media_js_vids.append((v_id, v_title))
    except Exception:
        pass

# Playlist videos from check_playlist_order.py (hardcoded from the run output)
playlist_vids = [
    "ZKFGnZu36C4", "ycoBAmSHaIk", "GRCVyX1NVKc", "DrGtgLX5B38", "yPB0kkFBfDA",
    "LRSlWafLcdc", "gcdxpViyblE", "q_9fy1F5vbE", "jMB51QqslDU", "OqhxB504-u8",
    "tSqPD1uCg2Y", "s1WhwmGbo_s", "5i27wCursTA", "Mx6Svocgil4", "DBvjz-UjKcs",
    "lg4m_lqlQac", "yVobRj4s42M", "sK3g_j5PN3A", "GTXKMZugW-M", "EXHGG43gVlk",
    "cJ7U9Olpx7U", "8MEt2ZkrGMU", "NF10Doada1g", "lCTp91wuBGA", "5t9w_awJZUk",
    "j2myKWgjbYI", "Pw8odtts1h4", "jsj0YX3iTz0", "v7icfPBTn1k", "v6-uJwe3GYY",
    "TcKDmAP-HVs", "XznUKXARWeA", "EWxYnBFH44s", "2WaXAJrvP3c", "ligtDefdack",
    "zrRg18tXyxI", "Kapx7qHDQzM", "p1cP_bUs41o", "y_nLw3euYQk", "q-TwRb12JxU",
    "OBu4HxmACaw", "ukbAYcmktm8", "3t8i3Zt-bKg", "ErVxrJVrvXc", "r--MW0Qj5H8",
    "24RscCfC5dM", "1YH2H-HPPaQ", "zH4vIE5vCU0", "0vVPcmv9sZo", "TaHKq_2wdNE",
    "4V2sohAIBbI", "y3gX36hb-bQ", "CBXwISkgwHE", "ddwbrAlJwbQ", "6BZutg5fb8s",
    "zU7zXOXqcZE", "PGKzmpolLkE", "jus9TjzjgXs", "7joBUVu_k4c", "GcFxUmA0POE",
    "wjnNJDtH1p0", "4lOk_iySKhA", "_Y4KtpD4w-w"
]

playlist_set = set(playlist_vids)
media_js_set = set(v[0] for v in media_js_vids)

print("In media.js but NOT in playlist:")
not_in_playlist = [v for v in media_js_vids if v[0] not in playlist_set]
for v in not_in_playlist:
    print(f"  ID: {v[0]} | Title: {v[1]}")
    
print("\nIn playlist but NOT in media.js (missing):")
missing = [p for p in playlist_vids if p not in media_js_set]
print(f"  Total missing: {len(missing)}")
for m in missing:
    print(f"  ID: {m}")
