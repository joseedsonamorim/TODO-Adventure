from flask import Flask, request, jsonify, abort
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db_file = './db.json'

def load_db():
    if os.path.exists(db_file):
        with open(db_file, 'r') as f:
            data = json.load(f)
    else:
        data = {'journeys': [], 'setted_journey': None}
    return data

def save_db(data):
    with open(db_file, 'w') as f:
        json.dump(data, f)

def get_next_id(entity_list):
    if not entity_list:
        return '1'
    else:
        return str(int(max(entity_list, key=lambda x: int(x['id']))['id']) + 1)

@app.route('/journeys', methods=['GET'])
def get_journeys():
    data = load_db()
    return jsonify(data['journeys'])

@app.route('/journeys', methods=['POST'])
def post_journey():
    data = load_db()
    new_journey = request.get_json()
    if 'missions' not in new_journey or len(new_journey['missions']) == 0:
        return jsonify({'message': 'A journey must have at least one mission.'}), 400

    new_journey['id'] = get_next_id(data['journeys'])

    # Atribuir IDs incrementais para as missões
    i = 1
    for mission in new_journey['missions']:
        mission['id'] = str(i)
        i+=i

    data['journeys'].append(new_journey)
    save_db(data)
    return jsonify({'message': 'Journey created successfully.', 'id': new_journey['id']})

@app.route('/journeys/<journey_id>', methods=['PUT'])
def update_journey(journey_id):
    data = load_db()
    updated_journey = request.get_json()
    for journey in data['journeys']:
        if journey['id'] == journey_id:
            journey.update(updated_journey)
            save_db(data)
            return jsonify({'message': 'Journey updated successfully.'})
    return jsonify({'message': 'Journey not found.'}), 404

@app.route('/journeys/<journey_id>', methods=['DELETE'])
def delete_journey(journey_id):
    data = load_db()
    for journey in data['journeys']:
        if journey['id'] == journey_id:
            data['journeys'].remove(journey)
            save_db(data)
            return jsonify({'message': 'Journey deleted successfully.'})
    return jsonify({'message': 'Journey not found.'}), 404

@app.route('/journeys/<journey_id>/missions', methods=['POST'])
def create_mission(journey_id):
    data = load_db()
    new_mission = request.get_json()
    for journey in data['journeys']:
        if journey['id'] == journey_id:
            new_mission['id'] = get_next_id(journey['missions'])
            journey['missions'].append(new_mission)
            save_db(data)
            return jsonify({'message': 'Mission created successfully.', 'id': new_mission['id']})
    return jsonify({'message': 'Journey not found.'}), 404

@app.route('/journeys/<journey_id>/missions/<mission_id>', methods=['PUT'])
def update_mission(journey_id, mission_id):
    data = load_db()
    updated_mission = request.get_json()
    for journey in data['journeys']:
        if journey['id'] == journey_id:
            for mission in journey['missions']:
                if mission['id'] == mission_id:
                    mission.update(updated_mission)
                    save_db(data)
                    return jsonify({'message': 'Mission updated successfully.'})
            return jsonify({'message': 'Mission not found.'}), 404
    return jsonify({'message': 'Journey not found.'}), 404

@app.route('/journeys/<journey_id>/missions/<mission_id>', methods=['DELETE'])
def delete_mission(journey_id, mission_id):
    data = load_db()
    for journey in data['journeys']:
        if journey['id'] == journey_id:
            for mission in journey['missions']:
                if mission['id'] == mission_id:
                    journey['missions'].remove(mission)
                    save_db(data)
                    return jsonify({'message': 'Mission deleted successfully.'})
            return jsonify({'message': 'Mission not found.'}), 404
    return jsonify({'message': 'Journey not found.'}), 404

@app.route('/setted_journey', methods=['GET'])
def get_setted_journey():
    data = load_db()
    setted_journey_id = data.get('setted_journey')
    if setted_journey_id is None:
        return jsonify({'message': 'No setted journey found.'}), 404

    for journey in data['journeys']:
        if journey['id'] == setted_journey_id:
            return jsonify(journey)

    return jsonify({'message': 'Setted journey not found.'}), 404

@app.route('/setted_journey/<journey_id>', methods=['PUT'])
def set_setted_journey(journey_id):
    data = load_db()
    journey_ids = [journey['id'] for journey in data['journeys']]

    if journey_id not in journey_ids:
        return jsonify({'message': 'Journey not found.'}), 404

    data['setted_journey'] = journey_id
    save_db(data)
    return jsonify({'message': f'Setted journey with id {journey_id} successfully.'})

if __name__ == '__main__':
    app.run(debug=True)
