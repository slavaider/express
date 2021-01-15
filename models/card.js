const path = require('path')
const fs = require('fs')
const p = path.join(__dirname, '..', 'data', 'card.json')

class Card {
    static async add(new_course) {
        const card = await Card.fetch()
        const idx = card.courses.findIndex(c => c.id === new_course.id)
        const course = card.courses[idx]
        if (course) {
            course.count++
            card.courses[idx] = course
        } else {
            const newCourse = {...new_course}
            newCourse.count = 1
            card.courses.push(newCourse)
        }
        card.price += +new_course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), 'utf-8', (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const card = await Card.fetch()
        const idx = card.courses.findIndex(c => c.id === id)
        const course = card.courses[idx]
        if (course.count === 1) {
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            course.count--
            card.courses[idx] = course
        }
        card.price -= +course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), 'utf-8', (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) reject(err)
                resolve(JSON.parse(data))
            })
        })
    }
}

module.exports = Card;
