from flask import Flask, request, jsonify, abort
import json
import os
from flask_cors import CORS
from collections import defaultdict

app = Flask(__name__)
CORS(app)
db_file = 'db.json'

def load_db():
    if os.path.exists(db_file):
        with open(db_file, 'r') as f:
            tasks = json.load(f)
        if not isinstance(tasks, dict):
            tasks = {'disponiveis': [], 'emAndamento': [], 'concluidas': []}
    else:
        tasks = {'disponiveis': [], 'emAndamento': [], 'concluidas': []}
    return tasks

def save_db(tasks):
    with open(db_file, 'w') as f:
        json.dump(tasks, f)

def initialize_tasks():
    tasks = load_db()
    return tasks if isinstance(tasks, dict) else {'disponiveis': [], 'emAndamento': [], 'concluidas': []}

@app.route('/', methods=['GET'])
def teste():
    return jsonify({'message': 'funciona'})

@app.route('/task', methods=['GET'])
def get_tasks():
    tasks = load_db()

    all_tasks_dict = defaultdict(list)

    for status, task_list in tasks.items():
        for task in task_list:
            task_copy = task.copy()
            # Verificar se o campo 'status' existe e atualizá-lo
            task_copy['status'] = task_copy.get('status', status)
            all_tasks_dict[status].append(task_copy)

    # Converter o defaultdict para um dicionário padrão
    all_tasks = dict(all_tasks_dict)

    return jsonify(all_tasks)

@app.route('/task', methods=['POST'])
def criar_task():
    tasks = initialize_tasks()
    data = request.get_json()
    id = str(max(map(lambda x: int(x['id']), tasks.get('disponiveis', [])), default=0) + 1) if tasks.get('disponiveis') else '1'
    tasks['disponiveis'].append({'id': id, **data, 'status': 'disponível'})
    save_db(tasks)
    return jsonify({'message': 'Tarefa criada com sucesso!', 'id': id})

@app.route('/task/<id>', methods=['PUT'])
def update_task(id):
    tasks = load_db()
    data = request.get_json()

    # Encontrar o status atual da tarefa
    current_status = None
    for status, task_list in tasks.items():
        for task in task_list:
            if task.get('id') == id:
                current_status = status
                break

    if current_status is not None:
        # Remover a tarefa da lista atual
        tasks[current_status] = [
            task for task in tasks[current_status] if task['id'] != id]

        # Adicionar a tarefa à nova lista com os dados atualizados
        updated_task = {'id': id, **data, 'status': data['status']}
        tasks[data['status']].append(updated_task)

        save_db(tasks)
        return jsonify({'message': 'Tarefa atualizada com sucesso!', 'task': updated_task})
    else:
        return jsonify({'message': 'Tarefa não encontrada!'}), 404
@app.route('/task/<id>', methods=['DELETE'])
def delete_task(id):
    tasks = initialize_tasks()
    for status, task_list in tasks.items():
        for task in task_list:
            if task.get('id') == id:
                task_list.remove(task)
                save_db(tasks)
                return jsonify({'message': 'Tarefa excluída com sucesso!'})

    abort(404, {'message': 'Tarefa não encontrada!'})

if __name__ == '__main__':
    app.run(debug=True)