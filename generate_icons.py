import subprocess
import os

def generate_icons():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(base_dir, 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 512px;
    height: 512px;
    overflow: hidden;
    background: #0B0E14;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mark-container {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>
  <div class="mark-container">
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="20" height="24" rx="3" fill="rgba(26, 32, 44, 0.6)" stroke="#262E3B" stroke-width="1.5" />
      <rect x="7" y="7" width="20" height="24" rx="3" fill="#12161C" stroke="rgba(197, 160, 89, 0.4)" stroke-width="1.5" />
      <rect x="10" y="10" width="18" height="20" rx="3" fill="#1A202C" stroke="#C5A059" stroke-width="1.8" />
      <path d="M12 10H17V17L14.5 15L12 17Z" fill="#C5A059" />
    </svg>
  </div>
</body>
</html>"""

    temp_html = os.path.join(icons_dir, "_temp_512.html")
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    icon_512 = os.path.join(icons_dir, 'icon-512.png')
    icon_192 = os.path.join(icons_dir, 'icon-192.png')

    # Render 512x512 via headless Edge
    temp_profile = os.path.join(os.environ.get('TEMP', '.'), 'edge_pwa_icon')
    subprocess.run([
        edge_path,
        "--headless",
        "--disable-gpu",
        f"--user-data-dir={temp_profile}",
        f"--screenshot={icon_512}",
        "--window-size=512,512",
        f"file:///{temp_html.replace(os.sep, '/')}"
    ], check=True)

    if os.path.exists(temp_html):
        os.remove(temp_html)
    print(f"Generated {icon_512} (512x512)")

    # Resize 512x512 to 192x192 via PowerShell System.Drawing
    ps_cmd = f"""
    Add-Type -AssemblyName System.Drawing;
    $src = [System.Drawing.Image]::FromFile('{icon_512}');
    $dest = New-Object System.Drawing.Bitmap 192, 192;
    $g = [System.Drawing.Graphics]::FromImage($dest);
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
    $g.DrawImage($src, 0, 0, 192, 192);
    $dest.Save('{icon_192}', [System.Drawing.Imaging.ImageFormat]::Png);
    $g.Dispose();
    $dest.Dispose();
    $src.Dispose();
    """
    subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], check=True)
    print(f"Generated {icon_192} (192x192)")

if __name__ == '__main__':
    generate_icons()
