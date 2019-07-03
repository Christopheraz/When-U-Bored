# When-U-Bored

## Django Project for Code::Buffalo hackathon

### Team 12 <br>
Wenqi Li<br>
Xinguo Zhu<br>
Tingting Wang<br>
Nannan Zhai<br>

### Demo Link
https://youtu.be/rI9irzmHXio

## Programing Language

* Front-End
  - HTML
  - CSS
  - JavaScript
* Back-End
  - Python
  - Django

## Public API

- [Bored api](http://www.boredapi.com/)

  Let's find you something  to do !


- [Bing image search api](https://azure.microsoft.com/zh-cn/services/cognitive-services/bing-image-search-api/)


  Let's find some image satisfying requirements !

- [Merge Face](https://api-cn.faceplusplus.com/imagepp/v1/mergeface)

  Let's swap people's face and have fun!


- [Detect Face](https://api-cn.faceplusplus.com/facepp/v3/detect)


  Let's detect the human face from image!

## Getting Activity

- User sets requirements(accessibility, participants, price, type) in the web front-end
- Back-end gets requirements  by using  **POST/GET**
- Using function boreapi() to get the activity which satisfy the requirements from "Bored api" 

## Getting Picture of Swap-Face

- Sarting a GET request to Bing-image-search-api to get activity image by the keyword of activity from bored-api
- Asking user to upload one image with their front face inside
- Using the detect-face-api to detect face from both images
- Using the merge-face-api to swap the face form activity image to user image
