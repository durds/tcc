from pymongo import MongoClient
import matplotlib.pyplot as plt
import matplotlib.dates as dts

client = MongoClient('mongodb://localhost:27017/')

db = client['TCC']

readings = db.readings
inputs = []
pwm = []
time = []
i = 0
for readings in readings.find():
    time.append(readings['data'])
    inputs.append(readings['reading'])
    pwm.append(readings['pwm'])


    i = i + 1
    #if i > 360:
    #    break

time_formated = dts.date2num(time)


plt.plot_date(time_formated, inputs, 'bo')
plt.plot_date(time, pwm, 'gs')
plt.gcf().autofmt_xdate()
plt.grid()

plt.show()
