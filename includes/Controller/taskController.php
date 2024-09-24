<?php
include '../Model/taskModel.php';

class TaskController{

    public function saveTask($nameTask,$dateTask,$statusTask){
        $model = new taskModel();
        return $model->saveTask($nameTask,$dateTask,$statusTask);
    }

    public function updateTask($statusTask,$idTask){
        $model = new taskModel();
        return $model->updateTask($statusTask,$idTask);
    }

    public function viewTask(){
        $model = new taskModel();
        return $model->viewTask();
    }

    public function viewStatus(){
        $model = new taskModel();
        return $model->viewStatus();
    }

    public function consultaTask($consultaTask){
        $model = new taskModel();
        return $model->consultaTask($consultaTask);
    }

    public function deleteTask($deleteTask){
        $model = new taskModel();
        return $model->deleteTask($deleteTask);
    }
}


if(isset($_POST['nameTask'])){
	$nameTask = $_POST['nameTask'];
	$dateTask = $_POST['dateTask'];
	$statusTask = $_POST['statusTask'];
	$idTask = $_POST['idTask'];
    $taskControl = new TaskController();
    if($idTask == ''){
        $taskControl-> saveTask($nameTask,$dateTask,$statusTask);
    }else{
        if($statusTask === '1'){
            echo json_encode([
                'error' => true,
                'message' => 'Error: La tarea no puede quedar en estado Pendiente'
            ]);
        }else{
            $taskControl-> updateTask($statusTask,$idTask);
        }
    }
    
}

if(isset($_POST['metodo'])){
    $metodo = $_POST['metodo'];
    $taskControl = new TaskController();
    if($metodo == 'Consultar'){
        $taskControl-> viewTask();
    }elseif($metodo == 'Estados'){
        $taskControl-> viewStatus();
    }
}

if(isset($_POST['consultaTask'])){
    $consultaTask = $_POST['consultaTask'];
    $taskControl = new TaskController();
    $taskControl-> consultaTask($consultaTask);
}

if(isset($_POST['deleteTask'])){
    $deleteTask = $_POST['deleteTask'];
    $taskControl = new TaskController();
    $taskControl-> deleteTask($deleteTask);
}