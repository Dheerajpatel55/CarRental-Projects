'''check wheteher a number is prime or not'''
def fun(n):
    for i in range(2,n):
        if(n%i==0):
            print("not prime")
            break
    else:
        print("prime") 
n=int(input())
fun(n)