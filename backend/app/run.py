from app import create_app, db

# Create the Flask application
app = create_app()

# Create database tables
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)