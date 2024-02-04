import unittest
import json
from main import app

class TestApp(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        self.app = app.test_client()

    def test_get_tasks(self):
        # Testa a obtenção de tarefas
        response = self.app.get('/task')
        self.assertEqual(response.status_code, 200)
        tasks = json.loads(response.get_data(as_text=True))

    def test_criar_task(self):
        # Testa a criação de uma nova tarefa
        task_data = {
            "title": "Nova Tarefa",
            "description": "Descrição da nova tarefa",
            "deadline": "2023-12-31",
            "difficulty": "Média",
            "runningTime": "00:00:00"
        }

        response = self.app.post('/task', json=task_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Tarefa(s) criada(s) com sucesso!')

        # Verifica se a nova tarefa está presente no banco de dados
        response = self.app.get('/task')
        tasks = json.loads(response.get_data(as_text=True))
        self.assertIn(task_data['title'], [task['title'] for task in tasks['disponiveis']])

    def test_update_task(self):
      # Cria uma tarefa para ser atualizada
      task_data = {
          "title": "Tarefa para Atualizar",
          "description": "Descrição da tarefa para atualizar",
          "deadline": "2023-12-31",
          "difficulty": "Média",
          "runningTime": "00:00:00"
      }

      # Cria a tarefa
      create_response = self.app.post('/task', json=task_data)
      self.assertEqual(create_response.status_code, 200)
      create_result = json.loads(create_response.get_data(as_text=True))
      self.assertEqual(create_result['message'], 'Tarefa(s) criada(s) com sucesso!')

      # Obtém o ID da tarefa criada
      task_id_to_update = create_result['id']

      # Dados atualizados para a tarefa
      updated_task_data = {
          "title": "Tarefa Atualizada",
          "description": "Descrição atualizada da tarefa",
          "deadline": "2023-12-31",
          "difficulty": "Difícil",
          "status": "concluidas",
          "runningTime": "00:00:00"
      }

      # Atualiza a tarefa
      response = self.app.put(f'/task/{task_id_to_update}', json=updated_task_data)
      self.assertEqual(response.status_code, 200)
      result = json.loads(response.get_data(as_text=True))
      self.assertEqual(result['message'], 'Tarefa atualizada com sucesso!')

      # Verifica se a tarefa com o ID especificado foi atualizada no banco de dados
      get_response = self.app.get('/task')
      tasks = json.loads(get_response.get_data(as_text=True))
      updated_task = next((task for task in tasks['concluidas'] if task['id'] == task_id_to_update), None)
      self.assertIsNotNone(updated_task)
      self.assertEqual(updated_task['title'], updated_task_data['title'])

    def test_delete_task(self):
    # Cria uma tarefa para ser excluída
      task_data = {
          "title": "Tarefa para Excluir",
          "description": "Descrição da tarefa para excluir",
          "deadline": "2023-12-31",
          "difficulty": "Média",
          "status": "concluidas",
          "runningTime": "00:00:00"
      }

      # Cria a tarefa
      create_response = self.app.post('/task', json=task_data)
      self.assertEqual(create_response.status_code, 200)
      create_result = json.loads(create_response.get_data(as_text=True))
      self.assertEqual(create_result['message'], 'Tarefa(s) criada(s) com sucesso!')

      # Obtém o ID da tarefa criada
      task_id_to_delete = create_result['id']

      # Exclui a tarefa
      response = self.app.delete(f'/task/{task_id_to_delete}')
      self.assertEqual(response.status_code, 200)
      result = json.loads(response.get_data(as_text=True))
      self.assertEqual(result['message'], 'Tarefa excluída com sucesso!')

      # Verifica se a tarefa com o ID especificado foi excluída do banco de dados
      get_response = self.app.get('/task')
      tasks = json.loads(get_response.get_data(as_text=True))
      deleted_task = next((task for task in tasks['concluidas'] if task['id'] == task_id_to_delete), None)
      self.assertIsNone(deleted_task)

    def test_get_jornadas(self):
        # Testa a obtenção de jornadas
        response = self.app.get('/jornadas')
        self.assertEqual(response.status_code, 200)
        jornadas = json.loads(response.get_data(as_text=True))

    def test_criar_jornada(self):
        # Testa a criação de uma nova jornada
        jornada_data = {
            "nome": "Nova Jornada",
            "tarefas": [
                {
                    "title": "Início da Nova Jornada",
                    "description": "O herói começa uma nova jornada épica!",
                    "deadline": "2023-12-01",
                    "difficulty": "Fácil",
                    "status": "disponiveis"
                }
            ]
        }

        response = self.app.post('/jornadas', json=jornada_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], 'Jornada criada com sucesso!')

        # Verifica se a nova jornada está presente no banco de dados
        response = self.app.get('/jornadas')
        jornadas = json.loads(response.get_data(as_text=True))
        self.assertIn(jornada_data['nome'], jornadas)
        self.assertIsNotNone(jornadas[jornada_data['nome']])

    def test_update_jornada(self):
        # Cria uma jornada para ser atualizada
        jornada_data = {
            "nome": "Jornada para Atualizar",
            "tarefas": [
                {
                    "title": "Tarefa Inicial",
                    "description": "Descrição da tarefa inicial",
                    "deadline": "2023-12-01",
                    "difficulty": "Fácil",
                    "status": "disponiveis"
                }
            ]
        }

        # Cria a jornada
        create_response = self.app.post('/jornadas', json=jornada_data)
        self.assertEqual(create_response.status_code, 200)
        create_result = json.loads(create_response.get_data(as_text=True))
        self.assertEqual(create_result['message'], 'Jornada criada com sucesso!')

        # Obtém o nome da jornada criada
        jornada_name_to_update = create_result['nome_jornada']

        # Dados atualizados para a jornada
        updated_jornada_data = {
            "tarefas": [
                {
                    "title": "Nova Tarefa Épica",
                    "description": "Desafio adicional na jornada!",
                    "deadline": "2023-12-15",
                    "difficulty": "Difícil",
                    "status": "disponiveis"
                }
            ]
        }

        # Atualiza a jornada
        response = self.app.put(f'/jornadas/{jornada_name_to_update}', json=updated_jornada_data)
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], f'Jornada {jornada_name_to_update} atualizada com sucesso!')

        # Verifica se a jornada com o nome especificado foi atualizada no banco de dados
        get_response = self.app.get('/jornadas')
        jornadas = json.loads(get_response.get_data(as_text=True))
        updated_jornada = jornadas.get(jornada_name_to_update)
        self.assertIsNotNone(updated_jornada)
        self.assertEqual(updated_jornada['tarefas'][0]['title'], updated_jornada_data['tarefas'][0]['title'])


    def test_delete_jornada(self):
        # Cria uma jornada para ser excluída
        jornada_data = {
            "nome": "Jornada para Excluir",
            "tarefas": [
                {
                    "title": "Tarefa Inicial",
                    "description": "Descrição da tarefa inicial",
                    "deadline": "2023-12-01",
                    "difficulty": "Fácil",
                    "status": "disponiveis"
                }
            ]
        }

        # Cria a jornada
        create_response = self.app.post('/jornadas', json=jornada_data)
        self.assertEqual(create_response.status_code, 200)
        create_result = json.loads(create_response.get_data(as_text=True))
        self.assertEqual(create_result['message'], 'Jornada criada com sucesso!')

        # Obtém o nome da jornada criada
        jornada_name_to_delete = create_result['nome_jornada']

        # Exclui a jornada
        response = self.app.delete(f'/jornadas/{jornada_name_to_delete}')
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.get_data(as_text=True))
        self.assertEqual(result['message'], f'Jornada {jornada_name_to_delete} excluída com sucesso!')

        # Verifica se a jornada com o nome especificado foi excluída do banco de dados
        get_response = self.app.get('/jornadas')
        jornadas = json.loads(get_response.get_data(as_text=True))
        deleted_jornada = jornadas.get(jornada_name_to_delete)
        self.assertIsNone(deleted_jornada)


    def test_get_jornada(self):
      # Cria uma Jornada Uau para ser obtida
      jornada_data = {
          "nome": "Jornada Uau",
          "tarefas": [
              {
                  "title": "Tarefa Inicial",
                  "description": "Descrição da tarefa inicial",
                  "deadline": "2023-12-01",
                  "difficulty": "Fácil",
                  "status": "disponiveis"
              }
          ]
      }

      # Cria a jornada
      create_response = self.app.post('/jornadas', json=jornada_data)
      self.assertEqual(create_response.status_code, 200)
      create_result = json.loads(create_response.get_data(as_text=True))
      self.assertEqual(create_result['message'], 'Jornada criada com sucesso!')

      # Obtém o nome da jornada criada
      jornada_name_to_get = "Jornada Uau"

      # Testa a obtenção da jornada específica
      response = self.app.get(f'/jornadas/{jornada_name_to_get}')
      self.assertEqual(response.status_code, 200)
      jornada = json.loads(response.get_data(as_text=True))

      self.assertIn('jornada', jornada)
      self.assertEqual(jornada['jornada']['tarefas'], jornada_data['tarefas'])


if __name__ == '__main__':
    unittest.main()