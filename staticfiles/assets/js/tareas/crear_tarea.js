moment.locale("es");

$(".tarea").hide();
$(document).ready(function(){
    $("#id_fecha_venc").datepicker({
        format:"yyyy-mm-dd",
        language: 'es'
    });
    $.get("list_tareas/", function(data){
        str = "";
        $.each(data,function(key,value){
            str += "<span class=''>"+value.fields.nombre+"</span><span class='float-right text-muted'>"+value.fields.fecha_venc+"</span><br>";
        });
        $(".list-tareas").html(str);
    });
	$(".add_tarea").on("click",function(){
		$(".tarea").show();
		$(this).hide();
	});

	$(document).on("click",".cancelar", function(){
		$(".tarea").hide();
		$(".add_tarea").show();
	});

	$("#form-save-tarea").on("submit", function(e){
		e.preventDefault();
        if($("#id_tarea").val() != "" && $("#id_fecha_venc").val() != "")
		$.ajax({
        	url : "create_tarea/", // the endpoint
        	type : "POST", // http method
        	data : $(this).serialize(), // data sent with the post request

        	// handle a successful response
        	success : function(json) {
            	//$('#post-text').val(''); // remove the value from the input
            	//console.log(json); // log the returned json to the console
            	console.log("success"); // another sanity check
                $("#id_tarea, #id_fecha_venc").val("");
                $('#id_priori option:eq(0)').prop('selected', true)
                $(".tarea").hide();
                $(".add_tarea").show();
                
                $.get("list_tareas/", function(data){
                    console.log(data)
                });
        	},

        	// handle a non-successful response
        	error : function(xhr,errmsg,err) {
            	$('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
	                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
    	        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        	}
    	});
        else
            alert("Error!")
        return false;
	});
});