from django.shortcuts import render

# Create your views here.

from django.shortcuts import HttpResponse
from bofa.models import Img


def index(request):
    if request == "POST":
        img = Img(img_url=request.FILES.get('img'))
        img.save()
    return render(request, 'index.html')


def show(request):
    imgs = Img.objects.all()
    context = {
        'imgs': imgs
    }
    return render(request, 'show.html', context)


def swap(request):
    access = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    type = ["","education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]
    if request.method == 'POST':
        accessibility = request.POST['Accessibilty']
        ty = request.POST['Type']
        response = HttpResponse('/output/')

    return render(request, 'face-swap.html', {"access": access,"type": type})


def output(request):
    return render(request, 'output.html')