import os
from bs4 import BeautifulSoup
import json

def scan_videos():
    """Scan the images directory to find all video files and organize them"""
    videos = []
    
    # Base path for images
    base_path = "images"
    
    # Walk through all subdirectories
    for root, dirs, files in os.walk(base_path):
        for file in files:
            # Check if file is a video
            if file.lower().endswith(('.mp4', '.avi', '.mov', '.wmv', '.flv')):
                # Get relative path from images directory
                rel_path = os.path.relpath(os.path.join(root, file), base_path)
                
                # Create video object
                video = {
                    'src': f'images/{rel_path}',
                    'name': file,
                    'category': os.path.basename(root),
                    'autoplay': False  # Default to no autoplay
                }
                
                videos.append(video)
    
    return videos

def generate_video_data():
    """Generate video data and save to JSON file"""
    videos = scan_videos()
    
    # Save to JSON file
    with open('video_data.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, indent=2, ensure_ascii=False)
    
    print(f"Found {len(videos)} videos:")
    for video in videos:
        print(f"  - {video['name']} ({video['category']})")
    
    return videos

def create_html_with_beautifulsoup():
    """Create HTML content using BeautifulSoup"""
    # Create a new HTML document
    soup = BeautifulSoup('<html><body></body></html>', 'html.parser')
    
    # Add head section
    head = soup.new_tag('head')
    soup.html.insert(0, head)
    
    # Add meta tags
    meta_charset = soup.new_tag('meta')
    meta_charset['charset'] = 'UTF-8'
    head.append(meta_charset)
    
    meta_viewport = soup.new_tag('meta')
    meta_viewport['name'] = 'viewport'
    meta_viewport['content'] = 'width=device-width, initial-scale=1.0'
    head.append(meta_viewport)
    
    # Add title
    title = soup.new_tag('title')
    title.string = 'NFT Showcase - Generated with BeautifulSoup'
    head.append(title)
    
    # Add body content
    body = soup.html.body
    
    # Add header
    header = soup.new_tag('header')
    h1 = soup.new_tag('h1')
    h1.string = 'NFT Showcase - Generated with BeautifulSoup'
    header.append(h1)
    body.append(header)
    
    # Add video gallery
    gallery = soup.new_tag('div')
    gallery['class'] = 'video-gallery'
    
    videos = scan_videos()
    for video in videos:
        video_div = soup.new_tag('div')
        video_div['class'] = 'video-item'
        
        # Create video element
        video_elem = soup.new_tag('video')
        video_elem['src'] = video['src']
        video_elem['controls'] = ''
        video_elem['muted'] = ''
        video_elem['loop'] = ''
        
        video_div.append(video_elem)
        gallery.append(video_div)
    
    body.append(gallery)
    
    # Save the generated HTML
    with open('generated_showcase.html', 'w', encoding='utf-8') as f:
        f.write(soup.prettify())
    
    print("Generated HTML file: generated_showcase.html")
    return soup

if __name__ == "__main__":
    print("Scanning for videos...")
    videos = generate_video_data()
    
    print("\nGenerating HTML with BeautifulSoup...")
    soup = create_html_with_beautifulsoup()
    
    print("\nDone! Files generated:")
    print("  - video_data.json (video metadata)")
    print("  - generated_showcase.html (BeautifulSoup generated HTML)")
