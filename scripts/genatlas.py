width = 128
height = 3984
texture_width = 16
texture_height = 16
out = '../img/mapchip.json'
name = 'mapchip'
ext = '.png'

x_num = int(width / texture_width)
y_num = int(height / texture_height)

num = x_num * y_num

text = '{\n' + ',\n'.join([
'  "{}{}{}":{{\n    "frame":{{"x":{},"y":{},"w":{},"h":{}}},\n    "rotated":false,\n    "trimmed":false,\n    "spriteSourceSize":{{"x":0,"y":0,"w":{},"h":{}}},\n    "sourceSize":{{"w":{},"h":{}}},\n    "pivot":{{"x":0.5,"y":0.5}}\n  }}'.format(name, i, ext, (i % x_num) * texture_width, int(i / x_num) * texture_height, texture_width, texture_height, texture_width, texture_height, texture_width, texture_height) for i in range(num)
]) + '\n}\n'
with open(out, 'w') as f:
    f.write(text)
