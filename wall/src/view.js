
import rects from './model'
import {e} from './index.js'

let cv = document.querySelector('#canvas')
let ct = cv.getContext('2d')

window.addEventListener('load', () => {
	cv.width  = window.innerWidth
	cv.height = window.innerHeight - 2
	rects.forEach(rect => {
		rect.img        = new Image()
		rect.img.onload = draw
		rect.img.src    = rect.src
	})
})

let last = null

export let draw = () => {
	ct.clearRect(0, 0, cv.width, cv.height)
	rects.concat().sort((a, b) => a.z - b.z).forEach(rect => {
		ct.save()
		roundedImage(rect.x, rect.y, rect.w, rect.h, 10)
		ct.shadowBlur    = 30
		ct.shadowOffsetX = 0
		ct.shadowOffsetY = 10
		ct.shadowColor   = 'rgba(0,0,0,.4)'
		ct.fillStyle = 'white'
		ct.fill()
		ct.clip()
		ct.drawImage(rect.img, rect.x, rect.y, rect.w, rect.h)
		ct.restore()
	})
	// send update
	if (new Date() - last > 100) {
		last = new Date()
		e.emit('update', canvas.toDataURL('image/jpeg', 0.8))
	}
}

let roundedImage = (x, y, w, h, r) => {
	ct.beginPath()
	ct.moveTo(x+r, y)
	ct.lineTo(x+w-r, y)
	ct.quadraticCurveTo(x+w, y, x+w, y+r)
	ct.lineTo(x+w, y+h-r)
	ct.quadraticCurveTo(x+w, y+h, x+w-r, y+h)
	ct.lineTo(x+r, y+h)
	ct.quadraticCurveTo(x, y+h, x, y+h-r)
	ct.lineTo(x, y+r)
	ct.quadraticCurveTo(x, y, x+r, y)
	ct.closePath()
}
