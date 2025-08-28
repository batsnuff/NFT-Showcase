# NFT Showcase - Python Flask Application

This is a Python web application that recreates the original HTML-based NFT showcase website using Flask and BeautifulSoup.

## Features

- **Dynamic Video Loading**: Automatically scans the images directory for video files
- **BeautifulSoup Integration**: Uses BeautifulSoup for HTML generation and parsing
- **Flask Backend**: Modern Python web framework with RESTful API endpoints
- **Visitor Counter**: Tracks unique visitors with IP-based detection
- **Video Controls**: Play all, speed up, and reset functionality
- **Responsive Design**: Maintains the original CSS styling

## Project Structure

```
NFT-Showcase/
├── app.py                 # Main Flask application
├── video_scanner.py       # BeautifulSoup video scanner
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Jinja2 template
├── static/
│   ├── js/
│   │   └── script.js     # Updated JavaScript
│   ├── css/              # CSS files (copied from original)
│   └── images/           # Image and video files
└── README_PYTHON.md      # This file
```

## Installation

1. **Install Python 3.8+** if you haven't already
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

- `GET /` - Main page
- `POST /api/increment-counter` - Increment visitor counter
- `GET /api/get-counter` - Get current visitor count
- `POST /api/play-all` - Play all videos
- `POST /api/speed-up` - Speed up videos to 1.5x
- `POST /api/reset` - Reset all videos
- `GET /api/videos` - Get all video metadata
- `GET /generate-html` - Generate HTML using BeautifulSoup

## BeautifulSoup Integration

The application uses BeautifulSoup in several ways:

1. **Video Scanning**: Automatically discovers video files in the images directory
2. **HTML Generation**: Creates HTML content programmatically
3. **Template Processing**: Integrates with Flask's Jinja2 templating

## Video Scanner

The `video_scanner.py` script:

- Scans the `images/` directory recursively
- Identifies video files (.mp4, .avi, .mov, .wmv, .flv)
- Generates metadata for each video
- Creates a JSON file with video information
- Generates HTML using BeautifulSoup

## Customization

### Adding New Videos

Simply place video files in the `images/` directory or its subdirectories. The scanner will automatically detect them.

### Modifying Video Categories

Edit the `video_scanner.py` file to change how videos are categorized or add new video formats.

### Styling

The original CSS files are preserved in the `static/css/` directory. Modify them to change the appearance.

## Production Deployment

For production use:

1. **Use a production WSGI server** like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

2. **Set environment variables**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-secure-secret-key
   ```

3. **Use a database** instead of in-memory storage for visitor counts

4. **Configure reverse proxy** (nginx/Apache) for static files

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `app.py`
2. **Missing dependencies**: Run `pip install -r requirements.txt`
3. **Video not loading**: Check file paths and permissions

### Debug Mode

The application runs in debug mode by default. For production, set `debug=False` in `app.py`.

## Original vs Python Version

| Feature | Original HTML | Python Flask |
|---------|---------------|--------------|
| Static content | ✅ | ❌ |
| Dynamic video loading | ❌ | ✅ |
| BeautifulSoup integration | ❌ | ✅ |
| API endpoints | ❌ | ✅ |
| Server-side processing | ❌ | ✅ |
| Easy maintenance | ❌ | ✅ |

## License

This project maintains the same license as the original NFT showcase website.
