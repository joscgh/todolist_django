moment.locale('es');
var now = $("#now").val();

function humanizeDate(date)
{
    var delta = Math.round((+new Date - date) / 1000);

    var minute = 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;

    var fuzzy;

    if (delta < 30) {
        fuzzy = 'just then.';
    } else if (delta < minute) {
        fuzzy = delta + ' seconds ago.';
    } else if (delta < 2 * minute) {
        fuzzy = 'a minute ago.'
    } else if (delta < hour) {
        fuzzy = Math.floor(delta / minute) + ' minutes ago.';
    } else if (Math.floor(delta / hour) == 1) {
        fuzzy = '1 hour ago.'
    } else if (delta < day) {
        fuzzy = Math.floor(delta / hour) + ' hours ago.';
    } else if (delta < day * 2) {
        fuzzy = 'yesterday';
    }
}

$(".tarea").hide();
$(document).ready(function(){
    $("#id_fecha_venc").datepicker({
        format:"yyyy-mm-dd",
        language: 'es',
        todayHighlight: true,
        todayBtn: true,
        startDate: moment(now).format("YYYY-MM-DD"),
    });
    $.get("list_tareas/", function(data){
        str = "";
        $.each(data,function(key,value){
            str += "<div class='custom-control custom-checkbox mb-1' title='Marcar como resuelta'>"+
                    "<input type='checkbox' class='custom-control-input' id='customCheck"+key+"' data-tarea='"+value.pk+"'>"+
                    "<label class='custom-control-label' for='customCheck"+key+"'>"+
                    "<span class=''>"+value.fields.nombre+"</span></label><span class='float-right text-muted'>"+moment(value.fields.fecha_venc).fromNow()+"</span></div>";
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

    $(document).on("click","input[type='checkbox']", function(){
        var id_tarea = $(this).data("tarea");
        $.get("check_tarea/"+id_tarea+"/", function(data){
            console.log(data);
            $.get("list_tareas/", function(data){
                    str = "";
                    $(".list-tareas").html("");
                    $.each(data,function(key,value){
                        str +=  "<div class='custom-control custom-checkbox mb-1' title='Marcar como resuelta'>"+
                                "<input type='checkbox' class='custom-control-input' id='customCheck"+key+"' data-tarea='"+value.pk+"'>"+
                                "<label class='custom-control-label' for='customCheck"+key+"'>"+
                                "<input type='checkbox' class='custom-control-input' />"+
                                "<span class=''>"+value.fields.nombre+"</span></label><span class='float-right text-muted'>"+moment(value.fields.fecha_venc).fromNow()+"</span></div>";
                    });
                    $(".list-tareas").html(str);
                });
        });
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
                    str = "";
                    $(".list-tareas").html("");
                    $.each(data,function(key,value){
                        str +=  "<div class='custom-control custom-checkbox mb-1'>"+
                                "<input type='checkbox' class='custom-control-input' id='customCheck"+key+"' data-tarea='"+value.pk+"'>"+
                                "<label class='custom-control-label' for='customCheck"+key+"'>"+
                                "<input type='checkbox' class='custom-control-input' />"+
                                "<span class=''>"+value.fields.nombre+"</span></label><span class='float-right text-muted'>"+moment(value.fields.fecha_venc).fromNow()+"</span></div>";
                    });
                    $(".list-tareas").html(str);
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