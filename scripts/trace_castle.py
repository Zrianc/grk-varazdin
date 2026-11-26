# Iscrtava obrise Starog grada iz fotografije: python3 scripts/trace_castle.py fotografija.png izlaz.json
import numpy as np, cv2, json, sys
SRC=sys.argv[1] if len(sys.argv)>1 else 'photo.png'
OUT=sys.argv[2] if len(sys.argv)>2 else 'castle.json'
img=cv2.imread(SRC); H,W=img.shape[:2]; print(W,H)
hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV).astype(int)
h,s,v=hsv[...,0],hsv[...,1],hsv[...,2]
X0,X1,GROUND=160,1232,590
# krovovi: narančasto-crveni
roof=((h<=16)|(h>=168))&(s>70)&(v>45)
roof[:, :X0]=False; roof[:, X1:]=False; roof[:230]=False; roof[480:]=False
roof=cv2.morphologyEx(roof.astype(np.uint8),cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
roof=cv2.morphologyEx(roof,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
# odbaci male mrlje (crijep kuća u daljini desno itd.)
n,lab,st,_=cv2.connectedComponentsWithStats(roof)
keep=np.zeros_like(roof)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]>800: keep[lab==i]=1
roof=keep
# silueta: od vrha krova do tla, po stupcima
castle=np.zeros((H,W),np.uint8)
tops={}
for x in range(X0,X1):
    ys=np.where(roof[:,x])[0]
    if len(ys): tops[x]=ys.min(); castle[ys.min():GROUND,x]=1
# stupci bez krova (zabat između krovova): visina prema nižem susjedu
xs=sorted(tops)
for x in range(xs[0],xs[-1]):
    if x not in tops:
        L=max(k for k in xs if k<x); R=min(k for k in xs if k>x)
        castle[max(tops[L],tops[R]):GROUND,x]=1
castle=cv2.morphologyEx(castle,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
# dimnjaci (ručno, koordinate fotografije)
for (x,y,w,hh) in [(281,364,11,24),(412,364,11,24),(724,372,14,20),(812,366,33,96),(872,357,13,26)]:
    castle[y:y+hh,x:x+w]=1
# prozori: tamne površine unutar zidova (ispod krova)
wall=castle.copy(); wall[roof>0]=0
green=(h>25)&(h<100)&(s>50)
dark=((v<100)&(wall>0)&(~green)).astype(np.uint8)
dark=cv2.morphologyEx(dark,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(dark)
wins=[]
for i in range(1,n):
    x,y,w,hh,a=st[i]
    if 70<a<3000 and 6<=w<=70 and 8<=hh<=110 and y+hh<545 and a/(w*hh)>0.5 and hh>=w*0.7:
        wins.append((int(x),int(y),int(w),int(hh)))
print('windows',len(wins))
def paths(mask,eps):
    mask=(cv2.GaussianBlur(mask.astype(np.float32),(9,9),0)>0.5).astype(np.uint8)
    cs,_=cv2.findContours(mask.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    out=[]
    for c in cs:
        if cv2.contourArea(c)<150: continue
        a=cv2.approxPolyDP(c,eps,True).reshape(-1,2)
        out.append('M'+' L'.join(f'{px} {py}' for px,py in a)+'Z')
    return out
outline=paths(castle,2.6)
roofs=paths(roof,2.6)
data={'outline':outline,'roofs':roofs,'windows':wins}
json.dump(data,open(OUT,'w'))
# kontrolni prikaz
prev=np.full((H,W,3),30,np.uint8)
prev[castle>0]=(40,40,170); prev[roof>0]=(60,60,230)
for (x,y,w,hh) in wins: cv2.rectangle(prev,(x,y),(x+w,y+hh),(255,255,255),-1)
cv2.imwrite(OUT.replace('.json','-preview.png'),np.hstack([img,prev]))
print('outline',len(outline),'roofs',len(roofs))
