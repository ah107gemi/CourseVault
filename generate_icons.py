import zlib
import struct
import math

def create_png(width, height, filename):
    # RGBA image buffer
    raw_data = bytearray()
    
    # Palette colors:
    # Background: deep dark indigo/slate #0f172a (15, 23, 42)
    # Accent gradient: electric violet #6366f1 (99, 102, 241) to cyan/teal #06b6d4 (6, 182, 212)
    cx, cy = width / 2.0, height / 2.0
    r_corner = width * 0.22 # rounded rect corner radius
    half_box = width * 0.44

    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            # Check rounded rectangle distance
            dx = max(abs(x - cx) - (half_box - r_corner), 0)
            dy = max(abs(y - cy) - (half_box - r_corner), 0)
            dist_sq = dx*dx + dy*dy
            
            if dist_sq > r_corner * r_corner:
                # Outside icon rounded rect - transparent
                raw_data.extend((0, 0, 0, 0))
                continue
            
            # Anti-aliasing edge
            dist = math.sqrt(dist_sq)
            edge_alpha = 1.0
            if dist > (r_corner - 1.2):
                edge_alpha = max(0.0, min(1.0, (r_corner - dist) / 1.2))
            
            # Base dark gradient (top-left #1e1b4b to bottom-right #0f172a)
            t = (x + y) / (width + height)
            bg_r = int(18 * (1 - t) + 11 * t)
            bg_g = int(24 * (1 - t) + 15 * t)
            bg_b = int(48 * (1 - t) + 30 * t)
            
            # Vault / Graduation Book icon geometry
            # Center bookmark / play triangle / vault box
            nx = (x - cx) / width
            ny = (y - cy) / height
            
            # Draw a stylized "V" or Book / Play symbol inside
            # Ribbon/Vault Shield:
            in_logo = False
            logo_r, logo_g, logo_b = 99, 102, 241
            
            # Outer shield / card border
            sh_w = 0.28
            sh_top = -0.28
            sh_bottom = 0.28
            
            # Bookmark ribbon or vault door
            # Let's draw a glowing ribbon bookmark & play mark
            # Left pillar of V:
            # Stylized C & V or Book & Play:
            # Let's draw an open book with a play badge
            # Left page: x in [-0.26, -0.02], y in [-0.20, 0.20]
            # Right page: x in [0.02, 0.26], y in [-0.20, 0.20]
            # Book spine: |nx| < 0.02 and ny in [-0.20, 0.20]
            # Play triangle in center:
            
            # Let's do a stylish play vault badge:
            # Circle base with border:
            dist_center = math.sqrt(nx*nx + ny*ny)
            
            # Gradient color for foreground
            fg_t = (nx + 0.3) / 0.6
            fg_t = max(0.0, min(1.0, fg_t))
            # violet (99, 102, 241) to sky (56, 189, 248)
            cur_fg_r = int(99 * (1 - fg_t) + 56 * fg_t)
            cur_fg_g = int(102 * (1 - fg_t) + 189 * fg_t)
            cur_fg_b = int(241 * (1 - fg_t) + 248 * fg_t)
            
            # Ring between 0.26 and 0.30
            if 0.24 <= dist_center <= 0.29:
                in_logo = True
            
            # Play arrow inside:
            # Triangle with vertices at (-0.10, -0.14), (-0.10, 0.14), (0.15, 0.0)
            if -0.09 <= nx <= 0.14:
                # y height allowed: linear from 0.14 at -0.09 to 0.0 at 0.14
                max_y = 0.14 * (0.14 - nx) / (0.14 - (-0.09))
                if abs(ny) <= max_y:
                    in_logo = True
                    # slightly brighter inside play button
                    cur_fg_r = min(255, cur_fg_r + 40)
                    cur_fg_g = min(255, cur_fg_g + 40)
                    cur_fg_b = min(255, cur_fg_b + 40)

            # 4 vault dots at cardinal directions
            for dx_c, dy_c in [(-0.35, 0), (0.35, 0), (0, -0.35), (0, 0.35)]:
                d_dot = math.sqrt((nx - dx_c)**2 + (ny - dy_c)**2)
                if d_dot <= 0.025:
                    in_logo = True

            if in_logo:
                final_r, final_g, final_b = cur_fg_r, cur_fg_g, cur_fg_b
            else:
                final_r, final_g, final_b = bg_r, bg_g, bg_b

            alpha_byte = int(255 * edge_alpha)
            raw_data.extend((final_r, final_g, final_b, alpha_byte))
            
    # Compress IDAT
    compressed = zlib.compress(bytes(raw_data), level=9)
    
    # PNG signature
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', 13))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    
    # IDAT chunk
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    
    # IEND chunk
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', zlib.crc32(b'IEND')))
    
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == '__main__':
    create_png(192, 192, 'CourseVault/icons/icon-192.png')
    create_png(512, 512, 'CourseVault/icons/icon-512.png')
