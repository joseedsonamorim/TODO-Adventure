import unittest
import json
from main import app

class TestApp(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        self.app = app.test_client()

    def test_get_journeys(self):
        # Testa a obtenção de jornadas
        response = self.app.get('/journeys')
        self.assertEqual(response.status_code, 200)
        journeys = json.loads(response.get_data(as_text=True))
        self.assertIsNotNone(journeys)

    def test_post_journey(self):
        # Dados para criar uma nova jornada
        new_journey_data = {
            "name": "New Journey",
            "missions": [
                {
                    "title": "First Mission",
                    "description": "Description of the first mission",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }

        # Cria uma nova jornada
        response = self.app.post('/journeys', json=new_journey_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Journey created successfully.')

    def test_update_journey(self):
        # Cria uma jornada para ser atualizada
        journey_data = {
            "name": "Journey to Update",
            "missions": [
                {
                    "title": "Initial Mission",
                    "description": "Description of the initial mission",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_response.status_code, 200)
        create_result = json.loads(create_response.get_data(as_text=True))
        self.assertEqual(create_result['message'], 'Journey created successfully.')
        journey_id = create_result['id']

        # Dados atualizados para a jornada
        updated_journey_data = {
            "name": "Updated Journey",
            "missions": [
                {
                    "title": "Updated Mission",
                    "description": "Description of the updated mission",
                    "runningTime": "01:00:00",
                    "difficulty": "Hard",
                    "status": "completed",
                    "deadline": "2023-12-15"
                }
            ]
        }

        # Atualiza a jornada
        response = self.app.put(f'/journeys/{journey_id}', json=updated_journey_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Journey updated successfully.')

    def test_create_mission(self):
        # Cria uma jornada
        journey_data = {
            "name": "Journey for Mission",
            "missions": [
                {
                    "title": "Initial Mission",
                    "description": "Description of the initial mission",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Dados da nova missão
        mission_data = {
            "title": "New Mission",
            "description": "Description of the new mission",
            "runningTime": "00:00:00",
            "difficulty": "Medium",
            "status": "available",
            "deadline": "2023-12-14"
        }

        # Adiciona uma nova missão à jornada
        response = self.app.post(f'/journeys/{journey_id}/missions', json=mission_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Mission created successfully.')

    def test_update_mission(self):
        # Cria uma jornada com uma missão para ser atualizada
        journey_data = {
            "name": "Journey for Mission Update",
            "missions": [
                {
                    "title": "Mission to Update",
                    "description": "Description of the mission to update",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Dados atualizados para a missão
        updated_mission_data = {
            "title": "Updated Mission",
            "description": "Description of the updated mission",
            "runningTime": "02:00:00",
            "difficulty": "Hard",
            "status": "completed",
            "deadline": "2023-12-16"
        }

        # Atualiza a missão
        response = self.app.put(f'/journeys/{journey_id}/missions/1', json=updated_mission_data)  # ID começa em 1
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Mission updated successfully.')

    def test_delete_mission(self):
        # Cria uma jornada com uma missão para ser excluída
        journey_data = {
            "name": "Journey for Mission Deletion",
            "missions": [
                {
                    "title": "Mission to Delete",
                    "description": "Description of the mission to delete",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Exclui a missão
        response = self.app.delete(f'/journeys/{journey_id}/missions/1')  # ID começa em 1
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Mission deleted successfully.')

    def test_set_setted_journey(self):
        # Cria uma jornada para ser setada
        journey_data = {
            "name": "Journey to Set",
            "missions": [
                {
                    "title": "Mission to Set",
                    "description": "Description of the mission to set",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Define a jornada como setada
        response = self.app.put(f'/setted_journey/{journey_id}')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], f'Setted journey with id {journey_id} successfully.')

    def test_get_setted_journey(self):
        # Cria uma jornada para ser setada e depois buscada
        journey_data = {
            "name": "Journey to Get",
            "missions": [
                {
                    "title": "Mission to Get",
                    "description": "Description of the mission to get",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Define a jornada como setada
        set_response = self.app.put(f'/setted_journey/{journey_id}')
        self.assertEqual(set_response.status_code, 200)

        # Obtém a jornada setada
        get_response = self.app.get('/setted_journey')
        self.assertEqual(get_response.status_code, 200)
        result = json.loads(get_response.get_data(as_text=True))
        self.assertEqual(result['id'], journey_id)

    def test_delete_journey(self):
        # Cria uma jornada para ser excluída
        journey_data = {
            "name": "Journey to Delete",
            "missions": [
                {
                    "title": "Mission to Delete",
                    "description": "Description of the mission to delete",
                    "runningTime": "00:00:00",
                    "difficulty": "Easy",
                    "status": "available",
                    "deadline": "2023-12-13"
                }
            ]
        }
        create_journey_response = self.app.post('/journeys', json=journey_data)
        self.assertEqual(create_journey_response.status_code, 200)
        journey_id = json.loads(create_journey_response.get_data(as_text=True))['id']

        # Exclui a jornada
        response = self.app.delete(f'/journeys/{journey_id}')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Journey deleted successfully.')

if __name__ == '__main__':
    unittest.main()
