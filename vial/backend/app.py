from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'  # change as needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/signIn', methods=['POST'])
def signIn():
    data = request.get_json()
    username = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'success': True, 'message': 'Logged in successfully!'})
    else:
        return jsonify({'success': False, 'message': 'Incorrect username or password'})

@app.route('/signUp', methods=['POST'])
def signUp():
    data = request.get_json()
    username = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'success': False, 'message': 'Username already exists!'})
    else:
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User created successfully!'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)