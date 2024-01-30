from flask import Flask, request, jsonify, abort
import json
import os
from flask_cors import CORS
from collections import defaultdict

app = Flask(__name__)
CORS(app)
db_file = '../db.json'

def load_db():
    if os.path.exists(db_file):
        with open(db_file, 'r') as f:
            tasks = json.load(f)
        if not isinstance(tasks, dict):
            tasks = {'disponiveis': [], 'emAndamento': [], 'concluidas': [], 'jornadas': {}}
    else:
        tasks = {'disponiveis': [], 'emAndamento': [], 'concluidas': [], 'jornadas': {}}
    return tasks

def save_db(tasks):
    with open(db_file, 'w') as f:
        json.dump(tasks, f)

def validate_jornada_payload(payload):
    # Verificar se o payload contém pelo menos uma tarefa
    if 'tarefas' not in payload or not payload['tarefas']:
        abort(400, {'message': 'Uma jornada do herói deve ter pelo menos uma tarefa.'})


def initialize_tasks():
    tasks = load_db()
    return tasks if isinstance(tasks, dict) else {'disponiveis': [], 'emAndamento': [], 'concluidas': [], 'jornadas': {}}

@app.route('/', methods=['GET'])
def teste():
    return jsonify({'message': 'funciona'})

@app.route('/task', methods=['GET'])
def get_tasks():
    tasks = load_db()

    all_tasks_dict = defaultdict(list)

    for status, task_list in tasks.items():
        for task in task_list:
            if isinstance(task, dict):
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
    tasks['disponiveis'].append({'id': id, **data, 'status': 'disponiveis'})
    save_db(tasks)
    return jsonify({'message': 'Tarefa criada com sucesso!', 'id': id})

@app.route('/task/<id>', methods=['PUT'])
def update_task(id):
    tasks = load_db()
    data = request.get_json()

    # Verificar se é uma jornada
    if 'tarefas' in data:
        # Atualizar o nome da jornada, se fornecido
        novo_nome = data.get('novo_nome')
        if novo_nome:
            tasks['jornadas'][novo_nome] = tasks['jornadas'].pop(id, {'tarefas': []})
            save_db(tasks)
            return jsonify({'message': 'Jornada atualizada com sucesso!', 'nome_jornada': novo_nome})
        else:
            return jsonify({'message': 'Nome da jornada não fornecido!'}), 400
    else:
        # Verificar se é uma tarefa
        current_status = None
        for status, task_list in tasks.items():
            for task in task_list:
                if isinstance(task, dict) and task.get('id') == id:
                    current_status = status
                    break

        if current_status is not None:
            # Remover a tarefa da lista atual
            tasks[current_status] = [
                task for task in tasks[current_status] if task.get('id') != id]

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

# Rotas para Jornadas do Herói

@app.route('/jornadas', methods=['GET'])
def get_jornadas():
    tasks = load_db()
    return jsonify(tasks.get('jornadas', {}))

@app.route('/jornadas', methods=['POST'])
def criar_jornada():
    tasks = load_db()
    data = request.get_json()
    nome_jornada = data.get('nome')
    
    if nome_jornada:
        # Validar se a jornada tem pelo menos uma tarefa
        validate_jornada_payload(data)

        tasks['jornadas'][nome_jornada] = {'tarefas': data['tarefas']}
        save_db(tasks)
        return jsonify({'message': 'Jornada criada com sucesso!', 'nome_jornada': nome_jornada})
    else:
        return jsonify({'message': 'Nome da jornada não fornecido!'}), 400

@app.route('/jornadas/<nome_jornada>', methods=['PUT'])
def update_jornada(nome_jornada):
    tasks = load_db()
    data = request.get_json()

    if nome_jornada in tasks['jornadas']:
        tasks['jornadas'][nome_jornada] = {'tarefas': data.get('tarefas', [])}
        save_db(tasks)
        return jsonify({'message': f'Jornada {nome_jornada} atualizada com sucesso!', 'tarefas': data.get('tarefas', [])})
    else:
        return jsonify({'message': f'Jornada {nome_jornada} não encontrada!'}), 404

@app.route('/jornadas/<nome_jornada>', methods=['DELETE'])
def delete_jornada(nome_jornada):
    tasks = load_db()

    if nome_jornada in tasks['jornadas']:
        del tasks['jornadas'][nome_jornada]
        save_db(tasks)
        return jsonify({'message': f'Jornada {nome_jornada} excluída com sucesso!'})
    else:
        return jsonify({'message': f'Jornada {nome_jornada} não encontrada!'}), 404

@app.route('/jornadas/<nome_jornada>', methods=['GET'])
def get_jornada(nome_jornada):
    tasks = load_db()

    if 'jornadas' in tasks and nome_jornada in tasks['jornadas']:
        jornada = tasks['jornadas'][nome_jornada]
        return jsonify({'jornada': jornada})
    else:
        abort(404, {'message': 'Jornada não encontrada!'})

# ...

if __name__ == '__main__':
    app.run(debug=True)