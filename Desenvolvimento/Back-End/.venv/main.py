from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)
db_file = 'db.json'

def load_db():
    if os.path.exists(db_file):
        with open(db_file, 'r') as f:
            tasks = json.load(f)
    else:
        tasks = {}
    return tasks

def save_db(tasks):
    with open(db_file, 'w') as f:
        json.dump(tasks, f)

@app.route('/', methods=['GET'])
def teste():
    return jsonify({'message' : 'funciona'})

@app.route('/task', methods=['GET'])
def get_tasks():
    tasks = load_db()
    return jsonify(tasks)

@app.route('/task', methods=['POST'])
def criar_task():
    tasks = load_db()
    data = request.get_json()
    id = str(max(map(int, tasks.keys())) + 1) if tasks else '1'
    tasks[id] = {'title': data['title'], 'description': data['description'], 'deadline': data['deadline'], 'difficulty': data['difficulty']}
    save_db(tasks)
    return jsonify({'message': 'Tarefa criada com sucesso!', 'id': id})

@app.route('/task/<id>', methods=['PUT'])
def update_task(id):
    tasks = load_db()
    data = request.get_json()
    if id in tasks:
        tasks[id] = {'title': data['title'], 'description': data['description'], 'deadline': data['deadline'], 'difficulty': data['difficulty']}
        save_db(tasks)
        return jsonify({'message': 'Tarefa atualizada com sucesso!'})
    else:
        return jsonify({'message': 'Tarefa não encontrada!'}), 404

@app.route('/task/<id>', methods=['DELETE'])
def delete_task(id):
    tasks = load_db()
    if id in tasks:
        del tasks[id]
        save_db(tasks)
        return jsonify({'message': 'Tarefa excluída com sucesso!'})
    else:
        return jsonify({'message': 'Tarefa não encontrada!'}), 404

if __name__ == '__main__':
    app.run(debug=True)