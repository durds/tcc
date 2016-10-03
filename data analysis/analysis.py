from pymongo import MongoClient
import matplotlib.pyplot as plt
import matplotlib.dates as dts

client = MongoClient('mongodb://localhost:27017/')

db = client['TCC']

readings = db.readings
soma = 0
i = 0
hora = 0
for readings in readings.find():
    soma = soma + readings['pwm']
    i = i + 1
    hora = readings['data']
    print(hora)
    if i > 10:
        break


avg_pwm = soma/i

consumo_medio_com_economia = avg_pwm*0.0196*0.020*8

consumo_medio_sem_economia = 5*0.020*8

economia_media = 100 - (consumo_medio_com_economia/consumo_medio_sem_economia)*100
print("consumo médio em 8 horas com economia: " + str(consumo_medio_com_economia))

print("consumo medio em 8 horas sem economia: " + str(consumo_medio_sem_economia))

print("economia media: " + str(economia_media) + "%")
