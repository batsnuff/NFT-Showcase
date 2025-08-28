from flask import Flask, render_template, request, jsonify
import os
import sqlite3
import json
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from video_scanner import scan_videos

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['DATABASE'] = 'visitors.db'

def init_database():
    """Initialize SQLite database with visitors table"""
    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()
    
    # Create visitors table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            user_agent TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_unique BOOLEAN DEFAULT TRUE
        )
    ''')
    
    # Create visitor_stats table for daily/weekly counts
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visitor_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            unique_visitors INTEGER DEFAULT 0,
            total_visits INTEGER DEFAULT 0,
            UNIQUE(date)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

def get_visitor_count():
    """Get total unique visitor count from database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(DISTINCT ip_address) FROM visitors WHERE is_unique = TRUE')
    count = cursor.fetchone()[0]
    conn.close()
    return count

def add_visitor(ip_address, user_agent):
    """Add new visitor to database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if IP already exists
    cursor.execute('SELECT id FROM visitors WHERE ip_address = ?', (ip_address,))
    existing = cursor.fetchone()
    
    if existing:
        # IP exists, add as non-unique visit
        cursor.execute('''
            INSERT INTO visitors (ip_address, user_agent, is_unique) 
            VALUES (?, ?, FALSE)
        ''', (ip_address, user_agent))
        is_unique = False
    else:
        # New IP, add as unique visitor
        cursor.execute('''
            INSERT INTO visitors (ip_address, user_agent, is_unique) 
            VALUES (?, ?, TRUE)
        ''', (ip_address, user_agent))
        is_unique = True
    
    # Update daily stats
    today = datetime.now().strftime('%Y-%m-%d')
    cursor.execute('''
        INSERT OR REPLACE INTO visitor_stats (date, unique_visitors, total_visits)
        VALUES (
            ?,
            (SELECT COUNT(DISTINCT ip_address) FROM visitors WHERE DATE(timestamp) = ? AND is_unique = TRUE),
            (SELECT COUNT(*) FROM visitors WHERE DATE(timestamp) = ?)
        )
    ''', (today, today, today))
    
    conn.commit()
    conn.close()
    return is_unique

def get_visitor_statistics():
    """Get visitor statistics for the last 30 days"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get last 30 days stats
    cursor.execute('''
        SELECT date, unique_visitors, total_visits 
        FROM visitor_stats 
        WHERE date >= date('now', '-30 days')
        ORDER BY date DESC
    ''')
    
    stats = []
    for row in cursor.fetchall():
        stats.append({
            'date': row['date'],
            'unique_visitors': row['unique_visitors'],
            'total_visits': row['total_visits']
        })
    
    conn.close()
    return stats

def get_recent_visitors(limit=10):
    """Get recent visitors with details"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT ip_address, user_agent, timestamp, is_unique
        FROM visitors 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (limit,))
    
    visitors = []
    for row in cursor.fetchall():
        visitors.append({
            'ip_address': row['ip_address'],
            'user_agent': row['user_agent'],
            'timestamp': row['timestamp'],
            'is_unique': bool(row['is_unique'])
        })
    
    conn.close()
    return visitors

# Initialize database on startup
init_database()

@app.route('/')
def index():
    """Main page route"""
    # Get videos from the scanner
    videos = scan_videos()
    visitor_count = get_visitor_count()
    return render_template('index.html', videos=videos, visitor_count=visitor_count)

@app.route('/api/increment-counter', methods=['POST'])
def increment_counter():
    """API endpoint to increment visitor counter"""
    # Get user IP and user agent
    user_ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    # Add visitor to database
    is_unique = add_visitor(user_ip, user_agent)
    
    if is_unique:
        # New unique visitor
        visitor_count = get_visitor_count()
        return jsonify({
            'success': True,
            'count': visitor_count,
            'message': f'Thank you! You are visitor #{visitor_count} 😁'
        })
    else:
        # Returning visitor
        visitor_count = get_visitor_count()
        return jsonify({
            'success': False,
            'count': visitor_count,
            'message': 'You have already clicked the counter! 😏'
        })

@app.route('/api/get-counter', methods=['GET'])
def get_counter():
    """API endpoint to get current visitor count"""
    count = get_visitor_count()
    return jsonify({'count': count})

@app.route('/api/visitor-stats', methods=['GET'])
def visitor_statistics():
    """API endpoint to get visitor statistics"""
    stats = get_visitor_statistics()
    recent_visitors = get_recent_visitors(10)
    
    return jsonify({
        'statistics': stats,
        'recent_visitors': recent_visitors,
        'total_unique_visitors': get_visitor_count()
    })

@app.route('/api/play-all', methods=['POST'])
def play_all_videos():
    """API endpoint to play all videos"""
    return jsonify({'success': True, 'message': 'Playing all videos'})

@app.route('/api/speed-up', methods=['POST'])
def speed_up_videos():
    """API endpoint to speed up videos"""
    return jsonify({'success': True, 'message': 'Videos sped up to 1.5x'})

@app.route('/api/reset', methods=['POST'])
def reset_videos():
    """API endpoint to reset videos"""
    return jsonify({'success': True, 'message': 'Videos reset'})

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """API endpoint to get all video metadata"""
    videos = scan_videos()
    return jsonify({'videos': videos, 'count': len(videos)})

@app.route('/generate-html', methods=['GET'])
def generate_html():
    """Generate HTML using BeautifulSoup"""
    videos = scan_videos()
    
    # Create HTML using BeautifulSoup
    soup = BeautifulSoup('<html><body></body></html>', 'html.parser')
    
    # Add head section
    head = soup.new_tag('head')
    title = soup.new_tag('title')
    title.string = 'Generated NFT Showcase'
    head.append(title)
    soup.html.insert(0, head)
    
    # Add body content
    body = soup.body
    
    # Add header
    header = soup.new_tag('header')
    h1 = soup.new_tag('h1')
    h1.string = 'NFT Showcase - Generated with BeautifulSoup'
    header.append(h1)
    body.append(header)
    
    # Add video gallery
    gallery = soup.new_tag('div', **{'class': 'video-gallery'})
    
    for video in videos:
        video_div = soup.new_tag('div', **{'class': 'video-item'})
        video_tag = soup.new_tag('video', **{
            'src': video['src'],
            'controls': '',
            'muted': '',
            'loop': ''
        })
        video_div.append(video_tag)
        gallery.append(video_div)
    
    body.append(gallery)
    
    # Save generated HTML
    with open('generated_showcase.html', 'w', encoding='utf-8') as f:
        f.write(str(soup.prettify()))
    
    return jsonify({
        'success': True,
        'message': 'HTML generated successfully',
        'filename': 'generated_showcase.html',
        'video_count': len(videos)
    })

@app.route('/admin/stats', methods=['GET'])
def admin_stats():
    """Admin panel for visitor statistics"""
    stats = get_visitor_statistics()
    recent_visitors = get_recent_visitors(20)
    total_unique = get_visitor_count()
    
    return render_template('admin_stats.html', 
                         stats=stats, 
                         recent_visitors=recent_visitors,
                         total_unique=total_unique)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
