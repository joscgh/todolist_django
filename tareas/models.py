from django.db import models

# Create your models here.
class tarea(models.Model):
	nombre = models.CharField(max_length=100)
	fecha_creado = models.DateField()
	fecha_venc = models.DateField()
	coment = models.CharField(max_length=300)
	priori = models.CharField(max_length=20)
	resuelta = models.BooleanField(default=False)
