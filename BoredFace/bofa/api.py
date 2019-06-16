import requests, simplejson, json, base64, http.client, urllib.request, urllib.parse, urllib.error

# boreapi()
# inputs: [participants_(int, 参与人数，可选参数，默认为1)，   
#         [price_（float, 活动费用，可选参数，默认为0.1，
#         [type_(string, 活动类型，可选参数，默认为’recreational‘)
# output: activity(string, 活动名称) or 'error'表明可选参数设置有问题
def boreapi(participants_=0, price_=1, type_='recreational'):
    para = {}
    para['type'] = type_
    if participants_!=0:
        para['participants'] = participants_
    if price_!=1:
        para['price'] = price_
    params = urllib.parse.urlencode(para)
    activity = ''
    conn = http.client.HTTPConnection('www.boredapi.com')
    conn.request("GET", "/api/activity?%s" % params)
    response = conn.getresponse()
    bytes_ = response.read()
    str_ = str(bytes_, 'utf-8')
    json_ = json.loads(str_)
    if (len(json_)<=1):
        return 'error'
    activity = json_['activity']
    conn.close()
    return activity


# getpicture(query)
# inputs: query(string, 活动名称，必要参数)，   
#         [face（bool, query是否添加’face‘关键字，可选参数，默认为True）
# output: pictureUrl(string, 图像URL地址)
def getpicture(query, face=True):
    headers = {
        'Ocp-Apim-Subscription-Key': '54f1b0073c4242c0a501074a3d79fd1b',
    }
    if face:
        query +=', front face'
    # print(query)
    params = urllib.parse.urlencode({
        'q': query,
        'count': '20',
        'offset': '0',
        'mkt': 'en-us',
        'safeSearch': 'Moderate',
    })
    pictureUrl = ''
    try:
        conn = http.client.HTTPSConnection('api.cognitive.microsoft.com')
        conn.request("GET", "/bing/v7.0/images/search?%s" % params, "{body}", headers)
        response = conn.getresponse()
        bytes_ = response.read()
        str_ = str(bytes_, 'utf-8')
        json_ = json.loads(str_)
        index = 0
        while json_['value'][index]['encodingFormat'] != 'jpeg':
            index+=1
        pictureUrl = json_['value'][index]['contentUrl']
        conn.close()
        return pictureUrl
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

# find_face(imgpath)
# inputs: imgpath(string, 图片url, 必要参数)，   
# output: rectangle(dict, face的边框) or 'error'表明没有人脸
def find_face(imgpath):
    http_url = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
    data = {"api_key": 'A5PgRcaWH5gocJ5N7cBfQKh3ZWuvh0_l',
            "api_secret": '1g5NHY7ZFVhy7oxEkf3qZZnh_3xOe0bT', "image_url": imgpath, "return_landmark": 1}
    files = {"image_url": imgpath}
    response = requests.post(http_url, data=data, files=files)
    req_con = response.content.decode('utf-8')
    req_dict = json.JSONDecoder().decode(req_con)
    this_json = simplejson.dumps(req_dict)
    this_json2 = simplejson.loads(this_json)
    if len(this_json2)<=3:
        return 'error'
    faces = this_json2['faces']
    if len(faces)==0:
        return 'error'
    else:
        list0 = faces[0]
        rectangle = list0['face_rectangle']
        return rectangle

# faceswap(templateImg,userImg,number)
# inputs: templateImg(string, 模板图片URL, 必要参数)，   
#         userImg(string, 用户图片URL, 必要参数)
#         [number(int, 融合系数，可选参数，默认为90)
# output: status(int 表明融合情况： 0->融合失败； 1->融合成功)
#         imgdata(base64, 融合图片), 融合成功 or templateImg(string) 如果融合不成功则返回getpicture()所获得的图片URL
def faceswap(templateImg,userImg,number=90):
    ff1 = find_face(templateImg)
    if ff1=='error':
        # print('no face in template image!')
        return (0, templateImg)
    ff2 = find_face(userImg)
    if ff2=='error':
        # print('no face in user image!')
        return (0, templateImg)

    rectangle1 = str(ff1['top']) + "," + str(ff1['left']) + "," + str(ff1['width']) + "," + str(ff1['height'])
    rectangle2 = str(ff2['top']) + "," + str(ff2['left']) + "," + str(ff2['width']) + "," + str(ff2['height'])

    url_add = "https://api-cn.faceplusplus.com/imagepp/v1/mergeface"
    data = {"api_key": 'A5PgRcaWH5gocJ5N7cBfQKh3ZWuvh0_l', "api_secret": '1g5NHY7ZFVhy7oxEkf3qZZnh_3xOe0bT',
            "template_url": templateImg, "template_rectangle": rectangle1,
            "merge_url": userImg, "merge_rectangle": rectangle2, "merge_rate": number}
    response = requests.post(url_add, data=data)
    req_con = response.content.decode('utf-8')
    req_dict = json.JSONDecoder().decode(req_con)
    result = req_dict['result']
    imgdata = base64.b64decode(result)
    return (1, imgdata)

#--------------------------------------------------

# get activity
activity = boreapi(participants_=2, price_=0.1)
# find templateImg
templateImg = getpicture(activity, face=True)
# 由于搜索出来的图片基本很难融合，所以如果想看融合效果，直接把下面的注释去掉
# templateImg = "http://dehayf5mhw1h7.cloudfront.net/wp-content/uploads/sites/470/2015/10/23122001/CommonMan.jpg" #男人正脸
# user image
userImg = "http://www.publicdomainpictures.net/pictures/30000/velka/smiling-woman-behind-board.jpg" #女人正脸
#final swap image
image = r'./merge.jpg'
result = faceswap(templateImg, userImg)

if result[0]==1:
    #如果融合成功，则保存图片
    file = open(image, 'wb')
    file.write(result[1])
    file.close()
    print('activity: %s, merge success!'%activity)
else:
    print('activity: '+str(activity)+', merge fail, templateImg: '+str(result[1]))

