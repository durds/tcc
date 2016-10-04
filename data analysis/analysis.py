from pymongo import MongoClient
from datetime import datetime
import sys
import os

os.system('cls')
client = MongoClient('mongodb://localhost:27017/')

db = client['TCC']

readings = db[sys.argv[1]]
soma = 0
i = 0
hora = 0
length = readings.count()
print('------------------------------------------------------------------')
print("Numero de amostras: " + str(length))
print('------------------------------------------------------------------')
hora_inicial = readings.find()[0]['data']
print("Começo do experimento: " + str(hora_inicial))
hora_final = datetime.today()
print('------------------------------------------------------------------')
for readings in readings.find():
    soma = soma + readings['pwm']
    i = i + 1
    if i > length-1:
        hora_final = readings['data']
        break

print("Fnial do experimento:" + str(hora_final))
print('------------------------------------------------------------------')
avg_pwm = soma/i
deltatime = hora_final - hora_inicial


corrente_led = 0.020 #em A
avg_v = avg_pwm*0.0196
consumo_medio_com_economia = avg_v*corrente_led*deltatime.total_seconds()/3600

consumo_medio_sem_economia = 5*corrente_led*deltatime.total_seconds()/3600

economia_media = 100 - (consumo_medio_com_economia/consumo_medio_sem_economia)*100

kwh = 0.53122

custo_medio_com_economia = consumo_medio_com_economia*0.001*kwh
custo_medio_sem_economia = consumo_medio_sem_economia*0.001*kwh
economia_media_custo = 100 - (custo_medio_com_economia/custo_medio_sem_economia)*100

print("consumo médio em " + str(deltatime) +" horas com economia: " + str(round(consumo_medio_com_economia, 2)) + "Wh")
print('------------------------------------------------------------------')
print("consumo medio em "+ str(deltatime) +" horas sem economia: " + str(round(consumo_medio_sem_economia, 2))+ "Wh")
print('------------------------------------------------------------------')
print("economia media: " + str(round(economia_media,1)) + "%")
print('------------------------------------------------------------------')
print("custo médio do consumo com economia: " + "R$" + str(custo_medio_com_economia))
print('------------------------------------------------------------------')
print("custo médio do consumo sem economia: " + "R$" + str(custo_medio_sem_economia))
print('------------------------------------------------------------------')
print("economia media no custo do consumo: " + str(economia_media_custo) + "%")
print('------------------------------------------------------------------')
