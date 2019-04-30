/**
 * Space Fighter
 */

var input = {}
var xRotation = 0
var yRotation = 0
var bulvars = [{}]
var monsters = []
var stars = Array(320).fill(0)
var cX,sX,cY,sY,go,fr=0
var cZ = Math.cos(-0.37)
var sZ = Math.sin(-0.37)

setInterval(() => {
    if(go)return
    if (++fr % 160 == 0) monsters.push({
        o: Math.random() * Math.PI * 2,
        p: 302,
        x: 302,
        y: 222
    })
    var coverAlpha = '1'
    if (input[37] || input[39]) {
        var dir = input[37] ? -1 : 1
        coverAlpha = '3'
        if (yRotation < 0.5 && yRotation > -0.5) yRotation -= (0.03 * dir)
        xRotation += (0.05 * dir)
    }
    else {
        yRotation = yRotation * 0.95
    }
    c.fillStyle= '#011' + coverAlpha
    c.fillRect(0,0,640,480)

    sX = Math.sin(xRotation)
    cX = Math.cos(xRotation)
    sY = Math.sin(yRotation)
    cY = Math.cos(yRotation)

    c.fillStyle='#fff'
    stars=stars.map((star) => {
        if (!star) {
            star = {
                x: -320 + Math.random() * 1280,
                y: -320 + Math.random() * 800,
                s: Math.random() * 0.32
            }
        }
        star.x -= (sX * star.s)
        star.y += (cX * star.s)
        c.fillRect(star.x, star.y, 2, 2)
        return star
    })

    var points = [0,-1,0,-0.9,1,0,0.9,1,0,0,0.4,-0.25,0,0.4,-0.75]

    ;[
        0, 1, 4, '#fff',
        0, 2, 4, '#aaa',
        2, 4, 3, '#f82',
        1, 4, 3, '#fa2'
    ].map((face, u, faces) => {
        c.beginPath()

        for (var i = 0; i < 3; i++) { 
            var px = points[faces[u*4+i] * 3]
            var py = points[faces[u*4+i] * 3 + 1]
            var pz = points[faces[u*4+i] * 3 + 2]
            c.lineTo(
                ((cX*cY) * px + (cX*sY*sZ - sX*cZ) * py + (cX*sY*cZ + sX*sZ) * pz) * 37 + 302,
                ((sX*cY) * px + (sX*sY*sZ + cX*cZ) * py + (sX*sY*cZ - cX*sZ) * pz) * 37 + 222
            )
        }
        c.fillStyle = faces[u*4+3]
        c.fill()
    })

    bulvars.map((bulvar, index) => {
        c.fillStyle = '#2f8'
        // Spatial adjustment
        bulvar.x -= sX
        bulvar.y += cX
        // Travel distance
        bulvar.p += 4
        // Ray angle
        var bulX = bulvar.x + (Math.sin(bulvar.o) * bulvar.p)
        var bulY = bulvar.y + (Math.cos(bulvar.o) * bulvar.p)

        c.beginPath()
        c.arc(bulX, bulY, 8, 0, 180)
        c.fill()
        // Bullet/Monster collision detection
        monsters.map((monvar) => {
          var monX = monvar.x + (Math.sin(monvar.o) * monvar.p)
          var monY = monvar.y + (Math.cos(monvar.o) * monvar.p)
          if (
              Math.pow(
                Math.pow(bulX - monX,2) +
                Math.pow(bulY - monY,2)
              ,0.5) < 37
          ) monvar.p = 0xfff
          else {
            if (index == 0) {
                monvar.p -= 1
                c.beginPath()
                c.arc(monX, monY, 18, 0, 180)
                c.fill()
                if (monvar.p < 18 && !go) {
                    go=true
                    d.write('Game Over')
                }
            }
          }
        })
    })
}, 16)

onkeydown = (evt) => input[evt.keyCode] = 1
onkeyup = (evt) => {
    input[evt.keyCode] = 0
    if(evt.keyCode == 32) {
        bulvars.push({
            o: -(xRotation) + Math.PI,
            p: 32,
            x: 302,
            y: 222
        })
    }
}
