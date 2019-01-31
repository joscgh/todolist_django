from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import tarea
import datetime
import json
from django.http import HttpResponse, JsonResponse
from django.core import serializers

# Create your views here.
@login_required(login_url='accounts/login')
def index(request):
	return render(request, 'tareas/index.html', status=200)

def create_tarea(request):
	now = datetime.datetime.now()

	if request.method == 'POST':
		nom_tarea = request.POST['tarea']
		print(request.POST['tarea'])
		response_data = {}
		tarea_obj = tarea(nombre=nom_tarea, fecha_creado=now, fecha_venc=request.POST['fecha_venc'], coment='comment',priori=request.POST['priori'])
		tarea_obj.save()
		response_data['result'] = 'Create post successful!'
		response_data['tareapk'] = tarea_obj.pk
		response_data['tarea'] = tarea_obj.nombre
		#response_data['creado'] = tarea_obj.created.strftime('%B %d, %Y %I:%M %p')
		return HttpResponse(json.dumps(response_data),content_type="application/json")
	else:
		return HttpResponse(json.dumps({"nothing to see": "this isn't happening"}),content_type="application/json")

def list_tareas(request):
	data = serializers.serialize("json", list(tarea.objects.all()))
	return HttpResponse(data,content_type="application/json")
