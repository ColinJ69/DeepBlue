from django.shortcuts import render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
import json
import base64
from rest_framework.response import Response

def main(request):
    
        
        
    return render(request, 'main.html')
    
        


@api_view(('POST','GET'))
@csrf_exempt
def get_question(request):
    print('connected')
    data = request.data 
    print(data)
    q = data['q']
    q = int(base64.b64decode(q))
    print(q)
    
    with open("C:/Users/johns/OneDrive/Documents/Desktop/Hack4ACause/Hack4ACause/main/questions.json") as file:
        data = json.load(file)
        
        response = data[q]
        s = json.dumps(response)
        hi = base64.b64encode(s.encode('utf-8'))
       
    return Response(hi)

