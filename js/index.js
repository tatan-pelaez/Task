$(document).ready(function(){
    $('#divfechaactualizacion').hide();
    $('#diveliminar').hide();
    viewTask();
    viewStatus();
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    $('#fecha').val(year + '-' + month + '-' + day);
    $(document).on('click', '#btntarea', function(event){
        if($('#nombre').val() === ''){
            $('#nombre').focus();
            return;
        }
        if($('#fecha').val() === ''){
            $('#fecha').focus();
            return;
        }
        if($('#estadotarea').val() === ''){
            $('#estadotarea').focus();
            return;
        }
		$.ajax({
            url:'includes/controller/taskController.php',
            cache: false,
            method: "POST",
            data:  {
                "nameTask" : $('#nombre').val(),
                "dateTask" : $('#fecha').val(),
                "statusTask" : $('#estadotarea').val(),
                "idTask" : $('#id').val(),
            },
            dataType: 'json',
            success:function(response){
                if(!response.error){
                    alert(response.message, 'success');
                    clearform();
                    viewTask();
                }else{
                    alert(response.message, 'danger');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error); // Captura de errores
            }
	    });
    });
    $(document).on('click','#cleartask', function(event){
        clearform();
    });
    $(document).on('click','#deletetask', function(event){
        if($('#id').val() === ''){
            alert('Error en el proceso', 'danger');
            return;
        }
        $.ajax({
            url:'includes/controller/taskController.php',
            cache: false,
            method: "POST",
            data:  {
                "deleteTask" : $('#id').val(),
            },
            dataType: 'json',
            success:function(response){
                if(!response.error){
                    alert(response.message, 'success');
                    clearform();
                    viewTask();
                }else{
                    alert(response.message, 'danger');
                }
            }
	    });
    });
    $('#listTask').on('click', 'li', function(){
        $('#diveliminar').show();
        $('#estadotarea').prop('disabled',false);
    $.ajax({
        url:'includes/controller/taskController.php',
        cache: false,
        method: "POST",
        data:  {
          "consultaTask" : $(this).data('idtask'),
        },
        dataType: 'json',
        success:function(response){
            $('#nombre').prop('disabled',true);
            $('#fecha').prop('disabled',true);
            $('#nombre').val(response[0].nombre);
            $('#fecha').val(response[0].fecha);
            $('#estadotarea').val(response[0].status);
            $('#id').val(response[0].id);
            if(response[0].status === 1){
                $('#fechaactualizacion').val('');
            }else{
                $('#fechaactualizacion').val(response[0].fechaupdate);
            }
            verificarStatus(response[0].status);
        }
    });
    })
    $(document).on('click','#exportTaskCsv', function(event){
        $.ajax({
            url:'includes/controller/taskController.php',
            cache: false,
            method: "POST",
            data:  {
              "metodo" : "Consultar",
            },
            dataType: 'json',
            success:function(response){
                exportToCsv(response, "Task.csv");
            }
        });
    });
    $(document).on('click','#exportTaskXlsx', function(event){
        $.ajax({
            url:'includes/controller/taskController.php',
            cache: false,
            method: "POST",
            data:  {
              "metodo" : "Consultar",
            },
            dataType: 'json',
            success:function(response){
                console.log(response)
                const filteredData = response.map(item => {
                    return {
                        Código: item.id,
                        Estado: item.estado,
                        Tarea: item.nombre,
                        Fecha_Creacion: item.fecha,
                        Fecha_Actualizacion: item.fechaupdate
                    };
                });
                exportToXlsx(filteredData, "Task.xlsx");
            }
        });
    });
    
});

function alert(message, type) {
    var alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    var wrapper = document.createElement('div')
    wrapper.innerHTML = `
                <div class="alert alert-${type} alert-dismissible" role="alert">
                    ${message}
                    <button type="button" id="btncerrar" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
    alertPlaceholder.append(wrapper)

    $(document).on('click', '#btncerrar', function(event){
        $('#liveAlertPlaceholder').empty();
    });
}

function viewTask(){
    $('#listTask').empty();
    $.ajax({
        url:'includes/controller/taskController.php',
        cache: false,
        method: "POST",
        data:  {
          "metodo" : "Consultar",
        },
        dataType: 'json',
        success:function(response){
            response.forEach(element => {
                var lista = '<li data-idtask="'+element.id+'" class="list-group-item px-0 border-bottom" style="cursor: pointer">'+
                                '<div class="d-flex justify-content-between align-items-start">'+
                                    '<div class="ms-2 me-auto">'+
                                        '<div class="name_room"><label class="fw-bold">Nombre de la Tarea:</label> '+element.nombre+'</div>'+
                                        '<label class="la_room"><label class="fw-bold">Fecha Creación:</label> '+element.fecha+'</label>'+
                                    '</div>'+
                                    '<span class="badge bg-primary">'+element.estado+'</span>'+
                                '</div>'+
                            '</li>';
                $('#listTask').append(lista);
            });
        }
    });
}

function viewStatus() {
    $('#estadotarea').empty();
    $.ajax({
        url: 'includes/Controller/taskController.php',
        cache: false,
        method: "POST",
        data: {
            "metodo": "Estados",
        },
        dataType: 'json',
        success: function(response) {
            response.forEach(element => {
                $('#estadotarea').append('<option value="'+element.id+'">'+element.estado+'</option>');
            });
            verificarStatus(1);
        }
    });
}

function clearform(){
    $('#diveliminar').hide();
    $('#divfechaactualizacion').hide();
    $('#fechaactualizacion').val('');
    $('#nombre').prop('disabled',false);
    $('#fecha').prop('disabled',false);
    $('#nombre').val('');
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    $('#fecha').val(year + '-' + month + '-' + day);
    $('#id').val('');
    verificarStatus(1);
}

function verificarStatus(estado){
    const idValue = $('#id').val();
    const select = $('#estadotarea');
    if (idValue === '') {
        select.find('option').prop('disabled', false);
        select.find('option').filter(function() {
            return $(this).val() !== String(estado);
        }).prop('disabled', true);
        select.find('option').filter(function() {
            return $(this).text() === 'Pendiente';
        }).prop('selected', true);
    } else {
        if(estado === 1){
            $('#divfechaactualizacion').hide();
            $('#estadotarea').prop('disabled',false);
            select.find('option').prop('disabled', false);
            select.find('option:contains("Pendiente")').prop('disabled', true);
            select.find('option').filter(function() {
                return $(this).text() === 'Realizada';
            }).prop('selected', true);
        }else if(estado === 3 || estado === 2){
            $('#divfechaactualizacion').show();
            select.find('option').prop('disabled', false);
            select.find('option').filter(function() {
                return $(this).val() !== String(estado);
            }).prop('disabled', true);
        }
        
    }
}

function exportToCsv(data, filename) {
    const csvRows = [];
    const headers = ['Codigo', 'Estado', 'Tarea', 'Fecha_Creacion', 'Fecha_Actualizacion'];
    csvRows.push(headers.join(','));
    data.forEach(item => {
        const row = [
            item.id,
            item.estado,
            item.nombre,
            item.fecha,
            item.eliminado,
            item.fechaupdate
        ];
        csvRows.push(row.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
}

function exportToXlsx(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data, {
        header: ['Código', 'Estado', 'Tarea', 'Fecha_Creacion', 'Fecha_Actualizacion']
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tareas');

    XLSX.writeFile(wb, filename);
}