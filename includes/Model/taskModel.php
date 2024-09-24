<?php
include '../db.php';
class TaskModel extends DB{
    public function saveTask($nameTask,$dateTask,$statusTask){
		$queryinsert = $this->connect()->prepare("INSERT INTO tareas (nombre, status, fecha, eliminado) VALUES (:name, :status, :date, 0)");
        $queryinsert->bindParam(':name', $nameTask);
        $queryinsert->bindParam(':status', $statusTask);
        $queryinsert->bindParam(':date', $dateTask);
        if($queryinsert->execute() === true){
            echo json_encode([
                'error' => false,
                'message' => 'Tarea almacenada de manera exitosa'
            ]);
        }else{
            echo json_encode([
                'error' => true,
                'message' => 'Error: '+$queryinsert->errorInfo()
            ]);
        }
	}

    public function updateTask($statusTask,$idTask){
        $query = $this->connect()->prepare("SELECT status FROM tareas WHERE id  = :id");
        $query->bindParam(':id', $idTask);
		$query->execute();
		$result = $query->fetch(PDO::FETCH_ASSOC);
        $currentStatus = $result['status'];
        if($currentStatus === 1){
            $fechaActual = date('Y-m-d H:i:s');
            $queryinsert = $this->connect()->prepare("UPDATE tareas SET status = :status, fechaupdate = :fechaactual WHERE id = :idtask");
            $queryinsert->bindParam(':idtask', $idTask);
            $queryinsert->bindParam(':status', $statusTask);
            $queryinsert->bindParam(':fechaactual', $fechaActual);
            if($queryinsert->execute() === true){
                echo json_encode([
                    'error' => false,
                    'message' => 'Tarea actualizada de manera exitosa.'
                ]);
            }else{
                echo json_encode([
                    'error' => true,
                    'message' => 'Error: '+$queryinsert->errorInfo()
                ]);
            }
        }else{
            if(intval($currentStatus) === intval($statusTask)){
                echo json_encode([
                    'error' => true,
                    'message' => 'Error: La tarea ya se encuentra en el estado seleccionado.'
                ]);
            }else{
                echo json_encode([
                    'error' => true,
                    'message' => 'Error: no se puede cambiar el estado de la tarea cuando es diferente de Pendiente.'
                ]);
            }
        }
	}

    public function viewTask(){
		$query = $this->connect()->prepare("SELECT e.*, t.* FROM tareas as t, estados as e WHERE e.id = t.status AND t.eliminado = 0 ORDER BY nombre ASC");
		$query->execute();
		echo json_encode($query->fetchAll());
	}

    public function consultaTask($consultaTask){
		$query = $this->connect()->prepare("SELECT * FROM tareas WHERE id  = :id ORDER BY nombre ASC");
        $query->bindParam(':id', $consultaTask);
		$query->execute();
		echo json_encode($query->fetchAll());
	}

    public function viewStatus(){
		$query = $this->connect()->prepare("SELECT * FROM estados ORDER BY id ASC");
		$query->execute();
		echo json_encode($query->fetchAll());
	}

    public function deleteTask($deleteTask){
        $fechaActual = date('Y-m-d H:i:s');
        $estado = 1;
        $queryinsert = $this->connect()->prepare("UPDATE tareas SET eliminado = :delete, fechaupdate = :fechaactual WHERE id = :idtask");
        $queryinsert->bindParam(':delete', $estado);
        $queryinsert->bindParam(':fechaactual', $fechaActual);
        $queryinsert->bindParam(':idtask', $deleteTask);
        if($queryinsert->execute() === true){
            echo json_encode([
                'error' => false,
                'message' => 'Tarea eliminada de manera exitosa.'
            ]);
        }else{
            echo json_encode([
                'error' => true,
                'message' => 'Error: '+$queryinsert->errorInfo()
            ]);
        }
	}
}