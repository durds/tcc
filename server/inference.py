import numpy as np

U_L =   np.array([0,  100,  200,  300,  400,  500,  600,  700,  800,  900,  1000]) #Universo dos valores de Luminosidade
VL_L =  np.array([[1,  0.2,    0,    0,    0,    0,    0,    0,    0,    0,     0], #0 baixa
                   [0,  0.8,  0.2,    0,    0,    0,    0,    0,    0,    0,     0], #1 baixa media
                   [0,    0,  0.4,  0.8,  0.1,    0,    0,    0,    0,    0,     0], #2 baixa alta
                   [0,    0,    0,    0,  0.6,    1,  0.2,    0,    0,    0,     0], #3 media
                   [0,    0,    0,    0,    0,    0,  0.4,    0,  0.3,    0,     0], #4 alta baixa
                   [0,    0,    0,    0,    0,    0,    0,  0.8,  0.5,  0.8,     0], #5 alta media
                   [0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     1]]) #6 alta


U_V =  np.array([-10,   -8,   -6,   -4,   -2,   0,   2,   4,   6,   8,   10]) #Universo dos valores de Variação da Luminosidade
VL_V = np.array([[1,    0.8,  0.6,  0.2,   0,   0,   0,   0,   0,   0,    0], #0 alta p baixo
                 [0,      0,  0.2,  0.4,  0.6,   1, 0.8, 0.4, 0.2,   0,    0], #1 baixa
                 [0,      0,    0,    0,    0,   0,   0, 0.2, 0.6, 0.8,    1]])#2 alta p cima


U_A =  np.array([0,     25,     50,     75,   100,   125,   150,   175,   200,   225,   255]) #Universo dos valores de Ação(pwm)
VL_A = np.array([[1,    0.9,    0.8,    0.6,   0,     0,     0,     0,     0,      0,    0], #0 baixo
                 [0,    0.1,    0.2,    0.2,   0.4,   0.3,   0.1,     0,     0,      0,    0], #1 medio baixo
                 [0,      0,    0.1,    0.1,   0.2,   0.4,   0.4,   0.5,   0.4,    0.2,    0], #2 medio
                 [0,      0,      0,      0,     0,   0.1,   0.3,   0.4,   0.6,    0.7,  0.8], #3 medio alto
                 [0,      0,      0,      0,     0,     0,     0,   0.1,   0.3,    0.5,    1]]) #4 alto

#Base de Regras
BR = np.array([[0, 0, 4],
               [1, 0, 4],
               [2, 0, 4],
               [3, 0, 2],
               [4, 0, 0],
               [5, 0, 0],
               [6, 0, 0],

               [0, 1, 3],
               [1, 1, 3],
               [2, 1, 2],
               [3, 1, 2],
               [4, 1, 2],
               [5, 1, 1],
               [6, 1, 0],

               [0, 2, 4],
               [1, 2, 4],
               [2, 2, 3],
               [3, 2, 2],
               [4, 2, 1],
               [5, 2, 0],
               [6, 2, 0]])


# print(BR)
#
# print(VL_L)
# print(VL_V)
print(','.join(map(str, U_A)))
print()
for line in VL_A:
    print('[' + ','.join(map(str, line)) + ']')


R = []
for i in range(len(BR)):
    a = BR[i][0]
    b = BR[i][1]
    c = BR[i][2]

    #print(a,b,c)
    M = np.zeros((len(VL_L[0]), len(VL_V[0]), len(VL_A[0])))
    for x in range(len(VL_L[0])):
        for y in range(len(VL_V[0])):
            for z in range(len(VL_A[0])):
                M[y][x][z] = max(VL_L[a][x], VL_V[b][y], VL_A[c][z])

    MIN = np.zeros(( len(VL_L[0]), len(VL_V[0]) ))

    for x in range(len(VL_L[0])):
        for y in range(len(VL_V[0])):
                MIN[x][y] = min(M[x][y][:])

    MIN_AUX = MIN[:,~np.all(MIN == 0, axis=0)]

    R_AUX = np.transpose(MIN_AUX)
    MIN_R = R_AUX.min(0)
    #print(MIN_R)

    R.append(MIN_R)



R_OUT = np.matrix(R)

print(''.join(map(str,BR[0])))
k = 0
j = 20
while k < 21:
    print('"' + ''.join(map(str,BR[k])) + '":' + '[' + ','.join(map(str, R[j])) + '],')
    k = k + 1
    j = j - 1
